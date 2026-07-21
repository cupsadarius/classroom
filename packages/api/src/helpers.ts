import { classroomMembers, roles, userRoles, users } from "@classroom/db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { and, eq, inArray } from "drizzle-orm";
import type { Context } from "./trpc";

// Column set safe to return over the wire — never select passwordHash (#11 hardening).
export const publicUserColumns = {
  id: true,
  email: true,
  emailVerified: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  image: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

// Same whitelist, shaped for insert/update `.returning()` — mutations must never send
// passwordHash back over the wire either, not just list/byId reads.
export const userReturning = {
  id: users.id,
  email: users.email,
  emailVerified: users.emailVerified,
  firstName: users.firstName,
  lastName: users.lastName,
  phoneNumber: users.phoneNumber,
  image: users.image,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
  deletedAt: users.deletedAt,
};

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

// Inserts a user + assigns the given global roles (signup + admin create, #11).
export async function createUserWithRoles(
  ctx: Context,
  input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  },
  roleNames: Array<"admin" | "teacher" | "student">,
) {
  const existing = await ctx.db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (existing) {
    throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });
  }

  const passwordHash = await hashPassword(input.password);
  const [user] = await ctx.db
    .insert(users)
    .values({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phoneNumber: input.phoneNumber,
    })
    .returning(userReturning);

  const roleRows = await ctx.db.query.roles.findMany({ where: inArray(roles.name, roleNames) });
  if (user && roleRows.length) {
    await ctx.db.insert(userRoles).values(roleRows.map((r) => ({ userId: user.id, roleId: r.id })));
  }
  return user;
}

// Explicit per-classroom membership check (#7). Global roles gate procedures;
// this gates actions scoped to a single classroom.
export async function assertClassroomMember(
  ctx: Context,
  classroomId: string,
  role?: "teacher" | "student",
) {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  const membership = await ctx.db.query.classroomMembers.findFirst({
    where: and(
      eq(classroomMembers.classroomId, classroomId),
      eq(classroomMembers.userId, ctx.user.id),
    ),
  });

  if (!membership) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of this classroom" });
  }
  // teacher membership satisfies a student-level requirement.
  if (role === "teacher" && membership.memberRole !== "teacher") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Requires classroom teacher role" });
  }
  return membership;
}

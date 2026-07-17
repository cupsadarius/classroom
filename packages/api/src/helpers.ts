import { classroomMembers } from "@classroom/db";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import type { Context } from "./trpc";

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

import { users } from "@classroom/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createUserWithRoles, publicUserColumns, userReturning } from "../helpers";
import { adminProcedure, publicProcedure, router, studentProcedure, teacherProcedure } from "../trpc";

const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
});

const selfUpdateInput = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
});

// A teacher/student may edit only their own profile unless they're an admin (#11 hardening —
// legacy's role-only gate let any teacher edit any teacher record).
function assertSelfOrAdmin(ctx: { user: { id: string; roles: string[] } }, id: string) {
  if (ctx.user.id !== id && !ctx.user.roles.includes("admin")) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

// Legacy split: teachers list is student-gated, students list is teacher-gated
// (read gates mirror the legacy attendee controllers, #2 §1.3–1.4).
export const teacherRouter = router({
  list: studentProcedure.query(({ ctx }) =>
    ctx.db.query.users.findMany({ columns: publicUserColumns }),
  ),
  byId: studentProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) =>
      ctx.db.query.users.findFirst({ where: eq(users.id, input.id), columns: publicUserColumns }),
    ),

  // Public self-registration — sets [student, teacher] per legacy (#2 §1.3).
  signup: publicProcedure
    .input(signupInput)
    .mutation(({ ctx, input }) => createUserWithRoles(ctx, input, ["student", "teacher"])),

  update: teacherProcedure.input(selfUpdateInput).mutation(async ({ ctx, input }) => {
    assertSelfOrAdmin(ctx, input.id);
    const { id, ...fields } = input;
    const [updated] = await ctx.db
      .update(users)
      .set(fields)
      .where(eq(users.id, id))
      .returning(userReturning);
    if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
    return updated;
  }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, input.id))
        .returning();
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
      return { id: deleted.id };
    }),
});

export const studentRouter = router({
  list: teacherProcedure.query(({ ctx }) =>
    ctx.db.query.users.findMany({ columns: publicUserColumns }),
  ),
  byId: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) =>
      ctx.db.query.users.findFirst({ where: eq(users.id, input.id), columns: publicUserColumns }),
    ),

  // Public self-registration — sets [student] only (#2 §1.4).
  signup: publicProcedure
    .input(signupInput)
    .mutation(({ ctx, input }) => createUserWithRoles(ctx, input, ["student"])),

  update: studentProcedure.input(selfUpdateInput).mutation(async ({ ctx, input }) => {
    assertSelfOrAdmin(ctx, input.id);
    const { id, ...fields } = input;
    const [updated] = await ctx.db
      .update(users)
      .set(fields)
      .where(eq(users.id, id))
      .returning(userReturning);
    if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
    return updated;
  }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, input.id))
        .returning();
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
      return { id: deleted.id };
    }),
});

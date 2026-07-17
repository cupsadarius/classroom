import { users } from "@classroom/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { router, studentProcedure, teacherProcedure } from "../trpc";

// Legacy split: teachers list is student-gated, students list is teacher-gated
// (read gates mirror the legacy attendee controllers, #2 §1.3–1.4).
export const teacherRouter = router({
  list: studentProcedure.query(({ ctx }) => ctx.db.query.users.findMany()),
  byId: studentProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => ctx.db.query.users.findFirst({ where: eq(users.id, input.id) })),
});

export const studentRouter = router({
  list: teacherProcedure.query(({ ctx }) => ctx.db.query.users.findMany()),
  byId: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => ctx.db.query.users.findFirst({ where: eq(users.id, input.id) })),
});

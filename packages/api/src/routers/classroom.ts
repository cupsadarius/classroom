import { classrooms, sessions } from "@classroom/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { router, studentProcedure, teacherProcedure } from "../trpc";

// Gate map (#7): teacher → classrooms; student → sessions.
export const classroomRouter = router({
  list: teacherProcedure.query(({ ctx }) => ctx.db.query.classrooms.findMany()),
  byId: teacherProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input }) =>
    ctx.db.query.classrooms.findFirst({
      where: eq(classrooms.id, input.id),
      with: { members: true, sessions: true },
    }),
  ),
});

export const sessionRouter = router({
  list: studentProcedure.query(({ ctx }) => ctx.db.query.sessions.findMany()),
  byId: studentProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input }) =>
    ctx.db.query.sessions.findFirst({
      where: eq(sessions.id, input.id),
      with: { classroom: true, lesson: true },
    }),
  ),
});

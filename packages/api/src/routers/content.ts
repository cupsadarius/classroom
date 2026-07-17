import { categories, lessons } from "@classroom/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { router, teacherProcedure } from "../trpc";

// Gate map (#7): teacher → categories, lessons.
export const categoryRouter = router({
  list: teacherProcedure.query(({ ctx }) => ctx.db.query.categories.findMany()),
  byId: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) =>
      ctx.db.query.categories.findFirst({ where: eq(categories.id, input.id) }),
    ),
});

export const lessonRouter = router({
  list: teacherProcedure.query(({ ctx }) => ctx.db.query.lessons.findMany()),
  byId: teacherProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input }) =>
    ctx.db.query.lessons.findFirst({
      where: eq(lessons.id, input.id),
      with: { slides: true, category: true },
    }),
  ),
});

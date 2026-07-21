import { categories, lessons, slides } from "@classroom/db";
import { TRPCError } from "@trpc/server";
import { and, eq, notInArray } from "drizzle-orm";
import { z } from "zod";
import { router, teacherProcedure } from "../trpc";

// Validation min-lengths mirror legacy CategoryValidator/LessonValidator (#2 §1.5–1.6).
const nameFields = { name: z.string().min(3), description: z.string().min(3).optional() };

// Gate map (#7): teacher → categories, lessons.
export const categoryRouter = router({
  list: teacherProcedure.query(({ ctx }) => ctx.db.query.categories.findMany()),
  byId: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) =>
      ctx.db.query.categories.findFirst({ where: eq(categories.id, input.id) }),
    ),

  create: teacherProcedure.input(z.object(nameFields)).mutation(async ({ ctx, input }) => {
    const [created] = await ctx.db.insert(categories).values(input).returning();
    return created;
  }),

  update: teacherProcedure
    .input(z.object({ id: z.string().uuid(), ...nameFields }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;
      const [updated] = await ctx.db
        .update(categories)
        .set(fields)
        .where(eq(categories.id, id))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .update(categories)
        .set({ deletedAt: new Date() })
        .where(eq(categories.id, input.id))
        .returning();
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
      return { id: deleted.id };
    }),
});

const slideInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  path: z.string().optional(),
  type: z.enum(["image", "pdf"]).optional(),
  order: z.number().int().min(0),
});

const lessonFields = {
  title: z.string().min(3),
  description: z.string().min(3).optional(),
  categoryId: z.string().uuid().optional(),
};

export const lessonRouter = router({
  list: teacherProcedure.query(({ ctx }) =>
    ctx.db.query.lessons.findMany({ with: { category: true, slides: true } }),
  ),
  byId: teacherProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input }) =>
    ctx.db.query.lessons.findFirst({
      where: eq(lessons.id, input.id),
      with: { slides: true, category: true },
    }),
  ),

  create: teacherProcedure
    .input(z.object({ ...lessonFields, slides: z.array(slideInput).default([]) }))
    .mutation(async ({ ctx, input }) => {
      const { slides: incomingSlides, ...fields } = input;
      return ctx.db.transaction(async (tx) => {
        const [lesson] = await tx.insert(lessons).values(fields).returning();
        if (!lesson) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        if (incomingSlides.length) {
          await tx.insert(slides).values(incomingSlides.map((s) => ({ ...s, lessonId: lesson.id })));
        }
        return lesson;
      });
    }),

  // NB: legacy's lesson PUT was a stub that never persisted (#2 §1.6) — this actually updates.
  update: teacherProcedure
    .input(z.object({ id: z.string().uuid(), ...lessonFields, slides: z.array(slideInput).optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, slides: incomingSlides, ...fields } = input;
      return ctx.db.transaction(async (tx) => {
        const [updated] = await tx.update(lessons).set(fields).where(eq(lessons.id, id)).returning();
        if (!updated) throw new TRPCError({ code: "NOT_FOUND" });

        if (incomingSlides) {
          // Replace the ordered slide array wholesale: delete removed, update kept, insert new
          // (upload wiring deferred — the uploads-location fog item — `path`/`type` are plain fields).
          const keepIds = incomingSlides.filter((s) => s.id).map((s) => s.id as string);
          await tx.delete(slides).where(
            keepIds.length
              ? and(eq(slides.lessonId, id), notInArray(slides.id, keepIds))
              : eq(slides.lessonId, id),
          );
          for (const slide of incomingSlides) {
            if (slide.id) {
              await tx
                .update(slides)
                .set({ name: slide.name, path: slide.path, type: slide.type, order: slide.order })
                .where(eq(slides.id, slide.id));
            } else {
              await tx.insert(slides).values({ ...slide, lessonId: id });
            }
          }
        }
        return updated;
      });
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .update(lessons)
        .set({ deletedAt: new Date() })
        .where(eq(lessons.id, input.id))
        .returning();
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
      return { id: deleted.id };
    }),
});

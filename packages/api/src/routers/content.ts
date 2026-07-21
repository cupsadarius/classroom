import { categories, lessons, slides } from "@classroom/db";
import {
  ALLOWED_SLIDE_MIME,
  MAX_SLIDE_BYTES,
  createSlideUploadUrl,
  deleteSlideObject,
} from "@classroom/storage";
import { TRPCError } from "@trpc/server";
import { and, eq, notInArray } from "drizzle-orm";
import { z } from "zod";
import { withSlideUrls } from "../helpers";
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
  // `path` is the storage object key (#13), set by the client after a presigned PUT upload.
  path: z.string().optional(),
  type: z.literal("image").optional(),
  order: z.number().int().min(0),
});

const lessonFields = {
  title: z.string().min(3),
  description: z.string().min(3).optional(),
  categoryId: z.string().uuid().optional(),
};

export const lessonRouter = router({
  list: teacherProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.lessons.findMany({ with: { category: true, slides: true } });
    return Promise.all(rows.map(async (l) => ({ ...l, slides: await withSlideUrls(l.slides) })));
  }),
  byId: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const lesson = await ctx.db.query.lessons.findFirst({
        where: eq(lessons.id, input.id),
        with: { slides: true, category: true },
      });
      if (!lesson) return lesson;
      return { ...lesson, slides: await withSlideUrls(lesson.slides) };
    }),

  // Mint a presigned PUT so the browser can upload a slide image directly to storage (#13).
  // Images only; size is validated here against the client-declared byte count (presigned PUT
  // can't natively cap object size).
  createUploadUrl: teacherProcedure
    .input(
      z.object({
        contentType: z.enum(ALLOWED_SLIDE_MIME),
        size: z.number().int().positive().max(MAX_SLIDE_BYTES),
      }),
    )
    .mutation(({ input }) => createSlideUploadUrl(input.contentType)),

  create: teacherProcedure
    .input(z.object({ ...lessonFields, slides: z.array(slideInput).default([]) }))
    .mutation(async ({ ctx, input }) => {
      const { slides: incomingSlides, ...fields } = input;
      return ctx.db.transaction(async (tx) => {
        const [lesson] = await tx.insert(lessons).values(fields).returning();
        if (!lesson) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        if (incomingSlides.length) {
          await tx
            .insert(slides)
            .values(incomingSlides.map((s) => ({ ...s, lessonId: lesson.id })));
        }
        return lesson;
      });
    }),

  // NB: legacy's lesson PUT was a stub that never persisted (#2 §1.6) — this actually updates.
  update: teacherProcedure
    .input(
      z.object({ id: z.string().uuid(), ...lessonFields, slides: z.array(slideInput).optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, slides: incomingSlides, ...fields } = input;
      return ctx.db.transaction(async (tx) => {
        const [updated] = await tx
          .update(lessons)
          .set(fields)
          .where(eq(lessons.id, id))
          .returning();
        if (!updated) throw new TRPCError({ code: "NOT_FOUND" });

        if (incomingSlides) {
          // Replace the ordered slide array wholesale: delete removed, update kept, insert new.
          const keepIds = incomingSlides.filter((s) => s.id).map((s) => s.id as string);
          const removalWhere = keepIds.length
            ? and(eq(slides.lessonId, id), notInArray(slides.id, keepIds))
            : eq(slides.lessonId, id);

          // Delete-on-save (#13): reap the storage objects of slides being removed so the
          // bucket doesn't accumulate orphans. Fetch their keys before the row delete.
          const removed = await tx.select({ path: slides.path }).from(slides).where(removalWhere);
          await tx.delete(slides).where(removalWhere);
          for (const { path } of removed) {
            if (path) await deleteSlideObject(path).catch(() => {});
          }
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

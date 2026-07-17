import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { primaryId, softDelete, timestamps } from "./_shared";
import { slideTypeEnum } from "./enums";

export const categories = pgTable("categories", {
  id: primaryId(),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps,
  ...softDelete,
});

export const lessons = pgTable("lessons", {
  id: primaryId(),
  title: text("title").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id),
  ...timestamps,
  ...softDelete,
});

// Normalized out of the legacy embedded array on lessons.
export const slides = pgTable(
  "slides",
  {
    id: primaryId(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    name: text("name"),
    path: text("path"), // uploaded asset location — see uploads fog item
    type: slideTypeEnum("type"),
    order: integer("order").notNull(),
    ...timestamps,
    ...softDelete,
  },
  (t) => [index("slides_lesson_order_idx").on(t.lessonId, t.order)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  category: one(categories, {
    fields: [lessons.categoryId],
    references: [categories.id],
  }),
  slides: many(slides),
}));

export const slidesRelations = relations(slides, ({ one }) => ({
  lesson: one(lessons, { fields: [slides.lessonId], references: [lessons.id] }),
}));

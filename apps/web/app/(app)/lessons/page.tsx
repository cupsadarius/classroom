import { LessonCrud } from "@/components/lessons/lesson-crud";
import { createLesson, deleteLesson, updateLesson } from "@/lib/actions/lesson-actions";
import { getCaller } from "@/lib/trpc/server";

// Teacher-gated CRUD (#11, gate map #7) — actually persists updates, unlike legacy's stub PUT.
export default async function LessonsPage() {
  const caller = await getCaller();
  const [lessons, categories] = await Promise.all([
    caller.lesson.list(),
    caller.category.list(),
  ]);

  const rows = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description ?? undefined,
    categoryId: l.categoryId ?? undefined,
    categoryName: l.category?.name,
    slides: l.slides
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        id: s.id,
        name: s.name ?? undefined,
        path: s.path ?? undefined,
        type: s.type ?? undefined,
        order: s.order,
      })),
  }));

  return (
    <LessonCrud
      lessons={rows}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      createAction={createLesson}
      updateAction={updateLesson}
      deleteAction={deleteLesson}
    />
  );
}

import { auth } from "@classroom/auth";
import { SessionCrud } from "@/components/sessions/session-crud";
import { createSession, deleteSession, updateSession } from "@/lib/actions/session-actions";
import { getCaller } from "@/lib/trpc/server";

// Student-gated read, teacher-gated + classroom-membership-scoped mutations (#11, gate map #7).
// classroom.list/lesson.list are teacher-only, so a student-only viewer gets a read-only page.
export default async function SessionsPage() {
  const [session, caller] = await Promise.all([auth(), getCaller()]);
  const isTeacher = Boolean(
    session?.user.roles.some((r) => r === "teacher" || r === "admin"),
  );

  const [sessions, classrooms, lessons] = await Promise.all([
    caller.session.list(),
    isTeacher ? caller.classroom.list() : Promise.resolve([]),
    isTeacher ? caller.lesson.list() : Promise.resolve([]),
  ]);

  const classroomById = new Map(classrooms.map((c) => [c.id, c.name]));

  const rows = sessions.map((s) => ({
    id: s.id,
    classroomId: s.classroomId,
    classroomName: classroomById.get(s.classroomId) ?? s.classroomId,
    lessonId: s.lessonId ?? undefined,
    startDate: s.startDate?.toISOString(),
    endDate: s.endDate?.toISOString(),
  }));

  return (
    <SessionCrud
      sessions={rows}
      classrooms={classrooms.map((c) => ({ id: c.id, name: c.name }))}
      lessons={lessons.map((l) => ({ id: l.id, title: l.title }))}
      createAction={createSession}
      updateAction={updateSession}
      deleteAction={deleteSession}
      readOnly={!isTeacher}
    />
  );
}

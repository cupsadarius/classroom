import { auth } from "@classroom/auth";
import { notFound } from "next/navigation";
import { LiveSession } from "@/components/live-session/live-session";
import { getCaller } from "@/lib/trpc/server";

// Live virtual-classroom view (#12). `session.live` is membership-scoped (any role), unlike
// the teacher-only management endpoints — a student attending still needs slides + roster.
export default async function LiveSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [session, caller] = await Promise.all([auth(), getCaller()]);
  if (!session?.user) notFound();

  const live = await caller.session.live({ id }).catch(() => null);
  if (!live) notFound();

  const members = live.classroom.members.map((m) => ({
    userId: m.userId,
    name: `${m.user.firstName ?? ""} ${m.user.lastName ?? ""}`.trim() || m.user.email,
    role: m.memberRole,
  }));

  const isTeacher = members.some((m) => m.userId === session.user.id && m.role === "teacher");

  const slides = (live.lesson?.slides ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ id: s.id, name: s.name, url: s.url }));

  return (
    <LiveSession
      sessionId={id}
      lessonTitle={live.lesson?.title ?? "Untitled lesson"}
      slides={slides}
      members={members}
      currentUserName={session.user.name?.trim() || session.user.email || "You"}
      isTeacher={isTeacher}
    />
  );
}

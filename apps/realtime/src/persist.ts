import { events, db } from "@classroom/db";
import type { IncomingEvent } from "@classroom/realtime";
import { PersistenceLevel } from "@classroom/realtime";
import { desc, eq } from "drizzle-orm";

// Server-authoritative persistence (#6): assign the monotonic per-session
// revision inside a transaction. unique(session_id, revision) guards races;
// retry on conflict. Returns the stored row (with revision) for broadcast.
export async function persistEvent(params: {
  sessionId: string;
  slideId: string | null;
  userId: string;
  event: IncomingEvent;
}) {
  const { sessionId, slideId, userId, event } = params;

  // Bounded retry on the unique(revision) race.
  for (let attempt = 0; attempt < 5; attempt++) {
    const [latest] = await db
      .select({ revision: events.revision })
      .from(events)
      .where(eq(events.sessionId, sessionId))
      .orderBy(desc(events.revision))
      .limit(1);

    const revision = (latest?.revision ?? 0) + 1;

    try {
      const [row] = await db
        .insert(events)
        .values({
          sessionId,
          slideId,
          userId,
          revision,
          type: event.type as (typeof events.type.enumValues)[number],
          data: event.data,
          persistenceLevel: PersistenceLevel.PERSISTENT,
        })
        .returning();
      return row;
    } catch (err) {
      // conflict on (session_id, revision) → another writer won; recompute.
      if (attempt === 4) throw err;
    }
  }
  return null;
}

// Join replay: all events for the session ordered by revision.
export function loadSessionEvents(sessionId: string) {
  return db.query.events.findMany({
    where: eq(events.sessionId, sessionId),
    orderBy: (e, { asc }) => [asc(e.revision)],
  });
}

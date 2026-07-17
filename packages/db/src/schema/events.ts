import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { primaryId } from "./_shared";
import { sessions } from "./classrooms";
import { eventTypeEnum } from "./enums";
import { slides } from "./lessons";
import { users } from "./users";

// Append-only whiteboard/chat log — the drawing/chat source of truth (#5, #6).
// Hard-delete only (no soft-delete). Coordinates live on the 1000px base grid.
// Strict `data` payload shapes are owned by @classroom/realtime (zod contracts).
export const events = pgTable(
  "events",
  {
    id: primaryId(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    slideId: uuid("slide_id").references(() => slides.id), // null for chat
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    revision: integer("revision").notNull(), // monotonic per session
    type: eventTypeEnum("type").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    persistenceLevel: smallint("persistence_level").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique("events_session_revision_uq").on(t.sessionId, t.revision),
    index("events_session_slide_idx").on(t.sessionId, t.slideId),
  ],
);

export const eventsRelations = relations(events, ({ one }) => ({
  session: one(sessions, { fields: [events.sessionId], references: [sessions.id] }),
  slide: one(slides, { fields: [events.slideId], references: [slides.id] }),
  user: one(users, { fields: [events.userId], references: [users.id] }),
}));

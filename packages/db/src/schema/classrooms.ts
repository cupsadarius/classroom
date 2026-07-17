import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { primaryId, softDelete, timestamps } from "./_shared";
import { classroomRoleEnum } from "./enums";
import { lessons } from "./lessons";
import { users } from "./users";

export const classrooms = pgTable("classrooms", {
  id: primaryId(),
  name: text("name").notNull(),
  // legacy lastSessionId; self/forward ref to sessions (declared below).
  lastSessionId: uuid("last_session_id").references((): AnyPgColumn => sessions.id),
  ...timestamps,
  ...softDelete,
});

// Replaces legacy teachers[]/students[] arrays.
export const classroomMembers = pgTable(
  "classroom_members",
  {
    classroomId: uuid("classroom_id")
      .notNull()
      .references(() => classrooms.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    memberRole: classroomRoleEnum("member_role").notNull(),
  },
  (t) => [primaryKey({ columns: [t.classroomId, t.userId] })],
);

// A classroom meeting — NOT an auth session.
export const sessions = pgTable(
  "sessions",
  {
    id: primaryId(),
    classroomId: uuid("classroom_id")
      .notNull()
      .references(() => classrooms.id),
    lessonId: uuid("lesson_id").references(() => lessons.id),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    ...timestamps,
    ...softDelete,
  },
  (t) => [index("sessions_classroom_idx").on(t.classroomId)],
);

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  members: many(classroomMembers),
  sessions: many(sessions),
  lastSession: one(sessions, {
    fields: [classrooms.lastSessionId],
    references: [sessions.id],
  }),
}));

export const classroomMembersRelations = relations(classroomMembers, ({ one }) => ({
  classroom: one(classrooms, {
    fields: [classroomMembers.classroomId],
    references: [classrooms.id],
  }),
  user: one(users, {
    fields: [classroomMembers.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  classroom: one(classrooms, {
    fields: [sessions.classroomId],
    references: [classrooms.id],
  }),
  lesson: one(lessons, {
    fields: [sessions.lessonId],
    references: [lessons.id],
  }),
}));

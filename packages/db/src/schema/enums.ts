import { pgEnum } from "drizzle-orm/pg-core";

// Global capability grant (see CONTEXT.md — additive: teacher ⊇ student).
export const roleEnum = pgEnum("role", ["admin", "teacher", "student"]);

// Membership role scoped to a single classroom.
export const classroomRoleEnum = pgEnum("classroom_role", ["teacher", "student"]);

// Slide media kind (legacy Slide.type — confirm/extend during feature build-out).
export const slideTypeEnum = pgEnum("slide_type", ["image", "pdf"]);

// Only PERSISTENT event types are stored. participant_join / slide_change were
// ephemeral in legacy and are never persisted. text_drawing is out of scope.
export const eventTypeEnum = pgEnum("event_type", [
  "pencil_drawing",
  "eraser_drawing",
  "line_drawing",
  "rectangle_drawing",
  "outline_rectangle_drawing",
  "highlight_drawing",
  "chat_message",
]);

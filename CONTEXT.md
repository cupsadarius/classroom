# Classroom — domain context

Ubiquitous language for the revived Classroom e-learning platform. Use these terms exactly in code, issues, tests, and UI. Schema detail: `docs/design/domain-schema.md`.

## Glossary

- **User** — a person with an account. Has a profile (name, email, phone, image) and one or more **Roles**. Not split into separate student/teacher records; the distinction is role membership.
- **Role** — a global capability grant: **admin**, **teacher**, **student**. Additive — a teacher also holds student capabilities (legacy convention preserved). Held via the `user_roles` join.
- **Category** — a grouping for **Lessons** (name + description).
- **Lesson** — teachable material in a Category. Owns an ordered list of **Slides**.
- **Slide** — one page of a Lesson (name, uploaded asset `path`, type, order). The unit a whiteboard draws onto.
- **Classroom** — a persistent group: members (**teachers** and **students**) plus the **Sessions** held for it. Tracks its `lastSession`.
- **Classroom member** — a User's participation in a Classroom, with a **classroom role** (teacher or student) that is scoped to that Classroom (distinct from the global Role).
- **Session** — a single scheduled meeting of a Classroom against a Lesson (start/end dates). The live whiteboard runs per Session. **Not** an authentication session — that adapter table is `auth_sessions`.
- **Event** — an append-only record in a Session's log: a drawing stroke or a chat message. Carries a monotonic **revision** per Session, a `type`, and a JSON `data` payload. Replayed in revision order to late-joiners. Only **persistent** events are stored; ephemeral ones (participant-join, slide-change) are broadcast-only.
- **Drawing tools** — pencil, eraser, line, rectangle, rectangle-outline, highlight. Each emits a persistent Event. Coordinates live on a **1000px base grid**, scaled per client. (Text tool is out of scope.)
- **Attendee list** — the live roster of Users present in a Session, split into teachers and students.

## Terms we avoid

- "Student"/"Teacher" as **entity types** — there is one **User** entity; teacher/student is a **Role** (global) or **classroom role** (per-classroom membership).
- "Whiteboard event" vs "socket event" — say **Event** for the persisted domain record; call transport-level messages "socket messages" to avoid overload.

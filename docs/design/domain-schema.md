# Domain schema (Drizzle / Postgres)

Resolves wayfinder ticket #5. Grounded in the legacy inventory (#2, branch `research/legacy-inventory`).

## Decisions

- **Identity:** `uuid` primary keys, **UUID v7** (time-sortable → good index locality). Generated app-side (`drizzle` `$defaultFn`) or via a pg v7 function.
- **Drawing persistence:** keep the legacy **event-sourced log** — the `events` table is canonical persistence + join-replay, transport-agnostic. #6 picks the live transport and MAY layer a CRDT on top, but does not remove this table.
- **Slides:** **normalized** `slides` table (was embedded JSONB in legacy `lessons`).
- **Roles:** many-to-many **`user_roles`** join table (was additive `string[]`).
- **Relations:** legacy id-arrays (`classrooms.teachers/students/sessions`) → proper join tables / FKs.
- **Timestamps:** `createdAt` + `updatedAt` (`timestamptz`, default now) on every domain table.
- **Soft-delete:** `deletedAt timestamptz null` on domain entities (`users`, `categories`, `lessons`, `slides`, `classrooms`, `sessions`); the append-only `events` table is hard-only.
- **Auth tables:** the Auth.js Drizzle-adapter tables (`users`, `accounts`, `sessions_auth`, `verification_tokens`) — exact columns finalized in #7. Legacy `blacklist` is **dropped** (Auth.js session/JWT revocation replaces it). `users` merges the adapter's standard columns with our profile fields.
- **Naming:** `snake_case` columns, plural table names. NB: Auth.js's own `sessions` table is renamed **`auth_sessions`** to avoid colliding with the domain **`sessions`** (a classroom meeting).

## Enums

```
role            : admin | teacher | student
classroom_role  : teacher | student            -- membership role within a classroom
slide_type      : image | pdf | …              -- from legacy Slide.type (confirm during build)
event_type      : pencil_drawing | eraser_drawing | line_drawing |
                  rectangle_drawing | outline_rectangle_drawing |
                  highlight_drawing | chat_message
```
Only **PERSISTENT** event types are stored. `participant_join` and `slide_change` were EPHEMERAL in legacy → never persisted. `text_drawing` is **out of scope** (README future).

## Tables

### `users` (domain profile + Auth.js adapter base)
```
id            uuid pk (v7)
email         text unique not null
email_verified timestamptz null       -- Auth.js
first_name    text
last_name     text
phone_number  text null
image         text null               -- Auth.js (replaces Gravatar-by-email)
password_hash text null               -- only if #7 keeps credentials login; else unused
created_at / updated_at / deleted_at
```

### `roles` + `user_roles`
```
roles:       id uuid pk, name role unique
user_roles:  user_id uuid fk→users.id, role_id uuid fk→roles.id, pk(user_id, role_id)
```

### `categories`
```
id uuid pk, name text not null, description text, created_at/updated_at/deleted_at
```

### `lessons`
```
id uuid pk, title text not null, description text,
category_id uuid fk→categories.id,
created_at/updated_at/deleted_at
```

### `slides`  (normalized out of legacy embedded array)
```
id uuid pk, lesson_id uuid fk→lessons.id on delete cascade,
name text, path text,              -- path = uploaded asset location (see uploads fog item)
type slide_type, "order" int not null,
created_at/updated_at/deleted_at
index (lesson_id, "order")
```

### `classrooms`
```
id uuid pk, name text not null,
last_session_id uuid null fk→sessions.id,   -- legacy lastSessionId
created_at/updated_at/deleted_at
```

### `classroom_members`  (replaces teachers[]/students[] arrays)
```
classroom_id uuid fk→classrooms.id, user_id uuid fk→users.id,
member_role classroom_role not null,
pk(classroom_id, user_id)
```

### `sessions`  (a classroom meeting — NOT auth session)
```
id uuid pk,
classroom_id uuid fk→classrooms.id,          -- legacy classroom.sessions[] → FK here
lesson_id uuid fk→lessons.id,
start_date timestamptz, end_date timestamptz null,
created_at/updated_at/deleted_at
index (classroom_id)
```

### `events`  (append-only whiteboard/chat log — the drawing/chat source of truth)
```
id uuid pk (v7),
session_id uuid fk→sessions.id on delete cascade,
slide_id   uuid null fk→slides.id,           -- null for chat
user_id    uuid fk→users.id,
revision   int not null,                     -- monotonic per session
type       event_type not null,
data       jsonb not null,                   -- shape per type, below
persistence_level smallint not null,
created_at timestamptz default now()
unique (session_id, revision)                -- ordering + replay + late-joiner
index  (session_id, slide_id)
```

**`data` payloads by `type`** (from legacy `events/SocketEvents.js`):
| type | data |
|---|---|
| chat_message | `{ user: "First Last", message }` |
| pencil_drawing / eraser_drawing | `{ color, path: number[] }` |
| line_drawing | `{ color, coordinates: {fromX,fromY,toX,toY} }` |
| rectangle_drawing / outline_rectangle_drawing | `{ color, coordinates, filled: bool }` |
| highlight_drawing | `{ color, coordinates }` |

All coordinates are on the legacy **1000px base grid** (client scales by `pageWidth/1000`). Keep that normalization so stored events stay resolution-independent.

## Migration workflow

- `drizzle-kit generate` → SQL migrations checked into `packages/db/drizzle/`.
- `drizzle-kit migrate` on deploy; `drizzle-kit push` for local dev iteration.
- Seed script for roles (`admin`/`teacher`/`student`) + a dev admin user.

## Downstream notes

- **#6 (realtime):** consumes `events` (revision ordering, replay-on-join). If #6 adopts Liveblocks/Yjs for the live canvas, it snapshots back into `events` so persistence + parity stay here.
- **#7 (Auth.js):** owns the final adapter-table columns, the `password_hash`/credentials decision, and how `user_roles` feeds authorization. This spec only reserves the shape.
- **Uploads fog:** `slides.path` points at wherever the uploads decision lands (Blob/S3/local).

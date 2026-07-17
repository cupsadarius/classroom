# Legacy App Inventory — Features, Endpoints & Realtime Events

> Wayfinder research ticket #2. This is a **parity checklist**: an exhaustive, source-cited inventory of the legacy `api/`, `socket/`, and `web/` apps. Every claim cites a file path and line range. Later migration tickets are measured against this document.

## 0. System topology

Three services + RethinkDB, wired via Traefik (`docker-compose.yml`):

| Service | Build ctx | Internal host alias | Port | Role |
|---|---|---|---|---|
| `api` | `./api` | `api.classroom` / `api.classroom.dkr` | 80→3000 | REST API (Express + TypeScript) |
| `socket` | `./socket` | `socket.classroom` / `socket.classroom.dkr` | 80→3000 | Realtime whiteboard (socket.io + TypeScript) |
| `web` | `./web` | `classroom.dkr` | 80 | React/Flux SPA (jsx + Flow) |
| `rethinkdb` | image | `db.classroom` / `db.classroom.dkr` | 28015 | Shared datastore, DB name `classroom` |

- `docker-compose.yml:47-59` — api mounts a named volume `uploads:/usr/classroom/api/uploads`.
- Both api and socket share the **same** `classroom` RethinkDB database (`api/src/configs/params.ts:5-9`, `socket/src/configs/params.ts:4-10`) and the **same** JWT `SECRET` default (`averysecretstringhereusedforallkindsofstuff`).
- Frontend hardcodes hosts: `web/src/js/app/api/BaseApi.js:9-11` (`http://api.classroom.dkr`, version `v1`) and `web/src/js/app/api/SocketApi.js:6` (`http://socket.classroom.dkr`).

---

## 1. REST endpoints (`api/src`)

**Global middleware chain** (`api/src/configs/experss.ts:9-21`, applied in order): `morgan('dev')` logger → `bodyParser.json()` → `bodyParser.urlencoded({extended:false})` → static mounts (`/public`, `/assets`, `/modules`, `/classes`, `/interfaces`, `/docs`) → `cors`.

**CORS** (`api/src/middlewares/cors.ts:3-8`): `Access-Control-Allow-Origin: *`; methods `GET, POST, OPTIONS, PUT, DELETE`; allowed headers `Origin, X-Requested-With, x-access-token, Content-Type, Accept`. No preflight `OPTIONS` handler is registered.

**Auth middleware** (`api/src/middlewares/authenticated.ts:5-21`): reads token from `req.body.token || req.query.token || req.headers['x-access-token']`. If missing → 401 (but **does not `return`**, so execution continues — latent bug). Calls `authService.validate(token)`; on success sets `req.user`. Note: if `validate` resolves falsy (not throwing), `next()` is never called and the request hangs.

**Role middleware** (`api/src/middlewares/authorizedWithRole.ts:4-12`): passes if `req.user.roles` contains the given role, else 403. Roles are **hierarchical by convention only** — a teacher is given both `ROLE_STUDENT` and `ROLE_TEACHER` (see §5), so `authorizedWithRole('ROLE_STUDENT')` effectively means "any attendee".

**Upload middleware** (`api/src/middlewares/uploader.ts`): `multer.diskStorage`, dest `../../public/uploads`, filename `${Date.now()}-${originalname}`; limits `fileSize: 10 MB`, `files: 100`.

All routes are mounted under `/v1` (`api/src/server.ts:22`). Router prefixes: `api/src/configs/router.ts:16-24`.

Response envelopes: success = `{status:true, data}` (`helpers/SuccessResponse.ts`); error = `{status:false, data}` (`helpers/ErrorResponse.ts`, unwraps `.message` when present).

### 1.1 Auth (`controllers/authController.ts`, mounted at `/v1/`)

| Method | Path | Auth | Request body | Response | Source |
|---|---|---|---|---|---|
| POST | `/v1/authenticate` | none | `{username, password}` | 200 `{status,data:<jwt>}` / 401 error | `authController.ts:13-23` |
| GET | `/v1/current-user` | JWT + `ROLE_USER` | — (token header) | 200 `{status,data:<decoded user>}` | `authController.ts:25-33` |
| GET | `/v1/logout` | none (reads token) | — | blacklists token; **no success response body sent** (latent bug, only errors respond) | `authController.ts:35-43` |

### 1.2 Users (`controllers/userController.ts`, `/v1/user`) — all `ROLE_ADMIN`

| Method | Path | Auth | Request body | Response |
|---|---|---|---|---|
| GET | `/v1/user` | JWT+ADMIN | — | 200 `data: User[]` |
| POST | `/v1/user` | JWT+ADMIN | `{firstName,lastName,email,phoneNumber,password}` | 200 `data:<id>` |
| GET | `/v1/user/:id` | JWT+ADMIN | — | 200 `data: User` |
| PUT | `/v1/user/:id` | JWT+ADMIN | partial user fields | 200 `data: User` (sensitive stripped) |
| DELETE | `/v1/user/:id` | JWT+ADMIN | — | 200 `data:''` |

Source: `userController.ts:14-67`. Request field set confirmed by `web/.../api/UserApi.js:40-46`.

### 1.3 Attendees — Teachers (`controllers/teacherController.ts`, `/v1/attendee/teacher`)

| Method | Path | Auth | Request body | Response |
|---|---|---|---|---|
| GET | `/v1/attendee/teacher` | JWT+`ROLE_STUDENT` | — | 200 `data: Attendee[]` (teachers, admins filtered out) |
| POST | `/v1/attendee/teacher` | **none (public signup)** | `{firstName,lastName,email,phoneNumber,password}` | 201 `data:<id>` — sets roles `[ROLE_STUDENT,ROLE_TEACHER]` |
| GET | `/v1/attendee/teacher/:id` | JWT+`ROLE_STUDENT` | — | 200 `data: Attendee` |
| PUT | `/v1/attendee/teacher/:id` | JWT+`ROLE_TEACHER` | partial | 200 `data: Attendee` |
| DELETE | `/v1/attendee/teacher/:id` | JWT+`ROLE_ADMIN` | — | 200 `data:''` |

Source: `teacherController.ts:13-66`. `getAttendees(true)` filters out admins (`services/attendeeService.ts:41-54`).

### 1.4 Attendees — Students (`controllers/studentController.ts`, `/v1/attendee/student`)

| Method | Path | Auth | Request body | Response |
|---|---|---|---|---|
| GET | `/v1/attendee/student` | JWT+`ROLE_TEACHER` | — | 200 `data: Attendee[]` (teachers filtered out) |
| POST | `/v1/attendee/student` | **none (public signup)** | `{firstName,lastName,email,phoneNumber,password}` | 201 `data:<id>` — sets role `[ROLE_STUDENT]` |
| GET | `/v1/attendee/student/:id` | JWT+`ROLE_STUDENT` | — | 200 `data: Attendee` |
| PUT | `/v1/attendee/student/:id` | JWT+`ROLE_STUDENT` | partial | 200 `data: Attendee` |
| DELETE | `/v1/attendee/student/:id` | JWT+`ROLE_ADMIN` | — | 200 `data:''` |

Source: `studentController.ts:13-66`. NOTE: frontend delete for attendees actually hits `/v1/user/:id` (`web/.../api/AttendeeApi.js:107`), not these routes.

### 1.5 Categories (`controllers/categoryController.ts`, `/v1/category`)

| Method | Path | Auth | Request body | Response |
|---|---|---|---|---|
| GET | `/v1/category` | JWT+`ROLE_STUDENT` | — | 200 `data: Category[]` |
| POST | `/v1/category` | JWT+`ROLE_TEACHER` | `{name, description}` | 201 `data:<id>` |
| GET | `/v1/category/:id` | JWT+`ROLE_STUDENT` | — | 200 `data: Category` |
| PUT | `/v1/category/:id` | JWT+`ROLE_TEACHER` | `{name, description}` | 200 `data:<replaced/unchanged count>` |
| DELETE | `/v1/category/:id` | JWT+`ROLE_TEACHER` | — | 200 `data:''` |

Source: `categoryController.ts:14-69`. Validation: name & description each min length 3 (`validators/CategoryValidator.ts`).

### 1.6 Lessons (`controllers/lessonController.ts`, `/v1/lesson`)

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/v1/lesson` | JWT+`ROLE_STUDENT` | — | 200 `data: Lesson[]` (slides + category hydrated) |
| POST | `/v1/lesson` | JWT+`ROLE_TEACHER` + `upload.fields([{name:'slides',maxCount:10}])` | multipart: `title`, `description`, `categoryId`, files `slides` | 201 `data:<id>` |
| GET | `/v1/lesson/:id` | JWT+`ROLE_STUDENT` | — | 200 `data: Lesson` |
| PUT | `/v1/lesson/:id` | JWT+`ROLE_TEACHER` + `upload.any()` | multipart | **stub — returns literal `'update'`, no persistence** (`lessonController.ts:47-49`) |
| DELETE | `/v1/lesson/:id` | JWT+`ROLE_TEACHER` | — | 200 `data:''` |

Source: `lessonController.ts:14-60`. Upload→Slide conversion strips `/usr/classroom/api` prefix from stored path (`mappers/SlideMapper.ts:40-48`). PARITY RISK: `lessonService.update` (`services/lessonService.ts:44-60`) exists but is **not wired** to the PUT route; also it calls `repo.insert` not update. Validation: title/description min len 3, ≥1 slide, non-empty category (`validators/LessonValidator.ts`).

### 1.7 Sessions (`controllers/sessionController.ts`, `/v1/session`) — classroom-scoped

| Method | Path | Auth | Request body | Response |
|---|---|---|---|---|
| GET | `/v1/session/:classroomId` | JWT+`ROLE_STUDENT` | — | 200 `data: Session[]` (from the classroom's session list) |
| POST | `/v1/session/:classroomId` | JWT+`ROLE_TEACHER` | `{startDate, endDate, lessonId}` | 201 `data:<bool>` — also appends session to classroom |
| GET | `/v1/session/:classroomId/:id` | JWT+`ROLE_STUDENT` | — | 200 `data: Session` |
| PUT | `/v1/session/:classroomId/:id` | JWT+`ROLE_TEACHER` | `{startDate,endDate,lessonId}` | 200 `data:<count>` |
| DELETE | `/v1/session/:classroomId/:id` | JWT+`ROLE_TEACHER` | — | 200 `data:<deleted>` |

Source: `sessionController.ts:10-63`. Validation: `endDate > startDate`, non-empty lesson (`validators/SessionValidator.ts`). BUG: on delete, `removeSessionById(classroom.getId())` passes the classroom id, not the session id (`services/sessionService.ts:78`).

### 1.8 Classrooms (`controllers/classroomController.ts`, `/v1/classroom`)

| Method | Path | Auth | Request body | Response |
|---|---|---|---|---|
| GET | `/v1/classroom` | JWT+`ROLE_STUDENT` | — | 200 `data: Classroom[]` where user ∈ teachers or students |
| POST | `/v1/classroom` | JWT+`ROLE_TEACHER` | `{name,lastSessionId,students[],teachers[],sessions[]}` | 201 `data:<id>` |
| GET | `/v1/classroom/:id` | JWT+`ROLE_STUDENT` | — | 200 `data: Classroom` |
| PUT | `/v1/classroom/:id` | JWT+`ROLE_TEACHER` | classroom fields | 200 `data:<count>` |
| DELETE | `/v1/classroom/:id` | JWT+`ROLE_TEACHER` | — | 200 `data:''` |

Source: `classroomController.ts:13-66`. `getAllByAttendee` uses a RethinkDB `filter` predicate on `teachers`/`students` arrays (`services/classroomService.ts:14-22`). Validation: teachers list must be non-empty (`validators/ClassroomValidator.ts`). Request fields confirmed by `web/.../api/ClassroomApi.js:39-45`.

### 1.9 Default (`controllers/defaultController.ts`)

- GET `/v1/` → `{message:'Api entrypoint'}` (no auth).

**Endpoint count: 33 routes** (auth 3, user 5, teacher 5, student 5, category 5, lesson 5, session 5, classroom 5 — minus overlaps = 33 distinct method+path entries incl. default).

---

## 2. Socket layer (`socket/src`) & realtime model

### 2.1 Connection & handshake

- `socket/src/server.ts:9-35`: raw `http.createServer()` wrapped by `io(server)`. Single default namespace (`/`), **no socket.io rooms are used**.
- On `connection`, the server waits for an **`authentication`** event with `{token, sessionId, participantId}` (`server.ts:20-32`).
  - `authService.validate(token)` (`services/authService.ts:16-28`) — checks blacklist table + `jwt.verify` with shared SECRET. If invalid → `socket.disconnect(true)` (but code continues past it — latent bug).
  - `sessionManager.createSession(sessionId)` then `addParticipant(sessionId, participantId, socket)`.

### 2.2 Session/participant model (in-memory)

- `SessionManager` (`socket/src/sessionManager.ts`) holds an in-memory `sessions: Session[]`. Sessions are keyed by the REST session id. A session is created lazily on first join and **destroyed when the last participant disconnects** (`Session.removeParticipant`, `models/Session.ts:88-93`).
- `Session` (`socket/src/models/Session.ts`) tracks `participants[]`, a monotonically increasing `revision` counter, and `ephemeralStorage: Event[]`.

### 2.3 Socket events

**Received from client:**
| Event | Payload | Handler |
|---|---|---|
| `authentication` | `{token, sessionId, participantId}` | `server.ts:20` |
| `distribute` | an `Event` object (see §3) | `Session.handleDistributeEvent` (`models/Session.ts:44-48`) |
| `disconnect` | — | removes participant; closes session if empty (`models/Session.ts:83-93`) |

**Emitted to clients:**
| Event | Payload | When |
|---|---|---|
| `receive` | one `Event` | (a) replay of history/ephemeral on join (`getParticipantUpToDate`, `models/Session.ts:68-81`); (b) fan-out of each distributed event to **all** participants incl. sender (`emitToOthers`, `models/Session.ts:38-42`) |

Flow on a `distribute` (`models/Session.ts:44-66`): convert raw payload → `Event` via `EventMapper`; `saveEvent` sets the event's revision to the session's current revision, persists per persistence level, then increments the counter; finally `emitToOthers` broadcasts the event as `receive`.

### 2.4 Persistence levels (the durability model)

`PERSISTENCE_LEVEL` (`socket/src/models/Event.ts:4-8` = `web/.../models/Event.js:16-20`): `NONE=0`, `EPHEMERAL=1`, `PERSISTENT=2`.

- **PERSISTENT** → written to RethinkDB `events` table via `eventService.saveEvent` (`services/eventService.ts:8-15`).
- **EPHEMERAL** → kept only in the session's in-memory `ephemeralStorage[]`.
- **NONE** → logged, never stored.

On join, a participant is brought up to date by concatenating persisted events (`eventService.getBySessionId`, queried by `sessionId`) with in-memory ephemeral events, sorted by `revision`, each re-emitted as `receive` (`models/Session.ts:68-81`).

### 2.5 CRITICAL PARITY FINDING — no RethinkDB changefeeds

Despite the ticket framing, **realtime is NOT driven by RethinkDB changefeeds.** A repo-wide search for `.changes(` / `changefeed` returns **zero matches** in `api/`, `socket/`, and `web/`. The realtime mechanism is:

1. socket.io in-memory fan-out (`emitToOthers` loops over `participants[].socket.emit('receive', …)`).
2. RethinkDB `events` table used purely as an **append-only event store** for replay/catch-up, read via a one-shot `filter({sessionId})` query (`db/repositories/EventRepository.ts:19-26`) — never subscribed to.

Implications for migration:
- There is no cross-instance pub/sub. If the socket service is scaled to >1 replica, participants on different instances **cannot see each other's events** (fan-out is per-process memory). `scale.sh` exists in the repo, so this is a real risk.
- Session revision counters and ephemeral storage are per-process and lost on restart.
- Any target using changefeeds / Redis adapter / a message bus would be a behavior change, not a like-for-like port — but is likely required for correctness at scale.

---

## 3. Data model (RethinkDB)

Two schema registrations create tables at boot (idempotent `tableCreate`, default primary key `id`):
- **api** (`api/src/configs/rethink.ts:6-11`): `users`, `blacklist`, `lessons`, `categories`, `classrooms`, `sessions`.
- **socket** (`socket/src/configs/rethink.ts:6-8`): `users`, `blacklist`, `events`.
- Union of tables across the shared `classroom` DB: **`users`, `blacklist`, `lessons`, `categories`, `classrooms`, `sessions`, `events`** (7 tables).

### `users` (attendees + admins) — `mappings/UserMapping.ts`
`id, firstName, lastName, email, salt, password, phoneNumber, roles: string[]`.
- Password = HMAC-SHA1 of the plaintext keyed by a per-user 128-byte base64 `salt` (`api/src/services/authService.ts:15-22`).
- No `type` discriminator: teacher/student/admin distinguished solely by `roles` contents. Read paths strip `password`/`salt` before returning (`repositories/AttendeeRepository.ts:93-97`, `UserRepository.ts:54-58`).

### `blacklist` — revoked JWTs
Single field `{token}` (`services/authService.ts:51-57`). `validate` counts matches to reject revoked tokens.

### `categories` — `mappings/CategoryMapping.ts`
`id, name, description`.

### `lessons` — `mappings/LessonMapping.ts`
`id, title, description, categoryId (FK→categories.id), slides: SlideMapping[]`.
- **Slide** (embedded, `mappings/SlideMapping.ts`): `id, name, path, type, order`. `path` is a web path under `/public/uploads` (`SlideMapper.convertFromUploadData`).
- Category is stored by id and hydrated on read (`mappers/LessonMapper.ts:22-30`).

### `sessions` — `mappings/SessionMapping.ts`
`id, startDate, endDate, lessonId (FK→lessons.id)`. `id` is a client-independent uuid (`models/Session.ts:10-13`). Lesson hydrated on read (`mappers/SessionMapper.ts`).

### `classrooms` — `mappings/ClassroomMapping.ts`
`id, name, teachers: string[] (FK→users.id), students: string[] (FK→users.id), sessions: string[] (FK→sessions.id), lastSessionId`.
- Relations stored as arrays of ids; hydrated into full objects via `attendeeService.getByIds` / `sessionService.getByIds` (`mappers/ClassroomMapper.ts:8-23`).

### `events` (whiteboard/chat event store) — `socket/src/db/mappers/mappings/EventMapping.ts`
`id, sessionId (FK→sessions.id), slideId, userId (FK→users.id), revision: number, type: string, data: {…}, persistenceLevel: 0|1|2`.
- Only `PERSISTENT` events land here. `data` shape varies by `type` (see §4.3).

**Relationship summary:** `classrooms` ⟶ many `users` (teachers/students) & many `sessions`; `sessions` ⟶ one `lesson`; `lessons` ⟶ one `category` & many embedded slides; `events` ⟶ one `session`, one `user`, one `slide`.

---

## 4. Frontend (`web/src`)

Stack: React + `react-router` (v3, `browserHistory`), Facebook **Flux** dispatcher, jQuery AJAX, `socket.io-client`, Flow types, LESS. Entry `web/src/js/app.jsx` instantiates all APIs and stores at boot.

### 4.1 Routes / screens (`app.jsx:55-72`)

| Path | Component | Notes |
|---|---|---|
| `/` (IndexRoute) & `/login` | `LoginPage` | login |
| `/home` | `HomePage` | landing after login |
| `/session/:sessionId/:lessonId` | `Classroom` | the live whiteboard instance |
| `/management/users` | `UsersPage` | admin |
| `/management/teachers` | `TeachersPage` | admin |
| `/management/students` | `StudentsPage` | teacher |
| `/management/lessons` | `LessonsPage` | teacher |
| `/management/sessions` | `SessionsPage` | attendee |
| `/management/categories` | `CategoriesPage` | teacher |
| `/management/classrooms` | `ClassroomsPage` | teacher |
| all wrapped in `ContainerPage` | | shell (nav/sidebar) |

**Role-gated nav** (`components/Sidebar.jsx:20-36`): Users & Teachers links → `ROLE_ADMIN`; Students, Classrooms, Categories, Lessons → `ROLE_TEACHER`; Sessions → `ROLE_STUDENT`.

### 4.2 Flux architecture

- **Dispatcher**: singleton wrapping `flux.Dispatcher` (`dispatchers/FluxDispatcher.js`).
- **Stores** (`stores/`, all extend `BaseStore` which is an `EventEmitter`): `AuthStore`, `UserStore`, `CategoryStore`, `LessonStore`, `ClassroomStore`, `SessionStore`, `InstanceStore`, plus `MultiStore` (composes several stores for a component). Convention: an action with `className: 'XxxEvent'` is routed to store method `onXxxEvent`; the handler must `return true` to emit a change (`stores/BaseStore.js:74-87`).
- **Actions** (`actions/`, extend `BaseAction`): `AuthActions, UserActions, AttendeeActions, CategoriesActions, ClassroomActions, LessonActions, SessionActions, InstanceActions, SocketActions`. `trigger` dispatches async via `setTimeout(…,1)` (`actions/BaseAction.js:27-31`).
- **APIs** (`api/`): each API subclass is registered as a store so it reacts to dispatched action events and performs jQuery AJAX (all with `x-access-token` header), then dispatches result events. Base URLs in `api/BaseApi.js`.
- **Auth flow**: `AuthApi` POSTs `/authenticate` → on success stores token in `localStorage`, dispatches `LoginSuccessful` + `GetCurrentUser`; `AuthStore` persists `token`/`currentUser` to localStorage and redirects to `/home` (`stores/AuthStore.js`). 401s anywhere trigger `handleUnauthorizedErrorResponse`.

### 4.3 The Classroom instance — realtime board, chat, attendees

Container `pages/Classroom.jsx`: on mount calls `LessonActions.loadLessons()`, `SocketActions.connect(sessionId)`, then after 100 ms `SocketActions.participantJoined(...)`; on unmount `SocketActions.disconnect()`.

**`InstanceStore`** (`stores/InstanceStore.js`) holds the live board state: `{sessionId, teachers[], students[], chat[], slides[{id,drawings[],texts[]}], activeTab, activeSlide, activeTool, activeColor}`. It reacts to socket-delivered events:
- `ParticipantJoin` → dedupe, then push into `teachers` or `students` based on `roles` (lines 47-64).
- `ChatMessage` → push `{user, message}` into `chat` (70-78).
- `SlideChange` → `activeSlide += direction` (80-85).
- `Pencil/Eraser/Line/Rectangle/OutlineRectangle/Highlighter Drawing` → `addDrawing` appends `{...data, type}` onto the matching slide's `drawings[]` (101-143).
- Local UI actions `TabChangeEvent`, `ChangeColorEvent`, `ChangeToolEvent` (from `InstanceActions`).

**SocketApi** (`api/SocketApi.js`): `connect` emits `authentication`, subscribes to `receive`; `handleReceive` maps `event.type` → sets `className` and dispatches into Flux (switch at lines 30-81, one case per EVENT_TYPE). `emit` fills `userId` from localStorage and emits `distribute`.

**Event types** (`models/Event.js:3-14`): `participant-join, chat-message, slide-change, pencil-drawing, line-drawing, rectangle-drawing, eraser-drawing, outline-rectangle-drawing, text-drawing, highlight-drawing`. (`text-drawing` is defined but the Text tool is commented out — see below.)

**Event constructors & persistence** (`events/SocketEvents.js`):
| Class | type | persistence | data payload |
|---|---|---|---|
| `ParticipantJoin` | participant-join | EPHEMERAL | `{participant: User}` |
| `ChatMessage` | chat-message | PERSISTENT | `{user: "First Last", message}` |
| `SlideChange` | slide-change | EPHEMERAL | `{direction: 1\|-1}` |
| `PencilDrawing` | pencil-drawing | PERSISTENT | `{color, path: number[]}` |
| `EraserDrawing` | eraser-drawing | PERSISTENT | `{color, path: number[]}` |
| `LineDrawing` | line-drawing | PERSISTENT | `{color, coordinates:{fromX,fromY,toX,toY}}` |
| `RectangleDrawing` | rectangle-drawing / outline-rectangle-drawing | PERSISTENT | `{color, coordinates, filled}` (class/type swap on `filled`) |
| `HighlighterDrawing` | highlight-drawing | PERSISTENT | `{color, coordinates}` |

### 4.4 Drawing tools — exact behavior

Canvas setup (`components/instance/Whiteboard.jsx`): **two stacked canvases** — a committed `canvas` and an overlay `preDrawCanvas` that captures pointer events. Coordinates are normalized to a `BASE_PAGE_WIDTH = 1000` grid via `scaleFactor = pageWidth/1000` (`Board.jsx:10,94`): handlers divide by `scaleFactor` before emitting; `Whiteboard.draw*` multiply by it when rendering. Tool is chosen in `setHandlers` (`Whiteboard.jsx:83-113`). Toolbar buttons in `Board.jsx:108-121`: pencil, eraser, rectangle, rectangle-outline, line, highlight (Text button commented out at 118-119).

| Tool | Handler | Behavior |
|---|---|---|
| **pencil** | `PencilHandler.js` | `globalCompositeOperation='source-over'`, strokeStyle=color, `lineWidth=5`, `lineJoin=round`. mousedown begins path & records `[x,y]`; mousemove `lineTo`+`stroke`, appends points; mouseup: if only 1 point, duplicates it offset by -1 (so a dot renders), scales the whole `path` by `1/scaleFactor`, emits `addPencilDrawing`, clears the predraw canvas. |
| **eraser** | `EraserHandler.js` | Identical to pencil but `globalCompositeOperation='destination-out'` and `lineWidth=15`. Emits `addEraserDrawing`. Erasing = drawing transparent on the committed canvas. |
| **line** | `LineHandler.js` | strokeStyle=color, width 5. On mousemove: clears predraw, draws a **dashed** preview (`setLineDash([5,15])`) from start→current. mouseup: builds `{fromX,fromY,toX,toY}` scaled, resets dash, emits `addLineDrawing`. Committed render is solid (`Whiteboard.drawLine`). |
| **rectangle** (filled) | `RectangleHandler.js` (`filled=true`) | fillStyle=color. mousemove clears predraw and previews `fillRect(start → current)`. mouseup emits `addRectangleDrawing(...,filled=true)` → type `rectangle-drawing`. |
| **rectangle-outline** | `RectangleHandler.js` (`filled=false`) | Same but `strokeRect`. Emits `filled=false` → type `outline-rectangle-drawing`. |
| **highlight** | `HighlighterHandler.js` | Fixed translucent yellow `rgba(238,255,0,0.5)` (ignores active color), fixed band height `HIGHLIGHTER_HEIGHT≈20`. Start y is offset up by half the band; drags horizontally; previews a `fillRect` band. mouseup normalizes left/width, emits `addHighlighterDrawing` with the band color. **On the committed canvas it is re-rendered as a *filled rectangle*** (`Whiteboard.drawDrawings` maps HIGHLIGHT → `drawRectangle({...,filled:true})`, lines 246-249). |
| **text** | — | `text-drawing` type & `DRAWING_TYPES.TEXT` exist but the toolbar button and any TextHandler are commented out / absent. Not functional. |

Rendering (`Whiteboard.drawDrawings`, 220-257) replays `props.drawings` on the committed canvas in array order; `drawPencil` reconstructs from the point array (note: loop starts at index 4, effectively skipping the 2nd point), `drawLine`/`drawRectangle` from coordinates. There is **no per-drawing z-order beyond insertion order**, and erases are replayed as `destination-out` pencil strokes (order-sensitive).

### 4.5 Chat & Attendees (sidebar)

- **Chat** (`components/instance/Chat.jsx`): renders `chat[]` as `{name,text}`; textarea sends on Enter (keycode 13, no shift) via `props.addMessage` → `Classroom.sendMessage` → `SocketActions.sendChatMessage` (persistent event).
- **Attendees** (`components/instance/Attendees.jsx`): renders teachers/students with Gravatar avatars (`MD5.hash(email)`). Classroom sidebar has two tabs, `attendees` and `chat` (`Classroom.jsx:63-89`); teachers list always shown, students/chat toggled by `activeTab`.

---

## 5. Auth & role model

**JWT issuance** (`api/src/services/authService.ts`):
- `authenticate({username,password})`: loads user by email, compares HMAC-SHA1(salt, password) to stored hash; on match blanks password/salt and signs the **entire user object** as the JWT payload with `jwt.sign(user, SECRET, {expiresIn: 60*60*24*7})` — **7-day** expiry (lines 24-35, 63-67). The decoded token therefore *is* the user record incl. `roles`.
- **Verification** (`api/authenticated` middleware → `authService.validate`, and identically in `socket/src/services/authService.ts`): rejects if token is in the `blacklist` table, else `jwt.verify(token, SECRET)` and returns `jwt.decode(token)`. Both services use the same shared `SECRET`, so a token minted by the API is accepted by the socket server.
- **Logout**: inserts the token into `blacklist` (`authController.ts:35-43`).

**Roles** (`models/User.ts`, `models/Attendee.ts`):
- Base user always has `['ROLE_USER']` (`models/User.ts:14`).
- `setAsStudent()` adds `ROLE_STUDENT`; `setAsTeacher()` adds **both** `ROLE_STUDENT` and `ROLE_TEACHER` (`models/Attendee.ts:5-12`). Admins carry `ROLE_ADMIN` (assigned out-of-band; no signup path creates admins).
- Effective hierarchy via `authorizedWithRole`: `ROLE_USER` ⊂ `ROLE_STUDENT` ⊂ `ROLE_TEACHER`; `ROLE_ADMIN` is separate/superuser-by-convention. Because a teacher has `ROLE_STUDENT`, student-gated GET routes are open to teachers.

**Security notes / parity risks:**
- JWT payload contains the full user object; secret defaults to a hardcoded string; HMAC-SHA1 (not bcrypt/argon) for passwords.
- `authenticated` middleware does not `return` after sending 401 and does not `next()`/respond when `validate` returns falsy — requests can hang or double-respond.
- CORS is wide open (`*`).
- Public POST `attendee/teacher` and `attendee/student` allow **unauthenticated self-registration**, including teacher accounts.

---

## 6. Consolidated parity checklist (top risks)

1. **No changefeeds** — realtime is single-process socket.io fan-out + a RethinkDB event store used only for join-time replay. Multi-replica scaling is broken by design (§2.5).
2. **In-memory session state** — revision counters, ephemeral events, and participant lists live in process memory and are lost on restart (§2.2).
3. **Lesson PUT is a stub** returning `'update'`; the real update method is unwired and calls `insert` (§1.6).
4. **Session delete bug** passes classroom id where session id is expected (§1.7).
5. **Auth middleware control-flow bugs**; wide-open CORS; hardcoded shared secret; SHA1 passwords; unauthenticated teacher/student signup (§5).
6. **Highlighter** persists as `highlight-drawing` but renders as a filled rectangle; **Text** tool is defined but disabled (§4.4).
7. Frontend attendee-delete calls `/user/:id` regardless of role, bypassing the attendee controllers (§1.4).
8. Hosts/URLs are hardcoded to `*.classroom.dkr` in the SPA (§0).

---

_Sources: `api/src/**`, `socket/src/**`, `web/src/js/app/**`, `docker-compose.yml`. Line references are from the repo state at ticket #2._

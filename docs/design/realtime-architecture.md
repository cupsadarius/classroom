# Realtime architecture

Resolves wayfinder ticket #6. Builds on the options research (#4, branch `research/realtime-options`) and the domain schema (#5, `events` table).

## Decisions

- **Transport:** **self-hosted Socket.IO v4** as a long-lived Node service in **`apps/realtime`** (the slot reserved by #3). Closest port of the legacy socket server; full control, no per-message vendor cost.
- **Drawing model:** **broadcast + event-log** (parity). Each stroke is an Event broadcast to the session and appended to `events`; strokes are additive so no conflict resolution is needed. No CRDT.
- **Persistence:** **server-authoritative**. The socket server validates each incoming event, assigns the monotonic per-session `revision`, writes PERSISTENT events to `events`, then broadcasts.
- **Rooms:** **one room per session** (`session:<sessionId>`) — fixes the legacy "single default namespace, broadcast to everyone" limitation and enables horizontal scale.
- **Scale:** **`@socket.io/redis-adapter` + Redis**, sticky sessions at the load balancer. Fixes the legacy single-process cap (in-memory state lost past one replica).

## New dependencies / layout additions (feed #8 scaffold)

- **`apps/realtime`** — the Socket.IO server. Depends on `@classroom/db` (writes), `@classroom/auth` (session verify), `@classroom/realtime` (contracts).
- **`packages/realtime`** — shared event **contracts**: TypeScript types + zod schemas for every event `type` and its `data` payload, imported by both `apps/web` (client) and `apps/realtime` (server). Single source of truth for the wire format.
- **Redis** — new infra dependency (adapter + optional revision counter). Add to dev `docker-compose.yml`.

## Connection & auth

- Client connects: `io(REALTIME_URL, { auth: { token }, query: { sessionId } })`.
- Server `io.use(middleware)` verifies the **Auth.js session** via `@classroom/auth` (see the note filed on #7 — the session strategy must be verifiable by this standalone service; a JWT-strategy session verified with the shared secret is the clean fit, else a DB session lookup through `@classroom/db`).
- On success: load the user + roles, join `session:<sessionId>`, register presence.

## Event flow

```
client --emit "distribute" {type, slideId?, data, persistenceLevel}--> server
server:
  1. validate payload against packages/realtime zod schema for `type`
  2. authorize (role/membership for this session)
  3. if PERSISTENT:
        tx: revision = coalesce(max(revision) for session, 0) + 1
            insert into events(...)          -- unique(session_id, revision) guards races; retry on conflict
  4. io.to("session:<sessionId>").emit("receive", event)   -- includes assigned revision
```

- **Persistent** (`chat_message`, all `*_drawing`) → written + broadcast.
- **Ephemeral** (`participant_join`, `slide_change`) → broadcast only, never written (parity).
- **Join replay:** on join, server queries `events` for the session ordered by `revision` and sends them to the joining socket only; then broadcasts `participant_join` + emits the current attendee roster.
- **Presence / attendee list:** derived from room membership; disconnect broadcasts a leave. (Replaces legacy in-memory `InstanceStore` roster.)
- **Coordinates:** keep the **1000px base grid** normalization — events store resolution-independent coords; the client scales on render (unchanged from legacy).

## Known parity gap (noted, not blocking)

Legacy `slide_change` was ephemeral (a `direction` delta), so a **late-joiner doesn't learn the current active slide** from replay. Legacy had the same gap. If we want to close it, add a tiny per-session `active_slide` state (a column on `sessions` or a Redis key) updated on each `slide_change`. Deferred — flagged for the feature build-out.

## Deployment implication (feeds deploy fog)

`apps/realtime` is a **long-lived process** — it cannot run on serverless Functions. It needs a persistent host (Railway / Render / Fly.io / a VM) plus Redis. This is a new constraint on the (still-fogged) hosting/CI-CD decision, alongside the prod Postgres host.

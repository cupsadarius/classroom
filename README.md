# Classroom

An e-learning platform with a management back office and a real-time virtual classroom — a legacy Express/RethinkDB/React app rebuilt as a Turborepo monorepo on Next.js, Postgres, and tRPC.

## Features

**Management platform** — CRUD for students, teachers, lesson categories, lessons (with ordered, image-uploaded slides), classrooms, and sessions.

**Virtual classroom (real-time)** — live session view with an attendee roster, chat, teacher-driven lesson navigation, and a shared whiteboard (pencil, line, rectangle, rectangle outline, highlight, eraser) drawn over the slide image.

## Stack

- **Monorepo** — [Turborepo](https://turbo.build) + [pnpm](https://pnpm.io) workspaces, Node 22
- **Web** — [Next.js](https://nextjs.org) (App Router), [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com) v4
- **API** — [tRPC](https://trpc.io) with role- and membership-gated procedures
- **Data** — [Drizzle ORM](https://orm.drizzle.team) over Postgres
- **Auth** — [Auth.js](https://authjs.dev) (NextAuth v5), credentials + JWT sessions
- **Real-time** — [Socket.IO](https://socket.io) server (`apps/realtime`) with a Redis adapter, backed by an event-sourced log
- **Storage** — S3-compatible object storage (MinIO in dev) for slide images
- **Tooling** — [Biome](https://biomejs.dev) (lint + format)

### Layout

```
apps/
  web/        Next.js app (:3000)
  realtime/   Socket.IO server (:4000)
packages/
  api/        tRPC routers + context
  auth/       Auth.js config + token helpers
  config/     shared tsconfig bases
  db/         Drizzle schema, migrations, seed
  realtime/   shared realtime event contracts
  storage/    S3 client + presigned upload/view helpers
  ui/         shadcn/ui component library + theme
```

## Getting started

**Prerequisites:** Node ≥ 22, pnpm 9, Docker (for Postgres, Redis, and MinIO).

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
#    then set AUTH_SECRET:  openssl rand -base64 32

# 3. Start infrastructure (Postgres + Redis + MinIO)
docker compose up -d

# 4. Apply migrations and seed a dev admin
pnpm db:migrate
pnpm db:seed        # creates admin@classroom.dev / admin

# 5. Run the app (web + realtime)
pnpm dev
```

Then open http://localhost:3000 and sign in with the seeded admin. The MinIO console is at http://localhost:9001.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run web + realtime in watch mode |
| `pnpm build` | Build all packages and apps |
| `pnpm typecheck` | Type-check the whole workspace |
| `pnpm lint` | Biome lint + format check |
| `pnpm format` | Biome format (write) |
| `pnpm db:generate` | Generate a Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:seed` | Seed the dev admin user |

## Design

The UI follows an Audible-inspired design language — a single orange CTA voltage over a midnight dark theme (and a light theme). The full token spec lives in [`DESIGN.md`](./DESIGN.md).

## Future improvements

- Text drawing tool
- Video and audio chat (likely WebRTC, alongside the existing socket server)

---

The retired legacy app is preserved under [`legacy/`](./legacy) for reference.

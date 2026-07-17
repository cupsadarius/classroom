# Auth.js integration & role model

Resolves wayfinder ticket #7. Builds on #2 (legacy auth), #5 (`users`/`user_roles`), #6 (socket-server session verification).

## Decisions

- **Provider:** **Credentials** only (email + password) — parity with legacy. No OAuth for now.
- **Session strategy:** **JWT** (required by the Credentials provider; DB sessions are unsupported with credentials). Also satisfies #6 — the standalone socket server verifies the token with the shared secret, no DB round-trip.
- **Password hashing:** **bcrypt** (cost ≥ 12). Replaces legacy HMAC-SHA1.
- **Authorization:** **role-gated tRPC procedures** built from `user_roles`, plus explicit per-classroom membership checks.
- **Secret:** single `AUTH_SECRET` env var (replaces the legacy hardcoded SECRET), shared with `apps/realtime`.
- **Token lifetime:** 7 days (legacy parity); sliding refresh via Auth.js default.

## Auth.js config (`packages/auth`)

```ts
// credentials-only + JWT: the adapter is NOT required for session storage.
// We own users/roles in @classroom/db and load them in authorize().
export const authConfig = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize({ email, password }) {
        const user = await db.query.users.findFirst({ where: eq(users.email, email), with: { roles: true } })
        if (!user?.passwordHash) return null
        if (!(await bcrypt.compare(password, user.passwordHash))) return null
        return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, roles: user.roles.map(r => r.name) }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) { if (user) { token.id = user.id; token.roles = user.roles } return token },
    session({ session, token }) { session.user.id = token.id; session.user.roles = token.roles; return session },
  },
}
```

Route handler: `apps/web/app/api/auth/[...nextauth]/route.ts` re-exports `handlers` from `@classroom/auth`.

## Socket-server verification (#6)

`apps/realtime` cannot call `auth()` (no Next.js request). Auth.js v5 encrypts the session token (JWE) with `AUTH_SECRET`. `@classroom/auth` exposes a shared:

```ts
export async function verifySessionToken(token: string) // wraps `decode` from "@auth/core/jwt"
```

used by both the web middleware and the socket handshake middleware. **Build-time confirm:** v5 `decode` needs `{ token, secret, salt }` where `salt` = the session cookie name (`authjs.session-token` / `__Secure-…`); pin this so both sides agree.

## Role model

- Roles from `user_roles`: `admin`, `teacher`, `student`, **additive** (teacher ⊇ student, per legacy).
- tRPC middleware:
  - `protectedProcedure` — requires a session.
  - `roleProcedure(role)` factory → `adminProcedure`, `teacherProcedure`, `studentProcedure`; a higher role satisfies a lower gate.
  - `assertClassroomMember(ctx, classroomId, role?)` — explicit `classroom_members` check for per-classroom actions.
- Gate map (mirrors legacy `Sidebar` — #2 §4.1): admin → users, teachers; teacher → students, classrooms, categories, lessons; student → sessions.

## Consequences

- **#5 schema:** with credentials-only + JWT, the Auth.js **adapter tables** (`accounts`, `auth_sessions`, `verification_tokens`) are **unused** — omit them from the initial migration; keep `users` + `user_roles`. Add the adapter tables back only if OAuth is introduced. (Follow-up note filed on #5.)
- **#8 scaffold:** `packages/auth` needs `bcrypt` + `next-auth`(v5); `AUTH_SECRET` in env; the `[...nextauth]` route handler; the shared `verifySessionToken` helper consumed by `apps/realtime`.
- **Legacy password migration:** HMAC-SHA1 hashes can't be converted to bcrypt (no plaintext). Legacy users must reset passwords or be re-created — ties into the (fogged) legacy-data-migration question; dev data is likely disposable.

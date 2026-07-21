import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { verifyRealtimeToken } from "@classroom/auth/verify";
import { classroomMembers, db, sessions as sessionsTable } from "@classroom/db";
import {
  SOCKET_EVENTS,
  distributeMessage,
  isPersistentType,
  sessionRoom,
} from "@classroom/realtime";
import { createAdapter } from "@socket.io/redis-adapter";
import { config as loadEnv } from "dotenv";
import { and, eq } from "drizzle-orm";
import { createClient } from "redis";

// Load the monorepo-root .env (shared with apps/web and drizzle).
loadEnv({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });
import { Server } from "socket.io";
import { loadSessionEvents, persistEvent } from "./persist";

const PORT = Number(process.env.REALTIME_PORT ?? 4000);
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

async function main() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    // Never fall back to "*" (#6/#12 hardening) — dev pins to the web app's own origin.
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000" },
  });

  // Redis adapter for horizontal scale (fixes legacy single-process cap).
  const pub = createClient({ url: REDIS_URL });
  const sub = pub.duplicate();
  await Promise.all([pub.connect(), sub.connect()]);
  io.adapter(createAdapter(pub, sub));

  // Auth handshake: verify the Auth.js JWT, then authorize against classroom membership
  // (#6/#12 hardening — this previously trusted any valid token for any sessionId).
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      const sessionId = socket.handshake.query?.sessionId as string | undefined;
      if (!token || !sessionId) {
        console.warn("[realtime] reject: missing token or sessionId", { hasToken: !!token, sessionId });
        return next(new Error("missing token or sessionId"));
      }

      const claims = await verifyRealtimeToken(token);
      if (!claims) {
        console.warn("[realtime] reject: invalid session token");
        return next(new Error("invalid session"));
      }

      const session = await db.query.sessions.findFirst({ where: eq(sessionsTable.id, sessionId) });
      if (!session) {
        console.warn("[realtime] reject: session not found", sessionId);
        return next(new Error("session not found"));
      }

      const membership = await db.query.classroomMembers.findFirst({
        where: and(
          eq(classroomMembers.classroomId, session.classroomId),
          eq(classroomMembers.userId, claims.id),
        ),
      });
      if (!membership) {
        console.warn("[realtime] reject: not a member", { classroomId: session.classroomId, userId: claims.id });
        return next(new Error("not a member of this session's classroom"));
      }

      socket.data.user = claims;
      socket.data.sessionId = sessionId;
      socket.data.memberRole = membership.memberRole;
      next();
    } catch (err) {
      console.error("[realtime] handshake error", err);
      next(err as Error);
    }
  });

  io.on("connection", async (socket) => {
    const sessionId = socket.data.sessionId as string;
    const user = socket.data.user as { id: string; name?: string | null; email?: string | null };
    const displayName = user.name || user.email || "Unknown";
    const memberRole = socket.data.memberRole as "teacher" | "student";
    const room = sessionRoom(sessionId);
    await socket.join(room);

    // Replay the persisted log to the joining socket only, in revision order.
    const history = await loadSessionEvents(sessionId);
    socket.emit(SOCKET_EVENTS.REPLAY, history);

    // Presence: tell the joiner who's already here (join/leave deltas alone can't — #12),
    // then announce the join to everyone else (ephemeral — never persisted).
    const peers = await io.in(room).fetchSockets();
    const onlineUserIds = peers
      .map((peer) => (peer.data.user as { id: string }).id)
      .filter((id) => id !== user.id);
    socket.emit(SOCKET_EVENTS.ROSTER, { type: "snapshot", userIds: onlineUserIds });
    socket.to(room).emit(SOCKET_EVENTS.ROSTER, { type: "join", userId: user.id });

    socket.on(SOCKET_EVENTS.DISTRIBUTE, async (raw, ack?: (ok: boolean) => void) => {
      const parsed = distributeMessage.safeParse(raw);
      if (!parsed.success) {
        ack?.(false);
        return;
      }
      const msg = parsed.data;
      const slideId = "slideId" in msg ? (msg.slideId ?? null) : null;

      // Session membership is already authorized at the handshake (io.use); the one extra
      // per-message rule is that only the classroom teacher drives lesson navigation.
      if (msg.type === "slide_change" && memberRole !== "teacher") {
        ack?.(false);
        return;
      }

      // Never trust a client-supplied display name (identity spoofing, caught by security
      // review) — chat_message.data.user is always overwritten with the verified session name.
      if (msg.type === "chat_message") {
        msg.data.user = displayName;
      }

      if (isPersistentType(msg.type)) {
        const row = await persistEvent({
          sessionId,
          slideId,
          userId: user.id,
          event: msg,
        });
        if (row) io.to(room).emit(SOCKET_EVENTS.RECEIVE, row);
        ack?.(!!row);
      } else {
        // Ephemeral (slide_change) → broadcast only.
        io.to(room).emit(SOCKET_EVENTS.RECEIVE, { ...msg, sessionId });
        ack?.(true);
      }
    });

    socket.on("disconnect", () => {
      socket.to(room).emit(SOCKET_EVENTS.ROSTER, { type: "leave", userId: user.id });
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`[realtime] Socket.IO server listening on :${PORT}`);
  });
}

main().catch((err) => {
  console.error("[realtime] fatal", err);
  process.exit(1);
});

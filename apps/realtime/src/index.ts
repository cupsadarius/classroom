import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { verifySessionToken } from "@classroom/auth/verify";
import {
  SOCKET_EVENTS,
  distributeMessage,
  isPersistentType,
  sessionRoom,
} from "@classroom/realtime";
import { createAdapter } from "@socket.io/redis-adapter";
import { config as loadEnv } from "dotenv";
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
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL ?? "*" },
  });

  // Redis adapter for horizontal scale (fixes legacy single-process cap).
  const pub = createClient({ url: REDIS_URL });
  const sub = pub.duplicate();
  await Promise.all([pub.connect(), sub.connect()]);
  io.adapter(createAdapter(pub, sub));

  // Auth handshake: verify the Auth.js JWT with the shared AUTH_SECRET.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      const sessionId = socket.handshake.query?.sessionId as string | undefined;
      if (!token || !sessionId) return next(new Error("missing token or sessionId"));

      const claims = await verifySessionToken(token);
      if (!claims) return next(new Error("invalid session"));

      socket.data.user = claims;
      socket.data.sessionId = sessionId;
      next();
    } catch (err) {
      next(err as Error);
    }
  });

  io.on("connection", async (socket) => {
    const sessionId = socket.data.sessionId as string;
    const user = socket.data.user as { id: string; name?: string | null };
    const room = sessionRoom(sessionId);
    await socket.join(room);

    // Replay the persisted log to the joining socket only, in revision order.
    const history = await loadSessionEvents(sessionId);
    socket.emit(SOCKET_EVENTS.REPLAY, history);

    // Presence: announce join (ephemeral — never persisted).
    socket.to(room).emit(SOCKET_EVENTS.ROSTER, { type: "join", userId: user.id });

    socket.on(SOCKET_EVENTS.DISTRIBUTE, async (raw, ack?: (ok: boolean) => void) => {
      const parsed = distributeMessage.safeParse(raw);
      if (!parsed.success) {
        ack?.(false);
        return;
      }
      const msg = parsed.data;
      const slideId = "slideId" in msg ? (msg.slideId ?? null) : null;

      // TODO(feature build-out): authorize per role/membership for this session.

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

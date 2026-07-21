"use client";

import type {
  BroadcastEvent,
  DistributeMessage,
  RosterMessage,
} from "@classroom/realtime";
import { SOCKET_EVENTS } from "@classroom/realtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getRealtimeToken } from "@/lib/actions/realtime-token";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

// Ephemeral `slide_change` arrives on the same RECEIVE channel as persistent events, but
// isn't shaped like a BroadcastEvent (no id/revision/createdAt) — see packages/realtime.
type SlideChangeReceive = { type: "slide_change"; data: { direction: number }; sessionId: string };

// Connects to apps/realtime for one classroom session (#12): replay on join, live event
// stream, and roster presence. Slide position is a local, non-persisted index — late joiners
// always start at slide 0, matching the deferred parity gap the #6 design doc calls out.
export function useLiveSession(sessionId: string) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [events, setEvents] = useState<BroadcastEvent[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [online, setOnline] = useState<ReadonlySet<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;
    let socket: Socket | undefined;

    (async () => {
      const token = await getRealtimeToken();
      if (cancelled) return;
      if (!token) {
        setStatus("error");
        return;
      }

      socket = io(process.env.NEXT_PUBLIC_REALTIME_URL, {
        auth: { token },
        query: { sessionId },
      });
      socketRef.current = socket;

      socket.on("connect", () => setStatus("connected"));
      socket.on("disconnect", () => setStatus("disconnected"));
      socket.on("connect_error", () => setStatus("error"));

      socket.on(SOCKET_EVENTS.REPLAY, (history: BroadcastEvent[]) => {
        setEvents(history);
      });

      socket.on(SOCKET_EVENTS.RECEIVE, (msg: BroadcastEvent | SlideChangeReceive) => {
        if (msg.type === "slide_change") {
          setSlideIndex((i) => Math.max(0, i + msg.data.direction));
          return;
        }
        setEvents((prev) => [...prev, msg]);
      });

      socket.on(SOCKET_EVENTS.ROSTER, (msg: RosterMessage) => {
        setOnline((prev) => {
          if (msg.type === "snapshot") return new Set(msg.userIds);
          const next = new Set(prev);
          if (msg.type === "join") next.add(msg.userId);
          else next.delete(msg.userId);
          return next;
        });
      });
    })();

    return () => {
      cancelled = true;
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [sessionId]);

  const emit = useCallback((msg: DistributeMessage) => {
    socketRef.current?.emit(SOCKET_EVENTS.DISTRIBUTE, msg);
  }, []);

  return { status, events, slideIndex, online, emit };
}

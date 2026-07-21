import { z } from "zod";

// ---------------------------------------------------------------------------
// Persistence levels (legacy events/SocketEvents.js parity).
// PERSISTENT events are written to `events`; EPHEMERAL are broadcast-only.
// ---------------------------------------------------------------------------
export const PersistenceLevel = {
  EPHEMERAL: 0,
  PERSISTENT: 1,
} as const;
export type PersistenceLevel = (typeof PersistenceLevel)[keyof typeof PersistenceLevel];

// All coordinates are on the legacy 1000px base grid (client scales on render).
const coordinates = z.object({
  fromX: z.number(),
  fromY: z.number(),
  toX: z.number(),
  toY: z.number(),
});

// ---------------------------------------------------------------------------
// Persistent event payloads — one schema per stored event `type` (#5 data map).
// ---------------------------------------------------------------------------
export const chatMessageData = z.object({
  user: z.string(), // "First Last"
  message: z.string(),
});

const strokePathData = z.object({
  color: z.string(),
  path: z.array(z.number()),
});

const lineData = z.object({
  color: z.string(),
  coordinates,
});

const rectangleData = z.object({
  color: z.string(),
  coordinates,
  filled: z.boolean(),
});

const highlightData = z.object({
  color: z.string(),
  coordinates,
});

export const persistentEvent = z.discriminatedUnion("type", [
  z.object({ type: z.literal("chat_message"), data: chatMessageData }),
  z.object({ type: z.literal("pencil_drawing"), data: strokePathData }),
  z.object({ type: z.literal("eraser_drawing"), data: strokePathData }),
  z.object({ type: z.literal("line_drawing"), data: lineData }),
  z.object({ type: z.literal("rectangle_drawing"), data: rectangleData }),
  z.object({ type: z.literal("outline_rectangle_drawing"), data: rectangleData }),
  z.object({ type: z.literal("highlight_drawing"), data: highlightData }),
]);
export type PersistentEvent = z.infer<typeof persistentEvent>;
export type EventType = PersistentEvent["type"];

// Ephemeral events — broadcast only, never persisted.
export const ephemeralEvent = z.discriminatedUnion("type", [
  z.object({ type: z.literal("participant_join"), data: z.object({ userId: z.string() }) }),
  z.object({ type: z.literal("slide_change"), data: z.object({ direction: z.number() }) }),
]);
export type EphemeralEvent = z.infer<typeof ephemeralEvent>;

// ---------------------------------------------------------------------------
// Wire messages.
// ---------------------------------------------------------------------------

// The `distribute` payload (client → server) is a persistent-or-ephemeral event
// validated per `type`. Persistence is derived server-side, not trusted from the client.
export const incomingEvent = z.union([persistentEvent, ephemeralEvent]);
export type IncomingEvent = z.infer<typeof incomingEvent>;

// client → server: "distribute" — an event plus optional slide routing.
export const distributeMessage = z.intersection(
  incomingEvent,
  z.object({ slideId: z.string().uuid().nullable().optional() }),
);
export type DistributeMessage = z.infer<typeof distributeMessage>;

const PERSISTENT_TYPES = new Set<string>([
  "chat_message",
  "pencil_drawing",
  "eraser_drawing",
  "line_drawing",
  "rectangle_drawing",
  "outline_rectangle_drawing",
  "highlight_drawing",
]);

export const isPersistentType = (type: string): type is EventType => PERSISTENT_TYPES.has(type);

// server → client: "receive" — the persisted event with its assigned revision.
export type BroadcastEvent = PersistentEvent & {
  id: string;
  sessionId: string;
  slideId: string | null;
  userId: string;
  revision: number;
  createdAt: string;
};

// Socket.IO event channel names + room helper.
export const SOCKET_EVENTS = {
  DISTRIBUTE: "distribute",
  RECEIVE: "receive",
  REPLAY: "replay",
  ROSTER: "roster",
} as const;

export const sessionRoom = (sessionId: string) => `session:${sessionId}`;

// Roster presence — join/leave deltas plus a one-time snapshot of who's already online,
// sent to each joiner (deltas alone can't tell a joiner who was already in the room, #12).
export const rosterMessage = z.discriminatedUnion("type", [
  z.object({ type: z.literal("join"), userId: z.string() }),
  z.object({ type: z.literal("leave"), userId: z.string() }),
  z.object({ type: z.literal("snapshot"), userIds: z.array(z.string()) }),
]);
export type RosterMessage = z.infer<typeof rosterMessage>;

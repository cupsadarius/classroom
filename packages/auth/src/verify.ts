import { decode, encode } from "@auth/core/jwt";

const secret = process.env.AUTH_SECRET;

// Non-HTTPS dev uses the unprefixed cookie name; production uses the __Secure- prefix.
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token";

export interface SessionTokenClaims {
  id: string;
  roles: string[];
  email?: string | null;
  name?: string | null;
}

// General-purpose decode of the actual Auth.js session cookie. NOT used for the socket
// handshake (see verifyRealtimeToken below) — the raw session cookie must never reach
// browser JS, so nothing should read it server-side just to hand it to a client.
export async function verifySessionToken(token: string): Promise<SessionTokenClaims | null> {
  if (!secret) throw new Error("AUTH_SECRET is not set");
  const payload = await decode({ token, secret, salt: SESSION_COOKIE_NAME });
  if (!payload?.id) return null;
  return {
    id: payload.id as string,
    roles: (payload.roles as string[]) ?? [],
    email: (payload.email as string | undefined) ?? null,
    name: (payload.name as string | undefined) ?? null,
  };
}

// A distinct salt from the session cookie's — a realtime token must never decode as, or be
// confused with, the actual session cookie even if both are JWE-encrypted with AUTH_SECRET.
const REALTIME_TOKEN_SALT = "classroom-realtime-token";
const REALTIME_TOKEN_MAX_AGE = 5 * 60; // short-lived: only needed for the socket handshake

// Mints a short-lived, single-purpose token for the Socket.IO handshake (#12 hardening).
// The actual Auth.js session cookie is httpOnly and must stay server-side; this is what's
// safe to hand to browser JS instead — scoped to the realtime service, expires in 5 minutes,
// and is useless as a session cookie substitute (different salt → decode fails outright).
export async function mintRealtimeToken(claims: SessionTokenClaims): Promise<string> {
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return encode({
    token: { ...claims },
    secret,
    salt: REALTIME_TOKEN_SALT,
    maxAge: REALTIME_TOKEN_MAX_AGE,
  });
}

export async function verifyRealtimeToken(token: string): Promise<SessionTokenClaims | null> {
  if (!secret) throw new Error("AUTH_SECRET is not set");
  const payload = await decode({ token, secret, salt: REALTIME_TOKEN_SALT });
  if (!payload?.id) return null;
  return {
    id: payload.id as string,
    roles: (payload.roles as string[]) ?? [],
    email: (payload.email as string | undefined) ?? null,
    name: (payload.name as string | undefined) ?? null,
  };
}

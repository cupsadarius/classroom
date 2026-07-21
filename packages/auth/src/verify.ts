import { decode } from "@auth/core/jwt";

// Shared session-token verification used by BOTH the web middleware and the
// standalone Socket.IO handshake (apps/realtime), which cannot call auth().
// Auth.js v5 encrypts the session token (JWE) with AUTH_SECRET; decode needs
// { token, secret, salt } where salt is the session cookie name. Both sides must
// agree on the salt — pinned here.
const secret = process.env.AUTH_SECRET;

// Non-HTTPS dev uses the unprefixed cookie name; production uses the __Secure- prefix.
// Exported so apps/web can read the same cookie server-side for the socket handshake (#12).
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token";
const salt = SESSION_COOKIE_NAME;

export interface SessionTokenClaims {
  id: string;
  roles: string[];
  email?: string | null;
  name?: string | null;
}

export async function verifySessionToken(token: string): Promise<SessionTokenClaims | null> {
  if (!secret) throw new Error("AUTH_SECRET is not set");
  const payload = await decode({ token, secret, salt });
  if (!payload?.id) return null;
  return {
    id: payload.id as string,
    roles: (payload.roles as string[]) ?? [],
    email: (payload.email as string | undefined) ?? null,
    name: (payload.name as string | undefined) ?? null,
  };
}

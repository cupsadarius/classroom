"use server";

import { auth, mintRealtimeToken } from "@classroom/auth";

// The raw Auth.js session cookie must never reach browser JS (it's the full-account
// credential) — this mints a short-lived, single-purpose token scoped to the socket
// handshake instead. Even leaked, it can't be replayed as the session cookie (distinct
// salt) and expires in 5 minutes.
export async function getRealtimeToken(): Promise<string | null> {
  const session = await auth();
  if (!session?.user) return null;
  return mintRealtimeToken({
    id: session.user.id,
    roles: session.user.roles,
    email: session.user.email,
    name: session.user.name,
  });
}

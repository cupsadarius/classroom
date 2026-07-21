"use server";

import { SESSION_COOKIE_NAME } from "@classroom/auth";
import { cookies } from "next/headers";

// The socket handshake (apps/realtime) verifies the same encrypted Auth.js session cookie
// verifySessionToken decodes server-side — but it's httpOnly, so the browser can't read it
// directly. This reads it server-side and hands the raw value to the client for `auth.token`.
export async function getRealtimeToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value ?? null;
}

"use server";

import { signIn, signOut } from "@classroom/auth";
import { AuthError } from "next-auth";

// Credentials sign-in via a server action (#10). `signIn` sets the session cookie
// and throws a redirect to `redirectTo` on success — that NEXT_REDIRECT must
// propagate, so only AuthError (bad credentials) is swallowed into a message.
export async function authenticate(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid email or password.";
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

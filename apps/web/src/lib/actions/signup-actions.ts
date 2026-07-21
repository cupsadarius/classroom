"use server";

import { redirect } from "next/navigation";
import { actionErrorMessage } from "@/lib/trpc/action-error";
import { getCaller } from "@/lib/trpc/server";

// Public self-registration (#11, parity with legacy's unauthenticated attendee POSTs).
async function signup(role: "teacher" | "student", formData: FormData): Promise<string | undefined> {
  const caller = await getCaller();
  try {
    await caller[role].signup({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      firstName: String(formData.get("firstName") || "") || undefined,
      lastName: String(formData.get("lastName") || "") || undefined,
      phoneNumber: String(formData.get("phoneNumber") || "") || undefined,
    });
  } catch (error) {
    return actionErrorMessage(error);
  }
  redirect("/login");
}

export async function signupTeacher(_prev: string | undefined, formData: FormData) {
  return signup("teacher", formData);
}

export async function signupStudent(_prev: string | undefined, formData: FormData) {
  return signup("student", formData);
}

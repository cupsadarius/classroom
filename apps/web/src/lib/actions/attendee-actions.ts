"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/lib/trpc/action-error";
import { getCaller } from "@/lib/trpc/server";

const str = (v: FormDataEntryValue | null) => (v ? String(v) || undefined : undefined);

async function updateAttendee(kind: "teacher" | "student", id: string, formData: FormData) {
  const caller = await getCaller();
  try {
    await caller[kind].update({
      id,
      firstName: str(formData.get("firstName")),
      lastName: str(formData.get("lastName")),
      phoneNumber: str(formData.get("phoneNumber")),
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath(`/${kind}s`);
  return {};
}

async function deleteAttendee(kind: "teacher" | "student", id: string) {
  const caller = await getCaller();
  try {
    await caller[kind].delete({ id });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath(`/${kind}s`);
  return {};
}

export async function updateTeacher(id: string, formData: FormData) {
  return updateAttendee("teacher", id, formData);
}

export async function deleteTeacher(id: string) {
  return deleteAttendee("teacher", id);
}

export async function updateStudent(id: string, formData: FormData) {
  return updateAttendee("student", id, formData);
}

export async function deleteStudent(id: string) {
  return deleteAttendee("student", id);
}

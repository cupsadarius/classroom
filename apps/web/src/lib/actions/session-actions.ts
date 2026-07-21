"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/lib/trpc/action-error";
import { getCaller } from "@/lib/trpc/server";

const str = (v: FormDataEntryValue | null) => (v ? String(v) || undefined : undefined);
const date = (v: FormDataEntryValue | null) => {
  const s = str(v);
  return s ? new Date(s) : undefined;
};

export async function createSession(formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.session.create({
      classroomId: String(formData.get("classroomId")),
      lessonId: str(formData.get("lessonId")),
      startDate: date(formData.get("startDate")),
      endDate: date(formData.get("endDate")),
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/sessions");
  return {};
}

export async function updateSession(id: string, formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.session.update({
      id,
      classroomId: String(formData.get("classroomId")),
      lessonId: str(formData.get("lessonId")),
      startDate: date(formData.get("startDate")),
      endDate: date(formData.get("endDate")),
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/sessions");
  return {};
}

export async function deleteSession(id: string, classroomId: string) {
  const caller = await getCaller();
  try {
    await caller.session.delete({ id, classroomId });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/sessions");
  return {};
}

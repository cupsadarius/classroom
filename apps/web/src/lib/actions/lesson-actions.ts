"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/lib/trpc/action-error";
import { getCaller } from "@/lib/trpc/server";

type SlideInput = { id?: string; name?: string; path?: string; type?: "image" | "pdf"; order: number };

function slidesFrom(formData: FormData): SlideInput[] {
  const raw = formData.get("slidesJson");
  if (!raw) return [];
  try {
    return JSON.parse(String(raw));
  } catch {
    return [];
  }
}

export async function createLesson(formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.lesson.create({
      title: String(formData.get("title")),
      description: String(formData.get("description") || "") || undefined,
      categoryId: String(formData.get("categoryId") || "") || undefined,
      slides: slidesFrom(formData),
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/lessons");
  return {};
}

export async function updateLesson(id: string, formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.lesson.update({
      id,
      title: String(formData.get("title")),
      description: String(formData.get("description") || "") || undefined,
      categoryId: String(formData.get("categoryId") || "") || undefined,
      slides: slidesFrom(formData),
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/lessons");
  return {};
}

export async function deleteLesson(id: string) {
  const caller = await getCaller();
  try {
    await caller.lesson.delete({ id });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/lessons");
  return {};
}

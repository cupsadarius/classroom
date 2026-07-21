"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/lib/trpc/action-error";
import { getCaller } from "@/lib/trpc/server";

type SlideInput = { id?: string; name?: string; path?: string; type?: "image"; order: number };

// Mint a presigned PUT for a slide image (#13). The client uploads the file directly to
// storage, then persists the returned object key on the slide row via the lesson mutation.
export async function createSlideUploadUrl(input: { contentType: string; size: number }) {
  const caller = await getCaller();
  try {
    return {
      data: await caller.lesson.createUploadUrl({
        // Server-side zod (ALLOWED_SLIDE_MIME) is the real gate; this cast just satisfies TS.
        contentType: input.contentType as "image/png" | "image/jpeg" | "image/gif" | "image/webp",
        size: input.size,
      }),
    };
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
}

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

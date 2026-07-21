"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/lib/trpc/action-error";
import { getCaller } from "@/lib/trpc/server";

export async function createCategory(formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.category.create({
      name: String(formData.get("name")),
      description: String(formData.get("description") || "") || undefined,
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/categories");
  return {};
}

export async function updateCategory(id: string, formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.category.update({
      id,
      name: String(formData.get("name")),
      description: String(formData.get("description") || "") || undefined,
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/categories");
  return {};
}

export async function deleteCategory(id: string) {
  const caller = await getCaller();
  try {
    await caller.category.delete({ id });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/categories");
  return {};
}

"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/lib/trpc/action-error";
import { getCaller } from "@/lib/trpc/server";

const str = (v: FormDataEntryValue | null) => (v ? String(v) || undefined : undefined);
const rolesFrom = (formData: FormData) =>
  formData.getAll("roles") as ("admin" | "teacher" | "student")[];

export async function createUser(formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.user.create({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      firstName: str(formData.get("firstName")),
      lastName: str(formData.get("lastName")),
      phoneNumber: str(formData.get("phoneNumber")),
      roles: rolesFrom(formData),
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/users");
  return {};
}

export async function updateUser(id: string, formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.user.update({
      id,
      email: str(formData.get("email")),
      firstName: str(formData.get("firstName")),
      lastName: str(formData.get("lastName")),
      phoneNumber: str(formData.get("phoneNumber")),
      roles: rolesFrom(formData),
    });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/users");
  return {};
}

export async function deleteUser(id: string) {
  const caller = await getCaller();
  try {
    await caller.user.delete({ id });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/users");
  return {};
}

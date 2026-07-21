"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/lib/trpc/action-error";
import { getCaller } from "@/lib/trpc/server";

export async function createClassroom(formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.classroom.create({ name: String(formData.get("name")) });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/classrooms");
  return {};
}

export async function updateClassroom(id: string, formData: FormData) {
  const caller = await getCaller();
  try {
    await caller.classroom.update({ id, name: String(formData.get("name")) });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/classrooms");
  return {};
}

export async function deleteClassroom(id: string) {
  const caller = await getCaller();
  try {
    await caller.classroom.delete({ id });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/classrooms");
  return {};
}

export async function addClassroomMember(
  classroomId: string,
  userId: string,
  memberRole: "teacher" | "student",
) {
  const caller = await getCaller();
  try {
    await caller.classroom.addMember({ classroomId, userId, memberRole });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/classrooms");
  return {};
}

export async function removeClassroomMember(classroomId: string, userId: string) {
  const caller = await getCaller();
  try {
    await caller.classroom.removeMember({ classroomId, userId });
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }
  revalidatePath("/classrooms");
  return {};
}

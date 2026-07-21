import { auth } from "@classroom/auth";
import { CrudSection } from "@/components/crud/crud-section";
import { deleteTeacher, updateTeacher } from "@/lib/actions/attendee-actions";
import { getCaller } from "@/lib/trpc/server";

// Student-gated read (any attendee), self-scoped edit, admin-only delete (#11, gate map #7).
export default async function TeachersPage() {
  const [session, caller] = await Promise.all([auth(), getCaller()]);
  const teachers = await caller.teacher.list();
  const isAdmin = Boolean(session?.user.roles.includes("admin"));

  const rows = teachers.map((t) => ({
    id: t.id,
    email: t.email,
    firstName: t.firstName ?? "",
    lastName: t.lastName ?? "",
    phoneNumber: t.phoneNumber ?? "",
    name: `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim(),
    canEdit: isAdmin || t.id === session?.user.id,
    canDelete: isAdmin,
  }));

  return (
    <CrudSection
      title="Teachers"
      description="Sign-up is public — this view is for editing and offboarding."
      rows={rows}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phoneNumber", label: "Phone" },
      ]}
      fields={[
        { name: "firstName", label: "First name" },
        { name: "lastName", label: "Last name" },
        { name: "phoneNumber", label: "Phone number", kind: "tel" },
      ]}
      updateAction={updateTeacher}
      deleteAction={deleteTeacher}
    />
  );
}

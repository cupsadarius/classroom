import { auth } from "@classroom/auth";
import { CrudSection } from "@/components/crud/crud-section";
import { deleteStudent, updateStudent } from "@/lib/actions/attendee-actions";
import { getCaller } from "@/lib/trpc/server";

// Teacher-gated read, self-scoped edit, admin-only delete (#11, gate map #7).
export default async function StudentsPage() {
  const [session, caller] = await Promise.all([auth(), getCaller()]);
  const students = await caller.student.list();
  const isAdmin = Boolean(session?.user.roles.includes("admin"));

  const rows = students.map((s) => ({
    id: s.id,
    email: s.email,
    firstName: s.firstName ?? "",
    lastName: s.lastName ?? "",
    phoneNumber: s.phoneNumber ?? "",
    name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim(),
    canEdit: isAdmin || s.id === session?.user.id,
    canDelete: isAdmin,
  }));

  return (
    <CrudSection
      title="Students"
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
      updateAction={updateStudent}
      deleteAction={deleteStudent}
    />
  );
}

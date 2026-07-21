import { CrudSection } from "@/components/crud/crud-section";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user-actions";
import { getCaller } from "@/lib/trpc/server";

// Admin-only user management, full account CRUD across all roles (#11, gate map #7).
export default async function UsersPage() {
  const caller = await getCaller();
  const users = await caller.user.list();
  const rows = users.map((u) => {
    const roles = u.roles.map((r) => r.role.name);
    return {
      id: u.id,
      email: u.email,
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      phoneNumber: u.phoneNumber ?? "",
      name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
      roles,
      rolesText: roles.join(", "),
    };
  });

  return (
    <CrudSection
      title="Users"
      description="Every account across the platform, including admins."
      rows={rows}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "rolesText", label: "Roles" },
      ]}
      fields={[
        { name: "firstName", label: "First name" },
        { name: "lastName", label: "Last name" },
        { name: "email", label: "Email", kind: "email", required: true },
        { name: "phoneNumber", label: "Phone number", kind: "tel" },
        { name: "password", label: "Password", kind: "password", required: true, hideOnEdit: true },
        { name: "roles", label: "Roles", kind: "roles", options: ["admin", "teacher", "student"] },
      ]}
      createAction={createUser}
      updateAction={updateUser}
      deleteAction={deleteUser}
    />
  );
}

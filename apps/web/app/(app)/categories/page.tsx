import { CrudSection } from "@/components/crud/crud-section";
import { createCategory, deleteCategory, updateCategory } from "@/lib/actions/category-actions";
import { getCaller } from "@/lib/trpc/server";

// Teacher-gated CRUD (#11, gate map #7). Validation mirrors legacy CategoryValidator (min 3 chars).
export default async function CategoriesPage() {
  const caller = await getCaller();
  const categories = await caller.category.list();

  return (
    <CrudSection
      title="Categories"
      description="Groups lessons for browsing."
      rows={categories.map((c) => ({ id: c.id, name: c.name, description: c.description ?? "" }))}
      columns={[
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
      ]}
      fields={[
        { name: "name", label: "Name", required: true, placeholder: "At least 3 characters" },
        { name: "description", label: "Description" },
      ]}
      createAction={createCategory}
      updateAction={updateCategory}
      deleteAction={deleteCategory}
    />
  );
}

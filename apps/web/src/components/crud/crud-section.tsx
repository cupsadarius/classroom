"use client";

import { useState, useTransition } from "react";
import { Button } from "@classroom/ui/components/button";
import { Input } from "@classroom/ui/components/input";
import { Label } from "@classroom/ui/components/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@classroom/ui/components/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@classroom/ui/components/table";

export type CrudField =
  | {
      name: string;
      label: string;
      kind?: "text" | "email" | "tel" | "password";
      required?: boolean;
      placeholder?: string;
      hideOnEdit?: boolean;
    }
  | { name: string; label: string; kind: "roles"; options: string[] };

// Columns display a plain string field — no render functions. Server Component pages can't
// pass closures across the RSC boundary, so any formatting (joining roles, concatenating a
// name) is precomputed onto the row itself before it reaches this client component.
export type CrudColumn<T> = { key: keyof T & string; label: string };

type ActionResult = { error?: string };

// Shared list+sheet+delete CRUD surface for the management dashboard (#11). Entities with
// relational sub-forms (lesson slides, classroom members) build bespoke UI instead of this.
// Rows may mark themselves non-editable/non-deletable (e.g. a teacher viewing another
// teacher's row) — plain data, computed server-side, not a closure across the RSC boundary.
type CrudRow = { id: string; canEdit?: boolean; canDelete?: boolean };

export function CrudSection<T extends CrudRow>({
  title,
  description,
  rows,
  columns,
  fields,
  createAction,
  updateAction,
  deleteAction,
}: {
  title: string;
  description: string;
  rows: T[];
  columns: CrudColumn<T>[];
  fields: CrudField[];
  createAction?: (formData: FormData) => Promise<ActionResult>;
  updateAction: (id: string, formData: FormData) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<ActionResult>;
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  const open = creating || editing !== null;
  const close = () => {
    setCreating(false);
    setEditing(null);
    setError(undefined);
  };

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = editing
        ? await updateAction(editing.id, formData)
        : await createAction?.(formData);
      if (result?.error) setError(result.error);
      else close();
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        </div>
        {createAction ? <Button onClick={() => setCreating(true)}>New</Button> : null}
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key}>{c.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>{(row[c.key] as React.ReactNode) || "—"}</TableCell>
                ))}
                <TableCell className="text-right">
                  {row.canEdit !== false ? (
                    <Button variant="ghost" size="sm" onClick={() => setEditing(row)}>
                      Edit
                    </Button>
                  ) : null}
                  {row.canDelete !== false ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      onClick={() => remove(row.id)}
                      className="text-destructive"
                    >
                      Delete
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">
                  Nothing here yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Sheet open={open} onOpenChange={(next) => !next && close()}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editing ? `Edit ${title.replace(/s$/, "")}` : `New ${title.replace(/s$/, "")}`}</SheetTitle>
            <SheetDescription>
              {editing ? "Update the fields below." : "Fill in the fields below to create one."}
            </SheetDescription>
          </SheetHeader>
          <form action={submit} className="grid gap-4 px-4">
            {fields
              .filter((field) => !(editing && "hideOnEdit" in field && field.hideOnEdit))
              .map((field) =>
              field.kind === "roles" ? (
                <div key={field.name} className="grid gap-2">
                  <Label>{field.label}</Label>
                  <div className="flex gap-4">
                    {field.options.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name={field.name}
                          value={option}
                          defaultChecked={((editing as never as Record<string, unknown>)?.[
                            field.name
                          ] as string[] | undefined)?.includes(option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={field.name} className="grid gap-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.kind ?? "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={
                      editing
                        ? ((editing as never as Record<string, unknown>)[field.name] as string)
                        : undefined
                    }
                  />
                </div>
              ),
            )}
            {error ? (
              <p role="alert" className="text-destructive text-sm">
                {error}
              </p>
            ) : null}
            <SheetFooter className="px-0">
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

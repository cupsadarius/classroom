"use client";

import { useEffect, useState, useTransition } from "react";
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

type Member = { userId: string; email: string; memberRole: "teacher" | "student" };
type ClassroomRow = { id: string; name: string; members: Member[] };
type ActionResult = { error?: string };

// Bespoke classroom CRUD (#11): membership management is a relation, not a form field, so this
// doesn't fit the generic CrudSection. Member add/remove call the server directly (not batched
// into the classroom-name form) — they're independent rows, not fields on the classroom.
export function ClassroomCrud({
  classrooms,
  users,
  createAction,
  updateAction,
  deleteAction,
  addMemberAction,
  removeMemberAction,
}: {
  classrooms: ClassroomRow[];
  users: { id: string; email: string }[];
  createAction: (formData: FormData) => Promise<ActionResult>;
  updateAction: (id: string, formData: FormData) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<ActionResult>;
  addMemberAction: (
    classroomId: string,
    userId: string,
    memberRole: "teacher" | "student",
  ) => Promise<ActionResult>;
  removeMemberAction: (classroomId: string, userId: string) => Promise<ActionResult>;
}) {
  const [editing, setEditing] = useState<ClassroomRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [newMemberUserId, setNewMemberUserId] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"teacher" | "student">("student");
  const [pending, startTransition] = useTransition();

  // Member add/remove revalidates the page; re-sync the open sheet to the fresh row
  // instead of showing a stale membership snapshot.
  useEffect(() => {
    if (!editing) return;
    const fresh = classrooms.find((c) => c.id === editing.id);
    if (fresh) setEditing(fresh);
  }, [classrooms, editing?.id]);

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
        : await createAction(formData);
      if (result?.error) setError(result.error);
      else close();
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this classroom? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result?.error) alert(result.error);
    });
  }

  function addMember() {
    if (!editing || !newMemberUserId) return;
    startTransition(async () => {
      const result = await addMemberAction(editing.id, newMemberUserId, newMemberRole);
      if (result?.error) alert(result.error);
      else setNewMemberUserId("");
    });
  }

  function removeMember(userId: string) {
    if (!editing) return;
    startTransition(async () => {
      const result = await removeMemberAction(editing.id, userId);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Classrooms</h1>
          <p className="mt-1 text-muted-foreground text-sm">Spaces you own or co-teach.</p>
        </div>
        <Button onClick={() => setCreating(true)}>New</Button>
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classrooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.members.length}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(room)}>
                    Manage
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={pending}
                    onClick={() => remove(room.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {classrooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nothing here yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Sheet open={open} onOpenChange={(next) => !next && close()}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing ? "Manage classroom" : "New classroom"}</SheetTitle>
            <SheetDescription>
              {editing ? "Rename or manage membership." : "Give the classroom a name."}
            </SheetDescription>
          </SheetHeader>
          <form action={submit} className="grid gap-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} />
            </div>
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

          {editing ? (
            <div className="grid gap-2 border-t px-4 pt-4">
              <Label>Members</Label>
              {editing.members.map((m) => (
                <div key={m.userId} className="flex items-center justify-between text-sm">
                  <span>
                    {m.email} <span className="text-muted-foreground">({m.memberRole})</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeMember(m.userId)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {editing.members.length === 0 ? (
                <p className="text-muted-foreground text-sm">No members yet.</p>
              ) : null}

              <div className="mt-2 flex items-center gap-2">
                <select
                  value={newMemberUserId}
                  onChange={(e) => setNewMemberUserId(e.target.value)}
                  className="h-9 flex-1 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                  <option value="">Pick a user…</option>
                  {users
                    .filter((u) => !editing.members.some((m) => m.userId === u.id))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.email}
                      </option>
                    ))}
                </select>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as "teacher" | "student")}
                  className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                  <option value="student">student</option>
                  <option value="teacher">teacher</option>
                </select>
                <Button type="button" size="sm" disabled={!newMemberUserId} onClick={addMember}>
                  Add
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

"use client";

import Link from "next/link";
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

type SessionRow = {
  id: string;
  classroomId: string;
  classroomName: string;
  lessonId?: string;
  startDate?: string;
  endDate?: string;
};

type ActionResult = { error?: string };

// Bespoke session CRUD (#11): classroom + lesson foreign keys need selects, and delete needs
// the parent classroomId (assertClassroomMember scoping) — too relational for CrudSection.
export function SessionCrud({
  sessions,
  classrooms,
  lessons,
  createAction,
  updateAction,
  deleteAction,
  readOnly = false,
}: {
  sessions: SessionRow[];
  classrooms: { id: string; name: string }[];
  lessons: { id: string; title: string }[];
  createAction: (formData: FormData) => Promise<ActionResult>;
  updateAction: (id: string, formData: FormData) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<ActionResult>;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState<SessionRow | null>(null);
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
        : await createAction(formData);
      if (result?.error) setError(result.error);
      else close();
    });
  }

  function remove(row: SessionRow) {
    if (!confirm("Delete this session? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteAction(row.id);
      if (result?.error) alert(result.error);
    });
  }

  const toLocalInput = (iso?: string) => (iso ? iso.slice(0, 16) : "");

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Sessions</h1>
          <p className="mt-1 text-muted-foreground text-sm">Scheduled meetings for a classroom.</p>
        </div>
        {readOnly ? null : <Button onClick={() => setCreating(true)}>New</Button>}
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Classroom</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.classroomName}</TableCell>
                <TableCell>{s.startDate ? new Date(s.startDate).toLocaleString() : "—"}</TableCell>
                <TableCell>{s.endDate ? new Date(s.endDate).toLocaleString() : "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/sessions/${s.id}/live`}>Join</Link>
                  </Button>
                  {readOnly ? null : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(s)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        disabled={pending}
                        onClick={() => remove(s)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
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
            <SheetTitle>{editing ? "Edit session" : "New session"}</SheetTitle>
            <SheetDescription>Pick a classroom and, optionally, a lesson and times.</SheetDescription>
          </SheetHeader>
          <form action={submit} className="grid gap-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="classroomId">Classroom</Label>
              <select
                id="classroomId"
                name="classroomId"
                required
                defaultValue={editing?.classroomId ?? ""}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="" disabled>
                  Select a classroom
                </option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lessonId">Lesson</Label>
              <select
                id="lessonId"
                name="lessonId"
                defaultValue={editing?.lessonId ?? ""}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">No lesson</option>
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                defaultValue={toLocalInput(editing?.startDate)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                defaultValue={toLocalInput(editing?.endDate)}
              />
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
        </SheetContent>
      </Sheet>
    </div>
  );
}

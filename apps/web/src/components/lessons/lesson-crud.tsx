"use client";

import { createSlideUploadUrl } from "@/lib/actions/lesson-actions";
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
import { useRef, useState, useTransition } from "react";

type SlideRow = {
  id?: string;
  name?: string;
  path?: string;
  type?: "image";
  url?: string; // presigned GET (existing slides) or a local objectURL (just uploaded)
  order: number;
};

type LessonRow = {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  slides: SlideRow[];
};

type ActionResult = { error?: string };

// Slide image upload (#13): images only, ≤10 MB. Mirrors @classroom/storage's server-side gate
// for immediate UX feedback — the presigned PUT + zod validation are the real enforcement.
const ALLOWED_MIME = ["image/png", "image/jpeg", "image/gif", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

// Bespoke lesson CRUD (#11): category select + an ordered, editable slide list — too relational
// for the generic CrudSection. Each slide carries an uploaded image (#13): the file is PUT
// directly to storage via a presigned url and only the returned object key is persisted.
export function LessonCrud({
  lessons,
  categories,
  createAction,
  updateAction,
  deleteAction,
}: {
  lessons: LessonRow[];
  categories: { id: string; name: string }[];
  createAction: (formData: FormData) => Promise<ActionResult>;
  updateAction: (id: string, formData: FormData) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<ActionResult>;
}) {
  const [editing, setEditing] = useState<LessonRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [slides, setSlides] = useState<SlideRow[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const open = creating || editing !== null;

  function openCreate() {
    setSlides([]);
    setCreating(true);
  }
  function openEdit(row: LessonRow) {
    setSlides(row.slides.map((s) => ({ ...s })));
    setEditing(row);
  }
  function close() {
    setCreating(false);
    setEditing(null);
    setError(undefined);
  }

  function addSlide() {
    setSlides((s) => [...s, { order: s.length, name: "", type: "image" }]);
  }
  function removeSlide(idx: number) {
    setSlides((s) => s.filter((_, i) => i !== idx));
  }
  function updateSlide(idx: number, patch: Partial<SlideRow>) {
    setSlides((s) => s.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  }

  async function uploadSlideFile(idx: number, file: File) {
    setError(undefined);
    if (!ALLOWED_MIME.includes(file.type)) {
      setError("Slides must be PNG, JPEG, GIF, or WebP images.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Slide images must be 10 MB or smaller.");
      return;
    }
    setUploadingIdx(idx);
    try {
      const minted = await createSlideUploadUrl({ contentType: file.type, size: file.size });
      if ("error" in minted || !minted.data) {
        setError(minted.error ?? "Could not start the upload.");
        return;
      }
      const put = await fetch(minted.data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!put.ok) {
        setError("Upload failed. Please try again.");
        return;
      }
      updateSlide(idx, {
        path: minted.data.key,
        type: "image",
        url: URL.createObjectURL(file), // instant local preview until the next reload
        name: slides[idx]?.name || file.name,
      });
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploadingIdx(null);
    }
  }

  function submit(formData: FormData) {
    formData.set("slidesJson", JSON.stringify(slides));
    startTransition(async () => {
      const result = editing
        ? await updateAction(editing.id, formData)
        : await createAction(formData);
      if (result?.error) setError(result.error);
      else close();
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this lesson? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Lessons</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Slide decks to run in a live session.
          </p>
        </div>
        <Button onClick={openCreate}>New</Button>
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slides</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.categoryName ?? "—"}</TableCell>
                <TableCell>{lesson.slides.length}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(lesson)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={pending}
                    onClick={() => remove(lesson.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {lessons.length === 0 ? (
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
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit lesson" : "New lesson"}</SheetTitle>
            <SheetDescription>Slides are ordered — lower numbers show first.</SheetDescription>
          </SheetHeader>
          <form action={submit} className="grid gap-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={editing?.title}
                placeholder="At least 3 characters"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={editing?.description} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={editing?.categoryId ?? ""}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Slides</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addSlide}>
                  Add slide
                </Button>
              </div>
              {slides.map((slide, idx) => (
                <div
                  key={slide.id ?? `new-${idx}`}
                  className="grid grid-cols-[3rem_1fr_4rem_auto] items-center gap-2"
                >
                  {slide.url ? (
                    // Plain <img>: presigned/objectURL src, not a static/optimizable asset.
                    <img
                      src={slide.url}
                      alt={slide.name ?? "Slide"}
                      className="size-12 rounded border object-cover"
                    />
                  ) : (
                    <div className="grid size-12 place-items-center rounded border border-dashed text-muted-foreground text-xs">
                      —
                    </div>
                  )}
                  <div className="grid gap-1">
                    <Input
                      placeholder="Name"
                      value={slide.name ?? ""}
                      onChange={(e) => updateSlide(idx, { name: e.target.value })}
                    />
                    <input
                      ref={(el) => {
                        fileInputs.current[idx] = el;
                      }}
                      type="file"
                      accept={ALLOWED_MIME.join(",")}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadSlideFile(idx, file);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingIdx === idx}
                      onClick={() => fileInputs.current[idx]?.click()}
                    >
                      {uploadingIdx === idx
                        ? "Uploading…"
                        : slide.path
                          ? "Replace image"
                          : "Upload image"}
                    </Button>
                  </div>
                  <Input
                    type="number"
                    value={slide.order}
                    onChange={(e) => updateSlide(idx, { order: Number(e.target.value) })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeSlide(idx)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              {slides.length === 0 ? (
                <p className="text-muted-foreground text-sm">No slides yet.</p>
              ) : null}
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

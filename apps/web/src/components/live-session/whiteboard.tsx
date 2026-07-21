"use client";

import type { BroadcastEvent, PersistentEvent } from "@classroom/realtime";
import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

export type DrawTool =
  | "pencil"
  | "eraser"
  | "line"
  | "rectangle"
  | "rectangle-outline"
  | "highlight";

// Legacy's 1000px-wide coordinate grid (#2 §4) — stored/emitted coordinates are
// resolution-independent; each client scales to its own canvas size on render.
const BASE_WIDTH = 1000;
const BASE_HEIGHT = 700;
const HIGHLIGHT_BAND = 20;

type EmitPersistent = PersistentEvent & { slideId: string };

function renderEvent(ctx: CanvasRenderingContext2D, ev: BroadcastEvent, scale: number) {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  switch (ev.type) {
    case "pencil_drawing":
    case "eraser_drawing": {
      const { color, path } = ev.data;
      ctx.strokeStyle = color;
      ctx.lineWidth = (ev.type === "eraser_drawing" ? 15 : 5) * scale;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.globalCompositeOperation =
        ev.type === "eraser_drawing" ? "destination-out" : "source-over";
      ctx.beginPath();
      for (let i = 0; i < path.length; i += 2) {
        const x = (path[i] ?? 0) * scale;
        const y = (path[i + 1] ?? 0) * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    }
    case "line_drawing": {
      const { color, coordinates } = ev.data;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(coordinates.fromX * scale, coordinates.fromY * scale);
      ctx.lineTo(coordinates.toX * scale, coordinates.toY * scale);
      ctx.stroke();
      break;
    }
    case "rectangle_drawing":
    case "outline_rectangle_drawing": {
      const { color, coordinates, filled } = ev.data;
      const x = Math.min(coordinates.fromX, coordinates.toX) * scale;
      const y = Math.min(coordinates.fromY, coordinates.toY) * scale;
      const w = Math.abs(coordinates.toX - coordinates.fromX) * scale;
      const h = Math.abs(coordinates.toY - coordinates.fromY) * scale;
      if (filled) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(x, y, w, h);
      }
      break;
    }
    case "highlight_drawing": {
      const { color, coordinates } = ev.data;
      const bandHeight = HIGHLIGHT_BAND * scale;
      const x = Math.min(coordinates.fromX, coordinates.toX) * scale;
      const w = Math.abs(coordinates.toX - coordinates.fromX) * scale;
      const y = coordinates.fromY * scale - bandHeight / 2;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, bandHeight);
      break;
    }
  }
  ctx.restore();
}

function fitCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function Whiteboard({
  events,
  slideId,
  imageUrl,
  tool,
  color,
  onEmit,
}: {
  events: BroadcastEvent[];
  slideId: string;
  imageUrl: string | null;
  tool: DrawTool;
  color: string;
  onEmit: (payload: EmitPersistent) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const committedRef = useRef<HTMLCanvasElement>(null);
  const predrawRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: BASE_WIDTH, height: BASE_HEIGHT });
  const scale = size.width / BASE_WIDTH;

  const drawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const path = useRef<number[]>([]);

  // Track container width, keep the 1000×700 aspect ratio.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width === undefined) return;
      setSize({ width, height: width * (BASE_HEIGHT / BASE_WIDTH) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (committedRef.current) fitCanvas(committedRef.current, size.width, size.height);
    if (predrawRef.current) fitCanvas(predrawRef.current, size.width, size.height);
  }, [size]);

  // Redraw the committed canvas whenever this slide's event log changes.
  useEffect(() => {
    const canvas = committedRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    events
      .filter((e) => e.slideId === slideId)
      .sort((a, b) => a.revision - b.revision)
      .forEach((e) => renderEvent(ctx, e, scale));
  }, [events, slideId, scale]);

  function toGrid(clientX: number, clientY: number) {
    const rect = predrawRef.current?.getBoundingClientRect();
    const x = rect ? clientX - rect.left : 0;
    const y = rect ? clientY - rect.top : 0;
    return { x: x / scale, y: y / scale };
  }

  function clearPredraw() {
    const canvas = predrawRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function previewStroke(current: { x: number; y: number }) {
    const canvas = predrawRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    clearPredraw();
    ctx.save();
    const from = start.current;
    if (tool === "pencil" || tool === "eraser") {
      ctx.strokeStyle = color;
      ctx.lineWidth = (tool === "eraser" ? 15 : 5) * scale;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < path.current.length; i += 2) {
        const x = (path.current[i] ?? 0) * scale;
        const y = (path.current[i + 1] ?? 0) * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (tool === "line") {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * scale;
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(from.x * scale, from.y * scale);
      ctx.lineTo(current.x * scale, current.y * scale);
      ctx.stroke();
    } else if (tool === "rectangle" || tool === "rectangle-outline") {
      const x = Math.min(from.x, current.x) * scale;
      const y = Math.min(from.y, current.y) * scale;
      const w = Math.abs(current.x - from.x) * scale;
      const h = Math.abs(current.y - from.y) * scale;
      if (tool === "rectangle") {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(x, y, w, h);
      }
    } else if (tool === "highlight") {
      const bandHeight = HIGHLIGHT_BAND * scale;
      const x = Math.min(from.x, current.x) * scale;
      const w = Math.abs(current.x - from.x) * scale;
      const y = from.y * scale - bandHeight / 2;
      ctx.fillStyle = "rgba(238,255,0,0.5)";
      ctx.fillRect(x, y, w, bandHeight);
    }
    ctx.restore();
  }

  function handlePointerDown(e: ReactPointerEvent) {
    const { x, y } = toGrid(e.clientX, e.clientY);
    drawing.current = true;
    start.current = { x, y };
    path.current = [x, y];
  }

  function handlePointerMove(e: ReactPointerEvent) {
    if (!drawing.current) return;
    const { x, y } = toGrid(e.clientX, e.clientY);
    if (tool === "pencil" || tool === "eraser") path.current.push(x, y);
    previewStroke({ x, y });
  }

  function handlePointerUp(e: ReactPointerEvent) {
    if (!drawing.current) return;
    drawing.current = false;
    const { x, y } = toGrid(e.clientX, e.clientY);
    clearPredraw();

    if (tool === "pencil" || tool === "eraser") {
      let p = path.current;
      if (p.length === 2) {
        const [px, py] = p as [number, number];
        p = [px, py, px + 0.01, py]; // single click → a dot
      }
      onEmit({
        type: tool === "pencil" ? "pencil_drawing" : "eraser_drawing",
        data: { color, path: p },
        slideId,
      });
    } else if (tool === "line") {
      onEmit({
        type: "line_drawing",
        data: {
          color,
          coordinates: { fromX: start.current.x, fromY: start.current.y, toX: x, toY: y },
        },
        slideId,
      });
    } else if (tool === "rectangle" || tool === "rectangle-outline") {
      onEmit({
        type: tool === "rectangle" ? "rectangle_drawing" : "outline_rectangle_drawing",
        data: {
          color,
          coordinates: { fromX: start.current.x, fromY: start.current.y, toX: x, toY: y },
          filled: tool === "rectangle",
        },
        slideId,
      });
    } else if (tool === "highlight") {
      onEmit({
        type: "highlight_drawing",
        data: {
          color: "rgba(238,255,0,0.5)",
          coordinates: {
            fromX: start.current.x,
            fromY: start.current.y,
            toX: x,
            toY: start.current.y,
          },
        },
        slideId,
      });
    }
    path.current = [];
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-lg border bg-white">
      {imageUrl ? (
        // Slide image sits behind both canvases — legacy's Board.jsx <img> backdrop (#13).
        // Plain <img>: the src is an ephemeral presigned URL, not a static/optimizable asset.
        <img src={imageUrl} alt="Slide" className="absolute inset-0 size-full object-contain" />
      ) : null}
      <canvas ref={committedRef} className="absolute inset-0" />
      <canvas
        ref={predrawRef}
        className="absolute inset-0 touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <div style={{ paddingTop: `${(BASE_HEIGHT / BASE_WIDTH) * 100}%` }} />
    </div>
  );
}

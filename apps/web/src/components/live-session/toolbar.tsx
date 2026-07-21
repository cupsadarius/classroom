"use client";

import { Button } from "@classroom/ui/components/button";
import {
  Eraser,
  Highlighter,
  Minus,
  Pencil,
  Square,
  SquareDashed,
} from "lucide-react";
import type { DrawTool } from "./whiteboard";

const TOOLS: { tool: DrawTool; label: string; icon: typeof Pencil }[] = [
  { tool: "pencil", label: "Pencil", icon: Pencil },
  { tool: "eraser", label: "Eraser", icon: Eraser },
  { tool: "line", label: "Line", icon: Minus },
  { tool: "rectangle", label: "Rectangle", icon: Square },
  { tool: "rectangle-outline", label: "Rectangle outline", icon: SquareDashed },
  { tool: "highlight", label: "Highlight", icon: Highlighter },
];

// Legacy's 6 drawing tools (#2 §4) — text is deliberately absent, out of scope.
const COLORS = ["#111827", "#dc2626", "#2563eb", "#16a34a", "#f59e0b"];

export function Toolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
}: {
  tool: DrawTool;
  onToolChange: (tool: DrawTool) => void;
  color: string;
  onColorChange: (color: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {TOOLS.map(({ tool: t, label, icon: Icon }) => (
          <Button
            key={t}
            type="button"
            size="icon"
            variant={tool === t ? "default" : "outline"}
            title={label}
            onClick={() => onToolChange(t)}
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>
      <div className="flex gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Color ${c}`}
            onClick={() => onColorChange(c)}
            className={`size-6 rounded-full border-2 ${color === c ? "border-ring" : "border-transparent"}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

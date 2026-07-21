"use client";

import { Badge } from "@classroom/ui/components/badge";
import { Button } from "@classroom/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useLiveSession } from "@/lib/realtime/use-live-session";
import { ChatPanel } from "./chat-panel";
import { RosterPanel, type RosterMember } from "./roster-panel";
import { Toolbar } from "./toolbar";
import { type DrawTool, Whiteboard } from "./whiteboard";

const STATUS_LABEL = {
  connecting: "Connecting…",
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Connection error",
} as const;

// Live virtual-classroom view (#12): canvas + chat + roster + lesson nav over apps/realtime.
// Slide position is a local index, driven entirely by `slide_change` broadcasts — there's no
// persisted active-slide state, so a late joiner always starts at slide 0 (accepted parity
// gap, per the #6 design doc).
export function LiveSession({
  sessionId,
  lessonTitle,
  slides,
  members,
  currentUserName,
  isTeacher,
}: {
  sessionId: string;
  lessonTitle: string;
  slides: { id: string; name: string | null }[];
  members: RosterMember[];
  currentUserName: string;
  isTeacher: boolean;
}) {
  const { status, events, slideIndex, online, emit } = useLiveSession(sessionId);
  const [tool, setTool] = useState<DrawTool>("pencil");
  const [color, setColor] = useState("#111827");

  const currentSlide = slides[Math.min(slideIndex, slides.length - 1)];

  const chatMessages = useMemo(
    () =>
      events
        .filter((e) => e.type === "chat_message")
        .sort((a, b) => a.revision - b.revision)
        .map((e) => e.data),
    [events],
  );

  function navigate(direction: 1 | -1) {
    emit({ type: "slide_change", data: { direction }, slideId: null });
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-[1fr_280px] gap-4 px-6 py-6">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">{lessonTitle}</h1>
            <p className="mt-1 text-muted-foreground text-sm">
              {currentSlide?.name || `Slide ${slideIndex + 1}`} of {slides.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isTeacher ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={slideIndex === 0}
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={slideIndex >= slides.length - 1}
                  onClick={() => navigate(1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            ) : null}
            <Badge variant={status === "connected" ? "default" : "outline"}>
              {STATUS_LABEL[status]}
            </Badge>
          </div>
        </div>

        <Toolbar tool={tool} onToolChange={setTool} color={color} onColorChange={setColor} />

        {currentSlide ? (
          <Whiteboard
            events={events}
            slideId={currentSlide.id}
            tool={tool}
            color={color}
            onEmit={emit}
          />
        ) : (
          <p className="text-muted-foreground text-sm">This lesson has no slides yet.</p>
        )}
      </div>

      <div className="grid content-start gap-6">
        <div>
          <h2 className="mb-2 font-medium text-sm">Attendees</h2>
          <RosterPanel members={members} online={online} />
        </div>
        <div className="min-h-64">
          <h2 className="mb-2 font-medium text-sm">Chat</h2>
          <ChatPanel
            messages={chatMessages}
            onSend={(message) =>
              emit({ type: "chat_message", data: { user: currentUserName, message }, slideId: null })
            }
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@classroom/ui/components/button";
import { Input } from "@classroom/ui/components/input";
import { type FormEvent, useRef } from "react";

export type ChatMessage = { user: string; message: string };

export function ChatPanel({
  messages,
  onSend,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;
    onSend(text);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: chat log is append-only, never reordered
          <p key={i} className="text-sm">
            <span className="font-medium">{m.user}: </span>
            <span className="text-muted-foreground">{m.message}</span>
          </p>
        ))}
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-sm">No messages yet.</p>
        ) : null}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <Input ref={inputRef} placeholder="Say something…" />
        <Button type="submit" size="sm">
          Send
        </Button>
      </form>
    </div>
  );
}

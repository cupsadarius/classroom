import { Avatar, AvatarFallback } from "@classroom/ui/components/avatar";
import { Badge } from "@classroom/ui/components/badge";

export type RosterMember = { userId: string; name: string; role: "teacher" | "student" };

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

// Members come from classroom membership (a fixed roster); `online` is who's actually
// connected right now, from roster join/leave/snapshot deltas (#12).
export function RosterPanel({
  members,
  online,
}: {
  members: RosterMember[];
  online: ReadonlySet<string>;
}) {
  return (
    <div className="grid gap-3">
      {members.map((m) => (
        <div key={m.userId} className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback>{initialsOf(m.name)}</AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate text-sm">{m.name}</span>
          <Badge variant="outline" className="text-[10px]">
            {m.role}
          </Badge>
          <span
            className={`size-2 rounded-full ${online.has(m.userId) ? "bg-green-500" : "bg-muted"}`}
            title={online.has(m.userId) ? "online" : "offline"}
          />
        </div>
      ))}
    </div>
  );
}

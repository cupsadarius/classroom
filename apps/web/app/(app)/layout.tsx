import type { ReactNode } from "react";
import { auth } from "@classroom/auth";
import { AppShell, type ShellUser } from "@/components/app-shell";
import { effectiveRole } from "@/lib/nav";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // TODO(#10 — auth login flow): redirect unauthenticated users to /login.
  // Until the login flow lands, fall back to a teacher view for local development.
  const role = effectiveRole(session?.user.roles ?? ["teacher"]);
  const name = session?.user.name ?? "Prof. Vasile Toma";
  const user: ShellUser = {
    name,
    email: session?.user.email ?? "v.toma@school.ro",
    initials: initialsOf(name),
  };

  return (
    <AppShell role={role} user={user}>
      {children}
    </AppShell>
  );
}

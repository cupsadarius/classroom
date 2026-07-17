import { redirect } from "next/navigation";
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

  // Route protection (#10): everything under (app) requires a session. Gated here
  // in the server-component layout rather than Edge middleware — the Credentials
  // provider pulls in bcryptjs + Drizzle, which don't run in the Edge runtime.
  if (!session?.user) redirect("/login");

  const role = effectiveRole(session.user.roles);
  const name = session.user.name?.trim() || session.user.email || "User";
  const user: ShellUser = {
    name,
    email: session.user.email ?? "",
    initials: initialsOf(name),
  };

  return (
    <AppShell role={role} user={user}>
      {children}
    </AppShell>
  );
}

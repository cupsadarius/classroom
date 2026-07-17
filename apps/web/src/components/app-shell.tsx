"use client";

// Real app shell — the winning prototype (variant C, "master–detail rail"; wayfinder #9).
// Persistent slim icon rail with role-aware navigation, a user menu, and theme toggle.
// Each management section fills the content slot with its own list + detail view (#11).
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogOut, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@classroom/ui/components/avatar";
import { Button } from "@classroom/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@classroom/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@classroom/ui/components/tooltip";
import { NAV, type Role } from "@/lib/nav";

export type ShellUser = { name: string; email: string; initials: string };

export function AppShell({
  role,
  user,
  children,
}: {
  role: Role;
  user: ShellUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV[role];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-svh overflow-hidden">
        <aside className="flex w-16 flex-col items-center gap-1 border-r bg-sidebar py-3 text-sidebar-foreground">
          <Link
            href="/"
            className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground"
          >
            C
          </Link>
          {items.map((item) => (
            <Tooltip key={item.key}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="size-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
          <div className="mt-auto flex flex-col items-center gap-1">
            <ThemeToggle />
            <UserMenu user={user} role={role} />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </TooltipProvider>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}

function UserMenu({ user, role }: { user: ShellUser; role: Role }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Account" className="rounded-full">
          <Avatar className="size-9">
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="grid text-sm">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
            <span className="mt-1 text-muted-foreground text-xs capitalize">{role}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

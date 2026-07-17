import {
  BookOpen,
  FolderTree,
  GraduationCap,
  LayoutDashboard,
  MonitorPlay,
  School,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

// Global capability grant (packages/db roleEnum). Additive: admin ⊇ teacher ⊇ student.
export type Role = "admin" | "teacher" | "student";

const PRECEDENCE: Role[] = ["admin", "teacher", "student"];

// A user may hold several roles; the shell shows the highest-capability one's nav.
export function effectiveRole(roles: readonly string[]): Role {
  return PRECEDENCE.find((r) => roles.includes(r)) ?? "student";
}

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

const OVERVIEW: NavItem = { key: "overview", label: "Overview", href: "/", icon: LayoutDashboard };

// Role-aware navigation (from #2 §4.1): admin→users/teachers;
// teacher→students/classrooms/categories/lessons; student→sessions.
export const NAV: Record<Role, NavItem[]> = {
  admin: [
    OVERVIEW,
    { key: "users", label: "Users", href: "/users", icon: Users },
    { key: "teachers", label: "Teachers", href: "/teachers", icon: GraduationCap },
  ],
  teacher: [
    OVERVIEW,
    { key: "students", label: "Students", href: "/students", icon: UserRound },
    { key: "classrooms", label: "Classrooms", href: "/classrooms", icon: School },
    { key: "categories", label: "Categories", href: "/categories", icon: FolderTree },
    { key: "lessons", label: "Lessons", href: "/lessons", icon: BookOpen },
  ],
  student: [OVERVIEW, { key: "sessions", label: "Sessions", href: "/sessions", icon: MonitorPlay }],
};

import { db } from "@classroom/db";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

export interface SessionUser {
  id: string;
  roles: string[];
  email?: string | null;
  name?: string | null;
}

// Built in the Next route handler (from auth()) and in tests.
export interface CreateContextOptions {
  user: SessionUser | null;
}

export function createTRPCContext(opts: CreateContextOptions) {
  return { db, user: opts.user };
}

export type Context = ReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

// Requires an authenticated session.
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Roles are additive (teacher ⊇ student). A higher role satisfies a lower gate.
const ROLE_RANK: Record<string, number> = { student: 1, teacher: 2, admin: 3 };

export function roleProcedure(minimum: "admin" | "teacher" | "student") {
  const required = ROLE_RANK[minimum] ?? Number.POSITIVE_INFINITY;
  return protectedProcedure.use(({ ctx, next }) => {
    const highest = Math.max(0, ...ctx.user.roles.map((r) => ROLE_RANK[r] ?? 0));
    if (highest < required) {
      throw new TRPCError({ code: "FORBIDDEN", message: `Requires ${minimum} role` });
    }
    return next({ ctx });
  });
}

export const adminProcedure = roleProcedure("admin");
export const teacherProcedure = roleProcedure("teacher");
export const studentProcedure = roleProcedure("student");

import { roles, userRoles, users } from "@classroom/db";
import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { createUserWithRoles, publicUserColumns, userReturning } from "../helpers";
import { adminProcedure, router } from "../trpc";

const roleName = z.enum(["admin", "teacher", "student"]);

// Gate map (legacy Sidebar, #7): admin → users.
export const userRouter = router({
  list: adminProcedure.query(({ ctx }) =>
    ctx.db.query.users.findMany({
      columns: publicUserColumns,
      with: { roles: { with: { role: true } } },
    }),
  ),
  byId: adminProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input }) =>
    ctx.db.query.users.findFirst({
      where: eq(users.id, input.id),
      columns: publicUserColumns,
      with: { roles: { with: { role: true } } },
    }),
  ),

  create: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        phoneNumber: z.string().optional(),
        roles: z.array(roleName).min(1),
      }),
    )
    .mutation(({ ctx, input }) => createUserWithRoles(ctx, input, input.roles)),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        email: z.string().email().optional(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        phoneNumber: z.string().optional(),
        roles: z.array(roleName).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, roles: nextRoles, ...fields } = input;
      const [updated] = await ctx.db
        .update(users)
        .set(fields)
        .where(eq(users.id, id))
        .returning(userReturning);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });

      if (nextRoles) {
        const roleRows = await ctx.db.query.roles.findMany({
          where: inArray(roles.name, nextRoles),
        });
        await ctx.db.delete(userRoles).where(eq(userRoles.userId, id));
        if (roleRows.length) {
          await ctx.db.insert(userRoles).values(roleRows.map((r) => ({ userId: id, roleId: r.id })));
        }
      }
      return updated;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, input.id))
        .returning();
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
      return { id: deleted.id };
    }),
});

import { users } from "@classroom/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, router } from "../trpc";

// Gate map (legacy Sidebar, #7): admin → users.
// Scaffold implements the read side; mutations land in feature build-out.
export const userRouter = router({
  list: adminProcedure.query(({ ctx }) => ctx.db.query.users.findMany()),
  byId: adminProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input }) =>
    ctx.db.query.users.findFirst({
      where: eq(users.id, input.id),
      with: { roles: { with: { role: true } } },
    }),
  ),
});

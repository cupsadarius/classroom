import { appRouter, createCallerFactory, createTRPCContext } from "@classroom/api";
import { auth } from "@classroom/auth";

const createCaller = createCallerFactory(appRouter);

// Server-side tRPC caller (RSC + server actions) — same procedures/gates as the
// HTTP route, without a network round trip.
export async function getCaller() {
  const session = await auth();
  return createCaller(
    createTRPCContext({
      user: session?.user
        ? {
            id: session.user.id,
            roles: session.user.roles,
            email: session.user.email,
            name: session.user.name,
          }
        : null,
    }),
  );
}

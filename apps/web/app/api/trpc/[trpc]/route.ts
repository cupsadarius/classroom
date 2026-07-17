import { appRouter, createTRPCContext } from "@classroom/api";
import { auth } from "@classroom/auth";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const session = await auth();
      return createTRPCContext({
        user: session?.user
          ? {
              id: session.user.id,
              roles: session.user.roles,
              email: session.user.email,
              name: session.user.name,
            }
          : null,
      });
    },
  });

export { handler as GET, handler as POST };

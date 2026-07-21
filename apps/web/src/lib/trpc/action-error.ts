import { TRPCError } from "@trpc/server";

// Server actions catch TRPCError and surface `.message` via useActionState; any other
// error (e.g. Next's internal NEXT_REDIRECT) must keep propagating.
export function actionErrorMessage(error: unknown): string {
  if (error instanceof TRPCError) {
    return error.message || "Something went wrong.";
  }
  throw error;
}

import { TRPCError } from "@trpc/server";

export function taskNotFound(id: string): TRPCError {
  return new TRPCError({
    code: "NOT_FOUND",
    message: `Task not found (id: ${id}). It may have already been removed.`,
  });
}

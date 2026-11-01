import "server-only";

import { TRPCError } from "@trpc/server";
import { getServerCaller } from "@/trpc/server";

/** Returns the task, or `null` if it does not exist (so a page can render a 404). */
export async function getTaskOrNull(id: string) {
  const caller = await getServerCaller();
  try {
    return await caller.task.get({ id });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

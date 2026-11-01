import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTRPC } from "@/trpc/client";

/** Returns a function that marks every cached page of the task list as stale and refetches it. */
export function useInvalidateTaskList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useCallback(
    () => queryClient.invalidateQueries(trpc.task.list.pathFilter()),
    [queryClient, trpc],
  );
}

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { toUserMessage } from "@/shared/lib/api-error";
import { useInvalidateTaskList } from "./use-invalidate-task-list";

/** Deletes a task and gives visual feedback (toast) for success and failure. */
export function useDeleteTask() {
  const trpc = useTRPC();
  const invalidateList = useInvalidateTaskList();

  return useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: () => toast.success("Task deleted successfully."),
      onError: (error) => toast.error(`Could not delete the task. ${toUserMessage(error)}`),
      // Refetch on success *and* on failure: a NOT_FOUND error means our list was stale.
      onSettled: invalidateList,
    }),
  );
}

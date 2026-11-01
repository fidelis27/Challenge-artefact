import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getFieldErrors, toUserMessage, type ApiError } from "@/shared/lib/api-error";
import { useTRPC } from "@/trpc/client";
import type { TaskFormErrors } from "../domain/task-form";
import { TASK_FIELDS, type TaskFields } from "../domain/task-schema";
import { useInvalidateTaskList } from "./use-invalidate-task-list";

type Options = {
  /** Called when the server rejects specific fields, so the form can show them inline. */
  onFieldErrors: (errors: TaskFormErrors) => void;
};

/**
 * Creates or updates a task (depending on whether an id is given), then goes
 * back to the list. Success and failure feedback is shown with toasts.
 */
export function useSaveTask({ onFieldErrors }: Options) {
  const router = useRouter();
  const trpc = useTRPC();
  const invalidateList = useInvalidateTaskList();

  function handleSuccess(message: string) {
    toast.success(message);
    void invalidateList();
    router.push("/");
  }

  // Validation errors go next to the inputs; anything else (e.g. NOT_FOUND on update) is a toast.
  function handleError(error: ApiError) {
    const fieldErrors = getFieldErrors(error, TASK_FIELDS);
    if (fieldErrors) {
      onFieldErrors(fieldErrors);
      toast.error("Check the form fields.");
      return;
    }
    toast.error(toUserMessage(error));
  }

  const create = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: () => handleSuccess("Task created successfully."),
      onError: handleError,
    }),
  );

  const update = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: () => handleSuccess("Task updated successfully."),
      onError: handleError,
    }),
  );

  return {
    save(fields: TaskFields, existingId?: string) {
      if (existingId) update.mutate({ id: existingId, ...fields });
      else create.mutate(fields);
    },
    isPending: create.isPending || update.isPending,
    /** Stays true after success until the redirect finishes, to prevent a double submit. */
    isLocked: create.isPending || update.isPending || create.isSuccess || update.isSuccess,
  };
}

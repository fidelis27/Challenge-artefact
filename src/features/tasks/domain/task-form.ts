import { firstFieldErrors, type FieldErrors } from "@/shared/lib/api-error";
import { TASK_FIELDS, taskFieldsSchema, type TaskField, type TaskFields } from "./task-schema";

export type TaskFormValues = { title: string; description: string };
export type TaskFormErrors = FieldErrors<TaskField>;

export type ValidationResult =
  | { success: true; data: TaskFields }
  | { success: false; errors: TaskFormErrors };

/**
 * Validates the raw form values with the same schema the server uses,
 * returning either clean data or one message per invalid field.
 */
export function validateTaskForm(values: TaskFormValues): ValidationResult {
  const result = taskFieldsSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    errors: firstFieldErrors(result.error.flatten().fieldErrors, TASK_FIELDS),
  };
}

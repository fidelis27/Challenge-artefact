import { useState, type FormEvent } from "react";
import {
  validateTaskForm,
  type TaskFormErrors,
  type TaskFormValues,
} from "../domain/task-form";
import type { Task } from "../domain/task";
import { useSaveTask } from "./use-save-task";

/**
 * Form state (plain `useState` hooks), client-side validation and submission.
 * Pass a `task` to edit it; omit it to create a new one.
 */
export function useTaskForm(task?: Task) {
  const [values, setValues] = useState<TaskFormValues>({
    title: task?.title ?? "",
    description: task?.description ?? "",
  });
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const { save, isPending, isLocked } = useSaveTask({ onFieldErrors: setErrors });

  /** Returns the change handler for one field and clears that field's error as the user types. */
  function fieldProps(field: keyof TaskFormValues) {
    return {
      value: values[field],
      onChange: (value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
      },
    };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateTaskForm(values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    save(result.data, task?.id);
  }

  return {
    isEditing: Boolean(task),
    errors,
    fieldProps,
    submit,
    isPending,
    isLocked,
  };
}

import { useRef, useState, type FormEvent } from "react";
import type { Task } from "../domain/task";
import {
  validateTaskField,
  validateTaskForm,
  type TaskFormErrors,
  type TaskFormValues,
} from "../domain/task-form";
import { useSaveTask } from "./use-save-task";

type FieldName = keyof TaskFormValues;

/**
 * Form state (plain `useState` hooks), client-side validation and submission.
 * Pass a `task` to edit it; omit it to create a new one.
 *
 * When validation runs:
 * - on blur: the first time the user leaves a field, so they are not scolded while still typing;
 * - on change: once a field has been visited (or has an error), so the message appears and
 *   disappears live as the value becomes invalid or valid;
 * - on submit: every field, and nothing is sent while any of them is invalid.
 */
export function useTaskForm(task?: Task) {
  const [values, setValues] = useState<TaskFormValues>({
    title: task?.title ?? "",
    description: task?.description ?? "",
  });
  const [errors, setErrors] = useState<TaskFormErrors>({});
  // A ref, not state: knowing which fields were visited never needs to re-render by itself.
  const visited = useRef<Partial<Record<FieldName, boolean>>>({});
  const { save, isPending, isLocked } = useSaveTask({ onFieldErrors: setErrors });

  function validateField(field: FieldName, nextValues: TaskFormValues) {
    const message = validateTaskField(field, nextValues);
    setErrors((current) => ({ ...current, [field]: message }));
  }

  /** Props for one field's input: its value plus change and blur handlers. */
  function fieldProps(field: FieldName) {
    return {
      value: values[field],
      onChange: (value: string) => {
        const nextValues = { ...values, [field]: value };
        setValues(nextValues);
        if (visited.current[field] || errors[field]) validateField(field, nextValues);
      },
      onBlur: () => {
        visited.current[field] = true;
        validateField(field, values);
      },
    };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateTaskForm(values);
    if (!result.success) {
      visited.current = { title: true, description: true };
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

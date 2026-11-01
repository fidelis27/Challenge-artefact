"use client";

import Link from "next/link";
import { FormField } from "@/shared/components/form-field";
import type { Task } from "../domain/task";
import { DESCRIPTION_MAX } from "../domain/task-schema";
import { useTaskForm } from "../hooks/use-task-form";
import styles from "./task-form.module.css";

/** One form for both create and edit: pass a `task` to edit it. */
export function TaskForm({ task }: { task?: Task }) {
  const form = useTaskForm(task);
  const title = form.fieldProps("title");
  const description = form.fieldProps("description");

  return (
    // noValidate: we show our own (Zod) messages instead of the browser's native bubbles.
    <form className={styles.form} onSubmit={form.submit} noValidate>
      <FormField id="title" label="Title" required error={form.errors.title}>
        {(controlProps) => (
          <input
            {...controlProps}
            name="title"
            type="text"
            value={title.value}
            onChange={(event) => title.onChange(event.target.value)}
            disabled={form.isLocked}
            autoFocus
          />
        )}
      </FormField>

      <FormField
        id="description"
        label="Description (optional)"
        error={form.errors.description}
        hint={`${description.value.length}/${DESCRIPTION_MAX}`}
      >
        {(controlProps) => (
          <textarea
            {...controlProps}
            name="description"
            rows={5}
            value={description.value}
            onChange={(event) => description.onChange(event.target.value)}
            disabled={form.isLocked}
          />
        )}
      </FormField>

      <div className={styles.actions}>
        <button type="submit" className="button" disabled={form.isLocked}>
          {form.isPending ? "Saving…" : form.isEditing ? "Save changes" : "Create task"}
        </button>
        <Link href="/" className="button buttonSecondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}

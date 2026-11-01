import type { ReactNode } from "react";
import styles from "./form-field.module.css";

/** Accessibility props that the field passes to the control it wraps. */
export type FieldControlProps = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
  "aria-required"?: true;
};

type Props = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  /** Small text below the control, e.g. a character counter. */
  hint?: ReactNode;
  /** Render prop: receives the ids/aria attributes to spread on the input or textarea. */
  children: (controlProps: FieldControlProps) => ReactNode;
};

/**
 * Label + control + error message, wired together for screen readers.
 * It does not care what the control is, so it works for inputs, textareas, selects...
 */
export function FormField({ id, label, required, error, hint, children }: Props) {
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {children({
        id,
        "aria-required": required ? true : undefined,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {hint && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

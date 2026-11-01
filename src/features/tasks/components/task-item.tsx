import Link from "next/link";
import { formatDate } from "@/shared/lib/format";
import type { Task } from "../domain/task";
import styles from "./task-item.module.css";

type Props = {
  task: Task;
  /** This task is being deleted right now. */
  isDeleting: boolean;
  /** Blocks the delete button (e.g. another deletion is in flight). */
  disabled: boolean;
  onDelete: (task: Task) => void;
};

/** Presentational: renders one task and reports clicks. It owns no state and no data fetching. */
export function TaskItem({ task, isDeleting, disabled, onDelete }: Props) {
  return (
    <li className={styles.item} aria-busy={isDeleting}>
      <div className={styles.content}>
        <h2 className={styles.title}>{task.title}</h2>
        {task.description && <p className={styles.description}>{task.description}</p>}
        <time className={styles.date} dateTime={task.createdAt}>
          Created on {formatDate(task.createdAt)}
        </time>
      </div>

      <div className={styles.actions}>
        <Link
          href={`/tasks/${task.id}/edit`}
          className="button buttonSecondary"
          aria-label={`Edit task ${task.title}`}
        >
          Edit
        </Link>
        <button
          type="button"
          className="button buttonDanger"
          disabled={disabled}
          aria-label={`Delete task ${task.title}`}
          onClick={() => onDelete(task)}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}

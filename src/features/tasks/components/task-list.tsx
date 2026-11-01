"use client";

import Link from "next/link";
import { ErrorBanner } from "@/shared/components/error-banner";
import type { Task } from "../domain/task";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useTaskList } from "../hooks/use-task-list";
import { TaskItem } from "./task-item";
import { TaskListSkeleton } from "./task-list-skeleton";
import styles from "./task-list.module.css";

/** Container: wires the data hooks to the presentational pieces. */
export function TaskList() {
  const list = useTaskList();
  const deleteTask = useDeleteTask();

  function handleDelete(task: Task) {
    if (window.confirm(`Delete the task "${task.title}"?`)) {
      deleteTask.mutate({ id: task.id });
    }
  }

  if (list.isLoading) {
    return <TaskListSkeleton />;
  }

  if (list.isError) {
    return (
      <ErrorBanner
        message={`Could not load the tasks. ${list.errorMessage ?? ""}`}
        onRetry={list.refetch}
      />
    );
  }

  if (list.tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.emptyTitle}>No tasks yet</h2>
        <p className={styles.emptyText}>Create your first task to see it here.</p>
        <Link href="/tasks/new" className="button">
          New task
        </Link>
      </div>
    );
  }

  const deletingId = deleteTask.isPending ? deleteTask.variables?.id : undefined;

  return (
    <>
      <p className={styles.summary} aria-live="polite">
        Showing {list.tasks.length} of {list.total} {list.total === 1 ? "task" : "tasks"}
      </p>

      <ul className={styles.list}>
        {list.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isDeleting={deletingId === task.id}
            disabled={deleteTask.isPending}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      {/* Observed by the infinite-scroll hook: reaching it loads the next page. */}
      <div ref={list.sentinelRef} aria-hidden="true" />

      {list.isFetchingNextPage && (
        <p role="status" className={styles.status}>
          Loading more tasks…
        </p>
      )}

      {list.isFetchNextPageError && (
        <ErrorBanner
          message={`Could not load more tasks. ${list.errorMessage ?? ""}`}
          onRetry={list.loadMore}
        />
      )}

      {!list.hasNextPage && <p className={styles.end}>You have reached the end of the list.</p>}
    </>
  );
}

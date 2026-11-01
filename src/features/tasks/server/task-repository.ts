import type { NewTask, Task, TaskPage } from "../domain/task";

export type TaskListQuery = { limit: number; cursor?: number | null };

/**
 * Persistence contract for tasks.
 *
 * The service only knows this interface. Today it is backed by memory
 * (see `in-memory-task-repository.ts`); a database implementation can replace it
 * without touching the service, the router or the UI. Methods are async for that reason.
 */
export interface TaskRepository {
  /** Newest first. */
  list(query: TaskListQuery): Promise<TaskPage>;
  findById(id: string): Promise<Task | undefined>;
  create(data: NewTask): Promise<Task>;
  /** Returns `undefined` when the task does not exist. */
  update(id: string, changes: Pick<Task, "title" | "description">): Promise<Task | undefined>;
  /** Returns `false` when the task does not exist. */
  remove(id: string): Promise<boolean>;
}

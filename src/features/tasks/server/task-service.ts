import type { Task } from "../domain/task";
import { normalizeDescription } from "../domain/task-rules";
import type { TaskFields } from "../domain/task-schema";
import { taskNotFound } from "./task-errors";
import type { TaskListQuery, TaskRepository } from "./task-repository";

/**
 * Application rules for tasks. It depends only on the `TaskRepository` interface
 * and an injectable clock, so it can be tested with fakes and has no idea
 * about tRPC, HTTP or Next.js.
 */
export function createTaskService(
  repository: TaskRepository,
  clock: () => Date = () => new Date(),
) {
  async function getOrThrow(id: string): Promise<Task> {
    const task = await repository.findById(id);
    if (!task) throw taskNotFound(id);
    return task;
  }

  return {
    list: (query: TaskListQuery) => repository.list(query),

    get: getOrThrow,

    create: (fields: TaskFields) =>
      repository.create({
        title: fields.title,
        description: normalizeDescription(fields.description),
        createdAt: clock().toISOString(),
      }),

    async update(id: string, fields: TaskFields) {
      const task = await repository.update(id, {
        title: fields.title,
        description: normalizeDescription(fields.description),
      });
      if (!task) throw taskNotFound(id);
      return task;
    },

    async delete(id: string) {
      if (!(await repository.remove(id))) throw taskNotFound(id);
      return { id };
    },
  };
}

export type TaskService = ReturnType<typeof createTaskService>;

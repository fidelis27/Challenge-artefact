import { randomUUID } from "node:crypto";
import type { NewTask, Task } from "../domain/task";
import { paginate } from "./pagination";
import type { TaskRepository } from "./task-repository";

/** `seq` orders the tasks and doubles as the pagination cursor (see `pagination.ts`). */
type Entry = { seq: number; task: Task };

/**
 * Creates an isolated in-memory repository. State lives in the closure, so each
 * call returns an independent store (handy for tests).
 *
 * @param initial tasks to start with, ordered oldest -> newest
 */
export function createInMemoryTaskRepository(initial: readonly NewTask[] = []): TaskRepository {
  const entries: Entry[] = []; // kept sorted by seq descending (newest first)
  let nextSeq = 1;

  function insert(data: NewTask): Task {
    const task: Task = { id: randomUUID(), ...data };
    entries.unshift({ seq: nextSeq++, task });
    return task;
  }

  const find = (id: string) => entries.find((entry) => entry.task.id === id);

  initial.forEach(insert);

  return {
    async list({ limit, cursor }) {
      const { page, nextCursor } = paginate(entries, limit, cursor);
      return { items: page.map((entry) => entry.task), nextCursor, total: entries.length };
    },

    async findById(id) {
      return find(id)?.task;
    },

    async create(data) {
      return insert(data);
    },

    async update(id, changes) {
      const entry = find(id);
      if (!entry) return undefined;
      entry.task = { ...entry.task, ...changes };
      return entry.task;
    },

    async remove(id) {
      const index = entries.findIndex((entry) => entry.task.id === id);
      if (index === -1) return false;
      entries.splice(index, 1);
      return true;
    },
  };
}

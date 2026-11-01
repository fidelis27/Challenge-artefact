import { createInMemoryTaskRepository } from "./in-memory-task-repository";
import { buildSeedTasks, getSeedCount } from "./seed";
import { createTaskService, type TaskService } from "./task-service";

/**
 * Composition root: the one place that decides which repository the app runs on.
 * To move to a database, change only this file.
 *
 * The instance is cached on `globalThis` on purpose: in `next dev`, modules are
 * re-evaluated on hot reload, and route handlers and server components may live
 * in separate module graphs. A plain module-level `const` would silently reset
 * the list (or give each side its own copy). `globalThis` survives both.
 */
const globalRef = globalThis as unknown as { __taskService?: TaskService };

export const taskService: TaskService = (globalRef.__taskService ??= createTaskService(
  createInMemoryTaskRepository(buildSeedTasks(getSeedCount())),
));

import { publicProcedure, router } from "@/server/trpc";
import { listTasksSchema, taskFieldsSchema, taskIdSchema, updateTaskSchema } from "../domain/task-schema";
import type { TaskService } from "./task-service";

/**
 * Thin transport layer: validates input (Zod) and delegates to the service.
 * It receives the service as an argument so tests can plug in a fresh one.
 */
export function createTaskRouter(service: TaskService) {
  return router({
    /** Cursor-paginated list, newest first. Powers the infinite scroll. */
    list: publicProcedure.input(listTasksSchema).query(({ input }) => service.list(input)),

    /** Single task by id. Used by the edit page. */
    get: publicProcedure.input(taskIdSchema).query(({ input }) => service.get(input.id)),

    create: publicProcedure.input(taskFieldsSchema).mutation(({ input }) => service.create(input)),

    update: publicProcedure.input(updateTaskSchema).mutation(({ input }) => {
      const { id, ...fields } = input;
      return service.update(id, fields);
    }),

    delete: publicProcedure.input(taskIdSchema).mutation(({ input }) => service.delete(input.id)),
  });
}

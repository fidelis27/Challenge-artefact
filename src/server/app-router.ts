import { createTaskRouter } from "@/features/tasks/server/task-router";
import { taskService } from "@/features/tasks/server/task-container";
import { router } from "./trpc";

/** Root router. A new feature adds one line here: `feature: createFeatureRouter(service)`. */
export const appRouter = router({
  task: createTaskRouter(taskService),
});

export type AppRouter = typeof appRouter;

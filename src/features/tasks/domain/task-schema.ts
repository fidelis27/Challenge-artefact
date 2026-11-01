import { z } from "zod";

/**
 * Validation schemas shared by the tRPC router (server) and the task form (client).
 * Keeping a single source of truth means the "title is required" rule can never
 * drift between the two sides.
 */
export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 500;
export const PAGE_SIZE_DEFAULT = 10;
export const PAGE_SIZE_MAX = 50;

export const TASK_FIELDS = ["title", "description"] as const;
export type TaskField = (typeof TASK_FIELDS)[number];

export const taskFieldsSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .trim()
    .min(1, "Title is required.")
    .max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters.`),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, `Description must be at most ${DESCRIPTION_MAX} characters.`)
    .optional(),
});

export const taskIdSchema = z.object({ id: z.string().min(1, "Id is required.") });

export const updateTaskSchema = taskIdSchema.merge(taskFieldsSchema);

export const listTasksSchema = z
  .object({
    limit: z.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
    cursor: z.number().int().nullish(),
  })
  .default({});

export type TaskFields = z.infer<typeof taskFieldsSchema>;

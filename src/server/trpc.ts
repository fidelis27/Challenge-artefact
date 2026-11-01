import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

/**
 * There is no auth or per-request data in this challenge, so the context is
 * empty. It is still a function so that adding e.g. a session later does not
 * change any call site.
 */
export const createTRPCContext = async () => ({});
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  // Expose Zod field errors to the client so forms can show them next to the inputs.
  errorFormatter({ shape, error }) {
    const zodError = error.cause instanceof ZodError ? error.cause : null;

    return {
      ...shape,
      message: zodError ? zodError.issues.map((issue) => issue.message).join(" ") : shape.message,
      data: {
        ...shape.data,
        zodError: zodError ? zodError.flatten() : null,
      },
    };
  },
});

const timing = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();

  if (process.env.NODE_ENV !== "test") {
    const status = result.ok ? "ok" : `error ${result.error.code}`;
    console.info(`[trpc] ${type} ${path} ${status} ${Date.now() - start}ms`);
  }

  return result;
});

export const router = t.router;
// This is the extension point for auth or rate limiting (e.g. protectedProcedure.use(isAuthed)).
export const publicProcedure = t.procedure.use(timing);
export const createCallerFactory = t.createCallerFactory;

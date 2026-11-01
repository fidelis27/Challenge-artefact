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
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/app-router";
import { createTRPCContext } from "@/server/trpc";

// The in-memory store lives in the Node.js process, so this must not run on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };

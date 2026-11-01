import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache, type ReactNode } from "react";
import { appRouter } from "@/server/app-router";
import { createCallerFactory, createTRPCContext } from "@/server/trpc";
import { makeQueryClient } from "./query-client";

/** One QueryClient per request (React `cache` scopes it to the current render). */
export const getQueryClient = cache(makeQueryClient);

/**
 * Server-side tRPC. Calls the router in-process: no HTTP round trip to ourselves.
 * Used to prefetch queries that the client components then hydrate.
 */
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

/** Ships the prefetched cache to the browser so client components start with data. */
export function HydrateClient({ children }: { children: ReactNode }) {
  return <HydrationBoundary state={dehydrate(getQueryClient())}>{children}</HydrationBoundary>;
}

/** Direct, in-process caller for server code that needs a value (not a cached query). */
export async function getServerCaller() {
  return createCallerFactory(appRouter)(await createTRPCContext());
}

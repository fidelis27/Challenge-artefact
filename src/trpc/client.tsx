"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState, type ReactNode } from "react";
import type { AppRouter } from "@/server/app-router";
import { makeQueryClient } from "./query-client";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  // Server: always a new client, so data is never shared between requests.
  if (typeof window === "undefined") return makeQueryClient();
  // Browser: a singleton, so React suspending during the initial render
  // does not throw the cache away.
  return (browserQueryClient ??= makeQueryClient());
}

function getUrl(): string {
  const base =
    typeof window !== "undefined"
      ? ""
      : (process.env.NEXT_PUBLIC_APP_URL ?? `http://localhost:${process.env.PORT ?? 3000}`);
  return `${base}/api/trpc`;
}

export function TRPCReactProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: getUrl() })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

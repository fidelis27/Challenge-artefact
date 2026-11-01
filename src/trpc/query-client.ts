import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, a non-zero staleTime avoids refetching right after hydration.
        // Mutations invalidate the list explicitly, so data never stays stale after a change.
        staleTime: 30 * 1000,
      },
    },
  });
}

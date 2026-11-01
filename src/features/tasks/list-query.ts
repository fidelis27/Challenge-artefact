import { PAGE_SIZE_DEFAULT } from "./domain/task-schema";

/**
 * The server prefetches the first page with exactly this input, and the client
 * `useInfiniteQuery` uses it too. The query keys must match for the SSR data to
 * be picked up (hydrated) instead of being fetched again.
 */
export const LIST_INPUT = { limit: PAGE_SIZE_DEFAULT } as const;

/** `undefined` tells TanStack Query there are no more pages. */
export const getNextPageParam = (lastPage: { nextCursor: number | null }) =>
  lastPage.nextCursor ?? undefined;

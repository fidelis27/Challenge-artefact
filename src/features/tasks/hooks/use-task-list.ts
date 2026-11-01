import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
import { useTRPC } from "@/trpc/client";
import { LIST_INPUT, getNextPageParam } from "../list-query";

/**
 * Everything the list needs: the flattened tasks, loading/error states and the
 * infinite-scroll sentinel. It starts with the page prefetched on the server (SSR);
 * later pages are fetched as the user scrolls.
 */
export function useTaskList() {
  const trpc = useTRPC();
  const query = useInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(LIST_INPUT, { getNextPageParam }),
  );

  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;

  const loadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  // After a failed page fetch we stop auto-loading and let the user retry with
  // a button, otherwise the observer would keep hitting a failing endpoint.
  const sentinelRef = useInfiniteScroll({
    enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    onLoadMore: loadMore,
  });

  const tasks = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  return {
    tasks,
    total: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    errorMessage: query.error?.message,
    refetch: () => void refetch(),
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    loadMore,
    sentinelRef,
  };
}

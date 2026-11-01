import { useEffect, useRef } from "react";

type Options = {
  /** When false, nothing is observed (no next page, already loading, or last load failed). */
  enabled: boolean;
  /** Must be referentially stable (wrap in `useCallback`), or the observer is recreated on every render. */
  onLoadMore: () => void;
  /** Start loading before the sentinel is actually visible. */
  rootMargin?: string;
};

/**
 * Calls `onLoadMore` whenever the returned ref's element scrolls into view.
 * Attach the ref to an empty element placed after the last list item.
 */
export function useInfiniteScroll({ enabled, onLoadMore, rootMargin = "200px" }: Options) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, onLoadMore, rootMargin]);

  return sentinelRef;
}

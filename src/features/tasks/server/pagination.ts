/**
 * Cursor pagination over a list sorted by `seq` descending (newest first).
 *
 * The cursor is the `seq` of the last item of the previous page; the next page
 * contains the items with a smaller `seq`. Unlike an offset or the id of the
 * last item, it stays valid if items are created or deleted between requests.
 */
export function paginate<T extends { seq: number }>(
  sortedBySeqDesc: readonly T[],
  limit: number,
  cursor?: number | null,
): { page: T[]; nextCursor: number | null } {
  const remaining =
    cursor == null ? sortedBySeqDesc : sortedBySeqDesc.filter((item) => item.seq < cursor);
  const page = remaining.slice(0, limit);
  const hasMore = remaining.length > limit;

  return { page, nextCursor: hasMore ? page[page.length - 1].seq : null };
}

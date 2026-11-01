import { describe, expect, it } from "vitest";
import { paginate } from "./pagination";

// Newest first, like the repository keeps them.
const items = [5, 4, 3, 2, 1].map((seq) => ({ seq }));

describe("paginate", () => {
  it("returns the first page and a cursor when there is more", () => {
    const { page, nextCursor } = paginate(items, 2);
    expect(page.map((i) => i.seq)).toEqual([5, 4]);
    expect(nextCursor).toBe(4);
  });

  it("continues after the cursor", () => {
    const { page, nextCursor } = paginate(items, 2, 4);
    expect(page.map((i) => i.seq)).toEqual([3, 2]);
    expect(nextCursor).toBe(2);
  });

  it("has no next cursor on the last page", () => {
    const { page, nextCursor } = paginate(items, 2, 2);
    expect(page.map((i) => i.seq)).toEqual([1]);
    expect(nextCursor).toBeNull();
  });

  it("has no next cursor when the page is exactly full and nothing remains", () => {
    expect(paginate(items, 5).nextCursor).toBeNull();
  });

  it("works with a cursor that points to an item that no longer exists", () => {
    const withoutThree = items.filter((i) => i.seq !== 3);
    const { page } = paginate(withoutThree, 2, 3);
    expect(page.map((i) => i.seq)).toEqual([2, 1]);
  });

  it("handles an empty list", () => {
    expect(paginate([], 10)).toEqual({ page: [], nextCursor: null });
  });
});

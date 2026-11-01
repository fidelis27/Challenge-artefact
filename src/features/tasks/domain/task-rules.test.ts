import { describe, expect, it } from "vitest";
import { normalizeDescription } from "./task-rules";

describe("normalizeDescription", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeDescription("  hello  ")).toBe("hello");
  });

  it("turns empty and whitespace-only values into undefined", () => {
    expect(normalizeDescription("")).toBeUndefined();
    expect(normalizeDescription("   ")).toBeUndefined();
    expect(normalizeDescription(undefined)).toBeUndefined();
  });
});

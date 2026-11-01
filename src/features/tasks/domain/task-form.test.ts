import { describe, expect, it } from "vitest";
import { validateTaskForm } from "./task-form";
import { DESCRIPTION_MAX, TITLE_MAX } from "./task-schema";

describe("validateTaskForm", () => {
  it("accepts valid values and returns trimmed data", () => {
    const result = validateTaskForm({ title: "  Write tests ", description: "" });
    expect(result).toEqual({ success: true, data: { title: "Write tests", description: "" } });
  });

  it("requires a title", () => {
    const result = validateTaskForm({ title: "", description: "" });
    expect(result).toEqual({ success: false, errors: { title: "Title is required." } });
  });

  it("treats a whitespace-only title as empty", () => {
    const result = validateTaskForm({ title: "   ", description: "" });
    expect(result.success).toBe(false);
  });

  it("limits the title length", () => {
    const result = validateTaskForm({ title: "x".repeat(TITLE_MAX + 1), description: "" });
    expect(result).toMatchObject({ success: false, errors: { title: expect.any(String) } });
  });

  it("limits the description length and reports every invalid field", () => {
    const result = validateTaskForm({ title: "", description: "x".repeat(DESCRIPTION_MAX + 1) });
    expect(result).toMatchObject({
      success: false,
      errors: { title: expect.any(String), description: expect.any(String) },
    });
  });
});

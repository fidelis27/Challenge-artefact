import { describe, expect, it } from "vitest";
import { validateTaskField, validateTaskForm } from "./task-form";
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

describe("validateTaskField", () => {
  const valid = { title: "Write tests", description: "" };

  it("returns undefined for a valid field", () => {
    expect(validateTaskField("title", valid)).toBeUndefined();
    expect(validateTaskField("description", valid)).toBeUndefined();
  });

  it("returns only the message of the requested field", () => {
    const values = { title: "", description: "x".repeat(DESCRIPTION_MAX + 1) };
    expect(validateTaskField("title", values)).toBe("Title is required.");
    expect(validateTaskField("description", values)).toContain(String(DESCRIPTION_MAX));
  });

  it("does not report another field's problem", () => {
    // The title is empty, but we only ask about the description.
    expect(validateTaskField("description", { title: "", description: "ok" })).toBeUndefined();
  });

  it("reports the length limit of the title", () => {
    const message = validateTaskField("title", {
      title: "x".repeat(TITLE_MAX + 1),
      description: "",
    });
    expect(message).toContain(String(TITLE_MAX));
  });
});

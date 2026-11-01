import { describe, expect, it } from "vitest";
import { firstFieldErrors, getFieldErrors, toUserMessage } from "./api-error";

const FIELDS = ["title", "description"] as const;

describe("firstFieldErrors", () => {
  it("keeps the first message of each known field and ignores unknown ones", () => {
    expect(
      firstFieldErrors({ title: ["a", "b"], other: ["x"], description: undefined }, FIELDS),
    ).toEqual({ title: "a" });
  });
});

describe("getFieldErrors", () => {
  it("extracts validation errors sent by the server", () => {
    const error = { message: "x", data: { zodError: { fieldErrors: { title: ["Required"] } } } };
    expect(getFieldErrors(error, FIELDS)).toEqual({ title: "Required" });
  });

  it("returns null for errors that are not validation errors", () => {
    expect(getFieldErrors({ message: "Not found", data: { zodError: null } }, FIELDS)).toBeNull();
    expect(getFieldErrors({ message: "Network down" }, FIELDS)).toBeNull();
  });
});

describe("toUserMessage", () => {
  it("maps NOT_FOUND to a task-specific message", () => {
    expect(toUserMessage({ message: "technical details", data: { code: "NOT_FOUND" } })).toBe(
      "This task no longer exists. The list was updated.",
    );
  });

  it("maps BAD_REQUEST to a form message", () => {
    expect(toUserMessage({ message: "technical details", data: { code: "BAD_REQUEST" } })).toBe(
      "Please check the highlighted fields.",
    );
  });

  it("maps errors without data to a connection message", () => {
    expect(toUserMessage({ message: "network failure" })).toBe(
      "Could not reach the server. Check your connection.",
    );
  });

  it("maps other codes to a generic message", () => {
    expect(toUserMessage({ message: "technical details", data: { code: "INTERNAL_SERVER_ERROR" } })).toBe(
      "Something went wrong. Please try again.",
    );
  });
});

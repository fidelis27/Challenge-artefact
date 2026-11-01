import { describe, expect, it } from "vitest";
import { firstFieldErrors, getFieldErrors } from "./api-error";

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

import { describe, expect, it } from "vitest";
import { buildSeedTasks, getSeedCount } from "./seed";

describe("getSeedCount", () => {
  it("defaults to 25", () => {
    expect(getSeedCount({})).toBe(25);
  });

  it("reads SEED_TASKS, including 0", () => {
    expect(getSeedCount({ SEED_TASKS: "5" })).toBe(5);
    expect(getSeedCount({ SEED_TASKS: "0" })).toBe(0);
  });

  it("falls back to the default for invalid values", () => {
    expect(getSeedCount({ SEED_TASKS: "abc" })).toBe(25);
    expect(getSeedCount({ SEED_TASKS: "-3" })).toBe(25);
  });
});

describe("buildSeedTasks", () => {
  it("builds tasks ordered oldest -> newest", () => {
    const tasks = buildSeedTasks(3, 1_000_000);
    expect(tasks.map((t) => t.title)).toEqual(["Sample task 3", "Sample task 2", "Sample task 1"]);
    const times = tasks.map((t) => new Date(t.createdAt).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });
});

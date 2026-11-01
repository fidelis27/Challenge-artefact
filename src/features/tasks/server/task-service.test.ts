import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryTaskRepository } from "./in-memory-task-repository";
import { createTaskService, type TaskService } from "./task-service";

const FIXED_NOW = new Date("2026-10-31T12:00:00.000Z");

describe("task service", () => {
  let service: TaskService;

  // A fresh repository per test: no shared state, no reset helpers needed.
  beforeEach(() => {
    service = createTaskService(createInMemoryTaskRepository(), () => FIXED_NOW);
  });

  it("stamps new tasks with the injected clock", async () => {
    const task = await service.create({ title: "A" });
    expect(task.createdAt).toBe(FIXED_NOW.toISOString());
  });

  it("normalizes the description on create and update", async () => {
    const created = await service.create({ title: "A", description: "   " });
    expect(created.description).toBeUndefined();

    const updated = await service.update(created.id, { title: "A", description: " new " });
    expect(updated.description).toBe("new");
  });

  it("keeps id and creation date when updating", async () => {
    const created = await service.create({ title: "before" });
    const updated = await service.update(created.id, { title: "after" });
    expect(updated).toMatchObject({
      id: created.id,
      title: "after",
      createdAt: created.createdAt,
    });
  });

  it("throws NOT_FOUND with a meaningful message for unknown ids", async () => {
    const expected = { code: "NOT_FOUND", message: expect.stringContaining("Task not found") };
    await expect(service.get("missing")).rejects.toMatchObject(expected);
    await expect(service.update("missing", { title: "x" })).rejects.toMatchObject(expected);
    await expect(service.delete("missing")).rejects.toMatchObject(expected);
  });

  it("returns NOT_FOUND when deleting the same task twice", async () => {
    const task = await service.create({ title: "A" });
    await service.delete(task.id);
    await expect(service.delete(task.id)).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("lists newest first and reports the total", async () => {
    await service.create({ title: "first" });
    await service.create({ title: "second" });

    const page = await service.list({ limit: 10 });
    expect(page.items.map((t) => t.title)).toEqual(["second", "first"]);
    expect(page.total).toBe(2);
  });

  it("pages through every task exactly once, even if the last item of a page is deleted", async () => {
    for (let i = 1; i <= 5; i++) await service.create({ title: `t${i}` });

    const first = await service.list({ limit: 2 }); // t5, t4
    await service.delete(first.items[first.items.length - 1].id);

    const second = await service.list({ limit: 2, cursor: first.nextCursor });
    expect(second.items.map((t) => t.title)).toEqual(["t3", "t2"]);
  });
});

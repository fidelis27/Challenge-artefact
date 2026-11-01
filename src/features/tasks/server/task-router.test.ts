import { beforeEach, describe, expect, it } from "vitest";
import { createCallerFactory, router } from "@/server/trpc";
import { createInMemoryTaskRepository } from "./in-memory-task-repository";
import { createTaskRouter } from "./task-router";
import { createTaskService } from "./task-service";

/** A caller backed by a brand-new, empty repository: tests never share state. */
function buildApi() {
  const service = createTaskService(createInMemoryTaskRepository());
  const testRouter = router({ task: createTaskRouter(service) });
  return createCallerFactory(testRouter)({}).task;
}

/** Router tests cover the transport layer: input validation and error codes. */
describe("task router", () => {
  let api: ReturnType<typeof buildApi>;

  beforeEach(() => {
    api = buildApi();
  });

  it("creates a task", async () => {
    const task = await api.create({ title: "  Study tRPC  ", description: "Chapter 1" });
    expect(task).toMatchObject({ title: "Study tRPC", description: "Chapter 1" });
    expect(task.id).toBeTruthy();
    expect(new Date(task.createdAt).toISOString()).toBe(task.createdAt);
  });

  it("rejects a missing title", async () => {
    // @ts-expect-error: simulating a client that skipped the required field
    await expect(api.create({})).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects an empty or whitespace-only title", async () => {
    await expect(api.create({ title: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(api.create({ title: "   " })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects an empty title on update", async () => {
    const task = await api.create({ title: "ok" });
    await expect(api.update({ id: task.id, title: " " })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("rejects invalid pagination input", async () => {
    await expect(api.list({ limit: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(api.list({ limit: 1000 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("maps a missing task to NOT_FOUND on get, update and delete", async () => {
    await expect(api.get({ id: "nope" })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(api.update({ id: "nope", title: "x" })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    await expect(api.delete({ id: "nope" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("runs the full CRUD cycle", async () => {
    const created = await api.create({ title: "cycle" });
    expect(await api.get({ id: created.id })).toEqual(created);

    const updated = await api.update({ id: created.id, title: "cycle 2" });
    expect(updated.title).toBe("cycle 2");

    await api.delete({ id: created.id });
    expect((await api.list({})).items).toHaveLength(0);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestContext } from "~/tests/helpers/trpc";

type TasksCaller = Awaited<ReturnType<typeof createTasksCaller>>;

async function createTasksCaller() {
  vi.resetModules();
  const { tasksRouter } = await import("~/trpc/routers/tasks");

  return tasksRouter.createCaller(createTestContext());
}

describe("trpc/routers/tasks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with an empty task list", async () => {
    const caller = await createTasksCaller();

    await expect(caller.list()).resolves.toEqual([]);
  });

  it("creates tasks and lists the newest task first", async () => {
    const caller = await createTasksCaller();

    vi.setSystemTime(new Date("2026-05-01T01:00:00.000Z"));
    const first = await caller.create({ title: "Add app tests" });

    vi.setSystemTime(new Date("2026-05-01T01:01:00.000Z"));
    const second = await caller.create({ title: "Add server tests" });

    expect(first).toMatchObject({
      title: "Add app tests",
      completed: false,
      createdAt: "2026-05-01T01:00:00.000Z",
    });
    expect(second).toMatchObject({
      title: "Add server tests",
      completed: false,
      createdAt: "2026-05-01T01:01:00.000Z",
    });
    expect(first.id).not.toBe(second.id);

    await expect(caller.list()).resolves.toEqual([second, first]);
  });

  it("toggles and deletes existing tasks", async () => {
    const caller: TasksCaller = await createTasksCaller();
    const task = await caller.create({ title: "Exercise mutations" });

    await expect(caller.toggle({ id: task.id })).resolves.toMatchObject({
      id: task.id,
      completed: true,
    });

    await expect(caller.delete({ id: task.id })).resolves.toEqual({
      id: task.id,
    });
    await expect(caller.list()).resolves.toEqual([]);
  });

  it("rejects invalid task mutations", async () => {
    const caller = await createTasksCaller();

    await expect(caller.create({ title: "" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
    await expect(caller.toggle({ id: "missing-task" })).rejects.toThrow("Task not found");
    await expect(caller.delete({ id: "missing-task" })).rejects.toThrow("Task not found");
  });
});

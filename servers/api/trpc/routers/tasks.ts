import { z } from "zod";

import { type Task, createTaskSchema } from "@repo/contracts";

import { requireFound } from "../errors";
import { publicProcedure, router } from "../init";

const tasks = new Map<string, Task>();

export const tasksRouter = router({
  list: publicProcedure.query(() => [...tasks.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),

  create: publicProcedure.input(createTaskSchema).mutation(({ input }) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.set(task.id, task);
    return task;
  }),

  toggle: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    const task = requireFound(tasks.get(input.id), "Task not found");
    task.completed = !task.completed;
    return task;
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    requireFound(tasks.get(input.id), "Task not found");
    tasks.delete(input.id);
    return { id: input.id };
  }),
});

import { z } from "zod";

import { publicProcedure, router } from "../init";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const tasks = new Map<string, Task>();

export const tasksRouter = router({
  list: publicProcedure.query(() => [...tasks.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),

  create: publicProcedure.input(z.object({ title: z.string().min(1, "Title is required") })).mutation(({ input }) => {
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
    const task = tasks.get(input.id);
    if (!task) throw new Error("Task not found");
    task.completed = !task.completed;
    return task;
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    const deleted = tasks.delete(input.id);
    if (!deleted) throw new Error("Task not found");
    return { id: input.id };
  }),
});

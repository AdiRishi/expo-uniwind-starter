import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

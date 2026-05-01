import { createTaskSchema } from "@/schemas/task";

describe("createTaskSchema", () => {
  test("accepts a task title", () => {
    expect(createTaskSchema.parse({ title: "Write tests" })).toEqual({ title: "Write tests" });
  });

  test("rejects an empty task title", () => {
    expect(createTaskSchema.safeParse({ title: "" }).success).toBe(false);
  });
});

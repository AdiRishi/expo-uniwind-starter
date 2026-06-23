import type { Task } from "@/schemas/task";

// Builders provide boring valid defaults while keeping scenario-defining fields
// visible in each test. Prefer createTaskMock({ completed: true }) over shared
// fixtures whose hidden defaults become part of the test by accident.
export function createTaskMock(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Keep the starter testable",
    completed: false,
    createdAt: "2026-05-01T00:00:00.000Z",
    ...overrides,
  };
}

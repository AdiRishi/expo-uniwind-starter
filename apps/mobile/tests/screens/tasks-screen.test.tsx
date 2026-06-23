import { fireEvent, waitFor } from "@testing-library/react-native";
import { createTaskMock } from "@tests/testing-utils/builders";
import { renderWithTestProviders } from "@tests/testing-utils/render-with-test-providers";
import { mergeTrpcMocks, trpcMutation, trpcQuery } from "@tests/testing-utils/trpc-test-utils";

import type { Task } from "@/schemas/task";
import { TasksScreen } from "@/screens/tasks-screen";

jest.mock("expo-router", () => ({
  useFocusEffect: (callback: () => void | (() => void)) => callback(),
}));

describe("<TasksScreen />", () => {
  test("loads tasks through tRPC and shows a newly-created task after the list refetches", async () => {
    const tasks: Task[] = [createTaskMock()];

    const { findByText, getByPlaceholderText, getByText, trpc } = renderWithTestProviders(<TasksScreen />, {
      trpc: mergeTrpcMocks(
        trpcQuery("tasks.list", () => [...tasks]),
        trpcMutation("tasks.create", (input) => {
          const task = createTaskMock({
            id: "task-2",
            title: input.title,
            createdAt: "2026-05-01T00:01:00.000Z",
          });
          tasks.unshift(task);
          return task;
        }),
      ),
    });

    await findByText("Keep the starter testable");

    fireEvent.changeText(getByPlaceholderText("What needs to be done?"), "Write a focused test");
    fireEvent.press(getByText("Add Task"));

    await waitFor(() => {
      expect(trpc.getCalls("tasks.create")).toEqual([
        {
          type: "mutation",
          path: "tasks.create",
          input: { title: "Write a focused test" },
        },
      ]);
    });

    await findByText("Write a focused test");
  });
});

import { fireEvent, waitFor } from "@testing-library/react-native";
import { renderWithTestProviders } from "@tests/testing-utils/render-with-test-providers";
import { mergeTrpcMocks, trpcMutation, trpcQuery } from "@tests/testing-utils/trpc-test-utils";

import { TasksScreen } from "@/screens/tasks-screen";

describe("<TasksScreen />", () => {
  test("loads tasks through tRPC and creates a task through the form", async () => {
    const { findByText, getByPlaceholderText, getByText, trpc } = renderWithTestProviders(<TasksScreen />, {
      trpc: mergeTrpcMocks(
        trpcQuery("tasks.list", [
          {
            id: "task-1",
            title: "Keep the starter testable",
            completed: false,
            createdAt: "2026-05-01T00:00:00.000Z",
          },
        ]),
        trpcMutation("tasks.create", (input: unknown) => ({
          id: "task-2",
          title: (input as { title: string }).title,
          completed: false,
          createdAt: "2026-05-01T00:01:00.000Z",
        })),
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
  });
});

import { fireEvent, render } from "@testing-library/react-native";
import { createTaskMock } from "@tests/testing-utils/builders";

import { TaskList } from "@/components/screens/tasks/task-list";

describe("<TaskList />", () => {
  test("shows an empty state when there are no tasks", () => {
    const { getByText } = render(<TaskList tasks={[]} onToggle={jest.fn()} onDelete={jest.fn()} />);

    getByText("No tasks yet. Add one above!");
    getByText("Tasks are stored in-memory and reset on server restart.");
  });

  test("renders tasks and exposes toggle and delete actions", () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    const { getByLabelText, getByText } = render(
      <TaskList
        tasks={[
          createTaskMock({ id: "task-1", title: "Set up tests", completed: false }),
          createTaskMock({ id: "task-2", title: "Ship starter", completed: true }),
        ]}
        onToggle={onToggle}
        onDelete={onDelete}
      />,
    );

    getByText("Set up tests");
    getByText("Ship starter");

    fireEvent.press(getByLabelText("Mark Set up tests complete"));
    fireEvent.press(getByLabelText("Delete Set up tests"));

    expect(onToggle).toHaveBeenCalledWith("task-1");
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });
});

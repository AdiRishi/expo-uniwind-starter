import { Card, Separator } from "heroui-native";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";

import { EmptyTaskCard } from "./empty-task-card";
import { TaskItem } from "./task-item";

export function TaskList({
  tasks,
  onToggle,
  onDelete,
}: {
  tasks: { id: string; title: string; completed: boolean }[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View className="gap-3 px-4">
      {tasks.length === 0 ? (
        <EmptyTaskCard />
      ) : (
        <Card>
          <Card.Body className="p-0">
            {tasks.map((task, index) => (
              <View key={task.id}>
                {index > 0 && <Separator />}
                <TaskItem
                  id={task.id}
                  title={task.title}
                  completed={task.completed}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              </View>
            ))}
          </Card.Body>
        </Card>
      )}

      <Typography variant="caption" tone="muted" align="center">
        Tasks are stored in-memory and reset on server restart.
      </Typography>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Checkbox, Separator, useThemeColor } from "heroui-native";
import { useMemo } from "react";
import { View } from "react-native";

import { FormScrollView } from "@/components/ui/screen-containers/form-scroll-view";
import { Typography } from "@/components/ui/typography";
import { formOptions, useAppForm } from "@/hooks/form/use-app-form";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { useTRPC } from "@/lib/trpc";
import { createTaskSchema } from "@/schemas/task";

export function TasksScreen() {
  const trpc = useTRPC();
  useRefreshOnFocus(trpc.tasks.pathKey());
  const queryClient = useQueryClient();
  const listQueryOptions = trpc.tasks.list.queryOptions();
  const { data: tasks = [] } = useQuery(listQueryOptions);

  const invalidateList = () => queryClient.invalidateQueries(listQueryOptions);

  const createMutation = useMutation(trpc.tasks.create.mutationOptions({ onSuccess: invalidateList }));
  const toggleMutation = useMutation(trpc.tasks.toggle.mutationOptions({ onSuccess: invalidateList }));
  const deleteMutation = useMutation(trpc.tasks.delete.mutationOptions({ onSuccess: invalidateList }));

  return (
    <FormScrollView className="flex-1" contentContainerClassName="gap-8 pb-8 pt-12">
      <TasksHeader />
      <CreateTaskForm onSubmit={(title) => createMutation.mutateAsync({ title })} />
      <TaskList
        tasks={tasks}
        onToggle={(id) => toggleMutation.mutate({ id })}
        onDelete={(id) => deleteMutation.mutate({ id })}
      />
    </FormScrollView>
  );
}

function TasksHeader() {
  return (
    <View className="items-center gap-3">
      <Typography variant="h2" align="center">
        Tasks
      </Typography>
      <Typography variant="small" tone="muted" align="center">
        Tanstack Form + tRPC mutations with type-safe validation.
      </Typography>
    </View>
  );
}

function CreateTaskForm({ onSubmit }: { onSubmit: (title: string) => Promise<unknown> }) {
  const createTaskFormOptions = useMemo(
    () =>
      formOptions({
        defaultValues: {
          title: "",
        },
        validators: {
          onSubmit: createTaskSchema,
          onChange: createTaskSchema,
        },
      }),
    [],
  );

  const form = useAppForm({
    ...createTaskFormOptions,
    async onSubmit({ value, formApi }) {
      try {
        await onSubmit(value.title);
        formApi.reset();
      } catch {
        formApi.setErrorMap({
          onSubmit: { form: "Failed to create task. Is the server running?", fields: {} },
        });
      }
    },
  });

  return (
    <View className="gap-4 px-4">
      <form.AppForm>
        <form.FormError />
      </form.AppForm>

      <form.AppField name="title">
        {(field) => (
          <field.TextField
            label="Task title"
            placeholder="What needs to be done?"
            returnKeyType="done"
            onSubmitEditing={() => void form.handleSubmit()}
          />
        )}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton label="Add Task" loadingLabel="Adding..." />
      </form.AppForm>
    </View>
  );
}

function TaskList({
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

function EmptyTaskCard() {
  return (
    <Card variant="tertiary">
      <Card.Body className="items-center py-8">
        <Typography variant="small" tone="muted">
          No tasks yet. Add one above!
        </Typography>
      </Card.Body>
    </Card>
  );
}

function TaskItem({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}: {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [dangerColor] = useThemeColor(["danger"]);

  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <Checkbox isSelected={completed} onSelectedChange={() => onToggle(id)} />
      <Typography variant="small" className={`flex-1 ${completed ? "text-muted line-through" : ""}`}>
        {title}
      </Typography>
      <Button isIconOnly variant="ghost" size="sm" onPress={() => onDelete(id)}>
        <Ionicons name="trash-outline" size={16} color={dangerColor} />
      </Button>
    </View>
  );
}

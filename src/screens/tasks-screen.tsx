import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Checkbox, Separator, useThemeColor } from "heroui-native";
import { Pressable, View } from "react-native";

import { FormScrollView } from "@/components/ui/screen-containers/form-scroll-view";
import { Typography } from "@/components/ui/typography";
import { formOptions, useAppForm } from "@/hooks/form/use-app-form";
import { useTRPC } from "@/lib/trpc";
import { createTaskSchema } from "@/schemas/task";

const createTaskFormOptions = formOptions({
  defaultValues: {
    title: "",
  },
  validators: {
    onSubmit: createTaskSchema,
    onChange: createTaskSchema,
  },
});

export function TasksScreen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const listQueryOptions = trpc.tasks.list.queryOptions();
  const { data: tasks = [] } = useQuery(listQueryOptions);

  const createMutation = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(listQueryOptions),
    }),
  );

  const toggleMutation = useMutation(
    trpc.tasks.toggle.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(listQueryOptions),
    }),
  );

  const deleteMutation = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(listQueryOptions),
    }),
  );

  const form = useAppForm({
    ...createTaskFormOptions,
    async onSubmit({ value, formApi }) {
      try {
        await createMutation.mutateAsync({ title: value.title });
        formApi.reset();
      } catch {
        formApi.setErrorMap({
          onSubmit: { form: "Failed to create task. Is the server running?", fields: {} },
        });
      }
    },
  });

  return (
    <FormScrollView className="flex-1" contentContainerClassName="gap-8 pt-12">
      <View className="items-center gap-3">
        <Typography variant="h2" align="center">
          Tasks
        </Typography>
        <Typography variant="small" tone="muted" align="center">
          Tanstack Form + tRPC mutations with type-safe validation.
        </Typography>
      </View>

      {/* ── Create form ──────────────────────────────── */}
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

      {/* ── Task list ────────────────────────────────── */}
      <View className="gap-3 px-4 pb-8">
        {tasks.length === 0 ? (
          <Card variant="tertiary">
            <Card.Body className="items-center p-6">
              <Typography variant="small" tone="muted">
                No tasks yet. Add one above!
              </Typography>
            </Card.Body>
          </Card>
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
                    onToggle={(id) => toggleMutation.mutate({ id })}
                    onDelete={(id) => deleteMutation.mutate({ id })}
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
    </FormScrollView>
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
    <View className="flex-row items-center gap-3 px-4 py-3">
      <Checkbox isSelected={completed} onSelectedChange={() => onToggle(id)} />
      <Typography variant="body" className={`flex-1 ${completed ? "text-muted line-through" : ""}`}>
        {title}
      </Typography>
      <Pressable onPress={() => onDelete(id)} hitSlop={8}>
        <Ionicons name="trash-outline" size={18} color={dangerColor} />
      </Pressable>
    </View>
  );
}

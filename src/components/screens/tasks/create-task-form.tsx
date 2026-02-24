import { useMemo } from "react";
import { View } from "react-native";

import { formOptions, useAppForm } from "@/hooks/form/use-app-form";
import { createTaskSchema } from "@/schemas/task";

export function CreateTaskForm({ onSubmit }: { onSubmit: (title: string) => Promise<unknown> }) {
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

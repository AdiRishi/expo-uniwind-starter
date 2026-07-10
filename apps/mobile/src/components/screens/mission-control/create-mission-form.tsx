import { Button, Card } from "heroui-native";
import { useMemo, useState } from "react";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { formOptions, useAppForm } from "@/hooks/form/use-app-form";
import { getSuggestedTargetDate } from "@/lib/mission-control";
import { createMissionSchema, type CreateMissionInput } from "@/schemas/mission-control";

export function CreateMissionForm({ onSubmit }: { onSubmit: (input: CreateMissionInput) => Promise<unknown> }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formConfig = useMemo(
    () =>
      formOptions({
        defaultValues: {
          title: "",
          objective: "",
          owner: "",
          targetDate: getSuggestedTargetDate(),
        },
        validators: {
          onChange: createMissionSchema,
          onSubmit: createMissionSchema,
        },
      }),
    [],
  );

  const form = useAppForm({
    ...formConfig,
    async onSubmit({ value, formApi }) {
      try {
        await onSubmit({ ...value, confidence: 3 });
        formApi.reset();
        setIsExpanded(false);
      } catch {
        formApi.setErrorMap({
          onSubmit: { form: "Mission creation failed. Confirm the API server is available and try again.", fields: {} },
        });
      }
    },
  });

  if (!isExpanded) {
    return (
      <View className="px-4">
        <Button variant="primary" onPress={() => setIsExpanded(true)}>
          Create a mission
        </Button>
      </View>
    );
  }

  return (
    <View className="px-4">
      <Card className="gap-5 p-5">
        <View className="gap-1">
          <Typography variant="h3">Frame a new mission</Typography>
          <Typography variant="small" tone="muted">
            Mission Control will create one checkpoint for each delivery stage.
          </Typography>
        </View>

        <form.AppForm>
          <form.FormError />
        </form.AppForm>

        <form.AppField name="title">
          {(field) => <field.TextField label="Mission title" placeholder="Launch the self-serve workspace" />}
        </form.AppField>

        <form.AppField name="objective">
          {(field) => (
            <field.TextField
              label="Outcome"
              placeholder="Describe the customer or business change this mission should create"
              multiline
              numberOfLines={4}
            />
          )}
        </form.AppField>

        <View className="gap-4 sm:flex-row">
          <View className="flex-1">
            <form.AppField name="owner">
              {(field) => <field.TextField label="Owner" placeholder="Team or accountable lead" />}
            </form.AppField>
          </View>
          <View className="flex-1">
            <form.AppField name="targetDate">
              {(field) => (
                <field.TextField
                  label="Target date"
                  placeholder="YYYY-MM-DD"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="done"
                  onSubmitEditing={() => void form.handleSubmit()}
                />
              )}
            </form.AppField>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Button className="flex-1" variant="tertiary" onPress={() => setIsExpanded(false)}>
            Cancel
          </Button>
          <View className="flex-1">
            <form.AppForm>
              <form.SubmitButton label="Create mission" loadingLabel="Creating…" />
            </form.AppForm>
          </View>
        </View>
      </Card>
    </View>
  );
}

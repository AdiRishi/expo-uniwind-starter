import { Button, Input, Label, TextField } from "heroui-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { tv } from "tailwind-variants";

import { Typography } from "@/components/ui/typography";
import { RISK_SEVERITY_LABELS } from "@/lib/mission-control";
import type { RiskSeverity } from "@/schemas/mission-control";

const severityVariants = tv({
  base: "rounded-xl border px-3 py-2",
  variants: {
    selected: {
      true: "border-warning bg-warning/10",
      false: "border-border bg-surface",
    },
  },
});

const SEVERITIES: RiskSeverity[] = ["low", "medium", "high", "critical"];

export function RiskComposer({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: (risk: { title: string; mitigation: string; severity: RiskSeverity }) => Promise<unknown>;
}) {
  const [title, setTitle] = useState("");
  const [mitigation, setMitigation] = useState("");
  const [severity, setSeverity] = useState<RiskSeverity>("medium");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = title.trim().length >= 3 && mitigation.trim().length >= 5 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Add a risk title and a concrete mitigation.");
      return;
    }

    try {
      setError(null);
      await onSubmit({ title: title.trim(), mitigation: mitigation.trim(), severity });
      setTitle("");
      setMitigation("");
      setSeverity("medium");
    } catch {
      setError("The risk could not be added. Try again.");
    }
  };

  return (
    <View className="gap-4 rounded-2xl border border-border p-4">
      <View className="gap-1">
        <Typography variant="smallBold">Log a delivery risk</Typography>
        <Typography variant="caption" tone="muted">
          Name the uncertainty and the action that reduces it.
        </Typography>
      </View>

      <TextField>
        <Label>Risk</Label>
        <Input value={title} placeholder="What could derail this mission?" onChangeText={setTitle} />
      </TextField>

      <TextField>
        <Label>Mitigation</Label>
        <Input
          value={mitigation}
          placeholder="How will the team reduce the exposure?"
          multiline
          numberOfLines={3}
          onChangeText={setMitigation}
        />
      </TextField>

      <View className="gap-2">
        <Typography variant="caption" tone="muted">
          SEVERITY
        </Typography>
        <View className="flex-row flex-wrap gap-2">
          {SEVERITIES.map((value) => {
            const selected = value === severity;
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className={severityVariants({ selected })}
                onPress={() => setSeverity(value)}
              >
                <Typography variant="caption" tone={selected ? "warning" : "muted"}>
                  {RISK_SEVERITY_LABELS[value]}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>

      {error && (
        <Typography variant="caption" tone="danger" accessibilityRole="alert">
          {error}
        </Typography>
      )}

      <Button variant="secondary" isDisabled={!canSubmit} onPress={() => void handleSubmit()}>
        {isSubmitting ? "Logging risk…" : "Log risk"}
      </Button>
    </View>
  );
}

import { Card } from "heroui-native";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import type { MissionSummary } from "@/schemas/mission-control";

type SummaryMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "default" | "accent" | "success" | "warning" | "danger";
};

export function MissionSummaryGrid({ summary }: { summary: MissionSummary }) {
  const metrics: SummaryMetric[] = [
    {
      label: "In flight",
      value: String(summary.active),
      detail: `${summary.total} total missions`,
      tone: "accent",
    },
    {
      label: "Progress",
      value: `${summary.averageProgress}%`,
      detail: "Average completion",
      tone: "success",
    },
    {
      label: "At risk",
      value: String(summary.atRisk),
      detail: summary.atRisk === 1 ? "Mission needs attention" : "Missions need attention",
      tone: summary.atRisk > 0 ? "danger" : "default",
    },
    {
      label: "Due soon",
      value: String(summary.dueSoon),
      detail: "Within seven days",
      tone: summary.dueSoon > 0 ? "warning" : "default",
    },
  ];

  return (
    <View className="flex-row flex-wrap gap-3 px-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="min-w-36 flex-1 gap-2 p-4" variant="secondary">
          <Typography variant="caption" tone="muted">
            {metric.label.toLocaleUpperCase()}
          </Typography>
          <Typography variant="h2" tone={metric.tone} tabularNums>
            {metric.value}
          </Typography>
          <Typography variant="caption" tone="muted">
            {metric.detail}
          </Typography>
        </Card>
      ))}
    </View>
  );
}

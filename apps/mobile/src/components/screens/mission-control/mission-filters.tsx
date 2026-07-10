import { Pressable, View } from "react-native";
import { tv } from "tailwind-variants";

import { Typography } from "@/components/ui/typography";
import type { MissionStatus } from "@/schemas/mission-control";

export type MissionFilter = MissionStatus | "all";

const filterVariants = tv({
  base: "rounded-full border px-4 py-2",
  variants: {
    selected: {
      true: "border-accent bg-accent",
      false: "border-border bg-surface",
    },
  },
});

const FILTERS: { label: string; value: MissionFilter }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Complete", value: "completed" },
];

export function MissionFilters({
  value,
  onChange,
}: {
  value: MissionFilter;
  onChange: (value: MissionFilter) => void;
}) {
  return (
    <View className="gap-3 px-4">
      <Typography variant="smallBold">Filter by status</Typography>
      <View className="flex-row flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const selected = filter.value === value;
          return (
            <Pressable
              key={filter.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={filterVariants({ selected })}
              onPress={() => onChange(filter.value)}
            >
              <Typography variant="smallBold" className={selected ? "text-accent-foreground" : undefined}>
                {filter.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

import { View } from "react-native";

import { Typography } from "@/components/ui/typography";

export function MissionProgress({ progress, compact = false }: { progress: number; compact?: boolean }) {
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View className="gap-2" accessibilityLabel={`${normalizedProgress}% complete`} accessibilityRole="progressbar">
      {!compact && (
        <View className="flex-row items-center justify-between">
          <Typography variant="caption" tone="muted">
            Mission progress
          </Typography>
          <Typography variant="caption" tabularNums>
            {normalizedProgress}%
          </Typography>
        </View>
      )}
      <View className="h-2 overflow-hidden rounded-full bg-default">
        <View className="h-full rounded-full bg-accent" style={{ width: `${normalizedProgress}%` }} />
      </View>
    </View>
  );
}

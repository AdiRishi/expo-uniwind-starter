import { View } from "react-native";

import { Typography } from "@/components/ui/typography";

export function TasksHeader() {
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

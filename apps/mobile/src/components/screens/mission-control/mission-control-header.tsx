import { SymbolView } from "expo-symbols";
import { useThemeColor } from "heroui-native";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";

export function MissionControlHeader() {
  const accent = useThemeColor("accent");

  return (
    <View className="gap-4 px-4">
      <View className="size-14 items-center justify-center rounded-2xl bg-accent/10">
        <SymbolView
          name={{ ios: "scope", android: "track_changes", web: "track_changes" }}
          size={28}
          tintColor={accent}
        />
      </View>
      <View className="gap-2">
        <Typography variant="h1">Mission Control</Typography>
        <Typography tone="muted">
          Turn ambitious outcomes into visible stages, surface delivery risks, and keep the next move obvious.
        </Typography>
      </View>
    </View>
  );
}

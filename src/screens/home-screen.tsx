import * as Device from "expo-device";
import { version as expoVersion } from "expo/package.json";
import { Card } from "heroui-native";
import { type ReactNode } from "react";
import { Platform, View } from "react-native";

import { BrandHeroIcon } from "@/components/brand-hero-icon/brand-hero-icon";
import { StandardView } from "@/components/ui/screen-containers/standard-view";
import { Typography } from "@/components/ui/typography";

export function HomeScreen() {
  return (
    <StandardView className="flex-1">
      <View className="mt-12 flex-1 gap-12">
        <View className="items-center gap-6">
          <BrandHeroIcon />
          <Typography variant="display" align="center">
            Welcome to Expo
          </Typography>
        </View>
        <View className="gap-2">
          <Typography variant="h4" align="center">
            Quick tips
          </Typography>
          <Card variant="tertiary">
            <Card.Body className="gap-3 p-4">
              <HintRow
                title="Try editing"
                hint={<Typography variant="code">src/app/index.tsx</Typography>}
              />
              <HintRow title="Dev tools" hint={getDevMenuHint()} />
            </Card.Body>
          </Card>
        </View>

        {Platform.OS === "web" && <WebBadge />}
      </View>
    </StandardView>
  );
}

function HintRow({ title, hint }: { title: string; hint?: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Typography variant="small" className="font-semibold">
        {title}
      </Typography>

      <View className="max-w-[70%] shrink rounded-lg border border-border bg-background px-2.5 py-1">
        {hint}
      </View>
    </View>
  );
}

function WebBadge() {
  return (
    <View className="items-center gap-2 py-5">
      <Typography variant="code" tone="muted" align="center">
        v{expoVersion}
      </Typography>
      <Typography variant="caption" tone="muted" align="center">
        Powered by Expo
      </Typography>
    </View>
  );
}

function getDevMenuHint(): ReactNode {
  if (Platform.OS === "web") {
    return <Typography variant="small">use browser devtools</Typography>;
  }
  if (Device.isDevice) {
    return (
      <Typography variant="small">
        shake device or press <Typography variant="code">m</Typography> in terminal
      </Typography>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <Typography variant="small">
      press <Typography variant="code">{shortcut}</Typography>
    </Typography>
  );
}

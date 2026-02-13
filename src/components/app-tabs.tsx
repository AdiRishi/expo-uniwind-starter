import { NativeTabs } from "expo-router/unstable-native-tabs";

import { useThemeColors } from "@/hooks/use-theme-colors";

export function AppTabs() {
  const colors = useThemeColors();

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      indicatorColor={colors.accentSoft}
      labelStyle={{
        default: { color: colors.muted },
        selected: { color: colors.foreground },
      }}
    >
      <NativeTabs.Trigger name="index" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="explore" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="api-routes" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>API</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="server.rack" md="dns" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

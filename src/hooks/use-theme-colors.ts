import { useThemeColor } from "heroui-native";

export function useThemeColors() {
  const [surface, foreground, muted, accentSoft] = useThemeColor(["surface", "foreground", "muted", "accent-soft"]);

  return {
    surface,
    foreground,
    muted,
    accentSoft,
  } as const;
}

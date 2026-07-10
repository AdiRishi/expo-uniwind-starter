import { SymbolView } from "expo-symbols";
import { Button, Chip, useThemeColor } from "heroui-native";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { RISK_SEVERITY_LABELS } from "@/lib/mission-control";
import type { MissionRisk } from "@/schemas/mission-control";

export function RiskRegister({
  risks,
  isMissionComplete,
  onResolve,
}: {
  risks: MissionRisk[];
  isMissionComplete: boolean;
  onResolve: (riskId: string) => void;
}) {
  const [warning, success] = useThemeColor(["warning", "success"]);

  if (risks.length === 0) {
    return (
      <View className="items-center gap-2 rounded-2xl bg-success/10 px-4 py-6">
        <SymbolView
          name={{ ios: "checkmark.shield", android: "verified_user", web: "verified_user" }}
          size={24}
          tintColor={success}
        />
        <Typography variant="smallBold">No risks logged</Typography>
        <Typography variant="caption" tone="muted" align="center">
          Use the register when an uncertainty needs an owner and mitigation.
        </Typography>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {risks.map((risk) => (
        <View key={risk.id} className="gap-3 rounded-2xl bg-surface-secondary p-4">
          <View className="flex-row items-start gap-3">
            <SymbolView
              name={{
                ios: risk.resolved ? "checkmark.shield.fill" : "exclamationmark.shield",
                android: risk.resolved ? "verified_user" : "warning_amber",
                web: risk.resolved ? "verified_user" : "warning_amber",
              }}
              size={20}
              tintColor={risk.resolved ? success : warning}
            />
            <View className="flex-1 gap-1">
              <Typography variant="smallBold" className={risk.resolved ? "line-through" : undefined}>
                {risk.title}
              </Typography>
              <Typography variant="caption" tone="muted">
                {risk.mitigation}
              </Typography>
            </View>
            <Chip size="sm" variant="primary" color={risk.resolved ? "success" : "warning"}>
              {risk.resolved ? "Resolved" : RISK_SEVERITY_LABELS[risk.severity]}
            </Chip>
          </View>
          {!risk.resolved && (
            <Button size="sm" variant="ghost" isDisabled={isMissionComplete} onPress={() => onResolve(risk.id)}>
              Mark resolved
            </Button>
          )}
        </View>
      ))}
    </View>
  );
}

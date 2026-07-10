import { SymbolView } from "expo-symbols";
import { Button, Card, Chip, Separator, useThemeColor } from "heroui-native";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/typography";
import {
  canCompleteMission,
  formatTargetDate,
  getConfidenceLabel,
  getCurrentStage,
  getMissionHealth,
  getMissionStatusAction,
  getNextMissionStatus,
  getTargetDateLabel,
  MISSION_HEALTH_LABELS,
  MISSION_STATUS_LABELS,
  STAGE_LABELS,
} from "@/lib/mission-control";
import type { Mission, MissionCheckpoint, MissionStatus, RiskSeverity } from "@/schemas/mission-control";

import { CheckpointItem } from "./checkpoint-item";
import { MissionProgress } from "./mission-progress";
import { RiskComposer } from "./risk-composer";
import { RiskRegister } from "./risk-register";

type MissionCardProps = {
  mission: Mission;
  expanded: boolean;
  riskSubmitting: boolean;
  onToggleExpanded: () => void;
  onSetStatus: (status: MissionStatus) => void;
  onSetConfidence: (confidence: number) => void;
  onUpdateCheckpoint: (checkpointId: string, status: MissionCheckpoint["status"]) => void;
  onResolveRisk: (riskId: string) => void;
  onAddRisk: (risk: { title: string; mitigation: string; severity: RiskSeverity }) => Promise<unknown>;
  onDelete: () => void;
};

const healthColors = {
  on_track: "success",
  watch: "warning",
  at_risk: "danger",
  complete: "success",
} as const;

export function MissionCard({
  mission,
  expanded,
  riskSubmitting,
  onToggleExpanded,
  onSetStatus,
  onSetConfidence,
  onUpdateCheckpoint,
  onResolveRisk,
  onAddRisk,
  onDelete,
}: MissionCardProps) {
  const [muted, accent] = useThemeColor(["muted", "accent"]);
  const health = getMissionHealth(mission);
  const currentStage = getCurrentStage(mission.checkpoints);
  const nextStatus = getNextMissionStatus(mission.status);
  const canComplete = canCompleteMission(mission);
  const isComplete = mission.status === "completed";

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${expanded ? "Collapse" : "Expand"} ${mission.title}`}
        accessibilityState={{ expanded }}
        className="gap-4 p-5"
        onPress={onToggleExpanded}
      >
        <View className="flex-row items-start gap-3">
          <View className="flex-1 gap-2">
            <View className="flex-row flex-wrap items-center gap-2">
              <Chip size="sm" variant="primary" color={healthColors[health]}>
                {MISSION_HEALTH_LABELS[health]}
              </Chip>
              <Typography variant="caption" tone="muted">
                {MISSION_STATUS_LABELS[mission.status]} · {STAGE_LABELS[currentStage]}
              </Typography>
            </View>
            <Typography variant="h3">{mission.title}</Typography>
            <Typography variant="small" tone="muted" numberOfLines={expanded ? undefined : 2}>
              {mission.objective}
            </Typography>
          </View>
          <SymbolView
            name={{
              ios: expanded ? "chevron.up" : "chevron.down",
              android: expanded ? "expand_less" : "expand_more",
              web: expanded ? "expand_less" : "expand_more",
            }}
            size={18}
            tintColor={muted}
          />
        </View>

        <MissionProgress progress={mission.progress} />

        <View className="flex-row flex-wrap gap-x-5 gap-y-2">
          <Typography variant="caption" tone="muted">
            Owner: <Typography variant="caption">{mission.owner}</Typography>
          </Typography>
          <Typography variant="caption" tone="muted">
            Target: <Typography variant="caption">{formatTargetDate(mission.targetDate)}</Typography>
          </Typography>
          <Typography variant="caption" tone="muted">
            {getTargetDateLabel(mission.targetDate)}
          </Typography>
        </View>
      </Pressable>

      {expanded && (
        <>
          <Separator />
          <View className="gap-7 p-5">
            <View className="gap-3">
              <View className="flex-row items-center justify-between gap-3">
                <View className="gap-1">
                  <Typography variant="smallBold">Delivery confidence</Typography>
                  <Typography variant="caption" tone="muted">
                    {getConfidenceLabel(mission.confidence)} · {mission.confidence}/5
                  </Typography>
                </View>
                <View className="flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((confidence) => (
                    <Pressable
                      key={confidence}
                      accessibilityRole="button"
                      accessibilityLabel={`Set confidence to ${confidence}`}
                      accessibilityState={{ selected: mission.confidence === confidence }}
                      className={
                        confidence <= mission.confidence
                          ? "size-9 items-center justify-center rounded-full bg-accent"
                          : "size-9 items-center justify-center rounded-full bg-default"
                      }
                      disabled={isComplete}
                      onPress={() => onSetConfidence(confidence)}
                    >
                      <Typography
                        variant="caption"
                        className={confidence <= mission.confidence ? "text-accent-foreground" : undefined}
                        tabularNums
                      >
                        {confidence}
                      </Typography>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <View className="gap-4">
              <View className="flex-row items-end justify-between gap-3">
                <View className="gap-1">
                  <Typography variant="h4">Delivery checkpoints</Typography>
                  <Typography variant="caption" tone="muted">
                    {mission.completedCheckpoints} of {mission.checkpoints.length} complete
                  </Typography>
                </View>
                <SymbolView
                  name={{ ios: "point.3.connected.trianglepath.dotted", android: "route", web: "route" }}
                  size={22}
                  tintColor={accent}
                />
              </View>
              <View className="gap-3">
                {mission.checkpoints.map((checkpoint) => (
                  <CheckpointItem
                    key={checkpoint.id}
                    checkpoint={checkpoint}
                    isMissionComplete={isComplete}
                    onUpdate={onUpdateCheckpoint}
                    onBlock={(checkpointId) => onUpdateCheckpoint(checkpointId, "blocked")}
                  />
                ))}
              </View>
            </View>

            <View className="gap-4">
              <View className="gap-1">
                <Typography variant="h4">Risk register</Typography>
                <Typography variant="caption" tone="muted">
                  {mission.openRisks} open · risk score {mission.riskScore}
                </Typography>
              </View>
              <RiskRegister risks={mission.risks} isMissionComplete={isComplete} onResolve={onResolveRisk} />
              {!isComplete && <RiskComposer isSubmitting={riskSubmitting} onSubmit={onAddRisk} />}
            </View>

            <Separator />

            <View className="gap-3">
              {nextStatus && (
                <Button variant="secondary" onPress={() => onSetStatus(nextStatus)}>
                  {getMissionStatusAction(mission.status)}
                </Button>
              )}
              {!isComplete && (
                <Button variant="primary" isDisabled={!canComplete} onPress={() => onSetStatus("completed")}>
                  {canComplete ? "Complete mission" : "Complete every checkpoint to close"}
                </Button>
              )}
              {mission.status !== "active" && !isComplete && (
                <Button variant="danger-soft" onPress={onDelete}>
                  Delete mission
                </Button>
              )}
            </View>
          </View>
        </>
      )}
    </Card>
  );
}

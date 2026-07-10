import { SymbolView } from "expo-symbols";
import { useThemeColor } from "heroui-native";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import type { Mission, MissionCheckpoint, MissionStatus, RiskSeverity } from "@/schemas/mission-control";

import { MissionCard } from "./mission-card";

type MissionListProps = {
  missions: Mission[];
  expandedMissionId: string | null;
  riskSubmitting: boolean;
  onToggleExpanded: (missionId: string) => void;
  onSetStatus: (missionId: string, status: MissionStatus) => void;
  onSetConfidence: (missionId: string, confidence: number) => void;
  onUpdateCheckpoint: (missionId: string, checkpointId: string, status: MissionCheckpoint["status"]) => void;
  onResolveRisk: (missionId: string, riskId: string) => void;
  onAddRisk: (
    missionId: string,
    risk: { title: string; mitigation: string; severity: RiskSeverity },
  ) => Promise<unknown>;
  onDelete: (missionId: string) => void;
};

export function MissionList({
  missions,
  expandedMissionId,
  riskSubmitting,
  onToggleExpanded,
  onSetStatus,
  onSetConfidence,
  onUpdateCheckpoint,
  onResolveRisk,
  onAddRisk,
  onDelete,
}: MissionListProps) {
  const muted = useThemeColor("muted");

  if (missions.length === 0) {
    return (
      <View className="mx-4 items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-10">
        <SymbolView
          name={{ ios: "scope", android: "track_changes", web: "track_changes" }}
          size={32}
          tintColor={muted}
        />
        <Typography variant="h4" align="center">
          No missions in this view
        </Typography>
        <Typography variant="small" tone="muted" align="center">
          Create a mission or choose another status filter to bring the delivery map into view.
        </Typography>
      </View>
    );
  }

  return (
    <View className="gap-4 px-4">
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          expanded={mission.id === expandedMissionId}
          riskSubmitting={riskSubmitting}
          onToggleExpanded={() => onToggleExpanded(mission.id)}
          onSetStatus={(status) => onSetStatus(mission.id, status)}
          onSetConfidence={(confidence) => onSetConfidence(mission.id, confidence)}
          onUpdateCheckpoint={(checkpointId, status) => onUpdateCheckpoint(mission.id, checkpointId, status)}
          onResolveRisk={(riskId) => onResolveRisk(mission.id, riskId)}
          onAddRisk={(risk) => onAddRisk(mission.id, risk)}
          onDelete={() => onDelete(mission.id)}
        />
      ))}
    </View>
  );
}

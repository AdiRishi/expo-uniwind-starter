import { SymbolView } from "expo-symbols";
import { Button, Chip, useThemeColor } from "heroui-native";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import {
  CHECKPOINT_STATUS_LABELS,
  getCheckpointAction,
  getNextCheckpointStatus,
  STAGE_LABELS,
} from "@/lib/mission-control";
import type { MissionCheckpoint } from "@/schemas/mission-control";

const statusIcons = {
  pending: { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" },
  in_progress: { ios: "circle.dotted", android: "pending", web: "pending" },
  blocked: { ios: "exclamationmark.octagon", android: "error_outline", web: "error_outline" },
  done: { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" },
} as const;

export function CheckpointItem({
  checkpoint,
  isMissionComplete,
  onUpdate,
  onBlock,
}: {
  checkpoint: MissionCheckpoint;
  isMissionComplete: boolean;
  onUpdate: (checkpointId: string, status: MissionCheckpoint["status"]) => void;
  onBlock: (checkpointId: string) => void;
}) {
  const [muted, success, warning] = useThemeColor(["muted", "success", "warning"]);
  const tintColor = checkpoint.status === "done" ? success : checkpoint.status === "blocked" ? warning : muted;

  return (
    <View className="gap-3 rounded-2xl bg-surface-secondary p-4">
      <View className="flex-row items-start gap-3">
        <SymbolView name={statusIcons[checkpoint.status]} size={20} tintColor={tintColor} />
        <View className="flex-1 gap-1">
          <Typography variant="smallBold">{checkpoint.title}</Typography>
          <Typography variant="caption" tone="muted">
            {checkpoint.owner} · due {checkpoint.dueDate}
          </Typography>
        </View>
        <Chip size="sm" variant="soft">
          {STAGE_LABELS[checkpoint.stage]}
        </Chip>
      </View>

      <View className="flex-row items-center justify-between gap-3">
        <Typography variant="caption" tone={checkpoint.status === "blocked" ? "warning" : "muted"}>
          {CHECKPOINT_STATUS_LABELS[checkpoint.status]}
        </Typography>
        <View className="flex-row gap-2">
          {checkpoint.status !== "blocked" && checkpoint.status !== "done" && (
            <Button size="sm" variant="ghost" isDisabled={isMissionComplete} onPress={() => onBlock(checkpoint.id)}>
              Block
            </Button>
          )}
          <Button
            size="sm"
            variant={checkpoint.status === "done" ? "outline" : "secondary"}
            isDisabled={isMissionComplete}
            onPress={() => onUpdate(checkpoint.id, getNextCheckpointStatus(checkpoint.status))}
          >
            {getCheckpointAction(checkpoint.status)}
          </Button>
        </View>
      </View>
    </View>
  );
}

import { z } from "zod";

import type { RouterInputs, RouterOutputs } from "@repo/api";

export const createMissionSchema = z.object({
  title: z.string().trim().min(3, "Use at least 3 characters").max(80, "Keep the title under 80 characters"),
  objective: z
    .string()
    .trim()
    .min(10, "Describe the outcome in at least 10 characters")
    .max(280, "Keep the objective under 280 characters"),
  owner: z.string().trim().min(2, "Use at least 2 characters").max(60, "Keep the owner under 60 characters"),
  targetDate: z.iso.date("Use a date in YYYY-MM-DD format"),
});

export type MissionListOutput = RouterOutputs["missionControl"]["list"];
export type Mission = MissionListOutput["items"][number];
export type MissionCheckpoint = Mission["checkpoints"][number];
export type MissionRisk = Mission["risks"][number];
export type MissionSummary = MissionListOutput["summary"];
export type MissionStatus = Mission["status"];
export type MissionStage = MissionCheckpoint["stage"];
export type CheckpointStatus = MissionCheckpoint["status"];
export type RiskSeverity = MissionRisk["severity"];
export type CreateMissionValues = z.infer<typeof createMissionSchema>;
export type CreateMissionInput = RouterInputs["missionControl"]["create"];

export const EMPTY_MISSION_SUMMARY: MissionSummary = {
  total: 0,
  active: 0,
  atRisk: 0,
  completed: 0,
  averageProgress: 0,
  dueSoon: 0,
};

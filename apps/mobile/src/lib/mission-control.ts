import type {
  CheckpointStatus,
  Mission,
  MissionCheckpoint,
  MissionStage,
  MissionStatus,
  RiskSeverity,
} from "@/schemas/mission-control";

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  completed: "Complete",
};

export const STAGE_LABELS: Record<MissionStage, string> = {
  discover: "Discover",
  design: "Design",
  build: "Build",
  launch: "Launch",
};

export const CHECKPOINT_STATUS_LABELS: Record<CheckpointStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
};

export const RISK_SEVERITY_LABELS: Record<RiskSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const STAGE_ORDER: MissionStage[] = ["discover", "design", "build", "launch"];

export type MissionHealth = "on_track" | "watch" | "at_risk" | "complete";

export const MISSION_HEALTH_LABELS: Record<MissionHealth, string> = {
  on_track: "On track",
  watch: "Watch",
  at_risk: "At risk",
  complete: "Complete",
};

export function getMissionHealth(mission: Mission): MissionHealth {
  if (mission.status === "completed") return "complete";
  if (mission.isAtRisk || mission.riskScore >= 5) return "at_risk";
  if (mission.confidence <= 2 || mission.openRisks > 0) return "watch";
  return "on_track";
}

export function getNextMissionStatus(status: MissionStatus): MissionStatus | null {
  switch (status) {
    case "draft":
      return "active";
    case "active":
      return "paused";
    case "paused":
      return "active";
    case "completed":
      return null;
  }
}

export function getMissionStatusAction(status: MissionStatus) {
  switch (status) {
    case "draft":
      return "Start mission";
    case "active":
      return "Pause mission";
    case "paused":
      return "Resume mission";
    case "completed":
      return "Mission complete";
  }
}

export function getNextCheckpointStatus(status: CheckpointStatus): CheckpointStatus {
  switch (status) {
    case "pending":
      return "in_progress";
    case "in_progress":
      return "done";
    case "blocked":
      return "in_progress";
    case "done":
      return "pending";
  }
}

export function getCheckpointAction(status: CheckpointStatus) {
  switch (status) {
    case "pending":
      return "Start";
    case "in_progress":
      return "Finish";
    case "blocked":
      return "Unblock";
    case "done":
      return "Reopen";
  }
}

export function getCurrentStage(checkpoints: MissionCheckpoint[]): MissionStage {
  const firstIncomplete = checkpoints.find((checkpoint) => checkpoint.status !== "done");
  if (firstIncomplete) return firstIncomplete.stage;
  return "launch";
}

export function groupCheckpointsByStage(checkpoints: MissionCheckpoint[]) {
  return STAGE_ORDER.map((stage) => ({
    stage,
    checkpoints: checkpoints.filter((checkpoint) => checkpoint.stage === stage),
  }));
}

export function formatTargetDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function getDaysUntilTarget(value: string, today = new Date()) {
  const target = new Date(`${value}T12:00:00`);
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  return Math.ceil((target.getTime() - current.getTime()) / 86_400_000);
}

export function getTargetDateLabel(value: string, today = new Date()) {
  const remaining = getDaysUntilTarget(value, today);
  if (remaining < 0) return `${Math.abs(remaining)}d overdue`;
  if (remaining === 0) return "Due today";
  if (remaining === 1) return "Due tomorrow";
  return `${remaining}d remaining`;
}

export function getSuggestedTargetDate(today = new Date()) {
  const target = new Date(today);
  target.setDate(target.getDate() + 28);
  return [
    target.getFullYear(),
    String(target.getMonth() + 1).padStart(2, "0"),
    String(target.getDate()).padStart(2, "0"),
  ].join("-");
}

export function canCompleteMission(mission: Mission) {
  return mission.checkpoints.length > 0 && mission.checkpoints.every((checkpoint) => checkpoint.status === "done");
}

export function getConfidenceLabel(confidence: number) {
  if (confidence >= 5) return "Very high";
  if (confidence === 4) return "High";
  if (confidence === 3) return "Medium";
  if (confidence === 2) return "Low";
  return "Very low";
}

export function getMissionSearchText(mission: Mission) {
  return [
    mission.title,
    mission.objective,
    mission.owner,
    ...mission.checkpoints.map((checkpoint) => `${checkpoint.title} ${checkpoint.owner}`),
    ...mission.risks.map((risk) => `${risk.title} ${risk.mitigation}`),
  ]
    .join(" ")
    .toLocaleLowerCase();
}

export function filterMissions(missions: Mission[], query: string, status: MissionStatus | "all") {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return missions.filter((mission) => {
    const matchesStatus = status === "all" || mission.status === status;
    const matchesQuery = normalizedQuery.length === 0 || getMissionSearchText(mission).includes(normalizedQuery);
    return matchesStatus && matchesQuery;
  });
}

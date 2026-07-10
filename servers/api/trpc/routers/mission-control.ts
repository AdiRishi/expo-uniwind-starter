import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../init";

export const missionStatusSchema = z.enum(["draft", "active", "paused", "completed"]);
export const missionStageSchema = z.enum(["discover", "design", "build", "launch"]);
export const checkpointStatusSchema = z.enum(["pending", "in_progress", "blocked", "done"]);
export const riskSeveritySchema = z.enum(["low", "medium", "high", "critical"]);

const createMissionSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(80),
  objective: z.string().trim().min(10, "Objective must be at least 10 characters").max(280),
  owner: z.string().trim().min(2, "Owner must be at least 2 characters").max(60),
  targetDate: z.iso.date(),
  confidence: z.number().int().min(1).max(5),
});

const missionIdSchema = z.object({ missionId: z.uuid() });

const addCheckpointSchema = missionIdSchema.extend({
  title: z.string().trim().min(3).max(100),
  stage: missionStageSchema,
  owner: z.string().trim().min(2).max(60),
  dueDate: z.iso.date(),
});

const updateCheckpointSchema = missionIdSchema.extend({
  checkpointId: z.uuid(),
  status: checkpointStatusSchema,
});

const addRiskSchema = missionIdSchema.extend({
  title: z.string().trim().min(3).max(120),
  mitigation: z.string().trim().min(5).max(280),
  severity: riskSeveritySchema,
});

const riskIdSchema = missionIdSchema.extend({ riskId: z.uuid() });

export type MissionStatus = z.infer<typeof missionStatusSchema>;
export type MissionStage = z.infer<typeof missionStageSchema>;
export type CheckpointStatus = z.infer<typeof checkpointStatusSchema>;
export type RiskSeverity = z.infer<typeof riskSeveritySchema>;

export type MissionCheckpoint = {
  id: string;
  title: string;
  stage: MissionStage;
  owner: string;
  dueDate: string;
  status: CheckpointStatus;
  completedAt: string | null;
};

export type MissionRisk = {
  id: string;
  title: string;
  mitigation: string;
  severity: RiskSeverity;
  resolved: boolean;
  createdAt: string;
  resolvedAt: string | null;
};

export type Mission = {
  id: string;
  title: string;
  objective: string;
  owner: string;
  targetDate: string;
  confidence: number;
  status: MissionStatus;
  checkpoints: MissionCheckpoint[];
  risks: MissionRisk[];
  createdAt: string;
  updatedAt: string;
};

export type MissionSummary = {
  total: number;
  active: number;
  atRisk: number;
  completed: number;
  averageProgress: number;
  dueSoon: number;
};

const missions = new Map<string, Mission>();

const DEFAULT_CHECKPOINTS: ReadonlyArray<Pick<MissionCheckpoint, "stage" | "title">> = [
  { stage: "discover", title: "Validate the problem and success signal" },
  { stage: "design", title: "Align on the solution and delivery plan" },
  { stage: "build", title: "Deliver the smallest complete increment" },
  { stage: "launch", title: "Release, observe, and close the loop" },
];

const severityWeight: Record<RiskSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 5,
};

function now() {
  return new Date().toISOString();
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function getMissionOrThrow(missionId: string) {
  const mission = missions.get(missionId);
  if (!mission) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Mission not found" });
  }
  return mission;
}

function assertMissionEditable(mission: Mission) {
  if (mission.status === "completed") {
    throw new TRPCError({ code: "CONFLICT", message: "Completed missions cannot be edited" });
  }
}

function touch(mission: Mission) {
  mission.updatedAt = now();
  return mission;
}

function missionProgress(mission: Mission) {
  if (mission.checkpoints.length === 0) return 0;
  const completed = mission.checkpoints.filter((checkpoint) => checkpoint.status === "done").length;
  return Math.round((completed / mission.checkpoints.length) * 100);
}

function missionRiskScore(mission: Mission) {
  return mission.risks.reduce((score, risk) => score + (risk.resolved ? 0 : severityWeight[risk.severity]), 0);
}

function isMissionAtRisk(mission: Mission) {
  const hasBlockedCheckpoint = mission.checkpoints.some((checkpoint) => checkpoint.status === "blocked");
  return hasBlockedCheckpoint || missionRiskScore(mission) >= 3;
}

function createDefaultCheckpoints(owner: string, targetDate: string): MissionCheckpoint[] {
  const today = now().slice(0, 10);
  const start = new Date(`${today}T12:00:00.000Z`).getTime();
  const target = new Date(`${targetDate}T12:00:00.000Z`).getTime();
  const totalDays = Math.max(4, Math.ceil((target - start) / 86_400_000));

  return DEFAULT_CHECKPOINTS.map((checkpoint, index) => ({
    id: crypto.randomUUID(),
    ...checkpoint,
    owner,
    dueDate: addDays(today, Math.max(1, Math.round((totalDays * (index + 1)) / DEFAULT_CHECKPOINTS.length))),
    status: index === 0 ? "in_progress" : "pending",
    completedAt: null,
  }));
}

function summarize(allMissions: Mission[]): MissionSummary {
  const progressTotal = allMissions.reduce((total, mission) => total + missionProgress(mission), 0);
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setUTCDate(sevenDaysFromNow.getUTCDate() + 7);
  const dueSoonBoundary = sevenDaysFromNow.toISOString().slice(0, 10);

  return {
    total: allMissions.length,
    active: allMissions.filter((mission) => mission.status === "active").length,
    atRisk: allMissions.filter((mission) => mission.status !== "completed" && isMissionAtRisk(mission)).length,
    completed: allMissions.filter((mission) => mission.status === "completed").length,
    averageProgress: allMissions.length === 0 ? 0 : Math.round(progressTotal / allMissions.length),
    dueSoon: allMissions.filter(
      (mission) =>
        mission.status !== "completed" &&
        mission.targetDate >= now().slice(0, 10) &&
        mission.targetDate <= dueSoonBoundary,
    ).length,
  };
}

function presentMission(mission: Mission) {
  return {
    ...mission,
    progress: missionProgress(mission),
    riskScore: missionRiskScore(mission),
    isAtRisk: isMissionAtRisk(mission),
    completedCheckpoints: mission.checkpoints.filter((checkpoint) => checkpoint.status === "done").length,
    openRisks: mission.risks.filter((risk) => !risk.resolved).length,
  };
}

export const missionControlRouter = router({
  list: publicProcedure.query(() => {
    const items = [...missions.values()]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .map(presentMission);
    return { items, summary: summarize([...missions.values()]) };
  }),

  create: publicProcedure.input(createMissionSchema).mutation(({ input }) => {
    const timestamp = now();
    const mission: Mission = {
      id: crypto.randomUUID(),
      ...input,
      status: "draft",
      checkpoints: createDefaultCheckpoints(input.owner, input.targetDate),
      risks: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    missions.set(mission.id, mission);
    return presentMission(mission);
  }),

  setStatus: publicProcedure.input(missionIdSchema.extend({ status: missionStatusSchema })).mutation(({ input }) => {
    const mission = getMissionOrThrow(input.missionId);
    if (mission.status === "completed" && input.status !== "completed") {
      throw new TRPCError({ code: "CONFLICT", message: "Completed missions cannot be reopened" });
    }
    if (input.status === "completed" && mission.checkpoints.some((checkpoint) => checkpoint.status !== "done")) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Complete every checkpoint before closing a mission",
      });
    }
    mission.status = input.status;
    return presentMission(touch(mission));
  }),

  setConfidence: publicProcedure
    .input(missionIdSchema.extend({ confidence: z.number().int().min(1).max(5) }))
    .mutation(({ input }) => {
      const mission = getMissionOrThrow(input.missionId);
      assertMissionEditable(mission);
      mission.confidence = input.confidence;
      return presentMission(touch(mission));
    }),

  addCheckpoint: publicProcedure.input(addCheckpointSchema).mutation(({ input }) => {
    const mission = getMissionOrThrow(input.missionId);
    assertMissionEditable(mission);
    const checkpoint: MissionCheckpoint = {
      id: crypto.randomUUID(),
      title: input.title,
      stage: input.stage,
      owner: input.owner,
      dueDate: input.dueDate,
      status: "pending",
      completedAt: null,
    };
    mission.checkpoints.push(checkpoint);
    touch(mission);
    return checkpoint;
  }),

  updateCheckpoint: publicProcedure.input(updateCheckpointSchema).mutation(({ input }) => {
    const mission = getMissionOrThrow(input.missionId);
    assertMissionEditable(mission);
    const checkpoint = mission.checkpoints.find((item) => item.id === input.checkpointId);
    if (!checkpoint) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Checkpoint not found" });
    }
    checkpoint.status = input.status;
    checkpoint.completedAt = input.status === "done" ? now() : null;
    touch(mission);
    return checkpoint;
  }),

  addRisk: publicProcedure.input(addRiskSchema).mutation(({ input }) => {
    const mission = getMissionOrThrow(input.missionId);
    assertMissionEditable(mission);
    const risk: MissionRisk = {
      id: crypto.randomUUID(),
      title: input.title,
      mitigation: input.mitigation,
      severity: input.severity,
      resolved: false,
      createdAt: now(),
      resolvedAt: null,
    };
    mission.risks.unshift(risk);
    touch(mission);
    return risk;
  }),

  resolveRisk: publicProcedure.input(riskIdSchema).mutation(({ input }) => {
    const mission = getMissionOrThrow(input.missionId);
    assertMissionEditable(mission);
    const risk = mission.risks.find((item) => item.id === input.riskId);
    if (!risk) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Risk not found" });
    }
    risk.resolved = true;
    risk.resolvedAt = now();
    touch(mission);
    return risk;
  }),

  delete: publicProcedure.input(missionIdSchema).mutation(({ input }) => {
    const mission = getMissionOrThrow(input.missionId);
    if (mission.status === "active") {
      throw new TRPCError({ code: "CONFLICT", message: "Pause an active mission before deleting it" });
    }
    missions.delete(input.missionId);
    return { missionId: input.missionId };
  }),
});

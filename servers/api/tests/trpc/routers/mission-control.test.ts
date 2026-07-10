import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestContext } from "~/tests/helpers/trpc";

type MissionControlCaller = Awaited<ReturnType<typeof createMissionControlCaller>>;

async function createMissionControlCaller() {
  vi.resetModules();
  const { missionControlRouter } = await import("~/trpc/routers/mission-control");
  return missionControlRouter.createCaller(createTestContext());
}

function createMissionInput(overrides: Partial<MissionInput> = {}) {
  return {
    title: "Launch self-serve workspaces",
    objective: "Enable new teams to reach a useful workspace without assisted onboarding.",
    owner: "Growth Platform",
    targetDate: "2026-06-15",
    confidence: 3,
    ...overrides,
  };
}

type MissionInput = {
  title: string;
  objective: string;
  owner: string;
  targetDate: string;
  confidence: number;
};

async function completeEveryCheckpoint(
  caller: MissionControlCaller,
  mission: Awaited<ReturnType<typeof createMission>>,
) {
  for (const checkpoint of mission.checkpoints) {
    await caller.updateCheckpoint({
      missionId: mission.id,
      checkpointId: checkpoint.id,
      status: "done",
    });
  }
}

async function createMission(caller: MissionControlCaller, overrides: Partial<MissionInput> = {}) {
  return caller.create(createMissionInput(overrides));
}

describe("trpc/routers/mission-control", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-15T09:30:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("list", () => {
    it("starts with an empty portfolio and zeroed summary", async () => {
      const caller = await createMissionControlCaller();

      await expect(caller.list()).resolves.toEqual({
        items: [],
        summary: {
          total: 0,
          active: 0,
          atRisk: 0,
          completed: 0,
          averageProgress: 0,
          dueSoon: 0,
        },
      });
    });

    it("orders missions by their most recent activity", async () => {
      const caller = await createMissionControlCaller();
      vi.setSystemTime(new Date("2026-05-15T09:30:00.000Z"));
      const first = await createMission(caller, { title: "First mission" });
      vi.setSystemTime(new Date("2026-05-15T09:31:00.000Z"));
      const second = await createMission(caller, { title: "Second mission" });

      let portfolio = await caller.list();
      expect(portfolio.items.map((mission) => mission.id)).toEqual([second.id, first.id]);

      vi.setSystemTime(new Date("2026-05-15T09:32:00.000Z"));
      await caller.setConfidence({ missionId: first.id, confidence: 4 });

      portfolio = await caller.list();
      expect(portfolio.items.map((mission) => mission.id)).toEqual([first.id, second.id]);
    });

    it("summarizes active, completed, due-soon, progress, and risky missions", async () => {
      const caller = await createMissionControlCaller();
      const active = await createMission(caller, {
        title: "Active mission",
        targetDate: "2026-05-20",
      });
      const completed = await createMission(caller, {
        title: "Completed mission",
        targetDate: "2026-05-21",
      });
      const risky = await createMission(caller, {
        title: "Risky mission",
        targetDate: "2026-07-01",
      });

      await caller.setStatus({ missionId: active.id, status: "active" });
      await caller.updateCheckpoint({
        missionId: active.id,
        checkpointId: active.checkpoints[0]!.id,
        status: "done",
      });
      await completeEveryCheckpoint(caller, completed);
      await caller.setStatus({ missionId: completed.id, status: "completed" });
      await caller.addRisk({
        missionId: risky.id,
        title: "Vendor capacity",
        mitigation: "Reserve a second delivery window",
        severity: "high",
      });

      const portfolio = await caller.list();
      expect(portfolio.summary).toEqual({
        total: 3,
        active: 1,
        atRisk: 1,
        completed: 1,
        averageProgress: 42,
        dueSoon: 1,
      });
    });
  });

  describe("create", () => {
    it("creates a draft mission with one checkpoint per delivery stage", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      expect(mission).toMatchObject({
        title: "Launch self-serve workspaces",
        owner: "Growth Platform",
        status: "draft",
        confidence: 3,
        progress: 0,
        riskScore: 0,
        isAtRisk: false,
        completedCheckpoints: 0,
        openRisks: 0,
        createdAt: "2026-05-15T09:30:00.000Z",
        updatedAt: "2026-05-15T09:30:00.000Z",
      });
      expect(mission.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(mission.checkpoints).toHaveLength(4);
      expect(mission.checkpoints.map((checkpoint) => checkpoint.stage)).toEqual([
        "discover",
        "design",
        "build",
        "launch",
      ]);
      expect(mission.checkpoints.map((checkpoint) => checkpoint.status)).toEqual([
        "in_progress",
        "pending",
        "pending",
        "pending",
      ]);
      expect(mission.checkpoints.every((checkpoint) => checkpoint.owner === "Growth Platform")).toBe(true);
      expect(mission.checkpoints.every((checkpoint) => checkpoint.completedAt === null)).toBe(true);
    });

    it("spreads default checkpoint dates across the mission window", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller, { targetDate: "2026-06-12" });

      expect(mission.checkpoints.map((checkpoint) => checkpoint.dueDate)).toEqual([
        "2026-05-22",
        "2026-05-29",
        "2026-06-05",
        "2026-06-12",
      ]);
    });

    it("still creates sequential checkpoint dates for an overdue target", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller, { targetDate: "2026-05-01" });

      expect(mission.checkpoints.map((checkpoint) => checkpoint.dueDate)).toEqual([
        "2026-05-16",
        "2026-05-17",
        "2026-05-18",
        "2026-05-19",
      ]);
    });

    it.each([
      ["short title", { title: "x" }],
      ["short objective", { objective: "too short" }],
      ["short owner", { owner: "x" }],
      ["invalid date", { targetDate: "15 May 2026" }],
      ["confidence below range", { confidence: 0 }],
      ["confidence above range", { confidence: 6 }],
      ["fractional confidence", { confidence: 2.5 }],
    ])("rejects %s", async (_scenario, override) => {
      const caller = await createMissionControlCaller();

      await expect(caller.create(createMissionInput(override))).rejects.toMatchObject({ code: "BAD_REQUEST" });
    });

    it("trims user-entered text before storing the mission", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller, {
        title: "  Trimmed title  ",
        objective: "  Produce a clear and measurable outcome.  ",
        owner: "  Platform  ",
      });

      expect(mission).toMatchObject({
        title: "Trimmed title",
        objective: "Produce a clear and measurable outcome.",
        owner: "Platform",
      });
    });
  });

  describe("mission lifecycle", () => {
    it("moves a mission between draft, active, and paused", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      await expect(caller.setStatus({ missionId: mission.id, status: "active" })).resolves.toMatchObject({
        status: "active",
      });
      await expect(caller.setStatus({ missionId: mission.id, status: "paused" })).resolves.toMatchObject({
        status: "paused",
      });
      await expect(caller.setStatus({ missionId: mission.id, status: "active" })).resolves.toMatchObject({
        status: "active",
      });
    });

    it("requires every checkpoint before mission completion", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      await expect(caller.setStatus({ missionId: mission.id, status: "completed" })).rejects.toMatchObject({
        code: "PRECONDITION_FAILED",
        message: "Complete every checkpoint before closing a mission",
      });

      await completeEveryCheckpoint(caller, mission);
      await expect(caller.setStatus({ missionId: mission.id, status: "completed" })).resolves.toMatchObject({
        status: "completed",
        progress: 100,
      });
    });

    it("does not reopen a completed mission", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);
      await completeEveryCheckpoint(caller, mission);
      await caller.setStatus({ missionId: mission.id, status: "completed" });

      await expect(caller.setStatus({ missionId: mission.id, status: "active" })).rejects.toMatchObject({
        code: "CONFLICT",
        message: "Completed missions cannot be reopened",
      });
    });

    it("updates delivery confidence and rejects out-of-range values", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      await expect(caller.setConfidence({ missionId: mission.id, confidence: 5 })).resolves.toMatchObject({
        confidence: 5,
      });
      await expect(caller.setConfidence({ missionId: mission.id, confidence: 6 })).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });

    it("rejects operations for a missing mission", async () => {
      const caller = await createMissionControlCaller();
      const missingMissionId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

      await expect(caller.setConfidence({ missionId: missingMissionId, confidence: 4 })).rejects.toMatchObject({
        code: "NOT_FOUND",
        message: "Mission not found",
      });
    });
  });

  describe("checkpoints", () => {
    it("updates checkpoint status, completion timestamp, and mission progress", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);
      const checkpoint = mission.checkpoints[0]!;
      vi.setSystemTime(new Date("2026-05-16T10:00:00.000Z"));

      const completed = await caller.updateCheckpoint({
        missionId: mission.id,
        checkpointId: checkpoint.id,
        status: "done",
      });

      expect(completed).toMatchObject({
        id: checkpoint.id,
        status: "done",
        completedAt: "2026-05-16T10:00:00.000Z",
      });
      const portfolio = await caller.list();
      expect(portfolio.items[0]).toMatchObject({
        progress: 25,
        completedCheckpoints: 1,
        updatedAt: "2026-05-16T10:00:00.000Z",
      });
    });

    it("clears completion time when a checkpoint is reopened", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);
      const checkpoint = mission.checkpoints[0]!;
      await caller.updateCheckpoint({ missionId: mission.id, checkpointId: checkpoint.id, status: "done" });

      await expect(
        caller.updateCheckpoint({ missionId: mission.id, checkpointId: checkpoint.id, status: "in_progress" }),
      ).resolves.toMatchObject({ status: "in_progress", completedAt: null });
    });

    it("marks the mission at risk when a checkpoint is blocked", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      await caller.updateCheckpoint({
        missionId: mission.id,
        checkpointId: mission.checkpoints[1]!.id,
        status: "blocked",
      });

      const portfolio = await caller.list();
      expect(portfolio.items[0]).toMatchObject({ isAtRisk: true, riskScore: 0 });
      expect(portfolio.summary.atRisk).toBe(1);
    });

    it("adds a custom checkpoint", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      const checkpoint = await caller.addCheckpoint({
        missionId: mission.id,
        title: "Confirm regional support coverage",
        stage: "launch",
        owner: "Support Operations",
        dueDate: "2026-06-10",
      });

      expect(checkpoint).toMatchObject({
        title: "Confirm regional support coverage",
        stage: "launch",
        owner: "Support Operations",
        dueDate: "2026-06-10",
        status: "pending",
        completedAt: null,
      });
      const portfolio = await caller.list();
      expect(portfolio.items[0]!.checkpoints).toHaveLength(5);
    });

    it("rejects a missing checkpoint", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      await expect(
        caller.updateCheckpoint({
          missionId: mission.id,
          checkpointId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          status: "done",
        }),
      ).rejects.toMatchObject({ code: "NOT_FOUND", message: "Checkpoint not found" });
    });
  });

  describe("risk register", () => {
    it.each([
      ["low", 1, false],
      ["medium", 2, false],
      ["high", 3, true],
      ["critical", 5, true],
    ] as const)("weights a %s risk as %i", async (severity, riskScore, isAtRisk) => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      await caller.addRisk({
        missionId: mission.id,
        title: `${severity} delivery risk`,
        mitigation: "Run a focused mitigation experiment",
        severity,
      });

      const portfolio = await caller.list();
      expect(portfolio.items[0]).toMatchObject({ riskScore, isAtRisk, openRisks: 1 });
    });

    it("accumulates open risk weights", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);
      await caller.addRisk({
        missionId: mission.id,
        title: "First medium risk",
        mitigation: "Run the first mitigation",
        severity: "medium",
      });
      await caller.addRisk({
        missionId: mission.id,
        title: "Second medium risk",
        mitigation: "Run the second mitigation",
        severity: "medium",
      });

      const portfolio = await caller.list();
      expect(portfolio.items[0]).toMatchObject({ riskScore: 4, isAtRisk: true, openRisks: 2 });
    });

    it("resolves a risk and removes it from the mission risk score", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);
      const risk = await caller.addRisk({
        missionId: mission.id,
        title: "Critical dependency unavailable",
        mitigation: "Switch to the approved fallback",
        severity: "critical",
      });
      vi.setSystemTime(new Date("2026-05-17T12:00:00.000Z"));

      await expect(caller.resolveRisk({ missionId: mission.id, riskId: risk.id })).resolves.toMatchObject({
        resolved: true,
        resolvedAt: "2026-05-17T12:00:00.000Z",
      });
      const portfolio = await caller.list();
      expect(portfolio.items[0]).toMatchObject({ riskScore: 0, isAtRisk: false, openRisks: 0 });
    });

    it("rejects a missing risk", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);

      await expect(
        caller.resolveRisk({ missionId: mission.id, riskId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" }),
      ).rejects.toMatchObject({ code: "NOT_FOUND", message: "Risk not found" });
    });
  });

  describe("deletion and completed-state protection", () => {
    it("deletes draft and paused missions", async () => {
      const caller = await createMissionControlCaller();
      const draft = await createMission(caller, { title: "Disposable draft" });
      const paused = await createMission(caller, { title: "Disposable paused mission" });
      await caller.setStatus({ missionId: paused.id, status: "paused" });

      await expect(caller.delete({ missionId: draft.id })).resolves.toEqual({ missionId: draft.id });
      await expect(caller.delete({ missionId: paused.id })).resolves.toEqual({ missionId: paused.id });
      await expect(caller.list()).resolves.toMatchObject({ items: [] });
    });

    it("requires an active mission to be paused before deletion", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);
      await caller.setStatus({ missionId: mission.id, status: "active" });

      await expect(caller.delete({ missionId: mission.id })).rejects.toMatchObject({
        code: "CONFLICT",
        message: "Pause an active mission before deleting it",
      });
    });

    it("rejects checkpoint, confidence, and risk edits after completion", async () => {
      const caller = await createMissionControlCaller();
      const mission = await createMission(caller);
      await completeEveryCheckpoint(caller, mission);
      await caller.setStatus({ missionId: mission.id, status: "completed" });

      await expect(caller.setConfidence({ missionId: mission.id, confidence: 4 })).rejects.toMatchObject({
        code: "CONFLICT",
      });
      await expect(
        caller.updateCheckpoint({
          missionId: mission.id,
          checkpointId: mission.checkpoints[0]!.id,
          status: "pending",
        }),
      ).rejects.toMatchObject({ code: "CONFLICT" });
      await expect(
        caller.addRisk({
          missionId: mission.id,
          title: "Late risk",
          mitigation: "This mutation should be rejected",
          severity: "low",
        }),
      ).rejects.toMatchObject({ code: "CONFLICT" });
    });
  });
});

import { createMissionCheckpointMock, createMissionMock, createMissionRiskMock } from "@tests/testing-utils/builders";

import {
  canCompleteMission,
  CHECKPOINT_STATUS_LABELS,
  filterMissions,
  formatTargetDate,
  getCheckpointAction,
  getConfidenceLabel,
  getCurrentStage,
  getDaysUntilTarget,
  getMissionHealth,
  getMissionSearchText,
  getMissionStatusAction,
  getNextCheckpointStatus,
  getNextMissionStatus,
  getSuggestedTargetDate,
  getTargetDateLabel,
  groupCheckpointsByStage,
  MISSION_HEALTH_LABELS,
  MISSION_STATUS_LABELS,
  RISK_SEVERITY_LABELS,
  STAGE_LABELS,
  STAGE_ORDER,
} from "@/lib/mission-control";

describe("mission-control domain helpers", () => {
  describe("display labels", () => {
    test("provides readable labels for mission statuses", () => {
      expect(MISSION_STATUS_LABELS).toEqual({
        draft: "Draft",
        active: "Active",
        paused: "Paused",
        completed: "Complete",
      });
    });

    test("provides readable labels for stages", () => {
      expect(STAGE_LABELS).toEqual({
        discover: "Discover",
        design: "Design",
        build: "Build",
        launch: "Launch",
      });
      expect(STAGE_ORDER).toEqual(["discover", "design", "build", "launch"]);
    });

    test("provides readable checkpoint, risk, and health labels", () => {
      expect(CHECKPOINT_STATUS_LABELS.blocked).toBe("Blocked");
      expect(CHECKPOINT_STATUS_LABELS.in_progress).toBe("In progress");
      expect(RISK_SEVERITY_LABELS.critical).toBe("Critical");
      expect(MISSION_HEALTH_LABELS.at_risk).toBe("At risk");
    });
  });

  describe("mission health", () => {
    test("completed missions always report complete health", () => {
      expect(
        getMissionHealth(
          createMissionMock({ status: "completed", isAtRisk: true, riskScore: 5, openRisks: 1, confidence: 1 }),
        ),
      ).toBe("complete");
    });

    test("server risk signals take precedence over confidence", () => {
      expect(getMissionHealth(createMissionMock({ isAtRisk: true, confidence: 5 }))).toBe("at_risk");
      expect(getMissionHealth(createMissionMock({ riskScore: 5, confidence: 5 }))).toBe("at_risk");
    });

    test("low confidence and open risks move a mission to watch", () => {
      expect(getMissionHealth(createMissionMock({ confidence: 2 }))).toBe("watch");
      expect(getMissionHealth(createMissionMock({ confidence: 5, openRisks: 1 }))).toBe("watch");
    });

    test("healthy missions remain on track", () => {
      expect(getMissionHealth(createMissionMock({ confidence: 4, openRisks: 0, riskScore: 0 }))).toBe("on_track");
    });
  });

  describe("mission lifecycle helpers", () => {
    test.each([
      ["draft", "active"],
      ["active", "paused"],
      ["paused", "active"],
      ["completed", null],
    ] as const)("maps %s to the next status", (status, expected) => {
      expect(getNextMissionStatus(status)).toBe(expected);
    });

    test.each([
      ["draft", "Start mission"],
      ["active", "Pause mission"],
      ["paused", "Resume mission"],
      ["completed", "Mission complete"],
    ] as const)("maps %s to an action label", (status, expected) => {
      expect(getMissionStatusAction(status)).toBe(expected);
    });

    test("only allows completion when every checkpoint is done", () => {
      expect(canCompleteMission(createMissionMock())).toBe(false);
      expect(
        canCompleteMission(
          createMissionMock({
            checkpoints: [
              createMissionCheckpointMock({ status: "done" }),
              createMissionCheckpointMock({ id: "checkpoint-2", status: "done" }),
            ],
          }),
        ),
      ).toBe(true);
      expect(canCompleteMission(createMissionMock({ checkpoints: [] }))).toBe(false);
    });
  });

  describe("checkpoint workflow", () => {
    test.each([
      ["pending", "in_progress"],
      ["in_progress", "done"],
      ["blocked", "in_progress"],
      ["done", "pending"],
    ] as const)("moves %s to %s", (status, expected) => {
      expect(getNextCheckpointStatus(status)).toBe(expected);
    });

    test.each([
      ["pending", "Start"],
      ["in_progress", "Finish"],
      ["blocked", "Unblock"],
      ["done", "Reopen"],
    ] as const)("labels %s as %s", (status, expected) => {
      expect(getCheckpointAction(status)).toBe(expected);
    });

    test("selects the first incomplete stage", () => {
      const checkpoints = [
        createMissionCheckpointMock({ stage: "discover", status: "done" }),
        createMissionCheckpointMock({ id: "design", stage: "design", status: "done" }),
        createMissionCheckpointMock({ id: "build", stage: "build", status: "blocked" }),
        createMissionCheckpointMock({ id: "launch", stage: "launch", status: "pending" }),
      ];

      expect(getCurrentStage(checkpoints)).toBe("build");
    });

    test("returns launch after all checkpoints are complete", () => {
      expect(getCurrentStage([createMissionCheckpointMock({ status: "done" })])).toBe("launch");
    });

    test("groups checkpoints in canonical stage order", () => {
      const checkpoints = [
        createMissionCheckpointMock({ id: "launch", stage: "launch" }),
        createMissionCheckpointMock({ id: "discover", stage: "discover" }),
        createMissionCheckpointMock({ id: "build", stage: "build" }),
        createMissionCheckpointMock({ id: "design", stage: "design" }),
        createMissionCheckpointMock({ id: "build-2", stage: "build" }),
      ];

      const groups = groupCheckpointsByStage(checkpoints);
      expect(groups.map((group) => group.stage)).toEqual(STAGE_ORDER);
      expect(groups.map((group) => group.checkpoints.map((checkpoint) => checkpoint.id))).toEqual([
        ["discover"],
        ["design"],
        ["build", "build-2"],
        ["launch"],
      ]);
    });
  });

  describe("date presentation", () => {
    const today = new Date(2026, 4, 15, 12);

    test("formats ISO dates for compact display", () => {
      expect(formatTargetDate("2026-06-12")).toBe("12 Jun 2026");
    });

    test("returns an invalid value unchanged", () => {
      expect(formatTargetDate("not-a-date")).toBe("not-a-date");
    });

    test.each([
      ["2026-05-14", -1],
      ["2026-05-15", 0],
      ["2026-05-16", 1],
      ["2026-06-12", 28],
    ])("calculates days from today to %s", (date, expected) => {
      expect(getDaysUntilTarget(date, today)).toBe(expected);
    });

    test.each([
      ["2026-05-10", "5d overdue"],
      ["2026-05-15", "Due today"],
      ["2026-05-16", "Due tomorrow"],
      ["2026-06-12", "28d remaining"],
    ])("describes target %s as %s", (date, expected) => {
      expect(getTargetDateLabel(date, today)).toBe(expected);
    });

    test("suggests a date four weeks from the provided day", () => {
      expect(getSuggestedTargetDate(today)).toBe("2026-06-12");
    });

    test("pads suggested date months and days", () => {
      expect(getSuggestedTargetDate(new Date(2026, 0, 2, 12))).toBe("2026-01-30");
    });
  });

  describe("confidence labels", () => {
    test.each([
      [1, "Very low"],
      [2, "Low"],
      [3, "Medium"],
      [4, "High"],
      [5, "Very high"],
      [8, "Very high"],
    ])("labels confidence %i as %s", (confidence, expected) => {
      expect(getConfidenceLabel(confidence)).toBe(expected);
    });
  });

  describe("search and filters", () => {
    const activeMission = createMissionMock({
      id: "active",
      status: "active",
      title: "Launch workspaces",
      owner: "Platform Team",
      checkpoints: [createMissionCheckpointMock({ title: "Interview workspace admins", owner: "Research Team" })],
      risks: [createMissionRiskMock({ title: "Identity vendor delay", mitigation: "Use local auth fallback" })],
    });
    const pausedMission = createMissionMock({
      id: "paused",
      status: "paused",
      title: "Improve activation",
      objective: "Reduce the time needed to invite a complete project team.",
      owner: "Growth Team",
    });

    test("builds normalized search text across mission details", () => {
      const searchText = getMissionSearchText(activeMission);
      expect(searchText).toContain("launch workspaces");
      expect(searchText).toContain("platform team");
      expect(searchText).toContain("interview workspace admins");
      expect(searchText).toContain("research team");
      expect(searchText).toContain("identity vendor delay");
      expect(searchText).toContain("local auth fallback");
    });

    test("returns all missions for empty query and all status", () => {
      expect(filterMissions([activeMission, pausedMission], "", "all")).toEqual([activeMission, pausedMission]);
    });

    test("filters by status", () => {
      expect(filterMissions([activeMission, pausedMission], "", "paused")).toEqual([pausedMission]);
    });

    test.each(["launch", "RESEARCH", "admins", "vendor", "fallback"])(
      "finds nested mission content for %s",
      (query) => {
        expect(filterMissions([activeMission, pausedMission], query, "all")).toEqual([activeMission]);
      },
    );

    test("combines status and text filters", () => {
      expect(filterMissions([activeMission, pausedMission], "team", "paused")).toEqual([pausedMission]);
      expect(filterMissions([activeMission, pausedMission], "vendor", "paused")).toEqual([]);
    });

    test("ignores surrounding query whitespace", () => {
      expect(filterMissions([activeMission, pausedMission], "  activation  ", "all")).toEqual([pausedMission]);
    });
  });
});

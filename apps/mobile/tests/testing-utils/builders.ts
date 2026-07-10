import type { Mission, MissionCheckpoint, MissionRisk } from "@/schemas/mission-control";
import type { Task } from "@/schemas/task";

// Builders provide boring valid defaults while keeping scenario-defining fields
// visible in each test. Prefer createTaskMock({ completed: true }) over shared
// fixtures whose hidden defaults become part of the test by accident.
export function createTaskMock(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Keep the starter testable",
    completed: false,
    createdAt: "2026-05-01T00:00:00.000Z",
    ...overrides,
  };
}

export function createMissionCheckpointMock(overrides: Partial<MissionCheckpoint> = {}): MissionCheckpoint {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Validate the problem and success signal",
    stage: "discover",
    owner: "Platform Team",
    dueDate: "2026-05-22",
    status: "in_progress",
    completedAt: null,
    ...overrides,
  };
}

export function createMissionRiskMock(overrides: Partial<MissionRisk> = {}): MissionRisk {
  return {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Partner capacity is uncertain",
    mitigation: "Book a fallback delivery window",
    severity: "high",
    resolved: false,
    createdAt: "2026-05-15T10:00:00.000Z",
    resolvedAt: null,
    ...overrides,
  };
}

export function createMissionMock(overrides: Partial<Mission> = {}): Mission {
  const checkpoints = overrides.checkpoints ?? [
    createMissionCheckpointMock(),
    createMissionCheckpointMock({
      id: "33333333-3333-4333-8333-333333333333",
      title: "Align on the solution and delivery plan",
      stage: "design",
      dueDate: "2026-05-29",
      status: "pending",
    }),
    createMissionCheckpointMock({
      id: "44444444-4444-4444-8444-444444444444",
      title: "Deliver the smallest complete increment",
      stage: "build",
      dueDate: "2026-06-05",
      status: "pending",
    }),
    createMissionCheckpointMock({
      id: "55555555-5555-4555-8555-555555555555",
      title: "Release, observe, and close the loop",
      stage: "launch",
      dueDate: "2026-06-12",
      status: "pending",
    }),
  ];
  const risks = overrides.risks ?? [];
  const completedCheckpoints = checkpoints.filter((checkpoint) => checkpoint.status === "done").length;
  const openRisks = risks.filter((risk) => !risk.resolved).length;

  return {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    title: "Launch self-serve workspaces",
    objective: "Enable new teams to reach a useful workspace without assisted onboarding.",
    owner: "Platform Team",
    targetDate: "2026-06-12",
    confidence: 3,
    status: "draft",
    checkpoints,
    risks,
    createdAt: "2026-05-15T09:30:00.000Z",
    updatedAt: "2026-05-15T09:30:00.000Z",
    progress: checkpoints.length === 0 ? 0 : Math.round((completedCheckpoints / checkpoints.length) * 100),
    riskScore: 0,
    isAtRisk: false,
    completedCheckpoints,
    openRisks,
    ...overrides,
  };
}

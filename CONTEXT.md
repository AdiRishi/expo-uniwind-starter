# Expo Uniwind Starter

This context describes the starter app and its Codex harness. Use this language when discussing app setup, validation, and agent-run workflows.

## Language

**Starter app**:
The Expo template shipped by this repository.
_Avoid_: demo app, sample project

**App server**:
The Expo native development process started with `pnpm ios`, including Metro and the iOS simulator runtime.
_Avoid_: frontend server, client server

**API server**:
The Nitro/tRPC development server started with `pnpm run server:dev`.
_Avoid_: backend process, local API

**Simulator preview**:
The serve-sim browser surface at `http://localhost:8081/.sim` that streams the running iOS simulator through Metro.
_Avoid_: web app, browser app

**Harness validation**:
The agent-runnable feedback loop that starts the app server and API server, drives the simulator preview with Browser Use, and reports pass/fail evidence.
_Avoid_: manual QA, smoke test

**Task item**:
A todo-style item managed by the Tasks screen and the tRPC `tasks` router.
_Avoid_: ticket, issue

**Codex worktree**:
An isolated checkout created by the Codex app for a single agent task.
_Avoid_: clone, copy

## Relationships

- A **Codex worktree** runs its own **App server** and **API server**.
- The **App server** exposes the **Simulator preview** through Metro at `/.sim`.
- The **Starter app** calls the **API server** for server status and **Task item** operations.
- **Harness validation** uses Browser Use to interact with the **Simulator preview**.

## Example Dialogue

> **Dev:** "Can the agent verify the Tasks flow without touching the simulator directly?"
> **Domain expert:** "Yes. Start the **API server**, start the **App server**, open the **Simulator preview**, then complete **Harness validation** through Browser Use."

## Flagged Ambiguities

- "app server" could mean Metro, the simulator, or the API. Resolved: **App server** means the Expo native process started by `pnpm ios`; **API server** means Nitro/tRPC on port 3000.
- "task" could mean a Codex task or an app todo. Resolved: use **Task item** for app data and **Codex worktree** or agent task for Codex execution.

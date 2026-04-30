# Codex Harness

This repo is meant to be usable from the Codex app in a local checkout or Codex worktree.

## Goal

An agent should be able to:

1. Start from a local branch or Codex worktree.
2. Install dependencies.
3. Start the API server.
4. Start the app server.
5. Open the simulator preview in the Codex in-app browser.
6. Validate the feature or fix with Browser Use.

## Codex App Setup

The project-local environment lives at `.codex/environments/environment.toml`.

Use the actions in this order:

1. `API Server` starts `pnpm run server:dev` on `http://localhost:3000`.
2. `Run` starts `pnpm ios`, which owns Metro on `http://localhost:8081` and opens the iOS simulator.
3. `Check` runs `pnpm run check`.

The setup script runs `pnpm install --frozen-lockfile` for new worktrees.

## Manual Shell Setup

Use separate terminals because the first two commands are long-running:

```bash
pnpm install --frozen-lockfile
pnpm run server:dev
pnpm ios
```

When Metro is ready, the serve-sim preview is available at:

```text
http://localhost:8081/.sim
```

## Browser Use Validation

Use the Browser Use plugin against the Codex in-app browser.

1. Open `http://localhost:8081/.sim`.
2. Wait for the simulator preview to show a live stream.
3. On Home, verify `Server Connected`.
4. Switch tabs: Home -> Explore -> Tasks -> Home.
5. On Tasks, create a Task item.
6. Delete the Task item.
7. Verify the empty or updated Tasks state.
8. Check browser console warnings and errors.
9. Run `pnpm run check`.

For the simulator stream, Browser Use is interacting with pixels from a native app, not normal DOM controls. Prefer CUA clicks and `keypress` for the simulator surface when DOM locators cannot target the app.

## Healthy Signals

- `pnpm run server:dev` serves Nitro on port 3000.
- `pnpm ios` starts Metro on port 8081 and opens the iOS simulator.
- `http://localhost:8081/.sim` shows a live simulator preview.
- Home shows `Server Connected`.
- Tasks can create and delete a Task item.
- Browser console has no new warnings or errors from the validated flow.
- `pnpm run check` passes.

## Failure Triage

- If Home shows `Server Disconnected`, check that `pnpm run server:dev` is still running.
- If `/.sim` shows no stream, check that `pnpm ios` is still running and that a simulator is booted.
- If the simulator preview shows a JSON error for simulator endpoints, inspect `metro.config.cjs` before changing app code.
- If Browser Use cannot type into the native input, focus the input with CUA click and send text with `keypress`.

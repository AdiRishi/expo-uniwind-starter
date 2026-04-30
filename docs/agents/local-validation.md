# Local App Validation

Use this procedure to validate local app changes from the Codex app in a local checkout or Codex worktree.

The project-local Codex environment lives at `.codex/environments/environment.toml`. Its setup script owns dependency installation and native prebuild work for new worktrees, so do not add an extra install step to normal harness validation.

## Start Servers

Use the Codex app actions in this order:

1. `API Server` starts the Nitro/tRPC API server on `http://localhost:3000`.
2. `Run IOS` starts the Expo native app server, Metro on `http://localhost:8081`, and the iOS simulator.

If you are not using Codex app actions, start the same long-running processes in separate terminals:

```bash
pnpm run server:dev
pnpm ios
```

When Metro is ready, the simulator preview is available at:

```text
http://localhost:8081/.sim
```

## Validate With Browser Use

Use the Browser Use plugin against the Codex in-app browser.

1. Open `http://localhost:8081/.sim`.
2. Wait for the simulator preview to show a live stream.
3. Exercise the user flow affected by the feature or fix.
4. Collect enough visual evidence to confirm the expected behavior.
5. Check browser console warnings and errors for issues introduced by the validated flow.
6. Run the `Check` action, or run `pnpm run check` from the shell.

The simulator preview streams a native app, so Browser Use may not be able to target normal DOM controls inside the app. Prefer CUA clicks and keyboard actions for the simulator surface when DOM locators cannot target the native UI.

## Cleanup

If you started the API server or app server, stop them before your final response unless the user explicitly asked you to leave them running.

After stopping servers that you started, verify the standard harness ports are clear:

```bash
lsof -iTCP:3000 -sTCP:LISTEN -n -P || true
lsof -iTCP:8081 -sTCP:LISTEN -n -P || true
```

Both commands should print no listening process for servers you started. If either port is still occupied by a process you started, stop it and check again. Do not kill a pre-existing process unless the user asks you to.

## Troubleshooting

- If the simulator preview does not load, confirm the app server is still running and Metro is listening on port `8081`.
- If API-backed app behavior fails, confirm the API server is still running and listening on port `3000`.
- If `/.sim` shows simulator endpoint errors, inspect `metro.config.cjs` before changing app code.
- If Browser Use cannot type into the native app, focus the input with a CUA click and send keyboard input instead of relying on DOM form helpers.

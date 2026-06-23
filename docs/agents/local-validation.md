# Local App Validation

Use this procedure to validate local native app changes from the Codex app in a local checkout or Codex worktree.

The project-local Codex environment lives at `.codex/environments/environment.toml`. Its setup script owns dependency installation and native prebuild work for new worktrees, so do not add an extra install step to normal harness validation.

This app embeds `serve-sim` into Metro at `http://localhost:8081/.sim`. Use the repo's `serve-sim` skill for simulator-specific controls, prerequisites, normalized coordinates, accessibility lookup, gestures, camera injection, permissions, CoreAnimation debug, and CLI gotchas.

## Start Servers

Use the Codex app actions in this order:

1. `API Server` starts the Nitro/tRPC API server on `http://localhost:3000`.
2. `Run IOS` starts Metro on `http://localhost:8081`, installs/launches the development build, and opens the iOS simulator.

If you are not using Codex app actions, start the same long-running processes in separate terminals:

```bash
pnpm run server:dev
pnpm ios
```

When Metro is ready, the simulator preview is available at:

```text
http://localhost:8081/.sim
```

## Validation Loop

Use the Browser plugin against the Codex in-app browser.

Default to the same loop a human reviewer would use: look at the simulator preview, click visible targets, type into focused fields, and confirm what changed. Simulator-specific tools exist to recover from friction or validate device behavior, not to replace the normal Browser workflow.

1. Open `http://localhost:8081/.sim`.
2. If no stream is running, use the page's simulator list. Click `Start stream` for a booted simulator, or `Boot & stream` for a shutdown simulator.
3. Wait for the live simulator frame and green `live` indicator.
4. Start with the fast path: use Browser screenshots, visible page state, and normal Browser coordinate clicks/typing to exercise the flow. Browser coordinate click means clicking the visible simulator frame/canvas where a human would click, not using DOM locators for native app internals.
5. Re-snapshot after each meaningful state change. Use visual screenshots as the default evidence for UI behavior.
6. Escalate only when there is a concrete reason for the current action: unclear targets, accessibility validation, missed Browser input, precision input, native scrolling, permissions, camera, rotation, memory warning, or another simulator-specific feature.
7. Check browser console warnings/errors after the flow:

```js
await tab.dev.logs({ levels: ["error", "warn"], limit: 50 });
```

8. Run the `Check` action, or run `pnpm run check` from the shell.

The simulator preview streams a native app, not an HTML version of the app. Browser DOM locators primarily see the `serve-sim` chrome, but Browser's visual/coordinate tools are still the default way to operate the app. Keep the UI uncluttered by default; open Tools panels and overlays only when they help answer the current validation question.

### Escalation Rules

Use this order unless the user's request explicitly asks for accessibility, camera, location, permissions, rotation, memory pressure, or another simulator-specific feature:

1. Browser screenshot or visible state.
2. Browser coordinate click/type/keypress on the visible simulator preview.
3. Follow the `serve-sim` skill when the validation needs simulator-specific controls.

If you escalate, name the reason in your validation notes and return to Browser screenshots and Browser coordinate input when the next action is ordinary visible UI navigation.

## Evidence Standard

A good local validation note should say what was actually observed, not just which commands ran. Include:

- the screen or flow exercised;
- the simulator/device if relevant;
- at least one visual observation from the screenshot;
- AX evidence only when you used AX to answer a specific accessibility, targeting, or visibility question;
- console/log result, especially if there were warnings or errors;
- the final check command result.

For UI changes, do not stop at "it loaded." Navigate to the changed surface, interact with the changed controls, verify the post-action state, and capture evidence after the state change.

## Cleanup

If you started the API server or app server, stop them before your final response unless the user explicitly asked you to leave them running.

Stop simulator streams you started:

```bash
pnpm --filter @repo/mobile exec serve-sim --list
pnpm --filter @repo/mobile exec serve-sim --kill
```

`pnpm --filter @repo/mobile exec serve-sim --list` should show no running stream after the kill command. If it still lists a stream you started, run the kill command again with the listed device.

After stopping servers that you started, verify the standard harness ports are clear:

```bash
lsof -iTCP:3000 -sTCP:LISTEN -n -P || true
lsof -iTCP:8081 -sTCP:LISTEN -n -P || true
```

Both commands should print no listening process for servers you started. If either port is still occupied by a process you started, stop it and check again. Do not kill a pre-existing process unless the user asks you to.

## Troubleshooting

- If `/.sim` does not load, confirm Metro is listening on `8081`.
- If API-backed app behavior fails, confirm the API server is listening on `3000`.
- If `/.sim` shows no stream, use the simulator list on the page first.
- If Browser interaction cannot answer the validation question, follow the `serve-sim` skill for the specific simulator control or inspection path.

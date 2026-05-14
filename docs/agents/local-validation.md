# Local App Validation

Use this procedure to validate local native app changes from the Codex app in a local checkout or Codex worktree.

The project-local Codex environment lives at `.codex/environments/environment.toml`. Its setup script owns dependency installation and native prebuild work for new worktrees, so do not add an extra install step to normal harness validation.

`serve-sim` is the native validation harness. It streams the booted iOS Simulator into the browser, exposes simulator controls, and adds inspection tools that Browser Use can read. Before relying on a behavior, verify the installed version:

```bash
node -p "require('./node_modules/serve-sim/package.json').version"
npm view serve-sim version dist-tags --json
pnpm exec serve-sim --help
pnpm exec serve-sim camera --help
```

If this document and the CLI disagree, trust the installed CLI after validating it in `http://localhost:8081/.sim`.

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

Default to the same loop a human reviewer would use: look at the simulator preview, click visible targets, type into focused fields, and confirm what changed. Do not start by turning on the AX overlay or converting visible taps into `serve-sim tap` commands. Those tools exist to recover from friction, not to replace the normal Browser workflow.

Escalation is per action, not per session. A missed Browser click may justify one `serve-sim tap` for that specific target; it does not unlock `serve-sim tap` for the rest of the flow. After any fallback tap, return to Browser screenshots and Browser coordinate clicks for the next visible target.

1. Open `http://localhost:8081/.sim`.
2. If no stream is running, use the page's simulator list. Click `Start stream` for a booted simulator, or `Boot & stream` for a shutdown simulator.
3. Wait for the live simulator frame and green `live` indicator.
4. Start with the fast path: use Browser screenshots, visible page state, and normal Browser coordinate clicks/typing to exercise the flow. Browser coordinate click means clicking the visible simulator frame/canvas where a human would click, not using DOM locators for native app internals.
5. Re-snapshot after each meaningful state change. Use visual screenshots as the default evidence for UI behavior.
6. Escalate only when there is a concrete reason for the current action: AX overlay for unclear targets or accessibility validation, `serve-sim tap` after a Browser click misses this target or precision matters for this target, and WebSocket gestures for native scrolling.
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
3. AX overlay only if visual targeting is ambiguous, a Browser click missed, or you need accessibility labels/roles.
4. `serve-sim tap` only if Browser input missed for this specific target, the target is too small/unstable, or you need a repeatable normalized coordinate for this exact action.
5. WebSocket gesture for native scrolling or complex drags where Browser drag/scroll is unreliable.

Do not use AX overlay just to prove the screen has text that is already visible. Do not use `serve-sim tap` for ordinary visible buttons before trying a Browser click on that same button. If you escalate, name the reason in your validation notes, for example: "Browser click hit the overlay chrome for the Tasks tab, so I used one normalized `serve-sim tap` for that tab."

Before using AX or `serve-sim tap`, ask: "What did the normal Browser interaction fail to do?" If the answer is only "the app is native" or "this may be more reliable," do not escalate yet.

After using `serve-sim tap`, ask the same question again for the next target. A previous Browser miss is not evidence that the next visible button, tab, card, or form control also needs CLI input. Consecutive `serve-sim tap` commands for ordinary UI navigation are usually a process smell; pause and return to Browser coordinate clicks unless each tap has its own fresh failure or precision requirement.

## What serve-sim Provides

### Preview And Device State

`/.sim` embeds the preview inside Metro. It can start streams, show available simulators, open a multi-device grid, resize the simulator frame, rotate the device, reload the RN bundle, send Home, and open side panels.

Useful probes:

```bash
pnpm exec serve-sim --list
curl -s http://localhost:8081/.sim/api
curl -s http://localhost:8081/.sim/grid/api
curl -s http://localhost:8081/.sim/grid/api/memory
```

`--list` returns the active `streamUrl`, `wsUrl`, port, device UDID, and helper PID. `/.sim/api` returns the same preview config plus endpoint paths for logs, app state, AX, DevTools, and grid controls.

Do not expose the preview with `serve-sim --host 0.0.0.0` during normal validation. The preview includes a token-gated host shell exec route for its own tools; keep it bound to loopback unless the user explicitly asks for LAN access on a trusted network.

### AX Overlay

The AX overlay is an escalation and accessibility inspection tool, not the standard mode for validation. Leave it off during ordinary smoke validation so the simulator stays readable and the Browser interaction loop stays quick.

Enable it from `Tools -> AX Tree -> Enable overlay`, or the toolbar accessibility button, when the normal visual path is not enough. Browser snapshots will then include native elements as browser-visible buttons/list items with labels, roles, and sizes. This is excellent for:

- disambiguating a target after Browser clicks miss or hit the wrong thing;
- confirming text, buttons, tabs, cards, and list rows when visual screenshots are ambiguous or accessibility evidence matters;
- finding accessible labels that are hard to read visually;
- detecting missing or noisy accessibility labels;
- understanding off-screen scroll content after a gesture;
- deriving target regions for native taps.

Do not enable AX just because the app is native. If the target is plainly visible, use Browser coordinate input first.

Do not assume clicking an AX overlay element performs the native action. In validation, clicking an overlay tab target may highlight/focus the overlay target without navigating. After a normal Browser click has failed or when a repeatable normalized coordinate is required, use `serve-sim tap`:

```bash
pnpm exec serve-sim tap 0.32 0.955
```

Use AX to decide what to tap, then use Browser coordinate input first if the target is plainly visible. Escalate to `serve-sim tap` when Browser misses, when the panel/viewport makes coordinates unstable, or when you need a repeatable normalized coordinate. Turn AX off as soon as it has answered the question so screenshots and subsequent interactions are not cluttered by overlay boxes.

### Native Input

Default to Browser coordinate input for simple visible taps and ordinary text entry. It is fast, keeps all evidence in the Browser session, and is usually good enough.

Use `serve-sim` CLI input when Browser input has failed for the current target, when that target requires precise normalized coordinates, when testing hardware/device controls, or when a single action must be repeatable across viewport sizes. `serve-sim` coordinates are normalized to the simulator screen, not the browser viewport:

```bash
pnpm exec serve-sim tap <x> <y>
pnpm exec serve-sim button home
pnpm exec serve-sim rotate portrait
pnpm exec serve-sim rotate landscape_left
pnpm exec serve-sim memory-warning
pnpm exec serve-sim ca-debug blended on
pnpm exec serve-sim ca-debug blended off
```

Use `tap` for a single fallback tap, then go back to Browser for the next visible target. Do not turn a successful fallback into a CLI-tap mode for the rest of the flow. `gesture` sends one touch event per invocation, so do not build a drag by running separate `gesture begin`, `gesture move`, and `gesture end` commands. For drags, keep one WebSocket open and send the whole sequence.

Coordinates are normalized from `0` to `1`, where `x = 0.5, y = 0.5` is the center of the simulator screen. For tab bars on the current iPhone simulator, `y` around `0.94-0.96` hits the tab row. Recalibrate visually if the device, orientation, or UI changes.

Do not convert every click to `serve-sim tap` just because it is available. That slows validation down, hides the human-visible interaction path, and makes the transcript harder to follow. A validation note that starts with `serve-sim tap` for a normal visible button is a smell; a second consecutive `serve-sim tap` for ordinary UI navigation is a stronger smell. Each CLI tap should explain the fresh Browser failure or precision requirement for that exact target.

Screenshot capture problems are not tap problems. If Browser screenshot capture times out but the app is visible in the in-app browser, keep using Browser coordinate clicks for visible targets. Use `xcrun simctl io booted screenshot` as backup evidence if needed, but do not switch interaction to `serve-sim tap` merely because screenshot capture was flaky.

### Native Scroll Gestures

Direct `serve-sim` gestures are worth reaching for earlier for native scrolling than for tapping. Browser drags can work, but long React Native scroll views are where normalized simulator gestures pay for themselves. This is the main exception to the Browser-first rule.

Do not use DOM scrolling or mouse-wheel scrolling for native React Native scroll views. Those inputs target the browser page, not the app's scroll view.

First confirm the stream and WebSocket URL:

```bash
pnpm exec serve-sim --list
```

Then send one full gesture over the stream WebSocket. Use the right side of the app as a scroll rail:

```js
const x = 0.88;
```

That coordinate stays inside app content while avoiding most cards, buttons, and fields. To scroll down to later content, drag upward by decreasing `y`. To scroll up to earlier content, drag downward by increasing `y`.

Repeatable scroll snippet:

```bash
node - <<'NODE'
const ws = new WebSocket("ws://127.0.0.1:3100/ws");
const enc = new TextEncoder();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const send = (payload) => {
  const body = enc.encode(JSON.stringify(payload));
  const message = new Uint8Array(1 + body.length);
  message[0] = 0x03;
  message.set(body, 1);
  ws.send(message);
};

ws.addEventListener("open", async () => {
  const x = 0.88;
  const y0 = 0.78;
  const y1 = 0.34;
  const steps = 12;

  send({ type: "begin", x, y: y0 });
  await wait(24);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    send({ type: "move", x, y: y0 + (y1 - y0) * t });
    await wait(24);
  }
  send({ type: "end", x, y: y1 });
  await wait(100);
  ws.close();
});

ws.addEventListener("error", () => process.exit(1));
ws.addEventListener("close", () => process.exit(0));
NODE
```

Calibrated profiles:

- Precise nudge: move `0.05` to `0.10` in `y` over `6-8` steps.
- Reading step: move `0.15` to `0.25` in `y` over `8-10` steps.
- Page jump: move `0.35` to `0.45` in `y` over `10-14` steps.
- Reach-end swipe: move `0.50` to `0.60` in `y` over `10-14` steps. Repeat only after visual verification.

After every scroll, take a fresh screenshot or DOM snapshot before choosing the next target.

### Text Entry

Native text entry is timing-sensitive. Prefer simulator clipboard paste for credentials and long exact strings:

```bash
printf '%s' 'Long exact value' | xcrun simctl pbcopy booted
```

Then focus the native field in the simulator, use the native paste action, visually confirm the value, and submit.

For short text, use hardware-style key events with a delay:

```js
const text = "Clear Tasks flow";

for (const char of text) {
  await tab.cua.keypress({ keys: [char] });
  await new Promise((resolve) => setTimeout(resolve, 150));
}
```

Use the same path for editing keys:

```js
await tab.cua.keypress({ keys: ["Backspace"] });
await tab.cua.keypress({ keys: ["Enter"] });
```

If characters drop, duplicate, or arrive out of order, slow the delay to `200` ms and re-verify the visible field before submitting. Do not use Playwright `fill`, DOM form locators, or DOM paste helpers for native fields.

### App Metadata

The Tools panel identifies the foreground app and can expand app details. Use this before running bundle-specific commands. It reports display name, bundle ID, version/build, minimum iOS, executable, PID, React Native detection, and app path.

For this app, the bundle ID is:

```text
com.arishi.expouniwindstarter
```

If you temporarily open Safari, Settings, or another simulator app during validation, use the app metadata panel or `/.sim/appstate` to confirm which app is foreground before continuing:

```bash
curl -N -s --max-time 2 'http://localhost:8081/.sim/appstate?device=<udid>'
```

### Permissions

Use `Tools -> Permissions` to grant, deny, or reset simulator privacy permissions for the foreground app. The panel covers camera, microphone, photos, add-to-photos, contacts, calendar, reminders, location, always-location, motion, media library, and Siri.

Prefer the panel over ad hoc `xcrun simctl privacy` commands when validating permission-dependent UI because it keeps the action visible in the same Browser validation surface. If you change permissions for a test, reset them before final verification unless the scenario explicitly requires a persisted permission state.

### Camera

Use the CLI when validating camera features. `serve-sim` injects a dylib at app launch and streams frames into shared memory, so injection can terminate/relaunch the target app. Confirm the foreground app and bundle ID first.

The `Tools -> Camera` panel is still useful for discovering the capability, selecting or dropping media, and seeing status. Prefer the CLI commands below when the panel has not just been verified against the installed `serve-sim` version.

CLI examples:

```bash
pnpm exec serve-sim camera com.arishi.expouniwindstarter
pnpm exec serve-sim camera com.arishi.expouniwindstarter --file ~/Pictures/sample.png
pnpm exec serve-sim camera com.arishi.expouniwindstarter --file ~/Movies/sample.mp4
pnpm exec serve-sim camera com.arishi.expouniwindstarter --webcam
pnpm exec serve-sim camera switch placeholder
pnpm exec serve-sim camera switch ~/Movies/sample.mp4
pnpm exec serve-sim camera mirror on
pnpm exec serve-sim camera status
pnpm exec serve-sim camera --list-webcams
pnpm exec serve-sim camera --stop-webcam
```

Images and videos are auto-detected. Videos loop at their native frame rate. Use `camera switch` for source changes after the helper is running; it hot-swaps without relaunching the app.

### Location

Use `Tools -> Location` for location-dependent flows. The panel drives `xcrun simctl location` and includes a route playback surface. Treat it as simulator state: clear or reset location after the scenario unless the feature specifically needs it to remain active.

### WebKit DevTools

`Open WebKit DevTools` is for Safari and inspectable `WKWebView` targets. It is not a React Native inspector for native views. For normal React Native screens, an empty DevTools target list is expected; use screenshots, logs, and the fast Browser path first. Use AX or native input escalation only when the normal loop cannot answer the question.

If the feature embeds web content and the panel lists a target, use DevTools for DOM/CSS/network inspection of that web content only. If it lists no targets, do not treat that as an app regression by itself.

### Logs

`serve-sim` forwards simulator logs into the browser console and exposes a log SSE endpoint:

```bash
curl -N 'http://localhost:8081/.sim/logs?device=<udid>'
```

For normal validation, prefer Browser console checks for warnings/errors after exercising the flow:

```js
await tab.dev.logs({ levels: ["error", "warn"], limit: 50 });
```

Use the raw log stream only when you need simulator-level detail that is not visible in the Browser console.

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
pnpm exec serve-sim --list
pnpm exec serve-sim --kill
```

`pnpm exec serve-sim --list` should show no running stream after the kill command. If it still lists a stream you started, run the kill command again with the listed device.

After stopping servers that you started, verify the standard harness ports are clear:

```bash
lsof -iTCP:3000 -sTCP:LISTEN -n -P || true
lsof -iTCP:8081 -sTCP:LISTEN -n -P || true
```

Both commands should print no listening process for servers you started. If either port is still occupied by a process you started, stop it and check again. Do not kill a pre-existing process unless the user asks you to.

## Troubleshooting

- If `/.sim` does not load, confirm Metro is listening on `8081`.
- If API-backed app behavior fails, confirm the API server is listening on `3000`.
- If `/.sim` shows no stream, use the simulator list on the page first, then confirm with `pnpm exec serve-sim --list`.
- If a stream is listed but the preview is stuck, run `pnpm exec serve-sim --kill`, restart the stream from `/.sim`, and re-check `--list`.
- If AX overlay is empty during an accessibility/targeting escalation, confirm the stream is live and the target app is foreground. Toggle the overlay off/on once before deeper debugging.
- If you already escalated to AX and clicks on AX elements only highlight without changing the app, turn AX off and try a normal Browser coordinate click on the visible simulator frame. Use `pnpm exec serve-sim tap` only if that normal Browser click also fails or if the target requires normalized precision.
- If text entry drops characters, slow per-character key events or use `xcrun simctl pbcopy booted` plus native paste.
- If WebKit DevTools has no targets, continue with the normal Browser visual workflow for native RN screens. Use AX only for accessibility or targeting escalation. Only debug the DevTools bridge when validating Safari or `WKWebView` content.
- If `serve-sim` behavior changed after an upgrade, inspect `npm view serve-sim version dist-tags --json`, `pnpm exec serve-sim --help`, `pnpm exec serve-sim camera --help`, the local clone at `~/personal/forks/serve-sim`, and then update this document with validated behavior. GitHub may not have formal Releases even when npm versions are moving.

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

The simulator preview streams a native app, not a DOM page. Treat the app surface like an interactive simulator that happens to be visible in the browser.

### Native Scroll Gestures

For native scroll views, prefer `tab.cua.drag(...)` over DOM scrolling. The simulator stream receives pointer drags like touch gestures; browser wheel/DOM scroll is not the control surface you want.

Use browser viewport coordinates from the `/.sim` page. With the default Codex in-app browser preview for the iPhone simulator, the right side of the app content is a reliable scroll rail:

```js
const x = 365;
```

That x-coordinate avoids most form fields, cards, and buttons while staying inside the simulator screen. Start vertical drags above the iOS home indicator; in the default preview, avoid starting lower than about `y = 680`.

To scroll down to later content, drag upward by decreasing `y`. Use multiple nearby points for controlled movement:

```js
await tab.cua.drag({
  path: [
    { x: 365, y: 610 },
    { x: 365, y: 604 },
    { x: 365, y: 598 },
    { x: 365, y: 592 },
    { x: 365, y: 586 },
    { x: 365, y: 580 },
    { x: 365, y: 574 },
  ],
});
```

Calibrated profiles:

- High-control nudge: `32-44` px upward over `8-11` points, starting around `y = 610`. Drags around `24` px can be ignored by native scroll thresholds.
- Reading step: `90-120` px upward over `8-10` points, starting around `y = 620-650`.
- Fast page jump: `200-220` px upward over `5-6` points, starting around `y = 650-660`.
- Reach-end swipe: `280-300` px upward over `4-5` points, starting around `y = 660-670`. Repeat, then verify visually so you do not overshoot important content.

To scroll back up to earlier content, reverse the direction by dragging downward:

```js
await tab.cua.drag({
  path: [
    { x: 365, y: 390 },
    { x: 365, y: 420 },
    { x: 365, y: 450 },
    { x: 365, y: 480 },
    { x: 365, y: 510 },
    { x: 365, y: 540 },
    { x: 365, y: 570 },
  ],
});
```

For reverse scrolling near the end of a long form, use about `140-180` px over `7-9` points. Very small reverse drags, such as `80` px, may be swallowed near the footer or by native gesture thresholds.

Always take a fresh screenshot after a scroll profile before choosing the next target:

```js
await display(await tab.cua.get_visible_screenshot());
```

### Text Entry In Native Fields

For native app text fields, use the Browser Use cursor and keyboard APIs:

1. Click the native input with `tab.cua.click({ x, y })`.
2. Confirm the field is visibly focused in the simulator preview.
3. Type using hardware-style key events, one key at a time, with a short delay between characters so the streamed simulator, native input, and React state updates can settle:

```js
const text = "Clear Tasks flow";

for (const char of text) {
  await tab.cua.keypress({ keys: [char] });
  await tab.playwright.waitForTimeout(150);
}
```

After typing, visually confirm the field shows the expected text before submitting the form. If characters are missing or out of order, clear the field and retry with a longer delay, such as `200` ms.

Use the same `keypress` path for editing keys such as `Backspace`, `Enter`, and `Escape`:

```js
await tab.cua.keypress({ keys: ["Backspace"] });
await tab.cua.keypress({ keys: ["Enter"] });
```

Do not use DOM form helpers for native fields. In particular, do not use browser DOM `fill`, Playwright form locators, or `tab.cua.type(...)` for simulator text entry.

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
- If `tab.cua.keypress(...)` does not type after the field is focused, click the input again, confirm the caret is visible, and retry with a single printable key before trying a longer string.
- If native text entry drops characters, slow the per-character delay and verify the visible field value before tapping a submit button. Dropped text usually means simulator input events were sent faster than the native field processed them.

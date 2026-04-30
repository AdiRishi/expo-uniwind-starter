# Use serve-sim for Codex Native Harness

We use [`serve-sim`](https://github.com/EvanBacon/serve-sim) through Metro so Codex can validate the native iOS app from the Codex in-app browser at `http://localhost:8081/.sim`. This keeps the app server, simulator preview, and Browser Use workflow in one local development loop instead of requiring separate simulator automation for normal smoke validation.

`serve-sim@0.1.4` mounts under the configured base path, but its embedded preview still calls a few root endpoints. The Metro integration keeps a small wrapper that rewrites those preview-originated root endpoint calls back under `/.sim` while leaving the app's own root routes alone.

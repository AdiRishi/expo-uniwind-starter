# Mirror App Unit Tests Beside The Mobile App

App unit tests live under `apps/mobile/tests/` beside `apps/mobile/src/`, with paths that mirror the app source tree. For example, tests for `apps/mobile/src/somepath/file.ts` live at `apps/mobile/tests/somepath/file.test.ts`, and tests for `apps/mobile/src/somepath/file.tsx` live at `apps/mobile/tests/somepath/file.test.tsx`. This keeps production directories focused on app implementation while making each test file easy to find from the source file it covers.

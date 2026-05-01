# Mirror App Unit Tests In A Root Tests Directory

App unit tests live under a root `tests/` directory beside `src/`, with paths that mirror the app source tree. For example, tests for `src/somepath/file.ts` live at `tests/somepath/file.test.ts`, and tests for `src/somepath/file.tsx` live at `tests/somepath/file.test.tsx`. This keeps production directories focused on app implementation while making each test file easy to find from the source file it covers.

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const serverRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "~": serverRoot,
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["**/*.ts"],
      exclude: ["nitro.config.ts", "tests/**", "vitest.config.ts"],
    },
  },
});

/**
 * Rename this project from "expo-uniwind-starter" to your own name.
 *
 * Usage:
 *   pnpm run rename                          # interactive
 *   pnpm run rename my-app                   # with name
 *   pnpm run rename my-app com.mycompany     # with name + bundle prefix
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

const ROOT = resolve(import.meta.dirname, "..");
const OLD_NAME = "expo-uniwind-starter";
const OLD_BUNDLE = "com.arishi.expouniwindstarter";
const OLD_SCHEME = "expouniwindstarter";

// ── Types ────────────────────────────────────────────────────────────

interface AppJson {
  expo: {
    name: string;
    slug: string;
    scheme: string;
    ios: { bundleIdentifier: string; [key: string]: unknown };
    android: { package: string; [key: string]: unknown };
    [key: string]: unknown;
  };
}

interface PackageJson {
  name: string;
  [key: string]: unknown;
}

// ── Helpers ──────────────────────────────────────────────────────────

function readJSON<T>(relativePath: string): T {
  return JSON.parse(readFileSync(resolve(ROOT, relativePath), "utf-8")) as T;
}

function writeJSON(relativePath: string, data: unknown): void {
  writeFileSync(resolve(ROOT, relativePath), JSON.stringify(data, null, 2) + "\n");
}

function toScheme(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function toBundleId(prefix: string, name: string): string {
  return `${prefix}.${toScheme(name)}`;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

function ask(question: string, fallback?: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const suffix = fallback ? ` (${fallback}): ` : ": ";

  return new Promise((resolve) => {
    rl.question(`${question}${suffix}`, (answer) => {
      rl.close();
      resolve(answer.trim() || fallback || "");
    });
  });
}

// ── Main ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  let projectName = process.argv[2];
  let bundlePrefix = process.argv[3];

  if (!projectName) {
    projectName = await ask("Project name (kebab-case, e.g. my-cool-app)");
  }
  if (!projectName) {
    console.error("Error: project name is required.");
    process.exit(1);
  }
  if (!bundlePrefix) {
    bundlePrefix = await ask("Bundle identifier prefix", "com.example");
  }

  const slug = toSlug(projectName);
  const scheme = toScheme(projectName);
  const bundleId = toBundleId(bundlePrefix, projectName);

  console.log("\nRenaming project:\n");
  console.log(`  name              ${OLD_NAME} → ${projectName}`);
  console.log(`  slug              ${OLD_NAME} → ${slug}`);
  console.log(`  scheme            ${OLD_SCHEME} → ${scheme}`);
  console.log(`  bundleIdentifier  ${OLD_BUNDLE} → ${bundleId}`);
  console.log(`  android package   ${OLD_BUNDLE} → ${bundleId}`);
  console.log();

  // Update package.json
  const pkg = readJSON<PackageJson>("package.json");
  pkg.name = projectName;
  writeJSON("package.json", pkg);
  console.log("✓ package.json");

  // Update app.json
  const app = readJSON<AppJson>("app.json");
  app.expo.name = projectName;
  app.expo.slug = slug;
  app.expo.scheme = scheme;
  app.expo.ios.bundleIdentifier = bundleId;
  app.expo.android.package = bundleId;
  writeJSON("app.json", app);
  console.log("✓ app.json");

  console.log("\nDone! You may also want to:");
  console.log("  • Update the app icon and splash screen images in assets/");
  console.log("  • Run `pnpm start` to verify everything works");
}

main();

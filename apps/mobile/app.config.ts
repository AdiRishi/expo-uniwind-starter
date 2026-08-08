import buildPropertiesPlugin from "expo-build-properties/plugin";
import devClientPlugin from "expo-dev-client/plugin";
import fontPlugin from "expo-font/plugin";
import imagePlugin from "expo-image/plugin";
import routerPlugin from "expo-router/plugin";
import splashScreenPlugin from "expo-splash-screen/plugin";
import statusBarPlugin from "expo-status-bar/plugin";
import webBrowserPlugin from "expo-web-browser/plugin";
import type { ExpoConfig } from "expo/config";

// ── Project identity ─────────────────────────────────────────────────
// `pnpm run rename` rewrites these four values. Everything else derives from them.
const APP_NAME = "expo-uniwind-starter";
const APP_SLUG = "expo-uniwind-starter";
const BUNDLE_ID = "com.arishi.expouniwindstarter";
const SCHEME = "expouniwindstarter";

// ── Build variants ───────────────────────────────────────────────────
// Each variant gets its own bundle identifier and scheme so a dev build, a preview
// build, and the store build can sit on one device at the same time without
// overwriting each other. eas.json sets APP_VARIANT per build profile.
type AppVariant = "development" | "preview" | "production";

const VARIANTS = {
  development: { nameSuffix: " (Dev)", idSuffix: ".dev", schemeSuffix: "dev" },
  preview: { nameSuffix: " (Preview)", idSuffix: ".preview", schemeSuffix: "preview" },
  production: { nameSuffix: "", idSuffix: "", schemeSuffix: "" },
} as const satisfies Record<AppVariant, unknown>;

function resolveVariant(value: string | undefined): AppVariant {
  return value === "development" || value === "preview" ? value : "production";
}

const variant = VARIANTS[resolveVariant(process.env.APP_VARIANT)];
const bundleIdentifier = `${BUNDLE_ID}${variant.idSuffix}`;

export default (): ExpoConfig => ({
  name: `${APP_NAME}${variant.nameSuffix}`,
  slug: APP_SLUG,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: `${SCHEME}${variant.schemeSuffix}`,
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/expo.icon",
    bundleIdentifier,
    infoPlist: {
      // Declares the app uses no non-exempt encryption, which otherwise blocks every
      // TestFlight/App Store submission behind a manual compliance question.
      ITSAppUsesNonExemptEncryption: false,
    },
    // React Native reads and writes UserDefaults, which Apple requires you to declare.
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [USER_DEFAULTS_PRIVACY_ACCESS],
    },
  },
  android: {
    package: bundleIdentifier,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    softwareKeyboardLayoutMode: "resize",
    predictiveBackGestureEnabled: false,
    blockedPermissions: ["com.google.android.gms.permission.AD_ID"],
  },
  web: {
    output: "single",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    routerPlugin(),
    splashScreenPlugin({
      backgroundColor: "#208AEF",
      android: {
        image: "./assets/images/splash-icon.png",
        imageWidth: 76,
      },
    }),
    devClientPlugin(),
    buildPropertiesPlugin({
      android: { usePrecompiledHeaders: true },
      ios: { useFrameworks: "static", usePrecompiledModules: true },
    }),
    fontPlugin(),
    imagePlugin(),
    webBrowserPlugin(),
    statusBarPlugin(),
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
    autolinkingModuleResolution: true,
  },
});

/*
 * Shared config values
 * ---------------------------------------------------------------------------
 */

const USER_DEFAULTS_PRIVACY_ACCESS = {
  NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
  NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
};

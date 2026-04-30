// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const connect = require("connect");
const { simMiddleware } = require("serve-sim/middleware");

/** @type {import('expo/metro-config').MetroConfig} */
const expoConfig = getDefaultConfig(__dirname);

// Serve-sim

const SIM_PATH = "/.sim";
const SIM_PREVIEW_ROOT_ENDPOINTS = new Set(["/api", "/exec", "/exec/", "/appstate", "/logs"]);

function withServeSim(config) {
  const originalEnhanceMiddleware = config.server?.enhanceMiddleware;
  const serveSim = simMiddleware({ basePath: SIM_PATH });

  config.server = {
    ...config.server,
    enhanceMiddleware(metroMiddleware, server) {
      const middleware = originalEnhanceMiddleware?.(metroMiddleware, server) ?? metroMiddleware;
      return connect().use(createServeSimMiddleware(serveSim)).use(middleware);
    },
  };

  return config;
}

function createServeSimMiddleware(serveSim) {
  return (req, res, next) => {
    const originalUrl = req.url ?? "";
    if (isServeSimPreviewEndpoint(req)) {
      req.url = `${SIM_PATH}${originalUrl}`;
    }

    serveSim(req, res, () => {
      req.url = originalUrl;
      next();
    });
  };
}

function isServeSimPreviewEndpoint(req) {
  const endpoint = getPathname(req.url);
  const referer = getHeader(req.headers.referer);

  // serve-sim@0.1.4 mounts under basePath, but its embedded preview still
  // calls a few root endpoints. Rewrite only calls coming from /.sim so the
  // app's own root /api routes are left alone.
  return SIM_PREVIEW_ROOT_ENDPOINTS.has(endpoint) && referer.includes(SIM_PATH);
}

function getPathname(url = "") {
  return url.split("?")[0];
}

function getHeader(header) {
  return Array.isArray(header) ? header.join(",") : (header ?? "");
}

// Uniwind

module.exports = withUniwindConfig(withServeSim(expoConfig), {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
});

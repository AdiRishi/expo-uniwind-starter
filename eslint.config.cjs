// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = defineConfig([
  {
    ignores: ["dist/*"],
  },
  expoConfig,
  {
    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json", "./tests/tsconfig.json"],
        },
      },
    },
  },
  eslintConfigPrettier,
]);

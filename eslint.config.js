import js from "@eslint/js";
import globals from "globals";

export default [
  // 1. Global Ignores (Replaces the old .eslintignore file)
  {
    ignores: ["dist/", "build/", "node_modules/"],
  },

  // 2. Main Configuration
  {
    // Apply these settings to all JavaScript files
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],

    // Extend the official recommended rules
    ...js.configs.recommended,

    // Configure such that ESLint understands that there are Node.js globals
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];

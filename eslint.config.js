import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["protocol/source/**", "protocol/reference.generated/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },

  {
    rules: {
      'no-unused-vars': [2, { caughtErrors: 'none' }],
      'no-control-regex': 0,
    }
  }
]);

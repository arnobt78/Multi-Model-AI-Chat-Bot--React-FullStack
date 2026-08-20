// ESLint 9 flat config — Vite React SPA + shared/ + Vercel api/
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

const tsRecommended = {
  plugins: { "@typescript-eslint": tseslint },
  languageOptions: {
    parser: tsparser,
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  },
  rules: {
    ...tseslint.configs.recommended.rules,
    "@typescript-eslint/no-explicit-any": "off",
    "no-undef": "off",
  },
};

export default [
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.js"],
  },
  js.configs.recommended,
  // Browser React app
  {
    files: ["src/**/*.{ts,tsx}"],
    ...tsRecommended,
    languageOptions: {
      ...tsRecommended.languageOptions,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.es2020 },
    },
    plugins: {
      ...tsRecommended.plugins,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: { react: { version: "18.3" } },
    rules: {
      ...tsRecommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  // Shared + serverless API (Node)
  {
    files: ["shared/**/*.ts", "api/**/*.ts"],
    ...tsRecommended,
    languageOptions: {
      ...tsRecommended.languageOptions,
      globals: { ...globals.node, ...globals.es2020 },
    },
  },
  // Vite config (Node)
  {
    files: ["vite.config.ts"],
    ...tsRecommended,
    languageOptions: {
      ...tsRecommended.languageOptions,
      globals: { ...globals.node, ...globals.es2020 },
    },
  },
];

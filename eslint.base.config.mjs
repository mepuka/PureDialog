import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import effectPlugin from "@effect/eslint-plugin";

export default tseslint.config(
  {
    ignores: ["**/dist", "**/.tsbuildinfo", "**/*.md"],
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  effectPlugin.configs.dprint,
  {
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "@effect/dprint": [
        "error",
        { config: { indentWidth: 2, lineWidth: 120 } },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  }
);

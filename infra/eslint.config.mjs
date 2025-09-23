import effect from "@effect/eslint-plugin";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["bin", "dist", "**/.tsbuildinfo"],
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  {
    plugins: {
      "@effect": effect,
    },
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
  },
);

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist", "**/.tsbuildinfo", "**/*.md"],
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
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

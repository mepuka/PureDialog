### Design — 00 Project Setup & Monorepo (Phase 3)

#### Overview

PNPM workspace with clear boundaries between shared packages (`packages/*`) and services (`services/*`). Effect-first architecture with Layers for config, logging, metrics, and clients. References: `patterns/effect-*` docs for code style, layers, error handling, and resource safety.

#### Workspace Layout

```
packages/
  domain/
  gemini/
services/
  ingestion/
  transcription/
```

#### Shared Tooling

- Root `tsconfig.base.json` and per-project `tsconfig.json` extends.
- Root `eslint.base.config.mjs` imported by project-local `eslint.config.mjs`.
- Scripts propagated via each package `package.json`.

#### Core Layers (shared)

- `ConfigLayer` — centralizes environment values using Effect Config or custom module; no direct `process.env` outside this layer.
- `LoggerLayer` — JSON logs; structure from `patterns/effect-observability-patterns.md`.
- `MetricsLayer` — counter/histogram helpers; abstraction to switch providers.
- `ClockLayer` — for deterministic tests.

#### Developer Experience

- `pnpm -w build|lint|typecheck` root commands.
- Local dev: `services/ingestion` starts HTTP server; `services/transcription` starts subscriber worker.

#### Risks & Mitigations

- Risk: config sprawl → Mitigate with single Config module and versioned config schema.
- Risk: dependency cross-links → Disallow service→service imports; only via events.

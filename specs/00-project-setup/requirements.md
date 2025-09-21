### Requirements — 00 Project Setup & Monorepo (Phase 2)

#### Scope

Establish a PNPM monorepo housing shared packages and two services with unified TypeScript, ESLint, and Effect-first conventions. Centralize config and prevent client-side secrets.

#### Functional Requirements

- Workspace
  - Root `pnpm-workspace.yaml` includes `packages/*` and `services/*`.
  - Root `tsconfig.base.json` and shared `eslint.base.config.mjs` consumed by all packages/services.
- Packages
  - `packages/domain`: types, schemas, codecs, domain errors and events (no side effects).
  - `packages/gemini`: typed Gemini client wrapper with Effect API.
- Services
  - `services/ingestion`: HTTP API only; no LLM calls.
  - `services/transcription`: worker process only; no HTTP routes (except health/readiness).
- Tooling
  - Commands: `pnpm -w build`, `pnpm -w lint`, `pnpm -w typecheck` succeed.
  - Each package/service has its own `package.json` scripts and builds independently.

#### Non-Functional Requirements

- Effect-first code conventions enforced via ESLint rules.
- Node 20+ runtime compatibility; ES modules across repo.
- CI build minimal: install, build, lint; deploy steps deferred to infra track.

#### Security & Config Requirements

- No client-side usage of Gemini/API keys.
- Environment config provided via `Layer` composition; no process.env access outside config layer.
- Standard `.env.example` per package/service; secrets via runtime env or Secret Manager (deferred).

#### Observability Requirements

- Health endpoints exposed by services: `/health/live`, `/health/ready`.
- JSON logs enabled by default; correlation id propagation utilities available in shared patterns folder (deferred if needed).

#### Testing Requirements

- Unit tests runnable per package/service (scaffold only in this phase).
- Lint/typecheck are mandatory gates; tests optional in setup phase.

#### Acceptance Criteria

- [ ] `pnpm install` bootstraps workspace.
- [ ] `pnpm -w build` succeeds across all workspaces.
- [ ] `pnpm -w lint` and `pnpm -w typecheck` pass.
- [ ] Services start locally with placeholder main files and health endpoints.

#### Improvements/Simplifications

- Prefer Google Cloud Run over App Engine for services to simplify deployment and IAM.
- Consider Google Cloud Storage instead of Drive for artifact storage (simpler API and IAM), while keeping Drive as an optional adapter.
- Use a single root `@types` dependency at workspace level to avoid duplication.

# App Engine & Pulumi Infrastructure Plan

## 1. Conceptual Grounding
- **Topics vs. Subscriptions**: Topics buffer published messages; subscriptions define delivery semantics. Each worker keeps an isolated subscription on the shared ingestion topic so retries and DLQ routing remain scoped to that pipeline.
- **Push Delivery Model**: Pub/Sub push subscriptions POST base64 payloads to App Engine endpoints. Workers must return `2xx` before the ack deadline to avoid redelivery. DLQs capture messages that exceed max delivery attempts.
- **Pulumi Mental Model**: Infrastructure is declared in TypeScript (per Pulumi GCP quickstart). `Pulumi.yaml` defines the project, `index.ts` instantiates resources (`new gcp.pubsub.Topic(...)`, `new gcp.appengine.StandardAppVersion(...)`). `pulumi preview` shows proposed operations; `pulumi up` applies them. Existing resources (API service) are adopted via `pulumi import` and then mirrored in source so future diffs stay clean.

## 2. Target Services Overview
- **ingestion-api (existing)**: Continues to serve HTTP APIs, publish work messages, and monitor event streams. Once imported, Pulumi governs scaling/runtime changes.
- **worker-metadata**: Push subscriber for `ProcessingJob` payloads at `stage = "Queued"`; enriches metadata and emits downstream updates.
- **worker-transcription**: Processes `stage = "MetadataReady"`; executes transcription workflow and emits completion/failure events.
- All services deploy to **App Engine Standard** using the newly available `runtime: "nodejs24"`. We select an initial `instanceClass` (`F2`) to approximate current sizing while staying within Standard constraints. Future adjustments happen through Pulumi updates. We explicitly avoid `FlexibleAppVersion`, which would require Dockerfiles and non-serverless scaling.

## 3. Infrastructure Resource Inventory
Declared in `infra/index.ts` using `@pulumi/pulumi` and `@pulumi/gcp`:
- **App Engine Foundation**
  - Single `gcp.appengine.Application` resource (one-time enablement for the chosen region). Every `StandardAppVersion` will depend on this.
- **App Engine Services**
  - `ingestion-api` `StandardAppVersion` (import existing version).
  - `worker-metadata` `StandardAppVersion` (new service).
  - `worker-transcription` `StandardAppVersion` (new service).
  - Shared settings: automatic scaling targets, readiness/liveness checks, `serviceAccount: 211636922435-compute@developer.gserviceaccount.com`, handler definitions for `/pubsub` and `/health`.
  - `ingestion-api` version referenced via `StandardAppVersion.get` (no redeploy yet).
- **Pub/Sub Topics**
  - `work` (primary work queue).
  - `events` (status/event stream).
  - `work-dlq` (dead-letter topic).
- **Pub/Sub Subscriptions**
  - `work-metadata` → push endpoint `https://worker-metadata-dot-<project>.appspot.com/pubsub`, DLQ to `ingestion-work-dlq`, OIDC token auth.
  - `work-transcription` → push endpoint `https://worker-transcription-dot-<project>.appspot.com/pubsub`, same DLQ/auth config.
  - `events-monitor` (initially pull; allows API/service diagnostics without new ingress surface).
- **Storage**
  - Shared Cloud Storage bucket `ingestion-shared-artifacts-${randomSuffix}` (suffix generated via `@pulumi/random` to meet global uniqueness). Grant App Engine default SA read/write.
- **Future/Optional Resources** (not in initial scope, but noted for later)
  - `DomainMapping` for custom domains.
  - `EngineSplitTraffic` for gradual rollouts.
  - `FirewallRule` for network restrictions. No `ApplicationUrlDispatchRules` needed because services each expose their own endpoint.

## 4. Pulumi Project & Stack Layout
- Create `infra/` directory at repo root. *(Manual CLI step: run `mkdir infra && cd infra` before `pulumi new`.)*
- Initialize with `pulumi new gcp-typescript`. *(Manual CLI step.)*
- Files:
  - `infra/Pulumi.yaml` (project metadata).
  - `infra/Pulumi.<stack>.yaml` (stack config: `gcp:project`, `gcp:region`, naming prefixes, DLQ settings, bucket retention toggles).
  - `infra/index.ts` (resource declarations).
  - `infra/package.json` (includes `@pulumi/pulumi`, `@pulumi/gcp`, `@pulumi/random`).
- Default config seeds region `us-west1` and project `gen-lang-client-0874846742` to mirror the existing App Engine application described via `gcloud app describe`.
- `pnpm-workspace.yaml` already covers `infra/*`; no additional workspace change required. Document Pulumi workflow in repo docs later.

## 5. App Engine Configuration via Pulumi
- Encode current `app.yaml` behaviour in TypeScript arguments to `StandardAppVersion`:
  - `runtime: "nodejs24"`, `service`, `instanceClass: "F2"`, automatic scaling thresholds, readiness/liveness checks, environment variables.
  - `entrypoint: { shell: "pnpm start" }` — App Engine runs inside the uploaded package directory, so each package exposes `start` script executing compiled server (`node dist/index.js`). No repo-root `pnpm --filter` commands inside App Engine.
  - `deployment`: use `new pulumi.asset.AssetArchive({ ".": new pulumi.asset.FileArchive("../services/worker-metadata") })` (and transcription/API) so Pulumi zips the specific package directory as source. This aligns with Standard App Version deployment semantics.
  - `handlers`: replicate routing for `/pubsub`, `/health`, and (for API) static asset serving per existing `app.yaml`.

## 6. Workspace & Package Scaffolding Plan
- Add `services/worker-metadata` and `services/worker-transcription` directories with: `package.json`, `tsconfig.json`, `src/` placeholder, and scripts (`build`, `start`, `lint`, `typecheck`).
- Ensure build outputs land in `dist/` so `pnpm start` runs compiled code. Document dependency alignment with existing ingestion packages.
- Evaluate shared utilities (Pub/Sub verification middleware) placement but defer implementation until coding phase.

## 7. Resource Adoption & State Management
- Record exact `pulumi import` command for the existing API version once the current version ID is known: `pulumi import gcp:appengine/standardAppVersion:StandardAppVersion ingestion-api "apps/<project>/services/ingestion-api/versions/<version>"`. *(Manual CLI step.)*
- The Pulumi program references the existing App Engine application and default service version via `gcp.appengine.Application.get` / `gcp.appengine.StandardAppVersion.get`, so stack config must supply project id, service account, and the active API version id before previews.
- Capture Pulumi import output and reconcile generated args with `index.ts` to achieve zero-diff previews.
- If Pub/Sub topics/subscriptions already exist, plan matching imports; otherwise allow Pulumi to create them fresh (imports would be additional CLI steps).

## 8. Local Development & Testing Implications
- Pub/Sub emulator remains primary tooling for local processing. Workers listen via pull subscription or HTTP tunnel (ngrok/local emulator) — document workflow later.
- Shared bucket interactions stubbed locally (e.g., using `@google-cloud/storage` against emulator or temp filesystem). Implementation details deferred.
- Continue existing pnpm build/test scripts; Pulumi stack only impacts cloud resources.

## 9. Reliability & Security Considerations
- Configure subscription `deadLetterPolicy` (max deliveries e.g., 10, dead letter topic `ingestion-work-dlq`).
- Manage IAM bindings in Pulumi: grant App Engine default SA `roles/pubsub.publisher` & `roles/storage.objectAdmin`; assign worker-specific SAs `roles/pubsub.subscriber`. Maintain principle of least privilege.
- Enable Pub/Sub push authentication using `oidcToken` referencing each worker’s service account to ensure only the configured subscription can invoke the endpoint.
- Plan future observability (log-based metrics, alerting) once baseline deployment succeeds.

## 10. Operations & Deployment Workflow
- Manual CLI steps: `cd infra`, `pnpm install`, `pulumi login`, `pulumi stack select <stack>`, `pulumi preview`, `pulumi up`.
- After infrastructure converges, deploy code binaries through normal pnpm build & `gcloud app deploy` until Pulumi-driven deployments are automated (decision pending). Eventually the Pulumi `StandardAppVersion` deployment will package the latest build artifacts directly.
- Document interplay between Pulumi deployments and existing CI/CD scripts before enabling in pipelines.

## 11. Open Questions / Follow-Ups
- Confirm packaging strategy for Standard App versions (FileArchive vs. Cloud Storage `sourceUrl`) based on build artifact size and CI ergonomics.
- Decide final subscription type for `ingestion-events-monitor` (pull vs. push to API endpoint) prior to implementation.
- Evaluate need for bucket lifecycle/retention policies (can be added later via Pulumi resources).
- Validate external API access requirements; Standard environment generally covers outbound calls without VPC connectors, but confirm with networking team.

## 12. Next Steps
1. Stakeholder review of revised plan and Pulumi-specific adjustments.
2. Initialize Pulumi project (CLI), commit baseline scaffolding (without cloud changes yet).
3. Import existing API App Engine version (CLI); verify clean `pulumi preview`.
4. Implement resource declarations for topics, subscriptions, bucket, and worker services.
5. Integrate deployment/testing workflow once infrastructure code is in place.

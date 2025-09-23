# Cloud Run & Pulumi Infrastructure Plan

## 1. Conceptual Grounding
- **Topics vs. Subscriptions**: Topics buffer published messages; subscriptions define delivery semantics. Each worker keeps an isolated subscription on the shared ingestion topic so retries and DLQ routing remain scoped to that pipeline.
- **Push Delivery Model**: Pub/Sub push subscriptions POST base64 payloads to Cloud Run endpoints. Workers must return `2xx` before the ack deadline to avoid redelivery. DLQs capture messages that exceed max delivery attempts.
- **Pulumi Mental Model**: Infrastructure is declared in TypeScript (per Pulumi GCP quickstart). `Pulumi.yaml` defines the project, `index.ts` instantiates resources (`gcp.pubsub.Topic`, `gcp.cloudrunv2.Service`, etc.). `pulumi preview` shows proposed operations; `pulumi up` applies them. Stack config provides image tags published via Cloud Build.

## 2. Target Services Overview
- **api**: HTTP API surface (public) that continues to publish work messages and monitor event streams.
- **worker-metadata**: Push subscriber for `ProcessingJob` payloads at `stage = "Queued"`; enriches metadata and emits downstream updates.
- **worker-transcription**: Push subscriber for `stage = "MetadataReady"`; executes transcription workflow and emits completion/failure events.
- All services run on **Cloud Run** with minimal resources (`cpu: 0.25`, `memory: 512Mi`, `minScale: 0`, `maxScale: 2`, concurrency defaults). Pub/Sub invokes the workers via IAM-guarded endpoints. Existing project service account `211636922435-compute@developer.gserviceaccount.com` is reused.

## 3. Infrastructure Resource Inventory
Declared in `infra/index.ts` using `@pulumi/pulumi` and `@pulumi/gcp`:
- **Artifact Registry** (manual or pre-existing) hosts container images referenced by Pulumi.
- **Cloud Run Services**
  - `api` (public ingress, `roles/run.invoker` granted to `allUsers`).
  - `worker-metadata` (ingress all, invoker restricted to ingestion service account).
  - `worker-transcription` (same as above).
  - Each service injects configuration via environment variables (topic names, bucket, etc.).
- **Pub/Sub Topics**: `work`, `events`, `work-dlq`.
- **Pub/Sub Subscriptions**
  - `work-metadata` → push to `metadataWorkerService.uri/pubsub` with OIDC token.
  - `work-transcription` → push to `transcriptionWorkerService.uri/pubsub` with OIDC token.
  - `events-monitor` remains pull for diagnostics.
- **Storage**: Shared Cloud Storage bucket `ingestion-shared-artifacts-*` retained for ingestion artifacts.

## 4. Pulumi Project & Stack Layout
- `infra/` contains the Cloud Run stack.
- Files:
  - `infra/Pulumi.yaml` (project metadata).
  - `infra/Pulumi.<stack>.yaml` (stack config: `gcp:*`, `cloudrun:*`, Pub/Sub + storage names).
  - `infra/index.ts` (Cloud Run + Pub/Sub resources).
  - `infra/package.json` (Pulumi dependencies).
- Stack config supplies container image tags (`cloudrun:apiImage`, etc.) and service account email.

## 5. Dockerized Services
- `services/api`, `services/worker-metadata`, `services/worker-transcription` contain TypeScript HTTP entrypoints with minimal routing (`/health`, `/pubsub`).
- Each service has a `Dockerfile` that:
  1. Installs build tools (`python3`, `make`, `g++`).
  2. Installs dependencies with pnpm for the targeted workspace.
  3. Compiles TypeScript (`tsc`).
  4. Prunes dev dependencies (`CI=1 pnpm prune --prod`).
  5. Copies production `node_modules` + `dist` into a slim runtime layer.

## 6. Build & Deployment Workflow
1. `pnpm install` (workspace root).
2. `pnpm --filter @puredialog/<service> build` for API and workers (optional local check).
3. Cloud Build builds and pushes images (see `cloudbuild.yaml`).
4. Update stack config with pushed image tags (`pulumi config set cloudrun:apiImage ...`).
5. `pulumi preview` → `pulumi up`.
6. Validate endpoints: `curl $(pulumi stack output apiUrl)/health` and Pub/Sub push logs.
7. After validation, delete legacy App Engine versions (`gcloud app versions delete ...`).

## 7. Pub/Sub & IAM
- Push configs now point to Cloud Run URIs with the ingestion service account providing OIDC tokens.
- Pulumi grants `roles/run.invoker` to `allUsers` (API) and to the ingestion service account (workers).
- Topics/subscriptions remain unchanged aside from new push endpoints.

## 8. Cost & Scaling
- Services default to `minInstances: 0`, `maxInstances: 2`, `cpu: 0.25`, `memory: 512Mi` to stay within the Cloud Run free tier during evaluation.
- Concurrency defaults to 80 for API and 10 for workers (tunable via stack config).

## 9. Cleanup & Legacy Decommissioning
- App Engine resources have been removed from the Pulumi stack and stack configuration.
- After Cloud Run is stable in production, delete any remaining App Engine services/versions and reclaim associated budgets.

## 10. Next Steps
1. Finalize Docker images and Cloud Build pipeline for CI/CD.
2. Create/update Pulumi stacks (dev/staging/prod) with new `cloudrun:*` configuration.
3. Deploy (`pulumi up`) using freshly built image tags.
4. Update monitoring/alerting to track Cloud Run metrics.
5. Remove residual App Engine deploy scripts and documentation once Cloud Run is the sole runtime.

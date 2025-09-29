# PureDialog Infrastructure

Pulumi program that provisions Cloud Run services, Pub/Sub topics/subscriptions, and shared
storage for the ingestion workloads. See `specs/ingestion-pub-sub/app-engine-workers-plan.md`
for the architectural blueprint (updated for Cloud Run).

## Deployment workflow

1. Install dependencies: `pnpm install`
2. Build service artefacts (local validation):
   - `pnpm --filter @puredialog/api build`
   - `pnpm --filter @puredialog/worker-metadata build`
   - `pnpm --filter @puredialog/worker-transcription build`
3. Build and push container images via Cloud Build:
   - `gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=us-west1`
     (supply custom substitutions or image tags as needed)
4. Initialize or select a stack (e.g. `pulumi stack init dev` then `pulumi stack select dev`)
5. Update stack config with the freshly built image tags:
   - `pulumi config set cloudrun:apiImage us-west1-docker.pkg.dev/<project>/puredialog/api:<tag>`
   - repeat for metadata and transcription images
6. Preview changes: `pulumi preview`
7. Apply changes: `pulumi up`

Stack configuration files (`Pulumi.<stack>.yaml`) should mirror the values documented in the
plan before deploying.

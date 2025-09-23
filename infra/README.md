# PureDialog Infrastructure

Pulumi program that provisions App Engine services, Pub/Sub topics/subscriptions, and shared
storage for the ingestion workloads. See `specs/ingestion-pub-sub/app-engine-workers-plan.md`
for the architectural blueprint.

## Local development

1. Install dependencies: `pnpm install`
2. Select a stack: `pulumi stack select <stack>`
3. Preview changes: `pulumi preview`
4. Apply changes: `pulumi up`

Integrate stack configuration files (`Pulumi.<stack>.yaml`) with the values documented in the
plan before deploying.

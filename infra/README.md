# PureDialog Infrastructure

Pulumi program that provisions App Engine services, Pub/Sub topics/subscriptions, and shared
storage for the ingestion workloads. See `specs/ingestion-pub-sub/app-engine-workers-plan.md`
for the architectural blueprint.

## Local development

1. Install dependencies: `pnpm install`
2. Initialize or select a stack (e.g. `pulumi stack init dev` then `pulumi stack select dev`)
3. Ensure stack configuration matches `Pulumi.<stack>.yaml`
4. Preview changes: `pulumi preview`
5. Apply changes: `pulumi up`

Integrate stack configuration files (`Pulumi.<stack>.yaml`) with the values documented in the
plan before deploying.

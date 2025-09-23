# Ingestion Pub/Sub Client

## Feature Overview
- Provide an Effect-based Google Cloud Pub/Sub client for the ingestion domain to coordinate transcription workflows.
- Centralize publishing and subscription handling for `ProcessingJob` lifecycle messages while enforcing schemas and idempotency via Effect layers.
- Keep the messaging surface minimal by starting with two topics: a work topic for job progression and an event topic for downstream projections.

## Users
- Internal ingestion API and workers that publish and consume transcription job messages.
- Operations teams relying on reliable, observable job orchestration to deliver high-quality transcriptions.
- Projection/background services that maintain user-facing job status views.

## User Stories
- As an ingestion API, I publish a new job with minimal metadata to the work topic and emit a job queued event so downstream services know processing began.
- As a metadata worker, I subscribe to jobs filtered by `stage = "Queued"`, enrich metadata, persist it idempotently, and advance the job stage.
- As a transcription worker, I consume jobs filtered by `stage = "MetadataReady"`, run transcription, and publish completion or failure events.
- As a projection process, I subscribe to job events to keep a read model synchronized for low-latency status queries.

## Acceptance Criteria
- Provide Effect services for publishing and subscribing that wrap @google-cloud/pubsub client libraries without async/await or try/catch in generators.
- Support schema-based encoding/decoding using existing domain schemas with attributes limited to identifiers and stage metadata.
- Implement idempotent publishing and consuming flows keyed by `jobId`, handling at-least-once delivery semantics.
- Offer configuration for topic/subscription names, filtering attributes, and acknowledgement deadlines.
- Ensure observability via structured logs (jobId, userId, stage, attempt) and basic metrics hooks (publish latency, handler duration, redeliveries, DLQ count).
- Provide emulator-friendly configuration and guidance/tests for local development.

## Constraints
- Must integrate with Google Cloud Pub/Sub (production) and emulator (local/testing) following Google client library guidance.
- No new message schemas may be introduced; rely on existing domain codecs.
- Keep PII out of message payloads/attributes; only identifiers allowed.
- Avoid ordering keys initially; handlers must tolerate out-of-order delivery validated via domain state transitions.
- Follow repository Effect patterns, including `Effect.gen` conventions and linting workflow.

## Dependencies
- Existing ingestion domain schemas (`packages/domain/src`), especially `ProcessingJob` and job status types.
- Current ingestion services (`SpeakerRoleRegistry`, `ProcessingJobStore`, `YouTubeClient`, config layers).
- @google-cloud/pubsub Node client library; Pub/Sub emulator for tests.

## Out of Scope
- Creating new event types beyond the minimal set (`JobQueued`, `MetadataReady`, `JobStatusChanged`, `TranscriptComplete`, `JobFailed`).
- Reworking upstream API endpoints or domain models beyond required integration hooks.
- Full production deployment scripts or infrastructure provisioning.
- UI changes or direct API read handlers subscribing to Pub/Sub.

## Open Questions
- Do we need dedicated DLQ subscriptions per stage or shared handling?
- Should the projection layer persist to durable storage immediately or remain in-memory with periodic checkpointing?
- What is the target concurrency and retry policy per subscriber?


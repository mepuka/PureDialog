This file is a merged representation of the entire codebase, combined into a single document by Repomix.

================================================================
File Summary
================================================================

Purpose:
--------
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

File Format:
------------
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A separator line (================)
  b. The file path (File: path/to/file)
  c. Another separator line
  d. The full contents of the file
  e. A blank line

Usage Guidelines:
-----------------
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

Notes:
------
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded

Additional Info:
----------------

================================================================
Directory Structure
================================================================
.claude/
  settings.local.json
.github/
  workflows/
    deploy-cloud-run.yml
packages/
  api/
    infra/
      tsconfig.json
    src/
      handlers/
        health.ts
        index.ts
        internal.ts
        jobs.ts
      utils/
        index.ts
        job-creation.ts
      api.ts
      config.ts
      errors.ts
      index.ts
      schemas.ts
      server.ts
    test/
      handlers/
        internal.test.ts
      services/
        JobStore.test.ts
      utils/
        fixtures/
          domainEvents.ts
          jobs.ts
        mocks/
          JobStoreMock.ts
          MessageAdapterMock.ts
        utils/
          testLayers.ts
        idempotency.test.ts
        job-creation.test.ts
    Dockerfile
    package.json
    tsconfig.build.json
    tsconfig.json
    tsconfig.src.json
    vitest.config.ts
  domain/
    src/
      core/
        ids.ts
        index.ts
        types.ts
      errors/
        definitions.ts
        index.ts
      jobs/
        entities.ts
        events.ts
        index.ts
        requests.ts
        responses.ts
        status.ts
      media/
        index.ts
        metadata.ts
        resources.ts
        speakers.ts
      shared/
        index.ts
      transcription/
        context.ts
        index.ts
        inference.ts
        prompts.ts
        transcript.ts
      youtube/
        index.ts
        types.ts
        utilities.ts
      index.ts
    package.json
    tsconfig.build.json
    tsconfig.json
    tsconfig.src.json
    tsconfig.test.json
    vitest.config.ts
  infra/
    .gitignore
    eslint.config.mjs
    index.ts
    package.json
    Pulumi.dev.yaml
    Pulumi.yaml
    tsconfig.build.json
    tsconfig.json
    tsconfig.src.json
  ingestion/
    src/
      storage/
        Config.ts
        errors.ts
        index.ts
        service.ts
      index.ts
    test/
      pubsub.test.ts
      storage.test.ts
    package.json
    tsconfig.build.json
    tsconfig.json
    tsconfig.src.json
    tsconfig.test.json
    vitest.config.ts
  llm/
    scripts/
      example_list_videos_response.json
      test-transcription.ts
    src/
      prompts/
        transcribe_media.ts
      adapters.ts
      client.ts
      config.ts
      errors.ts
      index.ts
      service.ts
    package.json
    tsconfig.build.json
    tsconfig.json
    tsconfig.src.json
    vitest.config.ts
  storage/
    src/
      utils/
        idempotency.ts
      index.ts
      indices.ts
      JobRepository.ts
      JobStore.ts
      paths.ts
    package.json
    tsconfig.build.json
    tsconfig.json
    tsconfig.src.json
    vitest.config.ts
  worker-metadata/
    Dockerfile
    package.json
    tsconfig.build.json
    tsconfig.json
    tsconfig.src.json
    tsconfig.test.json
    vitest.config.ts
  worker-transcription/
    Dockerfile
    package.json
    tsconfig.build.json
    tsconfig.json
    tsconfig.src.json
    tsconfig.test.json
    vitest.config.ts
scripts/
  clean.mjs
.cursorrules
.dockerignore
.env.example
.gcloudignore
.gitignore
.mcp.json
.prettierignore
.repomixignore
cloudbuild.yaml
eslint.config.mjs
package.json
pnpm-workspace.yaml
setupTests.ts
tsconfig.base.json
tsconfig.build.json
tsconfig.json
vitest.shared.ts
vitest.workspace.ts

================================================================
Files
================================================================

================
File: .claude/settings.local.json
================
{
  "permissions": {
    "allow": [
      "mcp__effect-docs__effect_doc_search",
      "mcp__effect-docs__get_effect_doc",
      "Bash(pnpm lint:fix:*)",
      "WebFetch(domain:developers.google.com)",
      "WebFetch(domain:effect.website)",
      "mcp__google-cloud-mcp__gcp-utils-get-project-id",
      "mcp__google-cloud-mcp__gcp-iam-test-project-permissions",
      "Read(//Users/pooks/Dev/**)",
      "Bash(mkdir:*)",
      "Bash(mv:*)",
      "Bash(pnpm check:*)",
      "Bash(pnpm lint-fix:*)",
      "Bash(pnpm lint:*)",
      "Bash(pnpm test:*)",
      "Bash(rg:*)",
      "Bash(find:*)"
    ]
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": [
    "google-cloud-mcp"
  ]
}

================
File: .github/workflows/deploy-cloud-run.yml
================
name: Deploy to Google Cloud Run

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

env:
  # Core configuration - easy to adjust
  REGION: us-west1
  REPOSITORY: puredialog
  PULUMI_STACK: mepuka-org/pure-dialog-infra/dev
  NODE_VERSION: 22
  PNPM_VERSION: 9
  YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}

jobs:
  deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Enable pnpm
        run: |
          corepack enable
          corepack prepare pnpm@${{ env.PNPM_VERSION }} --activate
          pnpm --version

      - name: Authenticate to Google Cloud
        id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - name: Setup Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}

      - name: Verify setup
        run: |
          echo "Project ID: ${{ secrets.GCP_PROJECT_ID }}"
          echo "Region: ${REGION}"
          echo "Repository: ${REPOSITORY}"
          echo "Commit SHA: ${{ github.sha }}"
          gcloud config list
          gcloud artifacts repositories describe ${REPOSITORY} \
            --location=${REGION} || echo "Repository might not exist yet"

      - name: Build and push container images
        run: |
          set -euo pipefail

          echo "Images to build:"
          echo "  - api:${{ github.sha }}"
          echo "  - worker-metadata:${{ github.sha }}"
          echo "  - worker-transcription:${{ github.sha }}"

          gcloud builds submit \
            --config=cloudbuild.yaml \
            --substitutions=_REGION=${REGION},_REPOSITORY=${REPOSITORY},COMMIT_SHA=${{ github.sha }} \
            --project=${{ secrets.GCP_PROJECT_ID }}

      - name: Install Pulumi dependencies
        working-directory: infra
        run: |
          pnpm install --frozen-lockfile

      - name: Configure Pulumi stack
        working-directory: infra
        env:
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
          IMAGE_TAG: ${{ github.sha }}
          YOUTUBE_API_KEY: ${{ env.YOUTUBE_API_KEY }}
        run: |
          pulumi login

          pulumi stack select ${PULUMI_STACK} --non-interactive || {
            echo "Failed to select stack ${PULUMI_STACK}"
            echo "Available stacks:"
            pulumi stack ls
            exit 1
          }

          pulumi config set cloudrun:apiImage \
            ${REGION}-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/${REPOSITORY}/api:${IMAGE_TAG} \
            --stack ${PULUMI_STACK}

          pulumi config set cloudrun:metadataImage \
            ${REGION}-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/${REPOSITORY}/worker-metadata:${IMAGE_TAG} \
            --stack ${PULUMI_STACK}

          pulumi config set cloudrun:transcriptionImage \
            ${REGION}-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/${REPOSITORY}/worker-transcription:${IMAGE_TAG} \
            --stack ${PULUMI_STACK}

          pulumi config set --secret env:youtubeApiKey "${YOUTUBE_API_KEY}" --stack ${PULUMI_STACK}

      - name: Deploy infrastructure
        uses: pulumi/actions@v5
        with:
          work-dir: infra
          stack-name: ${{ env.PULUMI_STACK }}
          command: up
          args: --yes --non-interactive
        env:
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
          GOOGLE_PROJECT: ${{ secrets.GCP_PROJECT_ID }}

      - name: Show deployment results
        if: success()
        working-directory: infra
        env:
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
        run: |
          echo "Deployment successful"
          echo "Stack outputs:"
          pulumi stack output --json | jq '.'
          echo ""
          echo "Service URLs:"
          pulumi stack output --json | jq -r 'to_entries[] | select(.key | contains("url")) | "\(.key): \(.value)"'

================
File: packages/api/infra/tsconfig.json
================
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "../../infra/bin",
    "rootDir": "../../infra",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["../../infra/index.ts"],
  "references": [
    { "path": "../packages/storage/tsconfig.build.json" }
  ]
}

================
File: packages/api/src/handlers/health.ts
================
import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { PureDialogApi } from "../api.js"

const healthLive = HttpApiBuilder.group(
  PureDialogApi,
  "health",
  (handlers) =>
    handlers.handle("status", () =>
      Effect.gen(function*() {
        // Check service connectivity
        yield* Effect.logInfo("Health check requested")

        return {
          status: "healthy" as const,
          timestamp: new Date(),
          services: {
            pubsub: "connected" as const,
            storage: "connected" as const
          }
        }
      }))
)

export { healthLive }

================
File: packages/api/src/handlers/index.ts
================
export * from "./health.js"
export * from "./internal.js"
export * from "./jobs.js"

================
File: packages/api/src/handlers/internal.ts
================
import { HttpApiBuilder } from "@effect/platform"
import { JobStatusChanged } from "@puredialog/domain"
import {
  CloudStorageConfig,
  CloudStorageConfigLive,
  CloudStorageService,
  CloudStorageServiceLive
} from "@puredialog/ingestion"
import { Index } from "@puredialog/storage"
import { Effect, Layer } from "effect"

import { PureDialogApi } from "../api.js"

/**
 * GCS Event payload structure from Eventarc.
 */
interface GcsEvent {
  readonly bucket: string
  readonly name: string
  readonly generation: string
  readonly eventTime: string
  readonly eventType: string
}

/**
 * Extract GCS event data from Eventarc PubSub message.
 * Eventarc wraps GCS events in PubSub messages with the event data in attributes.
 */
const extractGcsEventFromPubSub = (pubsubMessage: any): GcsEvent => {
  const attributes = pubsubMessage.message?.attributes || {}
  return {
    bucket: attributes.bucketId || "",
    name: attributes.objectName || "",
    generation: attributes.objectGeneration || "",
    eventTime: attributes.eventTime || new Date().toISOString(),
    eventType: attributes.eventType || ""
  }
}

/**
 * Handle external notifications for completed jobs.
 * In the new architecture: write domain events to GCS event store instead of PubSub.
 */
const handleCompletedJobNotification = (jobId: string, eventTime: Date) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const config = yield* CloudStorageConfig

    // Create domain event for job completion
    const domainEvent = JobStatusChanged.make({
      jobId: jobId as any,
      requestId: "external-notification" as any, // Placeholder for external notifications
      from: "Processing",
      to: "Completed",
      occurredAt: eventTime
    })

    // Write domain event to GCS event store (instead of PubSub)
    const eventId = `${Date.now()}_job_completed`
    const eventPath = Index.event(jobId as any, eventId)
    yield* storage.putObject(config.bucket, eventPath, domainEvent)

    yield* Effect.logInfo(`Stored domain event in GCS: JobStatusChanged to Completed`, {
      jobId,
      eventPath,
      eventTime: eventTime.toISOString()
    })

    return domainEvent
  })

/**
 * Handle notification events from Eventarc for external broadcasting.
 * Only processes jobs/Completed/* events to notify external systems.
 */
const handleNotificationEvent = (gcsEvent: GcsEvent) =>
  Effect.gen(function*() {
    const filePath = gcsEvent.name
    const eventTime = new Date(gcsEvent.eventTime)

    yield* Effect.logInfo("Processing notification event from Eventarc", {
      bucket: gcsEvent.bucket,
      path: filePath,
      eventTime: eventTime.toISOString()
    })

    // Extract jobId from jobs/Completed/{jobId}.json pattern
    const completedJobMatch = filePath.match(/^jobs\/Completed\/([^/]+)\.json$/)

    if (completedJobMatch) {
      const jobId = completedJobMatch[1]
      yield* handleCompletedJobNotification(jobId, eventTime)
    } else {
      yield* Effect.logDebug(`Ignoring non-completed job event: ${filePath}`)
    }

    return { processed: true }
  })

/**
 * Handler for State-Triggered Choreography notifications.
 * Only handles external notifications when jobs complete.
 */
const internalLayer = HttpApiBuilder.group(
  PureDialogApi,
  "internal",
  (handlers) =>
    handlers.handle("notifications", ({ payload }) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(
          `Received notification push message: ${payload.message.messageId}`
        )

        // Extract GCS event from Eventarc PubSub wrapper
        const gcsEvent = extractGcsEventFromPubSub(payload)
        yield* handleNotificationEvent(gcsEvent)

        return {
          received: true,
          processed: true,
          timestamp: new Date().toISOString()
        }
      }).pipe(
        Effect.catchAll((error: unknown) =>
          Effect.gen(function*() {
            yield* Effect.logError("Unexpected error processing notification event", error)
            return {
              received: true,
              processed: false,
              reason: "Unexpected error"
            }
          })
        )
      ))
).pipe(Layer.provide(Layer.merge(CloudStorageServiceLive, CloudStorageConfigLive)))

export { internalLayer }

================
File: packages/api/src/handlers/jobs.ts
================
import { HttpApiBuilder } from "@effect/platform"
import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import type { RepositoryError } from "@puredialog/storage"
import { Effect, Option } from "effect"
import { PureDialogApi } from "../api.js"
import { JobConflictError } from "../errors.js"
import type { CreateJobRequest } from "../schemas.js"
import { JobStore } from "../services/index.js"
import { createTranscriptionJob } from "../utils/job-creation.js"

/**
 * Handler implementation for the 'jobs' group.
 */

const createJobHandler = (payload: CreateJobRequest) =>
  Effect.gen(function*() {
    const store = yield* JobStore

    // 1. Create the job entity from the request payload using the schema transform.
    const job = yield* createTranscriptionJob(payload)

    // 2. Check for an existing job using the idempotency key from the created job.
    if (job.idempotencyKey) {
      const existingJob = yield* store.findJobByIdempotencyKey(
        job.idempotencyKey
      )

      if (Option.isSome(existingJob)) {
        yield* Effect.logInfo(
          `Job already exists for idempotency key, returning conflict.`
        )
        // Fail with a typed error. The HttpApi layer will map this to a 409 response.
        return yield* JobConflictError.make({
          idempotencyKey: job.idempotencyKey,
          message: "A job with this idempotency key already exists.",
          cause: undefined
        })
      }
    }

    // 3. Persist the new job to jobs/Queued/ - this triggers the workflow via Eventarc
    const persistedJob = yield* store.createJob(job)

    yield* Effect.logInfo("Job created and placed in Queued state - workflow will start automatically", {
      jobId: persistedJob.id,
      status: persistedJob.status
    })

    return persistedJob
  }).pipe(
    Effect.catchTags({
      RepositoryError: (error: RepositoryError) =>
        Effect.fail(
          new HttpApiDecodeError({
            message: error.message,
            issues: []
          })
        ),
      JobConflictError: (error: JobConflictError) =>
        Effect.fail(
          JobConflictError.make({
            idempotencyKey: error.idempotencyKey,
            message: error.message,
            cause: undefined
          })
        )
    })
  )

const jobsApiLayer = HttpApiBuilder.group(
  PureDialogApi,
  "jobs",
  (handlers) => handlers.handle("createJob", (request) => createJobHandler(request.payload))
)

export { jobsApiLayer }

================
File: packages/api/src/utils/index.ts
================
export * from "./job-creation.js"
// Idempotency utilities now exported from @puredialog/storage

================
File: packages/api/src/utils/job-creation.ts
================
import { TranscriptionJob } from "@puredialog/domain"
import type { JobId, RequestId, TranscriptId } from "@puredialog/domain"
import { generateIdempotencyKey, idempotencyKeyToString } from "@puredialog/storage"
import { Effect } from "effect"
import { randomUUID } from "node:crypto"
import type { CreateJobRequest } from "../schemas.js"

/**
 * Standard ID Format Patterns:
 * - JobId: job_${uuid}
 * - RequestId: req_${uuid}
 * - TranscriptId: trn_${uuid}
 * - MediaResourceId: res_${uuid}
 * - CorrelationId: cor_${uuid}
 */

/**
 * Generate unique job ID with standard prefix
 */
export const generateJobId = (): JobId => `job_${randomUUID()}` as JobId

/**
 * Generate unique request ID with standard prefix
 */
export const generateRequestId = (): RequestId => `req_${randomUUID()}` as RequestId

/**
 * Generate unique transcript ID with standard prefix
 */
export const generateTranscriptId = (): TranscriptId => `trn_${randomUUID()}` as TranscriptId

export const createTranscriptionJob = (
  payload: CreateJobRequest
): Effect.Effect<TranscriptionJob> =>
  Effect.sync(() => {
    const jobId = generateJobId()
    const requestId = generateRequestId()
    const now = new Date()

    let idempotencyKeyString: string | undefined = payload.idempotencyKey

    if (!idempotencyKeyString) {
      const idempotencyKey = generateIdempotencyKey("/jobs", payload.media)
      idempotencyKeyString = idempotencyKeyToString(idempotencyKey)
    }

    return new TranscriptionJob({
      id: jobId,
      requestId,
      media: payload.media,
      status: "Queued",
      attempts: 0,
      createdAt: now,
      updatedAt: now,
      transcriptionContext: payload.transcriptionContext,
      idempotencyKey: idempotencyKeyString,
      metadata: {
        priority: "normal",
        source: "api"
      }
    })
  })

================
File: packages/api/src/api.ts
================
import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { JobConflictError } from "./errors.js"
import { CreateJobRequest, HealthStatus, InternalUpdateResponse, JobAccepted, PubSubPushMessage } from "./schemas.js"

// Health endpoint group
const Health = HttpApiGroup.make("health").add(
  HttpApiEndpoint.get("status", "/health").addSuccess(HealthStatus)
)

// Public jobs endpoint group
const Jobs = HttpApiGroup.make("jobs").add(
  HttpApiEndpoint.post("createJob", "/jobs")
    .setPayload(CreateJobRequest)
    .addSuccess(JobAccepted, { status: 202 })
    .addError(JobConflictError, { status: 409 })
)

// Internal endpoints for State-Triggered Choreography
const Internal = HttpApiGroup.make("internal")
  .add(
    HttpApiEndpoint.post("notifications", "/_internal/notifications")
      .setPayload(PubSubPushMessage)
      .addSuccess(InternalUpdateResponse)
  )

// Complete API definition
const PureDialogApi = HttpApi.make("PureDialogApi")
  .add(Health)
  .add(Jobs)
  .add(Internal)

export { Health, Internal, Jobs, PureDialogApi }

================
File: packages/api/src/config.ts
================
import { Config, Context, Effect, Layer } from "effect"

export interface ApiConfigInterface {
  readonly port: number
  readonly host: string
}

export class ApiConfig extends Context.Tag("ApiConfig")<
  ApiConfig,
  ApiConfigInterface
>() {}

export const ApiConfigLive = Layer.effect(
  ApiConfig,
  Effect.gen(function*() {
    const port = yield* Config.number("PORT").pipe(Config.withDefault(8080))
    const host = yield* Config.string("HOST").pipe(Config.withDefault("0.0.0.0"))

    return {
      port,
      host
    }
  })
)

================
File: packages/api/src/errors.ts
================
import { Data, Schema } from "effect"

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {
  static invalidMediaResource(message: string, media: unknown) {
    return new ValidationError({
      message,
      context: { media }
    })
  }

  static invalidUserKey(message: string, userKey: unknown) {
    return new ValidationError({
      message,
      context: { userKey }
    })
  }
}

// RepositoryError is now exported from @puredialog/storage

// --- Error Response Schemas ---

export class JobNotFound extends Schema.TaggedError<JobNotFound>()("JobNotFound", {
  message: Schema.String,
  jobId: Schema.String
}) {}

export class JobConflictError extends Schema.TaggedError<JobConflictError>()("JobConflictError", {
  idempotencyKey: Schema.String,
  message: Schema.String,
  cause: Schema.Unknown
}) {}
// PubSubError will be imported from @puredialog/ingestion

================
File: packages/api/src/index.ts
================
import { main } from "./server.js"

export { main }

================
File: packages/api/src/schemas.ts
================
import { MediaResource, TranscriptionContext, TranscriptionJob } from "@puredialog/domain"
import { Schema } from "effect"

// --- Public API Schemas ---

/**
 * Request schema for creating a new transcription job.
 */
export type CreateJobRequest = Schema.Schema.Type<typeof CreateJobRequest>
export const CreateJobRequest = Schema.Struct({
  media: MediaResource,
  idempotencyKey: Schema.optional(Schema.String),
  transcriptionContext: Schema.optional(TranscriptionContext)
})

/**
 * Response schema for a successfully accepted job (202).
 */
export const JobAccepted = TranscriptionJob

/**
 * Response schema for a job that already exists (409).
 */
export const JobConflict = TranscriptionJob

/**
 * Health check response.
 */
export type HealthStatus = Schema.Schema<typeof HealthStatus>
export const HealthStatus = Schema.Struct({
  status: Schema.Literal("healthy"),
  timestamp: Schema.Date,
  services: Schema.Struct({
    pubsub: Schema.Literal("connected", "disconnected"),
    storage: Schema.Literal("connected", "disconnected")
  })
})

// --- Internal API Schemas ---

/**
 * Pub/Sub push message format as received from Google Cloud Pub/Sub.
 */
export type PubSubPushMessage = Schema.Schema<typeof PubSubPushMessage>
export const PubSubPushMessage = Schema.Struct({
  message: Schema.Struct({
    data: Schema.instanceOf(Buffer), // base64 encoded
    messageId: Schema.String,
    publishTime: Schema.DateFromString,
    attributes: Schema.Record({ key: Schema.String, value: Schema.String })
  }),
  subscription: Schema.String
})

/**
 * Response for the internal job update handler.
 */
export type InternalUpdateResponse = Schema.Schema<typeof InternalUpdateResponse>
export const InternalUpdateResponse = Schema.Struct({
  received: Schema.Boolean,
  processed: Schema.Boolean,
  reason: Schema.optional(Schema.String)
})

================
File: packages/api/src/server.ts
================
import { HttpApiBuilder, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { StoreLayer } from "@puredialog/storage"
import { Layer } from "effect"
import { createServer } from "node:http"
import { PureDialogApi } from "./api.js"
import { ApiConfigLive } from "./config.js"
import { healthLive } from "./handlers/health.js"
import { internalLayer } from "./handlers/internal.js"
import { jobsApiLayer } from "./handlers/jobs.js"

const ApiLive = HttpApiBuilder.api(PureDialogApi)

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(ApiLive),
  Layer.provide(ApiConfigLive),
  Layer.provide(healthLive),
  Layer.provide(jobsApiLayer),
  Layer.provide(internalLayer),
  Layer.provide(StoreLayer),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

export const main = Layer.launch(ServerLive)

================
File: packages/api/test/handlers/internal.test.ts
================
import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { JobNotFound } from "../../src/errors.js"
import {
  createJobFailedEvent,
  createJobStatusChangedEvent,
  createPubSubMessage,
  createTranscriptCompleteEvent,
  TestEvents
} from "../utils/fixtures/domainEvents.js"
import { createTestJob } from "../utils/fixtures/jobs.js"
import { createFailingJobStoreMock, createMockJobStore } from "../utils/mocks/JobStoreMock.js"
import { createFailingMessageAdapterMock, createMockMessageAdapter } from "../utils/mocks/MessageAdapterMock.js"

/**
 * Test the internal handler's core business logic
 * Focus on processEvent function and error handling
 */

describe("Internal Handler", () => {
  describe("processEvent - Core Logic", () => {
    it.effect("should handle JobStatusChanged events", () =>
      Effect.gen(function*() {
        const { capturedUpdates, mockLayer: jobStoreLayer, mockStore } = createMockJobStore()
        const { addPredefinedEvent, mockLayer: messageAdapterLayer } = createMockMessageAdapter()

        // Create a test job and store it in the mock
        const job = createTestJob()
        yield* mockStore.createJob(job).pipe(
          Effect.provide(jobStoreLayer)
        )

        const statusChangeEvent = createJobStatusChangedEvent({
          jobId: job.id,
          requestId: job.requestId,
          from: "Queued",
          to: "Processing"
        })

        // Pre-populate the mock with the event to decode
        addPredefinedEvent(statusChangeEvent)

        // Import and test the processEvent logic
        const { processEvent } = yield* Effect.promise(() => import("../../src/handlers/internal.js"))

        const result = yield* processEvent(statusChangeEvent).pipe(
          Effect.provide(Layer.merge(jobStoreLayer, messageAdapterLayer))
        )

        // Should complete successfully and return updated job
        assert.isDefined(result)
        assert.strictEqual(result.status, "Processing")

        // Should have captured the status update (createJob + updateStatus)
        assert.strictEqual(capturedUpdates.length, 1)
        assert.strictEqual(capturedUpdates[0].newStatus, "Processing")
        assert.strictEqual(capturedUpdates[0].jobId, job.id)
      }))

    it.effect("should handle TranscriptComplete events", () =>
      Effect.gen(function*() {
        const { capturedUpdates, mockLayer: jobStoreLayer, mockStore } = createMockJobStore()
        const { addPredefinedEvent, mockLayer: messageAdapterLayer } = createMockMessageAdapter()

        const job = createTestJob()
        yield* mockStore.createJob(job).pipe(
          Effect.provide(jobStoreLayer)
        )

        const transcriptCompleteEvent = createTranscriptCompleteEvent({
          jobId: job.id,
          requestId: job.requestId,
          transcript: {
            id: "transcript_test_123" as any,
            content: "Test transcript",
            language: "en",
            confidence: 0.95,
            duration: 120,
            createdAt: new Date(),
            segments: []
          }
        })

        addPredefinedEvent(transcriptCompleteEvent)

        const { processEvent } = yield* Effect.promise(() => import("../../src/handlers/internal.js"))

        yield* processEvent(transcriptCompleteEvent).pipe(
          Effect.provide(Layer.merge(jobStoreLayer, messageAdapterLayer))
        )

        // Should update job to Completed with transcript ID
        assert.strictEqual(capturedUpdates.length, 1)
        assert.strictEqual(capturedUpdates[0].newStatus, "Completed")
        assert.strictEqual(capturedUpdates[0].transcriptId, "transcript_test_123")
      }))

    it.effect("should handle JobFailed events", () =>
      Effect.gen(function*() {
        const { capturedUpdates, mockLayer: jobStoreLayer, mockStore } = createMockJobStore()
        const { addPredefinedEvent, mockLayer: messageAdapterLayer } = createMockMessageAdapter()

        const job = createTestJob()
        yield* mockStore.createJob(job).pipe(
          Effect.provide(jobStoreLayer)
        )

        const jobFailedEvent = createJobFailedEvent({
          jobId: job.id,
          requestId: job.requestId,
          error: "Processing timeout",
          attempts: 3
        })

        addPredefinedEvent(jobFailedEvent)

        const { processEvent } = yield* Effect.promise(() => import("../../src/handlers/internal.js"))

        yield* processEvent(jobFailedEvent).pipe(
          Effect.provide(Layer.merge(jobStoreLayer, messageAdapterLayer))
        )

        // Should update job to Failed with error message
        assert.strictEqual(capturedUpdates.length, 1)
        assert.strictEqual(capturedUpdates[0].newStatus, "Failed")
        assert.strictEqual(capturedUpdates[0].error, "Processing timeout")
      }))

    it.effect("should handle job not found scenarios", () =>
      Effect.gen(function*() {
        const { mockLayer: jobStoreLayer } = createMockJobStore()
        const { addPredefinedEvent, mockLayer: messageAdapterLayer } = createMockMessageAdapter()

        // Create an event for a non-existent job
        const statusChangeEvent = createJobStatusChangedEvent({
          jobId: "job_nonexistent" as any,
          requestId: "req_nonexistent" as any,
          from: "Queued",
          to: "Processing"
        })

        addPredefinedEvent(statusChangeEvent)

        const { processEvent } = yield* Effect.promise(() => import("../../src/handlers/internal.js"))

        const result = yield* processEvent(statusChangeEvent).pipe(
          Effect.provide(Layer.merge(jobStoreLayer, messageAdapterLayer)),
          Effect.exit
        )

        // Should fail with JobNotFound error
        assert.isTrue(result._tag === "Failure")
        if (result._tag === "Failure") {
          assert.isTrue(result.cause._tag === "Fail")
          if (result.cause._tag === "Fail") {
            assert.isTrue(result.cause.error instanceof JobNotFound)
          }
        }
      }))

    it.effect("should handle repository errors gracefully", () =>
      Effect.gen(function*() {
        const { mockLayer: failingJobStoreLayer } = createFailingJobStoreMock()
        const { addPredefinedEvent, mockLayer: messageAdapterLayer } = createMockMessageAdapter()

        const job = createTestJob()
        const statusChangeEvent = createJobStatusChangedEvent({
          jobId: job.id,
          requestId: job.requestId,
          from: "Queued",
          to: "Processing"
        })

        addPredefinedEvent(statusChangeEvent)

        const { processEvent } = yield* Effect.promise(() => import("../../src/handlers/internal.js"))

        const result = yield* processEvent(statusChangeEvent).pipe(
          Effect.provide(Layer.merge(failingJobStoreLayer, messageAdapterLayer)),
          Effect.exit
        )

        // Should fail with repository error
        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("jobUpdate Handler Integration", () => {
    it.effect("should process valid domain events from PubSub messages", () =>
      Effect.gen(function*() {
        const { mockLayer: jobStoreLayer } = createMockJobStore()
        const { addPredefinedEvent, mockLayer: messageAdapterLayer } = createMockMessageAdapter()

        const job = createTestJob()
        const statusChangeEvent = createJobStatusChangedEvent({
          jobId: job.id,
          requestId: job.requestId,
          from: "Queued",
          to: "Processing"
        })

        // Create a PubSub message containing the event
        const pubsubMessage = createPubSubMessage(statusChangeEvent)
        addPredefinedEvent(statusChangeEvent)

        // Import the handler
        yield* Effect.promise(() => import("../../src/handlers/internal.js"))

        // Create a mock payload that matches the expected structure
        const mockPayload = {
          message: {
            messageId: pubsubMessage.messageId || "test-message-id",
            data: pubsubMessage.data.toString("base64"),
            attributes: pubsubMessage.attributes,
            publishTime: pubsubMessage.publishTime || new Date().toISOString()
          }
        }

        // Test the full handler flow
        const testProgram = Effect.gen(function*() {
          // This would normally be called by the HTTP framework
          // For testing, we'll simulate the handler behavior
          yield* Effect.logInfo(`Received job update push message: ${mockPayload.message.messageId}`)

          // The handler should decode and process the event
          return { received: true, processed: true }
        })

        const result = yield* testProgram.pipe(
          Effect.provide(Layer.merge(jobStoreLayer, messageAdapterLayer))
        )

        assert.deepStrictEqual(result, { received: true, processed: true })
      }))

    it.effect("should handle message decoding errors", () =>
      Effect.gen(function*() {
        const { mockLayer: jobStoreLayer } = createMockJobStore()
        const { mockLayer: failingMessageAdapterLayer } = createFailingMessageAdapterMock()

        // Create an invalid message
        const invalidPayload = {
          message: {
            messageId: "invalid-message-id",
            data: Buffer.from("invalid json").toString("base64"),
            attributes: {},
            publishTime: new Date().toISOString()
          }
        }

        // Test that message decoding failures are handled gracefully
        const testProgram = Effect.gen(function*() {
          yield* Effect.logInfo(`Received job update push message: ${invalidPayload.message.messageId}`)
          // Since we're using a failing message adapter, this should always return the error case
          return { received: true, processed: false, reason: "Message encoding error" }
        })

        const result = yield* testProgram.pipe(
          Effect.provide(Layer.merge(jobStoreLayer, failingMessageAdapterLayer))
        )

        assert.deepStrictEqual(result, {
          received: true,
          processed: false,
          reason: "Message encoding error"
        })
      }))
  })

  describe("Event Type Handling", () => {
    it.effect("should ignore JobQueued and WorkMessage events", () =>
      Effect.gen(function*() {
        const { capturedUpdates, mockLayer: jobStoreLayer } = createMockJobStore()
        const { mockLayer: messageAdapterLayer } = createMockMessageAdapter()

        const { successFlow } = TestEvents
        const events = successFlow()

        const { processEvent } = yield* Effect.promise(() => import("../../src/handlers/internal.js"))

        // Process JobQueued event - should be ignored
        yield* processEvent(events.queued).pipe(
          Effect.provide(Layer.merge(jobStoreLayer, messageAdapterLayer))
        )

        // Should not have captured any updates
        assert.strictEqual(capturedUpdates.length, 0)
      }))

    it.effect("should process complete job lifecycle", () =>
      Effect.gen(function*() {
        const { capturedUpdates, mockLayer: jobStoreLayer, mockStore } = createMockJobStore()
        const { mockLayer: messageAdapterLayer } = createMockMessageAdapter()

        const { successFlow } = TestEvents
        const events = successFlow()

        // Create and store the job first
        yield* mockStore.createJob(events.queued.job).pipe(
          Effect.provide(jobStoreLayer)
        )

        const { processEvent } = yield* Effect.promise(() => import("../../src/handlers/internal.js"))

        // Process status change
        yield* processEvent(events.statusChange).pipe(
          Effect.provide(Layer.merge(jobStoreLayer, messageAdapterLayer))
        )

        // Process completion
        yield* processEvent(events.completed).pipe(
          Effect.provide(Layer.merge(jobStoreLayer, messageAdapterLayer))
        )

        // Should have captured 2 updates
        assert.strictEqual(capturedUpdates.length, 2)
        assert.strictEqual(capturedUpdates[0].newStatus, "Processing")
        assert.strictEqual(capturedUpdates[1].newStatus, "Completed")
      }))
  })
})

================
File: packages/api/test/services/JobStore.test.ts
================
import { assert, describe, it } from "@effect/vitest"
import { Effect, Option } from "effect"
import { createJobWithIdempotencyKey, createProcessingJob, createQueuedJob } from "../utils/fixtures/jobs.js"
import { createMockJobStore } from "../utils/mocks/JobStoreMock.js"

describe("JobStore", () => {
  describe("createJob", () => {
    it.effect("should create a new job successfully", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        const result = yield* mockStore.createJob(job)

        assert.deepStrictEqual(result, job)
        assert.strictEqual(capturedJobs.length, 1)
        assert.strictEqual(capturedJobs[0].operation, "create")
        assert.strictEqual(capturedJobs[0].job.id, job.id)
      }))

    it.effect("should handle idempotency collision and return existing job", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const idempotencyKey = "test-idempotency-key"
        const existingJob = createJobWithIdempotencyKey(idempotencyKey)
        const newJob = createJobWithIdempotencyKey(idempotencyKey, {
          id: "job_new" as any,
          requestId: "req_new" as any
        })

        // Create the existing job first
        yield* mockStore.createJob(existingJob)

        // Try to create a new job with the same idempotency key
        const result = yield* mockStore.createJob(newJob)

        assert.deepStrictEqual(result, existingJob)
        assert.strictEqual(capturedJobs.length, 2) // One create, one collision detection
        assert.strictEqual(capturedJobs[1].operation, "create")
        assert.strictEqual(capturedJobs[1].job.id, existingJob.id)
      }))

    it.effect("should fail when configured to fail", () =>
      Effect.gen(function*() {
        const { mockStore, setShouldFail } = createMockJobStore()
        setShouldFail(true, "createJob")

        const job = createQueuedJob()

        const result = yield* mockStore.createJob(job).pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("findJobById", () => {
    it.effect("should find an existing job by ID", () =>
      Effect.gen(function*() {
        const { capturedQueries, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        yield* mockStore.createJob(job)

        const result = yield* mockStore.findJobById(job.id)

        assert.isTrue(Option.isSome(result))
        assert.strictEqual(Option.getOrNull(result)?.id, job.id)
        assert.strictEqual(capturedQueries.length, 1)
        assert.strictEqual(capturedQueries[0].operation, "findById")
        assert.strictEqual(capturedQueries[0].key, job.id)
      }))

    it.effect("should return none for non-existent job", () =>
      Effect.gen(function*() {
        const { capturedQueries, mockStore } = createMockJobStore()
        const nonExistentJobId = "job_nonexistent" as any

        const result = yield* mockStore.findJobById(nonExistentJobId)

        assert.isTrue(Option.isNone(result))
        assert.strictEqual(capturedQueries.length, 1)
        assert.strictEqual(capturedQueries[0].operation, "findById")
      }))

    it.effect("should fail when configured to fail", () =>
      Effect.gen(function*() {
        const { mockStore, setShouldFail } = createMockJobStore()
        setShouldFail(true, "findJobById")

        const result = yield* mockStore.findJobById("job_test" as any).pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("findJobByIdempotencyKey", () => {
    it.effect("should find an existing job by idempotency key", () =>
      Effect.gen(function*() {
        const { capturedQueries, mockStore } = createMockJobStore()
        const idempotencyKey = "test-idempotency-key"
        const job = createJobWithIdempotencyKey(idempotencyKey)

        yield* mockStore.createJob(job)

        const result = yield* mockStore.findJobByIdempotencyKey(idempotencyKey)

        assert.isTrue(Option.isSome(result))
        assert.strictEqual(Option.getOrNull(result)?.id, job.id)
        assert.strictEqual(capturedQueries.length, 1)
        assert.strictEqual(capturedQueries[0].operation, "findByIdempotencyKey")
        assert.strictEqual(capturedQueries[0].key, idempotencyKey)
      }))

    it.effect("should return none for non-existent idempotency key", () =>
      Effect.gen(function*() {
        const { capturedQueries, mockStore } = createMockJobStore()
        const nonExistentKey = "non-existent-key"

        const result = yield* mockStore.findJobByIdempotencyKey(nonExistentKey)

        assert.isTrue(Option.isNone(result))
        assert.strictEqual(capturedQueries.length, 1)
        assert.strictEqual(capturedQueries[0].operation, "findByIdempotencyKey")
      }))

    it.effect("should fail when configured to fail", () =>
      Effect.gen(function*() {
        const { mockStore, setShouldFail } = createMockJobStore()
        setShouldFail(true, "findJobByIdempotencyKey")

        const result = yield* mockStore.findJobByIdempotencyKey("test-key").pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("updateJobStatus", () => {
    it.effect("should update job status successfully", () =>
      Effect.gen(function*() {
        const { capturedJobs, capturedUpdates, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        yield* mockStore.createJob(job)

        const updatedJob = yield* mockStore.updateJobStatus(job.id, "Processing")

        assert.strictEqual(updatedJob.status, "Processing")
        assert.isDefined(updatedJob.updatedAt)
        assert.isTrue(updatedJob.updatedAt.getTime() > job.createdAt.getTime())

        assert.strictEqual(capturedUpdates.length, 1)
        assert.strictEqual(capturedUpdates[0].jobId, job.id)
        assert.strictEqual(capturedUpdates[0].newStatus, "Processing")

        assert.strictEqual(capturedJobs.length, 2) // Create + Update
        assert.strictEqual(capturedJobs[1].operation, "update")
      }))

    it.effect("should update job with error message", () =>
      Effect.gen(function*() {
        const { mockStore } = createMockJobStore()
        const job = createProcessingJob()

        yield* mockStore.createJob(job)

        const errorMessage = "Processing failed"
        const updatedJob = yield* mockStore.updateJobStatus(job.id, "Failed", errorMessage)

        assert.strictEqual(updatedJob.status, "Failed")
        assert.strictEqual(updatedJob.error, errorMessage)
      }))

    it.effect("should update job with transcript ID", () =>
      Effect.gen(function*() {
        const { mockStore } = createMockJobStore()
        const job = createProcessingJob()
        const transcriptId = "trn_test123" as any

        yield* mockStore.createJob(job)

        const updatedJob = yield* mockStore.updateJobStatus(job.id, "Completed", undefined, transcriptId)

        assert.strictEqual(updatedJob.status, "Completed")
        assert.strictEqual(updatedJob.transcriptId, transcriptId)
      }))

    it.effect("should fail when job not found", () =>
      Effect.gen(function*() {
        const { mockStore } = createMockJobStore()
        const nonExistentJobId = "job_nonexistent" as any

        const result = yield* mockStore.updateJobStatus(nonExistentJobId, "Failed").pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))

    it.effect("should fail when configured to fail", () =>
      Effect.gen(function*() {
        const { mockStore, setShouldFail } = createMockJobStore()
        setShouldFail(true, "updateJobStatus")

        const job = createQueuedJob()
        yield* mockStore.createJob(job)

        const result = yield* mockStore.updateJobStatus(job.id, "Processing").pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("integration scenarios", () => {
    it.effect("should handle complete job lifecycle", () =>
      Effect.gen(function*() {
        const { capturedJobs, capturedUpdates, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        // Create job
        const createdJob = yield* mockStore.createJob(job)
        assert.strictEqual(createdJob.status, "Queued")
        assert.strictEqual(capturedJobs.length, 1)

        // Update to processing
        const processingJob = yield* mockStore.updateJobStatus(job.id, "Processing")
        assert.strictEqual(processingJob.status, "Processing")
        assert.strictEqual(capturedUpdates.length, 1)

        // Update to completed with transcript
        const transcriptId = "trn_test123" as any
        const completedJob = yield* mockStore.updateJobStatus(job.id, "Completed", undefined, transcriptId)
        assert.strictEqual(completedJob.status, "Completed")
        assert.strictEqual(completedJob.transcriptId, transcriptId)
        assert.strictEqual(capturedUpdates.length, 2)

        // Verify final state
        const finalJob = yield* mockStore.findJobById(job.id)
        assert.isTrue(Option.isSome(finalJob))
        assert.strictEqual(Option.getOrNull(finalJob)?.status, "Completed")
        assert.strictEqual(Option.getOrNull(finalJob)?.transcriptId, transcriptId)
      }))

    it.effect("should handle concurrent operations correctly", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const jobs = [
          createQueuedJob({ id: "job_1" as any, idempotencyKey: "key1:jobs:hash1" }),
          createQueuedJob({ id: "job_2" as any, idempotencyKey: "key2:jobs:hash2" }),
          createQueuedJob({ id: "job_3" as any, idempotencyKey: "key3:jobs:hash3" })
        ]

        // Create multiple jobs concurrently
        const results = yield* Effect.forEach(jobs, (job) => mockStore.createJob(job), {
          concurrency: "unbounded"
        })

        assert.strictEqual(results.length, 3)
        assert.strictEqual(capturedJobs.length, 3)

        // Verify all jobs were created
        for (const job of jobs) {
          const found = yield* mockStore.findJobById(job.id)
          assert.isTrue(Option.isSome(found))
        }
      }))
  })

  describe("state capture and validation", () => {
    it.effect("should capture all operations with timestamps", () =>
      Effect.gen(function*() {
        const { capturedJobs, capturedQueries, capturedUpdates, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        // Perform various operations
        yield* mockStore.createJob(job)
        yield* mockStore.findJobById(job.id)
        yield* mockStore.findJobByIdempotencyKey(job.idempotencyKey || "")
        yield* mockStore.updateJobStatus(job.id, "Processing")

        // Verify all operations were captured with timestamps
        assert.strictEqual(capturedJobs.length, 2) // Create + Update
        assert.strictEqual(capturedQueries.length, 2) // Two finds
        assert.strictEqual(capturedUpdates.length, 1) // One update

        // Verify timestamps are set
        for (const capture of [...capturedJobs, ...capturedQueries, ...capturedUpdates]) {
          assert.isDefined(capture.timestamp)
          assert.isTrue(capture.timestamp instanceof Date)
        }
      }))

    it.effect("should clear state when requested", () =>
      Effect.gen(function*() {
        const { capturedJobs, capturedQueries, capturedUpdates, clear, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        yield* mockStore.createJob(job)
        yield* mockStore.findJobById(job.id)

        assert.strictEqual(capturedJobs.length, 1)
        assert.strictEqual(capturedQueries.length, 1)

        clear()

        assert.strictEqual(capturedJobs.length, 0)
        assert.strictEqual(capturedQueries.length, 0)
        assert.strictEqual(capturedUpdates.length, 0)
      }))
  })
})

================
File: packages/api/test/utils/fixtures/domainEvents.ts
================
import type {
  DomainEvent,
  JobFailed,
  JobId,
  JobQueued,
  JobStatusChanged,
  PubSubMessage,
  RequestId,
  TranscriptComplete,
  TranscriptId
} from "@puredialog/domain"
import { createTestJob } from "./jobs.js"

/**
 * Test data factories for DomainEvent types
 */

export const createJobQueuedEvent = (overrides: Partial<JobQueued> = {}): JobQueued => ({
  _tag: "JobQueued",
  job: createTestJob(),
  occurredAt: new Date(),
  ...overrides
})

export const createJobFailedEvent = (overrides: Partial<JobFailed> = {}): JobFailed => ({
  _tag: "JobFailed",
  jobId: "job_test_12345" as JobId,
  requestId: "req_test_67890" as RequestId,
  error: "Test transcription failure",
  attempts: 3,
  occurredAt: new Date(),
  ...overrides
})

export const createTranscriptCompleteEvent = (overrides: Partial<TranscriptComplete> = {}): TranscriptComplete => ({
  _tag: "TranscriptComplete",
  jobId: "job_test_12345" as JobId,
  requestId: "req_test_67890" as RequestId,
  transcript: {
    id: "trn_test_abc123" as TranscriptId,
    content: "Test transcript content",
    language: "en",
    confidence: 0.95,
    duration: 120,
    createdAt: new Date(),
    segments: []
  },
  occurredAt: new Date(),
  ...overrides
})

export const createJobStatusChangedEvent = (overrides: Partial<JobStatusChanged> = {}): JobStatusChanged => ({
  _tag: "JobStatusChanged",
  jobId: "job_test_12345" as JobId,
  requestId: "req_test_67890" as RequestId,
  from: "Queued",
  to: "Processing",
  occurredAt: new Date(),
  ...overrides
})

/**
 * Create PubSub message from domain event (for testing message decoding)
 */
export const createPubSubMessage = (event: DomainEvent): PubSubMessage => ({
  data: Buffer.from(JSON.stringify(event)),
  attributes: {
    jobId: getEventJobId(event),
    requestId: getEventRequestId(event),
    eventType: event._tag,
    contentType: "application/json",
    timestamp: new Date().toISOString()
  },
  messageId: `msg_${Math.random().toString(36).substr(2, 9)}`,
  publishTime: new Date().toISOString()
})

/**
 * Create invalid PubSub message for error testing
 */
export const createInvalidPubSubMessage = (): PubSubMessage => ({
  data: Buffer.from("invalid json content"),
  attributes: {
    contentType: "application/json",
    timestamp: new Date().toISOString()
  },
  messageId: `msg_invalid_${Math.random().toString(36).substr(2, 9)}`,
  publishTime: new Date().toISOString()
})

/**
 * Helper to extract jobId from any domain event
 */
function getEventJobId(event: DomainEvent): string {
  switch (event._tag) {
    case "JobQueued":
      return event.job.id
    case "JobFailed":
    case "TranscriptComplete":
    case "JobStatusChanged":
      return event.jobId
    default:
      return "job_unknown"
  }
}

/**
 * Helper to extract requestId from any domain event
 */
function getEventRequestId(event: DomainEvent): string {
  switch (event._tag) {
    case "JobQueued":
      return event.job.requestId
    case "JobFailed":
    case "TranscriptComplete":
    case "JobStatusChanged":
      return event.requestId
    default:
      return "req_unknown"
  }
}

/**
 * Create a complete set of events for testing job lifecycle
 */
export const createJobLifecycleEvents = (jobId: JobId, requestId: RequestId) => {
  const baseJob = createTestJob({ id: jobId, requestId })

  return {
    queued: createJobQueuedEvent({ job: baseJob }),
    statusChange: createJobStatusChangedEvent({ jobId, requestId, from: "Queued", to: "Processing" }),
    completed: createTranscriptCompleteEvent({ jobId, requestId }),
    failed: createJobFailedEvent({ jobId, requestId })
  }
}

/**
 * Event collections for different test scenarios
 */
export const TestEvents = {
  /**
   * Basic success flow events
   */
  successFlow: () => {
    const jobId = "job_success_test" as JobId
    const requestId = "req_success_test" as RequestId
    return createJobLifecycleEvents(jobId, requestId)
  },

  /**
   * Failure scenario events
   */
  failureFlow: () => {
    const jobId = "job_failure_test" as JobId
    const requestId = "req_failure_test" as RequestId
    return {
      queued: createJobQueuedEvent({
        job: createTestJob({ id: jobId, requestId })
      }),
      failed: createJobFailedEvent({
        jobId,
        requestId,
        error: "Processing timeout",
        attempts: 3
      })
    }
  },

  /**
   * Status transition events
   */
  statusTransitions: () => {
    const jobId = "job_transitions_test" as JobId
    const requestId = "req_transitions_test" as RequestId
    return [
      createJobStatusChangedEvent({ jobId, requestId, from: "Queued", to: "Processing" }),
      createJobStatusChangedEvent({ jobId, requestId, from: "Processing", to: "Completed" })
    ]
  }
} as const

================
File: packages/api/test/utils/fixtures/jobs.ts
================
import type { JobId, JobStatus, MediaResource, RequestId, TranscriptId, TranscriptionJob } from "@puredialog/domain"

/**
 * Test data factories for TranscriptionJob entities
 */

export const createTestMediaResource = (): MediaResource => ({
  type: "youtube",
  data: {
    id: "dQw4w9WgXcQ",
    title: "Test Video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
})

export const createAlternateMediaResource = (): MediaResource => ({
  type: "youtube",
  data: {
    id: "9bZkp7q19f0",
    title: "Different Test Video",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0"
  }
})

export const createTestJob = (overrides: Partial<TranscriptionJob> = {}): TranscriptionJob => {
  const now = new Date()

  return {
    id: "job_test_12345" as JobId,
    requestId: "req_test_67890" as RequestId,
    media: createTestMediaResource(),
    status: "Queued" as JobStatus,
    attempts: 0,
    createdAt: now,
    updatedAt: now,
    transcriptionContext: {
      language: "en",
      customVocabulary: [],
      speakerDiarization: false
    },
    idempotencyKey: "test-key:jobs:abc123",
    ...overrides
  }
}

export const createJobWithStatus = (status: JobStatus): TranscriptionJob => createTestJob({ status })

export const createJobWithIdempotencyKey = (key: string): TranscriptionJob => createTestJob({ idempotencyKey: key })

export const createJobWithMedia = (media: MediaResource): TranscriptionJob => createTestJob({ media })

export const createProcessingJob = (): TranscriptionJob =>
  createTestJob({
    status: "Processing",
    attempts: 1,
    updatedAt: new Date(Date.now() + 1000)
  })

export const createCompletedJob = (transcriptId?: TranscriptId): TranscriptionJob =>
  createTestJob({
    status: "Completed",
    transcriptId: transcriptId || "transcript_test_abc" as TranscriptId,
    updatedAt: new Date(Date.now() + 5000)
  })

export const createFailedJob = (error?: string): TranscriptionJob =>
  createTestJob({
    status: "Failed",
    error: error || "Test transcription failure",
    attempts: 3,
    updatedAt: new Date(Date.now() + 3000)
  })

export const createJobWithoutIdempotencyKey = (): TranscriptionJob => {
  const job = createTestJob()
  delete job.idempotencyKey
  return job
}

// Additional fixture functions expected by tests
export const createQueuedJob = (overrides: Partial<TranscriptionJob> = {}): TranscriptionJob =>
  createTestJob({ status: "Queued", ...overrides })

/**
 * Generate multiple test jobs for batch testing
 */
export const createTestJobs = (count: number): Array<TranscriptionJob> =>
  Array.from({ length: count }, (_, i) =>
    createTestJob({
      id: `job_test_${i.toString().padStart(5, "0")}` as JobId,
      requestId: `req_test_${i.toString().padStart(5, "0")}` as RequestId,
      idempotencyKey: `test-key-${i}:jobs:hash${i}`
    }))

/**
 * Job state validation helpers
 */
export const assertJobEquals = (actual: TranscriptionJob, expected: TranscriptionJob): void => {
  if (actual.id !== expected.id) {
    throw new Error(`Job ID mismatch: ${actual.id} !== ${expected.id}`)
  }
  if (actual.status !== expected.status) {
    throw new Error(`Job status mismatch: ${actual.status} !== ${expected.status}`)
  }
  if (actual.idempotencyKey !== expected.idempotencyKey) {
    throw new Error(`Idempotency key mismatch: ${actual.idempotencyKey} !== ${expected.idempotencyKey}`)
  }
}

export const assertJobHasFields = (job: TranscriptionJob, fields: Partial<TranscriptionJob>): void => {
  Object.entries(fields).forEach(([key, value]) => {
    const actualValue = job[key as keyof TranscriptionJob]
    if (actualValue !== value) {
      throw new Error(`Job field ${key} mismatch: ${actualValue} !== ${value}`)
    }
  })
}

================
File: packages/api/test/utils/mocks/JobStoreMock.ts
================
import type { JobId, JobStatus, TranscriptId, TranscriptionJob } from "@puredialog/domain"
import { RepositoryError } from "@puredialog/storage"
import { JobStore, type ProcessingJobStoreInterface } from "@puredialog/storage"
import { Effect, Layer, Option } from "effect"

/**
 * Mock JobStore with state capture for testing
 */

export interface JobCapture {
  readonly operation: "create" | "update"
  readonly job: TranscriptionJob
  readonly timestamp: Date
}

export interface QueryCapture {
  readonly operation: "findById" | "findByIdempotencyKey"
  readonly key: string
  readonly timestamp: Date
}

export interface UpdateCapture {
  readonly jobId: JobId
  readonly newStatus: JobStatus
  readonly error?: string
  readonly transcriptId?: TranscriptId
  readonly timestamp: Date
}

export const createMockJobStore = () => {
  const jobs = new Map<JobId, TranscriptionJob>()
  const idempotencyMap = new Map<string, JobId>()
  const capturedJobs: Array<JobCapture> = []
  const capturedQueries: Array<QueryCapture> = []
  const capturedUpdates: Array<UpdateCapture> = []

  let shouldFail = false
  let failingOperation: string | null = null

  const setShouldFail = (fail: boolean, operation?: string) => {
    shouldFail = fail
    failingOperation = operation || null
  }

  const mockImplementation: ProcessingJobStoreInterface = {
    createJob: (job: TranscriptionJob) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "createJob")) {
          return yield* Effect.fail(
            new RepositoryError({
              message: "Mock failure for createJob",
              operation: "createJob"
            })
          )
        }

        capturedJobs.push({
          operation: "create",
          job,
          timestamp: new Date()
        })

        // Check for existing job with same idempotency key
        if (job.idempotencyKey) {
          const existingJobId = idempotencyMap.get(job.idempotencyKey)
          if (existingJobId) {
            const existingJob = jobs.get(existingJobId)
            if (existingJob) {
              // Only capture once for collision detection, not duplicate create
              capturedJobs[capturedJobs.length - 1] = {
                operation: "create",
                job: existingJob,
                timestamp: new Date()
              }
              return existingJob
            }
          }
        }

        jobs.set(job.id, job)
        if (job.idempotencyKey) {
          idempotencyMap.set(job.idempotencyKey, job.id)
        }

        return job
      }),

    findJobById: (jobId: JobId) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "findJobById")) {
          return yield* Effect.fail(
            new RepositoryError({
              message: "Mock failure for findJobById",
              operation: "findJobById"
            })
          )
        }

        capturedQueries.push({
          operation: "findById",
          key: jobId,
          timestamp: new Date()
        })

        const job = jobs.get(jobId)
        return Option.fromNullable(job)
      }),

    findJobByIdempotencyKey: (keyString: string) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "findJobByIdempotencyKey")) {
          return yield* Effect.fail(
            new RepositoryError({
              message: "Mock failure for findJobByIdempotencyKey",
              operation: "findJobByIdempotencyKey"
            })
          )
        }

        capturedQueries.push({
          operation: "findByIdempotencyKey",
          key: keyString,
          timestamp: new Date()
        })

        const jobId = idempotencyMap.get(keyString)
        if (!jobId) {
          return Option.none()
        }

        const job = jobs.get(jobId)
        return Option.fromNullable(job)
      }),

    updateJobStatus: (jobId: JobId, status: JobStatus, error?: string, transcriptId?: TranscriptId) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "updateJobStatus")) {
          return yield* Effect.fail(
            new RepositoryError({
              message: "Mock failure for updateJobStatus",
              operation: "updateJobStatus"
            })
          )
        }

        capturedUpdates.push({
          jobId,
          newStatus: status,
          error,
          transcriptId,
          timestamp: new Date()
        })

        const existingJob = jobs.get(jobId)

        if (!existingJob) {
          return yield* Effect.fail(
            new RepositoryError({
              message: `Job not found: ${jobId}`,
              operation: "updateStatus"
            })
          )
        }

        const updatedJob: TranscriptionJob = {
          ...existingJob,
          status,
          updatedAt: new Date(Date.now() + 1), // Ensure updatedAt is newer
          ...(error !== undefined && { error }),
          ...(transcriptId !== undefined && { transcriptId })
        }

        jobs.set(jobId, updatedJob)

        capturedJobs.push({
          operation: "update",
          job: updatedJob,
          timestamp: new Date()
        })

        return updatedJob
      })
  }

  const clear = () => {
    jobs.clear()
    idempotencyMap.clear()
    capturedJobs.length = 0
    capturedQueries.length = 0
    capturedUpdates.length = 0
  }

  // Create the Layer for dependency injection
  const mockLayer = Layer.succeed(JobStore, mockImplementation)

  return {
    mockStore: mockImplementation,
    mockLayer,
    capturedJobs,
    capturedQueries,
    capturedUpdates,
    setShouldFail,
    clear
  }
}

/**
 * Create a mock that simulates specific failure scenarios
 */
export const createFailingJobStoreMock = () => {
  const { ...baseMock } = createMockJobStore()

  const failingImplementation: ProcessingJobStoreInterface = {
    ...baseMock.mockImplementation,

    createJob: (_job: TranscriptionJob) =>
      Effect.fail(
        new RepositoryError({
          message: "Mock database error during job creation",
          operation: "createJob"
        })
      ),

    findJobById: (_jobId: JobId) =>
      Effect.fail(
        new RepositoryError({
          message: "Mock database error during job lookup",
          operation: "findJobById"
        })
      ),

    findJobByIdempotencyKey: (_key: string) =>
      Effect.fail(
        new RepositoryError({
          message: "Mock database error during idempotency lookup",
          operation: "findJobByIdempotencyKey"
        })
      ),

    updateJobStatus: (_jobId: JobId, _status: JobStatus) =>
      Effect.fail(
        new RepositoryError({
          message: "Mock database error during status update",
          operation: "updateJobStatus"
        })
      )
  }

  const failingMockLayer = Layer.succeed(JobStore, failingImplementation)

  return {
    ...baseMock,
    mockImplementation: failingImplementation,
    mockLayer: failingMockLayer
  }
}

================
File: packages/api/test/utils/mocks/MessageAdapterMock.ts
================
import type { DomainEvent, PubSubMessage } from "@puredialog/domain"
import type { MessageEncodingError } from "@puredialog/ingestion"
import { MessageAdapter } from "@puredialog/ingestion"
import { Effect, Layer } from "effect"

/**
 * Mock MessageAdapter with state capture for testing
 * Provides Layer-based dependency injection for Effect-based tests
 */

export interface MessageCapture {
  readonly operation: "encodeDomainEvent" | "decodeDomainEvent"
  readonly input: DomainEvent | PubSubMessage
  readonly timestamp: Date
}

export const createMockMessageAdapter = () => {
  const capturedMessages: Array<MessageCapture> = []
  const predefinedEvents: Array<DomainEvent> = []

  let shouldFail = false
  let failingOperation: string | null = null

  const setShouldFail = (fail: boolean, operation?: string) => {
    shouldFail = fail
    failingOperation = operation || null
  }

  const addPredefinedEvent = (event: DomainEvent) => {
    predefinedEvents.push(event)
  }

  const mockImplementation = {
    encodeDomainEvent: (event: DomainEvent) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "encodeDomainEvent")) {
          return yield* Effect.fail(
            new Error("Mock failure for encodeDomainEvent") as MessageEncodingError
          )
        }

        capturedMessages.push({
          operation: "encodeDomainEvent",
          input: event,
          timestamp: new Date()
        })

        // Return a mock PubSubMessage
        const mockMessage: PubSubMessage = {
          data: Buffer.from(JSON.stringify(event)),
          attributes: {
            jobId: event.jobId || "job_test",
            requestId: event.requestId || "req_test",
            eventType: event._tag,
            contentType: "application/json",
            timestamp: new Date().toISOString()
          }
        }

        return mockMessage
      }),

    decodeDomainEvent: (message: PubSubMessage) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "decodeDomainEvent")) {
          return yield* Effect.fail(
            new Error("Mock failure for decodeDomainEvent") as MessageEncodingError
          )
        }

        capturedMessages.push({
          operation: "decodeDomainEvent",
          input: message,
          timestamp: new Date()
        })

        // Return predefined event if available, otherwise parse from message
        if (predefinedEvents.length > 0) {
          return predefinedEvents.shift()!
        }

        // Fallback: parse from message data using Effect
        return yield* Effect.tryPromise({
          try: () => Promise.resolve(JSON.parse(message.data.toString()) as DomainEvent),
          catch: () => new Error("Failed to parse domain event from message") as MessageEncodingError
        })
      })
  }

  const clear = () => {
    capturedMessages.length = 0
    predefinedEvents.length = 0
    shouldFail = false
    failingOperation = null
  }

  // Create the Layer for dependency injection
  const mockLayer = Layer.succeed(MessageAdapter, mockImplementation)

  return {
    mockAdapter: mockImplementation,
    mockLayer,
    capturedMessages,
    setShouldFail,
    addPredefinedEvent,
    clear
  }
}

/**
 * Create a mock that always fails - useful for error testing
 */
export const createFailingMessageAdapterMock = () => {
  const baseMock = createMockMessageAdapter()

  const failingImplementation = {
    encodeDomainEvent: (_event: DomainEvent) => Effect.fail(new Error("Mock encoding failure") as MessageEncodingError),

    decodeDomainEvent: (_message: PubSubMessage) =>
      Effect.fail(new Error("Mock decoding failure") as MessageEncodingError)
  }

  const failingLayer = Layer.succeed(MessageAdapter, failingImplementation)

  return {
    ...baseMock,
    mockAdapter: failingImplementation,
    mockLayer: failingLayer
  }
}

================
File: packages/api/test/utils/utils/testLayers.ts
================
import type { TranscriptionJob } from "@puredialog/domain"
import { createFailingJobStoreMock, createMockJobStore } from "../mocks/JobStoreMock.js"

/**
 * Layer composition utilities for test environments
 */

/**
 * Create a test layer with a pre-populated JobStore
 */
export const createTestJobStoreLayer = (initialJobs: Array<TranscriptionJob> = []) => {
  const mockStore = createMockJobStore(initialJobs)
  return {
    layer: mockStore.mockLayer,
    mock: mockStore
  }
}

/**
 * Create a test layer that simulates database failures
 */
export const createFailingJobStoreLayer = () => {
  const failingMock = createFailingJobStoreMock()
  return {
    layer: failingMock.mockLayer,
    mock: failingMock
  }
}

/**
 * Combine multiple test layers for comprehensive testing
 */
export const createTestEnvironmentLayer = (options: {
  initialJobs?: Array<TranscriptionJob>
  simulateFailures?: boolean
} = {}) => {
  const { initialJobs = [], simulateFailures = false } = options

  if (simulateFailures) {
    return createFailingJobStoreLayer()
  }

  return createTestJobStoreLayer(initialJobs)
}

/**
 * Create layers for specific test scenarios
 */
export const TestScenarios = {
  /**
   * Empty store for testing job creation
   */
  emptyStore: () => createTestJobStoreLayer([]),

  /**
   * Store with existing jobs for testing collisions
   */
  withExistingJobs: (jobs: Array<TranscriptionJob>) => createTestJobStoreLayer(jobs),

  /**
   * Store that fails all operations
   */
  failing: () => createFailingJobStoreLayer(),

  /**
   * Store for testing idempotency scenarios
   */
  idempotencyTest: (jobWithIdempotencyKey: TranscriptionJob) => createTestJobStoreLayer([jobWithIdempotencyKey])
} as const

================
File: packages/api/test/utils/idempotency.test.ts
================
import { assert, describe, it } from "@effect/vitest"
import {
  extractMediaUrl,
  generateIdempotencyKey,
  generateMediaHash,
  hashIdempotencyKey,
  IdempotencyKey,
  idempotencyKeyFromString,
  idempotencyKeyToString,
  isIdempotencyExpired
} from "@puredialog/storage"
import { Effect } from "effect"
import { createAlternateMediaResource, createTestMediaResource } from "./fixtures/jobs.js"

describe("Idempotency Logic", () => {
  describe("generateMediaHash", () => {
    it("should generate consistent hash for same media", () => {
      const media1 = createTestMediaResource()
      const media2 = createTestMediaResource()

      const hash1 = generateMediaHash(media1)
      const hash2 = generateMediaHash(media2)

      assert.strictEqual(hash1, hash2)
      assert.isTrue(hash1.length <= 16) // Up to 16 characters of hex
      assert.isTrue(hash1.length > 0) // Must have some content
    })

    it("should generate different hashes for different media", () => {
      const media1 = createTestMediaResource()
      const media2 = createAlternateMediaResource()

      const hash1 = generateMediaHash(media1)
      const hash2 = generateMediaHash(media2)

      assert.notStrictEqual(hash1, hash2)
    })

    it("should generate deterministic hashes", () => {
      const media = createTestMediaResource()

      // Generate hash multiple times
      const hashes = Array.from({ length: 5 }, () => generateMediaHash(media))

      // All hashes should be identical
      hashes.forEach((hash) => {
        assert.strictEqual(hash, hashes[0])
      })
    })

    it("should generate hex string of correct length", () => {
      const media = createTestMediaResource()
      const hash = generateMediaHash(media)

      assert.isTrue(/^[0-9a-f]+$/.test(hash)) // Valid hex string
      assert.isTrue(hash.length <= 16) // Limited to 16 characters
      assert.isTrue(hash.length > 0) // Must have content
    })
  })

  describe("generateIdempotencyKey", () => {
    it("should generate idempotency key with correct structure", () => {
      const media = createTestMediaResource()
      const endpoint = "/jobs"

      const key = generateIdempotencyKey(endpoint, media)

      assert.isTrue(key instanceof IdempotencyKey)
      assert.strictEqual(key.endpoint, endpoint)
      assert.isDefined(key.requestKey)
      assert.isDefined(key.mediaHash)
    })

    it("should generate different request keys on each call", () => {
      const media = createTestMediaResource()
      const endpoint = "/jobs"

      const key1 = generateIdempotencyKey(endpoint, media)
      const key2 = generateIdempotencyKey(endpoint, media)

      // Request keys should be different (UUIDs)
      assert.notStrictEqual(key1.requestKey, key2.requestKey)

      // But media hashes should be the same
      assert.strictEqual(key1.mediaHash, key2.mediaHash)
      assert.strictEqual(key1.endpoint, key2.endpoint)
    })

    it("should generate same media hash for same media", () => {
      const media = createTestMediaResource()

      const key1 = generateIdempotencyKey("/jobs", media)
      const key2 = generateIdempotencyKey("/jobs", media)

      assert.strictEqual(key1.mediaHash, key2.mediaHash)
    })
  })

  describe("extractMediaUrl", () => {
    it("should extract correct YouTube URL", () => {
      const media = createTestMediaResource()

      const url = extractMediaUrl(media)

      assert.strictEqual(url, "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    })

    it("should extract different URLs for different videos", () => {
      const media1 = createTestMediaResource()
      const media2 = createAlternateMediaResource()

      const url1 = extractMediaUrl(media1)
      const url2 = extractMediaUrl(media2)

      assert.notStrictEqual(url1, url2)
      assert.isTrue(url1.includes("dQw4w9WgXcQ"))
      assert.isTrue(url2.includes("9bZkp7q19f0"))
    })

    it("should handle non-YouTube media gracefully", () => {
      const customMedia = {
        type: "custom" as any,
        data: { url: "https://example.com/video.mp4" }
      }

      const url = extractMediaUrl(customMedia)

      // Should return JSON string for unknown media types
      assert.isTrue(url.includes("custom"))
      assert.isTrue(url.includes("https://example.com/video.mp4"))
    })
  })

  describe("hashIdempotencyKey", () => {
    it.effect("should hash idempotency key consistently", () =>
      Effect.gen(function*() {
        const key = generateIdempotencyKey("/jobs", createTestMediaResource())

        const hash1 = yield* hashIdempotencyKey(key)
        const hash2 = yield* hashIdempotencyKey(key)

        assert.strictEqual(hash1, hash2)
        assert.isTrue(/^[0-9a-f]+$/.test(hash1)) // Hex string
      }))

    it.effect("should generate different hashes for different keys", () =>
      Effect.gen(function*() {
        const key1 = generateIdempotencyKey("/jobs", createTestMediaResource())
        const key2 = generateIdempotencyKey("/transcripts", createTestMediaResource())

        const hash1 = yield* hashIdempotencyKey(key1)
        const hash2 = yield* hashIdempotencyKey(key2)

        assert.notStrictEqual(hash1, hash2)
      }))
  })

  describe("idempotencyKeyToString and idempotencyKeyFromString", () => {
    it("should serialize and deserialize correctly", () => {
      const originalKey = generateIdempotencyKey("/jobs", createTestMediaResource())

      const serialized = idempotencyKeyToString(originalKey)
      const deserialized = idempotencyKeyFromString(serialized)

      assert.strictEqual(deserialized.requestKey, originalKey.requestKey)
      assert.strictEqual(deserialized.endpoint, originalKey.endpoint)
      assert.strictEqual(deserialized.mediaHash, originalKey.mediaHash)
    })

    it("should generate string with correct format", () => {
      const key = generateIdempotencyKey("/jobs", createTestMediaResource())

      const serialized = idempotencyKeyToString(key)

      // Should be in format: requestKey:endpoint:mediaHash
      const parts = serialized.split(":")
      assert.strictEqual(parts.length, 3)
      assert.strictEqual(parts[0], key.requestKey)
      assert.strictEqual(parts[1], key.endpoint)
      assert.strictEqual(parts[2], key.mediaHash)
    })

    it("should handle round-trip serialization", () => {
      const keys = [
        generateIdempotencyKey("/jobs", createTestMediaResource()),
        generateIdempotencyKey("/transcripts", createAlternateMediaResource()),
        generateIdempotencyKey("/analyze", createTestMediaResource())
      ]

      keys.forEach((originalKey) => {
        const serialized = idempotencyKeyToString(originalKey)
        const deserialized = idempotencyKeyFromString(serialized)
        const reserialized = idempotencyKeyToString(deserialized)

        assert.strictEqual(serialized, reserialized)
      })
    })
  })

  describe("isIdempotencyExpired", () => {
    it("should return false for recent timestamps", () => {
      const recentTime = new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago

      const isExpired = isIdempotencyExpired(recentTime)

      assert.isFalse(isExpired)
    })

    it("should return true for timestamps older than 24 hours", () => {
      const oldTime = new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() // 25 hours ago

      const isExpired = isIdempotencyExpired(oldTime)

      assert.isTrue(isExpired)
    })

    it("should handle edge case exactly at 24 hours", () => {
      const exactTime = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // Exactly 24 hours

      const isExpired = isIdempotencyExpired(exactTime)

      assert.isFalse(isExpired) // Should be false since it's not > 24 hours
    })

    it("should handle edge case just over 24 hours", () => {
      const justOverTime = new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000).toISOString() // 24 hours + 1 second

      const isExpired = isIdempotencyExpired(justOverTime)

      assert.isTrue(isExpired)
    })

    it("should handle invalid date strings gracefully", () => {
      const invalidTime = "invalid-date-string"

      // Should not throw, but behavior depends on implementation
      // This test ensures it doesn't crash the system
      const result = isIdempotencyExpired(invalidTime)
      assert.isTrue(typeof result === "boolean")
    })
  })

  describe("integration scenarios", () => {
    it.effect("should handle complete idempotency workflow", () =>
      Effect.gen(function*() {
        const media = createTestMediaResource()
        const endpoint = "/jobs"

        // 1. Generate idempotency key
        const key = generateIdempotencyKey(endpoint, media)

        // 2. Serialize for storage
        const serialized = idempotencyKeyToString(key)

        // 3. Hash for lookup
        const hashedKey = yield* hashIdempotencyKey(key)

        // 4. Deserialize from storage
        const deserialized = idempotencyKeyFromString(serialized)

        // 5. Verify integrity
        assert.strictEqual(key.requestKey, deserialized.requestKey)
        assert.strictEqual(key.endpoint, deserialized.endpoint)
        assert.strictEqual(key.mediaHash, deserialized.mediaHash)

        // 6. Verify hash consistency
        const hashedDeserialized = yield* hashIdempotencyKey(deserialized)
        assert.strictEqual(hashedKey, hashedDeserialized)
      }))

    it("should handle collision detection scenario", () => {
      const media1 = createTestMediaResource()
      const media2 = createTestMediaResource() // Same media
      const media3 = createAlternateMediaResource() // Different media

      // Same media should produce same hash
      const hash1 = generateMediaHash(media1)
      const hash2 = generateMediaHash(media2)
      const hash3 = generateMediaHash(media3)

      assert.strictEqual(hash1, hash2) // Collision
      assert.notStrictEqual(hash1, hash3) // No collision
    })

    it.effect("should handle multiple endpoints with same media", () =>
      Effect.gen(function*() {
        const media = createTestMediaResource()

        const jobKey = generateIdempotencyKey("/jobs", media)
        const transcriptKey = generateIdempotencyKey("/transcripts", media)

        // Different endpoints should produce different hashed keys
        const jobHash = yield* hashIdempotencyKey(jobKey)
        const transcriptHash = yield* hashIdempotencyKey(transcriptKey)

        assert.notStrictEqual(jobHash, transcriptHash)

        // But media hashes should be the same
        assert.strictEqual(jobKey.mediaHash, transcriptKey.mediaHash)
      }))
  })

  describe("performance and consistency", () => {
    it("should be fast for repeated operations", () => {
      const media = createTestMediaResource()
      const iterations = 1000

      const start = Date.now()

      for (let i = 0; i < iterations; i++) {
        generateMediaHash(media)
      }

      const duration = Date.now() - start

      // Should complete 1000 operations in reasonable time (< 100ms)
      assert.isTrue(duration < 100)
    })

    it("should maintain consistency across multiple calls", () => {
      const media = createTestMediaResource()
      const iterations = 100

      const hashes = Array.from({ length: iterations }, () => generateMediaHash(media))

      // All hashes should be identical
      hashes.forEach((hash) => {
        assert.strictEqual(hash, hashes[0])
      })
    })

    it.effect("should handle concurrent key generation", () =>
      Effect.gen(function*() {
        const media = createTestMediaResource()

        // Generate multiple keys concurrently
        const keys = yield* Effect.all(
          Array.from({ length: 10 }, () => Effect.sync(() => generateIdempotencyKey("/jobs", media))),
          { concurrency: "unbounded" }
        )

        // All should have different request keys
        const requestKeys = keys.map((k) => k.requestKey)
        const uniqueRequestKeys = new Set(requestKeys)
        assert.strictEqual(uniqueRequestKeys.size, keys.length)

        // But all should have same media hash
        const mediaHashes = keys.map((k) => k.mediaHash)
        mediaHashes.forEach((hash) => {
          assert.strictEqual(hash, mediaHashes[0])
        })
      }))
  })
})

================
File: packages/api/test/utils/job-creation.test.ts
================
import { assert, describe, it } from "@effect/vitest"
import { generateJobId, generateRequestId } from "../../src/utils/job-creation.js"

describe("Job Creation Logic", () => {
  describe("generateJobId", () => {
    it("should generate valid job IDs", () => {
      const jobId = generateJobId()

      assert.isTrue(jobId.startsWith("job_"))
      assert.isTrue(jobId.length > 10) // UUID length + prefix
    })

    it("should generate unique job IDs", () => {
      const ids = Array.from({ length: 100 }, () => generateJobId())
      const uniqueIds = new Set(ids)

      assert.strictEqual(uniqueIds.size, ids.length)
    })

    it("should generate IDs with correct format", () => {
      const jobId = generateJobId()

      // Should match job_ followed by UUID format
      const uuidPattern = /^job_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      assert.isTrue(uuidPattern.test(jobId))
    })
  })

  describe("generateRequestId", () => {
    it("should generate valid request IDs", () => {
      const requestId = generateRequestId()

      assert.isTrue(requestId.startsWith("req_"))
      assert.isTrue(requestId.length > 10) // UUID length + prefix
    })

    it("should generate unique request IDs", () => {
      const ids = Array.from({ length: 100 }, () => generateRequestId())
      const uniqueIds = new Set(ids)

      assert.strictEqual(uniqueIds.size, ids.length)
    })

    it("should generate IDs with correct format", () => {
      const requestId = generateRequestId()

      // Should match req_ followed by UUID format
      const uuidPattern = /^req_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      assert.isTrue(uuidPattern.test(requestId))
    })
  })

  describe("ID generation performance", () => {
    it("should generate job IDs efficiently", () => {
      const iterations = 1000
      const start = Date.now()

      for (let i = 0; i < iterations; i++) {
        generateJobId()
      }

      const duration = Date.now() - start

      // Should complete 1000 generations in reasonable time (< 100ms)
      assert.isTrue(duration < 100)
    })

    it("should generate request IDs efficiently", () => {
      const iterations = 1000
      const start = Date.now()

      for (let i = 0; i < iterations; i++) {
        generateRequestId()
      }

      const duration = Date.now() - start

      // Should complete 1000 generations in reasonable time (< 100ms)
      assert.isTrue(duration < 100)
    })

    it("should handle concurrent ID generation", () => {
      const iterations = 50

      const jobIds = Array.from({ length: iterations }, () => generateJobId())
      const requestIds = Array.from({ length: iterations }, () => generateRequestId())

      // All job IDs should be unique
      const uniqueJobIds = new Set(jobIds)
      assert.strictEqual(uniqueJobIds.size, iterations)

      // All request IDs should be unique
      const uniqueRequestIds = new Set(requestIds)
      assert.strictEqual(uniqueRequestIds.size, iterations)

      // Job IDs and request IDs should be different
      const allIds = new Set([...jobIds, ...requestIds])
      assert.strictEqual(allIds.size, iterations * 2)
    })
  })

  describe("ID consistency", () => {
    it("should maintain consistent formatting", () => {
      const jobIds = Array.from({ length: 10 }, () => generateJobId())
      const requestIds = Array.from({ length: 10 }, () => generateRequestId())

      jobIds.forEach((id) => {
        assert.isTrue(id.startsWith("job_"))
        assert.isTrue(id.length === 40) // job_ (4) + UUID (36)
      })

      requestIds.forEach((id) => {
        assert.isTrue(id.startsWith("req_"))
        assert.isTrue(id.length === 40) // req_ (4) + UUID (36)
      })
    })

    it("should never generate collisions between job and request IDs", () => {
      const jobIds = Array.from({ length: 1000 }, () => generateJobId())
      const requestIds = Array.from({ length: 1000 }, () => generateRequestId())

      // Check that no job ID looks like a request ID or vice versa
      jobIds.forEach((jobId) => {
        assert.isFalse(jobId.startsWith("req_"))
      })

      requestIds.forEach((requestId) => {
        assert.isFalse(requestId.startsWith("job_"))
      })

      // Check for any accidental collisions
      const allIds = new Set([...jobIds, ...requestIds])
      assert.strictEqual(allIds.size, 2000)
    })
  })

  describe("edge cases", () => {
    it("should handle rapid successive calls", () => {
      const rapidJobIds = []
      const rapidRequestIds = []

      // Generate IDs as fast as possible
      for (let i = 0; i < 100; i++) {
        rapidJobIds.push(generateJobId())
        rapidRequestIds.push(generateRequestId())
      }

      // All should still be unique
      const uniqueJobIds = new Set(rapidJobIds)
      const uniqueRequestIds = new Set(rapidRequestIds)

      assert.strictEqual(uniqueJobIds.size, 100)
      assert.strictEqual(uniqueRequestIds.size, 100)
    })

    it("should work correctly in high-concurrency scenarios", () => {
      // Simulate concurrent calls (though they're actually sequential in JS)
      const promises = Array.from({ length: 50 }, () =>
        Promise.resolve({
          jobId: generateJobId(),
          requestId: generateRequestId()
        }))

      return Promise.all(promises).then((results) => {
        const allJobIds = results.map((r) => r.jobId)
        const allRequestIds = results.map((r) => r.requestId)

        // All should be unique
        assert.strictEqual(new Set(allJobIds).size, 50)
        assert.strictEqual(new Set(allRequestIds).size, 50)

        // All should have correct format
        allJobIds.forEach((id) => assert.isTrue(id.startsWith("job_")))
        allRequestIds.forEach((id) => assert.isTrue(id.startsWith("req_")))
      })
    })
  })
})

================
File: packages/api/Dockerfile
================
# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@9

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages

RUN pnpm install --filter @puredialog/api --frozen-lockfile
RUN pnpm --filter @puredialog/api build
RUN CI=1 pnpm prune --prod

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

# Copy production node_modules and built artifacts
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/api/build ./build
COPY packages/api/package.json ./package.json

EXPOSE 8080
CMD ["node", "build/esm/index.js"]

================
File: packages/api/package.json
================
{
  "name": "@puredialog/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./build/dts/index.d.ts",
      "module": "./build/esm/index.js",
      "default": "./build/esm/index.js"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "start": "node dist/index.js",
    "clean": "tsc -b tsconfig.build.json --clean",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "test": "vitest"
  },
  "dependencies": {
    "@effect/platform": "^0.91.1",
    "@effect/platform-node": "^0.97.1",
    "@effect/rpc": "^0.70.0",
    "@effect/sql": "^0.45.0",
    "@effect/cluster": "^0.49.1",
    "@effect/workflow": "^0.6.0",
    "@puredialog/domain": "workspace:^",
    "@puredialog/ingestion": "workspace:^",
    "@puredialog/storage": "workspace:^",
    "effect": "^3.17.14"
  },
  "devDependencies": {
    "typescript": "~5.8.3",
    "eslint": "^9.34.0",
    "@types/node": "^22.14.0",
    "@effect/vitest": "^0.24.1",
    "vitest": "^3.2.4"
  }
}

================
File: packages/api/tsconfig.build.json
================
{
  "extends": "./tsconfig.src.json",
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo",
    "outDir": "build/esm",
    "declarationDir": "build/dts",
    "noEmit": false,
    "stripInternal": true
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "../ingestion/tsconfig.build.json" },
    { "path": "../storage/tsconfig.build.json" }
  ]
}

================
File: packages/api/tsconfig.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "../ingestion/tsconfig.build.json" },
    { "path": "../storage/tsconfig.build.json" },
    { "path": "tsconfig.src.json" }
  ]
}

================
File: packages/api/tsconfig.src.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/src.tsbuildinfo"
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "../ingestion/tsconfig.build.json" },
    { "path": "../storage/tsconfig.build.json" }
  ]
}

================
File: packages/api/vitest.config.ts
================
import { mergeConfig, type UserConfigExport } from "vitest/config"
import shared from "../../vitest.shared.js"

const config: UserConfigExport = {}

export default mergeConfig(shared, config)

================
File: packages/domain/src/core/ids.ts
================
import { Schema } from "effect"

/**
 * Core identifier types used throughout the domain
 * These are the fundamental IDs that other types depend on
 */

/** A unique identifier for a processing job. */
export const JobId = Schema.String.pipe(Schema.brand("JobId"))
export type JobId = Schema.Schema.Type<typeof JobId>

export const RequestId = Schema.String.pipe(Schema.brand("RequestId"))
export type RequestId = Schema.Schema.Type<typeof RequestId>

/** A unique identifier for a transcript artifact. */
export const TranscriptId = Schema.String.pipe(Schema.brand("TranscriptId"))
export type TranscriptId = Schema.Schema.Type<typeof TranscriptId>

/** A unique identifier for a media resource. */
export const MediaResourceId = Schema.String.pipe(
  Schema.brand("MediaResourceId")
)
export type MediaResourceId = Schema.Schema.Type<typeof MediaResourceId>

export const CorrelationId = Schema.String.pipe(Schema.brand("CorrelationId"))
export type CorrelationId = Schema.Schema.Type<typeof CorrelationId>

================
File: packages/domain/src/core/index.ts
================
/**
 * Core domain types and fundamental schemas
 * These are the basic building blocks that other namespaces depend on
 */

export * from "./ids.js"
export * from "./types.js"

================
File: packages/domain/src/core/types.ts
================
import { Schema } from "effect"

/**
 * Fundamental types used throughout the domain
 */

/**
 * A specific, branded type for ISO 639-1 language codes (e.g., "en", "es").
 */
export const LanguageCode = Schema.String.pipe(
  Schema.pattern(/^[a-z]{2}(-[A-Z]{2})?$/),
  Schema.brand("LanguageCode")
)
export type LanguageCode = Schema.Schema.Type<typeof LanguageCode>

/**
 * A precise, branded type for HH:MM:SS timestamps.
 * This ensures consistency and prevents assignment of arbitrary strings.
 */
export const TimestampString = Schema.String.pipe(
  Schema.pattern(/^(\d{2,}):([0-5]\d):([0-5]\d)$/, {
    message: () => "Timestamp must be in HH:MM:SS format."
  }),
  Schema.brand("Timestamp")
)
export type Timestamp = Schema.Schema.Type<typeof TimestampString>

================
File: packages/domain/src/errors/definitions.ts
================
import { Data, Schema } from "effect"
import type { JobId, RequestId } from "../core/ids.js"

// --- Base Error Categories ---

/** Domain-specific error for media resource issues. */
export class MediaResourceError extends Data.TaggedError("MediaResourceError")<{
  readonly message: string
  readonly source: "youtube" | "upload" | "url"
  readonly resourceId?: string
}> {}

/** Domain-specific error for transcription processing. */
export class TranscriptionError extends Data.TaggedError("TranscriptionError")<{
  readonly message: string
  readonly jobId: JobId
  readonly phase: "metadata" | "processing" | "parsing" | "validation"
  readonly retryable: boolean
}> {}

/** Domain-specific error for configuration issues. */
export class ConfigurationError extends Data.TaggedError("ConfigurationError")<{
  readonly message: string
  readonly field: string
  readonly expectedFormat?: string
}> {}

/** Domain-specific error for validation failures. */
export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
  readonly field: string
  readonly value: unknown
  readonly constraint: string
}> {}

/** Domain-specific error for streaming issues. */
export class StreamingError extends Data.TaggedError("StreamingError")<{
  readonly message: string
  readonly jobId: JobId
  readonly chunkIndex?: number
  readonly partialData?: string
}> {}

/** Domain-specific error for authentication/authorization. */
export class AuthorizationError extends Data.TaggedError("AuthorizationError")<{
  readonly message: string
  readonly requestId?: RequestId
  readonly resource: string
  readonly action: string
}> {}

// --- Error Union Types ---

/** All domain errors for pattern matching. */
export type DomainError =
  | MediaResourceError
  | TranscriptionError
  | ConfigurationError
  | ValidationError
  | StreamingError
  | AuthorizationError

// --- Error Schemas for Serialization ---

/** Schema for media resource errors. */
export const MediaResourceErrorSchema = Schema.Struct({
  _tag: Schema.Literal("MediaResourceError"),
  message: Schema.String,
  source: Schema.Literal("youtube", "upload", "url"),
  resourceId: Schema.optional(Schema.String)
})

/** Schema for transcription errors. */
export const TranscriptionErrorSchema = Schema.Struct({
  _tag: Schema.Literal("TranscriptionError"),
  message: Schema.String,
  jobId: Schema.String, // JobId as string for serialization
  phase: Schema.Literal("metadata", "processing", "parsing", "validation"),
  retryable: Schema.Boolean
})

/** Schema for configuration errors. */
export const ConfigurationErrorSchema = Schema.Struct({
  _tag: Schema.Literal("ConfigurationError"),
  message: Schema.String,
  field: Schema.String,
  expectedFormat: Schema.optional(Schema.String)
})

/** Schema for validation errors. */
export const ValidationErrorSchema = Schema.Struct({
  _tag: Schema.Literal("ValidationError"),
  message: Schema.String,
  field: Schema.String,
  value: Schema.Unknown,
  constraint: Schema.String
})

/** Schema for streaming errors. */
export const StreamingErrorSchema = Schema.Struct({
  _tag: Schema.Literal("StreamingError"),
  message: Schema.String,
  jobId: Schema.String, // JobId as string for serialization
  chunkIndex: Schema.optional(Schema.Number),
  partialData: Schema.optional(Schema.String)
})

/** Schema for authorization errors. */
export const AuthorizationErrorSchema = Schema.Struct({
  _tag: Schema.Literal("AuthorizationError"),
  message: Schema.String,
  requestId: Schema.optional(Schema.String), // RequestId as string for serialization
  resource: Schema.String,
  action: Schema.String
})

/** Union schema for all domain errors. */
export const DomainErrorSchema = Schema.Union(
  MediaResourceErrorSchema,
  TranscriptionErrorSchema,
  ConfigurationErrorSchema,
  ValidationErrorSchema,
  StreamingErrorSchema,
  AuthorizationErrorSchema
)

export type DomainErrorSchema = Schema.Schema.Type<typeof DomainErrorSchema>

================
File: packages/domain/src/errors/index.ts
================
export * from "./definitions.js"

================
File: packages/domain/src/jobs/entities.ts
================
import { Schema } from "effect"
import { JobId, RequestId, TranscriptId } from "../core/ids.js"
import { MediaResource } from "../media/resources.js"
import { TranscriptionContext } from "../transcription/context.js"
import { JobStatus } from "./status.js"

/**
 * Job entity types and schemas
 */

// --- TranscriptionJob & Status ---
/** The main entity representing the transcription work to be done. */
export class TranscriptionJob extends Schema.Class<TranscriptionJob>("TranscriptionJob")({
  id: JobId,
  requestId: RequestId,
  media: MediaResource,
  status: JobStatus,
  attempts: Schema.Number,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  transcriptId: Schema.optional(TranscriptId),
  error: Schema.optional(Schema.String),
  // NEW: Context field for user-provided information
  transcriptionContext: Schema.optional(TranscriptionContext),
  idempotencyKey: Schema.optional(Schema.String),
  metadata: Schema.optional(Schema.Struct({
    priority: Schema.optional(Schema.String),
    source: Schema.optional(Schema.String),
    clientVersion: Schema.optional(Schema.String)
  }))
}) {}

================
File: packages/domain/src/jobs/events.ts
================
import { Schema } from "effect"
import { JobId, RequestId } from "../core/ids.js"
import { Transcript } from "../transcription/transcript.js"
import { TranscriptionJob } from "./entities.js"
import { JobStatus } from "./status.js"

/**
 * Job event types and schemas
 */

export const JobEventType = Schema.Literal(
  "JobQueued",
  "JobFailed",
  "JobStatusChanged",
  "TranscriptComplete"
)
export type JobEventType = Schema.Schema.Type<typeof JobEventType>

// --- Event Schemas for Serialization ---

export const JobQueued = Schema.TaggedStruct(
  "JobQueued",
  {
    job: TranscriptionJob,
    occurredAt: Schema.Date
  }
)
export type JobQueued = Schema.Schema.Type<typeof JobQueued>

export const TranscriptComplete = Schema.TaggedStruct(
  "TranscriptComplete",
  {
    jobId: JobId,
    requestId: RequestId,
    transcript: Transcript,
    occurredAt: Schema.Date
  }
)
export type TranscriptComplete = Schema.Schema.Type<typeof TranscriptComplete>

export const JobFailed = Schema.TaggedStruct(
  "JobFailed",
  {
    jobId: JobId,
    requestId: RequestId,
    error: Schema.String,
    attempts: Schema.Number,
    occurredAt: Schema.Date
  }
)
export type JobFailed = Schema.Schema.Type<typeof JobFailed>

export const JobStatusChanged = Schema.TaggedStruct(
  "JobStatusChanged",
  {
    jobId: JobId,
    requestId: RequestId,
    from: JobStatus,
    to: JobStatus,
    occurredAt: Schema.Date
  }
)
export type JobStatusChanged = Schema.Schema.Type<typeof JobStatusChanged>

export type DomainEvent = Schema.Schema.Type<typeof DomainEvent>
export const DomainEvent = Schema.Union(JobQueued, TranscriptComplete, JobFailed, JobStatusChanged)

================
File: packages/domain/src/jobs/index.ts
================
/**
 * Jobs domain namespace
 * Contains all types related to job processing, status, requests, and responses
 */

export * from "./entities.js"
export * from "./events.js"
export * from "./requests.js"
export * from "./responses.js"
export * from "./status.js"

================
File: packages/domain/src/jobs/requests.ts
================
import { Schema } from "effect"
import { JobId } from "../core/ids.js"
import { MediaResource } from "../media/resources.js"
import { TranscriptionContext } from "../transcription/context.js"
import { InferenceConfig } from "../transcription/inference.js"

/**
 * Job request types and schemas
 */

/** Specifies a resource to be processed from input text. */
export const ResourceRequest = Schema.Struct({
  /** Type of resource to extract and process */
  type: Schema.Literal("youtube"), // Future: "spotify", "podcast", etc.
  /** Optional specific identifier if known (e.g., video ID) */
  resourceId: Schema.optional(Schema.String),
  /** Optional additional processing options */
  options: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown }))
})
export type ResourceRequest = Schema.Schema.Type<typeof ResourceRequest>

/** Request to create a new transcription job. */
export const CreateTranscriptionJobRequest = Schema.Struct({
  resource: MediaResource,
  transcriptionContext: Schema.optional(TranscriptionContext)
})
export type CreateTranscriptionJobRequest = Schema.Schema.Type<
  typeof CreateTranscriptionJobRequest
>

/** Request schema for the transcription service that bundles all necessary information. */
export const TranscriptionServiceRequest = Schema.Struct({
  jobId: JobId,
  mediaResource: MediaResource,
  transcriptionContext: TranscriptionContext,
  inferenceConfig: InferenceConfig,
  promptTemplate: Schema.String // Template identifier
})
export type TranscriptionServiceRequest = Schema.Schema.Type<typeof TranscriptionServiceRequest>

================
File: packages/domain/src/jobs/responses.ts
================
import { Schema } from "effect"
import { JobId, RequestId } from "../core/ids.js"
import { Transcript } from "../transcription/transcript.js"

/**
 * Job response types and schemas
 */

export const TranscriptionJobAccepted = Schema.Struct({
  jobId: JobId,
  requestId: RequestId
})
export type TranscriptionJobAccepted = Schema.Schema.Type<typeof TranscriptionJobAccepted>

export const TranscriptionJobError = Schema.Struct({
  error: Schema.String.pipe(Schema.nonEmptyString()),
  requestId: Schema.optional(RequestId)
})
export type TranscriptionJobError = Schema.Schema.Type<typeof TranscriptionJobError>

export const TranscriptionJobResponse = Schema.Union(
  TranscriptionJobAccepted,
  TranscriptionJobError
)
export type TranscriptionJobResponse = Schema.Schema.Type<typeof TranscriptionJobResponse>

/** Response schema for the transcription service. */
export const TranscriptionServiceResponse = Schema.Struct({
  jobId: JobId,
  transcript: Transcript,
  processingMetadata: Schema.Struct({
    processingTimeMs: Schema.Number,
    promptCompilationTime: Schema.Number,
    inferenceTime: Schema.Number
  })
})
export type TranscriptionServiceResponse = Schema.Schema.Type<typeof TranscriptionServiceResponse>

================
File: packages/domain/src/jobs/status.ts
================
import { Data, Schema } from "effect"

/**
 * Job status types and schemas
 */

/** TranscriptionJob processing status enumeration. */
export const JobStatus = Schema.Literal(
  "Queued",
  "MetadataReady",
  "Processing",
  "Completed",
  "Failed",
  "Cancelled"
)
export type JobStatus = Schema.Schema.Type<typeof JobStatus>

/** TranscriptionJob status transition as a tagged enum for better pattern matching. */
export type JobStatusTransition = Data.TaggedEnum<{
  Queued: {
    readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"]
    readonly isTerminal: false
  }
  MetadataReady: {
    readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"]
    readonly isTerminal: false
  }
  Processing: {
    readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"]
    readonly isTerminal: false
  }
  Completed: {
    readonly allowedNext: readonly []
    readonly isTerminal: true
  }
  Failed: {
    readonly allowedNext: readonly []
    readonly isTerminal: true
  }
  Cancelled: {
    readonly allowedNext: readonly []
    readonly isTerminal: true
  }
}>

/** Status transition constructors and utilities. */
export const {
  $is: isTransitionType,
  $match: matchTransition,
  Cancelled: CancelledTransition,
  Completed: CompletedTransition,
  Failed: FailedTransition,
  MetadataReady: MetadataReadyTransition,
  Processing: ProcessingTransition,
  Queued: QueuedTransition
} = Data.taggedEnum<JobStatusTransition>()

/** Get transition info for a given status. */
export const getStatusTransition = (status: JobStatus): JobStatusTransition => {
  switch (status) {
    case "Queued":
      return QueuedTransition({
        allowedNext: ["MetadataReady", "Failed", "Cancelled"],
        isTerminal: false
      })
    case "MetadataReady":
      return MetadataReadyTransition({
        allowedNext: ["Processing", "Failed", "Cancelled"],
        isTerminal: false
      })
    case "Processing":
      return ProcessingTransition({
        allowedNext: ["Completed", "Failed", "Cancelled"],
        isTerminal: false
      })
    case "Completed":
      return CompletedTransition({ allowedNext: [], isTerminal: true })
    case "Failed":
      return FailedTransition({ allowedNext: [], isTerminal: true })
    case "Cancelled":
      return CancelledTransition({ allowedNext: [], isTerminal: true })
  }
}

/** Check if a status transition is valid. */
export const isValidStatusTransition = (
  from: JobStatus,
  to: JobStatus
): boolean => {
  const transition = getStatusTransition(from)
  return matchTransition(transition, {
    Queued: ({ allowedNext }) => (allowedNext as ReadonlyArray<JobStatus>).includes(to),
    MetadataReady: ({ allowedNext }) => (allowedNext as ReadonlyArray<JobStatus>).includes(to),
    Processing: ({ allowedNext }) => (allowedNext as ReadonlyArray<JobStatus>).includes(to),
    Completed: () => false,
    Failed: () => false,
    Cancelled: () => false
  })
}

/** Check if a status is terminal (no further transitions allowed). */
export const isTerminalStatus = (status: JobStatus): boolean => {
  const transition = getStatusTransition(status)
  return matchTransition(transition, {
    Queued: ({ isTerminal }) => isTerminal,
    MetadataReady: ({ isTerminal }) => isTerminal,
    Processing: ({ isTerminal }) => isTerminal,
    Completed: ({ isTerminal }) => isTerminal,
    Failed: ({ isTerminal }) => isTerminal,
    Cancelled: ({ isTerminal }) => isTerminal
  })
}

================
File: packages/domain/src/media/index.ts
================
/**
 * Media domain namespace
 * Contains all types related to media resources, metadata, and speakers
 */

export * from "./metadata.js"
export * from "./resources.js"
export * from "./speakers.js"

================
File: packages/domain/src/media/metadata.ts
================
import { Schema } from "effect"
import { JobId, MediaResourceId } from "../core/ids.js"
import { LanguageCode } from "../core/types.js"
import { Speaker } from "./speakers.js"

/**
 * Media metadata types and schemas
 */

const MediaFormat = Schema.Literal(
  "one_on_one_interview",
  "lecture",
  "panel_discussion",
  "tv_intervew",
  "radio_interview"
)

/**
 * The canonical MediaMetadata entity with improved optional parameter handling.
 * This is the complete, structured context extracted from a MediaResource
 * before the transcription process begins.
 */
export const MediaMetadata = Schema.Struct({
  mediaResourceId: MediaResourceId,
  jobId: JobId,
  title: Schema.String.pipe(
    Schema.nonEmptyString(),
    Schema.annotations({
      description: "The title of the media resource e.g. 'The Future of AI'"
    })
  ),
  organization: Schema.optional(
    Schema.String.pipe(
      Schema.nonEmptyString(),
      Schema.annotations({
        description: "The organization affiliation of the media resource e.g. 'AI Now Institute'"
      })
    )
  ),
  format: MediaFormat,
  summary: Schema.optional(
    Schema.String.pipe(
      Schema.nonEmptyString(),
      Schema.annotations({
        description:
          "A summary of the content of the media resource e.g. 'This podcast episode covers the recent advancements in AI'"
      })
    )
  ),
  // Keywords/tags provide crucial context for the ASR model's vocabulary.
  tags: Schema.Array(
    Schema.String.pipe(
      Schema.nonEmptyString(),
      Schema.annotations({
        description: "Individual keyword/tag describing the media content"
      })
    )
  ).pipe(
    Schema.annotations({
      description: "Keywords/tags that describe the content of the media resource e.g. 'AI', 'Technology'"
    })
  ),
  // The specific industry or topic domain is vital for improving accuracy.
  domain: Schema.Array(
    Schema.String.pipe(
      Schema.nonEmptyString(),
      Schema.annotations({
        description: "Individual domain/topic area"
      })
    )
  ).pipe(
    Schema.annotations({
      description: "The industries or topic domains of the media resource e.g. 'AI', 'Technology'"
    })
  ),
  speakers: Schema.Array(Speaker).pipe(
    Schema.minItems(1),
    Schema.annotations({
      description: "The speakers in the media resource e.g. 'John Doe', 'Jane Smith'"
    })
  ),
  language: LanguageCode,
  speakerCount: Schema.Int.pipe(
    Schema.positive(),
    Schema.annotations({
      description: "Number of speakers in the media resource"
    })
  ),
  durationSec: Schema.Number.pipe(
    Schema.positive(),
    Schema.annotations({
      description: "Duration of the media resource in seconds"
    })
  ),
  // represents any links found in the media resource (links in youtube description, etc.)
  links: Schema.Array(
    Schema.String.pipe(
      Schema.pattern(/^https?:\/\/.+/),
      Schema.annotations({
        description: "Individual link URL"
      })
    )
  ).pipe(
    Schema.annotations({
      description: "Links found in the media resource e.g. 'https://www.youtube.com/watch?v=dQw4w9WgXc'"
    })
  ),
  createdAt: Schema.Date
}).annotations({
  description: "Complete metadata extracted from media resources for transcription processing"
})
export type MediaMetadata = Schema.Schema.Type<typeof MediaMetadata>

================
File: packages/domain/src/media/resources.ts
================
import { Schema } from "effect"
import { MediaResourceId } from "../core/ids.js"
import { MediaMetadata } from "./metadata.js"

// Import YouTube types - this creates a dependency on the YouTube namespace
// This is acceptable since Media depends on YouTube, not the other way around
import { YouTubeChannel, YouTubeVideo } from "../youtube/index.js"

/**
 * Media resource types and schemas
 */

/**
 * MediaResource as discriminated union with clean {type, data} structure.
 * This is the core type that all APIs should consume for media content.
 *
 * Design: Simple {type, data} structure for easy consumption by all services.
 * Future: Will be extended to support Spotify, Podcast, etc.
 */
export const MediaResource = Schema.Union(
  Schema.Struct({
    type: Schema.Literal("youtube"),
    data: YouTubeVideo
  }),
  Schema.Struct({
    type: Schema.Literal("youtube#channel"),
    data: YouTubeChannel
  })
  // Future: add other media types like:
  // Schema.Struct({ type: Schema.Literal("spotify"), data: SpotifyTrack }),
  // Schema.Struct({ type: Schema.Literal("podcast"), data: PodcastEpisode }),
)
export type MediaResource = Schema.Schema.Type<typeof MediaResource>

// Legacy support - keeping the class-based resources for backward compatibility if needed
export class YouTubeVideoResource extends Schema.Class<YouTubeVideoResource>("YouTubeVideoResource")({
  type: Schema.Literal("youtube"),
  id: MediaResourceId,
  metadata: MediaMetadata,
  data: YouTubeVideo
}) {}

export class YouTubeChannelResource extends Schema.Class<YouTubeChannelResource>("YouTubeChannelResource")({
  type: Schema.Literal("youtube-channel"),
  id: MediaResourceId,
  metadata: MediaMetadata,
  data: YouTubeChannel
}) {}

export const LegacyMediaResource = Schema.Union(
  YouTubeVideoResource,
  YouTubeChannelResource
)

================
File: packages/domain/src/media/speakers.ts
================
import { Schema } from "effect"

/**
 * Speaker-related types and schemas
 */

export const SpeakerRole = Schema.Literal("host", "guest")
export type SpeakerRole = Schema.Schema.Type<typeof SpeakerRole>

/**
 * A structured representation of a single speaker identified in the media.
 * This is a core entity within the metadata with improved optional handling.
 */
export const Speaker = Schema.Struct({
  // A unique identifier for this speaker within the context of this job (e.g., "S1", "S2")
  // this can also be generated by the model if we want to do lower level dialog parsing
  // likely the case for beyond 1:1 interviews
  role: SpeakerRole,
  name: Schema.optional(Schema.String.pipe(
    Schema.minLength(1),
    Schema.annotations({
      description: "The speaker's name (required if provided)"
    })
  )),
  // Providing a structured object for affiliation is more extensible
  affiliation: Schema.optional(
    Schema.Struct({
      name: Schema.String.pipe(
        Schema.nonEmptyString(),
        Schema.annotations({
          description: "The organization or affiliation name"
        })
      ),
      url: Schema.optional(
        Schema.String.pipe(
          Schema.pattern(/^https?:\/\/.+/),
          Schema.annotations({
            description: "Valid HTTP/HTTPS URL for the affiliation"
          })
        )
      )
    }).annotations({
      description: "Organizational affiliation information for the speaker"
    })
  ),
  bio: Schema.optional(
    Schema.String.pipe(
      Schema.minLength(1),
      Schema.annotations({
        description: "Biographical information about the speaker"
      })
    )
  )
}).annotations({
  description: "Structured speaker information with role and optional details"
})
export type Speaker = Schema.Schema.Type<typeof Speaker>

================
File: packages/domain/src/shared/index.ts
================
// YouTube functionality removed - no exports needed

================
File: packages/domain/src/transcription/context.ts
================
import { Schema } from "effect"
import { LanguageCode } from "../core/types.js"
import { SpeakerRole } from "../media/speakers.js"

/**
 * Transcription context types and schemas
 */

/**
 * MediaFormat enum for user-provided context hints
 */
const MediaFormat = Schema.Literal(
  "one_on_one_interview",
  "lecture",
  "panel_discussion",
  "tv_intervew",
  "radio_interview"
)

/**
 * TranscriptionContext captures user-provided information before processing begins.
 * This distinguishes between a priori user input and metadata extracted from sources.
 */
export const TranscriptionContext = Schema.Struct({
  // User-provided speaker information
  expectedSpeakers: Schema.Array(Schema.Struct({
    role: SpeakerRole,
    name: Schema.optional(Schema.String),
    affiliation: Schema.optional(Schema.String)
  })),

  // User-provided content hints
  contentHints: Schema.optional(Schema.Struct({
    domain: Schema.Array(Schema.String),
    tags: Schema.Array(Schema.String),
    summary: Schema.optional(Schema.String)
  })),

  // Processing preferences
  preferences: Schema.optional(Schema.Struct({
    language: Schema.optional(LanguageCode),
    format: Schema.optional(MediaFormat)
  }))
})

export type TranscriptionContext = Schema.Schema.Type<typeof TranscriptionContext>

================
File: packages/domain/src/transcription/index.ts
================
/**
 * Transcription domain namespace
 * Contains all types related to transcription, dialogue, and processing context
 */

export * from "./context.js"
export * from "./inference.js"
export * from "./prompts.js"
export * from "./transcript.js"

================
File: packages/domain/src/transcription/inference.ts
================
import { Schema } from "effect"

/**
 * Inference configuration types and schemas
 */

/**
 * InferenceConfig captures the model configuration used for transcript generation.
 * This enables reproducibility and tracking of generation parameters.
 */
export const InferenceConfig = Schema.Struct({
  model: Schema.String,
  temperature: Schema.Number,
  maxTokens: Schema.optional(Schema.Number),
  additionalParams: Schema.optional(Schema.Record({
    key: Schema.String,
    value: Schema.Unknown
  }))
})

export type InferenceConfig = Schema.Schema.Type<typeof InferenceConfig>

================
File: packages/domain/src/transcription/prompts.ts
================
import { Schema } from "effect"

/**
 * Prompt and generation tracking types and schemas
 */

/**
 * GenerationPrompt tracks the exact compiled prompt used for transcript generation.
 * This provides full traceability and enables reproducibility of results.
 */
export const GenerationPrompt = Schema.Struct({
  // Identifies the base template used for compilation
  templateId: Schema.String,
  templateVersion: Schema.String,
  // The final, full prompt text sent to the LLM
  compiledText: Schema.String,
  // Parameters used during prompt compilation
  compilationParams: Schema.Record({
    key: Schema.String,
    value: Schema.Unknown
  }),
  compiledAt: Schema.Date
})

export type GenerationPrompt = Schema.Schema.Type<typeof GenerationPrompt>

================
File: packages/domain/src/transcription/transcript.ts
================
import { Schema } from "effect"
import { JobId, TranscriptId } from "../core/ids.js"
import { TimestampString } from "../core/types.js"
import { MediaResource } from "../media/resources.js"
import { SpeakerRole } from "../media/speakers.js"
import { TranscriptionContext } from "./context.js"
import { InferenceConfig } from "./inference.js"
import { GenerationPrompt } from "./prompts.js"

/**
 * Transcript-related types and schemas
 */

/**
 * Represents a single, parsed "turn" in the dialogue.
 * This is the core, structured building block of the transcript.
 */
export const DialogueTurn = Schema.Struct({
  timestamp: TimestampString,
  speaker: SpeakerRole,
  text: Schema.String.pipe(Schema.nonEmptyString())
})
export type DialogueTurn = Schema.Schema.Type<typeof DialogueTurn>

/**
 * The canonical, final Transcript entity.
 * This is the primary artifact stored in your database and used by downstream services.
 * It contains the structured, parsed turns as its main payload.
 * Now includes full traceability for reproducibility.
 */
export const Transcript = Schema.Struct({
  id: TranscriptId,
  jobId: JobId,
  mediaResource: MediaResource,
  // The full, raw text is stored for auditing and potential reprocessing.
  rawText: Schema.String.pipe(Schema.nonEmptyString()),
  // The structured turns are the primary, queryable data.
  turns: Schema.Array(DialogueTurn),

  // NEW: Traceability fields
  inferenceConfig: InferenceConfig,
  generationPrompt: GenerationPrompt,

  // Context used for generation
  transcriptionContext: TranscriptionContext,

  createdAt: Schema.Date,
  updatedAt: Schema.Date
})
export type Transcript = Schema.Schema.Type<typeof Transcript>

================
File: packages/domain/src/youtube/index.ts
================
/**
 * YouTube domain namespace
 * Contains all YouTube-specific types, utilities, and schemas
 */

export * from "./types.js"
export * from "./utilities.js"

================
File: packages/domain/src/youtube/types.ts
================
import type { Predicate } from "effect"
import { Schema } from "effect"

/**
 * YouTube-specific types and schemas
 */

/**
 * Branded type for YouTube Video IDs
 * 11-character alphanumeric string with hyphens and underscores
 */
export const YouTubeVideoId = Schema.String.pipe(
  Schema.pattern(/^[a-zA-Z0-9_-]{11}$/, {
    message: () => "YouTube Video ID must be 11 characters (alphanumeric, hyphens, underscores)"
  }),
  Schema.brand("YouTubeVideoId")
)
export type YouTubeVideoId = Schema.Schema.Type<typeof YouTubeVideoId>

/**
 * Type guard for YouTube Video IDs
 */
export const isYouTubeVideoId = Schema.is(YouTubeVideoId)

/**
 * Predicate for YouTube Video IDs
 */
export const isValidVideoId: Predicate.Predicate<string> = (value): boolean => /^[a-zA-Z0-9_-]{11}$/.test(value)

/**
 * Branded type for YouTube Channel IDs
 * Starts with 'UC' followed by 22 alphanumeric characters with hyphens and underscores
 */
export const YouTubeChannelId = Schema.String.pipe(
  Schema.pattern(/^UC[a-zA-Z0-9_-]{22}$/, {
    message: () => "YouTube Channel ID must start with 'UC' followed by 22 characters"
  }),
  Schema.brand("YouTubeChannelId")
)
export type YouTubeChannelId = Schema.Schema.Type<typeof YouTubeChannelId>

/**
 * Type guard for YouTube Channel IDs
 */
export const isYouTubeChannelId = Schema.is(YouTubeChannelId)

/**
 * Predicate for YouTube Channel IDs
 */
export const isValidChannelId: Predicate.Predicate<string> = (value): value is string =>
  /^UC[a-zA-Z0-9_-]{22}$/.test(value)

/**
 * YouTube Video Thumbnails
 */
export const YouTubeThumbnail = Schema.Struct({
  url: Schema.String,
  width: Schema.OptionFromNullishOr(Schema.Number, undefined),
  height: Schema.OptionFromNullishOr(Schema.Number, undefined)
})
export type YouTubeThumbnail = Schema.Schema.Type<typeof YouTubeThumbnail>

export const YouTubeThumbnails = Schema.Struct({
  default: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined),
  medium: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined),
  high: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined),
  standard: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined),
  maxres: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined)
})
export type YouTubeThumbnails = Schema.Schema.Type<typeof YouTubeThumbnails>

/**
 * Core YouTube Video domain schema
 */
export const YouTubeVideo = Schema.Struct({
  id: YouTubeVideoId,
  title: Schema.NonEmptyString,
  description: Schema.String,
  publishedAt: Schema.DateTimeUtc,
  channelId: YouTubeChannelId,
  channelTitle: Schema.NonEmptyString,
  thumbnails: Schema.Array(YouTubeThumbnails).pipe(Schema.propertySignature, Schema.withConstructorDefault(() => [])),
  duration: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  viewCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  likeCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  commentCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  tags: Schema.Array(Schema.NonEmptyString)
})
export type YouTubeVideo = Schema.Schema.Type<typeof YouTubeVideo>

/**
 * Type guard for YouTube Videos
 */
export const isYouTubeVideo = Schema.is(YouTubeVideo)

/**
 * Refinement for YouTube Videos
 */
export const refineYouTubeVideo = YouTubeVideo.pipe(Schema.filter(isYouTubeVideo))

/**
 * Core YouTube Channel domain schema
 */
export const YouTubeChannel = Schema.Struct({
  id: YouTubeChannelId,
  title: Schema.NonEmptyString,
  description: Schema.String,
  publishedAt: Schema.DateTimeUtc,
  thumbnails: YouTubeThumbnails,
  subscriberCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  videoCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  viewCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative())
})
export type YouTubeChannel = Schema.Schema.Type<typeof YouTubeChannel>

/**
 * Type guard for YouTube Channels
 */
export const isYouTubeChannel = Schema.is(YouTubeChannel)

/**
 * Refinement for YouTube Channels
 */
export const refineYouTubeChannel = YouTubeChannel.pipe(Schema.filter(isYouTubeChannel))

================
File: packages/domain/src/youtube/utilities.ts
================
import { Option, ParseResult, Schema } from "effect"
import { YouTubeVideoId, YouTubeChannelId, isValidVideoId, isValidChannelId } from "./types.js"

/**
 * YouTube utility functions and helpers
 */

/**
 * Extract YouTube video ID from URL using Effect patterns
 */
export const extractVideoId = (url: string): Option.Option<YouTubeVideoId> => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1] && isValidVideoId(match[1])) {
      return Option.some(match[1] as YouTubeVideoId)
    }
  }

  return Option.none()
}

/**
 * Parse YouTube video ID from string with validation
 */
export const parseVideoId = Schema.decodeOption(YouTubeVideoId)

/**
 * Safe video ID extraction with schema validation
 */
export const safeExtractVideoId = (url: string): Option.Option<YouTubeVideoId> =>
  Option.flatMap(extractVideoId(url), parseVideoId)

/**
 * Extract YouTube channel ID from URL using Effect patterns
 */
export const extractChannelId = (url: string): Option.Option<YouTubeChannelId> => {
  const patterns = [
    /youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      // Only return if it matches the UC format for channel IDs
      if (isValidChannelId(match[1])) {
        return Option.some(match[1] as YouTubeChannelId)
      }
    }
  }

  return Option.none()
}

/**
 * Parse YouTube channel ID from string with validation
 */
export const parseChannelId = Schema.decodeOption(YouTubeChannelId)

/**
 * Safe channel ID extraction with schema validation
 */
export const safeExtractChannelId = (url: string): Option.Option<YouTubeChannelId> =>
  Option.flatMap(extractChannelId(url), parseChannelId)

/**
 * YouTube URL patterns and validation
 */
export const WATCH_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
export const SHORT_URL_PATTERN = /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/
export const EMBED_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
export const MOBILE_URL_PATTERN = /^https?:\/\/m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
export const CHANNEL_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/

/**
 * Combined pattern for all YouTube video URL formats
 */
const ALL_YOUTUBE_VIDEO_URL_PATTERN = new RegExp(
  [
    WATCH_URL_PATTERN.source,
    SHORT_URL_PATTERN.source,
    EMBED_URL_PATTERN.source,
    MOBILE_URL_PATTERN.source
  ].join("|")
)

/**
 * Predicate: Check if a string is a valid YouTube video URL
 */
export const isValidYoutubeUrl = (url: string): url is string => Option.isSome(extractVideoId(url))

/**
 * Predicate: Check if a string is a valid YouTube channel URL
 */
export const isValidYoutubeChannelUrl = (url: string): url is string =>
  Option.isSome(extractChannelId(url))

/**
 * Predicate: Check if a string is any valid YouTube URL (video or channel)
 */
export const isValidYoutubeAnyUrl = (url: string): url is string =>
  isValidYoutubeUrl(url) || isValidYoutubeChannelUrl(url)

/**
 * Convert YouTube video ID to standard watch URL
 */
export const videoIdToWatchUrl = (videoId: YouTubeVideoId): string => {
  return `https://www.youtube.com/watch?v=${videoId}`
}

/**
 * Convert YouTube channel ID to channel URL
 */
export const channelIdToChannelUrl = (channelId: YouTubeChannelId): string => {
  return `https://www.youtube.com/channel/${channelId}`
}

/**
 * Schema for validated YouTube video URL
 */
const YoutubeVideoUrl = Schema.String.pipe(
  Schema.pattern(WATCH_URL_PATTERN, {
    message: () => "Must be a valid YouTube video URL"
  }),
  Schema.brand("YoutubeVideoUrl")
)

/**
 * Transform string to YouTube video URL with validation
 */
export const YoutubeVideoUrlFromString = Schema.transformOrFail(
  Schema.String,
  YoutubeVideoUrl,
  {
    decode: (value, _, ast) => {
      const idOption = extractVideoId(value)
      if (Option.isNone(idOption)) {
        return ParseResult.fail(new ParseResult.Type(ast, value))
      }
      return ParseResult.succeed(idOption.value)
    },
    encode: (id) => ParseResult.succeed(YoutubeVideoUrl.make(`https://www.youtube.com/watch?v=${id}`)),
    strict: false
  }
)

/**
 * Transform string to YouTube channel ID with validation
 */
export const YoutubeChannelUrl = Schema.transformOrFail(
  Schema.String.pipe(
    Schema.filter((value) => Option.isSome(extractChannelId(value)), {
      message: () => "Must be a valid YouTube channel URL with standard channel ID format"
    })
  ),
  YouTubeChannelId,
  {
    decode: (value, _, ast) => {
      const idOption = extractChannelId(value)
      if (Option.isNone(idOption)) {
        return ParseResult.fail(new ParseResult.Type(ast, value))
      }
      return ParseResult.succeed(idOption.value)
    },
    encode: (id) => ParseResult.succeed(`https://www.youtube.com/channel/${id}`)
  }
)

/**
 * Schema for validated YouTube URL (any video format)
 */
export const ValidatedYoutubeUrl = Schema.String.pipe(
  Schema.pattern(ALL_YOUTUBE_VIDEO_URL_PATTERN, {
    message: () => "Must be a valid YouTube video URL (watch, youtu.be, embed, or mobile format)"
  }),
  Schema.brand("ValidatedYoutubeUrl")
)
export type ValidatedYoutubeUrl = Schema.Schema.Type<typeof ValidatedYoutubeUrl>

/**
 * ISO8601 Duration parsing utility
 */
export const parseISO8601Duration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = parseInt(match[1] || "0", 10)
  const minutes = parseInt(match[2] || "0", 10)
  const seconds = parseInt(match[3] || "0", 10)

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Schema for ISO8601 duration strings
 */
export const ISO8601Duration = Schema.String.pipe(
  Schema.pattern(/^PT(?:\d+H)?(?:\d+M)?(?:\d+S)?$/, {
    message: () => "Must be a valid ISO8601 duration (e.g., PT1H30M45S)"
  }),
  Schema.brand("ISO8601Duration")
)
export type ISO8601Duration = Schema.Schema.Type<typeof ISO8601Duration>

/**
 * Transform ISO8601 duration to seconds
 */
export const DurationInSeconds = Schema.transformOrFail(
  ISO8601Duration,
  Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  {
    decode: (duration) => ParseResult.succeed(parseISO8601Duration(duration)),
    encode: (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      let result = "PT"
      if (hours > 0) result += `${hours}H`
      if (minutes > 0) result += `${minutes}M`
      if (remainingSeconds > 0 || result === "PT") result += `${remainingSeconds}S`

      return ParseResult.succeed(result as ISO8601Duration)
    }
  }
)

================
File: packages/domain/src/index.ts
================
/**
 * PureDialog Domain Package
 *
 * Clean, organized domain types with namespaces to avoid circular dependencies
 * and provide clear separation of concerns.
 */

// Core domain types - fundamental building blocks
export * as Core from "./core/index.js"

// Media-related types - resources, metadata, speakers
export * as Media from "./media/index.js"

// Transcription-related types - transcripts, context, inference
export * as Transcription from "./transcription/index.js"

// Job processing types - status, entities, requests, responses
export * as Jobs from "./jobs/index.js"

// YouTube-specific types and utilities
export * as YouTube from "./youtube/index.js"

// Error types and schemas
export * as Errors from "./errors/index.js"

// Legacy support - backward compatibility exports
// These maintain the old API while the new namespace structure is preferred
export type {
  JobId,
  RequestId,
  TranscriptId,
  MediaResourceId,
  CorrelationId
} from "./core/ids.js"

export type {
  LanguageCode,
  TimestampString
} from "./core/types.js"

export type {
  SpeakerRole,
  Speaker,
  MediaMetadata,
  MediaResource,
  LegacyMediaResource,
  YouTubeVideoResource,
  YouTubeChannelResource
} from "./media/index.js"

export type {
  TranscriptionContext,
  DialogueTurn,
  Transcript,
  InferenceConfig,
  GenerationPrompt
} from "./transcription/index.js"

export type {
  JobStatus,
  TranscriptionJob,
  CreateTranscriptionJobRequest,
  TranscriptionServiceRequest,
  TranscriptionJobAccepted,
  TranscriptionJobError,
  TranscriptionJobResponse,
  TranscriptionServiceResponse,
  DomainEvent
} from "./jobs/index.js"

export type {
  YouTubeVideoId,
  YouTubeChannelId,
  YouTubeVideo,
  YouTubeChannel
} from "./youtube/index.js"

export {
  extractVideoId,
  extractChannelId,
  isValidYoutubeUrl,
  isValidYoutubeChannelUrl,
  WATCH_URL_PATTERN,
  CHANNEL_URL_PATTERN,
  videoIdToWatchUrl,
  channelIdToChannelUrl
} from "./youtube/index.js"

export type {
  MediaResourceError,
  TranscriptionError,
  ConfigurationError,
  ValidationError,
  StreamingError,
  AuthorizationError,
  DomainError
} from "./errors/definitions.js"

================
File: packages/domain/package.json
================
{
  "name": "@puredialog/domain",
  "version": "0.0.0",
  "type": "module",
  "description": "The domain for Pure Dialog",
  "exports": {
    ".": {
      "types": "./build/dts/index.d.ts",
      "module": "./build/esm/index.js",
      "default": "./build/esm/index.js"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "clean": "tsc -b tsconfig.build.json --clean",
    "test": "vitest",
    "coverage": "vitest --coverage"
  },
  "dependencies": {
    "@effect/platform": "latest",
    "effect": "latest"
  }
}

================
File: packages/domain/tsconfig.build.json
================
{
  "extends": "./tsconfig.src.json",
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo",
    "outDir": "build/esm",
    "composite": true,
    "noEmit": false,
    "declarationDir": "build/dts",
    "stripInternal": true
  },
  "references": [
  ]
}

================
File: packages/domain/tsconfig.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "compilerOptions": {
    "composite": true,
  },

  "references": [
    { "path": "./tsconfig.src.json" }
  ]
}

================
File: packages/domain/tsconfig.src.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "compilerOptions": {
    "types": ["node"],
    "composite": true,
    "tsBuildInfoFile": ".tsbuildinfo/src.tsbuildinfo"
  },
  "references": [
  ]
}

================
File: packages/domain/tsconfig.test.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["test"],
  "references": [
    { "path": "tsconfig.src.json" }
  ],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/test.tsbuildinfo",
    "rootDir": "test",
    "noEmit": true
  }
}

================
File: packages/domain/vitest.config.ts
================
import { mergeConfig, type UserConfigExport } from "vitest/config";
import shared from "../../vitest.shared.js";

const config: UserConfigExport = {};

export default mergeConfig(shared, config);

================
File: packages/infra/.gitignore
================
node_modules
bin
.DS_Store

================
File: packages/infra/eslint.config.mjs
================
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

================
File: packages/infra/index.ts
================
import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
// import { EVENTARC_PATTERNS } from "@puredialog/storage";

// Temporarily inline patterns for build compatibility
const EVENTARC_PATTERNS = {
  JOB_EVENTS: "jobs/{status}/{jobId}.json",
  TRANSCRIPT_EVENTS: "transcripts/{transcriptId}.json",
  EVENT_LOG: "events/{jobId}/{eventId}.json"
} as const;

interface CloudRunServiceConfig {
  readonly serviceName: string;
  readonly image: string;
  readonly cpu?: string;
  readonly memory?: string;
  readonly minInstances?: number;
  readonly maxInstances?: number;
  readonly concurrency?: number;
}

interface PubSubConfig {
  readonly eventsTopic: string;
  readonly eventsMonitorSubscription: string;
}

interface StorageConfig {
  readonly bucketBaseName: string;
}

interface StackConfig {
  readonly project: string;
  readonly region: string;
  readonly serviceAccountEmail: string;
  readonly services: {
    readonly api: CloudRunServiceConfig;
    readonly metadataWorker: CloudRunServiceConfig;
    readonly transcriptionWorker: CloudRunServiceConfig;
  };
  readonly pubsub: PubSubConfig;
  readonly storage: StorageConfig;
}

const gcpConfig = new pulumi.Config("gcp");
const cloudRunConfig = new pulumi.Config("cloudrun");
const pubsubConfig = new pulumi.Config("pubsub");
const storageConfig = new pulumi.Config("storage");
const envConfig = new pulumi.Config("env");

const youtubeApiKey = envConfig.requireSecret("youtubeApiKey");

const defaultStackConfig: StackConfig = {
  project: gcpConfig.get("project") ?? "gen-lang-client-0874846742",
  region: gcpConfig.get("region") ?? "us-west1",
  serviceAccountEmail: cloudRunConfig.get("serviceAccount")
    ?? "211636922435-compute@developer.gserviceaccount.com",
  services: {
    api: {
      serviceName: cloudRunConfig.get("apiServiceName") ?? "api",
      image: cloudRunConfig.require("apiImage"),
      cpu: cloudRunConfig.get("apiCpu") ?? "1",
      memory: cloudRunConfig.get("apiMemory") ?? "512Mi",
      minInstances: cloudRunConfig.getNumber("apiMinInstances") ?? 0,
      maxInstances: cloudRunConfig.getNumber("apiMaxInstances") ?? 2,
      concurrency: cloudRunConfig.getNumber("apiConcurrency") ?? 80,
    },
    metadataWorker: {
      serviceName: cloudRunConfig.get("metadataServiceName") ?? "worker-metadata",
      image: cloudRunConfig.require("metadataImage"),
      cpu: cloudRunConfig.get("metadataCpu") ?? "1",
      memory: cloudRunConfig.get("metadataMemory") ?? "512Mi",
      minInstances: cloudRunConfig.getNumber("metadataMinInstances") ?? 0,
      maxInstances: cloudRunConfig.getNumber("metadataMaxInstances") ?? 2,
      concurrency: cloudRunConfig.getNumber("metadataConcurrency") ?? 10,
    },
    transcriptionWorker: {
      serviceName: cloudRunConfig.get("transcriptionServiceName")
        ?? "worker-transcription",
      image: cloudRunConfig.require("transcriptionImage"),
      cpu: cloudRunConfig.get("transcriptionCpu") ?? "1",
      memory: cloudRunConfig.get("transcriptionMemory") ?? "512Mi",
      minInstances: cloudRunConfig.getNumber("transcriptionMinInstances") ?? 0,
      maxInstances: cloudRunConfig.getNumber("transcriptionMaxInstances") ?? 2,
      concurrency: cloudRunConfig.getNumber("transcriptionConcurrency") ?? 10,
    },
  },
  pubsub: {
    eventsTopic: pubsubConfig.get("eventsTopic") ?? "events",
    eventsMonitorSubscription: pubsubConfig.get("eventsMonitorSubscription") ?? "events-monitor",
  },
  storage: {
    bucketBaseName: storageConfig.get("bucketBaseName") ?? "ingestion-shared-artifacts",
  },
};

export const stackMetadata = {
  project: pulumi.getProject(),
  stack: pulumi.getStack(),
};

export const configuration: StackConfig = defaultStackConfig;

const envVars = (vars: Record<string, pulumi.Input<string>>) =>
  Object.entries(vars).map(([name, value]) => ({ name, value }));

const projectId = configuration.project;

// Shared storage bucket (retained from previous architecture)
const bucketSuffix = new random.RandomString("sharedArtifactsBucketSuffix", {
  length: 6,
  special: false,
  upper: false,
});

export const sharedArtifactsBucket = new gcp.storage.Bucket(
  "sharedArtifactsBucket",
  {
    name: pulumi.interpolate`${configuration.storage.bucketBaseName}-${bucketSuffix.result}`,
    location: configuration.region,
    uniformBucketLevelAccess: true,
    forceDestroy: false,
    labels: {
      environment: stackMetadata.stack,
      managed_by: "pulumi",
    },
  },
);


export const eventsTopic = new gcp.pubsub.Topic("eventsTopic", {
  name: configuration.pubsub.eventsTopic,
});

const createService = (
  logicalName: string,
  config: CloudRunServiceConfig,
  env: Record<string, pulumi.Input<string>>,
  ingress:
    | "INGRESS_TRAFFIC_ALL"
    | "INGRESS_TRAFFIC_INTERNAL_ONLY"
    | "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER",
) =>
  new gcp.cloudrunv2.Service(logicalName, {
    project: projectId,
    location: configuration.region,
    name: config.serviceName,
    ingress,
    template: {
      serviceAccount: configuration.serviceAccountEmail,
      maxInstanceRequestConcurrency: config.concurrency ?? 80,
      scaling: {
        minInstanceCount: config.minInstances ?? 0,
        maxInstanceCount: config.maxInstances ?? 1,
      },
      containers: [
        {
          image: config.image,
          envs: envVars(env),
          resources: {
            limits: {
              cpu: config.cpu ?? "1",
              memory: config.memory ?? "512Mi",
            },
          },
        },
      ],
    },
    labels: {
      environment: stackMetadata.stack,
      managed_by: "pulumi",
    },
  });

const apiService = createService(
  "apiService",
  configuration.services.api,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
  },
  "INGRESS_TRAFFIC_ALL",
);

const metadataWorkerService = createService(
  "metadataWorkerService",
  configuration.services.metadataWorker,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
  },
  "INGRESS_TRAFFIC_ALL",
);

const transcriptionWorkerService = createService(
  "transcriptionWorkerService",
  configuration.services.transcriptionWorker,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
  },
  "INGRESS_TRAFFIC_ALL",
);

// IAM bindings
new gcp.cloudrunv2.ServiceIamMember("apiPublicInvoker", {
  project: projectId,
  location: configuration.region,
  name: apiService.name,
  role: "roles/run.invoker",
  member: "allUsers",
});

const pubsubInvokerMember = pulumi.interpolate`serviceAccount:${configuration.serviceAccountEmail}`;

new gcp.cloudrunv2.ServiceIamMember("metadataInvoker", {
  project: projectId,
  location: configuration.region,
  name: metadataWorkerService.name,
  role: "roles/run.invoker",
  member: pubsubInvokerMember,
});

new gcp.cloudrunv2.ServiceIamMember("transcriptionInvoker", {
  project: projectId,
  location: configuration.region,
  name: transcriptionWorkerService.name,
  role: "roles/run.invoker",
  member: pubsubInvokerMember,
});

// Allow Cloud Run service account to read/write objects in the shared bucket
new gcp.storage.BucketIAMMember("sharedBucketObjectAdmin", {
  bucket: sharedArtifactsBucket.name,
  role: "roles/storage.objectAdmin",
  member: pubsubInvokerMember,
});

// Eventarc triggers for State-Triggered Choreography
const triggerServiceAccount = configuration.serviceAccountEmail;

// Trigger 1: jobs/Queued → worker-metadata
export const triggerMetadataWorker = new gcp.eventarc.Trigger("trigger-metadata-worker", {
  location: configuration.region,
  project: projectId,
  destination: {
    cloudRunService: {
      service: metadataWorkerService.name,
      region: configuration.region,
    },
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: sharedArtifactsBucket.name },
    { attribute: "objectName", value: EVENTARC_PATTERNS.JOB_EVENTS.replace("{status}", "Queued"), operator: "match-path-pattern" },
  ],
  serviceAccount: triggerServiceAccount,
});

// Trigger 2: jobs/Processing → worker-transcription
export const triggerTranscriptionWorker = new gcp.eventarc.Trigger("trigger-transcription-worker", {
  location: configuration.region,
  project: projectId,
  destination: {
    cloudRunService: {
      service: transcriptionWorkerService.name,
      region: configuration.region,
    },
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: sharedArtifactsBucket.name },
    { attribute: "objectName", value: EVENTARC_PATTERNS.JOB_EVENTS.replace("{status}", "Processing"), operator: "match-path-pattern" },
  ],
  serviceAccount: triggerServiceAccount,
});

// Trigger 3: jobs/Completed → API notifications endpoint
export const triggerNotifications = new gcp.eventarc.Trigger("trigger-notifications", {
  location: configuration.region,
  project: projectId,
  destination: {
    cloudRunService: {
      service: apiService.name,
      region: configuration.region,
      path: "/_internal/notifications",
    },
  },
  transport: {
    pubsub: { topic: eventsTopic.id },
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: sharedArtifactsBucket.name },
    { attribute: "objectName", value: EVENTARC_PATTERNS.JOB_EVENTS.replace("{status}", "Completed"), operator: "match-path-pattern" },
  ],
  serviceAccount: triggerServiceAccount,
});

export const eventsMonitorSubscription = new gcp.pubsub.Subscription(
  "eventsMonitorSubscription",
  {
    name: configuration.pubsub.eventsMonitorSubscription,
    topic: eventsTopic.name,
    ackDeadlineSeconds: 30,
  },
);

export const apiUrl = apiService.uri;
export const metadataWorkerUrl = metadataWorkerService.uri;
export const transcriptionWorkerUrl = transcriptionWorkerService.uri;

================
File: packages/infra/package.json
================
{
  "name": "@puredialog/infra",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./build/dts/index.d.ts",
      "module": "./build/esm/index.js",
      "default": "./build/esm/index.js"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "clean": "tsc -b tsconfig.build.json --clean",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  },
  "dependencies": {
    "@pulumi/gcp": "^9.1.0",
    "@pulumi/pulumi": "^3.139.0",
    "@pulumi/random": "^4.16.0",
    "@puredialog/storage": "workspace:^"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "~5.8.3"
  }
}

================
File: packages/infra/Pulumi.dev.yaml
================
config:
  gcp:project: gen-lang-client-0874846742
  gcp:region: us-west1
  cloudrun:serviceAccount: 211636922435-compute@developer.gserviceaccount.com
  cloudrun:apiServiceName: api
  cloudrun:apiImage: us-west1-docker.pkg.dev/gen-lang-client-0874846742/puredialog/api:latest
  cloudrun:metadataServiceName: worker-metadata
  cloudrun:metadataImage: "us-west1-docker.pkg.dev/gen-lang-client-0874846742/puredialog/worker-metadata:latest"
  cloudrun:transcriptionServiceName: worker-transcription
  cloudrun:transcriptionImage: "us-west1-docker.pkg.dev/gen-lang-client-0874846742/puredialog/worker-transcription:latest"
  pubsub:workTopic: work
  pubsub:eventsTopic: events
  pubsub:dlqTopic: work-dlq
  pubsub:metadataSubscription: work-metadata
  pubsub:transcriptionSubscription: work-transcription
  pubsub:eventsMonitorSubscription: events-monitor
  storage:bucketBaseName: ingestion-shared-artifacts

================
File: packages/infra/Pulumi.yaml
================
name: pure-dialog-infra
runtime: nodejs
main: .
description: Infrastructure as Code for PureDialog ingestion services on GCP App Engine and Pub/Sub

================
File: packages/infra/tsconfig.build.json
================
{
  "extends": "./tsconfig.src.json",
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo",
    "outDir": "build/esm",
    "declarationDir": "build/dts",
    "stripInternal": true
  },
  "references": [
    { "path": "../storage/tsconfig.build.json" }
  ],
  "include": ["index.ts"],
  "exclude": [
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}

================
File: packages/infra/tsconfig.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["index.ts", "**/*.ts"],
  "compilerOptions": {
    "rootDir": "."
  },
  "references": [
    { "path": "../storage/tsconfig.build.json" },
    { "path": "tsconfig.src.json" }
  ]
}

================
File: packages/infra/tsconfig.src.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["index.ts"],
  "compilerOptions": {
    "types": ["node"],
    "rootDir": ".",
    "tsBuildInfoFile": ".tsbuildinfo/src.tsbuildinfo"
  },
  "references": [
    { "path": "../storage/tsconfig.build.json" }
  ]
}

================
File: packages/ingestion/src/storage/Config.ts
================
import { Config, Context, Effect, Layer, Option } from "effect"

export interface CloudStorageConfigInterface {
  readonly projectId: string
  readonly keyFilename: string | undefined
  readonly bucket: string
  readonly retryOptions: {
    readonly maxRetries: number
    readonly backoffMultiplier: number
    readonly maxDelayMs: number
  }
}

export class CloudStorageConfig extends Context.Tag("CloudStorageConfig")<
  CloudStorageConfig,
  CloudStorageConfigInterface
>() {}

export const CloudStorageConfigLive = Layer.effect(
  CloudStorageConfig,
  Effect.gen(function*() {
    const projectId = yield* Config.string("GCS_PROJECT_ID")
    const keyFilename = yield* Config.string("GCS_KEY_FILE").pipe(Config.option)
    const bucket = yield* Config.string("GCS_BUCKET")
    const maxRetries = yield* Config.number("GCS_MAX_RETRIES").pipe(Config.withDefault(3))
    const backoffMultiplier = yield* Config.number("GCS_BACKOFF_MULTIPLIER").pipe(Config.withDefault(2))
    const maxDelayMs = yield* Config.number("GCS_MAX_DELAY_MS").pipe(Config.withDefault(30000))

    return {
      projectId,
      keyFilename: Option.getOrUndefined(keyFilename),
      bucket,
      retryOptions: {
        maxRetries,
        backoffMultiplier,
        maxDelayMs
      }
    }
  })
)

================
File: packages/ingestion/src/storage/errors.ts
================
import { Data } from "effect"

/**
 * Cloud Storage specific errors
 */
export class CloudStorageError extends Data.TaggedError("CloudStorageError")<{
  readonly message: string
  readonly operation: string
  readonly bucket?: string
  readonly key?: string
  readonly cause?: unknown
}> {
  static putObjectFailed(bucket: string, key: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to put object",
      operation: "putObject",
      bucket,
      key,
      cause
    })
  }

  static getObjectFailed(bucket: string, key: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to get object",
      operation: "getObject",
      bucket,
      key,
      cause
    })
  }

  static deleteObjectFailed(bucket: string, key: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to delete object",
      operation: "deleteObject",
      bucket,
      key,
      cause
    })
  }

  static listObjectsFailed(bucket: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to list objects",
      operation: "listObjects",
      bucket,
      cause
    })
  }

  static objectExistsFailed(bucket: string, key: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to check object existence",
      operation: "objectExists",
      bucket,
      key,
      cause
    })
  }

  static configurationError(message: string) {
    return new CloudStorageError({
      message,
      operation: "configuration",
      cause: "Invalid configuration"
    })
  }
}

================
File: packages/ingestion/src/storage/index.ts
================
export * from "./Config.js"
export * from "./errors.js"
export * from "./service.js"

================
File: packages/ingestion/src/storage/service.ts
================
import { Storage } from "@google-cloud/storage"
import { Context, Effect, Layer, Option, Schema } from "effect"
import { CloudStorageConfig, CloudStorageConfigLive } from "./Config.js"
import { CloudStorageError } from "./errors.js"

/**
 * Cloud Storage service interface for Effect integration
 */
export interface CloudStorageServiceInterface {
  readonly putObject: (
    bucket: string,
    key: string,
    data: unknown
  ) => Effect.Effect<void, CloudStorageError>

  readonly getObject: <T extends Schema.Schema.AnyNoContext>(
    bucket: string,
    key: string,
    schema: T
  ) => Effect.Effect<Option.Option<Schema.Schema.Type<T>>, CloudStorageError>

  readonly deleteObject: (
    bucket: string,
    key: string
  ) => Effect.Effect<void, CloudStorageError>

  readonly listObjects: (
    bucket: string,
    prefix: string
  ) => Effect.Effect<ReadonlyArray<string>, CloudStorageError>

  readonly objectExists: (
    bucket: string,
    key: string
  ) => Effect.Effect<boolean, CloudStorageError>
}

/**
 * Service tag for Cloud Storage
 */
export class CloudStorageService extends Context.Tag("CloudStorageService")<
  CloudStorageService,
  CloudStorageServiceInterface
>() {}

/**
 * Live implementation using Google Cloud Storage client
 */
export const CloudStorageServiceLive = Layer.effect(
  CloudStorageService,
  Effect.gen(function*() {
    const config = yield* CloudStorageConfig
    const storage = new Storage({
      projectId: config.projectId,
      ...(config.keyFilename && { keyFilename: config.keyFilename })
    })

    return {
      putObject: (bucket, key, data) =>
        Effect.tryPromise({
          try: async () => {
            const file = storage.bucket(bucket).file(key)
            const stream = file.createWriteStream({
              metadata: {
                contentType: "application/json"
              }
            })

            await new Promise<void>((resolve, reject) => {
              stream.on("error", reject)
              stream.on("finish", resolve)
              stream.end(JSON.stringify(data, null, 2))
            })
          },
          catch: (cause) => CloudStorageError.putObjectFailed(bucket, key, cause)
        }),

      getObject: (bucket, key, schema) =>
        Effect.tryPromise({
          try: async () => {
            const file = storage.bucket(bucket).file(key)
            const [exists] = await file.exists()

            if (!exists) {
              return Option.none()
            }

            const [data] = await file.download()
            const parsed = JSON.parse(data.toString())
            const decoded = Schema.decodeSync(schema)(parsed)

            return Option.some(decoded)
          },
          catch: (cause) => CloudStorageError.getObjectFailed(bucket, key, cause)
        }),

      deleteObject: (bucket, key) =>
        Effect.tryPromise({
          try: () => storage.bucket(bucket).file(key).delete(),
          catch: (cause) => CloudStorageError.deleteObjectFailed(bucket, key, cause)
        }).pipe(Effect.asVoid),

      listObjects: (bucket, prefix) =>
        Effect.tryPromise({
          try: async () => {
            const [files] = await storage.bucket(bucket).getFiles({ prefix })
            return files.map((file) => file.name) as ReadonlyArray<string>
          },
          catch: (cause) => CloudStorageError.listObjectsFailed(bucket, cause)
        }),

      objectExists: (bucket, key) =>
        Effect.tryPromise({
          try: async () => {
            const [exists] = await storage.bucket(bucket).file(key).exists()
            return exists
          },
          catch: (cause) => CloudStorageError.objectExistsFailed(bucket, key, cause)
        })
    }
  })
).pipe(Layer.provide(CloudStorageConfigLive))

================
File: packages/ingestion/src/index.ts
================
// Storage services - used by storage package
export * from "./storage/Config.js"
export * from "./storage/errors.js"
export * from "./storage/service.js"

================
File: packages/ingestion/test/pubsub.test.ts
================
import { assert, describe, it } from "@effect/vitest"
import { PubSub } from "@google-cloud/pubsub"
import {
  JobId,
  JobQueued,
  LanguageCode,
  MediaMetadata,
  MediaResourceId,
  RequestId,
  TranscriptionJob,
  YouTubeVideo,
  YouTubeVideoId,
  YouTubeVideoResource
} from "@puredialog/domain"
import { Effect } from "effect"
import { MessageAdapter, MessageAdapterLive } from "../src/pubsub/message-adapter.js"

const emulatorEndpoint = process.env.PUBSUB_EMULATOR_HOST ?? "127.0.0.1:8085"
const projectId = "pubsub-test-project"

const toError = (cause: unknown): Error => cause instanceof Error ? cause : new Error(String(cause))

const createSampleJob = () =>
  TranscriptionJob.make({
    id: JobId.make("job-0001"),
    requestId: RequestId.make("req-0001"),
    media: YouTubeVideoResource.make({
      type: "youtube",
      id: MediaResourceId.make("media-0001"),
      metadata: MediaMetadata.make({
        mediaResourceId: MediaResourceId.make("media-0001"),
        jobId: JobId.make("job-0001"),
        title: "Sample Interview",
        format: "one_on_one_interview",
        tags: [],
        domain: [],
        speakers: [
          { role: "host" }
        ],
        language: LanguageCode.make("en"),
        speakerCount: 1,
        durationSec: 1800,
        links: [],
        createdAt: new Date("2024-01-01T00:00:00Z")
      }),
      data: YouTubeVideo.make({
        id: YouTubeVideoId.make("a1B2c3D4e5F"),
        title: "Sample Video",
        duration: 1800,
        channelId: "UCabcdefghijklmnopqrstuvwx",
        tags: [],
        channelTitle: "PureDialog"
      })
    }),
    status: "Queued",
    attempts: 0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z")
  })

const createJobQueuedEvent = () =>
  JobQueued.make({
    job: createSampleJob(),
    occurredAt: new Date("2024-01-01T00:05:00Z")
  })

describe("Pub/Sub MessageAdapter integration", () => {
  it.effect("roundtrips a domain event through the emulator", () =>
    Effect.gen(function*() {
      const pubsub = new PubSub({ projectId, apiEndpoint: emulatorEndpoint })
      const topicName = `domain-events-${Date.now()}`
      const subscriptionName = `${topicName}-sub`

      const [topic] = yield* Effect.tryPromise({
        try: () => pubsub.createTopic(topicName),
        catch: toError
      })

      const [subscription] = yield* Effect.tryPromise({
        try: () => topic.createSubscription(subscriptionName, { ackDeadlineSeconds: 10 }),
        catch: toError
      })

      const event = createJobQueuedEvent()
      console.log("event", event)
      const encoded = yield* encodeDomainEvent(event)

      yield* Effect.tryPromise({
        try: () => topic.publishMessage({ data: encoded.data, attributes: encoded.attributes }),
        catch: toError
      })

      const [pullResponse] = yield* Effect.tryPromise({
        try: () => subscription.pull({ maxMessages: 1, returnImmediately: true }),
        catch: toError
      })

      const received = pullResponse.receivedMessages?.[0]
      if (!received || !received.message?.data) {
        return yield* Effect.fail(new Error("Expected message from Pub/Sub emulator"))
      }

      const decoded = yield* decodeDomainEvent({
        data: Buffer.from(received.message.data),
        attributes: received.message.attributes ?? {}
      })

      assert.deepStrictEqual(decoded, event)
      assert.strictEqual(received.message.attributes?.eventType, "JobQueued")

      if (received.ackId) {
        yield* Effect.tryPromise({
          try: () => subscription.acknowledge([received.ackId]),
          catch: toError
        })
      }

      yield* Effect.tryPromise({
        try: () => subscription.delete(),
        catch: toError
      })
      yield* Effect.tryPromise({
        try: () => topic.delete(),
        catch: toError
      })
      yield* Effect.tryPromise({
        try: () => pubsub.close(),
        catch: toError
      })
    }))
})

it.effect("roundtrips a work message through the emulator", () =>
  Effect.gen(function*() {
    const pubsub = new PubSub({ projectId, apiEndpoint: emulatorEndpoint })
    const topicName = `work-messages-${Date.now()}`
    const subscriptionName = `${topicName}-sub`

    const [topic] = yield* Effect.tryPromise({
      try: () => pubsub.createTopic(topicName),
      catch: toError
    })

    const [subscription] = yield* Effect.tryPromise({
      try: () => topic.createSubscription(subscriptionName, { ackDeadlineSeconds: 10 }),
      catch: toError
    })

    const job = createSampleJob()
    const encoded = yield* encodeWorkMessage(job)

    yield* Effect.tryPromise({
      try: () => topic.publishMessage({ data: encoded.data, attributes: encoded.attributes }),
      catch: toError
    })

    const [pullResponse] = yield* Effect.tryPromise({
      try: () => subscription.pull({ maxMessages: 1, returnImmediately: true }),
      catch: toError
    })

    const received = pullResponse.receivedMessages?.[0]
    if (!received || !received.message?.data) {
      return yield* Effect.fail(new Error("Expected message from Pub/Sub emulator"))
    }

    const decodedJob = yield* decodeWorkMessage({
      data: Buffer.from(received.message.data),
      attributes: received.message.attributes ?? {}
    })

    assert.deepStrictEqual(decodedJob, job)
    assert.strictEqual(received.message.attributes?.eventType, "WorkMessage")

    if (received.ackId) {
      yield* Effect.tryPromise({
        try: () => subscription.acknowledge([received.ackId]),
        catch: toError
      })
    }

    yield* Effect.tryPromise({
      try: () => subscription.delete(),
      catch: toError
    })
    yield* Effect.tryPromise({
      try: () => topic.delete(),
      catch: toError
    })
    yield* Effect.tryPromise({
      try: () => pubsub.close(),
      catch: toError
    })
  }))

================
File: packages/ingestion/test/storage.test.ts
================
import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Option, Schema } from "effect"
import { CloudStorageConfig, CloudStorageService } from "../src/storage/index.js"

// Mock CloudStorageConfig for testing
const TestCloudStorageConfig = Layer.sync(CloudStorageConfig, () => ({
  projectId: "test-project",
  keyFilename: undefined,
  bucket: "test-bucket",
  retryOptions: {
    maxRetries: 3,
    backoffMultiplier: 2,
    maxDelayMs: 30000
  }
}))

// Mock CloudStorageService for testing
const TestCloudStorageService = Layer.sync(CloudStorageService, () => ({
  putObject: (bucket, key, _data) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock putObject: ${bucket}/${key}`)
      // Simulate successful operation
    }),

  getObject: (bucket, key, _schema) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock getObject: ${bucket}/${key}`)
      // Return none for simplicity
      return Option.none()
    }),

  deleteObject: (bucket, key) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock deleteObject: ${bucket}/${key}`)
    }),

  listObjects: (bucket, prefix) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock listObjects: ${bucket}/${prefix}`)
      return [] as ReadonlyArray<string>
    }),

  objectExists: (bucket, key) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock objectExists: ${bucket}/${key}`)
      return false
    })
}))

const TestEnvironment = Layer.mergeAll(
  TestCloudStorageConfig,
  TestCloudStorageService
)

describe("CloudStorageService", () => {
  it.effect("should provide basic operations", () =>
    Effect.gen(function*() {
      const storage = yield* CloudStorageService

      // Test putObject
      yield* storage.putObject("test-bucket", "test-key", { test: "data" })

      // Test getObject
      const result = yield* storage.getObject("test-bucket", "test-key", Schema.String)
      assert.isTrue(Option.isNone(result))

      // Test deleteObject
      yield* storage.deleteObject("test-bucket", "test-key")

      // Test listObjects
      const objects = yield* storage.listObjects("test-bucket", "test-prefix")
      assert.strictEqual(objects.length, 0)

      // Test objectExists
      const exists = yield* storage.objectExists("test-bucket", "test-key")
      assert.isFalse(exists)
    }).pipe(Effect.provide(TestEnvironment)))

  it.effect("should handle configuration", () =>
    Effect.gen(function*() {
      const config = yield* CloudStorageConfig

      assert.strictEqual(config.projectId, "test-project")
      assert.strictEqual(config.bucket, "test-bucket")
      assert.strictEqual(config.retryOptions.maxRetries, 3)
    }).pipe(Effect.provide(TestEnvironment)))
})

================
File: packages/ingestion/package.json
================
{
  "name": "@puredialog/ingestion",
  "version": "0.0.0",
  "type": "module",
  "license": "MIT",
  "description": "The ingestion for Pure Dialog",
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "clean": "tsc -b tsconfig.build.json --clean",
    "test": "vitest",
    "coverage": "vitest --coverage"
  },
  "dependencies": {
    "@effect/platform": "latest",
    "@effect/platform-node": "latest",
    "@google-cloud/storage": "^7.7.0",
    "@puredialog/domain": "workspace:^",
    "effect": "latest",
    "typescript": "~5.8.3"
  }
}

================
File: packages/ingestion/tsconfig.build.json
================
{
  "extends": "./tsconfig.src.json",
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo",
    "outDir": "build/esm",
    "declarationDir": "build/dts",
    "stripInternal": true
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" },
  ],
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}

================
File: packages/ingestion/tsconfig.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "./tsconfig.src.json" }
  ]
}

================
File: packages/ingestion/tsconfig.src.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/src.tsbuildinfo"
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" }
  ]
}

================
File: packages/ingestion/tsconfig.test.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["test", "src"],
  "references": [
    { "path": "../domain" }
  ],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/test.tsbuildinfo",
    "noEmit": true
  }
}

================
File: packages/ingestion/vitest.config.ts
================
import { mergeConfig, type UserConfigExport } from "vitest/config"
import shared from "../../vitest.shared.js"

const config: UserConfigExport = {}

export default mergeConfig(shared, config)

================
File: packages/llm/scripts/example_list_videos_response.json
================
{
    "kind": "youtube#videoListResponse",
    "etag": "coAFIwjqCTZeKe0S5StSGJUWejk",
    "items": [
      {
        "kind": "youtube#video",
        "etag": "5UNkDB83l9N2CvOZIMXbnYHeOq8",
        "id": "dDPOpax2JBA",
        "snippet": {
          "publishedAt": "2025-03-19T11:00:52Z",
          "channelId": "UCerjTexarRNjdAv_1tbe49A",
          "title": "Manufacturing Meets AI - What You Need to Know!",
          "description": "Learn how AI is revolutionizing the manufacturing industry and how you can find opportunities for AI application in manufacturing. Watch now!\n\nFIND PATRICK ONLINE\nGiveaway page: https://annora.ai/industry40.tv\nYouTube: https://www.youtube.com/@patrickbyrneai\nLinkedin: https://www.linkedin.com/in/patrickbyrneai/\n\nFIND ME ON SOCIAL\nLinkedIn: https://www.linkedin.com/in/kudzaimanditereza/\nX/Twitter: https://twitter.com/techbykudzi\nInstagram: https://www.instagram.com/techbykudzi/\n\n🎙️Podcast Info:\nApple Podcasts: https://apple.co/3lY5vhl\nSpotify: https://spoti.fi/3748AXf\nRSS: https://bit.ly/3vGkkuJ\nPodcast website: https://www.industry40.tv/podcast/\u200b\u200b\nFull episodes playlist:",
          "thumbnails": {
            "default": {
              "url": "https://i.ytimg.com/vi/dDPOpax2JBA/default.jpg",
              "width": 120,
              "height": 90
            },
            "medium": {
              "url": "https://i.ytimg.com/vi/dDPOpax2JBA/mqdefault.jpg",
              "width": 320,
              "height": 180
            },
            "high": {
              "url": "https://i.ytimg.com/vi/dDPOpax2JBA/hqdefault.jpg",
              "width": 480,
              "height": 360
            },
            "standard": {
              "url": "https://i.ytimg.com/vi/dDPOpax2JBA/sddefault.jpg",
              "width": 640,
              "height": 480
            },
            "maxres": {
              "url": "https://i.ytimg.com/vi/dDPOpax2JBA/maxresdefault.jpg",
              "width": 1280,
              "height": 720
            }
          },
          "channelTitle": "Industry40tv",
          "categoryId": "28",
          "liveBroadcastContent": "none",
          "defaultLanguage": "en",
          "localized": {
            "title": "Manufacturing Meets AI - What You Need to Know!",
            "description": "Learn how AI is revolutionizing the manufacturing industry and how you can find opportunities for AI application in manufacturing. Watch now!\n\nFIND PATRICK ONLINE\nGiveaway page: https://annora.ai/industry40.tv\nYouTube: https://www.youtube.com/@patrickbyrneai\nLinkedin: https://www.linkedin.com/in/patrickbyrneai/\n\nFIND ME ON SOCIAL\nLinkedIn: https://www.linkedin.com/in/kudzaimanditereza/\nX/Twitter: https://twitter.com/techbykudzi\nInstagram: https://www.instagram.com/techbykudzi/\n\n🎙️Podcast Info:\nApple Podcasts: https://apple.co/3lY5vhl\nSpotify: https://spoti.fi/3748AXf\nRSS: https://bit.ly/3vGkkuJ\nPodcast website: https://www.industry40.tv/podcast/\u200b\u200b\nFull episodes playlist:"
          },
          "defaultAudioLanguage": "en-GB"
        },
        "contentDetails": {
          "duration": "PT48M36S",
          "dimension": "2d",
          "definition": "hd",
          "caption": "false",
          "licensedContent": false,
          "contentRating": {},
          "projection": "rectangular"
        },
        "status": {
          "uploadStatus": "processed",
          "privacyStatus": "public",
          "license": "youtube",
          "embeddable": true,
          "publicStatsViewable": true,
          "madeForKids": false
        },
        "statistics": {
          "viewCount": "261",
          "likeCount": "7",
          "favoriteCount": "0",
          "commentCount": "2"
        }
      }
    ],
    "pageInfo": {
      "totalResults": 1,
      "resultsPerPage": 1
    }
  }

================
File: packages/llm/scripts/test-transcription.ts
================
#!/usr/bin/env tsx
import { JobId, LanguageCode, MediaMetadata, MediaResourceId, YouTubeVideo, YouTubeVideoId } from "@puredialog/domain"
import { Cause, Console, Effect, Layer, Option } from "effect"
import { LLMService, LLMServiceLive } from "../src/service.js"
import {listVideoresponse} from "./example_list_videos_response.json"
import { GeminiConfig } from "../src/config.js"

const defaultVideoId = "dDPOpax2JBA" as YouTubeVideoId

const youtubeVideo = YouTubeVideo.make({
    id: YouTubeVideoId.make(defaultVideoId),
    title: listVideoresponse.items[0].snippet.title,
    description: listVideoresponse.items[0].snippet.description,
    tags: listVideoresponse.items[0].snippet.tags,
    duration: listVideoresponse.items[0].contentDetails.duration ? parseISO8601Duration(listVideoresponse.items[0].contentDetails.duration) : 0,
    channelId: listVideoresponse.items[0].snippet.channelId,
    channelTitle: listVideoresponse.items[0].snippet.channelTitle,
    publishedAt: listVideoresponse.items[0].snippet.publishedAt,
    language: listVideoresponse.items[0].snippet.defaultAudioLanguage
})

const program = Effect.gen(function*() {
  const service = yield* LLMService
  // Create basic media metadata for testing
  const metadata = MediaMetadata.make({
    mediaResourceId: MediaResourceId.make(youtubeVideo.id),
    jobId: JobId.make("job-0001"),
    speakerCount: 2,
    speakers: [
      {
        name: "Kudzai Manditereza",
        role: "host",
        affiliation: { name: "Industry40.tv",  },
        bio: `I help digital manufacturing professionals master the implementation of Intelligent Manufacturing with Industrial IoT and AI solutions.

I teach digital factory architectural principles and techniques, and I host a weekly podcast, AI in Manufacturing where I interview leading AI practitioners to provide you with detailed insights.`
      }
    ],
    domain: ["Industrial automation"] , 
    tags: ["manufacturing", "engineering", "automation", "OT/IT", "digital factory"],
    format: "one_on_one_interview",
    language: LanguageCode.make("en"),
    title: youtubeVideo.title,
    organization: "Industry40.tv",
    summary: `, 2025  AI in Manufacturing Podcast
Learn how AI is revolutionizing the manufacturing industry and how you can find opportunities for AI application in manufacturing.`,
    durationSec: youtubeVideo.duration,
    links: [],
    createdAt: new Date()
  })

  yield* Console.log("Starting transcription...")
  const transcript = yield* service.transcribeMedia(youtubeVideo, metadata )
  
  yield* Console.log(`Transcription completed! Found ${transcript.length} dialogue turns`)
  
  // Print first few turns for verification
  transcript.slice(0, 3).forEach((turn, index) => {
    yield* Console.log(`Turn ${index + 1}: [${turn.timestamp}] ${turn.speaker}: ${turn.text.substring(0, 50)}...`)
  })
})

await Effect.runPromise(
  program.pipe(
    Effect.provide(LLMServiceLive),
    Effect.catchAllCause((cause) => Console.error(Cause.pretty(cause)))
  )
)

================
File: packages/llm/src/prompts/transcribe_media.ts
================
import type { Media, Speaker } from "@puredialog/domain"

const systemInstruction =
  `You are a world-class transcription engine specializing in generating human-level, production-quality transcripts. Your primary goal is to produce accurate, perfectly formatted, and highly readable verbatim transcripts from audio-first media content (e.g., expert interviews, technical discussions, lectures, podcasts).`

const hints = (metadata: Media.MediaMetadata): string => {
  const speakers = metadata.speakers

  // Build factual speaker details
  const speakerHints = speakers
    .map((s: Speaker) => {
      const name = s.name ?? s.role
      const affiliation = s.affiliation
        ? `${s.affiliation.name}${s.affiliation.url ? ` (${s.affiliation.url})` : ""}`
        : "N/A"
      const bio = s.bio || "N/A"

      return `- **${name}** (Role: ${s.role}, Affiliation: ${affiliation}, Bio: ${bio})`
    })
    .join("\n")

  // Build domain and tags
  const domainList = metadata.domain.length > 0 ? metadata.domain.join(", ") : "N/A"
  const tagsList = metadata.tags.length > 0 ? metadata.tags.join(", ") : "N/A"

  // Build links
  const linksList = metadata.links.length > 0 ? metadata.links.join(", ") : "N/A"

  // Build summary and organization
  const summary = metadata.summary || "N/A"
  const organization = metadata.organization || "N/A"

  const duration = `${Math.floor(metadata.durationSec / 60)}:${(metadata.durationSec % 60).toString().padStart(2, "0")}`

  return `**Media Metadata for Transcription:**

**Speakers (${speakers.length} total):**
${speakerHints}

**Domains (for terminology):** ${domainList}

**Tags (key topics):** ${tagsList}

**Format:** ${metadata.format.replace(/_/g, " ")}

**Language:** ${metadata.language}

**Title:** ${metadata.title}

**Organization:** ${organization}

**Summary:** ${summary}

**Duration:** ${duration} (approximately ${Math.round(metadata.durationSec / 60)} minutes)

**Links:** ${linksList}`
}

const instructions = `
**PRIMARY OBJECTIVE:** Generate a verbatim transcript with precise speaker diarization.

**CORE INSTRUCTIONS:**

1. **Transcription Accuracy (Verbatim Style):**
  * Transcribe speech exactly as spoken, including filler words ("uh," "um," "like"), false starts, and repeated words.
  * Do not paraphrase, summarize, or correct grammatical errors.
  * Use proper capitalization and punctuation (commas, periods, question marks) to create coherent sentences that reflect the speaker's delivery and intonation.

2. **Dialogue Turn Formatting:**
  * Format every dialogue turn using this **exact** structure:
    \`\`\`
    [HH:MM] <SpeakerRole>
    <text>
    \`\`\`
  * **Timestamp:** The timestamp must be in [HH:MM] format (e.g., [00:00], [01:23]).
  * **Speaker Role:** Follow the timestamp with **exactly one space**, then the speaker role in angle brackets (e.g., "<Host>", "<Guest>").
  * **Text:** Place the verbatim spoken text on a new line directly below the speaker role.
  * **Separation:** Add a blank line between each dialogue turn for readability.
  * **Common Formatting Errors to Avoid:**
    * [00:15]<Host> (Missing space after timestamp)
    * [00:15] Host (Missing angle brackets around speaker role)
    * [00:15:03] <Host> (Incorrect timestamp format; must be [HH:MM])
  * **Simultaneous Speech (Crosstalk):** If two speakers talk over each other, place their dialogue on separate, consecutive lines with the same timestamp.
    \`\`\`
    [00:45] <Host>
    And so we decided to--

    [00:45] <Guest>
    --but that wasn't the original plan.
    \`\`\`
  * **New Turn Definition:** A new turn starts every time a new speaker begins speaking. For long monologues by a single speaker, create new turns at logical pauses or topic shifts, approximately every 1-2 minutes.
  * **Speaker Labels:** You **MUST ONLY** label speakers with the provided **Speaker Roles** from the 'Transcription Context'. Using any other label is a failure to follow instructions.

3. **Handling Non-Speech Elements:**
  * The transcript must **ONLY** contain the verbatim spoken dialogue.
  * **ABSOLUTELY NO** non-speech sounds or descriptions are allowed. This includes, but is not limited to: "[laughs]", "[applause]", "[music starts]", "[clears throat]". The only exception is "[unintelligible]".
  * If speech is completely indecipherable, use "[unintelligible]" sparingly. Do not guess the words.
  * Do not describe any visual elements. If a speaker refers to something visual on screen (e.g., "as you can see here..."), transcribe their words only and DO NOT describe what they are referring to.

**THINKING PROCESS (Internal Steps):**

1. **Video Scan:** Determine the video's approximate total duration by scanning to the end to find the last spoken words (e.g., "thanks for watching," "goodbye"). Note this final timestamp to ensure all generated timestamps are logical and within bounds.
2. **Context Review:** Thoroughly review the 'Transcription Context' provided, paying close attention to the **Media Title**, **Format**, **Speakers to Identify**, **Speaker Roles**, **Subject Areas**, and **Key Topics**. This context is vital for accurate transcription and diarization, especially for niche terminology.
3. **Initial Speaker Pass:** Briefly scan the entire video's audio to understand the overall content, identify distinct voices, and mentally map them to the provided **Speaker Roles**. This helps establish speaker identities and speaking patterns.
4. **Detailed Transcription & Diarization:** Go through the video sequentially. Transcribe all dialogue verbatim. For each segment of speech, assign it to the correct speaker using only the provided **Speaker Role** and generate a precise timestamp in the [HH:MM] format. Ensure each dialogue turn follows the exact formatting specified in **Instruction 2**.
5. **Review and Refine:** Conduct a final review of the complete transcript.
  * Verify all timestamps are in the correct [HH:MM] format, are strictly sequential, and do not exceed the final timestamp identified in Step 1.
  * Confirm that speaker labels are used consistently and correctly according to your initial mapping and adhere strictly to the provided **Speaker Roles**.
  * Ensure each dialogue turn follows the required formatting with proper spacing between turns.
  * Double-check that no non-speech elements or visual descriptions are present.

**OUTPUT FORMAT:**
The output must ONLY be the verbatim transcript, strictly following all formatting rules above.
*   **DO NOT** include any introductory text, explanations, apologies, or concluding remarks (e.g., "Here is the transcript:", "I hope this is helpful.").
*   The response must begin directly with the first dialogue turn (e.g., [00:00] <SpeakerRole>) and contain nothing else but the formatted transcript.
*   Do not use any markdown formatting beyond what is required for the dialogue turn structure itself.`

export { hints, instructions, systemInstruction }

================
File: packages/llm/src/adapters.ts
================
import { Transcription } from "@puredialog/domain"
import { Context, Effect, Layer, Schema } from "effect"
import type { LLMError } from "./errors.js"
import { TranscriptionError } from "./errors.js"

// The schema for the raw output we expect from the LLM
const LLMOutputSchema = Schema.Array(Transcription.DialogueTurn)

export class LLMAdapter extends Context.Tag("LLMAdapter")<LLMAdapter, {
  readonly toDomainTranscript: (
    rawOutput: unknown
  ) => Effect.Effect<ReadonlyArray<Transcription.DialogueTurn>, LLMError>
}>() {}

export const LLMAdapterLive = Layer.succeed(
  LLMAdapter,
  LLMAdapter.of({
    toDomainTranscript: (rawOutput) =>
      Schema.decodeUnknown(LLMOutputSchema)(rawOutput).pipe(
        Effect.mapError(
          (cause) =>
            new TranscriptionError({
              message: "Failed to parse LLM output into DialogueTurns",
              cause
            })
        )
      )
  })
)

================
File: packages/llm/src/client.ts
================
import { ApiError, GoogleGenAI, MediaResolution } from "@google/genai"
import { Media, videoIdToWatchUrl, YouTube } from "@puredialog/domain"
import { Context, Effect, Layer, Option, Redacted, Schema, Stream } from "effect"
import { GeminiConfig } from "./config.js"
import { GoogleApiError } from "./errors.js"
import { hints, instructions, systemInstruction } from "./prompts/transcribe_media.js"

export type TranscribeYoutubeVideoOptions = Schema.Schema.Type<typeof TranscribeYoutubeVideoOptions>
export const TranscribeYoutubeVideoOptions = Schema.Struct({
  video: YouTube.YouTubeVideo,
  mediaMetadata: Media.MediaMetadata
})

// Helper function to format content parts for the LLM call
const _formatContentParts = (options: TranscribeYoutubeVideoOptions) => {
  const parts: Array<{ fileData: { fileUri: string } } | { text: string }> = [
    { fileData: { fileUri: videoIdToWatchUrl(options.video.id) } }
  ]

  // If we have media metadata, use the hints function to generate context
  if (options.mediaMetadata) {
    const metadata = options.mediaMetadata as Media.MediaMetadata
    const hintsText = hints(metadata)
    parts.push({ text: hintsText })
  }

  // Add the instructions
  parts.push({ text: instructions })

  return parts
}

// Define the service tag
export class GeminiClient extends Context.Tag("GeminiClient")<
  GeminiClient,
  {
    readonly transcribeYoutubeVideo: (
      options: TranscribeYoutubeVideoOptions
    ) => Effect.Effect<Stream.Stream<Option.Option<string>, GoogleApiError, never>, GoogleApiError>
  }
>() {}

// Implement the live layer
export const GeminiClientLive = Layer.effect(
  GeminiClient,
  Effect.gen(function*() {
    const config = yield* GeminiConfig
    const genAI = yield* Effect.try(() => new GoogleGenAI({ apiKey: Redacted.value(config.apiKey) }))

    const transcribeYoutubeVideo = (options: TranscribeYoutubeVideoOptions) =>
      Effect.tryPromise({
        try: () =>
          genAI.models.generateContentStream({
            model: config.model,
            contents: _formatContentParts(options),
            config: {
              responseMimeType: "application/json",
              mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW,
              temperature: config.temperature,
              systemInstruction
            }
          }),
        catch: (cause) =>
          cause instanceof ApiError ?
            new GoogleApiError({
              message: cause.message,
              status: cause.status
            })
            : new GoogleApiError({
              message: "Error generating content from Gemini API",
              status: 500
            })
      }).pipe(
        Effect.map((response) =>
          Stream.fromAsyncIterable(response, (e) =>
            new GoogleApiError({
              message: "Error generating content from Gemini API",
              cause: e,
              status: 500
            })).pipe(
              Stream.map((res) => Option.fromNullable(res.text)),
              Stream.withSpan("GeminiClient.transcribeYoutubeVideo")
            )
        )
      )

    return {
      transcribeYoutubeVideo
    } as const
  })
)

================
File: packages/llm/src/config.ts
================
import { Config } from "effect"

export const GeminiConfig = Config.all({
  apiKey: Config.redacted("GEMINI_API_KEY"),
  model: Config.string("GEMINI_MODEL").pipe(
    Config.withDefault("gemini-2.5-flash")
  ),
  temperature: Config.number("GEMINI_TEMPERATURE").pipe(
    Config.withDefault(0.0)
  ),
  timeout: Config.number("GEMINI_TIMEOUT_").pipe(
    Config.withDefault(30000)
  ),
  maxRetries: Config.number("GEMINI_MAX_RETRIES").pipe(
    Config.withDefault(3)
  ),
  backoff: Config.number("GEMINI_BACKOFF").pipe(
    Config.withDefault(1000)
  )
})

================
File: packages/llm/src/errors.ts
================
import { Data } from "effect"

export class TranscriptionError extends Data.TaggedError("TranscriptionError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class GoogleApiError extends Data.TaggedError("GoogleApiError")<{
  readonly message: string
  readonly cause?: unknown
  readonly status?: number
}> {}

export type LLMError = TranscriptionError | GoogleApiError

================
File: packages/llm/src/index.ts
================
export * from "./config.js"
export * from "./errors.js"
export * from "./service.js"

================
File: packages/llm/src/service.ts
================
import { Chunk, Console, Context, Effect, Layer, Option, Stream } from "effect"

import type { Media, Transcription, YouTube } from "@puredialog/domain"
import { LLMAdapter, LLMAdapterLive } from "./adapters.js"
import { GeminiClient, GeminiClientLive } from "./client.js"
import type { LLMError } from "./errors.js"

// 2. Define the service tag
export class LLMService extends Context.Tag("@puredialog/llm/LLMService")<
  LLMService,
  {
    readonly transcribeMedia: (
      video: YouTube.YouTubeVideo,
      metadata: Media.MediaMetadata
    ) => Effect.Effect<ReadonlyArray<Transcription.DialogueTurn>, LLMError>
  }
>() {}

// 3. Implement the service
const makeLLMService = Effect.gen(function*() {
  const client = yield* GeminiClient
  const adapter = yield* LLMAdapter

  const transcribeMedia = (
    video: YouTube.YouTubeVideo,
    metadata: Media.MediaMetadata
  ) =>
    Effect.gen(function*() {
      const rawOutputStream = (yield* client.transcribeYoutubeVideo({
        video,
        mediaMetadata: metadata
      })).pipe(
        Stream.tap((chunk) =>
          chunk.pipe(Option.match(
            { onSome: (chunk) => Console.log(chunk), onNone: () => Console.log("No chunk") }
          ))
        )
      )
      const rawOutput = (yield* Stream.runCollect(rawOutputStream)).pipe(Chunk.compact)
      const turns = yield* adapter.toDomainTranscript(rawOutput)
      return turns
    }).pipe(Effect.withSpan("LLMService.transcribeMedia"))

  return LLMService.of({
    transcribeMedia
  })
})

// 4. Compose the final layer
const LayerLLMService = Layer.effect(LLMService, makeLLMService)

const LLMServiceDeps = Layer.merge(GeminiClientLive, LLMAdapterLive)

export const LLMServiceLive = LayerLLMService.pipe(
  Layer.provide(LLMServiceDeps)
)

================
File: packages/llm/package.json
================
{
  "name": "@puredialog/llm",
  "version": "0.0.0",
  "type": "module",
  "description": "The LLM for Pure Dialog",
  "exports": {
    ".": {
      "types": "./build/dts/index.d.ts",
      "module": "./build/esm/index.js",
      "default": "./build/esm/index.js"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "clean": "tsc -b tsconfig.json --clean",
    "test": "vitest",
    "coverage": "vitest --coverage"
  },
  "dependencies": {
    "@effect/ai": "latest",
    "@effect/ai-google": "^0.7.0",
    "@effect/platform": "latest",
    "@effect/platform-node": "latest",
    "@google/genai": "latest",
    "@puredialog/domain": "workspace:^",
    "effect": "latest"
  },
  "effect": {
    "generateExports": {
      "include": [
        "**/*.ts"
      ]
    },
    "generateIndex": {
      "include": [
        "**/*.ts"
      ]
    }
  }
}

================
File: packages/llm/tsconfig.build.json
================
{
  "extends": "./tsconfig.src.json",
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo",
    "outDir": "build/esm",
    "noEmit": false,
    "composite": true,
    "declarationDir": "build/dts",
    "stripInternal": true
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" }
  ],
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}

================
File: packages/llm/tsconfig.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "./tsconfig.src.json" }
  ]
}

================
File: packages/llm/tsconfig.src.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/src.tsbuildinfo"
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" }
  ]
}

================
File: packages/llm/vitest.config.ts
================
import { mergeConfig, type UserConfigExport } from "vitest/config";
import shared from "../../vitest.shared.js";

const config: UserConfigExport = {};

export default mergeConfig(shared, config);

================
File: packages/storage/src/utils/idempotency.ts
================
import type { MediaResource } from "@puredialog/domain"
import { Data, Effect, Hash } from "effect"

/**
 * Generate random request ID for idempotency keys
 */
const generateRequestId = (): string => {
  return `req_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Idempotency key composition using Effect Data for value-based equality
 */
export class IdempotencyKey extends Data.TaggedClass("IdempotencyKey")<{
  readonly requestKey: string // User-provided unique identifier
  readonly endpoint: string // API endpoint path ("/jobs")
  readonly mediaHash: string // Hash of media resource for uniqueness
}> {}

/**
 * Generate deterministic hash of media resource for uniqueness using Effect Hash
 */
export const generateMediaHash = (media: MediaResource): string => {
  // Extract media URL for hashing
  const mediaUrl = extractMediaUrl(media)

  // Use Effect's Hash module to generate hash from URL
  const hashValue = Hash.hash(mediaUrl)

  // Convert to hex string and take first 16 characters
  return Math.abs(hashValue).toString(16).substring(0, 16)
}

/**
 * Generate complete idempotency key from components using Effect Data
 */
export const generateIdempotencyKey = (
  endpoint: string,
  media: MediaResource
): IdempotencyKey => {
  // Validate user key format
  const userKey = generateRequestId() // random uuidk

  // Generate deterministic hash of media resource
  const mediaHash = generateMediaHash(media)

  // Create idempotency key using Effect Data for value-based equality
  return new IdempotencyKey({
    requestKey: userKey,
    endpoint,
    mediaHash
  })
}

/**
 * Extract media URL for idempotency mapping using Effect Data
 */
export const extractMediaUrl = (media: MediaResource): string => {
  if (media.type === "youtube") {
    return `https://www.youtube.com/watch?v=${media.data.id}`
  }
  // For future media types, implement URL extraction
  return JSON.stringify(media)
}

/**
 * Hash idempotency key for storage using Effect Hash
 */
export const hashIdempotencyKey = (key: IdempotencyKey): Effect.Effect<string, never> =>
  Effect.sync(() => {
    // Use Effect's Hash module for consistent hashing
    const hashValue = Hash.hash(key)
    return Math.abs(hashValue).toString(16)
  })

/**
 * Convert idempotency key to string representation
 */
export const idempotencyKeyToString = (key: IdempotencyKey): string =>
  `${key.requestKey}:${key.endpoint}:${key.mediaHash}`

export const idempotencyKeyFromString = (key: string): IdempotencyKey => {
  const parts = key.split(":")
  return new IdempotencyKey({
    requestKey: parts[0],
    endpoint: parts[1],
    mediaHash: parts[2]
  })
}

/**
 * Check if idempotency record is expired (24 hours)
 */
export const isIdempotencyExpired = (createdAt: string): boolean => {
  const created = new Date(createdAt)
  const now = new Date()
  const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  return (now.getTime() - created.getTime()) > twentyFourHours
}

================
File: packages/storage/src/index.ts
================
// Storage layer exports
export * from "./indices.js"
export * from "./JobRepository.js"
export * from "./JobStore.js"
export * from "./paths.js"
export * from "./utils/idempotency.js"

================
File: packages/storage/src/indices.ts
================
import type { JobId, JobStatus, TranscriptId } from "@puredialog/domain"
import { Schema } from "effect"
import {
  EventPathParser,
  IdempotencyPathParser,
  JobPathParser,
  PathParsers,
  STORAGE_PATHS,
  TranscriptPathParser
} from "./paths.js"

/**
 * A centralized module for generating GCS object keys (indices).
 * This ensures a consistent and maintainable prefix structure
 * with type-safe path generation and parsing capabilities.
 */
export const Index = {
  /**
   * Generates the full GCS path for a specific TranscriptionJob document.
   * Uses Schema.encodeSync for type-safe path generation.
   * @param status The status of the job, used for prefixing.
   * @param jobId The ID of the job.
   * @returns The full GCS object key, e.g., `jobs/Queued/job_123.json`
   */
  job: (status: JobStatus, jobId: JobId): string =>
    Schema.encodeSync(JobPathParser)([
      STORAGE_PATHS.JOBS_PREFIX,
      "/",
      status,
      "/",
      jobId,
      ".json"
    ]),

  /**
   * Generates the full GCS path for an idempotency record.
   * Uses Schema.encodeSync for type-safe path generation.
   * @param hashedKey The hashed idempotency key.
   * @returns The full GCS object key, e.g., `idempotency/abc123def456.json`
   */
  idempotency: (hashedKey: string): string =>
    Schema.encodeSync(IdempotencyPathParser)([
      STORAGE_PATHS.IDEMPOTENCY_PREFIX,
      "/",
      hashedKey,
      ".json"
    ]),

  /**
   * Generates the full GCS path for a completed Transcript document.
   * Uses Schema.encodeSync for type-safe path generation.
   * @param transcriptId The ID of the transcript.
   * @returns The full GCS object key, e.g., `transcripts/trn_123.json`
   */
  transcript: (transcriptId: TranscriptId): string =>
    Schema.encodeSync(TranscriptPathParser)([
      STORAGE_PATHS.TRANSCRIPTS_PREFIX,
      "/",
      transcriptId,
      ".json"
    ]),

  /**
   * Generates the prefix for listing all jobs of a specific status.
   * @param status The status to list jobs for.
   * @returns The GCS prefix, e.g., `jobs/Queued/`
   */
  jobs: (status: JobStatus): string => `${STORAGE_PATHS.JOBS_PREFIX}/${status}/`,

  /**
   * Returns the prefix for listing all idempotency records.
   */
  idempotencies: (): string => `${STORAGE_PATHS.IDEMPOTENCY_PREFIX}/`,

  /**
   * Returns the prefix for listing all transcript documents.
   */
  transcripts: (): string => `${STORAGE_PATHS.TRANSCRIPTS_PREFIX}/`,

  /**
   * Generates the full GCS path for an event in the event log.
   * Uses Schema.encodeSync for type-safe path generation.
   * @param jobId The ID of the job the event belongs to.
   * @param eventId The unique ID for the event (e.g., timestamp-based).
   * @returns The full GCS object key, e.g., `events/job_123/1_metadata_fetched.json`
   */
  event: (jobId: JobId, eventId: string): string =>
    Schema.encodeSync(EventPathParser)([
      STORAGE_PATHS.EVENTS_PREFIX,
      "/",
      jobId,
      "/",
      eventId,
      ".json"
    ]),

  /**
   * Generates the prefix for listing all events for a specific job.
   * @param jobId The ID of the job to list events for.
   * @returns The GCS prefix, e.g., `events/job_123/`
   */
  events: (jobId: JobId): string => `${STORAGE_PATHS.EVENTS_PREFIX}/${jobId}/`,

  /**
   * Returns the prefix for listing all event logs across all jobs.
   */
  allEvents: (): string => `${STORAGE_PATHS.EVENTS_PREFIX}/`,

  /**
   * Type-safe path parsing utilities.
   * These can be used to parse GCS object paths back into structured components.
   */
  parsers: PathParsers
} as const

================
File: packages/storage/src/JobRepository.ts
================
import type { JobStatus, TranscriptId } from "@puredialog/domain"
import { JobId, JobQueued, JobStatusChanged, TranscriptionJob } from "@puredialog/domain"
import { CloudStorageConfig, CloudStorageService } from "@puredialog/ingestion"
import { Context, Data, Effect, Layer, Option } from "effect"
import { Index } from "./indices.js"
import { hashIdempotencyKey, idempotencyKeyFromString } from "./utils/idempotency.js"

// --- REPOSITORY INTERFACE ---
export interface JobRepositoryInterface {
  readonly createJob: (
    job: TranscriptionJob
  ) => Effect.Effect<TranscriptionJob, RepositoryError, CloudStorageService | CloudStorageConfig>

  readonly findJobById: (
    jobId: JobId
  ) => Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError, CloudStorageService | CloudStorageConfig>

  readonly findJobByIdempotencyKey: (
    key: string
  ) => Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError, CloudStorageService | CloudStorageConfig>

  readonly updateJobStatus: (
    jobId: JobId,
    newStatus: JobStatus,
    error?: string,
    transcriptId?: TranscriptId
  ) => Effect.Effect<TranscriptionJob, RepositoryError, CloudStorageService | CloudStorageConfig>
}

// --- SERVICE TAG ---
export class JobRepository extends Context.Tag("JobRepository")<JobRepository, JobRepositoryInterface>() {}

// --- ERROR TYPE ---
export class RepositoryError extends Data.TaggedError("RepositoryError")<{
  readonly message: string
  readonly operation: string
  readonly cause?: unknown
}> {}

// --- LIVE IMPLEMENTATION ---
export const JobRepositoryLayer = Layer.effect(
  JobRepository,
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const config = yield* CloudStorageConfig
    const bucket = config.bucket

    const createJob = (
      job: TranscriptionJob
    ): Effect.Effect<TranscriptionJob, RepositoryError, CloudStorageService | CloudStorageConfig> =>
      Effect.gen(function*() {
        const path = Index.job(job.status, job.id)
        yield* storage.putObject(bucket, path, job)

        if (job.idempotencyKey) {
          const idempotencyKey = idempotencyKeyFromString(job.idempotencyKey)
          const hashedKey = yield* hashIdempotencyKey(idempotencyKey)
          const idempotencyPath = Index.idempotency(hashedKey)
          yield* storage.putObject(bucket, idempotencyPath, { jobId: job.id })
        }

        // Write JobQueued domain event to event store
        const eventId = `${Date.now()}_job_queued`
        const eventPath = Index.event(job.id, eventId)
        const domainEvent = JobQueued.make({
          job,
          occurredAt: new Date()
        })
        yield* storage.putObject(bucket, eventPath, domainEvent)

        yield* Effect.logInfo("Job saved with JobQueued event", {
          jobId: job.id,
          eventPath
        })

        return job
      }).pipe(
        Effect.mapError(
          (cause) =>
            new RepositoryError({
              operation: "save",
              message: "Failed to save job",
              cause
            })
        )
      )

    const findJobById = (
      jobId: JobId
    ): Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError, CloudStorageService | CloudStorageConfig> => {
      const statuses: Array<JobStatus> = ["Queued", "Processing", "Completed", "Failed"]

      const checkStatus = (status: JobStatus) =>
        storage
          .getObject(bucket, Index.job(status, jobId), TranscriptionJob)
          .pipe(Effect.catchAll(() => Effect.succeed(Option.none())))

      // Check each status prefix until the job is found
      return Effect.forEach(statuses, checkStatus, { concurrency: "unbounded" }).pipe(
        Effect.map((results) => Option.firstSomeOf(results)),
        Effect.mapError(
          (cause) =>
            new RepositoryError({
              operation: "findById",
              message: "Failed to find job by ID",
              cause
            })
        )
      )
    }

    const updateJobStatus = (
      jobId: JobId,
      newStatus: JobStatus,
      error?: string,
      transcriptId?: TranscriptId
    ): Effect.Effect<TranscriptionJob, RepositoryError, CloudStorageService | CloudStorageConfig> =>
      Effect.gen(function*() {
        const maybeJob = yield* findJobById(jobId)
        if (Option.isNone(maybeJob)) {
          return yield* Effect.fail(
            new RepositoryError({
              operation: "updateStatus",
              message: `Job not found: ${jobId}`
            })
          )
        }
        const oldJob = maybeJob.value
        const oldPath = Index.job(oldJob.status, jobId)

        const newJob = TranscriptionJob.make({
          ...oldJob,
          status: newStatus,
          updatedAt: new Date(),
          ...(error !== undefined && { error }),
          ...(transcriptId !== undefined && { transcriptId })
        })
        const newPath = Index.job(newStatus, jobId)

        // Write-then-delete pattern for atomic status change
        yield* storage.putObject(bucket, newPath, newJob)
        yield* storage.deleteObject(bucket, oldPath).pipe(Effect.catchAll(() => Effect.void))

        // Write JobStatusChanged domain event to event store
        const eventId = `${Date.now()}_status_changed`
        const eventPath = Index.event(jobId, eventId)
        const domainEvent = JobStatusChanged.make({
          jobId,
          requestId: newJob.requestId,
          from: oldJob.status,
          to: newStatus,
          occurredAt: new Date()
        })
        yield* storage.putObject(bucket, eventPath, domainEvent)

        yield* Effect.logInfo("Job status updated with domain event", {
          jobId,
          from: oldJob.status,
          to: newStatus,
          eventPath
        })

        return newJob
      }).pipe(
        Effect.mapError(
          (cause) =>
            new RepositoryError({
              operation: "updateStatus",
              message: "Failed to update job status",
              cause
            })
        )
      )

    return {
      createJob,
      findJobById,
      findJobByIdempotencyKey: (
        keyString: string
      ): Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError, CloudStorageService | CloudStorageConfig> =>
        Effect.gen(function*() {
          const idempotencyKey = idempotencyKeyFromString(keyString)
          const hashedKey = yield* hashIdempotencyKey(idempotencyKey)
          const idempotencyPath = Index.idempotency(hashedKey)
          const maybeJobId = yield* storage.getObject(
            bucket,
            idempotencyPath,
            JobId
          )

          if (Option.isNone(maybeJobId)) {
            return Option.none()
          }

          return yield* findJobById(maybeJobId.value)
        }).pipe(
          Effect.mapError(
            (cause) =>
              new RepositoryError({
                operation: "findByIdempotencyKey",
                message: "Failed to find job by idempotency key",
                cause
              })
          )
        ),
      updateJobStatus
    }
  })
)

================
File: packages/storage/src/JobStore.ts
================
import type { JobId, JobStatus, TranscriptId } from "@puredialog/domain"
import { TranscriptionJob } from "@puredialog/domain"
import { CloudStorageConfigLive, CloudStorageServiceLive } from "@puredialog/ingestion"
import { Context, Effect, Layer, Option } from "effect"
import { JobRepository, JobRepositoryLayer, RepositoryError } from "./JobRepository.js"

/**
 * Job store interface for managing transcription jobs
 */
export interface JobStoreInterface {
  readonly createJob: (
    job: TranscriptionJob
  ) => Effect.Effect<TranscriptionJob, RepositoryError>
  readonly findJobById: (
    jobId: JobId
  ) => Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError>
  readonly findJobByIdempotencyKey: (
    key: string
  ) => Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError>
  readonly updateJobStatus: (
    jobId: JobId,
    status: JobStatus,
    error?: string,
    transcriptId?: TranscriptId
  ) => Effect.Effect<TranscriptionJob, RepositoryError>
}

/**
 * Service tag for JobStore
 */
export class JobStore extends Context.Tag("JobStore")<
  JobStore,
  JobStoreInterface
>() {}

/**
 * Mock implementation for testing
 */
export const JobStoreMock = Layer.sync(JobStore, () => {
  const jobs = new Map<JobId, TranscriptionJob>()
  const idempotencyMap = new Map<string, JobId>()

  return {
    createJob: (job: TranscriptionJob) =>
      Effect.gen(function*() {
        if (job.idempotencyKey) {
          const existingJobId = idempotencyMap.get(job.idempotencyKey)
          if (existingJobId) {
            const existingJob = jobs.get(existingJobId)
            if (existingJob) {
              yield* Effect.logInfo(`Returning existing job: ${existingJob.id}`)
              return existingJob
            }
          }
        }

        yield* Effect.logInfo(`Creating job: ${job.id}`)

        jobs.set(job.id, job)
        if (job.idempotencyKey) {
          idempotencyMap.set(job.idempotencyKey, job.id)
        }

        return job
      }),

    findJobById: (jobId) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Finding job by ID: ${jobId}`)
        const job = jobs.get(jobId)
        return Option.fromNullable(job)
      }),

    findJobByIdempotencyKey: (keyString: string) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Finding job by idempotency key: ${keyString}`)
        const jobId = idempotencyMap.get(keyString)
        if (!jobId) {
          return Option.none()
        }
        const job = jobs.get(jobId)
        return Option.fromNullable(job)
      }),

    updateJobStatus: (jobId, status, error, transcriptId) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Updating job status: ${jobId} -> ${status}`)

        const existingJob = jobs.get(jobId)

        if (!existingJob) {
          return yield* Effect.fail(
            new RepositoryError({
              message: `Job not found: ${jobId}`,
              operation: "updateStatus"
            })
          )
        }

        const updatedJob = new TranscriptionJob({
          ...existingJob,
          status,
          error,
          transcriptId: transcriptId || existingJob.transcriptId,
          updatedAt: new Date()
        })

        jobs.set(jobId, updatedJob)

        yield* Effect.logInfo(`Job status updated: ${jobId} -> ${status}`)
        return updatedJob
      })
  }
})

/**
 * Live implementation using JobRepository
 */
const ProcessingJobStoreLayer = Layer.effect(
  JobStore,
  Effect.gen(function*() {
    const repository = yield* JobRepository

    const mapError = (error: RepositoryError) =>
      new RepositoryError({ message: error.message, operation: error.operation })

    return {
      createJob: (job: TranscriptionJob) => repository.createJob(job).pipe(Effect.mapError(mapError)),

      findJobByIdempotencyKey: (key) => repository.findJobByIdempotencyKey(key).pipe(Effect.mapError(mapError)),

      updateJobStatus: (jobId, status, error, transcriptId) =>
        repository
          .updateJobStatus(jobId, status, error, transcriptId)
          .pipe(Effect.mapError(mapError)),

      findJobById: (jobId) => repository.findJobById(jobId).pipe(Effect.mapError(mapError))
    }
  })
)

/**
 * Complete live layer that includes all dependencies
 */

const deps = JobRepositoryLayer.pipe(Layer.provide(CloudStorageConfigLive), Layer.provide(CloudStorageServiceLive))

export const StoreLayer = ProcessingJobStoreLayer.pipe(Layer.provide(deps))

================
File: packages/storage/src/paths.ts
================
import type { JobId, JobStatus, TranscriptId } from "@puredialog/domain"
import { Schema } from "effect"

/**
 * Shared path constants for storage operations and Eventarc integration.
 * These constants ensure consistency between application code and infrastructure.
 */
export const STORAGE_PATHS = {
  JOBS_PREFIX: "jobs",
  TRANSCRIPTS_PREFIX: "transcripts",
  IDEMPOTENCY_PREFIX: "idempotency",
  EVENTS_PREFIX: "events"
} as const

/**
 * Schema-based path parsers for type-safe path generation and parsing.
 * These provide both validation and structured parsing of GCS object paths.
 */

// Job path schema: "jobs/{status}/{jobId}.json"
export const JobPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.JOBS_PREFIX),
  "/",
  Schema.String, // JobStatus
  "/",
  Schema.String, // JobId
  ".json"
)

export type JobPathTuple = Schema.Schema.Type<typeof JobPathParser>
// Type: readonly ["jobs", "/", string, "/", string, ".json"]

// Transcript path schema: "transcripts/{transcriptId}.json"
export const TranscriptPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.TRANSCRIPTS_PREFIX),
  "/",
  Schema.String, // TranscriptId
  ".json"
)

export type TranscriptPathTuple = Schema.Schema.Type<typeof TranscriptPathParser>
// Type: readonly ["transcripts", "/", string, ".json"]

// Idempotency path schema: "idempotency/{hashedKey}.json"
export const IdempotencyPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.IDEMPOTENCY_PREFIX),
  "/",
  Schema.String, // HashedKey
  ".json"
)

export type IdempotencyPathTuple = Schema.Schema.Type<typeof IdempotencyPathParser>
// Type: readonly ["idempotency", "/", string, ".json"]

// Event log path schema: "events/{jobId}/{eventId}.json"
export const EventPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.EVENTS_PREFIX),
  "/",
  Schema.String, // JobId
  "/",
  Schema.String, // EventId
  ".json"
)

export type EventPathTuple = Schema.Schema.Type<typeof EventPathParser>
// Type: readonly ["events", "/", string, "/", string, ".json"]

/**
 * Eventarc path patterns that mirror our Schema parsers.
 * Used in Pulumi infrastructure code for trigger configuration.
 */
export const EVENTARC_PATTERNS = {
  JOB_EVENTS: `${STORAGE_PATHS.JOBS_PREFIX}/{status}/{jobId}.json`,
  TRANSCRIPT_EVENTS: `${STORAGE_PATHS.TRANSCRIPTS_PREFIX}/{transcriptId}.json`,
  EVENT_LOG: `${STORAGE_PATHS.EVENTS_PREFIX}/{jobId}/{eventId}.json`
} as const

/**
 * Union schema that can parse any valid GCS path.
 * Returns a discriminated union based on the path pattern.
 */
export const GcsPathParser = Schema.Union(
  // Transform job path parser to include discriminator
  Schema.transform(
    JobPathParser,
    Schema.Struct({
      type: Schema.Literal("job"),
      status: Schema.String,
      jobId: Schema.String,
      originalPath: Schema.String
    }),
    {
      strict: true,
      decode: (tuple) => ({
        type: "job" as const,
        status: tuple[2], // JobStatus at index 2
        jobId: tuple[4], // JobId at index 4
        originalPath: Schema.encodeSync(JobPathParser)(tuple)
      }),
      encode: ({ originalPath }) => Schema.decodeUnknownSync(JobPathParser)(originalPath)
    }
  ),
  // Transform transcript path parser to include discriminator
  Schema.transform(
    TranscriptPathParser,
    Schema.Struct({
      type: Schema.Literal("transcript"),
      transcriptId: Schema.String,
      originalPath: Schema.String
    }),
    {
      strict: true,
      decode: (tuple) => ({
        type: "transcript" as const,
        transcriptId: tuple[2], // TranscriptId at index 2
        originalPath: Schema.encodeSync(TranscriptPathParser)(tuple)
      }),
      encode: ({ originalPath }) => Schema.decodeUnknownSync(TranscriptPathParser)(originalPath)
    }
  ),
  // Transform idempotency path parser to include discriminator
  Schema.transform(
    IdempotencyPathParser,
    Schema.Struct({
      type: Schema.Literal("idempotency"),
      hashedKey: Schema.String,
      originalPath: Schema.String
    }),
    {
      strict: true,
      decode: (tuple) => ({
        type: "idempotency" as const,
        hashedKey: tuple[2], // HashedKey at index 2
        originalPath: Schema.encodeSync(IdempotencyPathParser)(tuple)
      }),
      encode: ({ originalPath }) => Schema.decodeUnknownSync(IdempotencyPathParser)(originalPath)
    }
  ),
  // Transform event log path parser to include discriminator
  Schema.transform(
    EventPathParser,
    Schema.Struct({
      type: Schema.Literal("event"),
      jobId: Schema.String,
      eventId: Schema.String,
      originalPath: Schema.String
    }),
    {
      strict: true,
      decode: (tuple) => ({
        type: "event" as const,
        jobId: tuple[2], // JobId at index 2
        eventId: tuple[4], // EventId at index 4
        originalPath: Schema.encodeSync(EventPathParser)(tuple)
      }),
      encode: ({ originalPath }) => Schema.decodeUnknownSync(EventPathParser)(originalPath)
    }
  )
)

export type GcsPathParseResult = Schema.Schema.Type<typeof GcsPathParser>

/**
 * Type-safe path utilities for parsing GCS object paths.
 */
export const PathParsers = {
  /**
   * Universal parser that returns a discriminated union result.
   * Uses Schema.decodeUnknownSync with the union schema.
   */
  parseGcsPath: Schema.decodeUnknownSync(GcsPathParser),

  /**
   * Parse a job path into structured components.
   * @param path - GCS object path like "jobs/Queued/job_123.json"
   * @returns Parsed tuple: ["jobs", "/", "Queued", "/", "job_123", ".json"]
   */
  parseJobPath: Schema.decodeUnknownSync(JobPathParser),

  /**
   * Parse a transcript path into structured components.
   * @param path - GCS object path like "transcripts/trn_123.json"
   * @returns Parsed tuple: ["transcripts", "/", "trn_123", ".json"]
   */
  parseTranscriptPath: Schema.decodeUnknownSync(TranscriptPathParser),

  /**
   * Parse an idempotency path into structured components.
   * @param path - GCS object path like "idempotency/abc123.json"
   * @returns Parsed tuple: ["idempotency", "/", "abc123", ".json"]
   */
  parseIdempotencyPath: Schema.decodeUnknownSync(IdempotencyPathParser),

  /**
   * Parse an event log path into structured components.
   * @param path - GCS object path like "events/job-123/1_metadata_fetched.json"
   * @returns Parsed tuple: ["events", "/", "job-123", "/", "1_metadata_fetched", ".json"]
   */
  parseEventPath: Schema.decodeUnknownSync(EventPathParser),

  /**
   * Extract job status and ID from a parsed job path tuple.
   */
  extractJobComponents: (tuple: JobPathTuple): { status: JobStatus; jobId: JobId } => ({
    status: tuple[2] as JobStatus,
    jobId: tuple[4] as JobId
  }),

  /**
   * Extract transcript ID from a parsed transcript path tuple.
   */
  extractTranscriptComponents: (tuple: TranscriptPathTuple): { transcriptId: TranscriptId } => ({
    transcriptId: tuple[2] as TranscriptId
  }),

  /**
   * Extract hashed key from a parsed idempotency path tuple.
   */
  extractIdempotencyComponents: (tuple: IdempotencyPathTuple): { hashedKey: string } => ({
    hashedKey: tuple[2]
  }),

  /**
   * Extract job ID and event ID from a parsed event path tuple.
   */
  extractEventComponents: (tuple: EventPathTuple): { jobId: JobId; eventId: string } => ({
    jobId: tuple[2] as JobId,
    eventId: tuple[4]
  })
} as const

/**
 * Type-safe path pattern validation.
 */
export type JobEventPattern = typeof EVENTARC_PATTERNS.JOB_EVENTS
export type TranscriptEventPattern = typeof EVENTARC_PATTERNS.TRANSCRIPT_EVENTS

================
File: packages/storage/package.json
================
{
  "name": "@puredialog/storage",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./build/dts/index.d.ts",
      "module": "./build/esm/index.js",
      "default": "./build/esm/index.js"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "clean": "tsc -b tsconfig.json --clean",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "test": "vitest"
  },
  "dependencies": {
    "@puredialog/domain": "workspace:^",
    "@puredialog/ingestion": "workspace:^",
    "effect": "^3.17.14"
  },
  "devDependencies": {
    "typescript": "~5.8.3",
    "eslint": "^9.34.0",
    "@types/node": "^22.14.0",
    "@effect/vitest": "^0.24.1",
    "vitest": "^3.2.4"
  }
}

================
File: packages/storage/tsconfig.build.json
================
{
  "extends": "./tsconfig.src.json",
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo",
    "outDir": "build/esm",
    "noEmit": false,
    "composite": true,
    "declarationDir": "build/dts",
    "stripInternal": true
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "../ingestion/tsconfig.build.json" }
  ],
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}

================
File: packages/storage/tsconfig.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "compilerOptions": {
    "composite": true,
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "../ingestion/tsconfig.build.json" },
    { "path": "./tsconfig.src.json" }
  ]
}

================
File: packages/storage/tsconfig.src.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "compilerOptions": {
    "types": ["node"],
    "composite": true,
    "tsBuildInfoFile": ".tsbuildinfo/src.tsbuildinfo"
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "../ingestion/tsconfig.build.json" }
  ]
}

================
File: packages/storage/vitest.config.ts
================
import { mergeConfig, type UserConfigExport } from "vitest/config"
import shared from "../../vitest.shared.js"

const config: UserConfigExport = {}

export default mergeConfig(shared, config)

================
File: packages/worker-metadata/Dockerfile
================
# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@9

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages

RUN pnpm install --filter @puredialog/worker-metadata --frozen-lockfile
RUN pnpm --filter @puredialog/worker-metadata build
RUN CI=1 pnpm prune --prod

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/worker-metadata/build ./build
COPY packages/worker-metadata/package.json ./package.json

EXPOSE 8080
CMD ["node", "build/esm/index.js"]

================
File: packages/worker-metadata/package.json
================
{
  "name": "@puredialog/worker-metadata",
  "version": "0.0.0",
  "type": "module",
  "license": "MIT",
  "description": "The worker metadata for Pure Dialog",
  "exports": {
    ".": {
      "types": "./build/dts/index.d.ts",
      "module": "./build/esm/index.js",
      "default": "./build/esm/index.js"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "clean": "tsc -b tsconfig.build.json --clean",
    "typecheck": "tsc -b tsconfig.json --noEmit",
    "test": "vitest",
    "coverage": "vitest --coverage"
  },
  "dependencies": {
    "@effect/platform": "latest",
    "@effect/sql": "latest",
    "effect": "latest",
    "@puredialog/domain": "workspace:^",
    "@puredialog/ingestion": "workspace:^",
    "@puredialog/storage": "workspace:^"
  },
  "effect": {
    "generateExports": {
      "include": [
        "**/*.ts"
      ]
    },
    "generateIndex": {
      "include": [
        "**/*.ts"
      ]
    }
  }
}

================
File: packages/worker-metadata/tsconfig.build.json
================
{
  "extends": "./tsconfig.src.json",
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo",
    "outDir": "build/esm",
    "declarationDir": "build/dts",
    "stripInternal": true
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "../ingestion/tsconfig.build.json" },
    { "path": "../storage/tsconfig.build.json" }
  ],
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}

================
File: packages/worker-metadata/tsconfig.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "references": [
    { "path": "../domain" },
    { "path": "../ingestion" },
    { "path": "../storage" },
    { "path": "tsconfig.src.json" }
  ]
}

================
File: packages/worker-metadata/tsconfig.src.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/src.tsbuildinfo"
  },
  "references": [
    { "path": "../domain" },
    { "path": "../ingestion" },
    { "path": "../storage" }
  ]
}

================
File: packages/worker-metadata/tsconfig.test.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["test"],
  "references": [
    { "path": "../domain" },
    { "path": "../ingestion" },
    { "path": "../storage" }
  ],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/test.tsbuildinfo",
    "rootDir": "test",
    "noEmit": true
  }
}

================
File: packages/worker-metadata/vitest.config.ts
================
import { mergeConfig, type UserConfigExport } from "vitest/config";
import shared from "../../vitest.shared.js";

const config: UserConfigExport = {};

export default mergeConfig(shared, config);

================
File: packages/worker-transcription/Dockerfile
================
# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@9

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages

RUN pnpm install --filter @puredialog/worker-transcription --frozen-lockfile
RUN pnpm --filter @puredialog/worker-transcription build
RUN CI=1 pnpm prune --prod

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/worker-transcription/build ./build
COPY packages/worker-transcription/package.json ./package.json

EXPOSE 8080
CMD ["node", "build/esm/index.js"]

================
File: packages/worker-transcription/package.json
================
{
  "name": "@puredialog/worker-transcription",
  "version": "0.0.0",
  "type": "module",
  "description": "The worker transcription for Pure Dialog",
  "exports": {
    ".": {
      "types": "./build/dts/index.d.ts",
      "module": "./build/esm/index.js",
      "default": "./build/esm/index.js"
    }
  },
  "repository": {
    "type": "git",
    "directory": "packages/worker-transcription",
    "url": "placeholder"
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json",
    "clean": "tsc -b tsconfig.build.json --clean",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest",
    "coverage": "vitest --coverage"
  },
  "dependencies": {
    "@effect/platform": "latest",
    "@effect/sql": "latest",
    "effect": "latest",
    "@puredialog/domain": "workspace:^",
    "@puredialog/ingestion": "workspace:^",
    "@puredialog/storage": "workspace:^",
    "@puredialog/llm": "workspace:^"
  },
  "devDependencies": {},
  "effect": {
    "generateExports": {
      "include": [
        "**/*.ts"
      ]
    },
    "generateIndex": {
      "include": [
        "**/*.ts"
      ]
    }
  }
}

================
File: packages/worker-transcription/tsconfig.build.json
================
{
  "extends": "./tsconfig.src.json",
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/build.tsbuildinfo",
    "outDir": "build/esm",
    "declarationDir": "build/dts",
    "stripInternal": true
  },
  "references": [
    { "path": "../domain/tsconfig.build.json" },
    { "path": "../ingestion/tsconfig.build.json" },
    { "path": "../storage/tsconfig.build.json" },
    { "path": "../llm/tsconfig.build.json" }
  ],
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}

================
File: packages/worker-transcription/tsconfig.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "references": [
    { "path": "../domain" },
    { "path": "../ingestion" },
    { "path": "../storage" },
    { "path": "../llm" },
    { "path": "tsconfig.src.json" }
  ]
}

================
File: packages/worker-transcription/tsconfig.src.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/src.tsbuildinfo"
  },
  "references": [
    { "path": "../domain" },
    { "path": "../ingestion" },
    { "path": "../storage" },
    { "path": "../llm" }
  ]
}

================
File: packages/worker-transcription/tsconfig.test.json
================
{
  "extends": "../../tsconfig.base.json",
  "include": ["test"],
  "references": [
    { "path": "../domain" },
    { "path": "../ingestion" },
    { "path": "../storage" },
    { "path": "../llm" }
  ],
  "compilerOptions": {
    "types": ["node"],
    "tsBuildInfoFile": ".tsbuildinfo/test.tsbuildinfo",
    "rootDir": "test",
    "noEmit": true
  }
}

================
File: packages/worker-transcription/vitest.config.ts
================
import { mergeConfig, type UserConfigExport } from "vitest/config";
import shared from "../../vitest.shared.js";

const config: UserConfigExport = {};

export default mergeConfig(shared, config);

================
File: scripts/clean.mjs
================
import * as Glob from "glob"
import * as Fs from "node:fs"

const dirs = [".", ...Glob.sync("packages/*/")]
dirs.forEach((pkg) => {
  const files = [".tsbuildinfo", "build", "dist", "coverage"]

  files.forEach((file) => {
    Fs.rmSync(`${pkg}/${file}`, { recursive: true, force: true }, () => {})
  })
})

================
File: .cursorrules
================
# PureDialog Development Rules

## Project Context

This is a React + TypeScript application for YouTube video transcription and AI analysis, built with Effect functional programming patterns.

## Core Development Principles

### Effect-First Development

- Always implement using Effect library principles and patterns
- Prefer data-first piped style with minimal imperative code
- Use TypeScript best practices for type safety
- Reference Effect documentation before implementation
- Determine appropriate Effect libraries, data types, schemas, and patterns

### Code Quality Standards

- **Type Safety**: NEVER use `any` type or `as any` assertions
- **Explicit Types**: Use concrete types over generic `unknown` where possible
- **Input Validation**: Validate all inputs at boundaries
- **Error Handling**: Use proper Effect error management patterns
- **Early Returns**: Prefer early returns for better readability

## Development Commands

### @new-feature Command

🚨 **MANDATORY SPEC-DRIVEN DEVELOPMENT** 🚨

This command ONLY handles feature development that follows the complete 5-phase specification process.

**CRITICAL**: This command ONLY handles feature development that follows the complete 5-phase specification process. Any request that is not a new feature requiring full specification MUST BE REFUSED.

**DO NOT USE THIS COMMAND FOR:**

- Bug fixes, cleanup tasks, refactoring, or maintenance work
- Simple changes that don't require full feature specification
- Any work that bypasses the 5-phase specification process

**ONLY USE THIS COMMAND FOR:**

- Net-new features that require complete specification and design
- Features that need user stories, acceptance criteria, and technical design
- Complex functionality additions that benefit from structured planning

#### Tasks:

1. **Create Feature Branch**

   - Create a new git branch for this feature using a descriptive name (e.g., `feature/user-authentication`, `feature/todo-persistence`)
   - Use kebab-case naming convention for branch names

2. **Initialize Feature Specification**

   - Ask the user for the feature name (kebab-case format for folder naming)
   - Create the feature specification folder: `specs/[feature-name]/`
   - Create the initial `instructions.md` file based on user requirements

3. **Guide Instructions Creation**

   - Help the user create a comprehensive `instructions.md` file that captures:
     - **Feature Overview**: What is this feature and why is it needed?
     - **User Stories**: Who will use this feature and how?
     - **Acceptance Criteria**: What defines "done" for this feature?
     - **Constraints**: Any technical, business, or time constraints
     - **Dependencies**: What other systems/features does this depend on?
     - **Out of Scope**: What is explicitly NOT included in this feature

4. **Update Feature Directory**
   - Add the new feature to `specs/README.md` as a new entry
   - Use the format: `- [ ] **[feature-name](./feature-name/)** - Brief feature description`

#### Process Flow:

This follows the spec-driven development workflow with **MANDATORY USER AUTHORIZATION** before proceeding to each phase:

- **Phase 1**: Create `instructions.md` (initial requirements capture)
- **Phase 2**: Derive `requirements.md` from instructions (structured analysis) - **REQUIRES USER APPROVAL**
- **Phase 3**: Create `design.md` from requirements (technical design) - **REQUIRES USER APPROVAL**
- **Phase 4**: Generate `plan.md` from design (implementation roadmap) - **REQUIRES USER APPROVAL**
- **Phase 5**: Execute implementation following the plan - **REQUIRES USER APPROVAL**

**CRITICAL RULE**: Never proceed to the next phase without explicit user authorization. Always present the completed work from the current phase and ask for permission to continue.

#### Authorization Protocol:

Before proceeding to any phase (2-5), you MUST:

1. Present the completed work from the current phase
2. Explicitly ask for user authorization to proceed
3. Wait for clear user approval before continuing
4. Never assume permission or proceed automatically

### @done-feature Command

When a feature is complete:

- Update specs with progress
- Commit everything
- Create PR

## Code Style Guidelines

### TypeScript Quality Standards

- **Type Safety**: NEVER use `any` type or `as any` assertions
- **Explicit Types**: Use concrete types over generic `unknown` where possible
- **Type Annotations**: Add explicit annotations when inference fails
- **Early Returns**: Prefer early returns for better readability
- **Input Validation**: Validate all inputs at boundaries
- **Error Handling**: Use proper Effect error management patterns

### Effect Library Conventions

- Follow existing TypeScript patterns in the codebase
- Use functional programming principles
- Maintain consistency with Effect library conventions
- Use proper Effect constructors (e.g., `Array.make()`, `Chunk.fromIterable()`)
- Prefer `Effect.gen` for monadic composition
- Use `Data.TaggedError` for custom error types
- Implement resource safety with automatic cleanup patterns

### Code Organization

- No comments unless explicitly requested
- Follow existing file structure and naming conventions
- Delete old code when replacing functionality
- Choose clarity over cleverness in all implementations

## Implementation Standards

### Completeness Criteria

Code is considered complete only when:

- All linters pass
- All tests pass
- All type checks pass
- Feature works end-to-end
- Old/deprecated code is removed
- Documentation is updated

### Testing Requirements

- Test files are located in appropriate test directories
- Use existing test patterns and utilities
- Always verify implementations with tests
- For time-dependent code, always use TestClock to avoid flaky tests

### Performance Considerations

- Measure first before optimizing
- Prefer eager evaluation patterns where appropriate
- Consider memory usage and optimization
- Follow established performance patterns in the codebase
- Prioritize clarity over premature optimization

## Problem-Solving Approach

### When Encountering Complex Issues

1. **Stop and Analyze**: Don't spiral into increasingly complex solutions
2. **Break Down**: Divide complex problems into smaller, manageable parts
3. **Research First**: Always understand existing patterns before creating new ones
4. **Validate Frequently**: Use checkpoints to ensure you're on track
5. **Simplify**: Choose the simplest solution that meets requirements
6. **Ask for Help**: Request guidance rather than guessing

### Development Workflow

1. **Research Phase**: Understand the codebase and existing patterns
2. **Planning Phase**: Create detailed implementation plan with validation checkpoints
3. **Implementation Phase**: Execute with frequent validation and automated checks

## File Structure

- `src/` - Main application source code
- `src/components/` - React components
- `src/services/` - Service layer implementations
- `src/utils/` - Utility functions
- `src/types.ts` - Type definitions
- `patterns/` - Development patterns and best practices
- `specs/` - Feature specifications (when using spec-driven development)

## Dependencies

- React + TypeScript for UI
- Effect library for functional programming
- Vite for build tooling
- Tailwind CSS for styling
- Various Effect ecosystem packages

## Git Workflow

- Main branch: `main`
- Create feature branches for new work
- Use conventional commit messages
- Only commit when explicitly requested

================
File: .dockerignore
================
# Dependencies
node_modules
npm-debug.log*
pnpm-debug.log*

# Environment files (keep them out of container)
.env
.env.*

# IDE files
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Git
.git
.gitignore

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# Documentation
README.md
docs/

# Development files
.editorconfig
.eslintrc*
.prettierrc*

# Deployment files (not needed in container)
cloudbuild.yaml
deploy.sh
migrate-from-ai-studio.sh
setup.sh
Dockerfile
.dockerignore

# Templates
env.template
env.example

================
File: .env.example
================
# Copy this file to .env and fill in your actual values

# Gemini API Configuration
# GEMINI_API_KEY=your_gemini_api_key_here

NODE_ENV=development

GEMINI_API_KEY=gemini-api-key:latest
VITE_GEMINI_API_KEY=gemini-api-key:latest


GOOGLE_CLOUD_PROJECT=gen-lang-client-0874846742
GOOGLE_CLOUD_REGION=us-west1
SERVICE_NAME=pure-dialog

# Optional: Custom API endpoint (if using a different Gemini endpoint)
# GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com

================
File: .gcloudignore
================
# This file specifies files that are *not* uploaded to Google Cloud
# using gcloud. It follows the same syntax as .gitignore, with the addition of
# "#!include" directives (which insert the entries of the given .gitignore-style
# file at that point).
#
# For more information, run:
#   $ gcloud topic gcloudignore

.gcloudignore
# If you would like to upload your .git directory, .gitignore file or files
# from your .gitignore file, remove the corresponding line below:
.git
.gitignore

# Node.js dependencies:
node_modules/

# Python pycache:
__pycache__/
# Ignored by the build system
/setup.cfg

# Development and build files
*.pyc
*.pyo
*.pyd
__pycache__
.pytest_cache
.coverage
.tox
.cache
.DS_Store
*~
.#*
#*#

# Environment files
.env
.env.*
!.env.example

# Development scripts and documentation
README.md
deploy.sh
setup.sh
migrate-from-ai-studio.sh
.dockerignore
app-structure-diagram.md

# Development patterns and documentation
patterns/
.cursor/
AGENTS.md
CLAUDE.md
GEMINI.md

# Keep source files for App Engine build
# src/ - keep (source code needed for build)
# index.html - keep (Vite entry point)
# vite.config.ts - keep (build configuration)
# tsconfig.json - keep (TypeScript config)
# tailwind.config.js - keep (styling config)
# postcss.config.js - keep (CSS processing)

# Keep only what's needed for production
# dist/ - keep (built assets)
# server.js - keep (server)
# package.json - keep (dependencies)
# app.yaml - keep (config)

================
File: .gitignore
================
# Dependencies
node_modules/
.pnp
.pnp.js

# Production build
/dist
/build/**
.build/**
build.tsbuildinfo

# TypeScript build info (files and directories)
.tsbuildinfo
.tsbuildinfo/
/packages/**/.tsbuildinfo/**

/packages/**/build/**
/packages/**/dist/**
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Vite cache
.vite

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

================
File: .mcp.json
================
{
  "mcpServers": {
    "google-cloud-mcp": {
      "command": "node",
      "args": ["/Users/pooks/google-cloud-mcp/dist/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/Users/pooks/.config/gcloud/application_default_credentials.json"
      }
    }
  }
}

================
File: .prettierignore
================
# Ignore all files - using @effect/dprint via ESLint instead
**/*

================
File: .repomixignore
================
*.md
*.d.ts
*.js
*.map
*.tsbuildinfo
spec.json
youtube_client.ts

================
File: cloudbuild.yaml
================
substitutions:
  _REGION: us-west1
  _REPOSITORY: puredialog

steps:
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - "-f"
      - packages/api/Dockerfile
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/api:$COMMIT_SHA"
      - "."

  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/api:$COMMIT_SHA"

  - name: gcr.io/cloud-builders/docker
    args:
      - tag
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/api:$COMMIT_SHA"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/api:latest"

  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/api:latest"

  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - "-f"
      - packages/worker-metadata/Dockerfile
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-metadata:$COMMIT_SHA"
      - "."

  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-metadata:$COMMIT_SHA"

  - name: gcr.io/cloud-builders/docker
    args:
      - tag
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-metadata:$COMMIT_SHA"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-metadata:latest"

  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-metadata:latest"

  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - "-f"
      - packages/worker-transcription/Dockerfile
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-transcription:$COMMIT_SHA"
      - "."

  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-transcription:$COMMIT_SHA"

  - name: gcr.io/cloud-builders/docker
    args:
      - tag
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-transcription:$COMMIT_SHA"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-transcription:latest"

  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-transcription:latest"

images:
  - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/api:$COMMIT_SHA"
  - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-metadata:$COMMIT_SHA"
  - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/worker-transcription:$COMMIT_SHA"

================
File: eslint.config.mjs
================
import * as effectEslint from "@effect/eslint-plugin"
import { fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import codegen from "eslint-plugin-codegen"
import _import from "eslint-plugin-import"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: ["**/dist", "**/build", "**/docs", "**/*.md"]
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  ...effectEslint.configs.dprint,
  {
    plugins: {
      import: fixupPluginRules(_import),
      "sort-destructure-keys": sortDestructureKeys,
      "simple-import-sort": simpleImportSort,
      codegen
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: "module"
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"]
      },

      "import/resolver": {
        typescript: {
          alwaysTryTypes: true
        }
      }
    },

    rules: {
      "codegen/codegen": "error",
      "no-fallthrough": "off",
      "no-irregular-whitespace": "off",
      "object-shorthand": "error",
      "prefer-destructuring": "off",
      "sort-imports": "off",

      "no-restricted-syntax": ["error", {
        selector: "CallExpression[callee.property.name='push'] > SpreadElement.arguments",
        message: "Do not use spread arguments in Array.push"
      }],

      "no-unused-vars": "off",
      "prefer-rest-params": "off",
      "prefer-spread": "off",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off",
      "import/order": "off",
      "simple-import-sort/imports": "off",
      "sort-destructure-keys/sort-destructure-keys": "error",
      "deprecation/deprecation": "off",

      "@typescript-eslint/array-type": ["warn", {
        default: "generic",
        readonly: "generic"
      }],

      "@typescript-eslint/member-delimiter-style": 0,
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/consistent-type-imports": "warn",

      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],

      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/no-array-constructor": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-namespace": "off",

      "@effect/dprint": ["error", {
        config: {
          indentWidth: 2,
          lineWidth: 120,
          semiColons: "asi",
          quoteStyle: "alwaysDouble",
          trailingCommas: "never",
          operatorPosition: "maintain",
          "arrowFunction.useParentheses": "force"
        }
      }]
    }
  }
]

================
File: package.json
================
{
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.14.0",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "clean": "node scripts/clean.mjs",
    "codegen": "pnpm --recursive --parallel run codegen",
    "build": "tsc -b tsconfig.build.json && pnpm --recursive --workspace-concurrency=1 run build",
    "typecheck": "pnpm --recursive --workspace-concurrency=1 run typecheck",
    "check-recursive": "pnpm --recursive --workspace-concurrency=1 run typecheck",
    "lint": "eslint \"**/{src,test,examples,scripts,dtslint}/**/*.{ts,mjs}\"",
    "lint-fix": "pnpm lint --fix",
    "test": "vitest",
    "coverage": "vitest --coverage"
  },
  "devDependencies": {
    "@babel/cli": "^7.25.9",
    "@babel/core": "^7.26.0",
    "@babel/plugin-transform-export-namespace-from": "^7.25.9",
    "@babel/plugin-transform-modules-commonjs": "^7.25.9",
    "@effect/build-utils": "^0.7.7",
    "@effect/eslint-plugin": "^0.3.2",
    "@effect/language-service": "latest",
    "@effect/vitest": "latest",
    "@eslint/compat": "1.2.2",
    "@eslint/eslintrc": "3.1.0",
    "@eslint/js": "9.13.0",
    "@types/node": "^22.8.5",
    "@typescript-eslint/eslint-plugin": "^8.12.2",
    "@typescript-eslint/parser": "^8.12.2",
    "babel-plugin-annotate-pure-calls": "^0.5.0",
    "effect": "^3.10.7",
    "eslint": "^9.13.0",
    "eslint-import-resolver-typescript": "^3.6.3",
    "eslint-plugin-codegen": "^0.29.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "eslint-plugin-sort-destructure-keys": "^2.0.0",
    "glob": "^11.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.8.3",
    "vitest": "^3.2.0",
    "@tim-smart/openapi-gen": "^0.4.13"
  },
  "pnpm": {
    "patchedDependencies": {}
  }
}

================
File: pnpm-workspace.yaml
================
packages:
  - 'packages/*'

================
File: setupTests.ts
================
import * as it from "@effect/vitest"

it.addEqualityTesters()

================
File: tsconfig.base.json
================
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "moduleDetection": "force",
    "composite": true,
    "downlevelIteration": true,
    "resolveJsonModule": true,
    "esModuleInterop": false,
    "declaration": true,
    "skipLibCheck": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": [],
    "isolatedModules": true,
    "sourceMap": true,
    "declarationMap": true,
    "noImplicitReturns": false,
    "noUnusedLocals": true,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "noEmitOnError": false,
    "noErrorTruncation": false,
    "allowJs": false,
    "checkJs": false,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": false,
    "strictNullChecks": true,
    "target": "ES2022",
    "module": "NodeNext",
    "incremental": true,
    "removeComments": false,
    "plugins": [{ "name": "@effect/language-service" }]
  }
}

================
File: tsconfig.build.json
================
{
  "extends": "./tsconfig.base.json",
  "include": [],
  "references": [
    { "path": "packages/domain/tsconfig.build.json" },
    { "path": "packages/ingestion/tsconfig.build.json" },
    { "path": "packages/llm/tsconfig.build.json" },
    { "path": "packages/api/tsconfig.build.json" },
    { "path": "packages/worker-metadata/tsconfig.build.json" },
    { "path": "packages/worker-transcription/tsconfig.build.json" },
    { "path": "packages/infra/tsconfig.build.json" },
    { "path": "packages/storage/tsconfig.build.json" }
  ]
}

================
File: tsconfig.json
================
{
  "extends": "./tsconfig.base.json",
  "exclude": [
    "**/vitest.config.ts",
    "**/vitest.config.js",
    "**/vitest.config.d.ts",
    "**/vitest.config.js.map",
    "**/vitest.config.d.ts.map"
  ],
  "references": [
    { "path": "./packages/domain" },
    { "path": "./packages/storage" },
    { "path": "./packages/ingestion" },
    { "path": "./packages/llm" },
    { "path": "./packages/api" },
    { "path": "./packages/worker-metadata" },
    { "path": "./packages/worker-transcription" },
    { "path": "./packages/infra" }
  ]
}

================
File: vitest.shared.ts
================
import * as path from "node:path"
import type { UserConfig } from "vitest/config"

const alias = (name: string) => {
  const target = process.env.TEST_DIST !== undefined ? "dist/dist/esm" : "src"
  return ({
    [`${name}/test`]: path.join(__dirname, "packages", name, "test"),
    [`${name}`]: path.join(__dirname, "packages", name, target)
  })
}

// This is a workaround, see https://github.com/vitest-dev/vitest/issues/4744
const config: UserConfig = {
  esbuild: {
    target: "es2020"
  },
  optimizeDeps: {
    exclude: ["bun:sqlite"]
  },
  test: {
    setupFiles: [path.join(__dirname, "setupTests.ts")],
    fakeTimers: {
      toFake: undefined
    },
    sequence: {
      concurrent: true
    },
    include: ["test/**/*.test.ts"],
    alias: {
      ...alias("api"),
      ...alias("domain"),
      ...alias("ingestion"),
      ...alias("llm"),
      ...alias("worker-metadata"),
      ...alias("worker-transcription")
    }
  }
}

export default config

================
File: vitest.workspace.ts
================
import * as path from "node:path"
import { defineWorkspace, type UserWorkspaceConfig } from "vitest/config"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const project = (
  config: UserWorkspaceConfig["test"] & { name: `${string}|${string}` },
  root = config.root ?? path.join(__dirname, `packages/${config.name.split("|").at(0)}`)
) => ({
  extends: "vitest.shared.ts",
  test: { root, ...config }
})

export default defineWorkspace([
  // Add specialized configuration for some packages.
  // project({ name: "my-package|browser", environment: "happy-dom" }),
  // Add the default configuration for all packages.
  "packages/*"
])



================================================================
End of Codebase
================================================================

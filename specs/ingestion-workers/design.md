# Ingestion Workers: Technical Design

## 1. Architecture Overview

The ingestion workers implement a **state-triggered choreography pattern** using Google Cloud Run, Eventarc Advanced, and Google Cloud Storage:

```
API Service
  ↓ (write)
GCS: jobs/Queued/{jobId}.json
  ↓ (object.finalized event)
Eventarc MessageBus → Enrollment (CEL: startsWith("jobs/Queued/")) → Pipeline → worker-metadata
  ↓ (atomic move)
GCS: jobs/Processing/{jobId}.json + events/{jobId}/status_changed.json
  ↓ (object.finalized event)
Eventarc MessageBus → Enrollment (CEL: startsWith("jobs/Processing/")) → Pipeline → worker-transcription
  ↓ (atomic move)
GCS: jobs/Completed/{jobId}.json + events/{jobId}/transcript_complete.json + transcripts/{transcriptId}.json
```

### Core Design Principles

- **State-Triggered Choreography**: GCS directory structure acts as state machine; file moves trigger workers
- **CloudEvents over HTTP**: Eventarc Pipelines POST CloudEvents to worker HTTP endpoints
- **Atomic Transitions**: Write-then-delete pattern ensures no orphaned state
- **Immutable Event Log**: All state changes append to `events/` for audit trail
- **Shared Dependencies**: Both workers use `@puredialog/storage` for path utilities, `@puredialog/ingestion` for GCS clients
- **Stateless Workers**: Each worker is a standalone Cloud Run service with no local state
- **Effect-TS First**: Full integration with Effect ecosystem for type safety and composability

## 2. Worker Architecture Pattern

Both workers follow a consistent architectural pattern:

### HTTP Server Layer
```typescript
// src/server.ts
const server = NodeHttpServerLive.pipe(
  Layer.provide(
    HttpApiBuilder.api(WorkerApi).pipe(
      HttpApiBuilder.serve(Routes),
      Layer.provide(Dependencies)
    )
  )
)
```

### CloudEvents Processing Flow
```typescript
// Common pattern for both workers
const processCloudEvent = (event: WorkerCloudEventRequest) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const config = yield* Config
    
    // 1. Parse CloudEvent and extract job info
    const { jobId, status } = yield* extractJobFromSubject(event.subject)
    
    // 2. Validate event type
    yield* validateJobEvent(event)
    
    // 3. Read current job from GCS
    const maybeJob = yield* storage.getObject(
      config.bucket,
      Index.job(status, jobId),
      Jobs.TranscriptionJob
    )
    
    if (Option.isNone(maybeJob)) {
      return yield* Effect.fail(new WorkerProcessingError({
        message: "Job not found",
        jobId,
        phase: "validate",
        retryable: false
      }))
    }
    
    const job = maybeJob.value
    
    // 4. Process business logic
    const updatedJob = yield* processJob(job)
    
    // 5. Atomic state transition: write-then-delete
    const newPath = Index.job(updatedJob.status, jobId)
    const oldPath = Index.job(status, jobId)
    
    yield* storage.putObject(config.bucket, newPath, updatedJob)
    yield* storage.deleteObject(config.bucket, oldPath)
    
    // 6. Write immutable event log
    const eventId = `${Date.now()}_${updatedJob.status.toLowerCase()}`
    const eventPath = Index.event(jobId, eventId)
    yield* storage.putObject(config.bucket, eventPath, {
      type: "JobStatusChanged",
      jobId,
      from: status,
      to: updatedJob.status,
      timestamp: new Date()
    })
    
    // 7. Always return 200 (Eventarc expects success)
    return WorkerProcessingResponse.make({
      status: "processed",
      jobId,
      message: "Job processed successfully"
    })
  }).pipe(
    Effect.catchAll((error) =>
      // Move job to Failed/ on any error
      Effect.gen(function*() {
        const storage = yield* CloudStorageService
        const config = yield* Config
        
        const failedPath = Index.job("Failed", jobId)
        yield* storage.putObject(config.bucket, failedPath, {
          ...job,
          status: "Failed",
          error: String(error)
        })
        
        return WorkerErrorResponse.make({
          status: "error",
          error: String(error),
          retryable: false,
          jobId
        })
      })
    )
  )
```

## 3. worker-metadata Design

### CloudEvents Flow
1. **Receive**: CloudEvent from Eventarc Pipeline when object created at `jobs/Queued/{jobId}.json`
2. **Parse**: Extract jobId and status from CloudEvent subject field
3. **Process**: Fetch YouTube metadata and enrich job
4. **Transition**: Atomically move job file from `jobs/Queued/` to `jobs/Processing/`
5. **Log**: Write JobStatusChanged event to `events/{jobId}/`

### Core Logic Implementation
```typescript
// src/logic.ts
export const processMetadataJob = (job: Jobs.TranscriptionJob) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const youtubeClient = yield* YoutubeApiClient
    const config = yield* Config
    
    // 1. Validate job is in expected state
    if (job.status !== "Queued") {
      return yield* Effect.logWarning("Job already processed, skipping", {
        jobId: job.id,
        currentStatus: job.status
      }).pipe(Effect.as(job))
    }
    
    // 2. Fetch YouTube metadata
    const metadata = yield* Effect.gen(function*() {
      if (job.media.type !== "youtube") {
        return yield* Effect.fail(
          new WorkerProcessingError({
            message: "Unsupported media type",
            jobId: job.id,
            phase: "fetch",
            retryable: false
          })
        )
      }
      
      const videoId = job.media.data.id
      return yield* youtubeClient.getVideo(videoId)
    })
    
    // 3. Enrich job with metadata
    const enrichedJob = Jobs.TranscriptionJob.make({
      ...job,
      status: "Processing",
      metadata: {
        title: metadata.title,
        description: metadata.description,
        duration: metadata.duration,
        tags: metadata.tags
      },
      updatedAt: new Date()
    })
    
    return enrichedJob
  })
```

### Eventarc Enrollment Filter
The `worker-metadata` Enrollment uses CEL expression to filter for Queued jobs:
```cel
message.type == "google.cloud.storage.object.v1.finalized" && 
message.subject.startsWith("objects/jobs/Queued/")
```

## 4. worker-transcription Design

### CloudEvents Flow
1. **Receive**: CloudEvent from Eventarc Pipeline when object created at `jobs/Processing/{jobId}.json`
2. **Parse**: Extract jobId and status from CloudEvent subject field
3. **Process**: Generate transcript using LLM service (mock for now)
4. **Store**: Save transcript to `transcripts/{transcriptId}.json`
5. **Transition**: Atomically move job file from `jobs/Processing/` to `jobs/Completed/`
6. **Log**: Write TranscriptComplete event to `events/{jobId}/`

### Core Logic Implementation
```typescript
// src/logic.ts
export const processTranscriptionJob = (job: Jobs.TranscriptionJob) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const config = yield* Config
    
    // 1. Validate job is in expected state
    if (job.status !== "Processing") {
      return yield* Effect.logWarning("Job already processed, skipping", {
        jobId: job.id,
        currentStatus: job.status
      }).pipe(Effect.as(job))
    }
    
    // 2. Perform mock transcription
    const transcript = yield* Effect.gen(function*() {
      // Simulate transcription work
      yield* Effect.sleep(Duration.millis(500))
      
      const transcriptId = Core.TranscriptId.make(crypto.randomUUID())
      
      return Transcription.Transcript.make({
        id: transcriptId,
        jobId: job.id,
        mediaResource: job.media,
        rawText: "Mock transcript content",
        turns: [
          Transcription.DialogueTurn.make({
            timestamp: TimestampString.make("00:00:00"),
            speaker: "host",
            text: "Welcome to the show"
          })
        ],
        inferenceConfig: Transcription.InferenceConfig.make({
          model: "mock-model",
          temperature: 0.7
        }),
        generationPrompt: Transcription.GenerationPrompt.make({
          templateId: "default",
          templateVersion: "1.0",
          compiledText: "Mock prompt",
          compilationParams: {},
          compiledAt: new Date()
        }),
        transcriptionContext: job.transcriptionContext ?? {},
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })
    
    // 3. Store transcript in GCS
    const transcriptPath = Index.transcript(transcript.id)
    yield* storage.putObject(config.bucket, transcriptPath, transcript)
    
    // 4. Update job to completed
    const completedJob = Jobs.TranscriptionJob.make({
      ...job,
      status: "Completed",
      transcriptId: transcript.id,
      updatedAt: new Date()
    })
    
    return completedJob
  })
```

### Eventarc Enrollment Filter  
The `worker-transcription` Enrollment uses CEL expression to filter for Processing jobs:
```cel
message.type == "google.cloud.storage.object.v1.finalized" && 
message.subject.startsWith("objects/jobs/Processing/")
```

## 5. Error Handling Strategy

### Error Classification
- **Transient Errors**: Network timeouts, temporary API failures (Eventarc retries these)
- **Permanent Errors**: Invalid job data, authentication failures (move to Failed/)
- **System Errors**: Storage failures, configuration errors (move to Failed/)

### Error Response Pattern
```typescript
const handleError = (job: Jobs.TranscriptionJob, error: unknown, jobId: Core.JobId, currentStatus: Jobs.JobStatus) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const config = yield* Config
    
    // Move job to Failed state
    const failedJob = Jobs.TranscriptionJob.make({
      ...job,
      status: "Failed",
      error: String(error),
      updatedAt: new Date()
    })
    
    const failedPath = Index.job("Failed", jobId)
    const currentPath = Index.job(currentStatus, jobId)
    
    // Atomic transition to Failed
    yield* storage.putObject(config.bucket, failedPath, failedJob)
    yield* storage.deleteObject(config.bucket, currentPath).pipe(
      Effect.catchAll(() => Effect.void) // Ignore if already deleted
    )
    
    // Write JobFailed event to event log
    const eventId = `${Date.now()}_job_failed`
    const eventPath = Index.event(jobId, eventId)
    yield* storage.putObject(config.bucket, eventPath, Jobs.JobFailed.make({
      jobId,
      requestId: job.requestId,
      error: String(error),
      attempts: job.attempts,
      occurredAt: new Date()
    }))
    
    // Always return 200 to prevent Eventarc retries
    return Workers.WorkerErrorResponse.make({
      status: "error",
      error: String(error),
      retryable: false,
      jobId
    })
  })
```

### Idempotency Strategy

Workers must handle duplicate CloudEvents (Eventarc delivers at-least-once):

```typescript
const ensureIdempotency = (job: Jobs.TranscriptionJob, expectedStatus: Jobs.JobStatus) =>
  Effect.gen(function*() {
    // Skip if job has already advanced past expected state
    if (job.status !== expectedStatus) {
      yield* Effect.logInfo("Job already processed, skipping", {
        jobId: job.id,
        currentStatus: job.status,
        expectedStatus
      })
      return Option.none()
    }
    
    return Option.some(job)
  })
```

## 6. Configuration Design

### Environment Variables
Both workers require:
```bash
# Server
PORT=8080
NODE_ENV=production

# GCS Configuration  
GCS_PROJECT_ID=your-project-id
GCS_BUCKET=your-shared-bucket
GCS_KEY_FILE=/path/to/key.json  # Optional, uses ADC if not set

# YouTube API (metadata worker only)
YOUTUBE_API_KEY=your-youtube-api-key

# LLM Configuration (transcription worker only) 
GOOGLE_AI_API_KEY=your-gemini-api-key
```

### Config Service Pattern
```typescript
// src/config.ts
export class WorkerConfig extends Context.Tag("WorkerConfig")<
  WorkerConfig,
  {
    readonly port: number
    readonly storage: CloudStorageConfigInterface
    // Worker-specific config...
  }
>() {}

export const WorkerConfigLive = Layer.effect(
  WorkerConfig,
  Effect.gen(function*() {
    const port = yield* Config.number("PORT").pipe(Config.withDefault(8080))
    const projectId = yield* Config.string("GCS_PROJECT_ID")
    const bucket = yield* Config.string("GCS_BUCKET")
    const keyFile = yield* Config.string("GCS_KEY_FILE").pipe(
      Config.option,
      Effect.map(Option.getOrUndefined)
    )
    
    return {
      port,
      storage: {
        projectId,
        bucket,
        keyFilename: keyFile,
        retryOptions: {
          maxRetries: 3,
          backoffMultiplier: 2,
          maxDelayMs: 30000
        }
      }
    }
  })
)
```

## 7. Shared Storage Integration

### CloudStorageService Usage
Both workers use the shared `@puredialog/ingestion` CloudStorageService:

```typescript
import { Layer as IngestionLayer } from "@puredialog/ingestion"
import { Index } from "@puredialog/storage"

// Read job from current state directory
const maybeJob = yield* storage.getObject(
  bucket,
  Index.job("Queued", jobId),
  Jobs.TranscriptionJob
)

// Atomic state transition: write new, delete old
const newPath = Index.job("Processing", jobId)
const oldPath = Index.job("Queued", jobId)

yield* storage.putObject(bucket, newPath, updatedJob)
yield* storage.deleteObject(bucket, oldPath)

// Write immutable event log
const eventPath = Index.event(jobId, `${Date.now()}_status_changed`)
yield* storage.putObject(bucket, eventPath, domainEvent)
```

### Storage Path Utilities
```typescript
import { Index, PathParsers, extractJobFromSubject } from "@puredialog/storage"

// Extract job info from CloudEvent subject
const { jobId, status } = yield* extractJobFromSubject(event.subject)

// Generate consistent GCS paths
const jobPath = Index.job("Completed", jobId)
const transcriptPath = Index.transcript(transcriptId)
const eventPath = Index.event(jobId, eventId)

// Parse existing GCS paths
const parsed = PathParsers.parseJobPath("jobs/Queued/job_123.json")
const { jobId, status } = PathParsers.extractJobComponents(parsed)
```

## 8. Testing Strategy

### Test Architecture
- **Unit Tests**: Business logic functions in isolation
- **Integration Tests**: Full CloudEvent processing with mock dependencies
- **Contract Tests**: Verify CloudEvent schema compliance
- **Path Parsing Tests**: Validate subject extraction and path utilities

### Layer-Based Testing
```typescript
// test/logic.test.ts
import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Option } from "effect"

const TestStorageLayer = Layer.sync(CloudStorageService, () => ({
  getObject: (bucket, key, schema) => Effect.succeed(Option.some(testJob)),
  putObject: (bucket, key, data) => Effect.void,
  deleteObject: (bucket, key) => Effect.void,
  listObjects: (bucket, prefix) => Effect.succeed([]),
  objectExists: (bucket, key) => Effect.succeed(true)
}))

describe("Metadata Worker", () => {
  it.effect("should process metadata job successfully", () =>
    Effect.gen(function*() {
      const result = yield* processMetadataJob(testJob)
      
      assert.strictEqual(result.status, "Processing")
      assert.isTrue(result.metadata !== undefined)
    }).pipe(
      Effect.provide(Layer.mergeAll(
        TestStorageLayer,
        MockYoutubeClientLayer,
        TestConfigLayer
      ))
    )
  )
  
  it.effect("should handle CloudEvent parsing", () =>
    Effect.gen(function*() {
      const event = createTestCloudEvent("jobs/Queued/", "job_123")
      const { jobId, status } = yield* extractJobFromSubject(event.subject)
      
      assert.strictEqual(jobId, "job_123")
      assert.strictEqual(status, "Queued")
    })
  )
  
  it.effect("should skip already processed jobs", () =>
    Effect.gen(function*() {
      const processedJob = { ...testJob, status: "Processing" }
      const result = yield* processMetadataJob(processedJob)
      
      // Should return same job without processing
      assert.strictEqual(result.status, "Processing")
    })
  )
})
```

## 9. Deployment Architecture

### Container Strategy
Each worker is deployed as a separate Cloud Run service:

```dockerfile
# Dockerfile pattern for both workers
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

### Cloud Run Configuration
```typescript
// infra/index.ts
const metadataWorkerService = new gcp.cloudrun.v2.Service("worker-metadata", {
  location: CLOUD_RUN_REGION, // us-west1
  template: {
    containers: [{
      image: `${ARTIFACT_REGISTRY}/worker-metadata:${GIT_SHA}`,
      ports: [{ containerPort: 8080 }],
      env: [
        { name: "GCS_PROJECT_ID", value: projectId },
        { name: "GCS_BUCKET", value: sharedArtifactsBucket.name },
        { name: "YOUTUBE_API_KEY", valueSource: { secretKeyRef: { ... } } }
      ]
    }],
    serviceAccount: configuration.serviceAccountEmail,
    scaling: {
      minInstanceCount: 0,
      maxInstanceCount: 10
    }
  }
})
```

### Eventarc Advanced Configuration
```typescript
// Eventarc Pipeline to route events to worker
const metadataWorkerPipeline = new gcp.eventarc.Pipeline("metadata-worker-pipeline", {
  location: EVENTARC_LOCATION, // us-central1 (where MessageBus exists)
  project: projectId,
  pipelineId: "metadata-worker",
  destinations: [{
    httpEndpoint: {
      uri: metadataWorkerService.uri // Cross-region HTTP call
    },
    authenticationConfig: {
      googleOidc: {
        serviceAccount: configuration.serviceAccountEmail
      }
    }
  }],
  loggingConfig: {
    logSeverity: "INFO"
  }
})

// Eventarc Enrollment to filter events and route to pipeline
const metadataEnrollment = new gcp.eventarc.Enrollment("metadata-enrollment", {
  location: EVENTARC_LOCATION,
  project: projectId,
  enrollmentId: "metadata-worker",
  messageBus: messageBusName, // Existing MessageBus in us-central1
  destination: metadataWorkerPipeline.id,
  celMatch: buildGcsEventFilter(
    sharedArtifactsBucket.name,
    GCS_PATHS.JOBS_QUEUED // "jobs/Queued/"
  )
})
```

## 10. Performance Considerations

### Concurrency
- **Cloud Run**: Auto-scaling based on HTTP request volume from Eventarc
- **Eventarc Pipelines**: Handle retries with exponential backoff automatically
- **Effect**: Built-in structured concurrency for parallel operations (YouTube API + GCS operations)

### Resource Limits
```yaml
# Cloud Run resource allocation
resources:
  limits:
    cpu: "1000m"      # 1 vCPU
    memory: "512Mi"   # 512MB RAM
  requests:
    cpu: "250m"       # 0.25 vCPU minimum
    memory: "256Mi"   # 256MB RAM minimum
```

### Cross-Region Considerations
- **Eventarc Location**: `us-central1` (MessageBus region)
- **Cloud Run Location**: `us-west1` (application region)
- **Impact**: Eventarc Pipelines make cross-region HTTP calls (~20-50ms latency)
- **Optimization**: Acceptable for async job processing; can be colocated if needed

### Monitoring
- **Cloud Run Metrics**:
  - Request latency (p50, p95, p99)
  - Instance count and cold starts
  - Error rate (4xx, 5xx)
  - CPU and memory utilization
- **Eventarc Metrics**:
  - Event delivery latency
  - Pipeline throughput
  - Enrollment match rate
  - Retry counts
- **GCS Metrics**:
  - Object creation rate by directory
  - Storage operations latency
  - Failed/ directory depth (monitoring for errors)
- **Custom Application Metrics**:
  - Job processing duration by stage
  - YouTube API latency
  - Transcript generation success rate
  - Idempotency skip rate (duplicate event detection)

### State Machine Observability

```typescript
// Track state transitions via GCS directory monitoring
const STATE_DIRECTORIES = [
  "jobs/Queued/",
  "jobs/Processing/",
  "jobs/Completed/",
  "jobs/Failed/"
]

// Monitor via GCS list operations
const getJobCounts = () =>
  Effect.forEach(
    STATE_DIRECTORIES,
    (dir) => storage.listObjects(bucket, dir).pipe(
      Effect.map((files) => ({ state: dir, count: files.length }))
    ),
    { concurrency: "unbounded" }
  )
```

### Error Recovery Patterns

```typescript
// Manual retry of failed jobs (admin tooling)
const retryFailedJob = (jobId: Core.JobId) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const config = yield* Config
    
    // Read from Failed/
    const maybeJob = yield* storage.getObject(
      config.bucket,
      Index.job("Failed", jobId),
      Jobs.TranscriptionJob
    )
    
    if (Option.isNone(maybeJob)) {
      return yield* Effect.fail(new Error("Job not found in Failed/"))
    }
    
    const job = maybeJob.value
    
    // Reset to Queued state
    const retriedJob = Jobs.TranscriptionJob.make({
      ...job,
      status: "Queued",
      error: undefined,
      attempts: job.attempts + 1,
      updatedAt: new Date()
    })
    
    // Atomic move: Failed/ -> Queued/
    const queuedPath = Index.job("Queued", jobId)
    const failedPath = Index.job("Failed", jobId)
    
    yield* storage.putObject(config.bucket, queuedPath, retriedJob)
    yield* storage.deleteObject(config.bucket, failedPath)
    
    // This triggers Eventarc enrollment again
    return retriedJob
  })
```
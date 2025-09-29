# State-Triggered Choreography: Direct Worker Integration via Eventarc

## Background

### The Choreography Pattern

We implement a **State-Triggered Choreography** pattern where GCS directories serve as work queues that directly trigger worker services. This eliminates complex routing and creates a self-organizing workflow.

### Core Architecture Principles

1. **GCS Directories as Work Queues**: `jobs/{status}/` directories signal what work needs to be done
2. **Atomic State Transitions**: Workers move files between directories to trigger the next step
3. **Direct Worker Triggering**: Eventarc triggers target specific worker services, not a central router
4. **Event Log as Audit Trail**: `events/{jobId}/` provides immutable history after work completion

### The Workflow Flow

```
API creates job → jobs/Queued/job-123.json
    ↓ (Eventarc directly triggers worker-metadata)
worker-metadata fetches metadata → writes events/job-123/1_metadata_fetched.json 
                                → moves to jobs/Processing/job-123.json
    ↓ (Eventarc directly triggers worker-transcription)
worker-transcription creates transcript → writes events/job-123/2_transcript_complete.json
                                       → moves to jobs/Completed/job-123.json
```

## GCS Directory Structure

The State-Triggered Choreography pattern uses two distinct GCS directory patterns:

### Work Queue Directories (State Machine)
```
jobs/Queued/        → Triggers worker-metadata
jobs/Processing/    → Triggers worker-transcription  
jobs/Completed/     → Final state (may trigger notifications)
jobs/Failed/        → Error state (triggers cleanup/retry)
```

### Event Log Directories (Audit Trail)
```
events/job-123/     → Immutable event stream per job
  ├── 1_metadata_fetched.json
  ├── 2_transcript_complete.json
  └── 3_job_completed.json
```

### Supporting Directories
```
transcripts/        → Final transcript outputs
idempotency/        → Request deduplication
```

### Index Functions Mapping
```typescript
// Work queue operations
Index.job("Queued", jobId)      → jobs/Queued/job-123.json
Index.job("Processing", jobId)  → jobs/Processing/job-123.json
Index.job("Completed", jobId)   → jobs/Completed/job-123.json

// Event log operations  
Index.event(jobId, eventId)     → events/job-123/1_metadata_fetched.json

// Output storage
Index.transcript(transcriptId)  → transcripts/trn-456.json
```

## Infrastructure Implementation

### Direct Worker Triggering with Eventarc

The key innovation is that **each Eventarc trigger targets a specific worker service directly**, eliminating routing complexity:

```typescript
// infra/index.ts - State-Triggered Choreography Setup
import * as gcp from "@pulumi/gcp"
import * as pulumi from "@pulumi/pulumi"

const project = pulumi.output(gcp.organizations.getProject({}))
const location = "us-central1"

// Storage bucket for all job data
const jobsBucket = new gcp.storage.Bucket("puredialog-storage", {
  location,
  name: `${project.name}-puredialog-storage`,
  uniformBucketLevelAccess: true,
})

// Work topic for worker coordination (not domain events)
const workTopic = new gcp.pubsub.Topic("puredialog-work", {
  name: "puredialog-work",
})

// External notifications topic (domain events for outside world)  
const eventsTopic = new gcp.pubsub.Topic("puredialog-events", {
  name: "puredialog-events",
})

// Get references to deployed worker services
const metadataWorkerService = gcp.cloudrun.getService({ 
  name: "worker-metadata", 
  location 
})
const transcriptionWorkerService = gcp.cloudrun.getService({ 
  name: "worker-transcription", 
  location 
})

/**
 * DIRECT WORKER TRIGGERING - No Central Router!
 * Each trigger targets a specific worker service based on directory patterns.
 */

// Trigger 1: Queued jobs → worker-metadata
const triggerMetadataWorker = new gcp.eventarc.Trigger("trigger-metadata-worker", {
  location,
  project: project.projectId,
  destination: {
    cloudRunService: {
      service: metadataWorkerService.name,  // Direct to worker-metadata
      region: location,
    },
  },
  transport: {
    pubsub: { topic: workTopic.id },  // Use work topic for coordination
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: jobsBucket.name },
  ],
  eventFilters: [{
    attribute: "objectName",
    value: "jobs/Queued/{jobId}.json",  // Only Queued directory
    operator: "match-path-pattern",
  }],
  serviceAccount: metadataWorkerService.template.spec.serviceAccountName,
})

// Trigger 2: Processing jobs → worker-transcription  
const triggerTranscriptionWorker = new gcp.eventarc.Trigger("trigger-transcription-worker", {
  location,
  project: project.projectId,
  destination: {
    cloudRunService: {
      service: transcriptionWorkerService.name,  // Direct to worker-transcription
      region: location,
    },
  },
  transport: {
    pubsub: { topic: workTopic.id },
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: jobsBucket.name },
  ],
  eventFilters: [{
    attribute: "objectName", 
    value: "jobs/Processing/{jobId}.json",  // Only Processing directory
    operator: "match-path-pattern",
  }],
  serviceAccount: transcriptionWorkerService.template.spec.serviceAccountName,
})

// Trigger 3: Completed jobs → API (for external notifications only)
const triggerNotifications = new gcp.eventarc.Trigger("trigger-notifications", {
  location,
  project: project.projectId,
  destination: {
    cloudRunService: {
      service: "puredialog-api",  // API handles external notifications
      path: "/internal/notifications",  // Specific endpoint for outbound events
      region: location,
    },
  },
  transport: {
    pubsub: { topic: eventsTopic.id },  // Use events topic for external notifications
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: jobsBucket.name },
  ],
  eventFilters: [{
    attribute: "objectName",
    value: "jobs/Completed/{jobId}.json",  // Only Completed directory  
    operator: "match-path-pattern",
  }],
})
```

## Configuration Management

### Shared Path Constants

Create a shared configuration to ensure consistency between app and infrastructure:

```typescript
// packages/storage/src/paths.ts
export const STORAGE_PATHS = {
  JOBS_PREFIX: "jobs",
  TRANSCRIPTS_PREFIX: "transcripts",
  IDEMPOTENCY_PREFIX: "idempotency",
} as const

export const EVENTARC_PATTERNS = {
  JOB_EVENTS: `${STORAGE_PATHS.JOBS_PREFIX}/{status}/{jobId}.json`,
  TRANSCRIPT_EVENTS: `${STORAGE_PATHS.TRANSCRIPTS_PREFIX}/{transcriptId}.json`,
} as const
```

### Updated Index Using Constants

```typescript
// packages/storage/src/indices.ts
import { STORAGE_PATHS } from "./paths.js"

export const Index = {
  job: (status: JobStatus, jobId: JobId): string =>
    `${STORAGE_PATHS.JOBS_PREFIX}/${status}/${jobId}.json`,
  transcript: (transcriptId: TranscriptId): string =>
    `${STORAGE_PATHS.TRANSCRIPTS_PREFIX}/${transcriptId}.json`,
  idempotency: (hashedKey: string): string =>
    `${STORAGE_PATHS.IDEMPOTENCY_PREFIX}/${hashedKey}.json`
}
```

### Infrastructure Using Constants

```typescript
// infra/index.ts
import { EVENTARC_PATTERNS } from "@puredialog/storage"

const jobEventsTrigger = new gcp.eventarc.Trigger("job-events-trigger", {
  eventFilters: [{
    attribute: "objectName",
    value: EVENTARC_PATTERNS.JOB_EVENTS,
    operator: "match-path-pattern",
  }],
  // ... rest of configuration
})
```

## Event Handler Implementation

### GCS Event Processing

```typescript
// packages/api/src/handlers/internal.ts

interface GcsEvent {
  readonly bucket: string
  readonly name: string        // Object path from our Index
  readonly generation: string
  readonly eventTime: string
  readonly eventType: string
}

const handleGcsEvent = (gcsEvent: GcsEvent) =>
  Effect.gen(function*() {
    const filePath = gcsEvent.name
    const eventTime = new Date(gcsEvent.eventTime)
    
    // Parse path to determine event type
    const jobMatch = filePath.match(/^jobs\/([^\/]+)\/([^\/]+)\.json$/)
    const transcriptMatch = filePath.match(/^transcripts\/([^\/]+)\.json$/)
    
    if (jobMatch) {
      const [, status, jobId] = jobMatch
      yield* handleJobEvent(jobId as JobId, status as JobStatus, eventTime)
      
    } else if (transcriptMatch) {
      const [, transcriptId] = transcriptMatch
      yield* handleTranscriptEvent(transcriptId as TranscriptId, eventTime)
      
    } else {
      yield* Effect.logDebug(`Ignoring GCS event for path: ${filePath}`)
    }
  })

const handleJobEvent = (jobId: JobId, status: JobStatus, eventTime: Date) =>
  Effect.gen(function*() {
    const pubsub = yield* PubSubClient
    const store = yield* JobStore
    
    // Get job context
    const job = yield* store.findJobById(jobId).pipe(
      Effect.flatMap(Option.match({
        onSome: Effect.succeed,
        onNone: () => Effect.fail(new JobNotFound({ jobId, message: "Job not found" }))
      }))
    )
    
    // Create domain event based on status
    const domainEvent = Match.value(status).pipe(
      Match.when("Queued", () => JobQueued.create({
        jobId,
        requestId: job.requestId,
        occurredAt: eventTime
      })),
      Match.when("Processing", () => JobStatusChanged.create({
        jobId,
        requestId: job.requestId,
        from: "Queued",
        to: "Processing", 
        occurredAt: eventTime
      })),
      Match.when("Completed", () => JobStatusChanged.create({
        jobId,
        requestId: job.requestId,
        from: "Processing",
        to: "Completed",
        occurredAt: eventTime
      })),
      Match.when("Failed", () => JobFailed.create({
        jobId,
        requestId: job.requestId,
        error: "Job processing failed",
        occurredAt: eventTime
      })),
      Match.exhaustive
    )
    
    // Publish to events topic
    yield* pubsub.publishEvent(domainEvent)
    
    yield* Effect.logInfo(`Generated domain event: ${domainEvent._tag}`, {
      jobId,
      status
    })
  })

const handleTranscriptEvent = (transcriptId: TranscriptId, eventTime: Date) =>
  Effect.gen(function*() {
    const pubsub = yield* PubSubClient
    const storage = yield* CloudStorageService
    
    // Get transcript data to find associated job
    const transcriptKey = Index.transcript(transcriptId)
    const transcript = yield* storage.download(transcriptKey).pipe(
      Effect.flatMap(data => Effect.tryPromise(() => JSON.parse(data)))
    )
    
    const domainEvent = TranscriptComplete.create({
      jobId: transcript.jobId,
      requestId: transcript.requestId,
      transcript: {
        id: transcriptId,
        location: transcriptKey
      },
      occurredAt: eventTime
    })
    
    yield* pubsub.publishEvent(domainEvent)
    
    yield* Effect.logInfo("Generated TranscriptComplete event", {
      transcriptId,
      jobId: transcript.jobId
    })
  })

// HTTP endpoint for Eventarc webhooks
export const gcsEventHandler = HttpApiBuilder.group(PureDialogApi, "internal", handlers =>
  handlers.handle("gcsEvent", ({ payload }) =>
    Effect.gen(function*() {
      yield* handleGcsEvent(payload)
      return { received: true, processed: true }
    }).pipe(
      Effect.catchAll(error =>
        Effect.gen(function*() {
          yield* Effect.logError("Failed to process GCS event", error)
          return { received: true, processed: false }
        })
      )
    )
  )
)
```

## Worker Service Implementation

### State-Triggered Choreography Pattern

Workers in this pattern are **autonomous microservices** that:
1. Receive direct Eventarc invocations (no PubSub subscriptions!)
2. Perform atomic file moves to signal completion
3. Write to event log for audit trail
4. Have zero knowledge of other workers

### Worker-Metadata Service

```typescript
// worker-metadata/src/index.ts
import { HttpApiBuilder } from "@effect/platform"
import { CloudStorageService } from "@puredialog/storage"

interface GcsEvent {
  readonly bucket: string
  readonly name: string    // e.g., "jobs/Queued/job-123.json"
  readonly eventTime: string
}

const handleQueuedJob = (gcsEvent: GcsEvent) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const jobId = extractJobIdFromPath(gcsEvent.name)
    
    // 1. Read the job file from Queued directory
    const jobData = yield* storage.download(gcsEvent.name).pipe(
      Effect.flatMap(data => Effect.try(() => JSON.parse(data)))
    )
    
    // 2. Perform business logic (fetch metadata)
    const metadata = yield* fetchVideoMetadata(jobData.videoUrl)
    
    // 3. Write event to audit log
    const eventId = `${Date.now()}_metadata_fetched`
    const domainEvent = MetadataFetched.make({
      jobId,
      metadata,
      occurredAt: new Date()
    })
    yield* storage.upload(
      Index.event(jobId, eventId), 
      JSON.stringify(domainEvent)
    )
    
    // 4. Atomic move: Queued → Processing (triggers next worker!)
    const updatedJob = { ...jobData, metadata, status: "Processing" }
    yield* storage.upload(Index.job("Processing", jobId), JSON.stringify(updatedJob))
    yield* storage.delete(gcsEvent.name)  // Remove from Queued
    
    yield* Effect.logInfo(`Job ${jobId} moved to Processing`, { metadata })
  })

// HTTP API for Eventarc webhook
const MetadataWorkerApi = HttpApiBuilder.make("MetadataWorkerApi").pipe(
  HttpApiBuilder.addGroup(
    HttpApiGroup.make("events").pipe(
      HttpApiGroup.add(
        HttpApiEndpoint.post("gcsEvent", "/")
          .setPayload(Schema.Unknown)  // GCS event payload
      )
    )
  )
)

const gcsEventHandler = HttpApiBuilder.group(MetadataWorkerApi, "events", handlers =>
  handlers.handle("gcsEvent", ({ payload }) =>
    Effect.gen(function*() {
      yield* handleQueuedJob(payload as GcsEvent)
      return { processed: true }
    })
  )
)
```

### Worker-Transcription Service

```typescript
// worker-transcription/src/index.ts
const handleProcessingJob = (gcsEvent: GcsEvent) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const llm = yield* LLMService
    const jobId = extractJobIdFromPath(gcsEvent.name)
    
    // 1. Read job from Processing directory
    const jobData = yield* storage.download(gcsEvent.name).pipe(
      Effect.flatMap(data => Effect.try(() => JSON.parse(data)))
    )
    
    // 2. Perform business logic (transcription)
    const transcript = yield* llm.transcribeMedia(jobData.videoUrl, jobData.metadata)
    
    // 3. Save transcript output
    const transcriptId = TranscriptId.make()
    yield* storage.upload(
      Index.transcript(transcriptId), 
      JSON.stringify(transcript)
    )
    
    // 4. Write event to audit log  
    const eventId = `${Date.now()}_transcript_complete`
    const domainEvent = TranscriptComplete.make({
      jobId,
      transcriptId,
      location: Index.transcript(transcriptId),
      occurredAt: new Date()
    })
    yield* storage.upload(
      Index.event(jobId, eventId),
      JSON.stringify(domainEvent)
    )
    
    // 5. Atomic move: Processing → Completed (triggers notifications!)
    const completedJob = { 
      ...jobData, 
      transcriptId, 
      status: "Completed",
      completedAt: new Date().toISOString()
    }
    yield* storage.upload(Index.job("Completed", jobId), JSON.stringify(completedJob))
    yield* storage.delete(gcsEvent.name)  // Remove from Processing
    
    yield* Effect.logInfo(`Job ${jobId} completed`, { transcriptId })
  })

// Similar HTTP API structure as metadata worker...
```

### Key Choreography Benefits

1. **Zero Worker Dependencies**: Workers have no PubSub clients, no routing logic
2. **Autonomous Operation**: Each worker only knows its input directory and output directory  
3. **Automatic Triggering**: File moves automatically trigger the next step
4. **Perfect Resilience**: Failed workers leave files in their input directory for retry
5. **Observable State**: `ls gs://bucket/jobs/Processing/` shows exactly what's being worked on

## Environment Configuration

### Environment Variables
```bash
# Storage configuration
STORAGE_BUCKET_NAME=puredialog-storage-dev

# Eventarc webhook endpoint
EVENTARC_WEBHOOK_PATH=/internal/events/gcs

# No PubSub configuration needed for workers!
```

### Configuration Service
```typescript
// packages/storage/src/config.ts
export interface StorageConfigInterface {
  readonly bucketName: string
  readonly region: string
}

const StorageConfigSchema = {
  bucketName: Config.string("STORAGE_BUCKET_NAME"),
  region: Config.string("STORAGE_REGION").pipe(
    Config.withDefault("us-central1")
  ),
}

export const StorageConfigLive = Layer.effect(StorageConfig, makeStorageConfig)
```

## Benefits of State-Triggered Choreography

### 1. Extreme Decoupling
- Workers have **zero knowledge** of other workers
- Each worker only knows its "inbox" and "outbox" directories
- Easy to add/remove/reorder workers by changing directory paths
- Perfect microservice autonomy

### 2. Self-Healing Resilience
- Failed workers leave job files in their input directory for automatic retry
- No lost messages or orphaned state
- Observable failure points: `ls gs://bucket/jobs/Processing/` shows stuck jobs
- Automatic Eventarc retry handling

### 3. Infrastructure Simplicity
- **No central router/orchestrator** - eliminates single point of failure
- Direct worker triggering reduces latency and complexity
- Path patterns in Pulumi directly mirror application logic
- Built-in monitoring via GCS object lifecycle metrics

### 4. Perfect Auditability  
- Complete, immutable event log in `events/{jobId}/` directory
- State transitions visible as file movements between directories
- Easy debugging: replay events or check current state
- Business intelligence data automatically captured

### 5. Operational Excellence
- **Observable state machine**: Current system state visible via GCS directory listings
- Zero worker dependencies: no PubSub clients, no shared databases
- Horizontal scaling: multiple instances can safely process the same trigger
- Cost efficiency: workers only run when triggered by actual work

This State-Triggered Choreography pattern transforms complex orchestration into simple, resilient file movements that automatically trigger the right workers at the right time.
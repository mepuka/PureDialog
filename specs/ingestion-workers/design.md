# Ingestion Workers: Technical Design

## 1. Architecture Overview

The ingestion workers implement a two-stage processing pipeline using Google Cloud Run and Pub/Sub:

```
API Service → work topic → worker-metadata → work topic → worker-transcription → events topic
                ↓                              ↓                              ↓
           JobQueued event              JobStatusChanged            TranscriptComplete
```

### Core Design Principles

- **Shared Dependencies**: Both workers use `@puredialog/storage` for persistence, `@puredialog/ingestion` for PubSub/GCS clients
- **Event-Driven**: All state changes publish domain events to the `events` topic
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

### Message Processing Flow
```typescript
// Common pattern for both workers
const processMessage = (payload: PubSubPushMessage) =>
  Effect.gen(function*() {
    // 1. Decode message
    const job = yield* MessageAdapter.decodeWorkMessage(payload.message)
    
    // 2. Process business logic
    yield* processJob(job)
    
    // 3. Always return 204 to acknowledge
    return { status: 204 }
  }).pipe(
    Effect.catchAll((error) =>
      // Publish JobFailed event on any error
      Effect.gen(function*() {
        yield* publishJobFailedEvent(job.id, error)
        return { status: 204 } // Still acknowledge to prevent retries
      })
    )
  )
```

## 3. worker-metadata Design

### Message Flow
1. **Consume**: WorkMessage from `work` topic (without `worker-type` attribute)
2. **Process**: Fetch YouTube metadata and enrich job
3. **Publish**: Enriched WorkMessage to `work` topic with `worker-type: transcription`
4. **Event**: JobStatusChanged event to `events` topic

### Core Logic Implementation
```typescript
// src/logic.ts
export const processMetadataJob = (job: TranscriptionJob) =>
  Effect.gen(function*() {
    const store = yield* JobStore
    const youtubeClient = yield* YoutubeApiClient
    const pubsubClient = yield* PubSubClient
    
    // 1. Update status to Processing
    yield* store.updateJobStatus(job.id, "Processing")
    yield* pubsubClient.publishEvent(JobStatusChanged.create({
      jobId: job.id,
      from: "Queued",
      to: "Processing"
    }))
    
    // 2. Fetch metadata
    const metadata = yield* youtubeClient.getVideoDetails(job.media.url)
    
    // 3. Enrich job with metadata
    const enrichedJob = TranscriptionJob.enrich(job, metadata)
    yield* store.updateJob(enrichedJob)
    
    // 4. Publish to transcription worker
    yield* pubsubClient.publishWorkMessage(enrichedJob, {
      attributes: { "worker-type": "transcription" }
    })
  })
```

### Subscription Filter
The `worker-metadata` subscription uses a filter to only receive messages without the `worker-type` attribute:
```
NOT attributes:worker-type
```

## 4. worker-transcription Design

### Message Flow
1. **Consume**: WorkMessage from `work` topic (with `worker-type: transcription`)
2. **Process**: Generate transcript using LLM service
3. **Store**: Save transcript to GCS
4. **Event**: TranscriptComplete event to `events` topic

### Core Logic Implementation
```typescript
// src/logic.ts
export const processTranscriptionJob = (job: TranscriptionJob) =>
  Effect.gen(function*() {
    const store = yield* JobStore
    const llmService = yield* LLMService
    const storageService = yield* CloudStorageService
    const pubsubClient = yield* PubSubClient
    
    // 1. Update status to Processing
    yield* store.updateJobStatus(job.id, "Processing")
    yield* pubsubClient.publishEvent(JobStatusChanged.create({
      jobId: job.id,
      from: "Queued", 
      to: "Processing"
    }))
    
    // 2. Perform transcription
    const transcript = yield* llmService.transcribeMedia(
      job.media,
      job.metadata
    )
    
    // 3. Store transcript in GCS
    const transcriptId = TranscriptId.create()
    const objectKey = Index.transcript(transcriptId)
    yield* storageService.upload(objectKey, transcript)
    
    // 4. Update job to completed
    yield* store.updateJobStatus(job.id, "Completed", undefined, transcriptId)
    
    // 5. Publish completion event
    yield* pubsubClient.publishEvent(TranscriptComplete.create({
      jobId: job.id,
      transcript: { id: transcriptId, location: objectKey }
    }))
  })
```

### Subscription Filter  
The `worker-transcription` subscription filters for transcription-ready messages:
```
attributes.worker-type = "transcription"
```

## 5. Error Handling Strategy

### Error Classification
- **Transient Errors**: Network timeouts, temporary API failures
- **Permanent Errors**: Invalid job data, authentication failures  
- **System Errors**: Storage failures, configuration errors

### Error Response Pattern
```typescript
const handleError = (job: TranscriptionJob, error: unknown) =>
  Effect.gen(function*() {
    const pubsubClient = yield* PubSubClient
    const store = yield* JobStore
    
    // Update job status to Failed
    yield* store.updateJobStatus(job.id, "Failed", errorMessage(error))
    
    // Publish JobFailed event
    yield* pubsubClient.publishEvent(JobFailed.create({
      jobId: job.id,
      requestId: job.requestId,
      error: errorMessage(error),
      occurredAt: new Date()
    }))
    
    // Always return 204 to acknowledge message
    return { status: 204 }
  })
```

## 6. Configuration Design

### Environment Variables
Both workers require:
```bash
# Server
PORT=8080

# PubSub Configuration  
PUBSUB_PROJECT_ID=your-project-id
PUBSUB_TOPIC_WORK=job-processing
PUBSUB_TOPIC_EVENTS=job-events
PUBSUB_SUBSCRIPTION_METADATA=metadata-worker-subscription
PUBSUB_SUBSCRIPTION_TRANSCRIPTION=transcription-worker-subscription

# Storage
STORAGE_BUCKET_NAME=your-bucket-name

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
    readonly pubsub: PubSubConfigInterface
    readonly storage: StorageConfigInterface
    // Worker-specific config...
  }
>() {}

export const WorkerConfigLive = Layer.effect(
  WorkerConfig,
  makeWorkerConfig
)
```

## 7. Shared Storage Integration

### JobStore Usage
Both workers use the shared `@puredialog/storage` package:

```typescript
import { JobStore, type ProcessingJobStoreInterface } from "@puredialog/storage"

// Update job status with automatic GCS persistence
yield* JobStore.updateJobStatus(jobId, "Processing")

// Atomic status transitions via write-then-delete
yield* JobStore.updateJobStatus(jobId, "Completed", undefined, transcriptId)
```

### Storage Index Integration
```typescript
import { Index } from "@puredialog/storage"

// Consistent object key generation
const transcriptKey = Index.transcript(transcriptId)
const jobKey = Index.job("Completed", jobId)
```

## 8. Testing Strategy

### Test Architecture
- **Unit Tests**: Business logic functions in isolation
- **Integration Tests**: Full message processing with mock dependencies
- **Contract Tests**: Verify message encoding/decoding compatibility

### Layer-Based Testing
```typescript
// test/logic.test.ts
it.effect("should process metadata job successfully", () =>
  Effect.gen(function*() {
    const result = yield* processMetadataJob(testJob)
    
    assert.strictEqual(result.status, "Processing")
  }).pipe(
    Effect.provide(Layer.merge(
      MockJobStoreLayer,
      MockYoutubeClientLayer,
      MockPubSubClientLayer
    ))
  )
)
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
const metadataWorker = new gcp.cloudrun.v2.Service("worker-metadata", {
  location: region,
  template: {
    containers: [{
      image: `gcr.io/${project}/worker-metadata:latest`,
      ports: [{ containerPort: 8080 }],
      env: [...workerEnvVars]
    }],
    scaling: {
      minInstanceCount: 0,
      maxInstanceCount: 10
    }
  }
})
```

### PubSub Subscription Configuration
```typescript
const metadataSubscription = new gcp.pubsub.Subscription("metadata-worker", {
  topic: workTopic.id,
  pushConfig: {
    pushEndpoint: pulumi.interpolate`${metadataWorker.uri}/pubsub`
  },
  filter: "NOT attributes:worker-type", // Only unprocessed jobs
  retryPolicy: {
    minimumBackoff: "10s",
    maximumBackoff: "600s"
  }
})
```

## 10. Performance Considerations

### Concurrency
- **Cloud Run**: Auto-scaling based on request volume
- **PubSub**: Configurable max outstanding messages per subscription
- **Effect**: Built-in structured concurrency for parallel operations

### Resource Limits
```yaml
# Cloud Run resource allocation
resources:
  limits:
    cpu: "1000m"      # 1 vCPU
    memory: "512Mi"   # 512MB RAM
```

### Monitoring
- **Cloud Run**: Request latency, instance count, error rate
- **PubSub**: Message acknowledgment latency, dead letter queue depth
- **Custom**: Job processing duration, transcription success rate
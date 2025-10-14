# Domain Model Consolidation Analysis

## Executive Summary

**Current State:**
- ✅ Domain package is well-organized with namespaced exports
- ✅ Storage package has excellent path utilities
- ⚠️  Worker specs reference old PubSub architecture
- ❌ Missing CloudEvents schemas for Eventarc Advanced
- ❌ Missing GCS event payload schemas
- ❌ No worker HTTP request/response DTOs

**Required Changes:**
1. Add CloudEvents schemas to domain
2. Add GCS event payload schemas to domain
3. Add worker HTTP schemas to domain
4. Update worker specs to reflect Eventarc Advanced
5. Consolidate error types across packages

---

## Current Domain Structure

### ✅ Well-Organized Namespaces

```typescript
// @puredialog/domain exports
export * as Core from "./core/index.js"         // IDs, base types
export * as Media from "./media/index.js"        // Resources, metadata, speakers
export * as Transcription from "./transcription/index.js" // Context, inference, transcripts
export * as Jobs from "./jobs/index.js"          // Entities, events, requests, responses, status
export * as YouTube from "./youtube/index.js"    // YouTube-specific types
export * as Errors from "./errors/index.js"      // Error definitions
```

**Strengths:**
- Clean separation of concerns
- Branded types for type safety (JobId, TranscriptId, etc.)
- Comprehensive job status with state machine
- Domain events for event sourcing (JobQueued, TranscriptComplete, etc.)
- No external SDK dependencies (clean domain)

**Gaps:**
- No CloudEvents schemas
- No GCS event schemas
- No worker HTTP DTOs

---

## Architectural Alignment Issues

### Issue 1: Worker Architecture Mismatch

**Spec Says (OLD):**
```
API → PubSub work topic → worker-metadata → PubSub → worker-transcription
```

**Infrastructure Reality (CURRENT):**
```
GCS Event → MessageBus → Enrollment (CEL) → Pipeline → Cloud Run (HTTP)
```

**Impact:**
- Worker specs in `specs/ingestion-workers/instructions.md` reference PubSub push format
- Workers are scaffolded but empty (correct - they need CloudEvents handling)
- No CloudEvents request/response schemas exist

**Resolution Required:**
- Update worker specs to reflect Eventarc Advanced
- Add CloudEvents schemas to domain
- Define worker HTTP contracts

---

## Required Domain Additions

### 1. CloudEvents Schema

**Purpose:** Parse incoming Eventarc Advanced events at worker HTTP endpoints

**Location:** `packages/domain/src/events/cloudevents.ts`

**Schema Definition:**
```typescript
import { Schema } from "effect"

/**
 * CloudEvents v1.0 specification for Eventarc Advanced
 * @see https://github.com/cloudevents/spec/blob/v1.0/spec.md
 */

// CloudEvents attributes
export const CloudEventsAttributes = Schema.Struct({
  // REQUIRED
  id: Schema.String.pipe(
    Schema.brand("CloudEventId"),
    Schema.annotations({
      description: "Unique identifier for the event"
    })
  ),
  source: Schema.String.pipe(
    Schema.annotations({
      description: "Event source URI (e.g., //storage.googleapis.com/projects/_/buckets/BUCKET)"
    })
  ),
  specversion: Schema.Literal("1.0").pipe(
    Schema.annotations({
      description: "CloudEvents specification version"
    })
  ),
  type: Schema.String.pipe(
    Schema.annotations({
      description: "Event type (e.g., google.cloud.storage.object.v1.finalized)"
    })
  ),

  // OPTIONAL
  datacontenttype: Schema.optional(Schema.String).pipe(
    Schema.annotations({
      description: "Content type of data (e.g., application/json)"
    })
  ),
  dataschema: Schema.optional(Schema.String).pipe(
    Schema.annotations({
      description: "URI of data schema"
    })
  ),
  subject: Schema.optional(Schema.String).pipe(
    Schema.annotations({
      description: "Subject of the event (e.g., objects/jobs/Queued/job_123.json)"
    })
  ),
  time: Schema.optional(Schema.DateTimeUtc).pipe(
    Schema.annotations({
      description: "Timestamp when the event occurred"
    })
  )
})

export type CloudEventsAttributes = Schema.Schema.Type<typeof CloudEventsAttributes>

/**
 * Generic CloudEvent envelope
 * Data payload is typed separately per use case
 */
export const CloudEvent = <DataSchema extends Schema.Schema.AnyNoContext>(
  dataSchema: DataSchema
) =>
  Schema.Struct({
    ...CloudEventsAttributes.fields,
    data: Schema.optional(dataSchema)
  })

export type CloudEvent<Data> = {
  readonly id: string & { readonly CloudEventId: unique symbol }
  readonly source: string
  readonly specversion: "1.0"
  readonly type: string
  readonly datacontenttype?: string
  readonly dataschema?: string
  readonly subject?: string
  readonly time?: Date
  readonly data?: Data
}
```

### 2. GCS Event Payload Schema

**Purpose:** Type-safe parsing of GCS object finalized events

**Location:** `packages/domain/src/events/gcs.ts`

**Schema Definition:**
```typescript
import { Schema } from "effect"

/**
 * GCS object finalized event data structure
 * @see https://cloud.google.com/storage/docs/json_api/v1/objects#resource
 */
export const GcsObjectMetadata = Schema.Struct({
  // Object identification
  kind: Schema.Literal("storage#object"),
  id: Schema.String,
  selfLink: Schema.String,
  name: Schema.String.pipe(
    Schema.annotations({
      description: "Object name/path within bucket"
    })
  ),
  bucket: Schema.String.pipe(
    Schema.annotations({
      description: "Bucket name"
    })
  ),

  // Generation and versioning
  generation: Schema.String,
  metageneration: Schema.String,

  // Content metadata
  contentType: Schema.optional(Schema.String),
  timeCreated: Schema.DateTimeUtc,
  updated: Schema.DateTimeUtc,
  storageClass: Schema.String,
  timeStorageClassUpdated: Schema.DateTimeUtc,
  size: Schema.String.pipe(
    Schema.annotations({
      description: "Object size in bytes as string"
    })
  ),

  // Checksums
  md5Hash: Schema.optional(Schema.String),
  mediaLink: Schema.String,
  crc32c: Schema.String,
  etag: Schema.String
})

export type GcsObjectMetadata = Schema.Schema.Type<typeof GcsObjectMetadata>

/**
 * Complete GCS object finalized CloudEvent
 */
export const GcsObjectFinalizedEvent = Schema.Struct({
  id: Schema.String,
  source: Schema.String,
  specversion: Schema.Literal("1.0"),
  type: Schema.Literal("google.cloud.storage.object.v1.finalized"),
  datacontenttype: Schema.Literal("application/json"),
  subject: Schema.String,
  time: Schema.DateTimeUtc,
  data: GcsObjectMetadata
})

export type GcsObjectFinalizedEvent = Schema.Schema.Type<typeof GcsObjectFinalizedEvent>
```

### 3. Worker HTTP Request/Response Schemas

**Purpose:** Define worker endpoint contracts for CloudEvents

**Location:** `packages/domain/src/workers/http.ts`

**Schema Definition:**
```typescript
import { Schema } from "effect"
import { Core, Jobs } from "../index.js"

/**
 * Worker health check response
 */
export const WorkerHealthResponse = Schema.Struct({
  status: Schema.Literal("healthy", "degraded", "unhealthy"),
  service: Schema.String,
  version: Schema.String,
  timestamp: Schema.DateTimeUtc,
  checks: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.Struct({
        status: Schema.Literal("pass", "fail"),
        message: Schema.optional(Schema.String)
      })
    })
  )
})

export type WorkerHealthResponse = Schema.Schema.Type<typeof WorkerHealthResponse>

/**
 * Worker CloudEvents request body
 * This is what Eventarc Pipelines POST to worker endpoints
 */
export const WorkerCloudEventRequest = Schema.Struct({
  // CloudEvents envelope
  id: Schema.String,
  source: Schema.String,
  specversion: Schema.Literal("1.0"),
  type: Schema.String,
  datacontenttype: Schema.optional(Schema.String),
  subject: Schema.optional(Schema.String),
  time: Schema.optional(Schema.DateTimeUtc),

  // GCS event data
  data: Schema.Unknown // Parsed based on type/subject
})

export type WorkerCloudEventRequest = Schema.Schema.Type<typeof WorkerCloudEventRequest>

/**
 * Worker processing response
 */
export const WorkerProcessingResponse = Schema.Struct({
  status: Schema.Literal("accepted", "processed", "skipped", "failed"),
  jobId: Core.JobId,
  message: Schema.String,
  processingTimeMs: Schema.optional(Schema.Number),
  metadata: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown }))
})

export type WorkerProcessingResponse = Schema.Schema.Type<typeof WorkerProcessingResponse>

/**
 * Worker error response
 */
export const WorkerErrorResponse = Schema.Struct({
  status: Schema.Literal("error"),
  error: Schema.String,
  details: Schema.optional(Schema.Unknown),
  retryable: Schema.Boolean,
  jobId: Schema.optional(Core.JobId)
})

export type WorkerErrorResponse = Schema.Schema.Type<typeof WorkerErrorResponse>
```

---

## Storage Package Enhancements

### Current Strengths

**Path Utilities** (`packages/storage/src/paths.ts`):
- ✅ Type-safe path generation with Schema
- ✅ Consistent path constants (STORAGE_PATHS)
- ✅ Path parsing with TemplateLiteralParser
- ✅ Eventarc pattern alignment

**Indices** (`packages/storage/src/indices.ts`):
- ✅ Centralized path generation
- ✅ Type-safe with Schema.encodeSync
- ✅ Event log path generation

### Enhancement: Add CloudEvent Path Parsing

**Purpose:** Extract job metadata from CloudEvent subject

**Location:** `packages/storage/src/cloudevents.ts`

**Implementation:**
```typescript
import { Effect, Schema } from "effect"
import { Core, Jobs } from "@puredialog/domain"
import { PathParsers } from "./paths.js"

/**
 * Extract job information from CloudEvent subject
 * Subject format: "objects/jobs/{status}/{jobId}.json"
 */
export const extractJobFromSubject = (
  subject: string
): Effect.Effect<
  { status: Jobs.JobStatus; jobId: Core.JobId },
  Error
> =>
  Effect.gen(function*() {
    // Remove "objects/" prefix if present
    const path = subject.startsWith("objects/")
      ? subject.slice("objects/".length)
      : subject

    // Parse using existing path parser
    const parsed = yield* Effect.try({
      try: () => PathParsers.parseJobPath(path),
      catch: (error) => new Error(`Failed to parse job path: ${error}`)
    })

    // Extract components
    const { status, jobId } = PathParsers.extractJobComponents(parsed)

    return { status, jobId }
  })

/**
 * Validate CloudEvent is for a job state transition
 */
export const validateJobEvent = (event: {
  readonly type: string
  readonly subject?: string
  readonly source: string
}): Effect.Effect<boolean, never> =>
  Effect.sync(() => {
    // Must be GCS object finalized
    if (event.type !== "google.cloud.storage.object.v1.finalized") {
      return false
    }

    // Must have subject
    if (!event.subject) {
      return false
    }

    // Must match job path pattern
    const path = event.subject.startsWith("objects/")
      ? event.subject.slice("objects/".length)
      : event.subject

    return path.startsWith("jobs/")
  })
```

---

## Error Consolidation

### Current State

**Domain Errors** (`packages/domain/src/errors/definitions.ts`):
- MediaResourceError
- TranscriptionError  
- ConfigurationError
- ValidationError
- StreamingError
- AuthorizationError

**Ingestion Errors** (`packages/ingestion/src/errors.ts`):
- CloudStorageError (GCS-specific operations)

**Storage Errors** (`packages/storage/src/JobRepository.ts`):
- RepositoryError (generic repository operations)

### Recommendation: Keep Separated by Concern

**Rationale:**
- Domain errors represent business logic failures
- Ingestion errors represent infrastructure failures
- Storage errors represent persistence failures
- Clear separation aids in error handling strategies

**Enhancement:** Add Worker Errors

**Location:** New namespace `packages/domain/src/workers/errors.ts`

**Implementation:**
```typescript
import { Data } from "effect"
import { Core } from "../index.js"

/**
 * Worker processing errors
 */
export class WorkerProcessingError extends Data.TaggedError("WorkerProcessingError")<{
  readonly message: string
  readonly jobId: Core.JobId
  readonly phase: "decode" | "validate" | "fetch" | "process" | "persist"
  readonly retryable: boolean
  readonly cause?: unknown
}> {}

export class CloudEventDecodeError extends Data.TaggedError("CloudEventDecodeError")<{
  readonly message: string
  readonly eventId?: string
  readonly cause?: unknown
}> {}

export class StateTransitionError extends Data.TaggedError("StateTransitionError")<{
  readonly message: string
  readonly jobId: Core.JobId
  readonly currentState: string
  readonly expectedState: string
}> {}
```

---

## Migration Path

### Phase 1: Add Core CloudEvents Support
1. ✅ Create `packages/domain/src/events/` directory
2. ✅ Add CloudEvents base schema
3. ✅ Add GCS event payload schema
4. ✅ Add worker HTTP schemas
5. ✅ Export from domain index

### Phase 2: Enhance Storage Package
1. ✅ Add CloudEvent subject parsing utilities
2. ✅ Add validation helpers for job events
3. ✅ Update path utilities with CloudEvents integration

### Phase 3: Update Worker Specs
1. ⏳ Update `specs/ingestion-workers/instructions.md` to reflect Eventarc
2. ⏳ Remove PubSub references
3. ⏳ Add CloudEvents handling requirements
4. ⏳ Define HTTP endpoint contracts

### Phase 4: Implement Workers
1. ⏳ Implement `worker-metadata` with CloudEvents endpoint
2. ⏳ Implement `worker-transcription` with CloudEvents endpoint
3. ⏳ Add comprehensive error handling
4. ⏳ Add state transition validation

---

## Recommended Domain Structure (Updated)

```
packages/domain/src/
├── core/
│   ├── ids.ts                    # Branded ID types
│   ├── types.ts                  # Base types (LanguageCode, TimestampString)
│   └── index.ts
├── events/                        # NEW
│   ├── cloudevents.ts            # CloudEvents base schema
│   ├── gcs.ts                    # GCS event payloads
│   └── index.ts
├── workers/                       # NEW
│   ├── http.ts                   # Worker HTTP DTOs
│   ├── errors.ts                 # Worker-specific errors
│   └── index.ts
├── media/
│   ├── metadata.ts
│   ├── resources.ts
│   ├── speakers.ts
│   └── index.ts
├── transcription/
│   ├── context.ts
│   ├── inference.ts
│   ├── prompts.ts
│   ├── transcript.ts
│   └── index.ts
├── jobs/
│   ├── entities.ts
│   ├── events.ts                 # Domain events (NOT CloudEvents)
│   ├── requests.ts
│   ├── responses.ts
│   ├── status.ts
│   └── index.ts
├── youtube/
│   ├── types.ts
│   ├── utilities.ts
│   └── index.ts
├── errors/
│   ├── definitions.ts
│   └── index.ts
└── index.ts                       # Namespaced exports
```

**Key Additions:**
- `events/` namespace for CloudEvents and GCS schemas
- `workers/` namespace for worker HTTP contracts and errors
- Clear separation between:
  - **CloudEvents** (transport/infrastructure)
  - **Domain Events** (business events for event sourcing)

---

## Implementation Checklist

### Domain Package
- [ ] Create `src/events/cloudevents.ts`
- [ ] Create `src/events/gcs.ts`
- [ ] Create `src/events/index.ts`
- [ ] Create `src/workers/http.ts`
- [ ] Create `src/workers/errors.ts`
- [ ] Create `src/workers/index.ts`
- [ ] Update `src/index.ts` to export new namespaces
- [ ] Add comprehensive JSDoc documentation
- [ ] Write tests for CloudEvents parsing
- [ ] Write tests for GCS event parsing

### Storage Package
- [ ] Create `src/cloudevents.ts` with utility functions
- [ ] Add CloudEvent subject parsing
- [ ] Add job event validation
- [ ] Write tests for CloudEvent utilities
- [ ] Update documentation

### Worker Specs
- [ ] Update `specs/ingestion-workers/instructions.md` for metadata worker
- [ ] Update `specs/ingestion-workers/instructions.md` for transcription worker
- [ ] Remove PubSub references
- [ ] Add CloudEvents endpoint specifications
- [ ] Document HTTP contracts
- [ ] Update error handling strategies

### Worker Implementation
- [ ] Implement `worker-metadata/src/index.ts`
- [ ] Implement `worker-transcription/src/index.ts`
- [ ] Add CloudEvents endpoint handlers
- [ ] Add state transition validation
- [ ] Add comprehensive error handling
- [ ] Add health check endpoints
- [ ] Write integration tests

---

## Testing Strategy

### Unit Tests
```typescript
// packages/domain/test/events/cloudevents.test.ts
describe("CloudEvents", () => {
  it.effect("should parse valid GCS object finalized event", () =>
    Effect.gen(function*() {
      const event = {
        id: "event-123",
        source: "//storage.googleapis.com/projects/_/buckets/my-bucket",
        specversion: "1.0" as const,
        type: "google.cloud.storage.object.v1.finalized",
        subject: "objects/jobs/Queued/job_abc123.json",
        time: new Date(),
        data: {
          kind: "storage#object" as const,
          name: "jobs/Queued/job_abc123.json",
          bucket: "my-bucket",
          // ... other GCS fields
        }
      }

      const parsed = yield* Schema.decodeUnknownEffect(GcsObjectFinalizedEvent)(event)
      assert.strictEqual(parsed.type, "google.cloud.storage.object.v1.finalized")
      assert.strictEqual(parsed.data.name, "jobs/Queued/job_abc123.json")
    })
  )
})

// packages/storage/test/cloudevents.test.ts
describe("CloudEvent Utilities", () => {
  it.effect("should extract job info from CloudEvent subject", () =>
    Effect.gen(function*() {
      const subject = "objects/jobs/Queued/job_abc123.json"
      const result = yield* extractJobFromSubject(subject)

      assert.strictEqual(result.status, "Queued")
      assert.strictEqual(result.jobId, "job_abc123")
    })
  )

  it.effect("should validate job event", () =>
    Effect.gen(function*() {
      const event = {
        type: "google.cloud.storage.object.v1.finalized",
        subject: "objects/jobs/Queued/job_abc123.json",
        source: "//storage.googleapis.com/..."
      }

      const isValid = yield* validateJobEvent(event)
      assert.isTrue(isValid)
    })
  )
})
```

### Integration Tests
```typescript
// packages/worker-metadata/test/integration.test.ts
describe("Metadata Worker Integration", () => {
  it.effect("should process CloudEvent and transition job state", () =>
    Effect.gen(function*() {
      // Setup: Create job in Queued state
      const job = yield* createTestJob("Queued")

      // Send CloudEvent
      const event = createGcsObjectFinalizedEvent(job.id, "Queued")
      const response = yield* HttpClient.post("/", { body: event })

      // Verify: Job transitioned to MetadataReady
      const updatedJob = yield* JobStore.findJobById(job.id)
      assert.isTrue(Option.isSome(updatedJob))
      assert.strictEqual(updatedJob.value.status, "MetadataReady")
    }).pipe(Effect.provide(TestEnvironment))
  )
})
```

---

## Summary

### Current State Assessment
- ✅ **Domain package**: Well-structured, clean, needs CloudEvents additions
- ✅ **Storage package**: Excellent path utilities, needs CloudEvent integration
- ⚠️  **Worker specs**: Reference old PubSub architecture, need updates
- ❌ **Workers**: Not implemented (correct - waiting for architecture clarity)

### Critical Path Forward
1. **Add CloudEvents schemas to domain** (enables worker implementation)
2. **Add worker HTTP schemas to domain** (defines contracts)
3. **Add CloudEvent utilities to storage** (enables path parsing)
4. **Update worker specs** (documents new architecture)
5. **Implement workers** (using new schemas and specs)

### Key Benefits
- **Type Safety**: Schema-driven CloudEvents parsing
- **Maintainability**: Centralized domain types
- **Testability**: Clear contracts enable comprehensive testing
- **Architectural Alignment**: Domain matches infrastructure reality
- **Developer Experience**: Auto-completion and type checking for all events

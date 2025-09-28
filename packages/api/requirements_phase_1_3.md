# API Service Implementation Requirements: Phases 1-3

## Overview

This document provides detailed requirements for implementing phases 1-3 of the `@puredialog/api` service, following the push-subscription architecture outlined in `plan.md`. The implementation will create a foundation for HTTP API endpoints that integrate with the existing `@puredialog/domain` and `@puredialog/ingestion` packages.

## Phase 1: Foundational Dependencies and Service Scaffolding

### 1.1 Project Dependencies

**Requirement:** Add ingestion package dependency to enable PubSub integration.

**Implementation Details:**
- Add `@puredialog/ingestion` to `package.json` dependencies
- Import required services: `PubSubClient`, `PubSubConfigLive`, `MessageAdapter`
- Import required types: `PubSubError`

**Verification:** Import statements compile without errors and services are accessible.

### 1.2 API Configuration Service (`src/config.ts`)

**Requirement:** Create API-specific configuration service separate from PubSub config.

**Implementation Details:**
```typescript
// Configuration interface
interface ApiConfig {
  readonly port: number
  readonly host: string
  readonly corsOrigins: ReadonlyArray<string>
}

// Service tag
const ApiConfig = Context.GenericTag<ApiConfig>("@puredialog/api/ApiConfig")

// Live implementation using environment variables
const ApiConfigLive: Layer.Layer<ApiConfig, ConfigError>

// Test implementation with default values
const ApiConfigTest: Layer.Layer<ApiConfig>
```

**Environment Variables:**
- `API_PORT` (default: 3000)
- `API_HOST` (default: "0.0.0.0")
- `CORS_ORIGINS` (default: "*")

**Verification:** Configuration can be injected into services and values are properly typed.

### 1.3 Error Types (`src/errors.ts`)

**Requirement:** Define API-specific errors and create union with existing domain errors.

**Implementation Details:**
```typescript
// New API-specific error
class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly message: string
  readonly operation: string
  readonly details?: unknown
}> {}

// Error union combining API and domain errors
type ApiError = DatabaseError | PubSubError | DomainError

// Schema for error serialization
const DatabaseErrorSchema: Schema.Schema<DatabaseError>
const ApiErrorSchema: Schema.Schema<ApiError>
```

**Verification:** All error types are properly tagged and can be used in Effect error channels.

### 1.4 Mock Persistence Service (`src/services/JobStore.ts`)

**Requirement:** Create persistence service interface with mock implementation for development.

**Implementation Details:**
```typescript
// Service interface
interface ProcessingJobStore {
  readonly createJob: (job: TranscriptionJob) => Effect.Effect<TranscriptionJob, DatabaseError>
  readonly findJobByIdempotencyKey: (key: string) => Effect.Effect<Option.Option<TranscriptionJob>, DatabaseError>
  readonly updateJobStatus: (jobId: JobId, status: JobStatus, error?: string) => Effect.Effect<TranscriptionJob, DatabaseError>
  readonly findJobById: (jobId: JobId) => Effect.Effect<Option.Option<TranscriptionJob>, DatabaseError>
}

// Service tag
const ProcessingJobStore = Context.GenericTag<ProcessingJobStore>("@puredialog/api/ProcessingJobStore")

// Mock implementation using in-memory Map
const ProcessingJobStoreMock: Layer.Layer<ProcessingJobStore>
```

**Mock Implementation Requirements:**
- Use `Map<string, TranscriptionJob>` for storage
- Generate proper timestamps for createdAt/updatedAt
- Implement idempotency key checking
- Return appropriate Option types for not-found cases
- Log operations using Effect Console

**Verification:** All service methods have correct Effect signatures and mock operations complete successfully.

## Phase 2: Declarative API Surface

### 2.1 API Schemas (`src/schemas.ts`)

**Requirement:** Define complete request/response schemas for all API endpoints.

**Implementation Details:**

#### Public API Schemas
```typescript
// Job creation request (uses domain types)
const CreateJobRequest = Schema.Struct({
  media: MediaResource,
  idempotencyKey: Schema.String,
  transcriptionContext: Schema.optional(TranscriptionContext)
})

// Success response schemas
const JobAccepted = Schema.Struct({
  status: Schema.Literal("accepted"),
  job: TranscriptionJob,
  message: Schema.String
})

const JobAlreadyExists = Schema.Struct({
  status: Schema.Literal("exists"),
  job: TranscriptionJob,
  message: Schema.String
})

// Health check response
const HealthStatus = Schema.Struct({
  status: Schema.Literal("healthy"),
  timestamp: Schema.DateFromString,
  services: Schema.Struct({
    pubsub: Schema.Literal("connected"),
    storage: Schema.Literal("connected")
  })
})
```

#### Internal API Schemas
```typescript
// Pub/Sub push message format
const PubSubPushMessage = Schema.Struct({
  message: Schema.Struct({
    data: Schema.String, // base64 encoded
    messageId: Schema.String,
    publishTime: Schema.DateFromString
  }),
  subscription: Schema.String
})

// Job status update payload (decoded from data field)
const JobUpdatePayload = Schema.Struct({
  jobId: JobId,
  status: JobStatus,
  error: Schema.optional(Schema.String),
  transcriptId: Schema.optional(TranscriptId)
})
```

**Verification:** All schemas compile with proper Effect Schema types and can encode/decode successfully.

### 2.2 Complete API Structure (`src/api.ts`)

**Requirement:** Define full API structure with all endpoints and their contracts.

**Implementation Details:**
```typescript
// Health endpoint group
const Health = HttpApiGroup.make("health").add(
  HttpApiEndpoint.get("status", "/health")
    .addSuccess(HealthStatus)
    .addError(ApiErrorSchema)
)

// Public jobs endpoint group  
const Jobs = HttpApiGroup.make("jobs").add(
  HttpApiEndpoint.post("createJob", "/jobs")
    .addSuccess(JobAccepted)
    .addSuccess(JobAlreadyExists)
    .addError(ApiErrorSchema)
    .setPayload(CreateJobRequest)
)

// Internal Pub/Sub endpoint group
const Internal = HttpApiGroup.make("internal").add(
  HttpApiEndpoint.post("jobUpdate", "/_internal/job-update")
    .addSuccess(Schema.Struct({ received: Schema.Boolean }))
    .addError(ApiErrorSchema)
    .setPayload(PubSubPushMessage)
)

// Complete API definition
const PureDialogApi = HttpApi.empty
  .add(Health)
  .add(Jobs)  
  .add(Internal)
```

**Verification:** API structure compiles with proper HttpApi types and all endpoints are accessible.

## Phase 3: Handler and Service Layer Scaffolding

### 3.1 Public Jobs Handler (`src/handlers/jobs.ts`)

**Requirement:** Create handler layer for public job management endpoints.

**Implementation Details:**
```typescript
// Handler implementation requiring dependencies
const jobsLive = HttpApiBuilder.group(PureDialogApi, "jobs", (handlers) =>
  Effect.gen(function* () {
    const jobStore = yield* ProcessingJobStore
    const pubSubClient = yield* PubSubClient
    const messageAdapter = yield* MessageAdapter

    return handlers.handle("createJob", ({ payload }) =>
      Effect.gen(function* () {
        // Placeholder implementation with correct signature
        yield* Effect.logInfo(`Creating job with idempotency key: ${payload.idempotencyKey}`)
        
        // TODO: Implement full logic:
        // 1. Check idempotency key
        // 2. Create and persist job
        // 3. Publish to PubSub
        // 4. Return appropriate response
        
        yield* Effect.die("createJob handler not implemented")
      })
    )
  })
).pipe(
  Layer.provide(ProcessingJobStoreMock), // Will be replaced with real implementation
  Layer.provide(PubSubConfigLive),
  Layer.provide(MessageAdapterLive)
)
```

**Dependencies Required:**
- `ProcessingJobStore` - for job persistence
- `PubSubClient` - for publishing messages
- `MessageAdapter` - for message transformation

**Verification:** Handler compiles with correct Effect signatures and dependencies are properly injected.

### 3.2 Internal Push Handler (`src/handlers/internal.ts`)

**Requirement:** Create handler layer for internal Pub/Sub push endpoints.

**Implementation Details:**
```typescript
// Handler for Pub/Sub push messages
const internalLive = HttpApiBuilder.group(PureDialogApi, "internal", (handlers) =>
  Effect.gen(function* () {
    const jobStore = yield* ProcessingJobStore
    const messageAdapter = yield* MessageAdapter

    return handlers.handle("jobUpdate", ({ payload }) =>
      Effect.gen(function* () {
        yield* Effect.logInfo(`Received job update push message: ${payload.message.messageId}`)
        
        // TODO: Implement full logic:
        // 1. Decode base64 data field
        // 2. Parse job update payload
        // 3. Update job status in storage
        // 4. Handle errors appropriately
        
        yield* Effect.die("jobUpdate handler not implemented")
      })
    )
  })
).pipe(
  Layer.provide(ProcessingJobStoreMock),
  Layer.provide(MessageAdapterLive)
)
```

**Dependencies Required:**
- `ProcessingJobStore` - for updating job status
- `MessageAdapter` - for message decoding/validation

**Verification:** Handler compiles and can process PubSub push message format.

### 3.3 Health Handler (`src/handlers/health.ts`)

**Requirement:** Create health check handler for monitoring.

**Implementation Details:**
```typescript
const healthLive = HttpApiBuilder.group(PureDialogApi, "health", (handlers) =>
  handlers.handle("status", () =>
    Effect.gen(function* () {
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
    })
  )
)
```

**Verification:** Health endpoint returns proper status format and compiles correctly.

## Implementation Dependencies

### From @puredialog/domain
- `TranscriptionJob`, `JobId`, `JobStatus`, `TranscriptId`
- `MediaResource`, `TranscriptionContext`
- `DomainError` types

### From @puredialog/ingestion  
- `PubSubClient`, `PubSubConfigLive`
- `MessageAdapter`, `MessageAdapterLive`
- `PubSubError`

### From effect ecosystem
- `HttpApi`, `HttpApiGroup`, `HttpApiEndpoint`, `HttpApiBuilder`
- `Schema`, `Context`, `Layer`, `Effect`
- `Data.TaggedError`, `Option`

## File Structure After Phase 3

```
packages/api/
├── src/
│   ├── config.ts           # API configuration service
│   ├── errors.ts           # API error types
│   ├── schemas.ts          # Request/response schemas
│   ├── api.ts             # Complete API definition
│   ├── services/
│   │   └── JobStore.ts    # Persistence service interface
│   └── handlers/
│       ├── health.ts      # Health check handlers
│       ├── jobs.ts        # Public job handlers
│       └── internal.ts    # Internal push handlers
├── test/
│   └── (test files for each module)
└── package.json           # With ingestion dependency
```

## Success Criteria

After completing phases 1-3:

1. **Compilation:** All TypeScript compiles without errors
2. **Dependencies:** All required services are properly injected
3. **API Definition:** Complete API surface is defined with proper schemas
4. **Handlers:** All endpoint handlers have correct signatures and placeholder implementations
5. **Testing:** Mock services enable unit testing of handler logic
6. **Integration:** API integrates properly with existing domain and ingestion packages

## Next Steps (Phase 4+)

- Implement actual business logic in handlers
- Replace mock services with real implementations
- Create server assembly and main entry point
- Add comprehensive integration tests
- Implement error handling and logging
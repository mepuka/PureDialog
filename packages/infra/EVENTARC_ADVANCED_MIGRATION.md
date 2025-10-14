# Eventarc Advanced Migration

## Overview

Migrated from **Eventarc Standard** (direct triggers) to **Eventarc Advanced** (MessageBus + Pipeline + Enrollment) for improved event routing and filtering capabilities.

## Architecture

### Previous Architecture (Eventarc Standard)
```
GCS Event → Eventarc Trigger (with filters) → Cloud Run Service
```

### New Architecture (Eventarc Advanced)
```
GCS Event → GoogleApiSource → MessageBus → Enrollment (CEL filter) → Pipeline → Cloud Run Service
```

## Components

### 1. MessageBus (`main`)
- **Purpose**: Central event routing hub
- **Location**: `us-central1` (existing resource, not created by this stack)
- **Logging**: INFO level for Platform Telemetry
- **Note**: This uses an existing MessageBus - Eventarc Advanced is only available in select regions

### 2. GoogleApiSource (`gcs-events`)
- **Purpose**: Connects GCS storage events to MessageBus
- **Destination**: MessageBus
- **Event Types**: All GCS events (filtered downstream by Enrollments)

### 3. Pipelines (3 total)

#### Metadata Worker Pipeline
- **ID**: `metadata-worker`
- **Destination**: Metadata Worker Cloud Run service
- **Authentication**: Google OIDC with service account

#### Transcription Worker Pipeline
- **ID**: `transcription-worker`
- **Destination**: Transcription Worker Cloud Run service
- **Authentication**: Google OIDC with service account

#### Notifications Pipeline
- **ID**: `notifications`
- **Destination**: API service `/internal/notifications` endpoint
- **Authentication**: Google OIDC with service account

### 4. Enrollments (3 total)

Enrollments use **CEL expressions** to filter events from the MessageBus using **CloudEvents format**:

**CloudEvents Message Structure:**
- `message.type`: Event type (e.g., `google.cloud.storage.object.v1.finalized`)
- `message.source`: Source URI (e.g., `//storage.googleapis.com/projects/_/buckets/BUCKET_NAME`)
- `message.subject`: Object path (e.g., `objects/jobs/Queued/file.json`)

**Note:** Eventarc Advanced does NOT support `message.data` or `message.data_base64` in CEL expressions!

#### Metadata Worker Enrollment
- **CEL Filter**: `message.type == "google.cloud.storage.object.v1.finalized" && message.source.endsWith("/buckets/<bucket>") && message.subject.startsWith("objects/jobs/Queued/")`
- **Triggers On**: New files in `jobs/Queued/` directory
- **Routes To**: Metadata Worker Pipeline

#### Transcription Worker Enrollment
- **CEL Filter**: `message.type == "google.cloud.storage.object.v1.finalized" && message.source.endsWith("/buckets/<bucket>") && message.subject.startsWith("objects/jobs/Processing/")`
- **Triggers On**: New files in `jobs/Processing/` directory
- **Routes To**: Transcription Worker Pipeline

#### Notifications Enrollment
- **CEL Filter**: `message.type == "google.cloud.storage.object.v1.finalized" && message.source.endsWith("/buckets/<bucket>") && message.subject.startsWith("objects/jobs/Completed/")`
- **Triggers On**: New files in `jobs/Completed/` directory
- **Routes To**: Notifications Pipeline

## Benefits

### 1. **Better Event Routing**
- Centralized MessageBus for all events
- CEL expressions provide powerful filtering capabilities
- Easier to add new event sources or destinations

### 2. **Improved Observability**
- Structured logging at each component (MessageBus, Pipelines, GoogleApiSource)
- Better visibility into event flow through the system

### 3. **Enhanced Flexibility**
- Can easily add new enrollments for different event patterns
- Pipelines can perform transformations and mediations
- Support for multiple destination types (HTTP, Pub/Sub, Workflows)

### 4. **State-Triggered Choreography**
- GCS directories act as state machines (`jobs/Queued/`, `jobs/Processing/`, `jobs/Completed/`)
- Workers triggered based on state transitions (file moves)
- Self-organizing workflow without central orchestrator

## Event Flow

```
1. API creates job → writes to jobs/Queued/{jobId}.json
   ↓
2. GCS generates finalized event
   ↓
3. GoogleApiSource publishes to MessageBus
   ↓
4. Metadata Worker Enrollment matches CEL filter
   ↓
5. Pipeline routes to Metadata Worker Cloud Run
   ↓
6. Worker processes, writes to jobs/Processing/{jobId}.json
   ↓
7. New GCS event triggers Transcription Worker Enrollment
   ↓
8. Pipeline routes to Transcription Worker Cloud Run
   ↓
9. Worker processes, writes to jobs/Completed/{jobId}.json
   ↓
10. New GCS event triggers Notifications Enrollment
    ↓
11. Pipeline routes to API notifications endpoint
```

## Code Organization

### Constants
All GCS path patterns and event types are defined as constants at the top of `index.ts`:

```typescript
const GCS_PATHS = {
  JOBS_QUEUED: "jobs/Queued/",
  JOBS_PROCESSING: "jobs/Processing/",
  JOBS_COMPLETED: "jobs/Completed/",
  JOBS_FAILED: "jobs/Failed/"
} as const

const GCS_EVENT_TYPE = "google.cloud.storage.object.v1.finalized" as const
```

### Helper Functions
CEL expressions are built using a helper function to ensure consistency with CloudEvents format:

```typescript
// Eventarc Advanced uses CloudEvents format:
// - message.type: event type (e.g., "google.cloud.storage.object.v1.finalized")
// - message.source: source URI (e.g., "//storage.googleapis.com/projects/_/buckets/BUCKET_NAME")
// - message.subject: object path (e.g., "objects/jobs/Queued/file.json")
const buildGcsEventFilter = (bucketName: pulumi.Output<string>, pathPrefix: string) =>
  pulumi.interpolate`message.type == "${GCS_EVENT_TYPE}" && message.source.endsWith("/buckets/${bucketName}") && message.subject.startsWith("objects/${pathPrefix}")`
```

### Usage
Enrollments use constants instead of hardcoded strings:

```typescript
celMatch: buildGcsEventFilter(sharedArtifactsBucket.name, GCS_PATHS.JOBS_QUEUED)
```

## Configuration

All resources are configured through `Pulumi.dev.yaml`:
- Project ID: `gcp:project`
- Region: `gcp:region` (Cloud Run services)
- Eventarc Location: `us-central1` (hardcoded - where MessageBus exists)
- Service Account: `cloudrun:serviceAccount`
- Bucket Base Name: `storage:bucketBaseName`

## Deployment

```bash
cd packages/infra
pulumi up
```

## Monitoring

- **MessageBus Logs**: Check for event delivery and filtering
- **Pipeline Logs**: Monitor HTTP request/response to Cloud Run
- **GoogleApiSource Logs**: Verify GCS events are being published
- **Enrollment Logs**: View CEL expression evaluation results

## References

- [Eventarc Advanced Overview](https://cloud.google.com/eventarc/advanced/docs/overview)
- [MessageBus Documentation](https://cloud.google.com/eventarc/docs/reference/rest/v1/projects.locations.messageBuses)
- [Pipeline Documentation](https://cloud.google.com/eventarc/docs/reference/rest/v1/projects.locations.pipelines)
- [Enrollment Documentation](https://cloud.google.com/eventarc/docs/reference/rest/v1/projects.locations.enrollments)
- [CEL Expression Syntax](https://github.com/google/cel-spec)

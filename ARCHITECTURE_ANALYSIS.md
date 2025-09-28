# PureDialog Architecture Analysis

## Storage Layer Migration ✅ Complete

The storage layer has been successfully extracted from `@puredialog/api` into a shared `@puredialog/storage` package:

### What Was Moved
- **JobRepository**: GCS-based persistence with atomic status transitions
- **JobStore**: High-level job management interface 
- **Storage Indices**: Centralized GCS object key generation
- **Idempotency Utilities**: Key generation, hashing, and validation

### Benefits
- ✅ Shared persistence layer available to all worker services
- ✅ Consistent job lifecycle management across services
- ✅ Atomic job status transitions using write-then-delete pattern
- ✅ All existing tests pass (66/66) with zero TypeScript/lint errors

## LLM Package Analysis

### Current State
The `@puredialog/llm` package is well-structured and ready for integration:

- **Technology**: Google Gemini API with @effect/ai integration
- **Capabilities**: YouTube video transcription using multimodal prompts
- **Architecture**: Full Effect-TS integration with proper Layer composition
- **Interface**: `transcribeMedia(video, metadata) -> DialogueTurn[]`

### Integration Readiness
- ✅ Ready for `worker-transcription` integration
- ✅ Supports streaming responses from Gemini API
- ✅ Proper error handling with `GoogleApiError` types
- ✅ Configuration-driven with environment variables

## Event Topic Analysis - ⚠️ Critical Gap

### Current Event Publishing
**API Service** (what's working):
- ✅ Publishes `WorkMessage` to `work` topic when jobs are created
- ✅ Consumes events from `events` topic via internal handler
- ✅ Updates job status in storage when events are processed

**Missing Event Publishers** (critical gap):
- ❌ **No publisher for `JobStatusChanged` events**
- ❌ **No publisher for `TranscriptComplete` events** 
- ❌ **No publisher for `JobFailed` events**
- ❌ **No publisher for `JobQueued` events**

### Event Flow Gap Analysis

Currently, the system has:
1. **Event Consumers**: API internal handler processes events from `events` topic
2. **Work Publishers**: API publishes work messages to `work` topic  
3. **Missing**: No service publishes domain events to `events` topic

This means:
- The `events` topic exists but has no publishers
- Real-time event streaming is not functional
- Job status changes are not propagated as events
- External systems cannot subscribe to job lifecycle events

### Required Event Publishers

The following events need to be published to the `events` topic:

#### 1. JobQueued Event
- **When**: Job is successfully created and persisted
- **Where**: API jobs handler after `store.createJob()`
- **Purpose**: Notify that a new job has entered the system

#### 2. JobStatusChanged Event  
- **When**: Job status transitions (Queued → Processing → Completed/Failed)
- **Where**: Worker services when they update job status
- **Purpose**: Real-time status tracking and monitoring

#### 3. TranscriptComplete Event
- **When**: Transcription completes successfully 
- **Where**: `worker-transcription` after saving transcript to GCS
- **Purpose**: Notify completion with transcript location

#### 4. JobFailed Event
- **When**: Processing fails in any worker
- **Where**: Workers' error handling logic
- **Purpose**: Failure notification and potential retry coordination

## Worker Services Integration Plan

### Shared Dependencies
Both workers will use:
- `@puredialog/domain` - Core types and schemas
- `@puredialog/ingestion` - PubSub, GCS, YouTube API clients
- `@puredialog/storage` - Job persistence layer
- `@puredialog/llm` - Transcription service (worker-transcription only)

### worker-metadata Architecture
```typescript
// Core flow
1. Receive WorkMessage from work topic
2. Update job status to "Processing" (JobStore + publish JobStatusChanged)
3. Fetch metadata using YoutubeApiClient
4. Update job with metadata (JobStore)
5. Publish enriched WorkMessage to work topic (with routing attributes)
```

### worker-transcription Architecture  
```typescript
// Core flow
1. Receive enriched WorkMessage from work topic
2. Update job status to "Processing" (JobStore + publish JobStatusChanged)
3. Perform transcription using LLMService
4. Save transcript to GCS using CloudStorageService
5. Update job status to "Completed" with transcriptId (JobStore)
6. Publish TranscriptComplete event to events topic
```

## Immediate Implementation Priorities

### 1. Fix Event Publishing Gap (High Priority)
- Add `publishEvent` calls to API job creation flow
- Implement event publishing in worker error handling
- Ensure all job status transitions publish `JobStatusChanged` events

### 2. Worker Services Implementation (High Priority)
- Implement `worker-metadata` with YouTube API integration
- Implement `worker-transcription` with LLM service integration
- Add proper error handling with `JobFailed` event publishing

### 3. End-to-End Event Flow (Medium Priority)
- Test complete job lifecycle with event publishing
- Verify events topic receives all expected event types
- Implement monitoring/observability for event streams

## Architecture Benefits

### Current Strengths
- ✅ Robust storage layer with atomic operations
- ✅ Well-designed Effect-TS architecture
- ✅ Comprehensive testing infrastructure  
- ✅ Ready-to-use LLM integration
- ✅ Proper error handling patterns

### Post-Implementation Benefits
- 🎯 Complete event-driven architecture
- 🎯 Real-time job status streaming
- 🎯 Horizontally scalable worker services
- 🎯 Consistent persistence across all services
- 🎯 AI-powered transcription capability
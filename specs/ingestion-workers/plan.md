# Ingestion Workers: Implementation Plan

## Implementation Overview

This plan implements both `worker-metadata` and `worker-transcription` services following a phased approach that ensures shared infrastructure is established first, followed by service-specific implementations.

**Timeline**: 3-4 days  
**Dependencies**: `@puredialog/storage` package (✅ Complete), LLM integration ready

## Phase 1: Foundation Setup (Day 1)

### 1.1 Package Scaffolding ⚡ High Priority
**Estimated Time**: 2 hours

- [ ] Create `packages/worker-metadata/` directory structure
- [ ] Create `packages/worker-transcription/` directory structure  
- [ ] Initialize `package.json` for both packages with correct dependencies
- [ ] Configure `tsconfig.json` and `tsconfig.build.json` for both
- [ ] Set up `vitest.config.ts` and `eslint.config.mjs` for both
- [ ] Update root `pnpm-workspace.yaml` to include new packages

**Dependencies**: `@puredialog/domain`, `@puredialog/ingestion`, `@puredialog/storage`, `@puredialog/llm`, `@effect/platform-node`

### 1.2 Shared Worker Architecture ⚡ High Priority  
**Estimated Time**: 3 hours

- [ ] Create shared HTTP server pattern using `@effect/platform-node`
- [ ] Implement common PubSub message handling architecture
- [ ] Create shared configuration service pattern
- [ ] Implement shared error handling with JobFailed event publishing
- [ ] Create base test utilities for worker testing

**Key Deliverable**: Reusable worker foundation that both services will extend

### 1.3 Critical Event Publishing Fix ⚡ URGENT
**Estimated Time**: 1 hour

- [ ] Add `publishEvent` call to API jobs handler for `JobQueued` events
- [ ] Verify `PubSubClient.publishEvent` is working correctly
- [ ] Test event publishing to `events` topic

**Why Critical**: Currently the events topic has no publishers, breaking real-time event streaming

## Phase 2: worker-metadata Implementation (Day 2)

### 2.1 Core Business Logic ⚡ High Priority
**Estimated Time**: 4 hours

- [ ] Implement `processMetadataJob` function in `src/logic.ts`
- [ ] Integrate with `YoutubeApiClient` for metadata fetching
- [ ] Implement job status updates using shared `JobStore`
- [ ] Implement `JobStatusChanged` event publishing
- [ ] Add enriched `WorkMessage` publishing with `worker-type: transcription` attribute

### 2.2 HTTP Handler & Server ⚡ High Priority
**Estimated Time**: 2 hours

- [ ] Implement `POST /pubsub` endpoint handler
- [ ] Integrate `MessageAdapter` for `TranscriptionJob` decoding
- [ ] Add proper error handling with 204 acknowledgment pattern
- [ ] Create server configuration and startup logic

### 2.3 Testing & Validation 🔍 Medium Priority
**Estimated Time**: 2 hours

- [ ] Create unit tests for metadata processing logic
- [ ] Create integration tests for message handling
- [ ] Test YouTube API integration with mock data
- [ ] Verify event publishing works correctly

## Phase 3: worker-transcription Implementation (Day 3)

### 3.1 LLM Integration ⚡ High Priority
**Estimated Time**: 3 hours

- [ ] Integrate `@puredialog/llm` package for transcription
- [ ] Implement `processTranscriptionJob` function
- [ ] Add proper error handling for transcription failures
- [ ] Implement transcript storage to GCS using `CloudStorageService`

### 3.2 Job Completion Flow ⚡ High Priority
**Estimated Time**: 3 hours

- [ ] Implement job status updates to "Completed"
- [ ] Add `transcriptId` generation and storage
- [ ] Implement `TranscriptComplete` event publishing
- [ ] Add proper cleanup and resource management

### 3.3 Message Filtering & Handler ⚡ High Priority
**Estimated Time**: 2 hours

- [ ] Implement subscription filter logic for `worker-type: transcription`
- [ ] Create HTTP handler for transcription worker
- [ ] Test message routing between workers
- [ ] Verify end-to-end job processing flow

## Phase 4: Deployment & Infrastructure (Day 4)

### 4.1 Containerization 🐳 High Priority
**Estimated Time**: 2 hours

- [ ] Create `Dockerfile` for `worker-metadata`
- [ ] Create `Dockerfile` for `worker-transcription` 
- [ ] Test Docker builds locally
- [ ] Update `cloudbuild.yaml` for both services

### 4.2 Cloud Run Configuration ☁️ High Priority
**Estimated Time**: 3 hours

- [ ] Verify Pulumi infrastructure definitions in `infra/index.ts`
- [ ] Configure PubSub subscription filters
- [ ] Set up environment variables for both workers
- [ ] Test subscription routing and message acknowledgment

### 4.3 End-to-End Testing 🔍 Medium Priority
**Estimated Time**: 3 hours

- [ ] Deploy both workers to Cloud Run
- [ ] Test complete job processing pipeline
- [ ] Verify event publishing to `events` topic works
- [ ] Test error handling and JobFailed event publishing
- [ ] Validate monitoring and logging

## Technical Implementation Details

### Message Flow Testing Checklist
- [ ] API publishes `WorkMessage` to `work` topic
- [ ] `worker-metadata` consumes message (filter: `NOT attributes:worker-type`)
- [ ] Metadata worker publishes `JobStatusChanged` event to `events` topic
- [ ] Metadata worker publishes enriched `WorkMessage` with `worker-type: transcription`
- [ ] `worker-transcription` consumes enriched message (filter: `attributes.worker-type = "transcription"`)
- [ ] Transcription worker publishes `JobStatusChanged` and `TranscriptComplete` events
- [ ] API internal handler processes all events and updates job status

### Error Handling Validation
- [ ] Test YouTube API failures in metadata worker
- [ ] Test LLM service failures in transcription worker  
- [ ] Test storage failures in both workers
- [ ] Verify `JobFailed` events are published correctly
- [ ] Confirm failed messages are acknowledged (204 response)

### Storage Integration Checklist
- [ ] Both workers use `@puredialog/storage` JobStore
- [ ] Job status transitions use atomic write-then-delete pattern
- [ ] Transcript storage uses consistent object key generation
- [ ] Idempotency handling works correctly

### Configuration Requirements

#### worker-metadata Environment Variables
```bash
PORT=8080
PUBSUB_PROJECT_ID=puredialog-dev
PUBSUB_TOPIC_WORK=job-processing
PUBSUB_TOPIC_EVENTS=job-events
PUBSUB_SUBSCRIPTION_METADATA=metadata-worker-subscription
STORAGE_BUCKET_NAME=puredialog-storage-dev
YOUTUBE_API_KEY=your-youtube-api-key
```

#### worker-transcription Environment Variables  
```bash
PORT=8080
PUBSUB_PROJECT_ID=puredialog-dev
PUBSUB_TOPIC_WORK=job-processing
PUBSUB_TOPIC_EVENTS=job-events
PUBSUB_SUBSCRIPTION_TRANSCRIPTION=transcription-worker-subscription
STORAGE_BUCKET_NAME=puredialog-storage-dev
GOOGLE_AI_API_KEY=your-gemini-api-key
```

## Risk Mitigation

### High Risk Items
1. **Event Publishing Gap**: Fixed in Phase 1.3 by adding `JobQueued` event publishing
2. **Message Routing**: Subscription filters must correctly route messages between workers
3. **LLM Integration**: `@puredialog/llm` package integration may need refinement

### Dependency Risks
- **Storage Layer**: ✅ Already completed and tested
- **PubSub Configuration**: ✅ Infrastructure already exists  
- **LLM Package**: ✅ Ready for integration

## Success Criteria

### Phase 1 Complete When:
- [ ] Both package structures exist with proper configuration
- [ ] Shared worker architecture patterns are implemented
- [ ] `JobQueued` events are being published by API

### Phase 2 Complete When:
- [ ] `worker-metadata` successfully processes jobs
- [ ] YouTube metadata is fetched and stored
- [ ] Enriched WorkMessages are published with correct attributes

### Phase 3 Complete When:  
- [ ] `worker-transcription` successfully generates transcripts
- [ ] Transcripts are stored in GCS with correct object keys
- [ ] `TranscriptComplete` events are published

### Phase 4 Complete When:
- [ ] Both workers are deployed to Cloud Run
- [ ] End-to-end job processing works correctly
- [ ] All events are published to `events` topic
- [ ] Error handling publishes `JobFailed` events

## Post-Implementation Tasks

### Monitoring & Observability
- [ ] Add structured logging for job processing metrics
- [ ] Set up Cloud Run metrics and alerting  
- [ ] Monitor PubSub subscription health
- [ ] Track job processing latency and success rates

### Performance Optimization
- [ ] Tune Cloud Run instance limits and scaling
- [ ] Optimize PubSub acknowledgment deadline
- [ ] Consider batch processing for high-volume scenarios
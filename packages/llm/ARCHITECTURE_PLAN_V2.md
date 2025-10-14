# LLM Package Architecture Plan V2 (Simplified)

## Executive Summary

Refactor `@llm/` to support two distinct workflows with simplified artifact tracking:
1. **Metadata Enrichment** (optional) - Parse structured info from unstructured text
2. **Media Transcription** (required) - Generate full transcripts

**Key Simplification:** Keep prompts in `@llm/` package, link all artifacts via `jobId`.

**Effect Patterns Used:** Service Layer (Context.Tag + Layer), Schema patterns, Error handling (Data.TaggedError), Observability (logInfo + annotateLogs), Configuration (Config)

**Monorepo Reuse:** Leverages `@storage/Index` utilities, `@ingestion/CloudStorageService`, existing Config patterns, existing Schema patterns from `@domain/`

---

## 0. Architecture References

### 0.1 Effect Patterns (See `/patterns/`)

**Service Layer** (`effect-service-layer-patterns.md`, `layer-composition.md`):
- ✅ **Pattern 54-57**: Use `Context.Tag` + `Layer.effect` for service definition
- ✅ **Pattern**: Layer composition with `Layer.provide` for dependency injection
- ✅ Example: `@ingestion/CloudStorageService` shows proper service + layer pattern

**Schema Patterns** (`effect-schema-coding-patterns.md`, `effect-schema-advanced-coding-patterns.md`):
- ✅ **Pattern 3**: Use `Schema.Struct` for domain types
- ✅ **Pattern 8**: Use `Schema.brand` for type-safe IDs (`LLMArtifactId`)
- ✅ **Pattern 9**: Use `Schema.optional` for optional fields
- ✅ Example: `@domain/jobs/entities.ts` shows proper Schema.TaggedClass usage

**Error Handling** (`error-handling.md`, `effect-error-management-patterns.md`):
- ✅ **Pattern 38**: Use `Data.TaggedError` for structured errors
- ✅ **Pattern 42**: Use `Effect.catchTag` for type-safe error handling
- ✅ **Pattern**: Use `Effect.tryPromise` for async operations
- ✅ Example: `@ingestion/errors.ts` shows proper CloudStorageError pattern

**Configuration** (`effect-configuration-patterns.md`):
- ✅ **Pattern 93-94**: Use `Config.all` with `Config.withDefault`
- ✅ **Pattern 97**: Use `Config.redacted` for sensitive values (API keys)
- ✅ Example: `@ingestion/Config.ts` and `@llm/config.ts` show proper pattern

**Observability** (`effect-observability-patterns.md`):
- ✅ **Pattern 81**: Use `Effect.logInfo` for structured logging
- ✅ **Pattern 82**: Use `Effect.annotateLogs` for contextual metadata
- ✅ **Pattern 83**: Use `Effect.withLogSpan` for timing operations
- ✅ Example: Should add to LLM service for token usage tracking

### 0.2 Existing Monorepo Implementations

**Storage Utilities** (`@storage/`):
- ✅ **`Index` utilities**: Extend `packages/storage/src/indices.ts` for artifact paths
- ✅ **Path parsers**: Reuse `STORAGE_PATHS` constants and parser patterns
- ✅ Pattern: `Index.job(job)`, `Index.transcript(id)` → Add `Index.artifact(jobId, artifactId)`

**GCS Operations** (`@ingestion/`):
- ✅ **CloudStorageService**: Already provides `putObject`, `getObject`, `listObjects`
- ✅ **CloudStorageConfig**: Already handles GCS credentials and bucket config
- ✅ Pattern: No need to create new GCS layer - reuse existing service

**Domain Schemas** (`@domain/`):
- ✅ **Jobs**: Discriminated union pattern with `Schema.TaggedClass`
- ✅ **Core types**: Branded types for `JobId`, `TranscriptId` → Add `LLMArtifactId`
- ✅ **Events**: Schema patterns for CloudEvents → Follow for LLM artifacts

**Configuration** (`@api/`, `@ingestion/`):
- ✅ **Pattern**: `Layer.effect` + `Effect.gen` for config layers
- ✅ **Pattern**: Use `Config.redacted` for secrets
- ✅ Example: `@llm/config.ts` already follows this pattern

---

## 1. Core Design Principles

### 1.1 Separation of Concerns
- **API Metadata**: Always captured (YouTube API, GCS metadata)
- **LLM Enrichment**: Optional enhancement of metadata
- **Transcription**: Separate LLM operation

### 1.2 Simplified Artifact Tracking
- **NO prompts in domain** - Keep all prompt logic in `@llm/` package
- **Link via jobId** - Use existing `jobId` for all traceability
- **Store config only** - Just model settings, timestamps, token usage

### 1.3 Deployment Independence
- Prompt changes don't require domain package redeployment
- LLM service can iterate on prompts independently
- Workers only care about structured outputs, not prompts

---

## 2. Domain Schema Changes (Minimal)

### 2.1 LLM Execution Artifacts (Simplified)

```typescript
// packages/domain/src/llm/index.ts

/**
 * LLM provider configuration - union type for extensibility.
 */
export const GeminiProviderConfig = Schema.Struct({
  provider: Schema.Literal("gemini"),
  model: Schema.String, // "gemini-2.5-flash"
  temperature: Schema.Number,
  mediaResolution: Schema.optional(Schema.Literal("low", "medium", "high")),
  responseMimeType: Schema.String
})
export type GeminiProviderConfig = Schema.Schema.Type<typeof GeminiProviderConfig>

// Future extensibility
export const LLMProviderConfig = Schema.Union(GeminiProviderConfig)
export type LLMProviderConfig = Schema.Schema.Type<typeof LLMProviderConfig>

/**
 * LLM execution metadata - what happened during the call.
 */
export const LLMExecutionMetadata = Schema.Struct({
  executedAt: Schema.Date,
  durationMs: Schema.Int,
  inputTokens: Schema.optional(Schema.Int),
  outputTokens: Schema.optional(Schema.Int),
  totalTokens: Schema.optional(Schema.Int)
})
export type LLMExecutionMetadata = Schema.Schema.Type<typeof LLMExecutionMetadata>

/**
 * Simplified LLM artifacts - just config + execution + jobId link.
 * Prompts stay in @llm/ package for deployment independence.
 */
export const LLMArtifacts = Schema.Struct({
  id: Schema.String.pipe(Schema.brand("LLMArtifactId")),
  jobId: JobId, // Primary link for traceability
  providerConfig: LLMProviderConfig,
  execution: LLMExecutionMetadata,
  createdAt: Schema.Date
})
export type LLMArtifacts = Schema.Schema.Type<typeof LLMArtifacts>
```

### 2.2 Updated: MediaMetadata with Optional Enrichment

```typescript
// packages/domain/src/media/metadata.ts

/**
 * Enrichment tracking - links to LLM artifacts via jobId + artifactId.
 */
export const EnrichmentMetadata = Schema.Struct({
  enrichedAt: Schema.Date,
  artifactId: Schema.String.pipe(Schema.brand("LLMArtifactId")),
  enrichedFields: Schema.Array(Schema.String), // ["speakers", "tags", "summary"]
  source: Schema.Literal("llm", "manual", "api")
})
export type EnrichmentMetadata = Schema.Schema.Type<typeof EnrichmentMetadata>

export const MediaMetadata = Schema.Struct({
  // ... existing fields ...
  enrichment: Schema.optional(EnrichmentMetadata)
})
```

### 2.3 Updated: Transcript with Artifacts

```typescript
// packages/domain/src/transcription/transcript.ts

export const Transcript = Schema.Struct({
  id: TranscriptId,
  jobId: JobId, // Primary link
  mediaResource: MediaResource,
  
  // Structured output
  turns: Schema.Array(DialogueTurn),
  
  // Raw output for auditing
  rawText: Schema.String.pipe(Schema.nonEmptyString()),
  
  // Link to LLM artifacts
  llmArtifactId: Schema.String.pipe(Schema.brand("LLMArtifactId")),
  
  // Context used for generation
  transcriptionContext: TranscriptionContext,
  
  createdAt: Schema.Date,
  updatedAt: Schema.Date
})
```

**Note:** Changed from embedding full `llmArtifacts` to just storing `llmArtifactId` for reference.

---

## 3. LLM Service (Prompts Stay Here)

### 3.1 Service Interface

```typescript
// packages/llm/src/service.ts

export class LLMService extends Context.Tag("@puredialog/llm/LLMService")<
  LLMService,
  {
    /**
     * Enrich metadata using LLM.
     * Returns enriched metadata + artifact reference.
     */
    readonly enrichMetadata: (
      job: Jobs.QueuedJob | Jobs.MetadataReadyJob,
      baseMetadata: Media.MediaMetadata
    ) => Effect.Effect<{
      enrichedMetadata: Media.MediaMetadata
      artifact: LLM.LLMArtifacts
    }, LLMError>
    
    /**
     * Transcribe media using LLM.
     * Returns transcript with artifact reference.
     */
    readonly transcribeMedia: (
      job: Jobs.ProcessingJob
    ) => Effect.Effect<{
      transcript: Transcription.Transcript
      artifact: LLM.LLMArtifacts
    }, LLMError>
  }
>() {}
```

### 3.2 Artifacts Construction (Simplified)

```typescript
// packages/llm/src/artifacts.ts

import { LLM, Jobs } from "@puredialog/domain"
import { Effect } from "effect"

/**
 * Build LLM artifacts from execution context.
 * Links to job via jobId - no prompt storage needed.
 */
export const buildArtifacts = (params: {
  jobId: Jobs.JobId
  providerConfig: LLM.GeminiProviderConfig
  startTime: Date
  endTime: Date
  tokenUsage?: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
}): LLM.LLMArtifacts => {
  const durationMs = params.endTime.getTime() - params.startTime.getTime()
  
  return LLM.LLMArtifacts.make({
    id: `llm_${Date.now()}_${Math.random().toString(36).slice(2)}` as LLM.LLMArtifactId,
    jobId: params.jobId,
    providerConfig: params.providerConfig,
    execution: LLM.LLMExecutionMetadata.make({
      executedAt: params.startTime,
      durationMs,
      inputTokens: params.tokenUsage?.inputTokens,
      outputTokens: params.tokenUsage?.outputTokens,
      totalTokens: params.tokenUsage?.totalTokens
    }),
    createdAt: new Date()
  })
}
```

### 3.3 Prompt Management (Stays in LLM Package)

```typescript
// packages/llm/src/prompts/transcribe_media.ts

// All prompt logic stays here - can be updated without redeploying domain/workers

export const systemInstruction = `...`

export const hints = (metadata: Media.MediaMetadata): string => {
  // Build context from metadata
  return `...`
}

export const instructions = `...`
```

```typescript
// packages/llm/src/prompts/enrich_metadata.ts

/**
 * Build enrichment prompt from metadata.
 * This stays in LLM package for easy iteration.
 */
export const buildEnrichmentPrompt = (
  metadata: Media.MediaMetadata,
  goal: string
): string => {
  return `
System: You are a metadata extraction expert.

Goal: ${goal}

Source Data:
${JSON.stringify(metadata, null, 2)}

Instructions: Extract structured information and return as JSON.
`
}
```

### 3.4 Service Implementation

```typescript
// packages/llm/src/service.ts

const makeLLMService = Effect.gen(function*() {
  const client = yield* GeminiClient
  const config = yield* GeminiConfig
  
  const transcribeMedia = (job: Jobs.ProcessingJob) =>
    Effect.gen(function*() {
      const startTime = new Date()
      
      // Build prompt from job (prompt stays in LLM package)
      const videoUrl = YouTube.videoIdToWatchUrl(job.media.data.id)
      const promptText = buildTranscriptionPrompt(job.metadata)
      
      // Execute LLM call
      const { rawOutput, tokenUsage } = yield* client.execute({
        videoUrl,
        promptText,
        config: toProviderConfig(config)
      })
      
      const endTime = new Date()
      
      // Build artifacts (no prompt storage)
      const artifact = buildArtifacts({
        jobId: job.id,
        providerConfig: toProviderConfig(config),
        startTime,
        endTime,
        tokenUsage
      })
      
      // Parse and construct transcript
      const turns = yield* parseDialogueTurns(rawOutput)
      const rawText = reconstructRawText(turns)
      
      const transcript = Transcription.Transcript.make({
        id: `transcript_${job.id}` as Transcription.TranscriptId,
        jobId: job.id,
        mediaResource: job.media,
        turns,
        rawText,
        llmArtifactId: artifact.id,
        transcriptionContext: job.transcriptionContext,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      return { transcript, artifact }
    })
  
  const enrichMetadata = (
    job: Jobs.QueuedJob | Jobs.MetadataReadyJob,
    baseMetadata: Media.MediaMetadata
  ) =>
    Effect.gen(function*() {
      const startTime = new Date()
      
      // Build enrichment prompt (stays in LLM package)
      const promptText = buildEnrichmentPrompt(
        baseMetadata,
        "Extract speaker names, roles, and affiliations from description"
      )
      
      const { rawOutput, tokenUsage } = yield* client.execute({
        promptText,
        config: toProviderConfig(config)
      })
      
      const endTime = new Date()
      
      const artifact = buildArtifacts({
        jobId: job.id,
        providerConfig: toProviderConfig(config),
        startTime,
        endTime,
        tokenUsage
      })
      
      // Parse enrichment and merge with base metadata
      const enrichmentData = yield* parseEnrichmentOutput(rawOutput)
      const enrichedMetadata = mergeEnrichment(baseMetadata, enrichmentData, artifact.id)
      
      return { enrichedMetadata, artifact }
    })
  
  return LLMService.of({ transcribeMedia, enrichMetadata })
})
```

---

## 4. Worker Integration

### 4.1 Metadata Worker

```typescript
// packages/worker-metadata/src/handler.ts

const processJob = (cloudEvent: CloudEvent) =>
  Effect.gen(function*() {
    const { jobId } = yield* parseCloudEvent(cloudEvent)
    const job = yield* jobStore.get(jobId) // QueuedJob
    
    // Step 1: Fetch API metadata (always)
    const apiMetadata = yield* youtubeService.fetchMetadata(job.media.data.id)
    
    // Step 2: Optional LLM enrichment
    const shouldEnrich = yield* decideShouldEnrich(apiMetadata)
    
    let finalMetadata = apiMetadata
    
    if (shouldEnrich) {
      const { enrichedMetadata, artifact } = yield* llmService.enrichMetadata(
        job,
        apiMetadata
      )
      
      finalMetadata = enrichedMetadata
      
      // Store artifact (linked via jobId)
      yield* artifactStore.save(artifact)
      
      yield* Effect.logInfo("Metadata enriched", { 
        jobId: job.id,
        artifactId: artifact.id,
        enrichedFields: finalMetadata.enrichment?.enrichedFields 
      })
    }
    
    // Step 3: Transition job
    const metadataReadyJob = Jobs.JobTransitions.enrichWithMetadata(
      job,
      finalMetadata
    )
    yield* jobStore.update(metadataReadyJob)
    
    // Step 4: Move to Processing/
    yield* gcsService.moveJob(jobId, "Queued", "Processing")
  })
```

### 4.2 Transcription Worker

```typescript
// packages/worker-transcription/src/handler.ts

const processJob = (cloudEvent: CloudEvent) =>
  Effect.gen(function*() {
    const { jobId } = yield* parseCloudEvent(cloudEvent)
    const job = yield* jobStore.get(jobId) // ProcessingJob
    
    // Step 1: Transcribe (artifact created and linked via jobId)
    const { transcript, artifact } = yield* llmService.transcribeMedia(job)
    
    // Step 2: Store artifact
    yield* artifactStore.save(artifact)
    
    // Step 3: Store transcript (contains llmArtifactId reference)
    yield* transcriptStore.save(transcript)
    
    yield* Effect.logInfo("Transcription completed", {
      jobId: job.id,
      transcriptId: transcript.id,
      artifactId: artifact.id,
      turns: transcript.turns.length
    })
    
    // Step 4: Transition job
    const completedJob = Jobs.JobTransitions.complete(job, transcript.id)
    yield* jobStore.update(completedJob)
    
    // Step 5: Move to Completed/
    yield* gcsService.moveJob(jobId, "Processing", "Completed")
  })
```

---

## 5. Traceability via jobId

### 5.1 Linking Structure

```
jobId: "job_123"
├── Job States (GCS)
│   ├── jobs/Queued/job_123.json
│   ├── jobs/Processing/job_123.json
│   └── jobs/Completed/job_123.json
├── Events (GCS)
│   ├── events/job_123/event_1.json
│   └── events/job_123/event_2.json
├── Artifacts (GCS)
│   ├── artifacts/job_123/llm_001.json  ← Enrichment artifact
│   └── artifacts/job_123/llm_002.json  ← Transcription artifact
└── Transcript (GCS)
    └── transcripts/job_123.json (contains llmArtifactId: "llm_002")
```

### 5.2 Query Pattern

**Get all artifacts for a job:**
```typescript
const getJobArtifacts = (jobId: Jobs.JobId) =>
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const config = yield* CloudStorageConfig
    
    // List all artifacts for this job
    const artifactPrefix = `artifacts/${jobId}/`
    const artifacts = yield* storage.listObjects(config.bucket, artifactPrefix)
    
    return artifacts
  })
```

**Get transcript with its artifact:**
```typescript
const getTranscriptWithArtifact = (jobId: Jobs.JobId) =>
  Effect.gen(function*() {
    const transcript = yield* transcriptStore.get(jobId)
    const artifact = yield* artifactStore.get(transcript.llmArtifactId)
    
    return { transcript, artifact }
  })
```

### 5.3 Alternative: requestId vs jobId

**Analysis:**

| ID Type | Scope | Persistence | Usage |
|---------|-------|-------------|-------|
| `jobId` | Full job lifecycle | Permanent | Primary identifier for all artifacts |
| `requestId` | Single API request | Transient (tracing only) | Request/response correlation |
| `idempotencyKey` | Deduplication | Optional (user-provided) | Preventing duplicate job creation |

**Recommendation:** Use `jobId` as the primary link because:
- ✅ Persists across all state transitions
- ✅ Already used for GCS paths
- ✅ Links jobs → artifacts → transcripts
- ✅ Simplest query pattern

**Alternative pattern (if needed later):**
```typescript
LLMArtifacts {
  id: LLMArtifactId,
  jobId: JobId,         // Primary link
  requestId: RequestId, // Optional: Request tracing
}
```

---

## 6. Storage Strategy (Simplified)

**Reuses:** `@ingestion/CloudStorageService`, `@storage/Index` pattern

### 6.1 Extend Index Utilities

```typescript
// packages/storage/src/indices.ts (ADD to existing file)

export const Index = {
  // ... existing methods: job, jobPath, idempotency, transcript, event ...
  
  /**
   * Generates the full GCS path for an LLM artifact.
   * Follows existing Index pattern for consistency.
   * @param jobId The job ID this artifact belongs to
   * @param artifactId The unique artifact identifier
   * @returns The full GCS object key, e.g., `artifacts/job_123/llm_abc.json`
   */
  artifact: (jobId: Core.JobId, artifactId: Core.LLMArtifactId): string =>
    `${STORAGE_PATHS.ARTIFACTS_PREFIX}/${jobId}/${artifactId}.json`,
  
  /**
   * Generates the prefix for listing all artifacts for a job.
   * @param jobId The job ID to list artifacts for
   * @returns The GCS prefix, e.g., `artifacts/job_123/`
   */
  artifacts: (jobId: Core.JobId): string =>
    `${STORAGE_PATHS.ARTIFACTS_PREFIX}/${jobId}/`,
  
  /**
   * Returns the prefix for listing all artifacts across all jobs.
   */
  allArtifacts: (): string =>
    `${STORAGE_PATHS.ARTIFACTS_PREFIX}/`
  
  // ... rest of existing Index methods
} as const
```

```typescript
// packages/storage/src/paths.ts (ADD to existing constants)

export const STORAGE_PATHS = {
  JOBS_PREFIX: "jobs",
  TRANSCRIPTS_PREFIX: "transcripts",
  IDEMPOTENCY_PREFIX: "idempotency",
  EVENTS_PREFIX: "events",
  ARTIFACTS_PREFIX: "artifacts"  // ← ADD THIS
} as const
```

### 6.2 Artifact Storage (Uses Existing CloudStorageService)

```typescript
// packages/storage/src/artifacts.ts (NEW FILE)

import { CloudStorageService } from "@puredialog/ingestion"
import { CloudStorageConfig } from "@puredialog/ingestion"
import { LLM, Core } from "@puredialog/domain"
import { Effect, Schema, Option } from "effect"
import { Index } from "./indices.js"

/**
 * Store LLM artifacts by jobId for easy retrieval.
 * Reuses existing CloudStorageService from @ingestion package.
 */
export const LLMArtifactStore = {
  save: (artifact: LLM.LLMArtifacts) =>
    Effect.gen(function*() {
      const storage = yield* CloudStorageService  // ← Reuse existing service
      const config = yield* CloudStorageConfig    // ← Reuse existing config
      
      // Use Index helper for consistent path generation
      const path = Index.artifact(artifact.jobId, artifact.id)
      
      yield* storage.putObject(config.bucket, path, artifact)
      
      yield* Effect.logInfo("Stored LLM artifact", { 
        jobId: artifact.jobId,
        artifactId: artifact.id,
        path 
      })
    }),
  
  get: (jobId: Core.JobId, artifactId: LLM.LLMArtifactId) =>
    Effect.gen(function*() {
      const storage = yield* CloudStorageService
      const config = yield* CloudStorageConfig
      
      const path = Index.artifact(jobId, artifactId)
      
      // getObject returns Option<T> - follow existing pattern
      return yield* storage.getObject(config.bucket, path, LLM.LLMArtifacts)
    }),
  
  listByJob: (jobId: Core.JobId) =>
    Effect.gen(function*() {
      const storage = yield* CloudStorageService
      const config = yield* CloudStorageConfig
      
      // Use Index helper for prefix
      const prefix = Index.artifacts(jobId)
      
      // Returns array of object keys (paths)
      return yield* storage.listObjects(config.bucket, prefix)
    })
}
```

### 6.2 Transcript Storage

```typescript
// packages/storage/src/transcripts.ts

export const TranscriptStore = {
  save: (transcript: Transcription.Transcript) =>
    Effect.gen(function*() {
      const storage = yield* CloudStorageService
      const config = yield* CloudStorageConfig
      
      const path = `transcripts/${transcript.jobId}.json`
      yield* storage.putObject(config.bucket, path, transcript)
      
      yield* Effect.logInfo("Stored transcript", { 
        jobId: transcript.jobId,
        transcriptId: transcript.id,
        llmArtifactId: transcript.llmArtifactId
      })
    }),
  
  get: (jobId: Jobs.JobId) =>
    Effect.gen(function*() {
      const storage = yield* CloudStorageService
      const config = yield* CloudStorageConfig
      
      const path = `transcripts/${jobId}.json`
      const data = yield* storage.getObject(config.bucket, path)
      
      return yield* Schema.decodeUnknown(Transcription.Transcript)(data)
    })
}
```

---

## 7. Implementation Phases (Updated)

### Phase 1: Domain Foundation (4 hours)
- [ ] Create `packages/domain/src/llm/index.ts`
- [ ] Add `GeminiProviderConfig` schema
- [ ] Add `LLMExecutionMetadata` schema (executedAt, durationMs, tokens)
- [ ] Add `LLMArtifacts` schema (id, jobId, providerConfig, execution)
- [ ] Add `EnrichmentMetadata` to `MediaMetadata`
- [ ] Update `Transcript` to have `llmArtifactId` field
- [ ] Export from domain index
- [ ] Run `pnpm --filter @puredialog/domain build && pnpm --filter @puredialog/domain typecheck`

### Phase 2: LLM Service Refactor (6 hours)
- [ ] Create `src/artifacts.ts` with `buildArtifacts` helper
- [ ] Update `GeminiClient` to capture timestamps and token usage
- [ ] Add `enrichMetadata` method to `LLMService`
- [ ] Update `transcribeMedia` to accept `ProcessingJob` and return artifact
- [ ] Update adapters to construct `Transcript` with `llmArtifactId`
- [ ] Add `config.toProviderConfig` helper
- [ ] Create `src/prompts/enrich_metadata.ts`
- [ ] Run `pnpm --filter @puredialog/llm build && pnpm --filter @puredialog/llm typecheck`

### Phase 3: Storage Layer (3 hours)
- [ ] Add `LLMArtifactStore` to `@storage/` with save/get/listByJob
- [ ] Update `TranscriptStore` to handle `llmArtifactId`
- [ ] Add index helpers for artifact paths
- [ ] Run `pnpm --filter @puredialog/storage build && pnpm --filter @puredialog/storage typecheck`

### Phase 4: Worker Updates (4 hours)
- [ ] Update metadata worker with optional enrichment flow
- [ ] Update transcription worker to use new API
- [ ] Test end-to-end with CloudEvents
- [ ] Verify artifact storage and linking

### Phase 5: Testing (3 hours)
- [ ] Write LLM service tests
- [ ] Write artifact construction tests
- [ ] Write storage tests
- [ ] Integration tests

**Total Estimated Time:** ~20 hours (2.5 days)

---

## 8. Key Benefits (Updated)

### 8.1 Deployment Independence ✅
- **Prompt changes** → Only redeploy `@llm/` package
- **Domain changes** → Workers don't need prompt knowledge
- **Worker changes** → Independent of prompt iterations

### 8.2 Simplified Traceability ✅
- **Single link**: `jobId` connects everything
- **Query pattern**: `artifacts/{jobId}/*.json`
- **No prompt storage**: Reduces storage costs

### 8.3 Clean Separation ✅
- **Domain**: Just config + execution metadata
- **LLM Package**: All prompt logic + LLM interaction
- **Workers**: Just orchestration

### 8.4 Cost Efficiency ✅
- **Smaller artifacts**: No prompt text duplication
- **Query efficiency**: Prefix-based lookups by jobId
- **Storage savings**: ~80% smaller artifacts

---

## 9. Comparison: Embedded vs Referenced Artifacts

### Option A: Embed Full Artifact in Transcript ❌
```typescript
Transcript {
  llmArtifacts: LLMArtifacts  // Embedded
}
```
**Cons:**
- Larger transcript files
- Duplicate storage (transcript + separate artifact)
- Harder to query just artifacts

### Option B: Reference by ID ✅ (Chosen)
```typescript
Transcript {
  llmArtifactId: LLMArtifactId  // Reference
}
```
**Pros:**
- Smaller transcript files
- Single source of truth for artifacts
- Easy to list all artifacts for a job
- Can fetch artifact on demand

---

## 10. Open Questions Resolved

### Q1: Where to store prompts?
**Answer:** `@llm/` package only
- ✅ Independent deployment
- ✅ Easy iteration
- ✅ No domain coupling

### Q2: What ID to use for linking?
**Answer:** `jobId` (primary)
- ✅ Persists through lifecycle
- ✅ Already used for GCS paths
- ✅ Simplest query pattern

### Q3: Embed or reference artifacts?
**Answer:** Reference by `llmArtifactId`
- ✅ Smaller files
- ✅ Single source of truth
- ✅ Query flexibility

### Q4: Store requestId in artifacts?
**Answer:** Not needed initially
- `jobId` is sufficient for tracing
- Can add later if request tracing becomes critical

---

## Success Metrics

- [ ] Transcripts reference artifacts via `llmArtifactId`
- [ ] Artifacts linked via `jobId` for easy querying
- [ ] Prompts stay in `@llm/` package
- [ ] Workers don't depend on prompt changes
- [ ] Artifact storage < 10KB per artifact
- [ ] Query pattern: `artifacts/{jobId}/*.json` works
- [ ] Tests pass with >80% coverage

---

## Conclusion

This simplified architecture keeps prompts in the `@llm/` package for deployment independence, while using `jobId` as the primary link for all traceability. Artifacts are referenced (not embedded) for storage efficiency and query flexibility.

**Estimated Total Effort:** 2.5 days
**Risk Level:** Low (minimal domain changes, clear separation)
**Recommendation:** Proceed with Phase 1 immediately.

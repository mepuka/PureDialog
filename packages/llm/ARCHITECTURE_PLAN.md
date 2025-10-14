# LLM Package Architecture Plan

## Executive Summary

Refactor `@llm/` to support two distinct workflows:
1. **Metadata Enrichment** (optional) - Parse structured info from unstructured text
2. **Media Transcription** (required) - Generate full transcripts

Both operations persist complete LLM execution artifacts for reproducibility and auditing.

---

## 1. Core Design Principles

### 1.1 Separation of Concerns
- **API Metadata**: Always captured (YouTube API, GCS metadata)
- **LLM Enrichment**: Optional enhancement of metadata
- **Transcription**: Separate LLM operation

### 1.2 Artifact Persistence
- Persist **complete prompt** (system instruction + user content)
- Persist **LLM configuration** (model, temperature, etc.)
- Persist **provider info** (Gemini for now, extensible)
- Persist **execution metadata** (timestamps, token usage)

### 1.3 Simplicity First
- Concrete Gemini types (not abstract provider layer)
- Union type for future extensibility
- No premature abstraction

---

## 2. Domain Schema Changes

### 2.1 New: LLM Execution Artifacts

```typescript
// packages/domain/src/llm/index.ts

/**
 * LLM provider configuration - union type for extensibility.
 * Start with Gemini, add others as needed.
 */
export const GeminiProviderConfig = Schema.Struct({
  provider: Schema.Literal("gemini"),
  model: Schema.String, // "gemini-2.5-flash"
  temperature: Schema.Number,
  mediaResolution: Schema.optional(Schema.Literal("low", "medium", "high")),
  responseMimeType: Schema.String,
  maxOutputTokens: Schema.optional(Schema.Int)
})
export type GeminiProviderConfig = Schema.Schema.Type<typeof GeminiProviderConfig>

// Future: OpenAIProviderConfig, AnthropicProviderConfig, etc.
export const LLMProviderConfig = Schema.Union(GeminiProviderConfig)
export type LLMProviderConfig = Schema.Schema.Type<typeof LLMProviderConfig>

/**
 * Complete prompt as sent to LLM - critical for reproducibility.
 */
export const LLMPrompt = Schema.Struct({
  systemInstruction: Schema.String,
  userContent: Schema.Array(
    Schema.Union(
      Schema.Struct({
        type: Schema.Literal("text"),
        content: Schema.String
      }),
      Schema.Struct({
        type: Schema.Literal("media"),
        uri: Schema.String
      })
    )
  ),
  compiledAt: Schema.Date
})
export type LLMPrompt = Schema.Schema.Type<typeof LLMPrompt>

/**
 * LLM execution metadata - what happened during the call.
 */
export const LLMExecutionMetadata = Schema.Struct({
  startedAt: Schema.Date,
  completedAt: Schema.Date,
  durationMs: Schema.Int,
  inputTokens: Schema.optional(Schema.Int),
  outputTokens: Schema.optional(Schema.Int),
  totalTokens: Schema.optional(Schema.Int)
})
export type LLMExecutionMetadata = Schema.Schema.Type<typeof LLMExecutionMetadata>

/**
 * Complete artifacts from an LLM operation - full traceability.
 */
export const LLMArtifacts = Schema.Struct({
  id: Schema.String.pipe(Schema.brand("LLMArtifactId")), // Unique per LLM call
  providerConfig: LLMProviderConfig,
  prompt: LLMPrompt,
  execution: LLMExecutionMetadata,
  rawResponse: Schema.String, // Complete raw output for auditing
  createdAt: Schema.Date
})
export type LLMArtifacts = Schema.Schema.Type<typeof LLMArtifacts>
```

### 2.2 Updated: MediaMetadata with Optional Enrichment

```typescript
// packages/domain/src/media/metadata.ts

/**
 * Enrichment metadata - tracks if/how LLM enhanced the metadata.
 */
export const EnrichmentMetadata = Schema.Struct({
  enrichedAt: Schema.Date,
  artifactId: Schema.String.pipe(Schema.brand("LLMArtifactId")),
  enrichedFields: Schema.Array(Schema.String), // ["speakers", "tags", "summary"]
  source: Schema.Literal("llm", "manual", "api") // How was it enriched
})
export type EnrichmentMetadata = Schema.Schema.Type<typeof EnrichmentMetadata>

// Update MediaMetadata to include optional enrichment info
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
  jobId: JobId,
  mediaResource: MediaResource,
  
  // Structured output
  turns: Schema.Array(DialogueTurn),
  
  // Raw output for auditing
  rawText: Schema.String.pipe(Schema.nonEmptyString()),
  
  // Complete LLM artifacts - full traceability
  llmArtifacts: LLM.LLMArtifacts,
  
  // Context used for generation
  transcriptionContext: TranscriptionContext,
  
  createdAt: Schema.Date,
  updatedAt: Schema.Date
})
```

---

## 3. LLM Service Refactor

### 3.1 Service Interface

```typescript
// packages/llm/src/service.ts

export class LLMService extends Context.Tag("@puredialog/llm/LLMService")<
  LLMService,
  {
    /**
     * Enrich metadata using LLM.
     * Optional operation - may be skipped if API metadata is sufficient.
     * 
     * Example: Parse speaker names/bios from YouTube description.
     */
    readonly enrichMetadata: (
      metadata: Media.MediaMetadata,
      enrichmentPrompt: string
    ) => Effect.Effect<{
      enrichedMetadata: Media.MediaMetadata
      artifacts: LLM.LLMArtifacts
    }, LLMError>
    
    /**
     * Transcribe media using LLM.
     * Core operation - always captures complete artifacts.
     */
    readonly transcribeMedia: (
      job: Jobs.ProcessingJob
    ) => Effect.Effect<{
      transcript: Transcription.Transcript
      artifacts: LLM.LLMArtifacts
    }, LLMError>
  }
>() {}
```

### 3.2 Artifacts Construction

```typescript
// packages/llm/src/artifacts.ts

import { LLM } from "@puredialog/domain"
import { Schema } from "effect"

/**
 * Construct LLM artifacts from execution context.
 * Captures everything needed for reproducibility.
 */
export const buildArtifacts = (params: {
  providerConfig: LLM.GeminiProviderConfig
  prompt: LLM.LLMPrompt
  rawResponse: string
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
    providerConfig: params.providerConfig,
    prompt: params.prompt,
    execution: LLM.LLMExecutionMetadata.make({
      startedAt: params.startTime,
      completedAt: params.endTime,
      durationMs,
      inputTokens: params.tokenUsage?.inputTokens,
      outputTokens: params.tokenUsage?.outputTokens,
      totalTokens: params.tokenUsage?.totalTokens
    }),
    rawResponse: params.rawResponse,
    createdAt: new Date()
  })
}
```

### 3.3 Prompt Builder

```typescript
// packages/llm/src/prompt-builder.ts

import { LLM, Jobs } from "@puredialog/domain"
import { systemInstruction, hints, instructions } from "./prompts/transcribe_media.js"

/**
 * Build complete LLM prompt for transcription.
 * Captures full prompt for artifact persistence.
 */
export const buildTranscriptionPrompt = (
  job: Jobs.ProcessingJob
): LLM.LLMPrompt => {
  const metadata = job.metadata
  const videoUrl = YouTube.videoIdToWatchUrl(job.media.data.id)
  
  const userContent: LLM.LLMPrompt["userContent"] = [
    { type: "media" as const, uri: videoUrl },
    { type: "text" as const, content: hints(metadata) },
    { type: "text" as const, content: instructions }
  ]
  
  return LLM.LLMPrompt.make({
    systemInstruction,
    userContent,
    compiledAt: new Date()
  })
}

/**
 * Build LLM prompt for metadata enrichment.
 * Example: Parse speaker details from YouTube description.
 */
export const buildEnrichmentPrompt = (
  metadata: Media.MediaMetadata,
  enrichmentGoal: string
): LLM.LLMPrompt => {
  const systemInstr = `You are a metadata extraction expert. Extract structured information from unstructured text.`
  
  const userContent: LLM.LLMPrompt["userContent"] = [
    {
      type: "text" as const,
      content: `Goal: ${enrichmentGoal}\n\nSource Data:\n${JSON.stringify(metadata, null, 2)}`
    }
  ]
  
  return LLM.LLMPrompt.make({
    systemInstruction: systemInstr,
    userContent,
    compiledAt: new Date()
  })
}
```

### 3.4 Updated Client

```typescript
// packages/llm/src/client.ts

export class GeminiClient extends Context.Tag("GeminiClient")<
  GeminiClient,
  {
    /**
     * Execute LLM call with full artifact capture.
     */
    readonly execute: (params: {
      prompt: LLM.LLMPrompt
      config: LLM.GeminiProviderConfig
    }) => Effect.Effect<{
      rawResponse: string
      tokenUsage?: {
        inputTokens: number
        outputTokens: number
        totalTokens: number
      }
    }, GoogleApiError>
  }
>() {}

// Implementation captures timestamps, tokens, and returns complete response
```

---

## 4. Worker Integration

### 4.1 Metadata Worker Flow

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
    let enrichmentArtifact: LLM.LLMArtifacts | undefined = undefined
    
    if (shouldEnrich) {
      const enrichmentResult = yield* llmService.enrichMetadata(
        apiMetadata,
        "Extract speaker names, roles, and affiliations from description"
      )
      finalMetadata = enrichmentResult.enrichedMetadata
      enrichmentArtifact = enrichmentResult.artifacts
      
      // Store enrichment artifacts
      yield* artifactStore.save(enrichmentArtifact)
    }
    
    // Step 3: Transition job with metadata
    const metadataReadyJob = Jobs.JobTransitions.enrichWithMetadata(
      job,
      finalMetadata
    )
    yield* jobStore.update(metadataReadyJob)
    
    // Step 4: Move to Processing/
    yield* gcsService.moveJob(jobId, "Queued", "Processing")
  })
```

### 4.2 Transcription Worker Flow

```typescript
// packages/worker-transcription/src/handler.ts

const processJob = (cloudEvent: CloudEvent) =>
  Effect.gen(function*() {
    const { jobId } = yield* parseCloudEvent(cloudEvent)
    const job = yield* jobStore.get(jobId) // ProcessingJob
    
    // Step 1: Transcribe with LLM
    const { transcript, artifacts } = yield* llmService.transcribeMedia(job)
    
    // Step 2: Store artifacts
    yield* artifactStore.save(artifacts)
    
    // Step 3: Store transcript
    yield* transcriptStore.save(transcript)
    
    // Step 4: Transition job
    const completedJob = Jobs.JobTransitions.complete(job, transcript.id)
    yield* jobStore.update(completedJob)
    
    // Step 5: Move to Completed/
    yield* gcsService.moveJob(jobId, "Processing", "Completed")
  })
```

---

## 5. Storage Strategy

### 5.1 Artifact Storage

```typescript
// packages/storage/src/artifacts.ts

/**
 * Store LLM artifacts in GCS for audit trail.
 * Path: artifacts/{jobId}/{artifactId}.json
 */
export const LLMArtifactStore = Layer.succeed(
  ArtifactStore,
  {
    save: (artifact: LLM.LLMArtifacts) =>
      Effect.gen(function*() {
        const storage = yield* CloudStorageService
        const config = yield* CloudStorageConfig
        
        const path = `artifacts/${artifact.jobId}/${artifact.id}.json`
        yield* storage.putObject(config.bucket, path, artifact)
        
        yield* Effect.logInfo("Stored LLM artifact", { 
          artifactId: artifact.id, 
          path 
        })
      })
  }
)
```

### 5.2 Transcript Storage

```typescript
// packages/storage/src/transcripts.ts

/**
 * Store transcripts with embedded artifacts.
 * Path: transcripts/{jobId}.json
 */
export const TranscriptStore = {
  save: (transcript: Transcription.Transcript) =>
    Effect.gen(function*() {
      const storage = yield* CloudStorageService
      const config = yield* CloudStorageConfig
      
      const path = `transcripts/${transcript.jobId}.json`
      yield* storage.putObject(config.bucket, path, transcript)
      
      // Transcript already contains llmArtifacts field
      yield* Effect.logInfo("Stored transcript", { 
        transcriptId: transcript.id,
        artifactId: transcript.llmArtifacts.id,
        path 
      })
    })
}
```

---

## 6. Configuration Management

### 6.1 LLM Config Layer

```typescript
// packages/llm/src/config.ts

export const GeminiConfig = Config.all({
  apiKey: Config.redacted("GEMINI_API_KEY"),
  model: Config.string("GEMINI_MODEL").pipe(
    Config.withDefault("gemini-2.5-flash")
  ),
  temperature: Config.number("GEMINI_TEMPERATURE").pipe(
    Config.withDefault(0.0)
  ),
  maxRetries: Config.number("GEMINI_MAX_RETRIES").pipe(
    Config.withDefault(3)
  )
})

/**
 * Convert runtime config to domain schema for artifact persistence.
 */
export const toProviderConfig = (
  config: typeof GeminiConfig.Type
): LLM.GeminiProviderConfig =>
  LLM.GeminiProviderConfig.make({
    provider: "gemini",
    model: config.model,
    temperature: config.temperature,
    mediaResolution: "low",
    responseMimeType: "application/json"
  })
```

---

## 7. Testing Strategy

### 7.1 LLM Service Tests

```typescript
// packages/llm/test/service.test.ts

describe("LLMService", () => {
  describe("enrichMetadata", () => {
    it.effect("should enrich metadata and return artifacts", () =>
      Effect.gen(function*() {
        const mockClient = yield* makeMockGeminiClient()
        const service = yield* LLMService
        
        const metadata = Media.MediaMetadata.make({ /* ... */ })
        const result = yield* service.enrichMetadata(metadata, "Extract speakers")
        
        assert.isDefined(result.enrichedMetadata)
        assert.isDefined(result.artifacts)
        assert.strictEqual(result.artifacts.providerConfig.provider, "gemini")
        assert.isDefined(result.artifacts.prompt.systemInstruction)
      })
    )
  })
  
  describe("transcribeMedia", () => {
    it.effect("should transcribe and capture complete artifacts", () =>
      Effect.gen(function*() {
        const job = Jobs.ProcessingJob.make({ /* ... */ })
        const service = yield* LLMService
        
        const result = yield* service.transcribeMedia(job)
        
        assert.isDefined(result.transcript.turns)
        assert.isDefined(result.transcript.rawText)
        assert.strictEqual(result.transcript.llmArtifacts.id, result.artifacts.id)
        assert.isDefined(result.artifacts.prompt.compiledAt)
      })
    )
  })
})
```

### 7.2 Artifact Construction Tests

```typescript
// packages/llm/test/artifacts.test.ts

describe("buildArtifacts", () => {
  it("should construct complete artifacts with all fields", () => {
    const artifacts = buildArtifacts({
      providerConfig: { /* ... */ },
      prompt: { /* ... */ },
      rawResponse: "test response",
      startTime: new Date("2025-01-01T00:00:00Z"),
      endTime: new Date("2025-01-01T00:01:00Z"),
      tokenUsage: { inputTokens: 100, outputTokens: 200, totalTokens: 300 }
    })
    
    assert.strictEqual(artifacts.execution.durationMs, 60000)
    assert.strictEqual(artifacts.execution.inputTokens, 100)
    assert.isDefined(artifacts.id)
  })
})
```

---

## 8. Implementation Phases

### Phase 1: Domain Foundation (Day 1)
- [ ] Create `packages/domain/src/llm/` directory
- [ ] Add `LLMProviderConfig`, `LLMPrompt`, `LLMExecutionMetadata`, `LLMArtifacts` schemas
- [ ] Update `MediaMetadata` with optional `EnrichmentMetadata`
- [ ] Update `Transcript` to include `llmArtifacts: LLM.LLMArtifacts`
- [ ] Export from `@puredialog/domain`
- [ ] Run `pnpm --filter @puredialog/domain build`

### Phase 2: LLM Service Refactor (Day 1-2)
- [ ] Create `src/artifacts.ts` with `buildArtifacts` helper
- [ ] Create `src/prompt-builder.ts` with prompt construction
- [ ] Update `GeminiClient` to capture timestamps and token usage
- [ ] Refactor `LLMService` interface:
  - [ ] Add `enrichMetadata` method
  - [ ] Update `transcribeMedia` to accept `ProcessingJob`
  - [ ] Both methods return artifacts
- [ ] Update `LLMAdapter` to construct `Transcript` with artifacts
- [ ] Run `pnpm --filter @puredialog/llm build`

### Phase 3: Storage Layer (Day 2)
- [ ] Add `LLMArtifactStore` to `@storage/` package
- [ ] Add `TranscriptStore` to `@storage/` package
- [ ] Add index helpers for artifact paths
- [ ] Write tests for storage operations
- [ ] Run `pnpm --filter @puredialog/storage build`

### Phase 4: Worker Updates (Day 2-3)
- [ ] Update metadata worker:
  - [ ] Add optional LLM enrichment flow
  - [ ] Store enrichment artifacts if used
  - [ ] Update job transition with enriched metadata
- [ ] Update transcription worker:
  - [ ] Use new `transcribeMedia` API
  - [ ] Store transcript with embedded artifacts
  - [ ] Update job transition
- [ ] Test end-to-end with CloudEvents

### Phase 5: Testing & Documentation (Day 3)
- [ ] Write LLM service tests
- [ ] Write artifact construction tests
- [ ] Write storage integration tests
- [ ] Update worker specs
- [ ] Create integration guide
- [ ] Update API documentation

---

## 9. Migration Strategy

### 9.1 Backward Compatibility

**Transcript Storage:**
- Old: `transcripts/{jobId}.json` (no artifacts)
- New: `transcripts/{jobId}.json` (with artifacts)
- Strategy: Add `llmArtifacts` as required field (new transcripts only)

**Metadata:**
- Old: `MediaMetadata` (no enrichment field)
- New: `MediaMetadata` (optional enrichment field)
- Strategy: `enrichment` is optional, backward compatible

### 9.2 Deployment Order

1. Deploy domain package (adds new schemas)
2. Deploy LLM package (updated service)
3. Deploy storage package (artifact storage)
4. Deploy workers (updated flows)

---

## 10. Key Benefits

### 10.1 Reproducibility ✅
- Complete prompt captured → can replay exact LLM call
- Full configuration stored → can debug/compare model versions
- Token usage tracked → can audit costs per job

### 10.2 Flexibility ✅
- LLM enrichment is optional → not required for all workflows
- Union type for providers → easy to add OpenAI, Anthropic later
- Artifacts separate from core entities → can query/analyze independently

### 10.3 Observability ✅
- Execution metadata → performance tracking
- Raw responses → audit trail
- Artifact IDs → link metadata enrichment to transcription

### 10.4 Simplicity ✅
- Concrete Gemini types → no premature abstraction
- Clear separation → metadata vs transcription
- Single artifact schema → consistent across operations

---

## 11. Open Questions & Decisions

### Q1: Where to store artifacts?
**Answer:** GCS at `artifacts/{jobId}/{artifactId}.json`
- **Pros:** Centralized, durable, easily queryable
- **Cons:** Slightly higher latency than in-memory
- **Decision:** Use GCS for audit trail, cache in memory for active jobs

### Q2: Should artifacts be embedded in Transcript or separate?
**Answer:** Embedded in `Transcript` for simplicity
- **Pros:** Single source of truth, always available
- **Cons:** Larger JSON files
- **Decision:** Embed + store separately for flexibility

### Q3: How to handle enrichment for existing metadata?
**Answer:** Enrichment is optional, applied on first processing
- If metadata lacks enrichment → worker decides if needed
- If metadata has enrichment → skip LLM call

### Q4: Should we version artifacts?
**Answer:** Not initially, add if needed
- Artifact ID + timestamp is sufficient for now
- Can add versioning later if we need to replay/compare

---

## 12. Success Metrics

- [ ] All transcripts include `llmArtifacts` field
- [ ] Artifacts stored in GCS for every LLM call
- [ ] Metadata enrichment is optional and traceable
- [ ] Workers can skip enrichment without breaking flow
- [ ] Complete prompts are persisted and queryable
- [ ] Token usage is tracked per job
- [ ] Tests pass with >80% coverage
- [ ] Documentation is complete and accurate

---

## 13. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large artifact files | Storage costs | Compress JSON, archive old artifacts |
| Schema changes break workers | Deployment failures | Phase deployment, backward compatible schemas |
| LLM enrichment delays jobs | Longer processing time | Make enrichment async, use timeout |
| Artifact storage failures | Lost traceability | Retry on failure, log warnings |

---

## Conclusion

This architecture separates metadata enrichment from transcription while maintaining full traceability through comprehensive artifact persistence. The design is simple, extensible, and follows Effect best practices.

**Estimated Total Effort:** 3 days
**Risk Level:** Low (incremental changes, backward compatible)
**Recommendation:** Proceed with Phase 1 immediately.

# LLM Architecture Implementation - Complete ✅

## Summary

Successfully implemented simplified LLM artifact traceability architecture across `@domain`, `@llm`, and `@storage` packages.

## Key Architectural Decisions

### 1. Schema Extension Pattern
✅ **Implemented `Schema.extend` for clean state separation**
- `MediaMetadata` - Base schema (API-sourced metadata only)
- `EnrichedMediaMetadata` - Extended schema (adds `enrichment` field)
- **Benefit**: Avoids polluting base schemas with many optional fields
- **Pattern**: Use `MediaMetadata.pipe(Schema.extend(Schema.Struct({ enrichment })))`

### 2. Prompts Stay in LLM Package
✅ **Prompts remain in `@llm/src/prompts/` for deployment independence**
- `transcribe_media.ts` - Existing transcription prompt
- `enrich_metadata.ts` - New metadata enrichment prompt
- **Benefit**: Iterate on prompts without redeploying workers

### 3. Artifact Traceability via jobId
✅ **All artifacts linked via `jobId` for simple, consistent tracing**
- Storage pattern: `artifacts/{jobId}/{artifactId}.json`
- No need for `requestId` or `idempotencyKey` in artifacts
- **Benefit**: Simple queries, clear ownership

---

## Phase 1: Domain Schemas ✅

### Created New LLM Domain Package

**Location**: `packages/domain/src/llm/`

#### Files Created:
1. **`ids.ts`** - LLM-specific branded types
   ```typescript
   export const LLMArtifactId = Schema.String.pipe(
     Schema.brand("LLMArtifactId")
   )
   ```

2. **`provider.ts`** - Provider configuration schemas
   ```typescript
   export const GeminiProviderConfig = Schema.Struct({
     provider: Schema.Literal("gemini"),
     model: Schema.String,
     temperature: Schema.Number.pipe(Schema.between(0, 2)),
     mediaResolution: Schema.optional(Schema.Literal("low", "high"))
   })
   
   export const ProviderConfig = Schema.Union(GeminiProviderConfig)
   ```

3. **`execution.ts`** - Execution metadata and token usage
   ```typescript
   export const TokenUsage = Schema.Struct({
     promptTokens: Schema.Int.pipe(Schema.nonNegative()),
     completionTokens: Schema.Int.pipe(Schema.nonNegative()),
     totalTokens: Schema.Int.pipe(Schema.nonNegative())
   })
   
   export const LLMExecutionMetadata = Schema.Struct({
     executedAt: Schema.Date,
     durationMs: Schema.Int.pipe(Schema.positive()),
     tokens: TokenUsage
   })
   ```

4. **`artifacts.ts`** - Complete artifact schema
   ```typescript
   export const LLMArtifacts = Schema.Struct({
     id: LLMArtifactId,
     jobId: JobId,
     providerConfig: ProviderConfig,
     execution: LLMExecutionMetadata,
     createdAt: Schema.Date
   })
   ```

### Updated Existing Schemas

#### MediaMetadata (Schema.extend Pattern)
**Before**: Optional `enrichment` field cluttering base schema
```typescript
export const MediaMetadata = Schema.Struct({
  // ... base fields
  enrichment: Schema.optional(EnrichmentMetadata) // ❌ Pollution
})
```

**After**: Separate base and enriched schemas
```typescript
// Base schema - API metadata only
export const MediaMetadata = Schema.Struct({
  mediaResourceId: MediaResourceId,
  jobId: JobId,
  // ... all base fields
  createdAt: Schema.Date
})

// Extended schema - with LLM enrichment
export const EnrichedMediaMetadata = MediaMetadata.pipe(
  Schema.extend(
    Schema.Struct({
      enrichment: EnrichmentMetadata
    })
  )
)
```

#### Transcript Schema
**Added**: Required `llmArtifactId` field
```typescript
export const Transcript = Schema.Struct({
  // ... existing fields
  llmArtifactId: LLMArtifactId, // NEW: Links to artifact
  createdAt: Schema.Date,
  updatedAt: Schema.Date
})
```

---

## Phase 2: LLM Service ✅

### Created Artifact Builder

**File**: `packages/llm/src/artifacts.ts`

```typescript
export const buildArtifacts = (
  jobId: Jobs.JobId,
  config: typeof GeminiConfig.Type,
  timing: {
    readonly executedAt: Date
    readonly durationMs: number
  },
  tokens: {
    readonly promptTokens: number
    readonly completionTokens: number
    readonly totalTokens: number
  }
): Effect.Effect<LLM.LLMArtifacts>
```

### Updated GeminiClient

**File**: `packages/llm/src/client.ts`

**Changes**:
1. Added `TranscriptionResult` interface with timing + token metadata
2. Captured `startTime` at execution start
3. Exposed `getTokenUsage()` Promise for token counts
4. Return `{ stream, startTime, getTokenUsage }`

### Updated LLMService

**File**: `packages/llm/src/service.ts`

**Changes**:
1. Changed signature to require `jobId` parameter
2. Return `TranscriptionWithArtifact` (turns + artifact)
3. Calculate execution duration
4. Build artifact with full traceability

```typescript
export interface TranscriptionWithArtifact {
  readonly turns: ReadonlyArray<Transcription.DialogueTurn>
  readonly artifact: LLM.LLMArtifacts
}

const transcribeMedia = (
  jobId: Jobs.JobId,
  video: YouTube.YouTubeVideo,
  metadata: Media.MediaMetadata
) => Effect.Effect<TranscriptionWithArtifact, LLMError>
```

### Created Metadata Enrichment Prompt

**File**: `packages/llm/src/prompts/enrich_metadata.ts`

```typescript
export const systemInstruction = `You are a metadata enrichment specialist...`

export const enrichmentInstructions = (
  baseMetadata: Media.MediaMetadata,
  unstructuredText: string
) => `...`
```

### Added Config Helper

**File**: `packages/llm/src/config.ts`

```typescript
export const toProviderConfig = (
  config: typeof GeminiConfig.Type
): LLM.GeminiProviderConfig
```

---

## Phase 3: Storage Layer ✅

### Added Artifact Paths

**File**: `packages/storage/src/paths.ts`

```typescript
export const STORAGE_PATHS = {
  // ... existing
  ARTIFACTS_PREFIX: "artifacts"
}

export const ArtifactPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.ARTIFACTS_PREFIX),
  "/",
  Schema.String, // JobId
  "/",
  Schema.String, // ArtifactId
  ".json"
)
```

### Updated Index Helpers

**File**: `packages/storage/src/indices.ts`

```typescript
export const Index = {
  // ... existing
  
  // Single artifact
  artifact: (jobId: Core.JobId, artifactId: LLM.LLMArtifactId): string
  
  // List artifacts for job
  artifacts: (jobId: Core.JobId): string
  
  // All artifacts
  allArtifacts: (): string
}
```

### Created LLMArtifactStore

**File**: `packages/storage/src/LLMArtifactStore.ts`

```typescript
export class LLMArtifactStore extends Context.Tag(...)<
  LLMArtifactStore,
  {
    readonly save: (artifact: LLM.LLMArtifacts) => Effect.Effect<void, ArtifactStorageError>
    readonly get: (artifactId: LLM.LLMArtifactId) => Effect.Effect<LLM.LLMArtifacts, ...>
    readonly listByJob: (jobId: Jobs.JobId) => Effect.Effect<ReadonlyArray<LLM.LLMArtifacts>, ...>
  }
>() {}
```

**Features**:
- Saves artifacts to `artifacts/{jobId}/{artifactId}.json`
- Lists all artifacts for a job efficiently
- Uses Effect logging for observability
- Proper error handling with tagged errors

---

## Patterns & Best Practices Applied

### ✅ Schema Extension over Optional Fields
- **Pattern**: `BaseSchema.pipe(Schema.extend(Schema.Struct({ newFields })))`
- **Used in**: `EnrichedMediaMetadata`
- **Benefit**: Clean separation of concerns, explicit state modeling

### ✅ Service Layer Pattern (Effect)
- **Pattern**: `Context.Tag` + `Layer.effect` + dependency injection
- **Used in**: `LLMArtifactStore`, `LLMService`
- **Reference**: `patterns/effect-service-layer-patterns.md`

### ✅ Tagged Errors for Type-Safe Error Handling
- **Pattern**: `Data.TaggedError` + `Effect.catchTag`
- **Used in**: `ArtifactNotFoundError`, `ArtifactStorageError`
- **Reference**: `patterns/effect-error-handling-patterns.md`

### ✅ Branded Types for ID Safety
- **Pattern**: `Schema.String.pipe(Schema.brand("Type"))`
- **Used in**: `LLMArtifactId`
- **Reference**: `patterns/effect-schema-coding-patterns.md`

### ✅ CloudStorageService Integration
- **Pattern**: Leverage existing `@puredialog/ingestion` storage service
- **Used in**: `LLMArtifactStore` uses `CloudStorageService` + `CloudStorageConfig`
- **Reference**: Existing `JobRepository`, `TranscriptStore` patterns

### ✅ Effect Logging with Structured Context
- **Pattern**: `Effect.logInfo(message, context)`
- **Used in**: All save/list operations in `LLMArtifactStore`
- **Reference**: `patterns/effect-observability-patterns.md`

---

## Build Verification ✅

All packages build and typecheck successfully:

```bash
✅ pnpm --filter @puredialog/domain typecheck
✅ pnpm --filter @puredialog/domain build

✅ pnpm --filter @puredialog/llm typecheck
✅ pnpm --filter @puredialog/llm build

✅ pnpm --filter @puredialog/storage typecheck
✅ pnpm --filter @puredialog/storage build
```

---

## Next Steps (Worker Integration - Not Yet Implemented)

### Metadata Worker Integration
1. Update `worker-metadata` to use `LLMService.enrichMetadata()` (when implemented)
2. Save enrichment artifacts with `LLMArtifactStore.save()`
3. Update job with `EnrichedMediaMetadata` after enrichment

### Transcription Worker Integration
1. Update `worker-transcription` to call `LLMService.transcribeMedia(jobId, ...)`
2. Destructure `{ turns, artifact }` from result
3. Save artifact with `LLMArtifactStore.save(artifact)`
4. Create `Transcript` with `llmArtifactId: artifact.id`
5. Save transcript with existing `TranscriptStore`

### API Updates
1. Add endpoint to list artifacts: `GET /jobs/{jobId}/artifacts`
2. Add endpoint to get artifact: `GET /artifacts/{artifactId}`

---

## Summary of Files Changed/Created

### Domain Package (`@puredialog/domain`)
- ✅ **Created**: `src/llm/ids.ts`
- ✅ **Created**: `src/llm/provider.ts`
- ✅ **Created**: `src/llm/execution.ts`
- ✅ **Created**: `src/llm/artifacts.ts`
- ✅ **Created**: `src/llm/index.ts`
- ✅ **Updated**: `src/media/metadata.ts` (Schema.extend pattern)
- ✅ **Updated**: `src/transcription/transcript.ts` (added llmArtifactId)
- ✅ **Updated**: `src/index.ts` (exported LLM namespace)

### LLM Package (`@puredialog/llm`)
- ✅ **Created**: `src/artifacts.ts`
- ✅ **Created**: `src/prompts/enrich_metadata.ts`
- ✅ **Updated**: `src/config.ts` (added toProviderConfig helper)
- ✅ **Updated**: `src/client.ts` (timing + token capture)
- ✅ **Updated**: `src/service.ts` (return artifact + turns)

### Storage Package (`@puredialog/storage`)
- ✅ **Created**: `src/LLMArtifactStore.ts`
- ✅ **Updated**: `src/paths.ts` (added ARTIFACTS_PREFIX, ArtifactPathParser)
- ✅ **Updated**: `src/indices.ts` (added artifact/artifacts/allArtifacts helpers)
- ✅ **Updated**: `src/index.ts` (exported LLMArtifactStore)

---

## Architecture Strengths

1. **Clean Separation**: Base vs enriched metadata, prompts in LLM package
2. **Type Safety**: Branded IDs, Schema validation, Effect error handling
3. **Traceability**: Full LLM execution metadata linked via jobId
4. **Extensibility**: Union types support future LLM providers
5. **Simplicity**: jobId linking, no complex cross-references
6. **Deployment Independence**: Prompts iterate without worker redeploys

---

**Implementation Date**: 2025-09-30  
**Status**: ✅ All phases complete, all packages building successfully

# LLM Package Refactor Assessment

## Executive Summary

The `@llm/` package requires moderate refactoring to align with recent architectural changes. While the core service structure is sound, several critical updates are needed for proper integration with the discriminated union job types, enhanced traceability requirements, and worker architecture.

---

## 1. Critical Issues (Must Fix)

### 1.1 Incomplete Return Type ⚠️

**Current State:**
```typescript
readonly transcribeMedia: (
  video: YouTube.YouTubeVideo,
  metadata: Media.MediaMetadata
) => Effect.Effect<ReadonlyArray<Transcription.DialogueTurn>, LLMError>
```

**Problem:** Returns only `DialogueTurn[]` instead of complete `Transcript` entity.

**Required:** The domain `Transcript` schema now includes:
- `rawText: string` - Full, unstructured transcript for auditing
- `inferenceConfig: InferenceConfig` - Model configuration used
- `generationPrompt: GenerationPrompt` - Exact prompt used
- `transcriptionContext: TranscriptionContext` - Context provided

**Impact:** Workers cannot store complete transcripts without this data.

---

### 1.2 Missing Traceability Fields 🔍

**Problem:** No construction of traceability metadata required by domain.

**Required Additions:**

```typescript
// packages/domain/src/transcription/inference.ts
export const InferenceConfig = Schema.Struct({
  model: Schema.String,
  temperature: Schema.Number,
  mediaResolution: Schema.String,
  // ... other model config
})

// packages/domain/src/transcription/prompts.ts
export const GenerationPrompt = Schema.Struct({
  systemInstruction: Schema.String,
  contentParts: Schema.Array(Schema.Unknown),
  // ... other prompt data
})
```

**Fix Required:** Capture and return this data from `GeminiClient` through the service.

---

### 1.3 Job Type Integration 🔄

**Current State:** Takes generic `YouTube.YouTubeVideo` and `Media.MediaMetadata`.

**Problem:** Doesn't align with discriminated union job flow:
- `QueuedJob` → `MetadataReadyJob` → `ProcessingJob` → `CompletedJob`
- Worker receives `ProcessingJob` which contains metadata already

**Recommended API:**

```typescript
readonly transcribeMedia: (
  job: Jobs.ProcessingJob  // Has video + metadata embedded
) => Effect.Effect<Transcription.Transcript, LLMError>
```

**Benefits:**
- Type-safe: Ensures job has metadata before transcription
- Simplified: One parameter instead of two
- Traceable: Job context flows through entire pipeline

---

### 1.4 Raw Text Extraction 📄

**Problem:** Only structured `DialogueTurn[]` are generated, but `Transcript.rawText` is required.

**Solution Options:**

**Option A (Recommended):** Reconstruct from structured turns
```typescript
const reconstructRawText = (turns: DialogueTurn[]): string =>
  turns.map(turn => `[${turn.timestamp}] ${turn.speaker}\n${turn.text}`).join("\n\n")
```

**Option B:** Capture from LLM stream before parsing
- Store accumulated JSON string as `rawText`
- More authentic but less readable

**Recommendation:** Use Option A for human-readable audit trail.

---

## 2. Architectural Improvements (Should Fix)

### 2.1 Service Layer Refactoring

**Current Flow:**
```
GeminiClient → Stream<string> → Adapter → DialogueTurn[]
```

**Recommended Flow:**
```
GeminiClient → Stream<string> → Adapter → Transcript
```

**Changes:**

1. **Update `adapters.ts`:**
```typescript
export class LLMAdapter extends Context.Tag("LLMAdapter")<LLMAdapter, {
  readonly toDomainTranscript: (
    job: Jobs.ProcessingJob,
    rawOutput: string,
    inferenceConfig: Transcription.InferenceConfig,
    generationPrompt: Transcription.GenerationPrompt
  ) => Effect.Effect<Transcription.Transcript, LLMError>
}>() {}
```

2. **Update `service.ts`:**
```typescript
const transcribeMedia = (job: Jobs.ProcessingJob) =>
  Effect.gen(function*() {
    const rawOutputStream = yield* client.transcribeYoutubeVideo({ job })
    const rawText = yield* Stream.runCollect(rawOutputStream).pipe(
      Effect.map(chunks => Chunk.compact(chunks).join(""))
    )
    
    const inferenceConfig = yield* client.getInferenceConfig()
    const generationPrompt = yield* client.getGenerationPrompt(job)
    
    const transcript = yield* adapter.toDomainTranscript(
      job,
      rawText,
      inferenceConfig,
      generationPrompt
    )
    
    return transcript
  })
```

---

### 2.2 Schema Validation Enhancement

**Current:** Schema validation happens in adapter only.

**Recommended:** Add intermediate validation for LLM output:

```typescript
// src/schemas.ts
export const LLMDialogueTurnOutput = Schema.Struct({
  timestamp: Schema.String.pipe(
    Schema.pattern(/^\d{2}:\d{2}$/),
    Schema.brand("LLMTimestamp")
  ),
  speaker: Schema.String,
  dialogue: Schema.String.pipe(Schema.nonEmptyString())
})

export const LLMTranscriptOutput = Schema.Array(LLMDialogueTurnOutput)
```

**Benefits:**
- Catch malformed LLM output early
- Better error messages for debugging
- Clear separation between LLM format and domain format

---

### 2.3 Configuration Alignment

**Current:** `GeminiConfig` in `config.ts` is disconnected from domain.

**Recommended:** Export `InferenceConfig` constructor:

```typescript
// src/config.ts
import { Transcription } from "@puredialog/domain"

export const toInferenceConfig = (
  config: typeof GeminiConfig.Type
): Transcription.InferenceConfig =>
  Transcription.InferenceConfig.make({
    model: config.model,
    temperature: config.temperature,
    mediaResolution: "low",
    // ... other fields
  })
```

---

## 3. Worker Integration Changes

### 3.1 Transcription Worker Usage

**Expected Worker Flow:**
```typescript
// packages/worker-transcription/src/handler.ts
import { LLMService } from "@puredialog/llm"
import { Jobs } from "@puredialog/domain"

const processJob = (cloudEvent: CloudEvent) =>
  Effect.gen(function*() {
    const { jobId } = yield* parseCloudEvent(cloudEvent)
    const job = yield* jobStore.get(jobId) // Returns ProcessingJob
    
    // LLM service now takes ProcessingJob directly
    const transcript = yield* llmService.transcribeMedia(job)
    
    // Store transcript and transition job to Completed
    yield* transcriptStore.save(transcript)
    yield* jobStore.updateStatus(jobId, "Completed", { transcriptId: transcript.id })
  })
```

**Key Changes:**
- LLM service accepts `ProcessingJob` (has video + metadata)
- Returns complete `Transcript` entity
- Worker just orchestrates, no data construction

---

### 3.2 Metadata Worker Integration

**Current:** Metadata worker uses `@ingestion/` for YouTube API.

**No LLM changes needed for metadata worker** - it only fetches metadata, doesn't transcribe.

---

## 4. Testing Requirements

### 4.1 Missing Tests

**Current State:** No tests in package.

**Required Test Coverage:**

1. **Adapter Tests:**
   - Valid LLM JSON → Transcript
   - Invalid JSON → TranscriptionError
   - Missing fields → ValidationError
   - Timestamp normalization

2. **Service Tests:**
   - Mock GeminiClient with fake stream
   - Verify full Transcript construction
   - Test retry logic with TestClock
   - Test error propagation

3. **Integration Tests:**
   - End-to-end with real ProcessingJob
   - Verify traceability fields populated
   - Test with various MediaMetadata formats

---

## 5. Documentation Updates

### 5.1 Outdated Spec Files

**Files to Update:**
- `spec/design.md` - Reflects old API
- `spec/requirements.md` - Missing traceability requirements
- `spec/plan.md` - Implementation steps incomplete

**Recommendation:** Create new `INTEGRATION.md` showing:
- How workers use LLM service
- Job type flow (ProcessingJob → Transcript)
- Error handling in worker context
- Example Effect composition

---

## 6. Dependency Analysis

### 6.1 Current Dependencies
```json
{
  "@effect/ai": "latest",
  "@effect/ai-google": "^0.7.0",
  "@google/genai": "latest",
  "@puredialog/domain": "workspace:^",
  "effect": "latest"
}
```

**Status:** ✅ All dependencies are current and appropriate.

---

### 6.2 Domain Package Additions Needed

**New exports required in `@puredialog/domain`:**

```typescript
// packages/domain/src/transcription/inference.ts
export const InferenceConfig = Schema.Struct({
  model: Schema.String,
  temperature: Schema.Number,
  mediaResolution: Schema.Literal("low", "medium", "high"),
  responseMimeType: Schema.String,
  maxOutputTokens: Schema.optional(Schema.Int)
})

// packages/domain/src/transcription/prompts.ts  
export const GenerationPrompt = Schema.Struct({
  systemInstruction: Schema.String,
  hintsProvided: Schema.Boolean,
  speakerContext: Schema.Array(Schema.String),
  timestamp: Schema.Date
})
```

---

## 7. Implementation Roadmap

### Phase 1: Core Type Alignment (High Priority)
1. ✅ Add `InferenceConfig` and `GenerationPrompt` to domain
2. ✅ Update service signature to accept `ProcessingJob`
3. ✅ Update adapter to construct full `Transcript`
4. ✅ Add `rawText` reconstruction helper
5. ✅ Update error types if needed

### Phase 2: Enhanced Traceability
1. ✅ Capture inference config from GeminiClient
2. ✅ Capture generation prompt construction
3. ✅ Flow traceability through adapter
4. ✅ Add validation for new fields

### Phase 3: Testing & Documentation
1. ⏳ Write adapter tests
2. ⏳ Write service integration tests
3. ⏳ Update spec files
4. ⏳ Create INTEGRATION.md guide

### Phase 4: Worker Integration
1. ⏳ Update transcription worker to use new API
2. ⏳ Test end-to-end flow with CloudEvents
3. ⏳ Verify GCS transcript storage
4. ⏳ Deploy and validate

---

## 8. Breaking Changes Summary

### API Changes
- ❌ `transcribeMedia(video, metadata)` 
- ✅ `transcribeMedia(job: ProcessingJob)`

### Return Type Changes
- ❌ `Effect<DialogueTurn[], LLMError>`
- ✅ `Effect<Transcript, LLMError>`

### Migration Guide for Workers
```typescript
// Before
const turns = await llmService.transcribeMedia(video, metadata)
const transcript = constructTranscript(turns, video, metadata) // Manual

// After  
const transcript = await llmService.transcribeMedia(processingJob) // Complete
```

---

## 9. Risk Assessment

### Low Risk ✅
- Adding traceability fields (backward compatible in domain)
- Updating internal adapters
- Adding tests

### Medium Risk ⚠️
- Changing service signature (affects worker integration)
- Return type change (requires worker updates)

### High Risk 🚨
- None identified (good test coverage will mitigate)

---

## 10. Recommendations

### Immediate Actions (This Week)
1. **Add missing domain schemas** (`InferenceConfig`, `GenerationPrompt`)
2. **Refactor service signature** to accept `ProcessingJob`
3. **Update adapter** to construct full `Transcript`
4. **Write core tests** for adapter and service

### Short-term (Next Sprint)
1. **Update transcription worker** to use new API
2. **Add integration tests** with mock jobs
3. **Update documentation** (specs and integration guide)
4. **Deploy and validate** with real CloudEvents

### Long-term (Future Iterations)
1. **Add streaming support** to workers (for progress updates)
2. **Implement retry strategies** specific to LLM failures
3. **Add telemetry** for LLM performance metrics
4. **Cost tracking** for API usage per job

---

## 11. Open Questions

1. **Transcript Storage:** Where are complete transcripts stored? GCS? Database?
   - **Context:** Worker needs to know where to write after LLM completes
   
2. **Transcript ID Generation:** Who generates `TranscriptId`? LLM service or worker?
   - **Recommendation:** LLM service should generate it for traceability
   
3. **Partial Transcripts:** How to handle streaming/partial results?
   - **Recommendation:** Add `PartialTranscript` type for progress updates
   
4. **Retry Strategy:** Should LLM service retry, or let worker handle it?
   - **Recommendation:** LLM service retries transient errors, worker retries terminal errors by re-queuing

5. **Cost Tracking:** Should we track token usage per job?
   - **Recommendation:** Yes, add to `Transcript` as optional metadata field

---

## Conclusion

The `@llm/` package has a solid foundation but requires focused refactoring to integrate with the new discriminated union job architecture and enhanced traceability requirements. The changes are well-scoped, low-risk with proper testing, and will result in a cleaner, more type-safe integration with the worker services.

**Estimated Effort:** 2-3 days for complete refactor + testing + documentation.

**Recommendation:** Proceed with Phase 1 immediately to unblock worker development.

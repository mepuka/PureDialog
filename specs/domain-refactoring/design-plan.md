# Domain Package Refactoring - Design & Implementation Plan

## Design Overview

This document consolidates the technical design decisions and implementation roadmap for refactoring the domain package, based on the requirements outlined in `requirements.md`.

## 1. Architecture Design

### 1.1 Directory Structure Design

**Target Structure:**
```
/packages/domain/src
├── index.ts                    // Main export aggregator
├── errors/
│   ├── index.ts               // Error exports
│   ├── definitions.ts         // TaggedError class definitions
│   └── schemas.ts             // Error schema definitions
├── schemas/
│   ├── index.ts               // Schema exports
│   ├── context.ts             // TranscriptionContext schema
│   ├── entities.ts            // Core entity schemas
│   ├── events.ts              // Event schemas
│   ├── ids.ts                 // Branded ID schemas
│   ├── inference.ts           // InferenceConfig schema
│   ├── media.ts               // Media resource schemas
│   ├── prompts.ts             // GenerationPrompt schema
│   ├── requests.ts            // Request schemas
│   ├── responses.ts           // Response schemas
│   ├── speakers.ts            // Speaker-related schemas
│   ├── status.ts              // Status schemas
│   └── transcript.ts          // Transcript schemas
└── types/
    └── index.ts               // Type re-exports from schemas
```

**Design Principles:**
- **Separation of Concerns**: Each file focuses on a specific domain area
- **Import Independence**: Minimize circular dependencies through careful layering
- **Backward Compatibility**: Maintain existing public API through index re-exports

### 1.2 Schema Design Architecture

**Schema Composition Strategy:**
```typescript
// Base schemas (no dependencies)
├── ids.ts          // All branded IDs
├── status.ts       // Status enums
└── speakers.ts     // Speaker definitions

// Context schemas (depend on base)
├── context.ts      // TranscriptionContext
├── inference.ts    // InferenceConfig  
└── prompts.ts      // GenerationPrompt

// Resource schemas (depend on base + context)
├── media.ts        // Media resources and metadata
└── transcript.ts   // Transcript with traceability

// Service schemas (depend on all above)
├── requests.ts     // Service request schemas
├── responses.ts    // Service response schemas
├── entities.ts     // Aggregate entities
└── events.ts       // Domain events
```

## 2. Domain Model Design

### 2.1 TranscriptionContext Schema

**Purpose**: Capture user-provided information before processing begins

**Design:**
```typescript
// schemas/context.ts
export const TranscriptionContext = Schema.Struct({
  // User-provided speaker information
  expectedSpeakers: Schema.Array(Schema.Struct({
    role: SpeakerRole,
    name: Schema.optional(Schema.String),
    affiliation: Schema.optional(Schema.String)
  })),
  // User-provided content hints
  contentHints: Schema.optional(Schema.Struct({
    domain: Schema.Array(Schema.String),
    tags: Schema.Array(Schema.String),
    summary: Schema.optional(Schema.String)
  })),
  // Processing preferences
  preferences: Schema.optional(Schema.Struct({
    language: Schema.optional(LanguageCode),
    format: Schema.optional(MediaFormat)
  }))
});
```

**Integration Point**: Used in `CreateTranscriptionJobRequest` to provide context before media analysis.

### 2.2 Media Resource Redesign

**Current Issue**: `MediaMetadata` mixes user context with extracted data

**New Design:**
```typescript
// schemas/media.ts
export const ExtractedMediaMetadata = Schema.Struct({
  // Data extracted from source (YouTube API, etc.)
  title: Schema.String,
  description: Schema.optional(Schema.String),
  duration: Schema.Number,
  channelInfo: Schema.optional(Schema.Struct({
    id: Schema.String,
    title: Schema.String
  })),
  extractedTags: Schema.Array(Schema.String),
  publishedAt: Schema.optional(Schema.Date),
  // Technical metadata
  language: Schema.optional(LanguageCode),
  speakerCount: Schema.optional(Schema.Int),
  links: Schema.Array(Schema.String.pipe(Schema.pattern(/^https?:\/\//))),
  extractedAt: Schema.Date
});

export const MediaResource = Schema.Union(
  Schema.Struct({
    type: Schema.Literal("youtube_video"),
    id: MediaResourceId,
    extractedMetadata: ExtractedMediaMetadata,
    data: YouTubeVideo
  }),
  // Future media types...
);
```

**Key Changes:**
- Renamed `MediaMetadata` to `ExtractedMediaMetadata` for clarity
- Contains only data extracted from the source
- User-provided context now lives in `TranscriptionContext`

### 2.3 Enhanced Transcript Design

**Current Issue**: Missing traceability information

**New Design:**
```typescript
// schemas/transcript.ts
export const Transcript = Schema.Struct({
  id: TranscriptId,
  jobId: JobId,
  mediaResource: MediaResource,
  rawText: Schema.String.pipe(Schema.nonEmptyString()),
  turns: Schema.Array(DialogueTurn),
  
  // NEW: Traceability fields
  inferenceConfig: InferenceConfig,
  generationPrompt: GenerationPrompt,
  
  // Context used for generation
  transcriptionContext: TranscriptionContext,
  
  createdAt: Schema.Date,
  updatedAt: Schema.Date
});
```

**Traceability Support Schemas:**
```typescript
// schemas/inference.ts
export const InferenceConfig = Schema.Struct({
  model: Schema.String,
  temperature: Schema.Number,
  maxTokens: Schema.optional(Schema.Number),
  additionalParams: Schema.optional(Schema.Record({
    key: Schema.String, 
    value: Schema.Unknown
  }))
});

// schemas/prompts.ts  
export const GenerationPrompt = Schema.Struct({
  templateId: Schema.String,
  templateVersion: Schema.String,
  compiledText: Schema.String,
  compilationParams: Schema.Record({
    key: Schema.String,
    value: Schema.Unknown
  }),
  compiledAt: Schema.Date
});
```


### 2.4 Service Contract Design

**Enhanced Request Schema:**
```typescript
// schemas/requests.ts
export const TranscriptionServiceRequest = Schema.Struct({
  jobId: JobId,
  mediaResource: MediaResource,
  transcriptionContext: TranscriptionContext,
  inferenceConfig: InferenceConfig,
  promptTemplate: Schema.String // Template identifier
});

// schemas/responses.ts
export const TranscriptionServiceResponse = Schema.Struct({
  jobId: JobId,
  transcript: Transcript,
  processingMetadata: Schema.Struct({
    processingTimeMs: Schema.Number,
    promptCompilationTime: Schema.Number,
    inferenceTime: Schema.Number
  })
});
```

## 3. Implementation Plan

### Phase 1: Foundation Setup (Low Risk)

**Scope**: Directory structure and file migration without logic changes

**Tasks:**
1. **Create directory structure**
   ```bash
   mkdir -p packages/domain/src/{errors,schemas,types}
   ```

2. **Move existing files to new locations**
   - `errors.ts` → `errors/definitions.ts`
   - `transcript.ts` → `schemas/transcript.ts`  
   - `media-resource-metadata.ts` → `schemas/media.ts`
   - `media-resources.ts` → merge into `schemas/media.ts`
   - All other `.ts` files → `schemas/[filename].ts`

3. **Create index files**
   - `errors/index.ts` - export all error definitions and schemas
   - `schemas/index.ts` - export all schemas
   - `types/index.ts` - re-export types from schemas
   - Update root `index.ts` to re-export from new structure

4. **Update all import statements**
   - Internal imports within domain package
   - External imports in dependent packages (api, ingestion, llm, workers)

**Validation:**
- `pnpm typecheck` passes
- `pnpm lint:fix` passes
- All tests pass
- All dependent packages build successfully

### Phase 2: New Schema Implementation (Medium Risk)

**Scope**: Add new schemas without modifying existing entities

**Tasks:**
1. **Prepare for new schemas**
   - Review existing ID types to ensure completeness
   - Plan import dependencies for new schemas

2. **Implement new schemas**
   - `schemas/context.ts` - `TranscriptionContext`
   - `schemas/inference.ts` - `InferenceConfig`  
   - `schemas/prompts.ts` - `GenerationPrompt`

3. **Separate speaker schemas**
   - Move `SpeakerRole` and `Speaker` from existing files to `schemas/speakers.ts`
   - Update imports in dependent files

4. **Add new schemas to exports**
   - Update `schemas/index.ts` to export new schemas
   - Update root `index.ts` to re-export new types

**Validation:**
- New schemas validate correctly with sample data
- TypeScript compilation succeeds
- No breaking changes to existing functionality

### Phase 3: Core Entity Refactoring (High Risk)

**Scope**: Modify existing entities to use new schemas

**Tasks:**
1. **Update Transcript entity**
   ```typescript
   // Add new fields to Transcript schema
   inferenceConfig: InferenceConfig,
   generationPrompt: GenerationPrompt,
   transcriptionContext: TranscriptionContext,
   ```

2. **Refactor MediaMetadata**
   - Rename to `ExtractedMediaMetadata`
   - Remove user-context fields (move to `TranscriptionContext`)
   - Update `MediaResource` to use new metadata structure

3. **Update TranscriptionJob entity**
   ```typescript
   // Add context field
   transcriptionContext: Schema.optional(TranscriptionContext),
   ```

4. **Clean up duplicates**
   - Remove `TranscriptSegment` (keep `DialogueTurn`)
   - Move `ModelOutputChunk` to LLM package

**Validation:**
- All entity schemas validate with sample data
- Existing tests updated for new structure
- No runtime errors in dependent packages

### Phase 4: Service Integration (Medium Risk)

**Scope**: Update service contracts and request/response schemas

**Tasks:**
1. **Update request schemas**
   - Modify `CreateTranscriptionJobRequest` to include `TranscriptionContext`
   - Add `TranscriptionServiceRequest` schema

2. **Update response schemas**
   - Add `TranscriptionServiceResponse` schema
   - Include processing metadata

3. **Update dependent packages**
   - LLM package: Accept `TranscriptionServiceRequest`, return enhanced response
   - API package: Handle new request/response schemas
   - Worker packages: Process enhanced job data

**Validation:**
- Integration tests pass with new service contracts
- End-to-end workflow functions correctly
- All packages build and deploy successfully

## 4. Risk Mitigation

### 4.1 Dependency Management

**Risk**: Circular dependencies between schema files
**Mitigation**: 
- Carefully design import hierarchy (base → context → resource → service)
- Use dependency graph validation in CI/CD
- Regular import analysis during development

**Risk**: Breaking changes to dependent packages
**Mitigation**:
- Maintain backward compatibility through index re-exports
- Gradual migration with deprecation warnings
- Comprehensive integration testing

### 4.2 Schema Changes

**Risk**: New schema fields cause validation issues
**Mitigation**:
- Use optional fields for new properties where appropriate
- Provide sensible defaults in schema definitions

**Risk**: Runtime errors from schema changes
**Mitigation**:
- Extensive validation testing with sample data
- Comprehensive unit tests for all schema modifications

## 5. Testing Strategy

### 5.1 Schema Testing

**Unit Tests:**
```typescript
// Test new schemas with @effect/vitest
describe("TranscriptionContext", () => {
  it.effect("should validate complete context", () =>
    Effect.gen(function* () {
      const context = {
        expectedSpeakers: [{ role: "host", name: "John Doe" }],
        contentHints: { domain: ["technology"], tags: ["AI"] }
      };
      const result = yield* Schema.decodeUnknown(TranscriptionContext)(context);
      assert.deepStrictEqual(result.expectedSpeakers[0].name, "John Doe");
    })
  );
});
```

**Integration Tests:**
- Schema composition (Transcript with new traceability fields)
- Service request/response roundtrip validation
- Backward compatibility with existing data

### 5.2 Integration Testing

**Package Integration Tests:**
- Dependent packages integrate without errors
- Service contracts work with new schemas
- End-to-end workflows function correctly

## 6. Performance Considerations

### 6.1 Bundle Size Impact

**Analysis**: New schemas will increase bundle size
**Mitigation**: 
- Tree-shaking optimization
- Lazy loading of optional schemas
- Bundle size monitoring in CI/CD

### 6.2 Runtime Performance

**Analysis**: Additional validation overhead
**Mitigation**:
- Schema caching where appropriate
- Selective validation in production
- Performance benchmarking during development

## 7. Success Metrics

### 7.1 Implementation Success

- [ ] All phases complete without breaking changes
- [ ] 100% test coverage maintained
- [ ] TypeScript compilation with zero errors
- [ ] All ESLint rules pass
- [ ] All dependent packages build successfully

### 7.2 Quality Improvements

- [ ] Clear separation of user context vs extracted metadata
- [ ] Full traceability for transcript generation
- [ ] Improved developer experience with better organized code

### 7.3 Maintainability Improvements

- [ ] Reduced cognitive load when navigating domain code
- [ ] Clear import paths and minimal circular dependencies
- [ ] Comprehensive documentation and examples
- [ ] Consistent patterns across all domain entities

## 8. Rollback Strategy

**Phase-specific rollback plans:**
- **Phase 1**: Revert file moves, restore original structure
- **Phase 2**: Remove new schema files, restore original exports
- **Phase 3**: Revert entity modifications, restore original schemas  
- **Phase 4**: Restore original service contracts, revert dependent packages

**Rollback triggers:**
- Critical test failures that cannot be quickly resolved
- Performance degradation beyond acceptable thresholds
- Breaking changes that affect production systems
- Timeline constraints requiring immediate stable state
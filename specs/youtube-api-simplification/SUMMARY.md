# YouTube API Simplification - Architecture Summary

## Overview

This architecture redesign moves the YouTube client to the domain layer and simplifies the API to accept YouTube URLs instead of requiring clients to provide full video metadata objects.

## Key Design Decisions

### 1. Service Location
**Decision**: Place YouTubeClient in `packages/domain/src/youtube/`

**Rationale**:
- Domain layer is for shared business logic
- Multiple packages need YouTube functionality (API, workers)
- Follows clean architecture principles
- Makes service reusable across entire codebase

### 2. API Simplification
**Decision**: Accept YouTube URLs instead of full YouTubeVideo objects

**Before**:
```typescript
POST /jobs {
  media: {
    type: "youtube",
    data: { id, title, description, channelId, ... } // ~10 fields
  }
}
```

**After**:
```typescript
POST /jobs {
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Benefits**:
- No client-side YouTube API key needed
- One less round-trip from client
- Server is source of truth for metadata
- Simpler client integration
- No metadata sync issues

### 3. Internal Domain Model
**Decision**: Keep MediaResource unchanged internally

The API accepts simple URLs externally but creates rich MediaResource objects internally:
- External: Simple URL strings (user-friendly)
- Internal: Full YouTubeVideo objects (type-safe, complete)

This maintains type safety throughout the system while simplifying the client-facing API.

### 4. Service Patterns
**Decision**: Follow Effect service pattern with Context.Tag

Consistent with existing codebase services (JobStore, LLMService):
```typescript
export class YouTubeClient extends Context.Tag("@puredialog/domain/YouTubeClient")<
  YouTubeClient,
  { readonly fetchVideo: ... }
>() {}
```

### 5. Configuration Management
**Decision**: Create separate YouTubeConfig service

```typescript
export class YouTubeConfig extends Context.Tag("@puredialog/domain/YouTubeConfig")<
  YouTubeConfig,
  { readonly apiKey: string }
>() {}
```

Benefits:
- Centralized config management
- Uses Effect's Config for env variables
- Easy to mock in tests
- Composable with other layers

## Service Interfaces

### YouTubeClient Service

```typescript
class YouTubeClient {
  fetchVideo: (
    videoId: YouTubeVideoId
  ) => Effect<YouTubeVideo, YouTubeApiError | YouTubeVideoNotFoundError>

  fetchVideoByUrl: (
    url: string
  ) => Effect<YouTubeVideo, YouTubeApiError | YouTubeVideoNotFoundError>
}
```

**Key Points**:
- Clean interface with NO requirements (requirements = never)
- Two error types: NotFound (404) and ApiError (all others)
- Both methods return full YouTubeVideo schema
- Dependencies managed at Layer construction phase

### YouTubeConfig Service

```typescript
class YouTubeConfig {
  apiKey: string
}
```

**Key Points**:
- Single config value (YouTube API key)
- Reads from YOUTUBE_API_KEY environment variable
- No requirements (leaf node in dependency graph)

## Dependency Graph

```
YouTubeConfig (no deps)
    │
    ├─→ HttpClient (from @effect/platform)
    │
    └─→ YouTubeClient (needs Config + HttpClient)
            │
            └─→ API Handler (needs YouTubeClient + JobStore)
```

## Layer Composition

### Domain Layer

```typescript
// packages/domain/src/youtube/index.ts

export const YouTubeClientLive = YouTubeClientLayer.pipe(
  Layer.provide(FetchHttpClient.layer),
  Layer.provide(YouTubeConfigLayer)
)
```

### API Layer

```typescript
// packages/api/src/server.ts

const ApiDeps = Layer.mergeAll(
  YouTubeClientLive,     // NEW
  JobStoreLayerLive,
  // ... other deps
)
```

## API Flow

### New Handler Logic

```typescript
const createJobHandler = (payload: CreateJobRequest) =>
  Effect.gen(function*() {
    const youtubeClient = yield* YouTubeClient
    const store = yield* JobStore

    // 1. Extract video ID from URL
    const videoId = yield* extractVideoIdOrFail(payload.youtubeUrl)

    // 2. Fetch full video metadata
    const video = yield* youtubeClient.fetchVideo(videoId)

    // 3. Create MediaResource internally
    const media = { type: "youtube", data: video }

    // 4. Create and persist job (existing logic)
    const job = yield* createTranscriptionJob({ media, ...payload })
    return yield* store.createJob(job)
  })
```

## Migration Strategy

### Phase 1: Domain Layer (No Breaking Changes) ✓ COMPLETE
- Create YouTubeConfig service ✓
- Create YouTubeClient service ✓
- Add comprehensive tests ✓
- Document APIs ✓
- **Status**: ✓ Implemented (October 15, 2025)

### Phase 2: API Update (Breaking Change) - DEFERRED
- Update CreateJobRequest schema
- Update job creation handler
- Add YouTubeClient to API dependencies
- Update API tests
- **Status**: Deferred to future work

### Phase 3: Worker Update ✓ COMPLETE
- Replace worker YouTube client with domain client ✓
- Update worker dependencies ✓
- Remove duplicate code ✓
- **Status**: ✓ Implemented (October 15, 2025)

### Phase 4: Cleanup ✓ COMPLETE
- Remove legacy code ✓
- Update documentation ✓
- Verify all packages build and test ✓
- **Status**: ✓ Completed (October 15, 2025)

## Implementation Priority

### High Priority (Immediate)
1. **YouTubeConfig Service** - Simple, no dependencies
2. **YouTubeClient Service** - Core functionality
3. **YouTubeClient Tests** - Ensure correctness

### Medium Priority (After Domain Layer)
4. **API Schema Update** - New request format
5. **API Handler Update** - Use YouTubeClient
6. **API Tests** - Verify integration

### Low Priority (After API)
7. **Worker Migration** - Use domain client
8. **Cleanup** - Remove old code

## Testing Strategy

### Unit Tests
- YouTubeClient.fetchVideo (success, not found, errors)
- YouTubeClient.fetchVideoByUrl (various URL formats)
- URL extraction utilities
- Config loading

### Integration Tests
- API endpoint with real URLs
- Layer composition
- Dependency injection
- Error propagation

### Mock Strategy
```typescript
// Test layer with mock responses
const YouTubeClientTest = Layer.succeed(
  YouTubeClient,
  {
    fetchVideo: (id) => Effect.succeed(mockYouTubeVideo),
    fetchVideoByUrl: (url) => Effect.succeed(mockYouTubeVideo)
  }
)
```

## Error Handling

### Error Types

1. **YouTubeVideoNotFoundError** (404)
   - Video ID doesn't exist
   - Video is private/deleted
   - Maps to HTTP 404

2. **YouTubeApiError** (500/503)
   - Rate limit exceeded
   - Invalid API key
   - Network errors
   - Maps to HTTP 500 or 503

3. **Invalid URL** (400)
   - URL parsing fails
   - Not a YouTube URL
   - Maps to HTTP 400

## Performance Considerations

### Request Flow Change

**Before**: `Client → YouTube API → Client → PureDialog API`
**After**: `Client → PureDialog API → YouTube API`

**Impact**:
- One less round-trip for client
- Same total latency (just moved server-side)
- Better for caching (server can cache)
- Better for rate limiting (centralized)

### Caching Opportunity (Future)
```typescript
// Can add Effect Cache layer later
const CachedYouTubeClient = YouTubeClientLive.pipe(
  Layer.provide(Cache.layer)
)
```

## Security Considerations

1. **API Key**: Stays server-side (good)
2. **Rate Limiting**: Implement at API level
3. **URL Validation**: Strict validation prevents injection
4. **Error Messages**: Don't leak internal details

## Backward Compatibility

### Recommended Approach: Versioned Endpoints

**Keep both endpoints during migration period**:
- `/jobs` - Old format (deprecated, accepts full object)
- `/v2/jobs` - New format (accepts URL)

**Migration Timeline**:
1. Deploy v2 endpoint
2. Give clients 90 days to migrate
3. Deprecate v1 endpoint
4. Remove v1 after sunset date

## Documentation Updates Needed

1. **API Documentation**
   - New request schema
   - Migration guide
   - Example requests

2. **Client SDKs**
   - Update to use new endpoint
   - Simplify client code
   - Remove YouTube API dependency

3. **Architecture Documentation**
   - Update service catalog
   - Add YouTubeClient docs
   - Update dependency graphs

## Success Metrics

1. **API Simplicity**: Request payload size reduced by ~90%
2. **Client Integration**: Reduced from 50+ lines to 5 lines
3. **Code Reuse**: YouTube client shared across 2+ packages
4. **Test Coverage**: >90% coverage on new services
5. **Migration**: 100% of clients migrated within 90 days

## Open Questions

1. **Q**: Should we support batch operations (multiple URLs)?
   **A**: Not in initial implementation, add later if needed

2. **Q**: Should we cache YouTube API responses?
   **A**: Not in initial implementation, add Effect Cache later

3. **Q**: How long to support old endpoint?
   **A**: 90 days deprecation period, then remove

4. **Q**: Should we support channel URLs too?
   **A**: Yes, YouTubeClient.fetchVideoByUrl handles this

## Next Steps

### For effect-engineer (Implementation)

1. **Start with Domain Layer** - Implement services in this order:
   - `packages/domain/src/youtube/config.ts`
   - `packages/domain/src/youtube/client.ts`
   - Tests for both services

2. **Follow Existing Patterns** - Reference:
   - `packages/storage/src/JobStore.ts` for service pattern
   - `packages/llm/src/service.ts` for layer composition
   - `patterns/effect-service-layer-patterns.md` for guidelines

3. **Write Tests First** - Use @effect/vitest:
   - Mock HttpClient responses
   - Test success and error cases
   - Test URL parsing edge cases

4. **After Domain Layer** - Update API:
   - Modify `packages/api/src/http/schemas.ts`
   - Update `packages/api/src/routes/jobs.ts`
   - Add YouTubeClient to server dependencies

### For Review

Before proceeding with implementation, please confirm:
- [ ] Architecture design is sound
- [ ] Service interfaces are correct
- [ ] Dependency graph is appropriate
- [ ] Migration strategy is acceptable
- [ ] No missing requirements or edge cases

## References

- **Architecture Document**: `/specs/youtube-api-simplification/architecture.md`
- **Diagrams**: `/specs/youtube-api-simplification/diagrams.md`
- **Existing Patterns**: `/patterns/effect-service-layer-patterns.md`
- **Current Implementation**: `packages/worker-metadata/src/services/youtube.ts`

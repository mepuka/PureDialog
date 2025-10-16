# YouTube API Simplification

## Overview

Architecture design for moving the YouTube client to the domain layer and simplifying the API to accept YouTube video links instead of full media objects.

## Documents

### 1. [SUMMARY.md](./SUMMARY.md) - **START HERE**
Quick overview of key decisions, service interfaces, and next steps. Best for understanding the "what" and "why" at a high level.

### 2. [architecture.md](./architecture.md) - Detailed Design
Comprehensive architecture document covering:
- Current state analysis
- Proposed architecture with code examples
- Service designs and contracts
- Migration strategy with phases
- Implementation checklist
- Architecture decisions with rationale

### 3. [diagrams.md](./diagrams.md) - Visual Reference
Visual diagrams showing:
- Service dependency graphs
- Request flow comparisons (before/after)
- Layer composition
- Error flow
- Type transformations
- Package structure

## Quick Start

### For Reviewers
1. Read [SUMMARY.md](./SUMMARY.md) first (5 min)
2. Review [diagrams.md](./diagrams.md) for visual understanding (5 min)
3. Read [architecture.md](./architecture.md) for full details (20 min)

### For Implementers
1. Read [SUMMARY.md](./SUMMARY.md) to understand goals (5 min)
2. Review "Service Interfaces" section in [architecture.md](./architecture.md) (10 min)
3. Follow "Implementation Checklist" in [architecture.md](./architecture.md)
4. Reference [diagrams.md](./diagrams.md) while coding

## Key Changes

### What's Moving
- **From**: `packages/worker-metadata/src/services/youtube.ts`
- **To**: `packages/domain/src/youtube/client.ts` + `config.ts`

### API Changes
- **Before**: Client sends full YouTubeVideo object (~10 fields)
- **After**: Client sends YouTube URL string (1 field)

### Benefits
- Simpler client integration (5 lines instead of 50+)
- No client-side YouTube API key needed
- Server is source of truth for metadata
- Reusable YouTube client across all packages
- Clean service boundaries

## Implementation Status

- [x] Architecture design complete
- [x] Domain layer implementation ✓
- [ ] API layer implementation (DEFERRED - Phase 2)
- [x] Worker migration ✓
- [x] Documentation updates ✓
- [x] Phase 4 cleanup complete ✓

## Dependencies

### New Services
- `YouTubeConfig` - Configuration service (reads API key)
- `YouTubeClient` - YouTube API client service

### Service Graph
```
YouTubeConfig (no deps)
    ├─→ HttpClient
    └─→ YouTubeClient
            └─→ API Handler
```

## Files Created

This specification includes:
- `README.md` - This file (navigation guide)
- `SUMMARY.md` - Executive summary and quick reference
- `architecture.md` - Comprehensive architecture design
- `diagrams.md` - Visual diagrams and flows

## Next Actions

### Immediate (Phase 1 - Domain Layer)
1. Create `packages/domain/src/youtube/config.ts`
2. Create `packages/domain/src/youtube/client.ts`
3. Write comprehensive tests
4. Update `packages/domain/src/youtube/index.ts`

### After Phase 1 (Phase 2 - API Update)
5. Update `packages/api/src/http/schemas.ts`
6. Update `packages/api/src/routes/jobs.ts`
7. Add YouTubeClient to API dependencies
8. Update API tests

### After Phase 2 (Phase 3 - Worker Migration)
9. Update `packages/worker-metadata` to use domain client
10. Remove duplicate YouTube client code
11. Update worker tests

## Questions or Concerns?

Before implementation, please review:
- [ ] Does the service interface look correct?
- [ ] Is the dependency graph appropriate?
- [ ] Does the migration strategy make sense?
- [ ] Are there any missing requirements?
- [ ] Any performance or security concerns?

## References

### Existing Patterns
- `/patterns/effect-service-layer-patterns.md` - Service design patterns
- `/patterns/layer-composition.md` - Layer composition patterns
- `/patterns/http-api.md` - HTTP API patterns

### Similar Services in Codebase
- `packages/storage/src/JobStore.ts` - Service pattern example
- `packages/llm/src/service.ts` - Layer composition example
- `packages/ingestion/src/service.ts` - Config service example

### Domain Types
- `packages/domain/src/youtube/types.ts` - Existing YouTube types
- `packages/domain/src/youtube/utilities.ts` - URL parsing utilities
- `packages/domain/src/media/resources.ts` - MediaResource schema

---

**Status**: Architecture design complete, ready for implementation review
**Author**: effect-architect agent
**Date**: 2025-10-15

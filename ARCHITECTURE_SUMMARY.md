# PureDialog YouTube Ingestion Architecture

## Overview

The codebase has been reorganized to follow clean architecture principles with proper separation between domain types and external API integrations.

## Architecture

### Domain Package (`@puredialog/domain`)

**Purpose**: Contains pure business logic and domain types without external dependencies.

**Key Types**:
- `YouTubeVideoId` - Branded string type for video IDs
- `YouTubeChannelId` - Branded string type for channel IDs  
- `YouTubeVideo` - Core video domain type
- `YouTubeChannel` - Core channel domain type
- `MediaResource` - Discriminated union for media types
- `extractVideoId`, `extractChannelId` - URL parsing utilities

**Critical Rule**: Domain package NEVER imports external APIs or SDKs.

### Ingestion Package (`@puredialog/ingestion`)

**Purpose**: Handles external API integration and converts to domain types.

**Architecture**:
1. **Adapters** (`src/adapters/`) - Convert Google API types to domain types
2. **Services** (`src/services/`) - High-level business operations using domain types  
3. **Clients** (`src/youtube/`) - Low-level API communication
4. **PubSub** (`src/pubsub/`) - Message queue integration

### Key Principles

1. **Clean Boundaries**: External API types never leak into domain
2. **Adapter Pattern**: Adapters bridge external APIs and domain types
3. **Effect-First**: All operations use Effect library patterns
4. **Type Safety**: No `any` types or type assertions

## Working Example

The `packages/ingestion/example.ts` demonstrates the working architecture:

```typescript
import { YouTubeService, YouTubeServiceLive } from "./src/services/youtube.js"
import * as Domain from "@puredialog/domain"

const program = Effect.gen(function* () {
  const youtubeService = yield* YouTubeService
  const videoId = "dQw4w9WgXcQ" as Domain.YouTubeVideoId
  const video = yield* youtubeService.getVideo(videoId)
  
  yield* Console.log(`Title: ${video.data.title}`)
})

const runnable = program.pipe(Effect.provide(YouTubeServiceLive))
Effect.runPromise(runnable)
```

## Current Status

✅ **Domain Package**: Clean, compiles, no external dependencies
✅ **Basic Service**: Working YouTube service with mock data  
✅ **Type Safety**: Proper TypeScript types throughout
✅ **Effect Integration**: Proper Effect library usage

## Next Steps

1. **Complete YouTube Client**: Implement real YouTube API integration
2. **Add Search**: Implement video search functionality
3. **Error Handling**: Add comprehensive error types and handling
4. **Testing**: Add comprehensive test coverage
5. **Documentation**: Add JSDoc documentation

## Usage

```bash
# Build all packages
pnpm run build

# Run example
cd packages/ingestion && pnpm tsx example.ts
```

The architecture is now clean, follows domain-driven design principles, and provides a solid foundation for YouTube video ingestion and processing.

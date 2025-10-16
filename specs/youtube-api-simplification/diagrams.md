# Architecture Diagrams

## Service Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                             │
│                                                                   │
│  ┌──────────────────┐                                            │
│  │ YouTubeConfig    │  (no dependencies)                         │
│  │ - apiKey         │                                             │
│  └────────┬─────────┘                                             │
│           │                                                       │
│           ├──────────────────┐                                    │
│           │                  │                                    │
│           ▼                  ▼                                    │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ HttpClient       │  │ YouTubeClient    │                     │
│  │ (from @effect/   │  │ - fetchVideo()   │                     │
│  │  platform)       │  │ - fetchVideoByUrl│                     │
│  └──────────────────┘  └────────┬─────────┘                     │
│                                  │                                │
└──────────────────────────────────┼────────────────────────────────┘
                                   │
┌──────────────────────────────────┼────────────────────────────────┐
│                         API LAYER│                                │
│                                  │                                │
│                                  ▼                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ POST /jobs Handler                                        │   │
│  │                                                            │   │
│  │  1. Extract video ID from URL                             │   │
│  │  2. Fetch video metadata (YouTubeClient)                  │   │
│  │  3. Create MediaResource internally                       │   │
│  │  4. Create TranscriptionJob                               │   │
│  │  5. Persist to JobStore                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Request Flow Comparison

### BEFORE (Current Flow)

```
┌────────────┐                                    ┌────────────────┐
│   Client   │                                    │ YouTube API v3 │
└──────┬─────┘                                    └────────────────┘
       │                                                    ▲
       │ 1. Fetch video metadata                           │
       │    (requires YouTube API key)                     │
       ├───────────────────────────────────────────────────┘
       │
       │ 2. Receive full YouTubeVideo object
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /jobs                                                   │
│ {                                                            │
│   media: {                                                   │
│     type: "youtube",                                         │
│     data: {                                                  │
│       id: "dQw4w9WgXcQ",                                     │
│       title: "Test Video",                                   │
│       description: "...",                                    │
│       publishedAt: "2024-01-01T00:00:00Z",                   │
│       channelId: "UC...",                                    │
│       channelTitle: "Channel",                               │
│       thumbnails: [...],                                     │
│       duration: 180,                                         │
│       viewCount: 1000,                                       │
│       likeCount: 50,                                         │
│       commentCount: 10,                                      │
│       tags: ["tag1", "tag2"]                                 │
│     }                                                        │
│   }                                                          │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
       │
       │ 3. Store job with media metadata
       │
       ▼
┌────────────┐
│  JobStore  │
└────────────┘

Problems:
- Client needs YouTube API key
- Extra round-trip (client → YouTube → client → API)
- Metadata sync issues (client vs server)
- Complex request payload
- Client must understand YouTube API
```

### AFTER (Proposed Flow)

```
┌────────────┐
│   Client   │
└──────┬─────┘
       │
       │ 1. Send YouTube URL (simple!)
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /jobs                                                   │
│ {                                                            │
│   youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" │
│ }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ 2. API extracts video ID
                       │    (using domain utilities)
                       │
                       │ 3. API fetches metadata
                       │    (using YouTubeClient service)
                       ▼
              ┌────────────────┐
              │ YouTube API v3 │
              └───────┬────────┘
                      │
                      │ 4. Return full metadata
                      │
                      ▼
              ┌──────────────────────────────┐
              │ API creates MediaResource    │
              │ {                             │
              │   type: "youtube",            │
              │   data: YouTubeVideo          │
              │ }                             │
              └──────────┬───────────────────┘
                         │
                         │ 5. Store job
                         │
                         ▼
                  ┌────────────┐
                  │  JobStore  │
                  └────────────┘

Benefits:
- No client-side YouTube API key needed
- Single request from client to API
- Server is source of truth for metadata
- Simple request payload (just a URL!)
- Client doesn't need YouTube API knowledge
```

## Layer Composition

### Domain Layer Services

```
┌─────────────────────────────────────────────────────┐
│ YouTubeClientLive                                    │
│                                                      │
│  Dependencies:                                       │
│    ├─ YouTubeConfigLayer                            │
│    │   └─ Reads YOUTUBE_API_KEY from env            │
│    │                                                 │
│    └─ FetchHttpClient.layer                         │
│        └─ Provides HTTP client for API calls        │
│                                                      │
│  Exports:                                            │
│    └─ YouTubeClient service                         │
│        ├─ fetchVideo(videoId)                       │
│        └─ fetchVideoByUrl(url)                      │
└─────────────────────────────────────────────────────┘
```

### API Layer Services

```
┌─────────────────────────────────────────────────────┐
│ API Server Layer                                     │
│                                                      │
│  Dependencies:                                       │
│    ├─ YouTubeClientLive (NEW!)                      │
│    │   └─ From domain layer                         │
│    │                                                 │
│    ├─ JobStoreLayerLive                             │
│    │   └─ Job persistence                            │
│    │                                                 │
│    └─ Other API dependencies...                     │
│                                                      │
│  Exports:                                            │
│    └─ HTTP API Server                               │
│        └─ POST /jobs (uses YouTubeClient)           │
└─────────────────────────────────────────────────────┘
```

## Error Flow

```
POST /jobs { youtubeUrl: "..." }
       │
       ▼
┌─────────────────────────────────────────────┐
│ Extract Video ID                             │
│                                              │
│ Success: YouTubeVideoId                      │
│ Failure: Invalid URL → 400 Bad Request      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Fetch Video Metadata (YouTubeClient)        │
│                                              │
│ Success: YouTubeVideo                        │
│ Failure:                                     │
│   - YouTubeVideoNotFoundError → 404         │
│   - YouTubeApiError → 500 or 503            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Create MediaResource                         │
│                                              │
│ Success: MediaResource                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Create TranscriptionJob                      │
│                                              │
│ Success: QueuedJob                           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Persist to JobStore                          │
│                                              │
│ Success: QueuedJob → 202 Accepted           │
│ Failure: RepositoryError → 500              │
└─────────────────────────────────────────────┘
```

## Type Flow

### Request to Domain Transformation

```
API Request (External)
     │
     │  youtubeUrl: string
     │
     ▼
┌──────────────────────────────────────┐
│ YouTube Utilities                    │
│ extractVideoId(url)                  │
└────────────┬─────────────────────────┘
             │
             │  videoId: YouTubeVideoId (branded)
             │
             ▼
┌──────────────────────────────────────┐
│ YouTubeClient                        │
│ fetchVideo(videoId)                  │
└────────────┬─────────────────────────┘
             │
             │  video: YouTubeVideo (full schema)
             │
             ▼
┌──────────────────────────────────────┐
│ MediaResource.make()                 │
│ { type: "youtube", data: video }     │
└────────────┬─────────────────────────┘
             │
             │  media: MediaResource
             │
             ▼
┌──────────────────────────────────────┐
│ TranscriptionJob (Internal Domain)   │
│ { id, media, status, ... }           │
└──────────────────────────────────────┘
```

## Package Structure

```
packages/
│
├── domain/                         (Shared domain layer)
│   └── src/
│       └── youtube/
│           ├── types.ts            (Existing: IDs, schemas)
│           ├── utilities.ts        (Existing: URL parsing)
│           ├── config.ts           (NEW: YouTubeConfig service)
│           ├── client.ts           (NEW: YouTubeClient service)
│           └── index.ts            (Updated: export all)
│
├── api/                            (API service)
│   └── src/
│       ├── http/
│       │   ├── schemas.ts          (Updated: new request schema)
│       │   └── api.ts
│       ├── routes/
│       │   └── jobs.ts             (Updated: use YouTubeClient)
│       └── server.ts               (Updated: add YouTubeClient dep)
│
└── worker-metadata/                (Metadata enrichment worker)
    └── src/
        ├── services/
        │   └── youtube.ts          (To be replaced with domain client)
        └── config.ts
```

## Service Interface Contracts

### YouTubeClient Interface

```typescript
interface YouTubeClientInterface {
  // Core method: Fetch by video ID
  fetchVideo: (
    videoId: YouTubeVideoId
  ) => Effect<YouTubeVideo, YouTubeApiError | YouTubeVideoNotFoundError>

  // Convenience method: Extract ID + fetch
  fetchVideoByUrl: (
    url: string
  ) => Effect<YouTubeVideo, YouTubeApiError | YouTubeVideoNotFoundError>
}
```

### Dependencies

```
YouTubeClient requires:
  ├─ YouTubeConfig (API key)
  └─ HttpClient (HTTP requests)

YouTubeConfig requires:
  └─ (none - reads from environment)

HttpClient requires:
  └─ (none - provided by @effect/platform)
```

## Migration Timeline

```
Phase 1: Domain Layer (Week 1)
  ├─ Create YouTubeConfig
  ├─ Create YouTubeClient
  ├─ Write tests
  └─ No breaking changes

Phase 2: API Update (Week 2)
  ├─ Update schemas
  ├─ Update handlers
  ├─ Add YouTubeClient to dependencies
  ├─ Update tests
  └─ BREAKING CHANGE (versioned endpoint)

Phase 3: Worker Update (Week 3)
  ├─ Replace worker YouTube client
  ├─ Update worker dependencies
  └─ No external API changes

Phase 4: Cleanup (Week 4)
  ├─ Remove old code
  ├─ Deprecate old endpoint
  └─ Documentation
```

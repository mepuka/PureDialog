# YouTube API Client Design Document

## Overview

This document details the technical design for a YouTube Data API v3 client implemented using Effect's HTTP client platform. The design emphasizes type safety, composability, error resilience, and adherence to established project patterns.

## Architecture

### 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│ YoutubeApiClient Service (Context.Tag)                     │
│ ├── getVideo(id)      ├── getChannel(id)                   │
│ ├── getVideoByUrl()   ├── getChannelByUrl()                │
│ └── getVideos([])     └── getChannels([])                  │
├─────────────────────────────────────────────────────────────┤
│              HTTP Client Abstraction                       │
│ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│ │ Request Builder │ │ Response Parser │ │ Error Handler │ │
│ │ - URL construct │ │ - Schema valid  │ │ - HTTP errors │ │
│ │ - Headers       │ │ - Data extract  │ │ - Network err │ │
│ │ - Parameters    │ │ - Transform     │ │ - Retry logic │ │
│ └─────────────────┘ └─────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                @effect/platform Layer                      │
│ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│ │ HttpClient      │ │ HttpClientReq   │ │ HttpClientRes │ │
│ │ - FetchClient   │ │ - URL building  │ │ - JSON decode │ │
│ │ - Retry logic   │ │ - Header mgmt   │ │ - Schema val  │ │
│ │ - Error handle  │ │ - Body content  │ │ - Stream proc │ │
│ └─────────────────┘ └─────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   Schema Layer                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│ │ Resource Schema │ │ URL Validation  │ │ Error Types   │ │
│ │ - Video         │ │ - VideoId       │ │ - ApiError    │ │
│ │ - Channel       │ │ - ChannelId     │ │ - NetworkErr  │ │
│ │ - Thumbnails    │ │ - URL extract   │ │ - ValidationE │ │
│ └─────────────────┘ └─────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                YouTube Data API v3                         │
│                (External Service)                          │
└─────────────────────────────────────────────────────────────┘
```

### 2. Module Structure

```
packages/youtube/
├── client.ts              # Main client implementation
├── resources.ts           # Schemas & URL utilities (existing)
├── config.ts             # Configuration management
├── errors.ts             # Error types and utilities
├── internal/
│   ├── requests.ts       # Request building utilities
│   ├── responses.ts      # Response processing utilities
│   └── retry.ts          # Retry logic implementation
└── test/
    ├── client.test.ts    # Core client tests
    ├── mocks/
    │   ├── responses.ts  # Mock API responses
    │   └── client.ts     # Mock client utilities
    └── integration.test.ts # Integration tests
```

## Core Components

### 3. Service Definition

```typescript
// packages/youtube/client.ts
import { Context, Effect, Layer } from "effect"
import { HttpClient } from "@effect/platform"
import { Video, Channel, VideoId, ChannelId } from "./resources.ts"
import { YoutubeApiError } from "./errors.ts"

class YoutubeApiClient extends Context.Tag("YoutubeApiClient")<
  YoutubeApiClient,
  {
    // Single resource operations
    readonly getVideo: (id: VideoId) => Effect<Video, YoutubeApiError>
    readonly getChannel: (id: ChannelId) => Effect<Channel, YoutubeApiError>

    // URL-based operations
    readonly getVideoByUrl: (url: string) => Effect<Video, YoutubeApiError>
    readonly getChannelByUrl: (url: string) => Effect<Channel, YoutubeApiError>

    // Batch operations
    readonly getVideos: (ids: VideoId[]) => Effect<Video[], YoutubeApiError>
    readonly getChannels: (ids: ChannelId[]) => Effect<Channel[], YoutubeApiError>
  }
>() {}
```

### 4. Configuration Management

```typescript
// packages/youtube/config.ts
import { Config } from "effect"

export const YoutubeConfig = {
  apiKey: Config.secret("YOUTUBE_API_KEY"),
  baseUrl: Config.string("YOUTUBE_API_BASE_URL").pipe(
    Config.withDefault("https://www.googleapis.com/youtube/v3")
  ),
  timeout: Config.duration("YOUTUBE_API_TIMEOUT").pipe(
    Config.withDefault("30 seconds")
  ),
  retryAttempts: Config.number("YOUTUBE_API_RETRY_ATTEMPTS").pipe(
    Config.withDefault(3)
  )
}

export type YoutubeConfig = {
  readonly apiKey: string
  readonly baseUrl: string
  readonly timeout: Duration
  readonly retryAttempts: number
}
```

### 5. Error System Design

```typescript
// packages/youtube/errors.ts
import { Data } from "effect"

export class YoutubeApiError extends Data.TaggedError("YoutubeApiError")<{
  readonly type: "InvalidUrl" | "ApiError" | "NetworkError" | "ValidationError" | "ConfigurationError"
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {
  static invalidUrl(url: string, details?: string) {
    return new YoutubeApiError({
      type: "InvalidUrl",
      message: `Invalid YouTube URL: ${url}${details ? ` (${details})` : ""}`,
      context: { url }
    })
  }

  static apiError(status: number, message: string, cause?: unknown) {
    return new YoutubeApiError({
      type: "ApiError",
      message: `YouTube API error (${status}): ${message}`,
      cause,
      context: { status }
    })
  }

  static networkError(message: string, cause?: unknown) {
    return new YoutubeApiError({
      type: "NetworkError",
      message: `Network error: ${message}`,
      cause
    })
  }

  static validationError(message: string, cause?: unknown) {
    return new YoutubeApiError({
      type: "ValidationError",
      message: `Validation error: ${message}`,
      cause
    })
  }

  static configurationError(message: string) {
    return new YoutubeApiError({
      type: "ConfigurationError",
      message: `Configuration error: ${message}`
    })
  }
}
```

### 6. Request Building System

```typescript
// packages/youtube/internal/requests.ts
import { HttpClientRequest } from "@effect/platform"
import { Effect } from "effect"

export const makeApiRequest = (
  endpoint: string,
  params: Record<string, string>,
  config: YoutubeConfig
) =>
  HttpClientRequest.get(`${config.baseUrl}/${endpoint}`)
    .pipe(
      HttpClientRequest.setHeaders({
        "Accept": "application/json",
        "User-Agent": "PureDialog-YouTube-Client/1.0"
      }),
      HttpClientRequest.appendUrlParam("key", config.apiKey),
      HttpClientRequest.appendUrlParams(params)
    )

export const makeVideoRequest = (ids: VideoId[], config: YoutubeConfig) =>
  makeApiRequest(
    "videos",
    {
      part: "snippet,contentDetails,status,statistics",
      id: ids.join(",")
    },
    config
  )

export const makeChannelRequest = (ids: ChannelId[], config: YoutubeConfig) =>
  makeApiRequest(
    "channels",
    {
      part: "snippet,contentDetails,statistics,status",
      id: ids.join(",")
    },
    config
  )
```

### 7. Response Processing System

```typescript
// packages/youtube/internal/responses.ts
import { HttpClientResponse } from "@effect/platform"
import { Effect, Schema } from "effect"
import { Video, Channel } from "../resources.ts"
import { YoutubeApiError } from "../errors.ts"

// API Response wrapper schema
const ApiResponse = <T>(itemSchema: Schema.Schema<T>) =>
  Schema.Struct({
    items: Schema.Array(itemSchema),
    pageInfo: Schema.optional(Schema.Struct({
      totalResults: Schema.Number,
      resultsPerPage: Schema.Number
    })),
    nextPageToken: Schema.optional(Schema.String),
    prevPageToken: Schema.optional(Schema.String),
    error: Schema.optional(Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      errors: Schema.optional(Schema.Array(Schema.Unknown))
    }))
  })

export const VideoResponse = ApiResponse(Video)
export const ChannelResponse = ApiResponse(Channel)

export const decodeVideoResponse = (response: HttpClientResponse.HttpClientResponse) =>
  HttpClientResponse.schemaBodyJson(VideoResponse)(response).pipe(
    Effect.catchTag("ParseError", (error) =>
      Effect.fail(YoutubeApiError.validationError(
        "Failed to parse video response",
        error
      ))
    )
  )

export const decodeChannelResponse = (response: HttpClientResponse.HttpClientResponse) =>
  HttpClientResponse.schemaBodyJson(ChannelResponse)(response).pipe(
    Effect.catchTag("ParseError", (error) =>
      Effect.fail(YoutubeApiError.validationError(
        "Failed to parse channel response",
        error
      ))
    )
  )

// Extract items and handle empty results
export const extractVideos = (response: Schema.Schema.Type<typeof VideoResponse>) =>
  Effect.gen(function* () {
    if (response.error) {
      return yield* Effect.fail(YoutubeApiError.apiError(
        response.error.code,
        response.error.message
      ))
    }
    return response.items
  })

export const extractChannels = (response: Schema.Schema.Type<typeof ChannelResponse>) =>
  Effect.gen(function* () {
    if (response.error) {
      return yield* Effect.fail(YoutubeApiError.apiError(
        response.error.code,
        response.error.message
      ))
    }
    return response.items
  })
```

### 8. Retry Logic Implementation

```typescript
// packages/youtube/internal/retry.ts
import { Effect, Schedule, Duration } from "effect"
import { HttpClientError } from "@effect/platform"
import { YoutubeApiError } from "../errors.ts"

// Retry policy for YouTube API
export const youtubeRetrySchedule = (maxAttempts: number) =>
  Schedule.exponential("1 seconds").pipe(
    Schedule.intersect(Schedule.recurs(maxAttempts - 1)),
    Schedule.whileInputEffect((error: YoutubeApiError) =>
      Effect.succeed(
        error.type === "NetworkError" ||
        (error.type === "ApiError" && error.context?.status === 429) ||
        (error.type === "ApiError" && (error.context?.status as number) >= 500)
      )
    )
  )

export const withRetry = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  config: YoutubeConfig
) =>
  effect.pipe(
    Effect.retry(youtubeRetrySchedule(config.retryAttempts))
  )

// HTTP error transformation
export const transformHttpError = (error: HttpClientError.HttpClientError) =>
  Effect.gen(function* () {
    switch (error._tag) {
      case "RequestError":
        return YoutubeApiError.networkError(
          "Request failed",
          error
        )
      case "ResponseError": {
        const status = error.response.status
        if (status === 403) {
          return YoutubeApiError.apiError(
            status,
            "API key invalid or quota exceeded"
          )
        } else if (status === 404) {
          return YoutubeApiError.apiError(
            status,
            "Resource not found"
          )
        } else if (status === 429) {
          return YoutubeApiError.apiError(
            status,
            "Rate limit exceeded"
          )
        } else {
          return YoutubeApiError.apiError(
            status,
            `HTTP ${status} error`
          )
        }
      }
      default:
        return YoutubeApiError.networkError(
          "Unknown HTTP error",
          error
        )
    }
  })
```

### 9. Main Client Implementation

```typescript
// packages/youtube/client.ts (core implementation)
import { Effect, Layer, Context } from "effect"
import { HttpClient } from "@effect/platform"
import { extractVideoId, extractChannelId } from "./resources.ts"
import { YoutubeConfig } from "./config.ts"
import { YoutubeApiError } from "./errors.ts"
import {
  makeVideoRequest,
  makeChannelRequest
} from "./internal/requests.ts"
import {
  decodeVideoResponse,
  decodeChannelResponse,
  extractVideos,
  extractChannels
} from "./internal/responses.ts"
import { withRetry, transformHttpError } from "./internal/retry.ts"

const makeYoutubeApiClient = Effect.gen(function* () {
  const httpClient = yield* HttpClient.HttpClient
  const config = yield* YoutubeConfig

  const executeRequest = <T>(request: HttpClientRequest, decoder: (res: HttpClientResponse) => Effect<T, YoutubeApiError>) =>
    httpClient.execute(request).pipe(
      Effect.flatMap(decoder),
      Effect.catchTag("HttpClientError", (error) =>
        Effect.flatMap(transformHttpError(error), Effect.fail)
      ),
      withRetry(config)
    )

  // Single video operation
  const getVideo = (id: VideoId) =>
    Effect.gen(function* () {
      const request = makeVideoRequest([id], config)
      const response = yield* executeRequest(request, decodeVideoResponse)
      const videos = yield* extractVideos(response)

      if (videos.length === 0) {
        return yield* Effect.fail(YoutubeApiError.apiError(
          404,
          `Video not found: ${id}`
        ))
      }

      return videos[0]!
    })

  // Video by URL operation
  const getVideoByUrl = (url: string) =>
    Effect.gen(function* () {
      const videoId = extractVideoId(url)
      if (!videoId) {
        return yield* Effect.fail(YoutubeApiError.invalidUrl(
          url,
          "Unable to extract video ID"
        ))
      }
      return yield* getVideo(videoId as VideoId)
    })

  // Batch video operation
  const getVideos = (ids: VideoId[]) =>
    Effect.gen(function* () {
      if (ids.length === 0) return []
      if (ids.length > 50) {
        return yield* Effect.fail(YoutubeApiError.validationError(
          "Maximum 50 video IDs allowed per request"
        ))
      }

      const request = makeVideoRequest(ids, config)
      const response = yield* executeRequest(request, decodeVideoResponse)
      return yield* extractVideos(response)
    })

  // Channel operations (similar pattern)
  const getChannel = (id: ChannelId) =>
    Effect.gen(function* () {
      const request = makeChannelRequest([id], config)
      const response = yield* executeRequest(request, decodeChannelResponse)
      const channels = yield* extractChannels(response)

      if (channels.length === 0) {
        return yield* Effect.fail(YoutubeApiError.apiError(
          404,
          `Channel not found: ${id}`
        ))
      }

      return channels[0]!
    })

  const getChannelByUrl = (url: string) =>
    Effect.gen(function* () {
      const channelId = extractChannelId(url)
      if (!channelId) {
        return yield* Effect.fail(YoutubeApiError.invalidUrl(
          url,
          "Unable to extract channel ID or custom URLs not supported"
        ))
      }
      return yield* getChannel(channelId as ChannelId)
    })

  const getChannels = (ids: ChannelId[]) =>
    Effect.gen(function* () {
      if (ids.length === 0) return []
      if (ids.length > 50) {
        return yield* Effect.fail(YoutubeApiError.validationError(
          "Maximum 50 channel IDs allowed per request"
        ))
      }

      const request = makeChannelRequest(ids, config)
      const response = yield* executeRequest(request, decodeChannelResponse)
      return yield* extractChannels(response)
    })

  return {
    getVideo,
    getVideoByUrl,
    getVideos,
    getChannel,
    getChannelByUrl,
    getChannels
  } as const
})

// Layer implementation
export const YoutubeApiClientLive = Layer.effect(
  YoutubeApiClient,
  makeYoutubeApiClient
).pipe(
  Layer.provide(YoutubeConfig.layer)
)
```

### 10. Configuration Layer

```typescript
// packages/youtube/config.ts (complete implementation)
import { Config, Effect, Layer } from "effect"
import { YoutubeApiError } from "./errors.ts"

export const YoutubeConfig = {
  apiKey: Config.secret("YOUTUBE_API_KEY"),
  baseUrl: Config.string("YOUTUBE_API_BASE_URL").pipe(
    Config.withDefault("https://www.googleapis.com/youtube/v3")
  ),
  timeout: Config.duration("YOUTUBE_API_TIMEOUT").pipe(
    Config.withDefault("30 seconds")
  ),
  retryAttempts: Config.number("YOUTUBE_API_RETRY_ATTEMPTS").pipe(
    Config.withDefault(3)
  )
}

export type YoutubeConfig = {
  readonly apiKey: string
  readonly baseUrl: string
  readonly timeout: Duration
  readonly retryAttempts: number
}

// Configuration validation and layer creation
const makeConfig = Effect.gen(function* () {
  const apiKey = yield* YoutubeConfig.apiKey
  const baseUrl = yield* YoutubeConfig.baseUrl
  const timeout = yield* YoutubeConfig.timeout
  const retryAttempts = yield* YoutubeConfig.retryAttempts

  // Validate API key format
  if (!apiKey || apiKey.length < 20) {
    return yield* Effect.fail(YoutubeApiError.configurationError(
      "Invalid API key format"
    ))
  }

  // Validate retry attempts
  if (retryAttempts < 0 || retryAttempts > 10) {
    return yield* Effect.fail(YoutubeApiError.configurationError(
      "Retry attempts must be between 0 and 10"
    ))
  }

  return {
    apiKey,
    baseUrl,
    timeout,
    retryAttempts
  } as const
})

export const YoutubeConfigLive = Layer.effect(
  Context.GenericTag<YoutubeConfig>("YoutubeConfig"),
  makeConfig
)
```

## Data Flow Design

### 11. Request Flow

```
Input (VideoId/URL)
    ↓
URL Processing & Validation
    ↓
Request Building
    ↓
HTTP Client Execution
    ↓
Response Validation
    ↓
Data Extraction
    ↓
Return Video/Channel
```

### 12. Error Flow

```
HTTP Error
    ↓
Error Classification
    ↓
Retry Decision
    ↓
Effect.fail(YoutubeApiError)
    ↓
Error Propagation
    ↓
Application Error Handling
```

### 13. Batch Processing Flow

```
Multiple IDs Input
    ↓
Batch Size Validation (≤50)
    ↓
Single API Request
    ↓
Response Processing
    ↓
Individual Item Extraction
    ↓
Return Array Results
```

## Testing Strategy Design

### 14. Mock HTTP Client

```typescript
// packages/youtube/test/mocks/client.ts
import { HttpClient, HttpClientResponse } from "@effect/platform"
import { Effect } from "effect"

export const createMockYoutubeApi = (responses: Record<string, unknown>) =>
  HttpClient.make((request) => {
    const url = new URL(request.url)
    const key = `${url.pathname}?${url.searchParams.toString()}`
    const mockData = responses[key] || { error: { code: 404, message: "Not found" } }

    return Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(JSON.stringify({ items: Array.isArray(mockData) ? mockData : [mockData] }))
      )
    )
  })
```

### 15. Test Data Management

```typescript
// packages/youtube/test/mocks/responses.ts
export const mockVideoResponse = {
  kind: "youtube#video",
  etag: "test-etag",
  id: "dQw4w9WgXcQ" as VideoId,
  snippet: {
    publishedAt: "2009-10-25T06:57:33Z",
    channelId: "UCuAXFkgsw1L7xaCfnd5JJOw" as ChannelId,
    title: "Rick Astley - Never Gonna Give You Up (Official Video)",
    description: "The official video for "Never Gonna Give You Up" by Rick Astley",
    thumbnails: {
      default: {
        url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
        width: 120,
        height: 90
      }
    },
    channelTitle: "Rick Astley"
  },
  contentDetails: {
    duration: "PT3M33S"
  },
  status: {
    privacyStatus: "public"
  },
  statistics: {
    viewCount: "1000000000",
    likeCount: "10000000",
    commentCount: "1000000"
  }
}

export const mockChannelResponse = {
  kind: "youtube#channel",
  etag: "test-etag",
  id: "UCuAXFkgsw1L7xaCfnd5JJOw" as ChannelId,
  snippet: {
    title: "Rick Astley",
    description: "The official Rick Astley YouTube channel",
    publishedAt: "2006-05-25T19:23:44Z",
    thumbnails: {
      default: {
        url: "https://yt3.ggpht.com/a/default-user=s88-c-k-c0x00ffffff-no-rj",
        width: 88,
        height: 88
      }
    }
  },
  statistics: {
    viewCount: "500000000",
    subscriberCount: "2500000",
    videoCount: "50"
  }
}
```

## Performance Considerations

### 16. HTTP Client Optimization

- **Connection Reuse**: FetchHttpClient automatically handles connection pooling
- **Concurrent Requests**: Batch operations use single API calls where possible
- **Request Deduplication**: Future enhancement for identical concurrent requests
- **Response Streaming**: Large responses processed efficiently

### 17. Memory Management

- **Schema Validation**: Incremental parsing prevents large object allocation
- **Error Handling**: Structured errors with minimal memory overhead
- **Resource Cleanup**: Automatic cleanup via Effect resource management
- **Batch Limits**: API limits (50 items) prevent excessive memory usage

### 18. Error Recovery

- **Exponential Backoff**: Prevents API overload during failures
- **Selective Retry**: Only transient errors trigger retries
- **Circuit Breaker**: Future enhancement for prolonged failures
- **Graceful Degradation**: Partial results for batch operations

## Security Considerations

### 19. API Key Management

- **Environment Variables**: Secure configuration via Effect Config
- **No Logging**: API keys never logged or exposed in errors
- **Validation**: API key format validation prevents invalid requests
- **Rotation Support**: Configuration allows runtime key updates

### 20. Input Validation

- **URL Sanitization**: All URLs validated before processing
- **Schema Validation**: All inputs/outputs validated via Effect Schema
- **Error Sanitization**: Error messages don't expose sensitive data
- **Rate Limiting**: Client-side request limiting prevents abuse

## Future Enhancements

### 21. Caching Layer

- **Response Caching**: Cache video/channel data with TTL
- **Request Deduplication**: Deduplicate identical concurrent requests
- **Invalidation Strategy**: Smart cache invalidation based on content type
- **Storage Backend**: Pluggable cache storage (memory, Redis, etc.)

### 22. Advanced Features

- **Search Operations**: YouTube search API integration
- **Playlist Support**: Playlist resource fetching
- **Live Streaming**: Live stream status and metrics
- **Analytics Integration**: YouTube Analytics API support

### 23. Observability Enhancements

- **Metrics Collection**: Request/response metrics with Effect Metrics
- **Distributed Tracing**: Request tracing with Effect Tracing
- **Health Checks**: Service health monitoring endpoints
- **Performance Monitoring**: Request duration and success rate tracking

This design provides a robust, type-safe, and maintainable YouTube API client that follows Effect best practices while meeting all functional and non-functional requirements.
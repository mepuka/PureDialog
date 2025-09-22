# YouTube API Client Implementation

## Overview

Implement a comprehensive YouTube Data API v3 client using Effect's HTTP client platform, following the project's established patterns for HTTP client usage, error handling, and Effect composition.

## Objectives

Create a type-safe, composable YouTube API client that:

1. **Uses Effect HTTP Client Platform**: Leverage `@effect/platform` FetchHttpClient for all HTTP operations
2. **Handles Video & Channel Resources**: Fetch video and channel data with full schema validation
3. **Supports Multiple URL Formats**: Accept various YouTube URL formats and extract canonical IDs
4. **Provides Robust Error Handling**: Handle API errors, network failures, and validation issues
5. **Follows Project Patterns**: Implement using established Effect patterns for HTTP clients and error management

## Core Requirements

### 1. API Client Service

- **Service Definition**: Create `YoutubeApiClient` service with Effect Context tag
- **HTTP Client Integration**: Use FetchHttpClient as the underlying HTTP transport
- **Configuration**: Support API key configuration via environment variables
- **Base URL**: Use `https://www.googleapis.com/youtube/v3/` as the API base

### 2. Resource Fetching

#### Video Operations
- `getVideo(id: VideoId): Effect<Video, ApiError, YoutubeApiClient>`
- `getVideoByUrl(url: string): Effect<Video, ApiError, YoutubeApiClient>`
- Support batch fetching: `getVideos(ids: VideoId[]): Effect<Video[], ApiError, YoutubeApiClient>`

#### Channel Operations
- `getChannel(id: ChannelId): Effect<Channel, ApiError, YoutubeApiClient>`
- `getChannelByUrl(url: string): Effect<Channel, ApiError, YoutubeApiClient>`
- Support batch fetching: `getChannels(ids: ChannelId[]): Effect<Channel[], ApiError, YoutubeApiClient>`

### 3. URL Processing

- **URL Extraction**: Use existing `extractVideoId` and `extractChannelId` functions from resources.ts
- **ID Validation**: Leverage existing branded types `VideoId` and `ChannelId` with pattern validation
- **Error Handling**: Proper error types for invalid URLs vs API failures

### 4. Schema Integration

- **Request Validation**: Validate API parameters using Effect Schema
- **Response Decoding**: Use `HttpClientResponse.schemaBodyJson` with Video/Channel schemas
- **URL Transformation**: Use existing `YoutubeVideoUrl` and `YoutubeChannelUrl` schemas for input flexibility

### 5. Error Management

#### Error Types
```typescript
class YoutubeApiError extends Data.TaggedError("YoutubeApiError")<{
  readonly type: "InvalidUrl" | "ApiError" | "NetworkError" | "ValidationError"
  readonly message: string
  readonly cause?: unknown
}> {}
```

#### Error Scenarios
- **Invalid URLs**: URLs that cannot be parsed or don't contain valid IDs
- **API Errors**: HTTP error responses from YouTube API (403, 404, 500, etc.)
- **Network Errors**: Connection failures, timeouts
- **Validation Errors**: Response data that doesn't match expected schema

### 6. Configuration Management

- **API Key**: Required configuration via environment variable `YOUTUBE_API_KEY`
- **Rate Limiting**: Built-in retry logic for rate limit responses (HTTP 429)
- **Timeout Configuration**: Configurable request timeouts

## Technical Architecture

### 1. Effect Platform Integration

```typescript
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { Effect, Layer, Context } from "effect"
```

**HTTP Client Pattern**:
- Use `HttpClient.HttpClient` service for all requests
- Apply proper request transformation with `HttpClientRequest.setHeaders`
- Handle responses with `HttpClientResponse.schemaBodyJson`
- Implement retry logic with `HttpClient.retry`

### 2. Service Layer Architecture

```typescript
class YoutubeApiClient extends Context.Tag("YoutubeApiClient")<
  YoutubeApiClient,
  {
    readonly getVideo: (id: VideoId) => Effect<Video, YoutubeApiError>
    readonly getChannel: (id: ChannelId) => Effect<Channel, YoutubeApiError>
    // ... other methods
  }
>() {}
```

**Layer Pattern**:
- Create `YoutubeApiClientLive` layer that provides the service implementation
- Use `Layer.effect` to create the service with HTTP client dependency
- Apply configuration via `Config` for API key management

### 3. Request Construction

**Base Request Pattern**:
```typescript
const makeRequest = (endpoint: string, params: Record<string, string>) =>
  HttpClientRequest.get(`https://www.googleapis.com/youtube/v3/${endpoint}`)
    .pipe(
      HttpClientRequest.setHeaders({ "Accept": "application/json" }),
      HttpClientRequest.appendUrlParam("key", apiKey),
      HttpClientRequest.appendUrlParams(params)
    )
```

**Video Request**:
- Endpoint: `/videos`
- Parts: `snippet,contentDetails,status,statistics`
- Parameters: `id`, `part`, `key`

**Channel Request**:
- Endpoint: `/channels`
- Parts: `snippet,contentDetails,statistics,status`
- Parameters: `id`, `part`, `key`

### 4. Response Processing

```typescript
const decodeVideoResponse = HttpClientResponse.schemaBodyJson(
  Schema.Struct({
    items: Schema.Array(Video),
    pageInfo: Schema.optional(Schema.Struct({
      totalResults: Schema.Number,
      resultsPerPage: Schema.Number
    }))
  })
)
```

### 5. Error Handling Strategy

**HTTP Client Error Handling**:
- Use `HttpClient.filterStatusOk` to treat non-2xx as errors
- Map HTTP status codes to specific error types
- Apply retry logic for transient failures (429, 500-503)

**Effect Error Flow**:
```typescript
const getVideo = (id: VideoId) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient
    const request = makeVideoRequest(id)
    const response = yield* client.execute(request)
    const data = yield* decodeVideoResponse(response)

    if (data.items.length === 0) {
      return yield* Effect.fail(new YoutubeApiError({
        type: "ApiError",
        message: `Video not found: ${id}`
      }))
    }

    return data.items[0]
  }).pipe(
    Effect.catchTag("HttpClientError", (error) =>
      Effect.fail(new YoutubeApiError({
        type: "NetworkError",
        message: "Failed to fetch video",
        cause: error
      }))
    )
  )
```

## Implementation Phases

### Phase 1: Core Infrastructure
1. Create `YoutubeApiClient` service interface
2. Implement basic HTTP client setup with FetchHttpClient
3. Add API key configuration management
4. Create base request/response handling utilities

### Phase 2: Video Operations
1. Implement `getVideo` method with full error handling
2. Add `getVideoByUrl` method using existing URL extraction
3. Implement batch `getVideos` method
4. Add comprehensive request/response validation

### Phase 3: Channel Operations
1. Implement `getChannel` method
2. Add `getChannelByUrl` method
3. Implement batch `getChannels` method
4. Ensure consistent error handling across operations

### Phase 4: Advanced Features
1. Add retry logic for rate limiting
2. Implement request caching (optional)
3. Add request logging and observability
4. Performance optimizations

### Phase 5: Testing & Validation
1. Create comprehensive test suite with mock HTTP responses
2. Test error scenarios and edge cases
3. Validate URL extraction and ID conversion
4. Integration testing with real API (optional)

## Testing Strategy

### 1. HTTP Client Mocking
```typescript
const mockYoutubeApi = (responses: Record<string, unknown>) =>
  HttpClient.make((request) => {
    const url = request.url
    const mockResponse = responses[url] || { error: "Not found" }
    return Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(JSON.stringify(mockResponse))
      )
    )
  })
```

### 2. Test Scenarios
- **Valid requests**: Test successful video/channel fetching
- **Invalid URLs**: Test URL parsing error handling
- **API errors**: Test HTTP error response handling
- **Network errors**: Test connection failure scenarios
- **Schema validation**: Test response validation errors

### 3. Integration Testing
- Test with FetchHttpClient layer in realistic scenarios
- Validate error propagation through Effect system
- Test configuration management and environment setup

## Success Criteria

1. **Functional**: All video and channel operations work correctly
2. **Type-Safe**: Full Effect/Schema integration with compile-time safety
3. **Error-Resilient**: Comprehensive error handling for all failure modes
4. **Well-Tested**: High test coverage including error scenarios
5. **Consistent**: Follows established project patterns and conventions
6. **Performant**: Efficient HTTP client usage with proper retry logic
7. **Configurable**: Environment-based configuration management

## Dependencies

- `@effect/platform`: HTTP client infrastructure
- `effect`: Core Effect runtime and utilities
- Existing `packages/youtube/resources.ts`: Schema definitions and URL utilities
- Project patterns: HTTP client patterns, error handling, layer composition

## File Structure

```
packages/youtube/
├── client.ts           # Main client implementation
├── resources.ts        # Existing schemas and URL utilities (already implemented)
├── config.ts          # Configuration management
├── errors.ts          # Error types and utilities
└── test/
    ├── client.test.ts     # Core client tests
    ├── mocks/             # Mock data and utilities
    └── integration.test.ts # Integration tests
```
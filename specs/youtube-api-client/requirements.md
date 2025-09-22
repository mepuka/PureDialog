# YouTube API Client Requirements

## Functional Requirements

### 1. Core API Client Service

**FR-1.1: Service Interface**
- MUST provide a `YoutubeApiClient` service using Effect Context tag pattern
- MUST integrate with `@effect/platform` FetchHttpClient as the underlying HTTP transport
- MUST support configurable API key via environment variables
- MUST use `https://www.googleapis.com/youtube/v3/` as the base API URL

**FR-1.2: HTTP Client Integration**
- MUST use `HttpClient.HttpClient` service for all HTTP operations
- MUST apply proper request headers including API key authentication
- MUST handle HTTP responses using Effect-based schema validation
- MUST implement retry logic for transient failures (HTTP 429, 500-503)

### 2. Video Resource Operations

**FR-2.1: Video Fetching by ID**
- MUST implement `getVideo(id: VideoId): Effect<Video, YoutubeApiError, YoutubeApiClient>`
- MUST validate input using existing `VideoId` branded type
- MUST fetch video data including: snippet, contentDetails, status, statistics
- MUST return validated `Video` schema or appropriate error

**FR-2.2: Video Fetching by URL**
- MUST implement `getVideoByUrl(url: string): Effect<Video, YoutubeApiError, YoutubeApiClient>`
- MUST extract video ID from various YouTube URL formats (watch, embed, youtu.be, mobile)
- MUST leverage existing `extractVideoId` utility function
- MUST handle invalid URLs with specific error type

**FR-2.3: Batch Video Operations**
- MUST implement `getVideos(ids: VideoId[]): Effect<Video[], YoutubeApiError, YoutubeApiClient>`
- MUST support up to 50 video IDs per request (YouTube API limit)
- MUST return partial results when some videos are not found
- MUST handle mixed success/failure scenarios appropriately

### 3. Channel Resource Operations

**FR-3.1: Channel Fetching by ID**
- MUST implement `getChannel(id: ChannelId): Effect<Channel, YoutubeApiError, YoutubeApiClient>`
- MUST validate input using existing `ChannelId` branded type
- MUST fetch channel data including: snippet, contentDetails, statistics, status
- MUST return validated `Channel` schema or appropriate error

**FR-3.2: Channel Fetching by URL**
- MUST implement `getChannelByUrl(url: string): Effect<Channel, YoutubeApiError, YoutubeApiClient>`
- MUST extract channel ID from standard YouTube channel URLs (/channel/UC...)
- MUST leverage existing `extractChannelId` utility function
- MUST handle custom URLs (/user/, /c/, /@) with appropriate errors (API resolution required)

**FR-3.3: Batch Channel Operations**
- MUST implement `getChannels(ids: ChannelId[]): Effect<Channel[], YoutubeApiError, YoutubeApiClient>`
- MUST support up to 50 channel IDs per request
- MUST return partial results when some channels are not found
- MUST handle mixed success/failure scenarios appropriately

### 4. URL Processing and Validation

**FR-4.1: URL Extraction**
- MUST use existing `extractVideoId` function for video URL processing
- MUST use existing `extractChannelId` function for channel URL processing
- MUST support all documented YouTube URL formats
- MUST return null for unparseable URLs (handled by error system)

**FR-4.2: ID Validation**
- MUST leverage existing `VideoId` and `ChannelId` branded types
- MUST apply pattern validation for ID format compliance
- MUST use existing `YoutubeVideoUrl` and `YoutubeChannelUrl` schemas for input flexibility
- MUST provide clear validation error messages

### 5. Configuration Management

**FR-5.1: API Key Configuration**
- MUST require `YOUTUBE_API_KEY` environment variable
- MUST fail fast on missing or invalid API key configuration
- MUST use Effect Config system for environment variable management
- MUST not expose API key in logs or error messages

**FR-5.2: Request Configuration**
- MUST support configurable request timeouts (default: 30 seconds)
- MUST support configurable retry attempts (default: 3)
- MUST support configurable retry delays (exponential backoff)
- MUST allow per-request configuration overrides

## Non-Functional Requirements

### 6. Error Handling and Resilience

**NFR-6.1: Error Classification**
- MUST define `YoutubeApiError` tagged error type with specific error categories:
  - `InvalidUrl`: URLs that cannot be parsed or lack valid IDs
  - `ApiError`: HTTP error responses from YouTube API (4xx, 5xx)
  - `NetworkError`: Connection failures, timeouts, DNS issues
  - `ValidationError`: Response data not matching expected schema
  - `ConfigurationError`: Missing or invalid configuration

**NFR-6.2: Error Propagation**
- MUST propagate errors through Effect error channel
- MUST preserve original error cause information where applicable
- MUST provide actionable error messages for debugging
- MUST distinguish between recoverable and non-recoverable errors

**NFR-6.3: Retry Logic**
- MUST implement exponential backoff for transient failures
- MUST respect YouTube API rate limiting (HTTP 429)
- MUST limit retry attempts to prevent infinite loops
- MUST not retry for non-transient errors (4xx except 429)

### 7. Performance and Efficiency

**NFR-7.1: HTTP Client Efficiency**
- MUST reuse HTTP connections via FetchHttpClient
- MUST support concurrent requests for batch operations
- MUST implement request deduplication for identical concurrent requests
- MUST minimize request payload size and maximize response caching headers

**NFR-7.2: Memory Management**
- MUST stream large responses where applicable
- MUST limit memory usage for batch operations
- MUST clean up resources properly on request cancellation
- MUST avoid memory leaks in long-running applications

### 8. Type Safety and Validation

**NFR-8.1: Compile-Time Safety**
- MUST leverage Effect type system for compile-time error checking
- MUST use branded types for all YouTube resource IDs
- MUST provide full type information for all public APIs
- MUST ensure no `any` or `unknown` types in public interface

**NFR-8.2: Runtime Validation**
- MUST validate all API requests using Effect Schema
- MUST validate all API responses using Effect Schema
- MUST provide detailed validation error information
- MUST fail fast on schema validation errors

### 9. Observability and Debugging

**NFR-9.1: Logging and Tracing**
- MUST support Effect logging for request/response debugging
- MUST log error conditions with appropriate severity levels
- MUST support Effect tracing for request flow analysis
- MUST not log sensitive information (API keys, personal data)

**NFR-9.2: Metrics and Monitoring**
- SHOULD provide request duration metrics
- SHOULD provide error rate metrics by error type
- SHOULD provide API quota usage tracking
- SHOULD support health check endpoints

### 10. Testing and Quality Assurance

**NFR-10.1: Test Coverage**
- MUST achieve >90% code coverage for all public APIs
- MUST test all error scenarios and edge cases
- MUST test concurrent request handling
- MUST test configuration validation and error cases

**NFR-10.2: Test Infrastructure**
- MUST provide mock HTTP client for unit testing
- MUST provide realistic test data for all supported resources
- MUST support integration testing with real API (optional)
- MUST provide performance benchmarking capabilities

**NFR-10.3: Test Scenarios**
- MUST test valid video/channel fetching operations
- MUST test invalid URL handling and error propagation
- MUST test API error responses (403, 404, 429, 500, etc.)
- MUST test network failure scenarios
- MUST test schema validation failures
- MUST test configuration error handling
- MUST test retry logic and backoff behavior

### 11. Security Requirements

**NFR-11.1: API Key Protection**
- MUST not expose API key in client-side code
- MUST not log API key in any circumstances
- MUST validate API key format before use
- MUST handle API key expiration gracefully

**NFR-11.2: Input Validation**
- MUST validate all user-provided URLs before processing
- MUST sanitize error messages to prevent information disclosure
- MUST rate limit client-side requests to prevent abuse
- MUST validate response data integrity

### 12. Compatibility and Standards

**NFR-12.1: Effect Ecosystem Integration**
- MUST follow Effect coding patterns and conventions
- MUST integrate with Effect configuration system
- MUST support Effect context propagation
- MUST be compatible with Effect runtime environments

**NFR-12.2: Platform Compatibility**
- MUST work with Bun runtime (primary platform)
- MUST work with Node.js runtime (testing platform)
- MUST support both ESM and CJS module systems
- MUST maintain compatibility with TypeScript strict mode

**NFR-12.3: YouTube API Compliance**
- MUST comply with YouTube Data API v3 terms of service
- MUST respect API quotas and rate limits
- MUST handle API versioning and deprecation notices
- MUST follow YouTube API best practices for batch requests

## Constraints and Assumptions

### 13. Technical Constraints

**TC-13.1: Dependencies**
- MUST use only approved project dependencies
- MUST not introduce new external HTTP client libraries
- MUST work within existing Effect ecosystem constraints
- MUST maintain compatibility with existing schema definitions

**TC-13.2: Resource Limitations**
- MUST respect YouTube API quota limits (10,000 units/day default)
- MUST handle API rate limiting gracefully
- MUST limit concurrent request count to prevent overwhelming API
- MUST optimize request efficiency to minimize quota usage

### 14. Assumptions

**AS-14.1: API Stability**
- ASSUMES YouTube Data API v3 maintains backward compatibility
- ASSUMES existing video/channel resource schemas remain stable
- ASSUMES URL extraction patterns remain consistent
- ASSUMES API error response formats remain consistent

**AS-14.2: Environment**
- ASSUMES reliable internet connectivity for API requests
- ASSUMES API key will be provided via secure configuration
- ASSUMES server environment supports HTTPS requests
- ASSUMES sufficient system resources for concurrent operations

**AS-14.3: Usage Patterns**
- ASSUMES moderate request volume (within API quotas)
- ASSUMES mixed single/batch operation usage
- ASSUMES error handling is critical for user experience
- ASSUMES observability is important for production deployment

## Acceptance Criteria

### 15. Functional Acceptance

- All video operations (single, batch, by URL) work correctly
- All channel operations (single, batch, by URL) work correctly
- URL extraction handles all documented YouTube URL formats
- Error handling covers all defined error scenarios
- Configuration management works with environment variables

### 16. Quality Acceptance

- Test coverage >90% for all public APIs
- No compile-time type errors in strict TypeScript mode
- All error scenarios properly tested and documented
- Performance benchmarks within acceptable ranges
- Security review passes with no critical issues

### 17. Integration Acceptance

- Works correctly with FetchHttpClient in production
- Integrates properly with Effect configuration system
- Error propagation works through Effect error channels
- Observability features function correctly in test environment
- Documentation is complete and accurate
# Domain & Ingestion Package Test Plan

## Executive Summary

This test plan outlines a comprehensive testing strategy for the `@puredialog/domain` and `@puredialog/ingestion` packages. The focus is on validating critical functionality including schema validation, error handling, data transformation, service integration, retry mechanisms, and Effect pattern compliance using `@effect/vitest`.

**Critical Testing Priorities:**
1. **Service Layer Testing** - Layer composition, dependency injection, and service lifecycle
2. **Effect Matching & Retrying** - Pattern matching, retry schedules, and failure recovery
3. **Schema Validation & Data Integrity** - Type safety, transformation accuracy, and edge cases
4. **Error Handling & Propagation** - Tagged errors, error transformation, and recovery strategies

## Critical Testing Priorities

### 1. Service Layer Testing (Priority: CRITICAL)

**Layer Composition & Dependency Injection:**
```typescript
// Service layer composition testing
describe("Service Layer Composition", () => {
  it.effect("composes layers correctly with dependency injection", () =>
    Effect.gen(function*() {
      // Test that layers provide services in correct order
      const service = yield* TestService

      // Verify service has all required dependencies
      const dep1 = yield* TestDependency1
      const dep2 = yield* TestDependency2

      // Test service behavior with mocked dependencies
      const result = yield* service.doSomething()
      assert.strictEqual(result, "expected result")
    }).pipe(
      Effect.provide(TestServiceLive),
      Effect.provide(TestDependency1Live),
      Effect.provide(TestDependency2Live)
    )
  )

  it.effect("handles layer dependency resolution failures", () =>
    Effect.gen(function*() {
      // Test missing dependency scenarios
      const result = yield* Effect.exit(
        Effect.gen(function*() {
          return yield* TestService
        }).pipe(
          Effect.provide(TestServiceLive)
          // Missing TestDependency1Live - should fail
        )
      )

      assert.isTrue(result._tag === "Failure")
    })
  )
})
```

**Service Lifecycle Management:**
```typescript
describe("Service Lifecycle", () => {
  it.effect("manages resource acquisition and cleanup", () =>
    Effect.gen(function*() {
      const resources: Array<string> = []

      // Test scoped resources
      const result = yield* Effect.acquireUseRelease(
        Effect.sync(() => {
          resources.push("acquired")
          return "resource"
        }),
        (resource) => Effect.sync(() => {
          resources.push("used")
          return resource
        }),
        () => Effect.sync(() => {
          resources.push("released")
        })
      )

      assert.strictEqual(result, "resource")
      assert.deepStrictEqual(resources, ["acquired", "used", "released"])
    })
  )

  it.effect("handles resource cleanup on failure", () =>
    Effect.gen(function*() {
      const resources: Array<string> = []

      const result = yield* Effect.exit(
        Effect.acquireUseRelease(
          Effect.sync(() => {
            resources.push("acquired")
            return "resource"
          }),
          () => Effect.fail("operation failed"),
          () => Effect.sync(() => {
            resources.push("released")
          })
        )
      )

      assert.isTrue(result._tag === "Failure")
      assert.deepStrictEqual(resources, ["acquired", "released"])
    })
  )
})
```

**Service Integration Patterns:**
```typescript
describe("Service Integration", () => {
  it.effect("integrates multiple services with proper error handling", () =>
    Effect.gen(function*() {
      // Test complex service interactions
      const serviceA = yield* ServiceA
      const serviceB = yield* ServiceB

      // Mock external dependencies
      const mockResult = yield* serviceA.callExternalService()
      const processedResult = yield* serviceB.processResult(mockResult)

      assert.strictEqual(processedResult.status, "processed")
    }).pipe(
      Effect.provide(ServiceALive),
      Effect.provide(ServiceBLive)
    )
  )

  it.effect("handles cascading service failures", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(
        Effect.gen(function*() {
          const serviceA = yield* ServiceA
          const serviceB = yield* ServiceB

          // ServiceA succeeds, ServiceB fails
          yield* serviceA.doWork()
          return yield* serviceB.failingOperation()
        }).pipe(
          Effect.provide(ServiceALive),
          Effect.provide(ServiceBFailingLive)
        )
      )

      assert.isTrue(result._tag === "Failure")
      // Verify error contains context from both services
    })
  )
})
```

### 2. Effect Matching & Retrying Patterns (Priority: CRITICAL)

**Pattern Matching Testing:**
```typescript
describe("Effect Pattern Matching", () => {
  it.effect("tests matchEffect with success and failure handlers", () =>
    Effect.gen(function*() {
      const fallibleEffect = Effect.succeed(42)

      const result = yield* Effect.matchEffect(fallibleEffect, {
        onFailure: (error) => Effect.succeed(`Failed: ${error.message}`),
        onSuccess: (value) => Effect.succeed(`Success: ${value}`)
      })

      assert.strictEqual(result, "Success: 42")
    })
  )

  it.effect("tests matchEffect error handling", () =>
    Effect.gen(function*() {
      const failingEffect = Effect.fail("test error")

      const result = yield* Effect.matchEffect(failingEffect, {
        onFailure: (error) => Effect.succeed(`Handled: ${error}`),
        onSuccess: (value) => Effect.succeed(`Unexpected: ${value}`)
      })

      assert.strictEqual(result, "Handled: test error")
    })
  )

  it.effect("tests matchCause for complete failure analysis", () =>
    Effect.gen(function*() {
      const defectEffect = Effect.die("unexpected error")

      const result = yield* Effect.matchCause(defectEffect, {
        onFailure: (cause) => Effect.succeed("handled failure"),
        onSuccess: (value) => Effect.succeed("unexpected success"),
        onDie: (defect) => Effect.succeed(`handled defect: ${defect}`)
      })

      assert.strictEqual(result, "handled defect: unexpected error")
    })
  )
})
```

**Retry Schedule Testing:**
```typescript
describe("Retry Schedule Testing", () => {
  it.effect("tests exponential backoff retry policy", () =>
    Effect.gen(function*() {
      const attempts: Array<number> = []

      const retryPolicy = Schedule.exponential(Duration.millis(10)).pipe(
        Schedule.compose(Schedule.recurs(3)),
        Schedule.tapInput((attempt) => Effect.sync(() => {
          attempts.push(attempt)
        }))
      )

      const result = yield* Effect.retry(
        Effect.fail("temporary error"),
        retryPolicy
      ).pipe(
        Effect.catchAll(() => Effect.succeed("max retries reached"))
      )

      assert.strictEqual(result, "max retries reached")
      assert.deepStrictEqual(attempts, [0, 1, 2, 3]) // 4 total attempts
    })
  )

  it.effect("tests conditional retry with retryWhile", () =>
    Effect.gen(function*() {
      let attemptCount = 0

      const retryableErrors = ["503", "502", "504"]
      const nonRetryableErrors = ["400", "401", "403"]

      const operation = Effect.sync(() => {
        attemptCount++
        const error = attemptCount <= 2 ? "503" : "400"
        return Effect.fail(error)
      })

      const result = yield* Effect.retryWhile(
        operation,
        (error) => retryableErrors.includes(error),
        Schedule.recurs(3)
      ).pipe(
        Effect.catchAll((error) => Effect.succeed(`final error: ${error}`))
      )

      assert.strictEqual(result, "final error: 400")
      assert.strictEqual(attemptCount, 3) // Should retry 2 times for 503, then fail on 400
    })
  )

  it.effect("tests retry with TestClock for deterministic timing", () =>
    Effect.gen(function*() {
      const clock = yield* TestClock.TestClock

      const startTime = yield* clock.currentTimeMillis

      const result = yield* Effect.retry(
        Effect.fail("retry me"),
        Schedule.fixed(Duration.seconds(1)).pipe(Schedule.recurs(2))
      ).pipe(
        Effect.catchAll(() => Effect.succeed("max retries reached"))
      )

      const endTime = yield* clock.currentTimeMillis
      const elapsed = endTime - startTime

      assert.strictEqual(result, "max retries reached")
      assert.isAtLeast(elapsed, 2000) // Should have waited 2 seconds total
    })
  )
})
```

**Advanced Retry Scenarios:**
```typescript
describe("Advanced Retry Scenarios", () => {
  it.effect("tests retry with jitter for concurrent operations", () =>
    Effect.gen(function*() {
      const operations = Array.range(1, 10).map((id) =>
        Effect.retry(
          Effect.fail(`error-${id}`),
          Schedule.exponential(Duration.millis(10), 2).pipe(
            Schedule.jittered,
            Schedule.recurs(2)
          )
        ).pipe(
          Effect.catchAll((error) => Effect.succeed(`handled-${error}`))
        )
      )

      const results = yield* Effect.all(operations)
      assert.strictEqual(results.length, 10)
      // Verify jitter prevented thundering herd
    })
  )

  it.effect("tests retryUntil with success condition", () =>
    Effect.gen(function*() {
      let attempts = 0

      const result = yield* Effect.retryUntil(
        Effect.sync(() => {
          attempts++
          return attempts >= 3 ? "success" : Effect.fail("not ready")
        }),
        (result) => result === "success",
        Schedule.recurs(5)
      )

      assert.strictEqual(result, "success")
      assert.strictEqual(attempts, 3)
    })
  )

  it.effect("tests retry with custom Schedule.whileInput", () =>
    Effect.gen(function*() {
      const results: Array<string> = []

      const operation = Effect.sync(() => {
        results.push("operation executed")
        return Effect.fail("keep retrying")
      })

      const schedule = Schedule.whileInput(
        (input: string) => input === "keep retrying",
        Schedule.recurs(3)
      )

      const result = yield* Effect.retry(operation, schedule).pipe(
        Effect.catchAll(() => Effect.succeed("stopped retrying"))
      )

      assert.strictEqual(result, "stopped retrying")
      assert.strictEqual(results.length, 4) // Initial + 3 retries
    })
  )
})
```

### 3. Schema Validation & Data Integrity (Priority: CRITICAL)

**Domain Package Core Schemas:**
- `YouTubeVideoId` and `YouTubeChannelId` validation
- `MediaResource` discriminated unions
- `TranscriptionJob` entity validation
- `LanguageCode` and branded types
- Error schema validation

**Key Test Scenarios:**
- Valid and invalid YouTube video/channel ID patterns
- URL parsing and validation edge cases
- Schema transformation between API and domain types
- Branded type safety enforcement
- Optional field handling in complex schemas

### 4. Error Handling & Propagation (Priority: HIGH)

**TaggedError Testing:**
```typescript
describe("TaggedError Testing", () => {
  it.effect("tests MediaResourceError construction and properties", () =>
    Effect.gen(function*() {
      const error = new MediaResourceError({
        message: "Failed to fetch video metadata",
        source: "youtube",
        resourceId: "dQw4w9WgXcQ",
        httpStatus: 404
      })

      assert.strictEqual(error.message, "Failed to fetch video metadata")
      assert.strictEqual(error.source, "youtube")
      assert.strictEqual(error.resourceId, "dQw4w9WgXcQ")
      assert.strictEqual(error.httpStatus, 404)
      assert.strictEqual(error._tag, "MediaResourceError")
    })
  )

  it.effect("tests TranscriptionError phase tracking", () =>
    Effect.gen(function*() {
      const error = new TranscriptionError({
        message: "LLM processing failed",
        jobId: JobId.make("test-job"),
        phase: "processing",
        retryable: true,
        attempt: 2
      })

      assert.strictEqual(error.phase, "processing")
      assert.isTrue(error.retryable)
      assert.strictEqual(error.attempt, 2)
      assert.strictEqual(error.jobId, "test-job")
    })
  )

  it.effect("tests error equality and hashing", () =>
    Effect.gen(function*() {
      const error1 = new MediaResourceError({
        message: "test error",
        source: "youtube"
      })
      const error2 = new MediaResourceError({
        message: "test error",
        source: "youtube"
      })
      const error3 = new MediaResourceError({
        message: "different error",
        source: "youtube"
      })

      // Test structural equality
      assert.isTrue(Equal.equals(error1, error2))
      assert.isFalse(Equal.equals(error1, error3))

      // Test hashing for Hash-based collections
      const hashSet = HashSet.make(error1, error2, error3)
      assert.strictEqual(HashSet.size(hashSet), 2) // error1 and error2 are equal
    })
  )
})
```

**Error Propagation Testing:**
```typescript
describe("Error Propagation", () => {
  it.effect("tests error propagation through Effect chains", () =>
    Effect.gen(function*() {
      const operation = Effect.gen(function*() {
        const step1 = yield* Effect.tryPromise({
          try: () => Promise.resolve("step1 result"),
          catch: (error) => new ProcessingError({ message: String(error) })
        })

        const step2 = yield* Effect.tryPromise({
          try: () => Promise.reject(new Error("step2 failed")),
          catch: (error) => new ProcessingError({ message: String(error) })
        })

        return `${step1}-${step2}`
      })

      const result = yield* Effect.exit(operation)
      assert.isTrue(result._tag === "Failure")

      const error = result.cause
      // Verify error contains context from both steps
    })
  )

  it.effect("tests error transformation between layers", () =>
    Effect.gen(function*() {
      const serviceError = Effect.fail(new ServiceError({
        message: "Database connection failed",
        service: "postgres"
      }))

      const transformed = serviceError.pipe(
        Effect.mapError((error) => new PublicError({
          message: "Service temporarily unavailable",
          errorCode: "SERVICE_UNAVAILABLE"
        }))
      )

      const result = yield* Effect.exit(transformed)
      assert.isTrue(result._tag === "Failure")

      if (result._tag === "Failure") {
        const error = result.cause
        assert.strictEqual(error.errorCode, "SERVICE_UNAVAILABLE")
      }
    })
  )
})
```

**Error Recovery Testing:**
```typescript
describe("Error Recovery", () => {
  it.effect("tests catchTag with specific error types", () =>
    Effect.gen(function*() {
      const operation = Effect.fail(new ValidationError({
        message: "Invalid input format",
        field: "email"
      }))

      const recovered = operation.pipe(
        Effect.catchTag("ValidationError", (error) =>
          Effect.succeed(`Validation failed for ${error.field}`)
        ),
        Effect.catchTag("NetworkError", (error) =>
          Effect.succeed("Network issue resolved")
        )
      )

      const result = yield* recovered
      assert.strictEqual(result, "Validation failed for email")
    })
  )

  it.effect("tests catchAll for comprehensive error handling", () =>
    Effect.gen(function*() {
      const operation = Effect.fail(new UnexpectedError({
        message: "Something unexpected happened"
      }))

      const recovered = operation.pipe(
        Effect.catchAll((error) =>
          Effect.succeed(`Error handled: ${error.message}`)
        )
      )

      const result = yield* recovered
      assert.strictEqual(result, "Error handled: Something unexpected happened")
    })
  )

  it.effect("tests fallback strategies with orElse", () =>
    Effect.gen(function*() {
      const primary = Effect.fail("Primary operation failed")
      const fallback = Effect.succeed("Fallback result")

      const result = yield* primary.pipe(Effect.orElse(() => fallback))
      assert.strictEqual(result, "Fallback result")
    })
  )
})
```

### 5. Testing Framework Selection (Priority: HIGH)

**@effect/vitest Framework Usage:**
```typescript
describe("Testing Framework Selection", () => {
  it.effect("demonstrates @effect/vitest for Effect-based testing", () =>
    Effect.gen(function*() {
      // Use @effect/vitest for Effect-based code
      const service = yield* TestService
      const result = yield* service.doEffectfulOperation()

      assert.strictEqual(result, "expected result")
    }).pipe(
      Effect.provide(TestServiceLive)
    )
  )

  it("demonstrates regular vitest for pure functions", () => {
    // Use regular vitest for pure TypeScript functions
    const result = pureFunction("input")
    assert.strictEqual(result, "expected output")
  })

  it.effect("tests service integration with proper mocking", () =>
    Effect.gen(function*() {
      // Mock external dependencies
      const mockClient = {
        callExternalApi: () => Effect.succeed("mock response")
      }

      const service = yield* TestService
      const result = yield* service.processWithExternalCall()

      assert.strictEqual(result, "processed mock response")
    }).pipe(
      Effect.provideService(ExternalClient, mockClient),
      Effect.provide(TestServiceLive)
    )
  )
})
```

**Test Utilities and Helpers:**
```typescript
describe("Test Utilities", () => {
  it.effect("uses TestClock for deterministic time testing", () =>
    Effect.gen(function*() {
      const clock = yield* TestClock.TestClock

      // Set specific time for testing
      yield* clock.setTime(new Date("2024-01-01T10:00:00Z"))

      const timeSensitiveOperation = Effect.gen(function*() {
        const currentTime = yield* Clock.currentTimeMillis
        return currentTime > Date.now() - 1000 // Should be true
      })

      const result = yield* timeSensitiveOperation
      assert.isTrue(result)

      // Advance time and test again
      yield* clock.advanceBy(Duration.minutes(5))
      const laterResult = yield* timeSensitiveOperation
      assert.isFalse(laterResult)
    })
  )

  it.effect("uses TestServices for service mocking", () =>
    Effect.gen(function*() {
      // Create test implementation
      const testImplementation = {
        getData: () => Effect.succeed("test data"),
        processData: (input: string) => Effect.succeed(`processed: ${input}`)
      }

      const result = yield* Effect.gen(function*() {
        const service = yield* TestService
        const data = yield* service.getData()
        return yield* service.processData(data)
      }).pipe(
        Effect.provideService(TestService, testImplementation)
      )

      assert.strictEqual(result, "processed: test data")
    })
  )
})
```

**Concurrent and Parallel Testing:**
```typescript
describe("Concurrent Testing", () => {
  it.effect("tests concurrent operations with proper isolation", () =>
    Effect.gen(function*() {
      const operations = Array.range(1, 10).map((id) =>
        Effect.gen(function*() {
          // Simulate concurrent database operations
          const result = yield* Effect.sleep(Duration.millis(id * 10))
          return `completed-${id}`
        })
      )

      const results = yield* Effect.all(operations, { concurrency: 3 })
      assert.strictEqual(results.length, 10)
      assert.deepStrictEqual(results.sort(), Array.range(1, 10).map(id => `completed-${id}`))
    })
  )

  it.effect("tests race conditions and timing dependencies", () =>
    Effect.gen(function*() {
      const clock = yield* TestClock.TestClock

      const fastOperation = Effect.succeed("fast").pipe(
        Effect.delay(Duration.millis(50))
      )
      const slowOperation = Effect.succeed("slow").pipe(
        Effect.delay(Duration.millis(100))
      )

      const result = yield* Effect.race(fastOperation, slowOperation)
      assert.strictEqual(result, "fast")
    })
  )
})
```

### 6. Data Transformation & Adapters (Priority: HIGH)

**YouTube Adapter Critical Paths:**
```typescript
describe("YouTube Adapter Transformation", () => {
  it.effect("transforms complete API video to domain successfully", () =>
    Effect.gen(function*() {
      const apiVideo = {
        id: "dQw4w9WgXcQ",
        snippet: {
          title: "Test Video",
          description: "Test description",
          publishedAt: "2024-01-01T00:00:00Z",
          channelId: "UCtest12345678901234567890",
          channelTitle: "Test Channel",
          thumbnails: {
            default: { url: "https://example.com/thumb.jpg", width: 120, height: 90 }
          },
          tags: ["test", "video"]
        },
        contentDetails: {
          duration: "PT30M0S"
        },
        statistics: {
          viewCount: "1000",
          likeCount: "100",
          commentCount: "10"
        }
      }

      const adapter = yield* YouTubeAdapter
      const domainVideo = yield* adapter.toDomainVideo(apiVideo)

      assert.strictEqual(domainVideo.id, "dQw4w9WgXcQ")
      assert.strictEqual(domainVideo.title, "Test Video")
      assert.strictEqual(domainVideo.duration, 1800) // 30 minutes in seconds
      assert.strictEqual(domainVideo.viewCount, 1000)
      assert.strictEqual(domainVideo.likeCount, 100)
      assert.strictEqual(domainVideo.commentCount, 10)
      assert.strictEqual(domainVideo.publishedAt.getTime(), new Date("2024-01-01T00:00:00Z").getTime())
    })
  )

  it.effect("handles missing optional fields gracefully", () =>
    Effect.gen(function*() {
      const minimalApiVideo = {
        id: "dQw4w9WgXcQ",
        snippet: {
          title: "Test Video",
          publishedAt: "2024-01-01T00:00:00Z",
          channelId: "UCtest12345678901234567890"
        },
        contentDetails: {
          duration: "PT30M0S"
        }
        // Missing statistics, description, tags, thumbnails
      }

      const adapter = yield* YouTubeAdapter
      const domainVideo = yield* adapter.toDomainVideo(minimalApiVideo)

      assert.strictEqual(domainVideo.id, "dQw4w9WgXcQ")
      assert.strictEqual(domainVideo.title, "Test Video")
      assert.strictEqual(domainVideo.duration, 1800)
      assert.strictEqual(domainVideo.viewCount, 0) // Default value
      assert.strictEqual(domainVideo.likeCount, 0) // Default value
    })
  )

  it.effect("validates duration parsing edge cases", () =>
    Effect.gen(function*() {
      const testCases = [
        { input: "PT30M0S", expected: 1800 },
        { input: "PT1H30M0S", expected: 5400 },
        { input: "PT30S", expected: 30 },
        { input: "P1DT1H30M0S", expected: 91800 } // 1 day + 1 hour + 30 min
      ]

      for (const { input, expected } of testCases) {
        const apiVideo = {
          id: "test",
          snippet: { title: "Test", publishedAt: "2024-01-01T00:00:00Z", channelId: "UCtest" },
          contentDetails: { duration: input }
        }

        const adapter = yield* YouTubeAdapter
        const domainVideo = yield* adapter.toDomainVideo(apiVideo)
        assert.strictEqual(domainVideo.duration, expected)
      }
    })
  )
})
```

**Schema Transformation Testing:**
```typescript
describe("Schema Transformation", () => {
  it.effect("tests MediaResource discriminated union encoding/decoding", () =>
    Effect.gen(function*() {
      const youtubeResource = YouTubeVideoResource.make({
        type: "youtube",
        id: MediaResourceId.make("test-id"),
        metadata: MediaMetadata.make({
          mediaResourceId: MediaResourceId.make("test-id"),
          jobId: JobId.make("test-job"),
          title: "Test Video",
          format: "one_on_one_interview",
          language: LanguageCode.make("en"),
          speakerCount: 1,
          durationSec: 1800,
          createdAt: new Date(),
          tags: ["test"],
          domain: ["technology"],
          speakers: [{ role: "host" }],
          links: []
        }),
        data: YouTubeVideo.make({
          id: YouTubeVideoId.make("dQw4w9WgXcQ"),
          title: "Test Video",
          description: "Test description",
          publishedAt: new Date(),
          channelId: YouTubeChannelId.make("UCtest12345678901234567890"),
          channelTitle: "Test Channel",
          thumbnails: [],
          duration: 1800,
          viewCount: 1000,
          likeCount: 100,
          commentCount: 10,
          tags: ["test"]
        })
      })

      // Test encoding to JSON
      const encoded = yield* Schema.encode(MediaResource)(youtubeResource)
      assert.strictEqual(encoded.type, "youtube")
      assert.strictEqual(encoded.data.id, "dQw4w9WgXcQ")

      // Test decoding from JSON
      const decoded = yield* Schema.decode(MediaResource)(encoded)
      assert.deepStrictEqual(decoded, youtubeResource)
    })
  )

  it.effect("tests error handling in schema transformations", () =>
    Effect.gen(function*() {
      const invalidData = {
        type: "invalid-type",
        data: { id: "test" }
      }

      const result = yield* Effect.exit(
        Schema.decode(MediaResource)(invalidData)
      )

      assert.isTrue(result._tag === "Failure")
      // Verify specific schema validation error
    })
  )
})
```

### 7. Service Integration & Dependency Injection (Priority: HIGH)

**Service Layer Testing:**
```typescript
describe("Service Integration", () => {
  it.effect("tests YouTubeService orchestration of client and adapter", () =>
    Effect.gen(function*() {
      // Mock the YouTube API client
      const mockClient = {
        getVideoRaw: () => Effect.succeed(mockApiVideo),
        getChannelRaw: () => Effect.succeed(mockApiChannel)
      }

      // Mock the adapter
      const mockAdapter = {
        toDomainVideo: () => Effect.succeed(mockDomainVideo),
        toDomainChannel: () => Effect.succeed(mockDomainChannel)
      }

      const service = yield* YouTubeService
      const video = yield* service.getVideo("dQw4w9WgXcQ")
      const channel = yield* service.getChannel("UCtest12345678901234567890")

      assert.deepStrictEqual(video, mockDomainVideo)
      assert.deepStrictEqual(channel, mockDomainChannel)
    }).pipe(
      Effect.provideService(YouTubeApiClient, mockClient),
      Effect.provideService(YouTubeAdapter, mockAdapter),
      Effect.provide(YouTubeServiceLive)
    )
  )

  it.effect("tests service error handling and propagation", () =>
    Effect.gen(function*() {
      const failingClient = {
        getVideoRaw: () => Effect.fail(new YouTubeApiError({
          message: "API rate limit exceeded",
          errorCode: "QUOTA_EXCEEDED",
          retryable: true
        }))
      }

      const result = yield* Effect.exit(
        YouTubeService.getVideo("dQw4w9WgXcQ").pipe(
          Effect.provideService(YouTubeApiClient, failingClient),
          Effect.provide(YouTubeServiceLive)
        )
      )

      assert.isTrue(result._tag === "Failure")
      if (result._tag === "Failure") {
        assert.strictEqual(result.cause.errorCode, "QUOTA_EXCEEDED")
        assert.isTrue(result.cause.retryable)
      }
    })
  )

  it.effect("tests service layer composition with multiple dependencies", () =>
    Effect.gen(function*() {
      const mockServices = {
        [YouTubeApiClient.key]: {
          getVideoRaw: () => Effect.succeed(mockApiVideo)
        },
        [YouTubeAdapter.key]: {
          toDomainVideo: () => Effect.succeed(mockDomainVideo)
        },
        [MetadataEnricher.key]: {
          enrichMetadata: () => Effect.succeed(mockEnrichedMetadata)
        }
      }

      const result = yield* ComplexService.processVideo("dQw4w9WgXcQ").pipe(
        Effect.provideService(YouTubeApiClient, mockServices[YouTubeApiClient.key]),
        Effect.provideService(YouTubeAdapter, mockServices[YouTubeAdapter.key]),
        Effect.provideService(MetadataEnricher, mockServices[MetadataEnricher.key]),
        Effect.provide(ComplexServiceLive)
      )

      assert.strictEqual(result.status, "processed")
    })
  )
})
```

**Layer Composition Testing:**
```typescript
describe("Layer Composition", () => {
  it.effect("tests proper layer dependency resolution", () =>
    Effect.gen(function*() {
      // Test that layers provide services in correct order
      const serviceA = yield* ServiceA
      const serviceB = yield* ServiceB
      const serviceC = yield* ServiceC

      // Verify all services are available
      assert.isDefined(serviceA)
      assert.isDefined(serviceB)
      assert.isDefined(serviceC)

      // Test that dependencies are properly injected
      const result = yield* serviceA.doWork()
      assert.strictEqual(result, "work completed")
    }).pipe(
      Effect.provide(ServiceALive),
      Effect.provide(ServiceBLive),
      Effect.provide(ServiceCLive)
    )
  )

  it.effect("tests layer scoping and resource cleanup", () =>
    Effect.gen(function*() {
      const resources: Array<string> = []

      const scopedService = Layer.scoped(
        ServiceA,
        Effect.acquireUseRelease(
          Effect.sync(() => {
            resources.push("acquired")
            return { doWork: () => Effect.succeed("work done") }
          }),
          (service) => Effect.succeed(service),
          () => Effect.sync(() => {
            resources.push("released")
          })
        )
      )

      const result = yield* Effect.gen(function*() {
        const service = yield* ServiceA
        return yield* service.doWork()
      }).pipe(
        Effect.provide(scopedService)
      )

      assert.strictEqual(result, "work done")
      assert.deepStrictEqual(resources, ["acquired", "released"])
    })
  )
})
```
- PubSub message encoding/decoding
- Configuration validation and injection
- Layer composition and service provision
- Resource cleanup and lifecycle management

### 8. Integration Tests (20% Coverage Target)

**PubSub Message Flow Tests:**
```typescript
describe("PubSub Integration", () => {
  it.effect("tests message encoding and decoding roundtrip", () =>
    Effect.gen(function*() {
      const originalJob = TranscriptionJob.make({
        id: JobId.make("test-job"),
        requestId: RequestId.make("test-request"),
        media: YouTubeVideoResource.make({
          type: "youtube",
          id: MediaResourceId.make("test-media"),
          metadata: MediaMetadata.make({
            mediaResourceId: MediaResourceId.make("test-media"),
            jobId: JobId.make("test-job"),
            title: "Test Video",
            format: "one_on_one_interview",
            language: LanguageCode.make("en"),
            speakerCount: 1,
            durationSec: 1800,
            createdAt: new Date(),
            tags: ["test"],
            domain: ["technology"],
            speakers: [{ role: "host" }],
            links: []
          }),
          data: YouTubeVideo.make({
            id: YouTubeVideoId.make("dQw4w9WgXcQ"),
            title: "Test Video",
            description: "Test description",
            publishedAt: new Date(),
            channelId: YouTubeChannelId.make("UCtest12345678901234567890"),
            channelTitle: "Test Channel",
            thumbnails: [],
            duration: 1800,
            viewCount: 1000,
            likeCount: 100,
            commentCount: 10,
            tags: ["test"]
          })
        }),
        status: JobStatus.make("queued"),
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Encode to message format
      const encoded = yield* encodeWorkMessage(originalJob)

      // Decode from message format
      const decoded = yield* decodeWorkMessage(encoded)

      assert.deepStrictEqual(decoded, originalJob)
    })
  )

  it.effect("tests domain event encoding/decoding", () =>
    Effect.gen(function*() {
      const originalEvent = JobStatusChanged.make({
        jobId: JobId.make("test-job"),
        fromStatus: JobStatus.make("queued"),
        toStatus: JobStatus.make("processing"),
        timestamp: new Date(),
        correlationId: "test-correlation"
      })

      const encoded = yield* encodeDomainEvent(originalEvent)
      const decoded = yield* decodeDomainEvent(encoded)

      assert.deepStrictEqual(decoded, originalEvent)
      assert.strictEqual(decoded.correlationId, "test-correlation")
    })
  )
})
```

**Configuration Integration:**
```typescript
describe("Configuration Integration", () => {
  it.effect("tests configuration validation and injection", () =>
    Effect.gen(function*() {
      // Test with valid configuration
      const validConfig = {
        YOUTUBE_API_KEY: "test-api-key",
        DATABASE_URL: "postgresql://localhost:5432/test",
        PUBSUB_PROJECT_ID: "test-project"
      }

      const configLayer = Layer.effect(
        AppConfig,
        Config.all({
          youtubeApiKey: Config.string("YOUTUBE_API_KEY"),
          databaseUrl: Config.string("DATABASE_URL"),
          pubsubProjectId: Config.string("PUBSUB_PROJECT_ID")
        })
      )

      const config = yield* AppConfig.pipe(
        Effect.provide(configLayer)
      )

      assert.strictEqual(config.youtubeApiKey, "test-api-key")
      assert.strictEqual(config.databaseUrl, "postgresql://localhost:5432/test")
    })
  )

  it.effect("tests configuration validation failures", () =>
    Effect.gen(function*() {
      // Missing required configuration
      const invalidConfig = {
        YOUTUBE_API_KEY: "test-api-key"
        // Missing DATABASE_URL and PUBSUB_PROJECT_ID
      }

      const result = yield* Effect.exit(
        Config.all({
          youtubeApiKey: Config.string("YOUTUBE_API_KEY"),
          databaseUrl: Config.string("DATABASE_URL"),
          pubsubProjectId: Config.string("PUBSUB_PROJECT_ID")
        })
      )

      assert.isTrue(result._tag === "Failure")
    })
  )
})
```

### 9. End-to-End Tests (10% Coverage Target)

**Complete Workflow Testing:**
```typescript
describe("End-to-End Workflows", () => {
  it.effect("tests complete transcription job lifecycle", () =>
    Effect.gen(function*() {
      // 1. Create a new transcription job
      const jobRequest = CreateTranscriptionJobRequest.make({
        mediaResource: {
          type: "youtube",
          url: "https://youtube.com/watch?v=dQw4w9WgXcQ"
        },
        options: {
          language: "en",
          format: "one_on_one_interview"
        }
      })

      // 2. Submit job via API
      const apiResponse = yield* submitJob(jobRequest)
      assert.strictEqual(apiResponse.status, 202)

      // 3. Verify job was queued
      const queuedJob = yield* getJobStatus(apiResponse.jobId)
      assert.strictEqual(queuedJob.status, "queued")

      // 4. Simulate metadata worker processing
      yield* processMetadataJob(apiResponse.jobId)

      // 5. Verify metadata was enriched
      const metadataJob = yield* getJobStatus(apiResponse.jobId)
      assert.strictEqual(metadataJob.status, "metadata_ready")

      // 6. Simulate transcription worker processing
      yield* processTranscriptionJob(apiResponse.jobId)

      // 7. Verify transcription completed
      const finalJob = yield* getJobStatus(apiResponse.jobId)
      assert.strictEqual(finalJob.status, "completed")

      // 8. Verify transcript was created
      const transcript = yield* getTranscript(apiResponse.jobId)
      assert.isDefined(transcript)
      assert.isTrue(transcript.turns.length > 0)
    }).pipe(
      Effect.provide(APILive),
      Effect.provide(MetadataWorkerLive),
      Effect.provide(TranscriptionWorkerLive),
      Effect.provide(DatabaseLive),
      Effect.provide(PubSubLive)
    )
  )

  it.effect("tests error handling in complete workflow", () =>
    Effect.gen(function*() {
      // Test job failure scenario
      const jobRequest = CreateTranscriptionJobRequest.make({
        mediaResource: {
          type: "youtube",
          url: "https://youtube.com/watch?v=invalid-id"
        },
        options: {
          language: "en",
          format: "one_on_one_interview"
        }
      })

      const apiResponse = yield* submitJob(jobRequest)

      // Simulate processing that will fail
      yield* processFailingJob(apiResponse.jobId)

      // Verify job failed gracefully
      const failedJob = yield* getJobStatus(apiResponse.jobId)
      assert.strictEqual(failedJob.status, "failed")
      assert.isDefined(failedJob.error)
    })
  )
})
```

### 10. Testing Infrastructure Requirements

**Mock Services & Test Utilities:**
```typescript
describe("Test Infrastructure", () => {
  // Mock service factories
  export const createMockYouTubeClient = () => ({
    getVideoRaw: (id: YouTubeVideoId) => Effect.succeed(mockApiVideo),
    getChannelRaw: (id: YouTubeChannelId) => Effect.succeed(mockApiChannel)
  })

  export const createMockYouTubeAdapter = () => ({
    toDomainVideo: (apiVideo: any) => Effect.succeed(mockDomainVideo),
    toDomainChannel: (apiChannel: any) => Effect.succeed(mockDomainChannel)
  })

  export const createMockPubSubClient = () => ({
    publishWorkMessage: () => Effect.succeed("message-id"),
    publishDomainEvent: () => Effect.succeed("event-id"),
    subscribeToWorkMessages: () => Effect.succeed(mockSubscription)
  })

  // Test data factories
  export const createTestTranscriptionJob = () => TranscriptionJob.make({...})
  export const createTestMediaResource = () => YouTubeVideoResource.make({...})
  export const createTestTranscript = () => Transcript.make({...})
})
```

**Test Configuration:**
```typescript
describe("Test Configuration", () => {
  // @effect/vitest for Effect-based testing
  // Proper service layer mocking with Context.Tag
  // Time-dependent testing with TestClock
  // Error testing with Effect.exit() and Effect.flip()
  // Schema validation testing with Schema.decode/Schema.encode
  // Concurrent testing with proper isolation
  // Resource cleanup testing with scoped layers
})
```

### 11. Risk Assessment & Testing Priority

**High-Risk Areas (Test First):**
1. **Schema Validation**: Core data integrity - test all validation rules
2. **Error Handling**: System reliability and debugging - test error propagation
3. **URL/ID Parsing**: Input validation boundary - test edge cases and malformed inputs
4. **Adapter Transformations**: Data consistency across layers - test transformation accuracy
5. **Service Layer Composition**: Dependency injection correctness - test layer resolution

**Medium-Risk Areas (Test After Core):**
1. **PubSub Messaging**: Event-driven reliability - test message encoding/decoding
2. **Configuration Management**: Environment-specific behavior - test config validation
3. **Resource Management**: Memory and connection leaks - test cleanup patterns
4. **Concurrent Operations**: Race conditions and timing - test with TestClock

**Low-Risk Areas (Test As Needed):**
1. **Utility Functions**: Pure functions with clear contracts - basic unit tests
2. **Type Guards**: TypeScript compiler validation - compile-time verification
3. **Constants/Enums**: Static data validation - simple equality tests

### 12. Success Metrics

**Coverage Goals:**
- **Schema Validation**: 95%+ coverage - every schema field and validation rule
- **Error Handling**: 90%+ coverage - all error types and propagation paths
- **Data Transformation**: 85%+ coverage - all adapter methods and edge cases
- **Service Integration**: 80%+ coverage - all service interactions and dependencies
- **Retry & Matching**: 90%+ coverage - all retry schedules and pattern matching
- **Configuration**: 85%+ coverage - all config validation and injection paths

**Quality Gates:**
- All tests pass with `pnpm test`
- Type checking passes with `pnpm check`
- JSDoc examples compile with `pnpm docgen`
- Linting passes with `pnpm lint`
- No flaky tests (TestClock usage where needed)
- No test timeouts (proper async handling)

### 13. Implementation Strategy

**Phase 1: Foundation (Week 1)**
1. Set up test infrastructure and utilities
2. Implement schema validation tests
3. Create error handling test suite
4. Establish mocking patterns and test data factories

**Phase 2: Core Functionality (Week 2)**
1. YouTube ID and URL validation tests
2. Entity creation and validation tests
3. Basic adapter transformation tests
4. Service layer integration tests

**Phase 3: Advanced Patterns (Week 3)**
1. Effect matching and retrying pattern tests
2. Error propagation and recovery tests
3. Concurrent operation testing
4. Resource lifecycle management tests

**Phase 4: Integration & E2E (Week 4)**
1. PubSub message flow integration tests
2. End-to-end workflow tests
3. Configuration integration tests
4. Performance and load testing

**Phase 5: Maintenance & Enhancement (Ongoing)**
1. Regression testing for new features
2. Performance monitoring and optimization
3. Documentation and example updates
4. Continuous integration improvements

## Conclusion

This expanded test plan provides a comprehensive strategy for validating the critical functionality of the domain and ingestion packages. By focusing on service layer testing, Effect matching/retrying patterns, schema validation, and error handling, we ensure system reliability and maintainability while following Effect library best practices.

The test strategy emphasizes:
- **@effect/vitest** for Effect-based testing scenarios
- **TestClock** for deterministic time-dependent testing
- **Comprehensive mocking** for service layer isolation
- **Schema validation** for data integrity
- **Error pattern testing** for reliability
- **Integration testing** for system correctness

## Test Categories & Coverage Goals

### Unit Tests (70% Coverage Target)

#### Domain Package Units
```typescript
// Schema validation tests
describe("YouTube ID Validation", () => {
  it.effect("validates correct video ID format", () =>
    Effect.gen(function*() {
      const validId = "dQw4w9WgXcQ" as const
      const result = yield* Schema.decode(YouTubeVideoId)(validId)
      assert.strictEqual(result, validId)
    })
  )

  it.effect("rejects invalid video ID patterns", () =>
    Effect.gen(function*() {
      const invalidIds = ["short", "too_long_invalid_id", "invalid@chars"]
      for (const id of invalidIds) {
        const result = yield* Effect.exit(Schema.decode(YouTubeVideoId)(id))
        assert.isTrue(result._tag === "Failure")
      }
    })
  )
})

// URL parsing tests
describe("YouTube URL Extraction", () => {
  it.effect("extracts video ID from various URL formats", () =>
    Effect.gen(function*() {
      const testCases = [
        { url: "https://youtube.com/watch?v=dQw4w9WgXcQ", expected: "dQw4w9WgXcQ" },
        { url: "https://youtu.be/dQw4w9WgXcQ", expected: "dQw4w9WgXcQ" },
        { url: "youtube.com/embed/dQw4w9WgXcQ", expected: "dQw4w9WgXcQ" }
      ]

      for (const { url, expected } of testCases) {
        const result = yield* extractVideoId(url)
        assert.isTrue(Option.isSome(result))
        assert.strictEqual(result.value, expected)
      }
    })
  )
})
```

#### Entity Validation Tests
```typescript
// TranscriptionJob validation
describe("TranscriptionJob Entity", () => {
  it.effect("validates complete job creation", () =>
    Effect.gen(function*() {
      const job = yield* Schema.decode(TranscriptionJob)({
        id: JobId.make("test-job"),
        requestId: RequestId.make("test-request"),
        media: YouTubeVideoResource.make({
          type: "youtube",
          id: MediaResourceId.make("test-media"),
          metadata: MediaMetadata.make({
            mediaResourceId: MediaResourceId.make("test-media"),
            jobId: JobId.make("test-job"),
            title: "Test Video",
            format: "one_on_one_interview",
            language: LanguageCode.make("en"),
            speakerCount: 1,
            durationSec: 1800,
            createdAt: new Date(),
            tags: [],
            domain: [],
            speakers: [{ role: "host" }],
            links: []
          }),
          data: YouTubeVideo.make({
            id: YouTubeVideoId.make("dQw4w9WgXcQ"),
            title: "Test Video",
            description: "Test description",
            publishedAt: new Date(),
            channelId: YouTubeChannelId.make("UCtest12345678901234567890"),
            channelTitle: "Test Channel",
            thumbnails: [],
            duration: 1800,
            viewCount: 1000,
            likeCount: 100,
            commentCount: 10,
            tags: ["test"]
          })
        }),
        status: JobStatus.make("queued"),
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      assert.strictEqual(job.status, "queued")
      assert.strictEqual(job.attempts, 0)
    })
  )
})
```

#### Error Handling Tests
```typescript
// TaggedError validation
describe("Domain Error Types", () => {
  it.effect("constructs MediaResourceError with proper fields", () =>
    Effect.gen(function*() {
      const error = new MediaResourceError({
        message: "Failed to fetch video",
        source: "youtube",
        resourceId: "test-video-id"
      })

      assert.strictEqual(error.message, "Failed to fetch video")
      assert.strictEqual(error.source, "youtube")
      assert.strictEqual(error.resourceId, "test-video-id")
    })
  )

  it.effect("validates TranscriptionError phases", () =>
    Effect.gen(function*() {
      const phases: Array<"metadata" | "processing" | "parsing" | "validation"> =
        ["metadata", "processing", "parsing", "validation"]

      for (const phase of phases) {
        const error = new TranscriptionError({
          message: "Processing failed",
          jobId: JobId.make("test-job"),
          phase,
          retryable: true
        })

        assert.strictEqual(error.phase, phase)
        assert.isTrue(error.retryable)
      }
    })
  )
})
```

### Integration Tests (20% Coverage Target)

#### Adapter Integration Tests
```typescript
// YouTube adapter integration
describe("YouTubeAdapter Integration", () => {
  it.effect("transforms API video to domain successfully", () =>
    Effect.gen(function*() {
      const mockApiVideo = {
        id: "dQw4w9WgXcQ",
        snippet: {
          title: "Test Video",
          description: "Test description",
          publishedAt: "2024-01-01T00:00:00Z",
          channelId: "UCtest12345678901234567890",
          channelTitle: "Test Channel",
          thumbnails: {
            default: { url: "https://example.com/thumb.jpg", width: 120, height: 90 }
          },
          tags: ["test"]
        },
        contentDetails: {
          duration: "PT30M0S"
        },
        statistics: {
          viewCount: "1000",
          likeCount: "100",
          commentCount: "10"
        }
      }

      const adapter = yield* YouTubeAdapter
      const domainVideo = yield* adapter.toDomainVideo(mockApiVideo)

      assert.strictEqual(domainVideo.id, "dQw4w9WgXcQ")
      assert.strictEqual(domainVideo.title, "Test Video")
      assert.strictEqual(domainVideo.duration, 1800) // 30 minutes in seconds
      assert.strictEqual(domainVideo.viewCount, 1000)
    })
  )

  it.effect("handles missing required fields gracefully", () =>
    Effect.gen(function*() {
      const incompleteApiVideo = {
        id: "dQw4w9WgXcQ"
        // Missing snippet and other required fields
      }

      const adapter = yield* YouTubeAdapter
      const result = yield* Effect.exit(adapter.toDomainVideo(incompleteApiVideo))

      assert.isTrue(result._tag === "Failure")
      // Verify specific error type and message
    })
  )
})
```

#### Service Layer Tests
```typescript
// YouTube service integration
describe("YouTubeService Integration", () => {
  it.effect("orchestrates client and adapter for video retrieval", () =>
    Effect.gen(function*() {
      // Mock client and adapter
      const mockClient = {
        getVideoRaw: () => Effect.succeed(mockApiVideo)
      }
      const mockAdapter = {
        transformRawVideoToDomain: () => Effect.succeed(mockDomainVideo)
      }

      // Test service layer composition
      const result = yield* YouTubeService.getVideo("dQw4w9WgXcQ").pipe(
        Effect.provideService(YoutubeApiClient, mockClient),
        Effect.provideService(YouTubeAdapter, mockAdapter)
      )

      assert.deepStrictEqual(result, mockDomainVideo)
    })
  )

  it.effect("handles service layer errors appropriately", () =>
    Effect.gen(function*() {
      const mockClient = {
        getVideoRaw: () => Effect.fail(new Error("API Error"))
      }

      const result = yield* Effect.exit(
        YouTubeService.getVideo("dQw4w9WgXcQ").pipe(
          Effect.provideService(YoutubeApiClient, mockClient)
        )
      )

      assert.isTrue(result._tag === "Failure")
    })
  )
})
```

### End-to-End Tests (10% Coverage Target)

#### PubSub Message Flow Tests
```typescript
// Message encoding/decoding roundtrip
describe("PubSub Message Flow", () => {
  it.effect("encodes and decodes domain events correctly", () =>
    Effect.gen(function*() {
      const originalEvent = JobQueued.make({
        jobId: JobId.make("test-job"),
        requestId: RequestId.make("test-request"),
        mediaResourceId: MediaResourceId.make("test-media"),
        timestamp: new Date()
      })

      // Encode to message
      const encoded = yield* encodeDomainEvent(originalEvent)
      // Decode from message
      const decoded = yield* decodeDomainEvent(encoded)

      assert.deepStrictEqual(decoded, originalEvent)
    })
  )

  it.effect("handles TranscriptionJob message flow", () =>
    Effect.gen(function*() {
      const originalJob = TranscriptionJob.make({
        id: JobId.make("test-job"),
        requestId: RequestId.make("test-request"),
        media: YouTubeVideoResource.make({...}),
        status: JobStatus.make("queued"),
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const encoded = yield* encodeWorkMessage(originalJob)
      const decoded = yield* decodeWorkMessage(encoded)

      assert.deepStrictEqual(decoded, originalJob)
    })
  )
})
```

## Testing Infrastructure Requirements

### Mock Services & Test Utilities
```typescript
// Mock service factories
export const createMockYouTubeClient = () => ({
  getVideoRaw: (id: YouTubeVideoId) => Effect.succeed(mockApiVideo),
  getChannelRaw: (id: YouTubeChannelId) => Effect.succeed(mockApiChannel)
})

export const createMockYouTubeAdapter = () => ({
  toDomainVideo: (apiVideo: any) => Effect.succeed(mockDomainVideo),
  toDomainChannel: (apiChannel: any) => Effect.succeed(mockDomainChannel)
})

// Test data factories
export const createTestTranscriptionJob = () => TranscriptionJob.make({...})
export const createTestMediaResource = () => YouTubeVideoResource.make({...})
```

### Test Configuration
- `@effect/vitest` for Effect-aware testing
- Proper service layer mocking with Context.Tag
- Time-dependent testing with TestClock
- Error testing with Effect.exit() and Effect.flip()
- Schema validation testing with Schema.decode/Schema.encode

## Risk Assessment & Testing Priority

### High-Risk Areas (Test First)
1. **Schema Validation**: Core data integrity
2. **Error Handling**: System reliability and debugging
3. **URL/ID Parsing**: Input validation boundary
4. **Adapter Transformations**: Data consistency across layers

### Medium-Risk Areas (Test After Core)
1. **Service Orchestration**: Integration complexity
2. **PubSub Messaging**: Event-driven reliability
3. **Configuration Management**: Environment-specific behavior

### Low-Risk Areas (Test As Needed)
1. **Utility Functions**: Pure functions with clear contracts
2. **Type Guards**: TypeScript compiler validation
3. **Constants/Enums**: Static data validation

## Success Metrics

### Coverage Goals
- **Schema Validation**: 95%+ coverage
- **Error Handling**: 90%+ coverage
- **Data Transformation**: 85%+ coverage
- **Service Integration**: 80%+ coverage

### Quality Gates
- All tests pass with `pnpm test`
- Type checking passes with `pnpm check`
- JSDoc examples compile with `pnpm docgen`
- Linting passes with `pnpm lint`

## Implementation Strategy

### Phase 1: Foundation (Week 1)
1. Set up test infrastructure and utilities
2. Implement schema validation tests
3. Create error handling test suite
4. Establish mocking patterns

### Phase 2: Core Functionality (Week 2)
1. YouTube ID and URL validation tests
2. Entity creation and validation tests
3. Basic adapter transformation tests
4. Service layer integration tests

### Phase 3: Advanced Scenarios (Week 3)
1. End-to-end message flow tests
2. Error propagation and recovery tests
3. Edge case and boundary condition tests
4. Performance and load testing

### Phase 4: Maintenance & Enhancement (Ongoing)
1. Regression testing for new features
2. Performance monitoring and optimization
3. Documentation and example updates
4. Continuous integration improvements

## Conclusion

This test plan provides a comprehensive strategy for validating the critical functionality of the domain and ingestion packages. By focusing on schema validation, error handling, and data transformation accuracy, we ensure system reliability and maintainability while following Effect library best practices.

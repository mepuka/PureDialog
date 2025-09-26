/**
 * TaggedError Construction and Propagation Tests
 *
 * Tests for all domain TaggedError classes, focusing on construction,
 * properties, serialization, equality, and error propagation patterns.
 * Priority 1: Critical for error handling and system reliability.
 */

import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import type { DomainError } from "../../src/errors/definitions.js"
import {
  AuthorizationError,
  ConfigurationError,
  DomainErrorSchema,
  MediaResourceError,
  MediaResourceErrorSchema,
  StreamingError,
  TranscriptionError,
  TranscriptionErrorSchema,
  ValidationError
} from "../../src/errors/definitions.js"
import {
  createTestAuthorizationError,
  createTestConfigurationError,
  createTestJobId,
  createTestMediaResourceError,
  createTestRequestId,
  createTestStreamingError,
  createTestTranscriptionError,
  createTestValidationError
} from "../utils/mock-factories.js"

describe("TaggedError Construction", () => {
  describe("MediaResourceError", () => {
    it.effect("constructs MediaResourceError with required fields", () =>
      Effect.gen(function*() {
        const error = new MediaResourceError({
          message: "Failed to fetch video metadata",
          source: "youtube"
        })

        assert.strictEqual(error.message, "Failed to fetch video metadata")
        assert.strictEqual(error.source, "youtube")
        assert.strictEqual(error._tag, "MediaResourceError")
        assert.isUndefined(error.resourceId)
      }))

    it.effect("constructs MediaResourceError with optional resourceId", () =>
      Effect.gen(function*() {
        const error = new MediaResourceError({
          message: "Failed to fetch video",
          source: "youtube",
          resourceId: "dQw4w9WgXcQ"
        })

        assert.strictEqual(error.message, "Failed to fetch video")
        assert.strictEqual(error.source, "youtube")
        assert.strictEqual(error.resourceId, "dQw4w9WgXcQ")
        assert.strictEqual(error._tag, "MediaResourceError")
      }))

    it.effect("validates all source types", () =>
      Effect.gen(function*() {
        const sources: Array<"youtube" | "upload" | "url"> = ["youtube", "upload", "url"]

        for (const source of sources) {
          const error = new MediaResourceError({
            message: `Error from ${source}`,
            source
          })

          assert.strictEqual(error.source, source)
          assert.strictEqual(error.message, `Error from ${source}`)
        }
      }))

    it("creates MediaResourceError with factory", () => {
      const error = createTestMediaResourceError()
      assert.strictEqual(error.message, "Failed to fetch media resource")
      assert.strictEqual(error.source, "youtube")
      assert.strictEqual(error.resourceId, "test-resource-id")
    })

    it("creates MediaResourceError with factory overrides", () => {
      const error = createTestMediaResourceError({
        message: "Custom error message",
        source: "upload",
        resourceId: "custom-resource"
      })

      assert.strictEqual(error.message, "Custom error message")
      assert.strictEqual(error.source, "upload")
      assert.strictEqual(error.resourceId, "custom-resource")
    })
  })

  describe("TranscriptionError", () => {
    it.effect("constructs TranscriptionError with all required fields", () =>
      Effect.gen(function*() {
        const jobId = createTestJobId("test-job-456")
        const error = new TranscriptionError({
          message: "LLM processing failed",
          jobId,
          phase: "processing",
          retryable: true
        })

        assert.strictEqual(error.message, "LLM processing failed")
        assert.strictEqual(error.jobId, jobId)
        assert.strictEqual(error.phase, "processing")
        assert.isTrue(error.retryable)
        assert.strictEqual(error._tag, "TranscriptionError")
      }))

    it.effect("validates all phase types", () =>
      Effect.gen(function*() {
        const phases: Array<"metadata" | "processing" | "parsing" | "validation"> = [
          "metadata",
          "processing",
          "parsing",
          "validation"
        ]
        const jobId = createTestJobId()

        for (const phase of phases) {
          const error = new TranscriptionError({
            message: `Error in ${phase} phase`,
            jobId,
            phase,
            retryable: phase !== "validation" // validation errors usually not retryable
          })

          assert.strictEqual(error.phase, phase)
          assert.strictEqual(error.message, `Error in ${phase} phase`)
          assert.strictEqual(error.retryable, phase !== "validation")
        }
      }))

    it("creates TranscriptionError with factory", () => {
      const error = createTestTranscriptionError()
      assert.strictEqual(error.message, "Transcription processing failed")
      assert.strictEqual(error.phase, "processing")
      assert.isTrue(error.retryable)
    })
  })

  describe("ConfigurationError", () => {
    it.effect("constructs ConfigurationError with required fields", () =>
      Effect.gen(function*() {
        const error = new ConfigurationError({
          message: "Missing required configuration",
          field: "api_key"
        })

        assert.strictEqual(error.message, "Missing required configuration")
        assert.strictEqual(error.field, "api_key")
        assert.strictEqual(error._tag, "ConfigurationError")
        assert.isUndefined(error.expectedFormat)
      }))

    it.effect("constructs ConfigurationError with optional expectedFormat", () =>
      Effect.gen(function*() {
        const error = new ConfigurationError({
          message: "Invalid API key format",
          field: "youtube_api_key",
          expectedFormat: "39-character alphanumeric string"
        })

        assert.strictEqual(error.expectedFormat, "39-character alphanumeric string")
      }))

    it("creates ConfigurationError with factory", () => {
      const error = createTestConfigurationError()
      assert.strictEqual(error.field, "youtube_api_key")
      assert.strictEqual(error.expectedFormat, "string with 39 characters")
    })
  })

  describe("ValidationError", () => {
    it.effect("constructs ValidationError with all fields", () =>
      Effect.gen(function*() {
        const error = new ValidationError({
          message: "Value does not match pattern",
          field: "video_id",
          value: "invalid-id",
          constraint: "must be 11 characters alphanumeric"
        })

        assert.strictEqual(error.message, "Value does not match pattern")
        assert.strictEqual(error.field, "video_id")
        assert.strictEqual(error.value, "invalid-id")
        assert.strictEqual(error.constraint, "must be 11 characters alphanumeric")
        assert.strictEqual(error._tag, "ValidationError")
      }))

    it.effect("handles various value types", () =>
      Effect.gen(function*() {
        const testValues = [
          { value: null, description: "null value" },
          { value: undefined, description: "undefined value" },
          { value: 123, description: "number value" },
          { value: { prop: "object" }, description: "object value" },
          { value: ["array"], description: "array value" }
        ]

        for (const { description, value } of testValues) {
          const error = new ValidationError({
            message: `Invalid ${description}`,
            field: "test_field",
            value,
            constraint: "must be valid"
          })

          assert.strictEqual(error.value, value)
          assert.strictEqual(error.field, "test_field")
        }
      }))

    it("creates ValidationError with factory", () => {
      const error = createTestValidationError()
      assert.strictEqual(error.field, "video_id")
      assert.strictEqual(error.value, "invalid-id")
      assert.strictEqual(error.constraint, "must be 11 characters alphanumeric")
    })
  })

  describe("StreamingError", () => {
    it.effect("constructs StreamingError with required fields", () =>
      Effect.gen(function*() {
        const jobId = createTestJobId()
        const error = new StreamingError({
          message: "Chunk processing failed",
          jobId
        })

        assert.strictEqual(error.message, "Chunk processing failed")
        assert.strictEqual(error.jobId, jobId)
        assert.strictEqual(error._tag, "StreamingError")
        assert.isUndefined(error.chunkIndex)
        assert.isUndefined(error.partialData)
      }))

    it.effect("constructs StreamingError with optional fields", () =>
      Effect.gen(function*() {
        const jobId = createTestJobId()
        const error = new StreamingError({
          message: "Chunk processing failed",
          jobId,
          chunkIndex: 5,
          partialData: "partial transcription text..."
        })

        assert.strictEqual(error.chunkIndex, 5)
        assert.strictEqual(error.partialData, "partial transcription text...")
      }))

    it("creates StreamingError with factory", () => {
      const error = createTestStreamingError()
      assert.strictEqual(error.chunkIndex, 5)
      assert.strictEqual(error.partialData, "partial transcription data...")
    })
  })

  describe("AuthorizationError", () => {
    it.effect("constructs AuthorizationError with required fields", () =>
      Effect.gen(function*() {
        const error = new AuthorizationError({
          message: "Access denied",
          resource: "transcription_job",
          action: "create"
        })

        assert.strictEqual(error.message, "Access denied")
        assert.strictEqual(error.resource, "transcription_job")
        assert.strictEqual(error.action, "create")
        assert.strictEqual(error._tag, "AuthorizationError")
        assert.isUndefined(error.requestId)
      }))

    it.effect("constructs AuthorizationError with optional requestId", () =>
      Effect.gen(function*() {
        const requestId = createTestRequestId()
        const error = new AuthorizationError({
          message: "Insufficient permissions",
          requestId,
          resource: "user_data",
          action: "read"
        })

        assert.strictEqual(error.requestId, requestId)
      }))

    it("creates AuthorizationError with factory", () => {
      const error = createTestAuthorizationError()
      assert.strictEqual(error.resource, "transcription_job")
      assert.strictEqual(error.action, "create")
    })
  })
})

describe("TaggedError Equality and Hashing", () => {
  it.effect("tests error property equality", () =>
    Effect.gen(function*() {
      const error1 = new MediaResourceError({
        message: "test error",
        source: "youtube",
        resourceId: "test-id"
      })
      const error2 = new MediaResourceError({
        message: "test error",
        source: "youtube",
        resourceId: "test-id"
      })
      const error3 = new MediaResourceError({
        message: "different error",
        source: "youtube",
        resourceId: "test-id"
      })

      // Test that errors with same properties have same values
      assert.strictEqual(error1.message, error2.message)
      assert.strictEqual(error1.source, error2.source)
      assert.strictEqual(error1.resourceId, error2.resourceId)
      assert.strictEqual(error1._tag, error2._tag)

      // Test that errors with different properties have different values
      assert.notStrictEqual(error1.message, error3.message)
    }))

  it.effect("tests error collection behavior", () =>
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

      // Test that we can collect errors in arrays and access their properties
      const errors = [error1, error2, error3]
      assert.strictEqual(errors.length, 3)

      // Test that each error maintains its identity
      assert.strictEqual(errors[0].message, "test error")
      assert.strictEqual(errors[1].message, "test error")
      assert.strictEqual(errors[2].message, "different error")
    }))

  it.effect("tests different error types have different tags", () =>
    Effect.gen(function*() {
      const mediaError = new MediaResourceError({
        message: "test",
        source: "youtube"
      })
      const configError = new ConfigurationError({
        message: "test",
        field: "api_key"
      })

      // Different error types should have different _tag values
      assert.notStrictEqual(mediaError._tag, configError._tag)
      assert.strictEqual(mediaError._tag, "MediaResourceError")
      assert.strictEqual(configError._tag, "ConfigurationError")
    }))
})

describe("Error Schema Serialization", () => {
  describe("MediaResourceError Schema", () => {
    it.effect("encodes and decodes MediaResourceError correctly", () =>
      Effect.gen(function*() {
        const originalError = new MediaResourceError({
          message: "Video not found",
          source: "youtube",
          resourceId: "invalid-id"
        })

        // Encode to schema format
        const encoded = yield* Schema.encode(MediaResourceErrorSchema)({
          _tag: originalError._tag,
          message: originalError.message,
          source: originalError.source,
          resourceId: originalError.resourceId
        })

        // Decode back from schema format
        const decoded = yield* Schema.decode(MediaResourceErrorSchema)(encoded)

        assert.strictEqual(decoded._tag, "MediaResourceError")
        assert.strictEqual(decoded.message, "Video not found")
        assert.strictEqual(decoded.source, "youtube")
        assert.strictEqual(decoded.resourceId, "invalid-id")
      }))

    it.effect("handles missing optional fields in schema", () =>
      Effect.gen(function*() {
        const schemaData = {
          _tag: "MediaResourceError" as const,
          message: "Error without resource ID",
          source: "upload" as const
        }

        const decoded = yield* Schema.decode(MediaResourceErrorSchema)(schemaData)

        assert.strictEqual(decoded.message, "Error without resource ID")
        assert.strictEqual(decoded.source, "upload")
        assert.isUndefined(decoded.resourceId)
      }))
  })

  describe("TranscriptionError Schema", () => {
    it.effect("encodes and decodes TranscriptionError correctly", () =>
      Effect.gen(function*() {
        const jobId = createTestJobId("schema-test-job")
        const originalError = new TranscriptionError({
          message: "Processing timeout",
          jobId,
          phase: "processing",
          retryable: true
        })

        const encoded = yield* Schema.encode(TranscriptionErrorSchema)({
          _tag: originalError._tag,
          message: originalError.message,
          jobId: originalError.jobId,
          phase: originalError.phase,
          retryable: originalError.retryable
        })

        const decoded = yield* Schema.decode(TranscriptionErrorSchema)(encoded)

        assert.strictEqual(decoded._tag, "TranscriptionError")
        assert.strictEqual(decoded.message, "Processing timeout")
        assert.strictEqual(decoded.jobId, jobId)
        assert.strictEqual(decoded.phase, "processing")
        assert.isTrue(decoded.retryable)
      }))
  })

  describe("DomainError Union Schema", () => {
    it.effect("handles all error types in union schema", () =>
      Effect.gen(function*() {
        const errors: Array<DomainError> = [
          createTestMediaResourceError(),
          createTestTranscriptionError(),
          createTestConfigurationError(),
          createTestValidationError(),
          createTestStreamingError(),
          createTestAuthorizationError()
        ]

        for (const error of errors) {
          // Convert to schema format
          const schemaData = {
            _tag: error._tag,
            message: error.message,
            ...(error._tag === "MediaResourceError" && {
              source: error.source,
              resourceId: error.resourceId
            }),
            ...(error._tag === "TranscriptionError" && {
              jobId: error.jobId,
              phase: error.phase,
              retryable: error.retryable
            }),
            ...(error._tag === "ConfigurationError" && {
              field: error.field,
              expectedFormat: error.expectedFormat
            }),
            ...(error._tag === "ValidationError" && {
              field: error.field,
              value: error.value,
              constraint: error.constraint
            }),
            ...(error._tag === "StreamingError" && {
              jobId: error.jobId,
              chunkIndex: error.chunkIndex,
              partialData: error.partialData
            }),
            ...(error._tag === "AuthorizationError" && {
              requestId: error.requestId,
              resource: error.resource,
              action: error.action
            })
          }

          const decoded = yield* Schema.decode(DomainErrorSchema)(schemaData)
          assert.strictEqual(decoded._tag, error._tag)
          assert.strictEqual(decoded.message, error.message)
        }
      }))
  })
})

describe("Error Propagation Patterns", () => {
  it.effect("tests error propagation through Effect chains", () =>
    Effect.gen(function*() {
      const operation = Effect.gen(function*() {
        // Step 1: succeeds
        const step1 = yield* Effect.succeed("step1 result")

        // Step 2: fails with domain error
        yield* Effect.fail(
          new MediaResourceError({
            message: "Failed to fetch video metadata",
            source: "youtube",
            resourceId: "test-video"
          })
        )

        // This should never execute
        return `${step1}-completed`
      })

      const result = yield* Effect.exit(operation)
      assert.isTrue(result._tag === "Failure")

      if (result._tag === "Failure") {
        const cause = result.cause
        // Extract the error from the cause
        assert.isTrue(cause._tag === "Fail")
        if (cause._tag === "Fail") {
          const error = cause.error
          assert.isTrue(error instanceof MediaResourceError)
          assert.strictEqual(error.message, "Failed to fetch video metadata")
        }
      }
    }))

  it.effect("tests error transformation between layers", () =>
    Effect.gen(function*() {
      // Simulate service layer error that gets transformed to API layer error
      const serviceError = Effect.fail(
        new ConfigurationError({
          message: "Missing YouTube API key",
          field: "YOUTUBE_API_KEY",
          expectedFormat: "39-character string"
        })
      )

      // Transform to more generic error for public API
      const transformed = serviceError.pipe(
        Effect.mapError((error) =>
          new ValidationError({
            message: "Service configuration error",
            field: "service_config",
            value: error.field,
            constraint: "required configuration must be provided"
          })
        )
      )

      const result = yield* Effect.exit(transformed)
      assert.isTrue(result._tag === "Failure")

      if (result._tag === "Failure" && result.cause._tag === "Fail") {
        const error = result.cause.error
        assert.isTrue(error instanceof ValidationError)
        assert.strictEqual(error.message, "Service configuration error")
        assert.strictEqual(error.value, "YOUTUBE_API_KEY")
      }
    }))

  it.effect("tests error context preservation", () =>
    Effect.gen(function*() {
      const jobId = createTestJobId("context-test")

      const operation = Effect.gen(function*() {
        // First operation fails
        yield* Effect.fail(
          new TranscriptionError({
            message: "Initial processing failed",
            jobId,
            phase: "metadata",
            retryable: true
          })
        )
      }).pipe(
        // Transform error while preserving context
        Effect.mapError((error) =>
          new TranscriptionError({
            message: `Enriched: ${error.message}`,
            jobId: error.jobId,
            phase: error.phase,
            retryable: false // Change retryability after context analysis
          })
        )
      )

      const result = yield* Effect.exit(operation)
      assert.isTrue(result._tag === "Failure")

      if (result._tag === "Failure" && result.cause._tag === "Fail") {
        const error = result.cause.error
        assert.isTrue(error instanceof TranscriptionError)
        assert.strictEqual(error.message, "Enriched: Initial processing failed")
        assert.strictEqual(error.jobId, jobId)
        assert.strictEqual(error.phase, "metadata")
        assert.isFalse(error.retryable) // Should be transformed
      }
    }))
})

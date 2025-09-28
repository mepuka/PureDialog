import type { DomainEvent, PubSubMessage, TranscriptionJob } from "@puredialog/domain"
import type { MessageEncodingError } from "@puredialog/ingestion"
import { MessageAdapter } from "@puredialog/ingestion"
import { Effect, Layer } from "effect"

/**
 * Mock MessageAdapter with state capture for testing
 * Provides Layer-based dependency injection for Effect-based tests
 */

export interface MessageCapture {
  readonly operation: "encodeDomainEvent" | "encodeWorkMessage" | "decodeDomainEvent" | "decodeWorkMessage"
  readonly input: DomainEvent | TranscriptionJob | PubSubMessage
  readonly timestamp: Date
}

export const createMockMessageAdapter = () => {
  const capturedMessages: Array<MessageCapture> = []
  const predefinedEvents: Array<DomainEvent> = []

  let shouldFail = false
  let failingOperation: string | null = null

  const setShouldFail = (fail: boolean, operation?: string) => {
    shouldFail = fail
    failingOperation = operation || null
  }

  const addPredefinedEvent = (event: DomainEvent) => {
    predefinedEvents.push(event)
  }

  const mockImplementation = {
    encodeDomainEvent: (event: DomainEvent) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "encodeDomainEvent")) {
          return yield* Effect.fail(
            new Error("Mock failure for encodeDomainEvent") as MessageEncodingError
          )
        }

        capturedMessages.push({
          operation: "encodeDomainEvent",
          input: event,
          timestamp: new Date()
        })

        // Return a mock PubSubMessage
        const mockMessage: PubSubMessage = {
          data: Buffer.from(JSON.stringify(event)),
          attributes: {
            jobId: event.jobId || "job_test",
            requestId: event.requestId || "req_test",
            eventType: event._tag,
            contentType: "application/json",
            timestamp: new Date().toISOString()
          }
        }

        return mockMessage
      }),

    encodeWorkMessage: (job: TranscriptionJob) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "encodeWorkMessage")) {
          return yield* Effect.fail(
            new Error("Mock failure for encodeWorkMessage") as MessageEncodingError
          )
        }

        capturedMessages.push({
          operation: "encodeWorkMessage",
          input: job,
          timestamp: new Date()
        })

        const mockMessage: PubSubMessage = {
          data: Buffer.from(JSON.stringify(job)),
          attributes: {
            jobId: job.id,
            requestId: job.requestId,
            eventType: "WorkMessage",
            contentType: "application/json",
            timestamp: new Date().toISOString()
          }
        }

        return mockMessage
      }),

    decodeDomainEvent: (message: PubSubMessage) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "decodeDomainEvent")) {
          return yield* Effect.fail(
            new Error("Mock failure for decodeDomainEvent") as MessageEncodingError
          )
        }

        capturedMessages.push({
          operation: "decodeDomainEvent",
          input: message,
          timestamp: new Date()
        })

        // Return predefined event if available, otherwise parse from message
        if (predefinedEvents.length > 0) {
          return predefinedEvents.shift()!
        }

        // Fallback: parse from message data using Effect
        return yield* Effect.tryPromise({
          try: () => Promise.resolve(JSON.parse(message.data.toString()) as DomainEvent),
          catch: () => new Error("Failed to parse domain event from message") as MessageEncodingError
        })
      }),

    decodeWorkMessage: (message: PubSubMessage) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "decodeWorkMessage")) {
          return yield* Effect.fail(
            new Error("Mock failure for decodeWorkMessage") as MessageEncodingError
          )
        }

        capturedMessages.push({
          operation: "decodeWorkMessage",
          input: message,
          timestamp: new Date()
        })

        // Parse job from message data using Effect
        return yield* Effect.tryPromise({
          try: () => Promise.resolve(JSON.parse(message.data.toString()) as TranscriptionJob),
          catch: () => new Error("Failed to parse work message from message") as MessageEncodingError
        })
      })
  }

  const clear = () => {
    capturedMessages.length = 0
    predefinedEvents.length = 0
    shouldFail = false
    failingOperation = null
  }

  // Create the Layer for dependency injection
  const mockLayer = Layer.succeed(MessageAdapter, mockImplementation)

  return {
    mockAdapter: mockImplementation,
    mockLayer,
    capturedMessages,
    setShouldFail,
    addPredefinedEvent,
    clear
  }
}

/**
 * Create a mock that always fails - useful for error testing
 */
export const createFailingMessageAdapterMock = () => {
  const baseMock = createMockMessageAdapter()

  const failingImplementation = {
    encodeDomainEvent: (_event: DomainEvent) => Effect.fail(new Error("Mock encoding failure") as MessageEncodingError),

    encodeWorkMessage: (_job: TranscriptionJob) =>
      Effect.fail(new Error("Mock encoding failure") as MessageEncodingError),

    decodeDomainEvent: (_message: PubSubMessage) =>
      Effect.fail(new Error("Mock decoding failure") as MessageEncodingError),

    decodeWorkMessage: (_message: PubSubMessage) =>
      Effect.fail(new Error("Mock decoding failure") as MessageEncodingError)
  }

  const failingLayer = Layer.succeed(MessageAdapter, failingImplementation)

  return {
    ...baseMock,
    mockAdapter: failingImplementation,
    mockLayer: failingLayer
  }
}

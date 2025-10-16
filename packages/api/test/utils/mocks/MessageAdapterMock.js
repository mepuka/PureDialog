import { MessageAdapter } from "@puredialog/ingestion"
import { Effect, Layer } from "effect"

export const createMockMessageAdapter = () => {
  const capturedMessages = []
  const predefinedEvents = []
  let shouldFail = false
  let failingOperation = null
  const setShouldFail = (fail, operation) => {
    shouldFail = fail
    failingOperation = operation || null
  }
  const addPredefinedEvent = (event) => {
    predefinedEvents.push(event)
  }
  const mockImplementation = {
    encodeDomainEvent: (event) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "encodeDomainEvent")) {
          return yield* Effect.fail(new Error("Mock failure for encodeDomainEvent"))
        }
        capturedMessages.push({
          operation: "encodeDomainEvent",
          input: event,
          timestamp: new Date()
        })
        // Return a mock PubSubMessage
        const mockMessage = {
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
    decodeDomainEvent: (message) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "decodeDomainEvent")) {
          return yield* Effect.fail(new Error("Mock failure for decodeDomainEvent"))
        }
        capturedMessages.push({
          operation: "decodeDomainEvent",
          input: message,
          timestamp: new Date()
        })
        // Return predefined event if available, otherwise parse from message
        if (predefinedEvents.length > 0) {
          return predefinedEvents.shift()
        }
        // Fallback: parse from message data using Effect
        return yield* Effect.tryPromise({
          try: () => Promise.resolve(JSON.parse(message.data.toString())),
          catch: () => new Error("Failed to parse domain event from message")
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
    encodeDomainEvent: (_event) => Effect.fail(new Error("Mock encoding failure")),
    decodeDomainEvent: (_message) => Effect.fail(new Error("Mock decoding failure"))
  }
  const failingLayer = Layer.succeed(MessageAdapter, failingImplementation)
  return {
    ...baseMock,
    mockAdapter: failingImplementation,
    mockLayer: failingLayer
  }
}
// # sourceMappingURL=MessageAdapterMock.js.map

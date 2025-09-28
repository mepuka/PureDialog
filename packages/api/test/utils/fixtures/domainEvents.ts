import type {
  DomainEvent,
  JobFailed,
  JobId,
  JobQueued,
  JobStatusChanged,
  PubSubMessage,
  RequestId,
  TranscriptComplete,
  TranscriptId,
  WorkMessage
} from "@puredialog/domain"
import { createTestJob } from "./jobs.js"

/**
 * Test data factories for DomainEvent types
 */

export const createJobQueuedEvent = (overrides: Partial<JobQueued> = {}): JobQueued => ({
  _tag: "JobQueued",
  job: createTestJob(),
  occurredAt: new Date(),
  ...overrides
})

export const createJobFailedEvent = (overrides: Partial<JobFailed> = {}): JobFailed => ({
  _tag: "JobFailed",
  jobId: "job_test_12345" as JobId,
  requestId: "req_test_67890" as RequestId,
  error: "Test transcription failure",
  attempts: 3,
  occurredAt: new Date(),
  ...overrides
})

export const createTranscriptCompleteEvent = (overrides: Partial<TranscriptComplete> = {}): TranscriptComplete => ({
  _tag: "TranscriptComplete",
  jobId: "job_test_12345" as JobId,
  requestId: "req_test_67890" as RequestId,
  transcript: {
    id: "transcript_test_abc" as TranscriptId,
    content: "Test transcript content",
    language: "en",
    confidence: 0.95,
    duration: 120,
    createdAt: new Date(),
    segments: []
  },
  occurredAt: new Date(),
  ...overrides
})

export const createJobStatusChangedEvent = (overrides: Partial<JobStatusChanged> = {}): JobStatusChanged => ({
  _tag: "JobStatusChanged",
  jobId: "job_test_12345" as JobId,
  requestId: "req_test_67890" as RequestId,
  from: "Queued",
  to: "Processing",
  occurredAt: new Date(),
  ...overrides
})

export const createWorkMessageEvent = (overrides: Partial<WorkMessage> = {}): WorkMessage => ({
  _tag: "WorkMessage",
  job: createTestJob(),
  occurredAt: new Date(),
  ...overrides
})

/**
 * Create PubSub message from domain event (for testing message decoding)
 */
export const createPubSubMessage = (event: DomainEvent): PubSubMessage => ({
  data: Buffer.from(JSON.stringify(event)),
  attributes: {
    jobId: getEventJobId(event),
    requestId: getEventRequestId(event),
    eventType: event._tag,
    contentType: "application/json",
    timestamp: new Date().toISOString()
  },
  messageId: `msg_${Math.random().toString(36).substr(2, 9)}`,
  publishTime: new Date().toISOString()
})

/**
 * Create invalid PubSub message for error testing
 */
export const createInvalidPubSubMessage = (): PubSubMessage => ({
  data: Buffer.from("invalid json content"),
  attributes: {
    contentType: "application/json",
    timestamp: new Date().toISOString()
  },
  messageId: `msg_invalid_${Math.random().toString(36).substr(2, 9)}`,
  publishTime: new Date().toISOString()
})

/**
 * Helper to extract jobId from any domain event
 */
function getEventJobId(event: DomainEvent): string {
  switch (event._tag) {
    case "JobQueued":
    case "WorkMessage":
      return event.job.id
    case "JobFailed":
    case "TranscriptComplete":
    case "JobStatusChanged":
      return event.jobId
    default:
      return "job_unknown"
  }
}

/**
 * Helper to extract requestId from any domain event
 */
function getEventRequestId(event: DomainEvent): string {
  switch (event._tag) {
    case "JobQueued":
    case "WorkMessage":
      return event.job.requestId
    case "JobFailed":
    case "TranscriptComplete":
    case "JobStatusChanged":
      return event.requestId
    default:
      return "req_unknown"
  }
}

/**
 * Create a complete set of events for testing job lifecycle
 */
export const createJobLifecycleEvents = (jobId: JobId, requestId: RequestId) => {
  const baseJob = createTestJob({ id: jobId, requestId })

  return {
    queued: createJobQueuedEvent({ job: baseJob }),
    statusChange: createJobStatusChangedEvent({ jobId, requestId, from: "Queued", to: "Processing" }),
    completed: createTranscriptCompleteEvent({ jobId, requestId }),
    failed: createJobFailedEvent({ jobId, requestId })
  }
}

/**
 * Event collections for different test scenarios
 */
export const TestEvents = {
  /**
   * Basic success flow events
   */
  successFlow: () => {
    const jobId = "job_success_test" as JobId
    const requestId = "req_success_test" as RequestId
    return createJobLifecycleEvents(jobId, requestId)
  },

  /**
   * Failure scenario events
   */
  failureFlow: () => {
    const jobId = "job_failure_test" as JobId
    const requestId = "req_failure_test" as RequestId
    return {
      queued: createJobQueuedEvent({
        job: createTestJob({ id: jobId, requestId })
      }),
      failed: createJobFailedEvent({
        jobId,
        requestId,
        error: "Processing timeout",
        attempts: 3
      })
    }
  },

  /**
   * Status transition events
   */
  statusTransitions: () => {
    const jobId = "job_transitions_test" as JobId
    const requestId = "req_transitions_test" as RequestId
    return [
      createJobStatusChangedEvent({ jobId, requestId, from: "Queued", to: "Processing" }),
      createJobStatusChangedEvent({ jobId, requestId, from: "Processing", to: "Completed" })
    ]
  }
} as const

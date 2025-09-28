import type { JobId, PubSubMessage, RequestId } from "@puredialog/domain"
import { DomainEvent as DomainEventSchema, TranscriptionJob as TranscriptionJobSchema } from "@puredialog/domain"
import { Context, Effect, Layer, Match, Schema } from "effect"
import { MessageEncodingError } from "../errors.js"

type DomainEvent = Schema.Schema.Type<typeof DomainEventSchema>
type TranscriptionJob = Schema.Schema.Type<typeof TranscriptionJobSchema>
type JobIdType = Schema.Schema.Type<typeof JobId>
type RequestIdType = Schema.Schema.Type<typeof RequestId>

// Enhanced JSON message parsing using Effect Schema built-ins
const parseJsonMessage =
  (schema: Schema.Schema.AnyNoContext) =>
  (data: Buffer): Effect.Effect<Schema.Schema.Type<typeof schema>, MessageEncodingError> =>
    Schema.decodeUnknown(Schema.parseJson(schema))(data.toString("utf8")).pipe(
      Effect.mapError((cause) =>
        new MessageEncodingError({
          message: "Failed to parse JSON message",
          cause
        })
      )
    )

// Streamlined message encoding using Schema.parseJson
const encodeToJsonBuffer =
  (schema: Schema.Schema.AnyNoContext) =>
  (value: Schema.Schema.Type<typeof schema>): Effect.Effect<Buffer, MessageEncodingError> =>
    Schema.encode(Schema.parseJson(schema))(value).pipe(
      Effect.map((jsonString) => Buffer.from(jsonString, "utf8")),
      Effect.mapError((cause) =>
        new MessageEncodingError({
          message: "Failed to encode value to JSON buffer",
          cause
        })
      )
    )

const domainEventAttributes = (event: DomainEvent): { readonly jobId: JobIdType; readonly requestId: RequestIdType } =>
  Match.value(event).pipe(
    Match.tag("JobQueued", ({ job }) => ({ jobId: job.id, requestId: job.requestId })),
    Match.tag("JobFailed", ({ jobId, requestId }) => ({ jobId, requestId })),
    Match.tag("TranscriptComplete", ({ jobId, requestId }) => ({ jobId, requestId })),
    Match.tag("JobStatusChanged", ({ jobId, requestId }) => ({ jobId, requestId })),
    Match.tag("WorkMessage", ({ job }) => ({ jobId: job.id, requestId: job.requestId })),
    Match.exhaustive
  )

// Enhanced message creation with proper typing
const createPubSubMessage = (data: Buffer, attributes: Record<string, string>): PubSubMessage => ({
  data,
  attributes: {
    ...attributes,
    contentType: "application/json",
    timestamp: new Date().toISOString()
  }
})

const formatJobId = (jobId: JobIdType) => `${jobId}`
const formatRequestId = (requestId: RequestIdType) => `${requestId}`

export class MessageAdapter extends Context.Tag("MessageAdapter")<
  MessageAdapter,
  {
    readonly encodeDomainEvent: (event: DomainEvent) => Effect.Effect<PubSubMessage, MessageEncodingError>
    readonly encodeWorkMessage: (job: TranscriptionJob) => Effect.Effect<PubSubMessage, MessageEncodingError>
    readonly decodeDomainEvent: (message: PubSubMessage) => Effect.Effect<DomainEvent, MessageEncodingError>
    readonly decodeWorkMessage: (
      message: PubSubMessage
    ) => Effect.Effect<TranscriptionJob, MessageEncodingError>
  }
>() {}

const make = () => {
  const encodeDomainEvent = (event: DomainEvent) =>
    encodeToJsonBuffer(DomainEventSchema)(event).pipe(
      Effect.map((data): PubSubMessage => {
        const attributes = domainEventAttributes(event)
        return createPubSubMessage(data, {
          jobId: formatJobId(attributes.jobId),
          requestId: formatRequestId(attributes.requestId),
          eventType: event._tag
        })
      })
    )

  const encodeWorkMessage = (job: TranscriptionJob) =>
    encodeToJsonBuffer(TranscriptionJobSchema)(job).pipe(
      Effect.map((data): PubSubMessage =>
        createPubSubMessage(data, {
          jobId: formatJobId(job.id),
          requestId: formatRequestId(job.requestId),
          eventType: "WorkMessage"
        })
      )
    )

  const decodeDomainEvent = (message: PubSubMessage) => parseJsonMessage(DomainEventSchema)(message.data)

  const decodeWorkMessage = (message: PubSubMessage) => parseJsonMessage(TranscriptionJobSchema)(message.data)

  return {
    encodeDomainEvent,
    encodeWorkMessage,
    decodeDomainEvent,
    decodeWorkMessage
  } as const
}

export const MessageAdapterLive = Layer.sync(MessageAdapter, make)

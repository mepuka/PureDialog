import type { JobId, RequestId } from "@puredialog/domain"
import { DomainEvent as DomainEventSchema, TranscriptionJob as TranscriptionJobSchema } from "@puredialog/domain"
import { Context, Effect, Layer, Match, ParseResult, Schema } from "effect"
import { MessageEncodingError } from "../errors.js"
import type { PubSubMessage } from "./types.js"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const Utf8Bytes = Schema.transformOrFail(
  Schema.String,
  Schema.Uint8ArrayFromSelf,
  {
    strict: true,
    decode: (value) => ParseResult.succeed(textEncoder.encode(value)),
    encode: (value) => ParseResult.succeed(textDecoder.decode(value))
  }
)

type DomainEvent = Schema.Schema.Type<typeof DomainEventSchema>
type TranscriptionJob = Schema.Schema.Type<typeof TranscriptionJobSchema>
type JobIdType = Schema.Schema.Type<typeof JobId>
type RequestIdType = Schema.Schema.Type<typeof RequestId>

const toBuffer = (value: DomainEvent): Effect.Effect<Buffer, MessageEncodingError> =>
  Schema.encode(Schema.parseJson(DomainEventSchema))(value).pipe(
    Effect.flatMap((json) => Schema.decode(Utf8Bytes)(json)),
    Effect.map((bytes) => Buffer.from(bytes)),
    Effect.mapError((cause) =>
      new MessageEncodingError({ message: "Failed to encode UTF-8 bytes", context: { cause } })
    )
  )

const fromBuffer = (schema: Schema.Schema.AnyNoContext, data: Buffer) =>
  Schema.encode(Utf8Bytes)(data).pipe(
    Effect.flatMap((json) => Schema.decode(Schema.parseJson(schema))(json)),
    Effect.mapError((cause) =>
      new MessageEncodingError({ message: "Failed to decode UTF-8 bytes", context: { cause } })
    )
  )

const encodeWithSchema = (schema: Schema.Schema.AnyNoContext, value: Schema.Schema.Type<Schema.Schema.AnyNoContext>) =>
  Schema.encode(schema)(value).pipe(
    Effect.mapError((cause) =>
      new MessageEncodingError({ message: "Failed to encode value using schema", context: { cause } })
    ),
    Effect.flatMap(toBuffer)
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
  const buildAttributes = (a: Record<string, string>): Record<string, string> => a

  const encodeDomainEvent = (event: DomainEvent) =>
    encodeWithSchema(DomainEventSchema, event).pipe(
      Effect.map((data): PubSubMessage => {
        const attributes = domainEventAttributes(event)
        return {
          data,
          attributes: {
            ...buildAttributes({
              jobId: formatJobId(attributes.jobId),
              requestId: formatRequestId(attributes.requestId)
            }),
            eventType: event._tag
          }
        }
      })
    )

  const encodeWorkMessage = (job: TranscriptionJob) =>
    encodeWithSchema(TranscriptionJobSchema, job).pipe(
      Effect.map((data): PubSubMessage => ({
        data,
        attributes: {
          ...buildAttributes({
            jobId: formatJobId(job.id),
            requestId: formatRequestId(job.requestId)
          }),
          eventType: "WorkMessage"
        }
      }))
    )

  const decodeDomainEvent = (message: PubSubMessage) => fromBuffer(DomainEventSchema, message.data)
  const decodeWorkMessage = (message: PubSubMessage) => fromBuffer(TranscriptionJobSchema, message.data)

  return {
    encodeDomainEvent,
    encodeWorkMessage,
    decodeDomainEvent,
    decodeWorkMessage
  } as const
}

export const MessageAdapterLive = Layer.sync(MessageAdapter, make)

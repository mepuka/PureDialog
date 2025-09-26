import type { JobId, RequestId } from "@puredialog/domain"
import { DomainEvent as DomainEventSchema, TranscriptionJob as TranscriptionJobSchema } from "@puredialog/domain"
import { Effect, Match, ParseResult, Schema } from "effect"
import { buildAttributes } from "./Config.js"
import { MessageEncodingError } from "./errors.js"
import type { PubSubMessage } from "./Types.js"

type AnySchema = Schema.Schema.Any

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

const toBuffer = (value: unknown): Effect.Effect<Buffer, MessageEncodingError> =>
  Schema.encode(Schema.parseJson())(value).pipe(
    Effect.mapError((cause) =>
      new MessageEncodingError({
        message: "Failed to stringify payload",
        context: { cause }
      })
    ),
    Effect.flatMap((json) =>
      Schema.decode(Utf8Bytes)(json).pipe(
        Effect.mapError((cause) =>
          new MessageEncodingError({
            message: "Failed to encode UTF-8 bytes",
            context: { cause }
          })
        )
      )
    ),
    Effect.map((bytes) => Buffer.from(bytes))
  )

const fromBuffer = <S extends AnySchema>(schema: S, data: Buffer) =>
  Schema.encode(Utf8Bytes)(data).pipe(
    Effect.mapError((cause) =>
      new MessageEncodingError({
        message: "Failed to decode UTF-8 bytes",
        context: { cause }
      })
    ),
    Effect.flatMap((json) =>
      Schema.decode(Schema.parseJson())(json).pipe(
        Effect.mapError((cause) =>
          new MessageEncodingError({
            message: "Failed to parse JSON from buffer",
            context: { cause }
          })
        )
      )
    ),
    Effect.flatMap((payload) =>
      Schema.decode(schema)(payload).pipe(
        Effect.mapError((cause) =>
          new MessageEncodingError({
            message: "Failed to decode payload using schema",
            context: { cause }
          })
        )
      )
    )
  )

const encodeWithSchema = <S extends AnySchema>(schema: S, value: Schema.Schema.Type<S>) =>
  Schema.encode(schema)(value).pipe(
    Effect.mapError((cause) =>
      new MessageEncodingError({
        message: "Failed to encode value using schema",
        context: { cause }
      })
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

export const encodeDomainEvent = (event: DomainEvent) =>
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

export const encodeWorkMessage = (job: TranscriptionJob) =>
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

export const decodeDomainEvent = (message: PubSubMessage) => fromBuffer(DomainEventSchema, message.data)

export const decodeWorkMessage = (message: PubSubMessage) => fromBuffer(TranscriptionJobSchema, message.data)

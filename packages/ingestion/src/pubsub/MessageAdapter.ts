import {
  DomainEvent as DomainEventSchema,
  JobId,
  RequestId,
  TranscriptionJob as TranscriptionJobSchema,
} from "@puredialog/domain";
import { ParseResult } from "effect";
import { Schema } from "effect";
import { Effect, Match } from "effect";
import { buildAttributes } from "./Config.js";
import { MessageEncodingError } from "./errors.js";
import type { PubSubEventType, PubSubMessage } from "./Types.js";
import {
  JobFailedEventType,
  JobQueuedEventType,
  JobStatusChangedEventType,
  TranscriptCompleteEventType,
  WorkMessageEventType,
} from "./Types.js";

type AnySchema = Schema.Schema.Any;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const Utf8Bytes = Schema.transformOrFail(
  Schema.String,
  Schema.Uint8ArrayFromSelf,
  {
    strict: true,
    decode: (value) => ParseResult.succeed(textEncoder.encode(value)),
    encode: (value) => ParseResult.succeed(textDecoder.decode(value)),
  },
);

export const CURRENT_SCHEMA_VERSION = "1" as const;

export type DomainEvent = Schema.Schema.Type<typeof DomainEventSchema>;
export type TranscriptionJob = Schema.Schema.Type<typeof TranscriptionJobSchema>;
export type JobIdType = Schema.Schema.Type<typeof JobId>;
export type RequestIdType = Schema.Schema.Type<typeof RequestId>;

export interface EncodeEventOptions {
  readonly correlationId?: string;
  readonly schemaVersion?: string;
  readonly mediaType?: string;
}

export interface EncodeWorkOptions {
  readonly correlationId?: string;
  readonly schemaVersion?: string;
  readonly stageOverride?: string;
}

const toBuffer = (value: unknown): Effect.Effect<Buffer, MessageEncodingError> =>
  Schema.encode(Schema.parseJson())(value).pipe(
    Effect.mapError((cause) =>
      new MessageEncodingError({
        message: "Failed to stringify payload",
        context: { cause },
      })
    ),
    Effect.flatMap((json) =>
      Schema.decode(Utf8Bytes)(json).pipe(
        Effect.mapError((cause) =>
          new MessageEncodingError({
            message: "Failed to encode UTF-8 bytes",
            context: { cause },
          })
        ),
      )
    ),
    Effect.map((bytes) => Buffer.from(bytes)),
  );

const fromBuffer = <S extends AnySchema>(
  schema: S,
  data: Buffer,
) =>
  Schema.encode(Utf8Bytes)(data).pipe(
    Effect.mapError((cause) =>
      new MessageEncodingError({
        message: "Failed to decode UTF-8 bytes",
        context: { cause },
      })
    ),
    Effect.flatMap((json) =>
      Schema.decode(Schema.parseJson())(json).pipe(
        Effect.mapError((cause) =>
          new MessageEncodingError({
            message: "Failed to parse JSON from buffer",
            context: { cause },
          })
        ),
      )
    ),
    Effect.flatMap((payload) =>
      Schema.decode(schema)(payload).pipe(
        Effect.mapError((cause) =>
          new MessageEncodingError({
            message: "Failed to decode payload using schema",
            context: { cause },
          })
        ),
      )
    ),
  );

const encodeWithSchema = <S extends AnySchema>(
  schema: S,
  value: Schema.Schema.Type<S>,
) =>
  Schema.encode(schema)(value).pipe(
    Effect.mapError((cause) =>
      new MessageEncodingError({
        message: "Failed to encode value using schema",
        context: { cause },
      })
    ),
    Effect.flatMap(toBuffer),
  );
interface EventContext {
  readonly jobId: JobIdType;
  readonly requestId: RequestIdType;
  readonly mediaType: string;
  readonly stage: string;
  readonly eventType: PubSubEventType;
}

const eventContext = (
  event: DomainEvent,
  options: EncodeEventOptions,
): Effect.Effect<EventContext, MessageEncodingError> => {
  const base = Match.value(event).pipe(
    Match.tag("JobQueued", (queued) => ({
      eventType: JobQueuedEventType({}),
      jobId: queued.job.id,
      requestId: queued.job.requestId,
      stage: "Queued",
      mediaType: queued.job.media.type,
    })),
    Match.tag("JobFailed", (failed) => ({
      eventType: JobFailedEventType({}),
      jobId: failed.jobId,
      requestId: failed.requestId,
      stage: "Failed",
      mediaType: options.mediaType,
    })),
    Match.tag("TranscriptComplete", (complete) => ({
      eventType: TranscriptCompleteEventType({}),
      jobId: complete.jobId,
      requestId: complete.requestId,
      stage: "Completed",
      mediaType: options.mediaType,
    })),
    Match.tag("JobStatusChanged", (changed) => ({
      eventType: JobStatusChangedEventType({}),
      jobId: changed.jobId,
      requestId: changed.requestId,
      stage: changed.to,
      mediaType: options.mediaType,
    })),
    Match.exhaustive,
  );

  if (!base.mediaType) {
    return Effect.fail(
      new MessageEncodingError({
        message: "Media type is required for event",
        context: { eventType: base.eventType._tag },
      }),
    );
  }

  return Effect.succeed({
    jobId: base.jobId,
    requestId: base.requestId,
    stage: base.stage,
    mediaType: base.mediaType,
    eventType: base.eventType,
  });
};

const resolveSchemaVersion = (override?: string) => override ?? CURRENT_SCHEMA_VERSION;

export const encodeDomainEvent = (
  event: DomainEvent,
  options: EncodeEventOptions = {},
) =>
  eventContext(event, options).pipe(
    Effect.flatMap((context) =>
      encodeWithSchema(DomainEventSchema, event).pipe(
        Effect.map((data): PubSubMessage => ({
          data,
          attributes: {
            ...buildAttributes({
              jobId: context.jobId,
              requestId: context.requestId,
              mediaType: context.mediaType,
              stage: context.stage,
              schemaVersion: resolveSchemaVersion(options.schemaVersion),
              correlationId: options.correlationId,
            }),
            eventType: context.eventType._tag,
          },
        })),
      )
    ),
  );

export const encodeWorkMessage = (
  job: TranscriptionJob,
  options: EncodeWorkOptions = {},
) =>
  encodeWithSchema(TranscriptionJobSchema, job).pipe(
    Effect.map((data): PubSubMessage => ({
      data,
      attributes: {
        ...buildAttributes({
          jobId: job.id,
          requestId: job.requestId,
          mediaType: job.media.type,
          stage: options.stageOverride ?? job.status,
          schemaVersion: resolveSchemaVersion(options.schemaVersion),
          correlationId: options.correlationId,
        }),
        eventType: WorkMessageEventType({})._tag,
      },
    })),
  );

export const decodeDomainEvent = (message: PubSubMessage) => fromBuffer(DomainEventSchema, message.data);

export const decodeWorkMessage = (message: PubSubMessage) => fromBuffer(TranscriptionJobSchema, message.data);

import { Config, Context, Duration, Effect, Layer, Redacted } from "effect";
import { PubSubPublishError } from "./errors.js";

export type TopicName = string;
export type SubscriptionName = string;

export interface PubSubConfigInterface {
  readonly projectId: string;
  readonly emulatorHost?: string;
  readonly topics: {
    readonly work: TopicName;
    readonly events: TopicName;
    readonly dlq: TopicName;
  };
  readonly subscriptions: {
    readonly work: SubscriptionName;
    readonly metadata: SubscriptionName;
    readonly transcription: SubscriptionName;
    readonly events: SubscriptionName;
    readonly dlq: SubscriptionName;
  };
  readonly concurrency: number;
  readonly timeout: Duration.Duration;
  readonly retries: {
    readonly attempts: number;
    readonly backoff: Duration.Duration;
  };
}

export class PubSubConfig extends Context.Tag("PubSubConfig")<
  PubSubConfig,
  PubSubConfigInterface
>() {}

const PubSubConfigSchema = {
  projectId: Config.redacted("PUBSUB_PROJECT_ID"),
  emulatorHost: Config.string("PUBSUB_EMULATOR_HOST").pipe(
    Config.withDefault(""),
  ),
  workTopic: Config.string("PUBSUB_TOPIC_WORK").pipe(
    Config.withDefault("job-processing"),
  ),
  eventsTopic: Config.string("PUBSUB_TOPIC_EVENTS").pipe(
    Config.withDefault("job-events"),
  ),
  dlqTopic: Config.string("PUBSUB_TOPIC_DLQ").pipe(
    Config.withDefault("job-dlq"),
  ),
  workSubscription: Config.string("PUBSUB_SUBSCRIPTION_WORK").pipe(
    Config.withDefault("job-processing-subscription"),
  ),
  metadataSubscription: Config.string("PUBSUB_SUBSCRIPTION_METADATA").pipe(
    Config.withDefault("metadata-worker-subscription"),
  ),
  transcriptionSubscription: Config.string(
    "PUBSUB_SUBSCRIPTION_TRANSCRIPTION",
  ).pipe(Config.withDefault("transcription-worker-subscription")),
  eventsSubscription: Config.string("PUBSUB_SUBSCRIPTION_EVENTS").pipe(
    Config.withDefault("job-events-subscription"),
  ),
  dlqSubscription: Config.string("PUBSUB_SUBSCRIPTION_DLQ").pipe(
    Config.withDefault("job-dlq-subscription"),
  ),
  concurrency: Config.number("PUBSUB_SUBSCRIBER_CONCURRENCY").pipe(
    Config.withDefault(4),
  ),
  timeout: Config.duration("PUBSUB_TIMEOUT").pipe(
    Config.withDefault(Duration.seconds(30)),
  ),
  retryAttempts: Config.number("PUBSUB_RETRY_ATTEMPTS").pipe(
    Config.withDefault(3),
  ),
  backoffDuration: Config.duration("PUBSUB_BACKOFF_DURATION").pipe(
    Config.withDefault(Duration.seconds(1)),
  ),
};

const makeConfig = Effect.gen(function*() {
  const projectIdRedacted = yield* PubSubConfigSchema.projectId;
  const emulatorHostRaw = yield* PubSubConfigSchema.emulatorHost;
  const workTopic = yield* PubSubConfigSchema.workTopic;
  const eventsTopic = yield* PubSubConfigSchema.eventsTopic;
  const dlqTopic = yield* PubSubConfigSchema.dlqTopic;
  const workSubscription = yield* PubSubConfigSchema.workSubscription;
  const metadataSubscription = yield* PubSubConfigSchema.metadataSubscription;
  const transcriptionSubscription = yield* PubSubConfigSchema.transcriptionSubscription;
  const eventsSubscription = yield* PubSubConfigSchema.eventsSubscription;
  const dlqSubscription = yield* PubSubConfigSchema.dlqSubscription;
  const concurrency = yield* PubSubConfigSchema.concurrency;
  const timeout = yield* PubSubConfigSchema.timeout;
  const retryAttempts = yield* PubSubConfigSchema.retryAttempts;
  const backoffDuration = yield* PubSubConfigSchema.backoffDuration;

  // Convert redacted to string
  const projectId = Redacted.value(projectIdRedacted);

  // Validate essential constraints
  if (!projectId || projectId.trim().length === 0) {
    return yield* Effect.fail(
      PubSubPublishError.clientFailure("project", "Project ID cannot be empty"),
    );
  }

  if (concurrency <= 0) {
    return yield* Effect.fail(
      PubSubPublishError.clientFailure(
        "config",
        "Subscriber concurrency must be greater than zero",
      ),
    );
  }

  const emulatorHost = emulatorHostRaw.trim() === "" ? undefined : emulatorHostRaw;

  return {
    projectId,
    emulatorHost,
    topics: {
      work: workTopic,
      events: eventsTopic,
      dlq: dlqTopic,
    },
    subscriptions: {
      work: workSubscription,
      metadata: metadataSubscription,
      transcription: transcriptionSubscription,
      events: eventsSubscription,
      dlq: dlqSubscription,
    },
    concurrency,
    timeout,
    retries: {
      attempts: retryAttempts,
      backoff: backoffDuration,
    },
  } as const satisfies PubSubConfigInterface;
});

export const PubSubConfigLive = Layer.effect(PubSubConfig, makeConfig);

export const isEmulator = (settings: PubSubConfigInterface): boolean => settings.emulatorHost !== undefined;

export interface AttributesBase {
  readonly jobId: string;
  readonly requestId: string;
  readonly mediaType: string;
  readonly stage: string;
  readonly schemaVersion: string;
  readonly correlationId?: string;
}

export const buildAttributes = (a: AttributesBase): Record<string, string> => ({
  jobId: a.jobId,
  requestId: a.requestId,
  mediaType: a.mediaType,
  stage: a.stage,
  schemaVersion: a.schemaVersion,
  ...(a.correlationId ? { correlationId: a.correlationId } : {}),
});

export const stageFilter = (stage: string): string => `attributes.stage = "${stage}"`;

/* eslint-disable @effect/dprint */
import { Config, Context, Duration, Effect, Layer, Schedule } from "effect";
import {} from "@google-cloud/pubsub";

export type TopicName = string;
export type SubscriptionName = string;

export interface BackoffConfig {
  readonly initial: Duration.Duration;
  readonly factor: number;
  readonly max: Duration.Duration;
}

export interface PubSubSettings {
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
  readonly ack: {
    readonly deadlineSeconds: number;
    readonly extensionIntervalSeconds: number;
    readonly maxExtensionSeconds: number;
    readonly maxDeliveryAttempts: number;
  };
  readonly concurrency: number;
  readonly retries: {
    readonly publishAttempts: number;
    readonly subscribeAttempts: number;
    readonly backoff: BackoffConfig;
  };
}

export class PubSubConfig extends Context.Tag("PubSubConfig")<
  PubSubConfig,
  PubSubSettings
>() {}

const PubSubConfigSchema = {
  projectId: Config.string("PUBSUB_PROJECT_ID").pipe(
    Config.withDefault("local-pubsub")
  ),
  emulatorHost: Config.string("PUBSUB_EMULATOR_HOST").pipe(
    Config.withDefault("")
  ),
  workTopic: Config.string("PUBSUB_TOPIC_WORK").pipe(
    Config.withDefault("job-processing")
  ),
  eventsTopic: Config.string("PUBSUB_TOPIC_EVENTS").pipe(
    Config.withDefault("job-events")
  ),
  dlqTopic: Config.string("PUBSUB_TOPIC_DLQ").pipe(
    Config.withDefault("job-dlq")
  ),
  workSubscription: Config.string("PUBSUB_SUBSCRIPTION_WORK").pipe(
    Config.withDefault("job-processing-subscription")
  ),
  metadataSubscription: Config.string("PUBSUB_SUBSCRIPTION_METADATA").pipe(
    Config.withDefault("metadata-worker-subscription")
  ),
  transcriptionSubscription: Config.string(
    "PUBSUB_SUBSCRIPTION_TRANSCRIPTION"
  ).pipe(Config.withDefault("transcription-worker-subscription")),
  eventsSubscription: Config.string("PUBSUB_SUBSCRIPTION_EVENTS").pipe(
    Config.withDefault("job-events-subscription")
  ),
  dlqSubscription: Config.string("PUBSUB_SUBSCRIPTION_DLQ").pipe(
    Config.withDefault("job-dlq-subscription")
  ),
  ackDeadlineSeconds: Config.number("PUBSUB_ACK_DEADLINE_SECONDS").pipe(
    Config.withDefault(10)
  ),
  ackExtensionIntervalSeconds: Config.number(
    "PUBSUB_ACK_EXTENSION_INTERVAL_SECONDS"
  ).pipe(Config.withDefault(5)),
  maxAckExtensionSeconds: Config.number(
    "PUBSUB_MAX_ACK_EXTENSION_SECONDS"
  ).pipe(Config.withDefault(600)),
  maxDeliveryAttempts: Config.number("PUBSUB_MAX_DELIVERY_ATTEMPTS").pipe(
    Config.withDefault(5)
  ),
  concurrency: Config.number("PUBSUB_SUBSCRIBER_CONCURRENCY").pipe(
    Config.withDefault(4)
  ),
  publishRetryAttempts: Config.number("PUBSUB_PUBLISH_RETRY_ATTEMPTS").pipe(
    Config.withDefault(3)
  ),
  subscribeRetryAttempts: Config.number("PUBSUB_SUBSCRIBE_RETRY_ATTEMPTS").pipe(
    Config.withDefault(5)
  ),
  backoffInitialMillis: Config.number("PUBSUB_BACKOFF_INITIAL_MILLIS").pipe(
    Config.withDefault(1000)
  ),
  backoffFactor: Config.number("PUBSUB_BACKOFF_FACTOR").pipe(
    Config.withDefault(2)
  ),
  backoffMaxMillis: Config.number("PUBSUB_BACKOFF_MAX_MILLIS").pipe(
    Config.withDefault(30000)
  ),
};

const makeConfig = Effect.gen(function* () {
  const projectId = yield* PubSubConfigSchema.projectId;
  const emulatorHostRaw = yield* PubSubConfigSchema.emulatorHost;
  const workTopic = yield* PubSubConfigSchema.workTopic;
  const eventsTopic = yield* PubSubConfigSchema.eventsTopic;
  const dlqTopic = yield* PubSubConfigSchema.dlqTopic;
  const workSubscription = yield* PubSubConfigSchema.workSubscription;
  const metadataSubscription = yield* PubSubConfigSchema.metadataSubscription;
  const transcriptionSubscription =
    yield* PubSubConfigSchema.transcriptionSubscription;
  const eventsSubscription = yield* PubSubConfigSchema.eventsSubscription;
  const dlqSubscription = yield* PubSubConfigSchema.dlqSubscription;
  const ackDeadlineSeconds = yield* PubSubConfigSchema.ackDeadlineSeconds;
  const ackExtensionIntervalSeconds =
    yield* PubSubConfigSchema.ackExtensionIntervalSeconds;
  const maxAckExtensionSeconds =
    yield* PubSubConfigSchema.maxAckExtensionSeconds;
  const maxDeliveryAttempts = yield* PubSubConfigSchema.maxDeliveryAttempts;
  const concurrency = yield* PubSubConfigSchema.concurrency;
  const publishRetryAttempts = yield* PubSubConfigSchema.publishRetryAttempts;
  const subscribeRetryAttempts =
    yield* PubSubConfigSchema.subscribeRetryAttempts;
  const backoffInitialMillis = yield* PubSubConfigSchema.backoffInitialMillis;
  const backoffFactor = yield* PubSubConfigSchema.backoffFactor;
  const backoffMaxMillis = yield* PubSubConfigSchema.backoffMaxMillis;

  if (ackDeadlineSeconds <= 0) {
    return yield* Effect.fail(
      new Error("PUBSUB_ACK_DEADLINE_SECONDS must be greater than zero")
    );
  }

  if (ackExtensionIntervalSeconds <= 0) {
    return yield* Effect.fail(
      new Error(
        "PUBSUB_ACK_EXTENSION_INTERVAL_SECONDS must be greater than zero"
      )
    );
  }

  if (maxAckExtensionSeconds < ackExtensionIntervalSeconds) {
    return yield* Effect.fail(
      new Error(
        "PUBSUB_MAX_ACK_EXTENSION_SECONDS must be >= ACK_EXTENSION_INTERVAL"
      )
    );
  }

  if (concurrency <= 0) {
    return yield* Effect.fail(
      new Error("PUBSUB_SUBSCRIBER_CONCURRENCY must be greater than zero")
    );
  }

  if (maxDeliveryAttempts <= 0) {
    return yield* Effect.fail(
      new Error("PUBSUB_MAX_DELIVERY_ATTEMPTS must be greater than zero")
    );
  }

  const emulatorHost =
    emulatorHostRaw.trim() === "" ? undefined : emulatorHostRaw;

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
    ack: {
      deadlineSeconds: ackDeadlineSeconds,
      extensionIntervalSeconds: ackExtensionIntervalSeconds,
      maxExtensionSeconds: maxAckExtensionSeconds,
      maxDeliveryAttempts,
    },
    concurrency,
    retries: {
      publishAttempts: publishRetryAttempts,
      subscribeAttempts: subscribeRetryAttempts,
      backoff: {
        initial: Duration.millis(backoffInitialMillis),
        factor: backoffFactor,
        max: Duration.millis(backoffMaxMillis),
      },
    },
  } as const satisfies PubSubSettings;
});

export const PubSubConfigLive = Layer.effect(PubSubConfig, makeConfig);

export const isEmulator = (settings: PubSubSettings): boolean =>
  settings.emulatorHost !== undefined;

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

export const stageFilter = (stage: string): string =>
  `attributes.stage = "${stage}"`;

export const makePublishRetrySchedule = (settings: PubSubSettings) =>
  Schedule.exponential(settings.retries.backoff.initial).pipe(
    Schedule.intersect(Schedule.recurs(settings.retries.publishAttempts - 1))
  );

export const makeSubscribeRetrySchedule = (settings: PubSubSettings) =>
  Schedule.exponential(settings.retries.backoff.initial).pipe(
    Schedule.intersect(Schedule.recurs(settings.retries.subscribeAttempts - 1))
  );

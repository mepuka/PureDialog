import type { Message, PubSub, Subscription, Topic } from "@google-cloud/pubsub";
import { Data } from "effect";

export type GoogleMessage = Message;
export type GooglePubSub = PubSub;
export type GoogleSubscription = Subscription;
export type GoogleTopic = Topic;

export interface PubSubMessage {
  readonly data: Buffer;
  readonly attributes: Record<string, string>;
}

export interface NoPayload {
  readonly _?: never;
}

export type PubSubEventType = Data.TaggedEnum<{
  JobQueued: NoPayload;
  JobFailed: NoPayload;
  TranscriptComplete: NoPayload;
  JobStatusChanged: NoPayload;
  WorkMessage: NoPayload;
}>;

export const {
  JobQueued: JobQueuedEventType,
  JobFailed: JobFailedEventType,
  TranscriptComplete: TranscriptCompleteEventType,
  JobStatusChanged: JobStatusChangedEventType,
  WorkMessage: WorkMessageEventType,
  $match: matchPubSubEventType,
  $is: isPubSubEventType,
} = Data.taggedEnum<PubSubEventType>();

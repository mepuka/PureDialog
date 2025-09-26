import type { Message, PubSub, Subscription, Topic } from "@google-cloud/pubsub"

export type GoogleMessage = Message
export type GooglePubSub = PubSub
export type GoogleSubscription = Subscription
export type GoogleTopic = Topic

export interface PubSubMessage {
  readonly data: Buffer
  readonly attributes: Record<string, string>
}

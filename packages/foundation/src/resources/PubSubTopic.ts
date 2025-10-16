import { Schema } from "effect"
import { GcpProjectId } from "../types/index.js"

/**
 * Pub/Sub Topic Name
 * Format: alphanumeric + hyphens + underscores + dots, 3-255 chars
 */
export const PubSubTopicName = Schema.String.pipe(
  Schema.brand("PubSubTopicName"),
  Schema.pattern(/^[a-zA-Z]([a-zA-Z0-9._-]{1,253}[a-zA-Z0-9])?$/),
  Schema.annotations({
    identifier: "PubSubTopicName",
    title: "Pub/Sub Topic Name",
    description: "Name of Google Cloud Pub/Sub topic"
  })
)

export type PubSubTopicName = Schema.Schema.Type<typeof PubSubTopicName>

/**
 * Pub/Sub Topic Resource
 *
 * Immutable data structure representing a Pub/Sub topic.
 */
export const PubSubTopicSchema = Schema.Struct({
  /**
   * Topic name
   */
  name: PubSubTopicName,

  /**
   * GCP project owning the topic
   */
  projectId: GcpProjectId,

  /**
   * Full resource name (projects/{project}/topics/{topic})
   */
  resourceName: Schema.String,

  /**
   * Message retention duration (ISO 8601 duration, optional)
   */
  messageRetentionDuration: Schema.optional(Schema.String),

  /**
   * Labels (optional)
   */
  labels: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String }))
})

export type PubSubTopic = Schema.Schema.Type<typeof PubSubTopicSchema>

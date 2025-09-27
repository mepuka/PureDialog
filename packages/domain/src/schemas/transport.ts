/**
 * @since 1.0.0
 */

/**
 * Represents a message for a Pub/Sub transport layer.
 * @since 1.0.0
 */
export interface PubSubMessage {
  readonly data: Buffer
  readonly attributes: Record<string, string>
}

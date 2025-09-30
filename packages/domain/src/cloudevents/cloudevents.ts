import { Schema } from "effect"

/**
 * CloudEvents v1.0 specification for Eventarc Advanced
 * @see https://github.com/cloudevents/spec/blob/v1.0/spec.md
 */

// CloudEvents attributes
export const CloudEventsAttributes = Schema.Struct({
  // REQUIRED
  id: Schema.String.pipe(
    Schema.brand("CloudEventId"),
    Schema.annotations({
      description: "Unique identifier for the event"
    })
  ),
  source: Schema.String.pipe(
    Schema.annotations({
      description: "Event source URI (e.g., //storage.googleapis.com/projects/_/buckets/BUCKET)"
    })
  ),
  specversion: Schema.Literal("1.0").pipe(
    Schema.annotations({
      description: "CloudEvents specification version"
    })
  ),
  type: Schema.String.pipe(
    Schema.annotations({
      description: "Event type (e.g., google.cloud.storage.object.v1.finalized)"
    })
  ),

  // OPTIONAL
  datacontenttype: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: "Content type of data (e.g., application/json)"
      })
    )
  ),
  dataschema: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({ description: "URI of data schema" })
    )
  ),
  subject: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        description: "Subject of the event (e.g., objects/jobs/Queued/job_123.json)"
      })
    )
  ),
  time: Schema.optional(
    Schema.DateFromString.pipe(
      Schema.annotations({ description: "Timestamp when the event occurred" })
    )
  )
})

export type CloudEventsAttributes = Schema.Schema.Type<typeof CloudEventsAttributes>

/**
 * Generic CloudEvent envelope
 * Data payload is typed separately per use case
 */
export const CloudEvent = <DataSchema extends Schema.Schema.Any>(
  dataSchema: DataSchema
) =>
  Schema.Struct({
    ...CloudEventsAttributes.fields,
    data: Schema.optional(dataSchema)
  })

export type CloudEvent<Data> = {
  readonly id: string & { readonly CloudEventId: unique symbol }
  readonly source: string
  readonly specversion: "1.0"
  readonly type: string
  readonly datacontenttype?: string
  readonly dataschema?: string
  readonly subject?: string
  readonly time?: Date
  readonly data?: Data
}

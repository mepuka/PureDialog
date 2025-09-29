import { Schema } from "effect"
import { CloudEvent } from "./cloudevents.js"

/**
 * Describes the customer-specified mechanism used to store the data at rest.
 */
export const CustomerEncryption = Schema.Struct({
  encryptionAlgorithm: Schema.optional(Schema.String),
  keySha256: Schema.optional(Schema.String)
})
export type CustomerEncryption = Schema.Schema.Type<typeof CustomerEncryption>

/**
 * An object within Google Cloud Storage.
 * @see https://googleapis.github.io/google-cloudevents/jsonschema/google/events/cloud/storage/v1/StorageObjectData.json
 */
export const GcsObjectMetadata = Schema.Struct({
  contentEncoding: Schema.optional(Schema.String),
  contentDisposition: Schema.optional(Schema.String),
  cacheControl: Schema.optional(Schema.String),
  contentLanguage: Schema.optional(Schema.String),
  metageneration: Schema.NumberFromString,
  timeDeleted: Schema.optional(Schema.DateFromString),
  contentType: Schema.optional(Schema.String),
  size: Schema.NumberFromString,
  timeCreated: Schema.optional(Schema.DateFromString),
  crc32c: Schema.String,
  componentCount: Schema.optional(Schema.Number),
  md5Hash: Schema.optional(Schema.String),
  etag: Schema.String,
  updated: Schema.DateFromString,
  storageClass: Schema.String,
  kmsKeyName: Schema.optional(Schema.String),
  timeStorageClassUpdated: Schema.DateFromString,
  temporaryHold: Schema.optional(Schema.Boolean),
  retentionExpirationTime: Schema.optional(Schema.DateFromString),
  metadata: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
  eventBasedHold: Schema.optional(Schema.Boolean),
  name: Schema.String,
  id: Schema.String,
  bucket: Schema.String,
  generation: Schema.NumberFromString,
  customerEncryption: Schema.optional(CustomerEncryption),
  mediaLink: Schema.optional(Schema.String),
  selfLink: Schema.optional(Schema.String),
  kind: Schema.Literal("storage#object")
})

export type GcsObjectMetadata = Schema.Schema.Type<typeof GcsObjectMetadata>

/**
 * The CloudEvent for a GCS object finalized event.
 */
export const GcsObjectFinalizedEvent = CloudEvent(GcsObjectMetadata).pipe(
  Schema.extend(
    Schema.Struct({
      type: Schema.Literal("google.cloud.storage.object.v1.finalized"),
      subject: Schema.String
    })
  )
)

export type GcsObjectFinalizedEvent = Schema.Schema.Type<
  typeof GcsObjectFinalizedEvent
>

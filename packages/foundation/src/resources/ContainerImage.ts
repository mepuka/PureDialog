import { Schema } from "effect"
import { ContainerImageUri, GcpProjectId } from "../types/index.js"

/**
 * Container Image Digest
 * Format: sha256:{64 hex chars}
 */
export const ImageDigest = Schema.String.pipe(
  Schema.brand("ImageDigest"),
  Schema.pattern(/^sha256:[a-f0-9]{64}$/),
  Schema.annotations({
    identifier: "ImageDigest",
    title: "Container Image Digest",
    description: "SHA256 digest of container image"
  })
)

export type ImageDigest = Schema.Schema.Type<typeof ImageDigest>

/**
 * Container Image Tag
 * Format: alphanumeric + dots + hyphens + underscores, 1-128 chars
 */
export const ImageTag = Schema.String.pipe(
  Schema.brand("ImageTag"),
  Schema.pattern(/^[a-zA-Z0-9._-]{1,128}$/),
  Schema.annotations({
    identifier: "ImageTag",
    title: "Container Image Tag",
    description: "Tag for container image version"
  })
)

export type ImageTag = Schema.Schema.Type<typeof ImageTag>

/**
 * Built Container Image
 *
 * Immutable data structure representing a built and pushed container image.
 * This is the "output" of a container build operation.
 */
export const BuiltContainerImageSchema = Schema.Struct({
  /**
   * Full image URI with tag
   */
  uri: ContainerImageUri,

  /**
   * Image digest (immutable reference)
   */
  digest: ImageDigest,

  /**
   * Image tag (mutable reference)
   */
  tag: ImageTag,

  /**
   * GCP project where image is stored
   */
  projectId: GcpProjectId,

  /**
   * Registry (gcr.io, artifact registry, etc.)
   */
  registry: Schema.String,

  /**
   * Repository path within registry
   */
  repository: Schema.String,

  /**
   * Timestamp when image was built (ISO 8601)
   */
  builtAt: Schema.String,

  /**
   * Image size in bytes
   */
  sizeBytes: Schema.Number,

  /**
   * Build source commit SHA (optional)
   */
  commitSha: Schema.optional(Schema.String)
})

export type BuiltContainerImage = Schema.Schema.Type<typeof BuiltContainerImageSchema>

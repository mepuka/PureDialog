import { Schema } from "effect"

/**
 * GCP Project ID
 * Format: lowercase alphanumeric + hyphens, 6-30 chars
 * Example: "gen-lang-client-0874846742"
 */
export const GcpProjectId = Schema.String.pipe(
  Schema.brand("GcpProjectId"),
  Schema.pattern(/^[a-z][-a-z0-9]{4,28}[a-z0-9]$/),
  Schema.annotations({
    identifier: "GcpProjectId",
    title: "GCP Project ID",
    description: "Google Cloud Platform project identifier"
  })
)

export type GcpProjectId = Schema.Schema.Type<typeof GcpProjectId>

/**
 * GCP Region
 * Format: {continent}-{direction}{number}
 * Example: "us-west1", "europe-west2"
 */
export const GcpRegion = Schema.String.pipe(
  Schema.brand("GcpRegion"),
  Schema.pattern(/^[a-z]+-[a-z]+\d+$/),
  Schema.annotations({
    identifier: "GcpRegion",
    title: "GCP Region",
    description: "Google Cloud Platform region identifier"
  })
)

export type GcpRegion = Schema.Schema.Type<typeof GcpRegion>

/**
 * Service Account Email
 * Format: {name}@{project}.iam.gserviceaccount.com
 * Example: "211636922435-compute@developer.gserviceaccount.com"
 */
export const ServiceAccountEmail = Schema.String.pipe(
  Schema.brand("ServiceAccountEmail"),
  Schema.pattern(/^.+@.+\.gserviceaccount\.com$/),
  Schema.annotations({
    identifier: "ServiceAccountEmail",
    title: "Service Account Email",
    description: "Google Cloud service account email address"
  })
)

export type ServiceAccountEmail = Schema.Schema.Type<typeof ServiceAccountEmail>

/**
 * Container Image URI
 * Format: {registry}/{project}/{image}:{tag}
 * Example: "gcr.io/my-project/my-service:latest"
 */
export const ContainerImageUri = Schema.String.pipe(
  Schema.brand("ContainerImageUri"),
  Schema.pattern(/^[a-z0-9.-]+\/[a-z0-9-_./]+:[a-z0-9-_.]+$/),
  Schema.annotations({
    identifier: "ContainerImageUri",
    title: "Container Image URI",
    description: "Container registry image URI with tag"
  })
)

export type ContainerImageUri = Schema.Schema.Type<typeof ContainerImageUri>

/**
 * GCS Bucket Name
 * Format: lowercase alphanumeric + hyphens + underscores, 3-63 chars
 * Example: "my-bucket-name"
 */
export const GcsBucketName = Schema.String.pipe(
  Schema.brand("GcsBucketName"),
  Schema.pattern(/^[a-z0-9][a-z0-9-_]{1,61}[a-z0-9]$/),
  Schema.annotations({
    identifier: "GcsBucketName",
    title: "GCS Bucket Name",
    description: "Google Cloud Storage bucket name"
  })
)

export type GcsBucketName = Schema.Schema.Type<typeof GcsBucketName>

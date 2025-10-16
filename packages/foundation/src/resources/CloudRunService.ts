import { Schema } from "effect"
import { ContainerImageUri, GcpProjectId, GcpRegion, ServiceAccountEmail } from "../types/index.js"

/**
 * Cloud Run Service Status
 */
export const CloudRunServiceStatus = Schema.Literal("READY", "DEPLOYING", "FAILED", "UNKNOWN")

export type CloudRunServiceStatus = Schema.Schema.Type<typeof CloudRunServiceStatus>

/**
 * Cloud Run Service URL
 * Format: https://{service}-{hash}-{region-code}.a.run.app
 */
export const CloudRunServiceUrl = Schema.String.pipe(
  Schema.brand("CloudRunServiceUrl"),
  Schema.pattern(/^https:\/\/[a-z0-9-]+-[a-z0-9]+-[a-z]{2}\.a\.run\.app$/),
  Schema.annotations({
    identifier: "CloudRunServiceUrl",
    title: "Cloud Run Service URL",
    description: "Public HTTPS URL for Cloud Run service"
  })
)

export type CloudRunServiceUrl = Schema.Schema.Type<typeof CloudRunServiceUrl>

/**
 * Cloud Run Service Name
 * Format: lowercase alphanumeric + hyphens, 1-63 chars
 */
export const CloudRunServiceName = Schema.String.pipe(
  Schema.brand("CloudRunServiceName"),
  Schema.pattern(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/),
  Schema.annotations({
    identifier: "CloudRunServiceName",
    title: "Cloud Run Service Name",
    description: "Name of Cloud Run service"
  })
)

export type CloudRunServiceName = Schema.Schema.Type<typeof CloudRunServiceName>

/**
 * Deployed Cloud Run Service
 *
 * Immutable data structure representing a deployed Cloud Run service.
 * This is the "output" of a deployment operation.
 */
export const DeployedCloudRunServiceSchema = Schema.Struct({
  /**
   * Service name
   */
  name: CloudRunServiceName,

  /**
   * GCP project where service is deployed
   */
  projectId: GcpProjectId,

  /**
   * Region where service is deployed
   */
  region: GcpRegion,

  /**
   * Public HTTPS URL
   */
  url: CloudRunServiceUrl,

  /**
   * Container image running in the service
   */
  image: ContainerImageUri,

  /**
   * Service account used by the service
   */
  serviceAccount: ServiceAccountEmail,

  /**
   * Current deployment status
   */
  status: CloudRunServiceStatus,

  /**
   * Latest deployed revision name
   */
  latestRevision: Schema.String,

  /**
   * Timestamp when service was last deployed (ISO 8601)
   */
  deployedAt: Schema.String,

  /**
   * Environment variables (optional)
   */
  env: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String }))
})

export type DeployedCloudRunService = Schema.Schema.Type<typeof DeployedCloudRunServiceSchema>

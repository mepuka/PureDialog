import * as gcp from "@pulumi/gcp"
import * as pulumi from "@pulumi/pulumi"
import * as random from "@pulumi/random"

// Type definitions for Eventarc resources
type PipelineDestination = {
  httpEndpoint?: {
    uri: pulumi.Input<string>
    messageBindingTemplate?: pulumi.Input<string>
  }
  authenticationConfig?: {
    googleOidc?: {
      serviceAccount: pulumi.Input<string>
      audience?: pulumi.Input<string>
    }
    oauthToken?: {
      serviceAccount: pulumi.Input<string>
      scope?: pulumi.Input<string>
    }
  }
  networkConfig?: {
    networkAttachment: pulumi.Input<string>
  }
  outputPayloadFormat?: {
    json?: Record<string, never>
    avro?: { schemaDefinition: pulumi.Input<string> }
    protobuf?: { schemaDefinition: pulumi.Input<string> }
  }
  topic?: pulumi.Input<string>
  messageBus?: pulumi.Input<string>
  workflow?: pulumi.Input<string>
}

type LoggingConfig = {
  logSeverity?: pulumi.Input<
    | "NONE"
    | "DEBUG"
    | "INFO"
    | "NOTICE"
    | "WARNING"
    | "ERROR"
    | "CRITICAL"
    | "ALERT"
    | "EMERGENCY"
  >
}

// GCS path patterns for state-triggered choreography
const GCS_PATHS = {
  JOBS_QUEUED: "jobs/Queued/",
  JOBS_PROCESSING: "jobs/Processing/",
  JOBS_COMPLETED: "jobs/Completed/",
  JOBS_FAILED: "jobs/Failed/"
} as const

// GCS event type for object finalization
const GCS_EVENT_TYPE = "google.cloud.storage.object.v1.finalized" as const

// Eventarc Advanced location (where MessageBus exists)
const EVENTARC_LOCATION = "us-central1" as const

// Helper to build CEL expression for GCS object path filtering
// Eventarc Advanced uses CloudEvents format:
// - message.type: event type (e.g., "google.cloud.storage.object.v1.finalized")
// - message.source: source URI (e.g., "//storage.googleapis.com/projects/_/buckets/BUCKET_NAME")
// - message.subject: object path (e.g., "objects/jobs/Queued/file.json")
const buildGcsEventFilter = (
  bucketName: pulumi.Output<string>,
  pathPrefix: string
): pulumi.Output<string> =>
  pulumi
    .interpolate`message.type == "${GCS_EVENT_TYPE}" && message.source.endsWith("/buckets/${bucketName}") && message.subject.startsWith("objects/${pathPrefix}")`

// Helper to create Pipeline destination for Cloud Run service with OIDC auth
const createCloudRunDestination = (
  serviceUri: pulumi.Output<string>,
  serviceAccount: string,
  path?: string
): PipelineDestination => ({
  httpEndpoint: {
    uri: path ? pulumi.interpolate`${serviceUri}${path}` : serviceUri
  },
  authenticationConfig: {
    googleOidc: {
      serviceAccount
    }
  }
})

// Helper to create logging config for Eventarc resources
const createLoggingConfig = (
  logSeverity: LoggingConfig["logSeverity"] = "INFO"
): LoggingConfig => ({
  logSeverity
})

interface CloudRunServiceConfig {
  readonly serviceName: string
  readonly image: string
  readonly cpu?: string
  readonly memory?: string
  readonly minInstances?: number
  readonly maxInstances?: number
  readonly concurrency?: number
}

interface PubSubConfig {
  readonly eventsTopic: string
  readonly eventsMonitorSubscription: string
}

interface StorageConfig {
  readonly bucketBaseName: string
}

interface StackConfig {
  readonly project: string
  readonly region: string
  readonly serviceAccountEmail: string
  readonly services: {
    readonly api: CloudRunServiceConfig
    readonly metadataWorker: CloudRunServiceConfig
    readonly transcriptionWorker: CloudRunServiceConfig
  }
  readonly pubsub: PubSubConfig
  readonly storage: StorageConfig
}

const gcpConfig = new pulumi.Config("gcp")
const cloudRunConfig = new pulumi.Config("cloudrun")
const pubsubConfig = new pulumi.Config("pubsub")
const storageConfig = new pulumi.Config("storage")
const envConfig = new pulumi.Config("env")

const youtubeApiKey = envConfig.requireSecret("youtubeApiKey")

const defaultStackConfig: StackConfig = {
  project: gcpConfig.get("project") ?? "gen-lang-client-0874846742",
  region: gcpConfig.get("region") ?? "us-west1",
  serviceAccountEmail: cloudRunConfig.get("serviceAccount")
    ?? "211636922435-compute@developer.gserviceaccount.com",
  services: {
    api: {
      serviceName: cloudRunConfig.get("apiServiceName") ?? "api",
      image: cloudRunConfig.require("apiImage"),
      cpu: cloudRunConfig.get("apiCpu") ?? "1",
      memory: cloudRunConfig.get("apiMemory") ?? "512Mi",
      minInstances: cloudRunConfig.getNumber("apiMinInstances") ?? 0,
      maxInstances: cloudRunConfig.getNumber("apiMaxInstances") ?? 2,
      concurrency: cloudRunConfig.getNumber("apiConcurrency") ?? 80
    },
    metadataWorker: {
      serviceName: cloudRunConfig.get("metadataServiceName") ?? "worker-metadata",
      image: cloudRunConfig.require("metadataImage"),
      cpu: cloudRunConfig.get("metadataCpu") ?? "1",
      memory: cloudRunConfig.get("metadataMemory") ?? "512Mi",
      minInstances: cloudRunConfig.getNumber("metadataMinInstances") ?? 0,
      maxInstances: cloudRunConfig.getNumber("metadataMaxInstances") ?? 2,
      concurrency: cloudRunConfig.getNumber("metadataConcurrency") ?? 10
    },
    transcriptionWorker: {
      serviceName: cloudRunConfig.get("transcriptionServiceName")
        ?? "worker-transcription",
      image: cloudRunConfig.require("transcriptionImage"),
      cpu: cloudRunConfig.get("transcriptionCpu") ?? "1",
      memory: cloudRunConfig.get("transcriptionMemory") ?? "512Mi",
      minInstances: cloudRunConfig.getNumber("transcriptionMinInstances") ?? 0,
      maxInstances: cloudRunConfig.getNumber("transcriptionMaxInstances") ?? 2,
      concurrency: cloudRunConfig.getNumber("transcriptionConcurrency") ?? 10
    }
  },
  pubsub: {
    eventsTopic: pubsubConfig.get("eventsTopic") ?? "events",
    eventsMonitorSubscription: pubsubConfig.get("eventsMonitorSubscription") ?? "events-monitor"
  },
  storage: {
    bucketBaseName: storageConfig.get("bucketBaseName") ?? "ingestion-shared-artifacts"
  }
}

export const stackMetadata = {
  project: pulumi.getProject(),
  stack: pulumi.getStack()
}

export const configuration: StackConfig = defaultStackConfig

const envVars = (vars: Record<string, pulumi.Input<string>>) =>
  Object.entries(vars).map(([name, value]) => ({ name, value }))

const projectId = configuration.project

// Shared storage bucket (retained from previous architecture)
const bucketSuffix = new random.RandomString("sharedArtifactsBucketSuffix", {
  length: 6,
  special: false,
  upper: false
})

export const sharedArtifactsBucket = new gcp.storage.Bucket(
  "sharedArtifactsBucket",
  {
    name: pulumi.interpolate`${configuration.storage.bucketBaseName}-${bucketSuffix.result}`,
    location: configuration.region,
    uniformBucketLevelAccess: true,
    forceDestroy: false,
    labels: {
      environment: stackMetadata.stack,
      managed_by: "pulumi"
    }
  }
)

export const eventsTopic = new gcp.pubsub.Topic("eventsTopic", {
  name: configuration.pubsub.eventsTopic
})

const createService = (
  logicalName: string,
  config: CloudRunServiceConfig,
  env: Record<string, pulumi.Input<string>>,
  ingress:
    | "INGRESS_TRAFFIC_ALL"
    | "INGRESS_TRAFFIC_INTERNAL_ONLY"
    | "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
) =>
  new gcp.cloudrunv2.Service(logicalName, {
    project: projectId,
    location: configuration.region,
    name: config.serviceName,
    ingress,
    template: {
      serviceAccount: configuration.serviceAccountEmail,
      maxInstanceRequestConcurrency: config.concurrency ?? 80,
      scaling: {
        minInstanceCount: config.minInstances ?? 0,
        maxInstanceCount: config.maxInstances ?? 1
      },
      containers: [
        {
          image: config.image,
          envs: envVars(env),
          resources: {
            limits: {
              cpu: config.cpu ?? "1",
              memory: config.memory ?? "512Mi"
            }
          }
        }
      ]
    },
    labels: {
      environment: stackMetadata.stack,
      managed_by: "pulumi"
    }
  })

const apiService = createService(
  "apiService",
  configuration.services.api,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey
  },
  "INGRESS_TRAFFIC_ALL"
)

const metadataWorkerService = createService(
  "metadataWorkerService",
  configuration.services.metadataWorker,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey
  },
  "INGRESS_TRAFFIC_ALL"
)

const transcriptionWorkerService = createService(
  "transcriptionWorkerService",
  configuration.services.transcriptionWorker,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey
  },
  "INGRESS_TRAFFIC_ALL"
)

// IAM bindings
new gcp.cloudrunv2.ServiceIamMember("apiPublicInvoker", {
  project: projectId,
  location: configuration.region,
  name: apiService.name,
  role: "roles/run.invoker",
  member: "allUsers"
})

const pubsubInvokerMember = pulumi.interpolate`serviceAccount:${configuration.serviceAccountEmail}`

new gcp.cloudrunv2.ServiceIamMember("metadataInvoker", {
  project: projectId,
  location: configuration.region,
  name: metadataWorkerService.name,
  role: "roles/run.invoker",
  member: pubsubInvokerMember
})

new gcp.cloudrunv2.ServiceIamMember("transcriptionInvoker", {
  project: projectId,
  location: configuration.region,
  name: transcriptionWorkerService.name,
  role: "roles/run.invoker",
  member: pubsubInvokerMember
})

// Allow Cloud Run service account to read/write objects in the shared bucket
new gcp.storage.BucketIAMMember("sharedBucketObjectAdmin", {
  bucket: sharedArtifactsBucket.name,
  role: "roles/storage.objectAdmin",
  member: pubsubInvokerMember
})

/**
 * EVENTARC ADVANCED PATTERN - State-Triggered Choreography with MessageBus
 *
 * Architecture:
 * 1. GoogleApiSource: Connects GCS events to existing MessageBus (us-central1)
 * 2. MessageBus: Existing "main" MessageBus in us-central1 (cross-region)
 * 3. Pipelines (3): Route events to Cloud Run destinations (us-west1)
 * 4. Enrollments (3): Filter MessageBus events to appropriate Pipelines via CEL expressions
 *
 * Flow: GCS → GoogleApiSource → MessageBus → Enrollment (CEL filter) → Pipeline → Cloud Run
 *
 * Note: Eventarc Advanced resources (MessageBus, Pipelines, Enrollments) are in us-central1
 *       Cloud Run services remain in us-west1 (cross-region HTTP calls)
 */

// MessageBus configuration
const messageBusId = "main"

// 1. Reference existing MessageBus in us-central1
// Format: projects/{project}/locations/{location}/messageBuses/{messageBusId}
const messageBusName = pulumi
  .interpolate`projects/${projectId}/locations/${EVENTARC_LOCATION}/messageBuses/${messageBusId}`

// 2. Create GoogleApiSource - Connects GCS to MessageBus
export const gcsSource = new gcp.eventarc.GoogleApiSource("gcs-source", {
  location: EVENTARC_LOCATION,
  project: projectId,
  googleApiSourceId: "gcs-events",
  destination: messageBusName,
  displayName: "GCS Events Source",
  loggingConfig: createLoggingConfig("INFO"),
  labels: {
    environment: stackMetadata.stack,
    managed_by: "pulumi"
  }
})

// 3. Create Pipelines - Route events to Cloud Run services

// Pipeline 1: Metadata Worker
const metadataWorkerPipeline = new gcp.eventarc.Pipeline("metadata-worker-pipeline", {
  location: EVENTARC_LOCATION,
  project: projectId,
  pipelineId: "metadata-worker",
  displayName: "Metadata Worker Pipeline",
  destinations: [
    createCloudRunDestination(
      metadataWorkerService.uri,
      configuration.serviceAccountEmail
    )
  ],
  loggingConfig: createLoggingConfig("INFO"),
  labels: {
    environment: stackMetadata.stack,
    managed_by: "pulumi",
    worker: "metadata"
  }
})

// Pipeline 2: Transcription Worker
const transcriptionWorkerPipeline = new gcp.eventarc.Pipeline("transcription-worker-pipeline", {
  location: EVENTARC_LOCATION,
  project: projectId,
  pipelineId: "transcription-worker",
  displayName: "Transcription Worker Pipeline",
  destinations: [
    createCloudRunDestination(
      transcriptionWorkerService.uri,
      configuration.serviceAccountEmail
    )
  ],
  loggingConfig: createLoggingConfig("INFO"),
  labels: {
    environment: stackMetadata.stack,
    managed_by: "pulumi",
    worker: "transcription"
  }
})

// Pipeline 3: Notifications (API)
const notificationsPipeline = new gcp.eventarc.Pipeline("notifications-pipeline", {
  location: EVENTARC_LOCATION,
  project: projectId,
  pipelineId: "notifications",
  displayName: "Notifications Pipeline",
  destinations: [
    createCloudRunDestination(
      apiService.uri,
      configuration.serviceAccountEmail,
      "/internal/notifications"
    )
  ],

  loggingConfig: createLoggingConfig("INFO"),
  labels: {
    environment: stackMetadata.stack,
    managed_by: "pulumi",
    type: "notifications"
  }
})

// 4. Create Enrollments - Filter events and route to pipelines using CEL expressions

// Enrollment 1: jobs/Queued/ → Metadata Worker
export const metadataEnrollment = new gcp.eventarc.Enrollment("metadata-enrollment", {
  location: EVENTARC_LOCATION,
  project: projectId,
  enrollmentId: "metadata-worker",
  messageBus: messageBusName,
  destination: metadataWorkerPipeline.id,
  displayName: "Metadata Worker Enrollment",

  celMatch: buildGcsEventFilter(sharedArtifactsBucket.name, GCS_PATHS.JOBS_QUEUED),

  labels: {
    environment: stackMetadata.stack,
    managed_by: "pulumi",
    worker: "metadata"
  }
})

// Enrollment 2: jobs/Processing/ → Transcription Worker
export const transcriptionEnrollment = new gcp.eventarc.Enrollment("transcription-enrollment", {
  location: EVENTARC_LOCATION,
  project: projectId,
  enrollmentId: "transcription-worker",
  messageBus: messageBusName,
  destination: transcriptionWorkerPipeline.id,
  displayName: "Transcription Worker Enrollment",
  celMatch: buildGcsEventFilter(sharedArtifactsBucket.name, GCS_PATHS.JOBS_PROCESSING),
  labels: {
    environment: stackMetadata.stack,
    managed_by: "pulumi",
    worker: "transcription"
  }
})

// Enrollment 3: jobs/Completed/ → Notifications
export const notificationsEnrollment = new gcp.eventarc.Enrollment("notifications-enrollment", {
  location: EVENTARC_LOCATION,
  project: projectId,
  enrollmentId: "notifications",
  messageBus: messageBusName,
  destination: notificationsPipeline.id,
  displayName: "Notifications Enrollment",
  celMatch: buildGcsEventFilter(sharedArtifactsBucket.name, GCS_PATHS.JOBS_COMPLETED),
  labels: {
    environment: stackMetadata.stack,
    managed_by: "pulumi",
    type: "notifications"
  }
})

export const eventsMonitorSubscription = new gcp.pubsub.Subscription(
  "eventsMonitorSubscription",
  {
    name: configuration.pubsub.eventsMonitorSubscription,
    topic: eventsTopic.name,
    ackDeadlineSeconds: 30
  }
)

export const apiUrl = apiService.uri
export const metadataWorkerUrl = metadataWorkerService.uri
export const transcriptionWorkerUrl = transcriptionWorkerService.uri

import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
// import { EVENTARC_PATTERNS } from "@puredialog/storage";

// Temporarily inline patterns for build compatibility
const EVENTARC_PATTERNS = {
  JOB_EVENTS: "jobs/{status}/{jobId}.json",
  TRANSCRIPT_EVENTS: "transcripts/{transcriptId}.json",
  EVENT_LOG: "events/{jobId}/{eventId}.json"
} as const;

interface CloudRunServiceConfig {
  readonly serviceName: string;
  readonly image: string;
  readonly cpu?: string;
  readonly memory?: string;
  readonly minInstances?: number;
  readonly maxInstances?: number;
  readonly concurrency?: number;
}

interface PubSubConfig {
  readonly eventsTopic: string;
  readonly eventsMonitorSubscription: string;
}

interface StorageConfig {
  readonly bucketBaseName: string;
}

interface StackConfig {
  readonly project: string;
  readonly region: string;
  readonly serviceAccountEmail: string;
  readonly services: {
    readonly api: CloudRunServiceConfig;
    readonly metadataWorker: CloudRunServiceConfig;
    readonly transcriptionWorker: CloudRunServiceConfig;
  };
  readonly pubsub: PubSubConfig;
  readonly storage: StorageConfig;
}

const gcpConfig = new pulumi.Config("gcp");
const cloudRunConfig = new pulumi.Config("cloudrun");
const pubsubConfig = new pulumi.Config("pubsub");
const storageConfig = new pulumi.Config("storage");
const envConfig = new pulumi.Config("env");

const youtubeApiKey = envConfig.requireSecret("youtubeApiKey");

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
      concurrency: cloudRunConfig.getNumber("apiConcurrency") ?? 80,
    },
    metadataWorker: {
      serviceName: cloudRunConfig.get("metadataServiceName") ?? "worker-metadata",
      image: cloudRunConfig.require("metadataImage"),
      cpu: cloudRunConfig.get("metadataCpu") ?? "1",
      memory: cloudRunConfig.get("metadataMemory") ?? "512Mi",
      minInstances: cloudRunConfig.getNumber("metadataMinInstances") ?? 0,
      maxInstances: cloudRunConfig.getNumber("metadataMaxInstances") ?? 2,
      concurrency: cloudRunConfig.getNumber("metadataConcurrency") ?? 10,
    },
    transcriptionWorker: {
      serviceName: cloudRunConfig.get("transcriptionServiceName")
        ?? "worker-transcription",
      image: cloudRunConfig.require("transcriptionImage"),
      cpu: cloudRunConfig.get("transcriptionCpu") ?? "1",
      memory: cloudRunConfig.get("transcriptionMemory") ?? "512Mi",
      minInstances: cloudRunConfig.getNumber("transcriptionMinInstances") ?? 0,
      maxInstances: cloudRunConfig.getNumber("transcriptionMaxInstances") ?? 2,
      concurrency: cloudRunConfig.getNumber("transcriptionConcurrency") ?? 10,
    },
  },
  pubsub: {
    eventsTopic: pubsubConfig.get("eventsTopic") ?? "events",
    eventsMonitorSubscription: pubsubConfig.get("eventsMonitorSubscription") ?? "events-monitor",
  },
  storage: {
    bucketBaseName: storageConfig.get("bucketBaseName") ?? "ingestion-shared-artifacts",
  },
};

export const stackMetadata = {
  project: pulumi.getProject(),
  stack: pulumi.getStack(),
};

export const configuration: StackConfig = defaultStackConfig;

const envVars = (vars: Record<string, pulumi.Input<string>>) =>
  Object.entries(vars).map(([name, value]) => ({ name, value }));

const projectId = configuration.project;

// Shared storage bucket (retained from previous architecture)
const bucketSuffix = new random.RandomString("sharedArtifactsBucketSuffix", {
  length: 6,
  special: false,
  upper: false,
});

export const sharedArtifactsBucket = new gcp.storage.Bucket(
  "sharedArtifactsBucket",
  {
    name: pulumi.interpolate`${configuration.storage.bucketBaseName}-${bucketSuffix.result}`,
    location: configuration.region,
    uniformBucketLevelAccess: true,
    forceDestroy: false,
    labels: {
      environment: stackMetadata.stack,
      managed_by: "pulumi",
    },
  },
);


export const eventsTopic = new gcp.pubsub.Topic("eventsTopic", {
  name: configuration.pubsub.eventsTopic,
});

const createService = (
  logicalName: string,
  config: CloudRunServiceConfig,
  env: Record<string, pulumi.Input<string>>,
  ingress:
    | "INGRESS_TRAFFIC_ALL"
    | "INGRESS_TRAFFIC_INTERNAL_ONLY"
    | "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER",
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
        maxInstanceCount: config.maxInstances ?? 1,
      },
      containers: [
        {
          image: config.image,
          envs: envVars(env),
          resources: {
            limits: {
              cpu: config.cpu ?? "1",
              memory: config.memory ?? "512Mi",
            },
          },
        },
      ],
    },
    labels: {
      environment: stackMetadata.stack,
      managed_by: "pulumi",
    },
  });

const apiService = createService(
  "apiService",
  configuration.services.api,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
  },
  "INGRESS_TRAFFIC_ALL",
);

const metadataWorkerService = createService(
  "metadataWorkerService",
  configuration.services.metadataWorker,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
  },
  "INGRESS_TRAFFIC_ALL",
);

const transcriptionWorkerService = createService(
  "transcriptionWorkerService",
  configuration.services.transcriptionWorker,
  {
    NODE_ENV: "production",
    GCS_PROJECT_ID: projectId,
    GCS_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
  },
  "INGRESS_TRAFFIC_ALL",
);

// IAM bindings
new gcp.cloudrunv2.ServiceIamMember("apiPublicInvoker", {
  project: projectId,
  location: configuration.region,
  name: apiService.name,
  role: "roles/run.invoker",
  member: "allUsers",
});

const pubsubInvokerMember = pulumi.interpolate`serviceAccount:${configuration.serviceAccountEmail}`;

new gcp.cloudrunv2.ServiceIamMember("metadataInvoker", {
  project: projectId,
  location: configuration.region,
  name: metadataWorkerService.name,
  role: "roles/run.invoker",
  member: pubsubInvokerMember,
});

new gcp.cloudrunv2.ServiceIamMember("transcriptionInvoker", {
  project: projectId,
  location: configuration.region,
  name: transcriptionWorkerService.name,
  role: "roles/run.invoker",
  member: pubsubInvokerMember,
});

// Allow Cloud Run service account to read/write objects in the shared bucket
new gcp.storage.BucketIAMMember("sharedBucketObjectAdmin", {
  bucket: sharedArtifactsBucket.name,
  role: "roles/storage.objectAdmin",
  member: pubsubInvokerMember,
});

// Eventarc triggers for State-Triggered Choreography
const triggerServiceAccount = configuration.serviceAccountEmail;

// Trigger 1: jobs/Queued → worker-metadata
export const triggerMetadataWorker = new gcp.eventarc.Trigger("trigger-metadata-worker", {
  location: configuration.region,
  project: projectId,
  destination: {
    cloudRunService: {
      service: metadataWorkerService.name,
      region: configuration.region,
    },
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: sharedArtifactsBucket.name },
    { attribute: "objectName", value: EVENTARC_PATTERNS.JOB_EVENTS.replace("{status}", "Queued"), operator: "match-path-pattern" },
  ],
  serviceAccount: triggerServiceAccount,
});

// Trigger 2: jobs/Processing → worker-transcription
export const triggerTranscriptionWorker = new gcp.eventarc.Trigger("trigger-transcription-worker", {
  location: configuration.region,
  project: projectId,
  destination: {
    cloudRunService: {
      service: transcriptionWorkerService.name,
      region: configuration.region,
    },
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: sharedArtifactsBucket.name },
    { attribute: "objectName", value: EVENTARC_PATTERNS.JOB_EVENTS.replace("{status}", "Processing"), operator: "match-path-pattern" },
  ],
  serviceAccount: triggerServiceAccount,
});

// Trigger 3: jobs/Completed → API notifications endpoint
export const triggerNotifications = new gcp.eventarc.Trigger("trigger-notifications", {
  location: configuration.region,
  project: projectId,
  destination: {
    cloudRunService: {
      service: apiService.name,
      region: configuration.region,
      path: "/_internal/notifications",
    },
  },
  transport: {
    pubsub: { topic: eventsTopic.id },
  },
  matchingCriterias: [
    { attribute: "type", value: "google.cloud.storage.object.v1.finalized" },
    { attribute: "bucket", value: sharedArtifactsBucket.name },
    { attribute: "objectName", value: EVENTARC_PATTERNS.JOB_EVENTS.replace("{status}", "Completed"), operator: "match-path-pattern" },
  ],
  serviceAccount: triggerServiceAccount,
});

export const eventsMonitorSubscription = new gcp.pubsub.Subscription(
  "eventsMonitorSubscription",
  {
    name: configuration.pubsub.eventsMonitorSubscription,
    topic: eventsTopic.name,
    ackDeadlineSeconds: 30,
  },
);

export const apiUrl = apiService.uri;
export const metadataWorkerUrl = metadataWorkerService.uri;
export const transcriptionWorkerUrl = transcriptionWorkerService.uri;

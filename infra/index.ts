import * as pulumi from "@pulumi/pulumi";

/**
 * High level configuration surface for the infrastructure stack.
 * These interfaces capture the intent from the architecture plan so
 * subsequent resource definitions can rely on strong typing.
 */
export interface ServiceConfig {
  readonly serviceName: string;
  readonly entrypoint: string;
  readonly runtime: "nodejs24";
  readonly instanceClass: string;
}

export interface PubSubConfig {
  readonly workTopic: string;
  readonly eventsTopic: string;
  readonly dlqTopic: string;
  readonly metadataSubscription: string;
  readonly transcriptionSubscription: string;
  readonly eventsMonitorSubscription: string;
}

export interface StorageConfig {
  readonly bucketBaseName: string;
}

export interface StackConfig {
  readonly region: string;
  readonly appEngineProject: string;
  readonly services: {
    readonly api: ServiceConfig;
    readonly metadataWorker: ServiceConfig;
    readonly transcriptionWorker: ServiceConfig;
  };
  readonly pubsub: PubSubConfig;
  readonly storage: StorageConfig;
}

const rootConfig = new pulumi.Config();
const appConfig = new pulumi.Config("appEngine");
const pubsubConfig = new pulumi.Config("pubsub");
const storageConfig = new pulumi.Config("storage");

const defaultStackConfig: StackConfig = {
  region: rootConfig.get("gcp:region") ?? "us-central1",
  appEngineProject: appConfig.get("project") ?? pulumi.getProject(),
  services: {
    api: {
      serviceName: appConfig.get("apiServiceName") ?? "default",
      entrypoint: "pnpm start",
      runtime: "nodejs24",
      instanceClass: appConfig.get("instanceClass") ?? "F2",
    },
    metadataWorker: {
      serviceName: appConfig.get("metadataServiceName") ?? "worker-metadata",
      entrypoint: "pnpm start",
      runtime: "nodejs24",
      instanceClass: appConfig.get("metadataInstanceClass") ?? "F2",
    },
    transcriptionWorker: {
      serviceName: appConfig.get("transcriptionServiceName") ?? "worker-transcription",
      entrypoint: "pnpm start",
      runtime: "nodejs24",
      instanceClass: appConfig.get("transcriptionInstanceClass") ?? "F2",
    },
  },
  pubsub: {
    workTopic: pubsubConfig.get("workTopic") ?? "ingestion-work",
    eventsTopic: pubsubConfig.get("eventsTopic") ?? "ingestion-events",
    dlqTopic: pubsubConfig.get("dlqTopic") ?? "ingestion-work-dlq",
    metadataSubscription: pubsubConfig.get("metadataSubscription") ?? "ingestion-work-metadata",
    transcriptionSubscription: pubsubConfig.get("transcriptionSubscription") ?? "ingestion-work-transcription",
    eventsMonitorSubscription: pubsubConfig.get("eventsMonitorSubscription") ?? "ingestion-events-monitor",
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

/* eslint-disable @effect/dprint */
import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";

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
  readonly versionId?: string;
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
  readonly appEngineServiceAccount: string;
  readonly services: {
    readonly api: ServiceConfig;
    readonly metadataWorker: ServiceConfig;
    readonly transcriptionWorker: ServiceConfig;
  };
  readonly pubsub: PubSubConfig;
  readonly storage: StorageConfig;
}

const gcpConfig = new pulumi.Config("gcp");
const appEngineConfig = new pulumi.Config("appEngine");
const pubsubConfig = new pulumi.Config("pubsub");
const storageConfig = new pulumi.Config("storage");

const defaultStackConfig: StackConfig = {
  region: gcpConfig.get("region") ?? "us-west1",
  appEngineProject:
    appEngineConfig.get("project") ??
    gcpConfig.get("project") ??
    "gen-lang-client-0874846742",
  appEngineServiceAccount:
    appEngineConfig.get("serviceAccount") ??
    "211636922435-compute@developer.gserviceaccount.com",
  services: {
    api: {
      serviceName: appEngineConfig.get("apiServiceName") ?? "default",
      entrypoint: "pnpm start",
      runtime: "nodejs24",
      instanceClass: appEngineConfig.get("instanceClass") ?? "F2",
      versionId: appEngineConfig.get("apiVersionId") ?? undefined,
    },
    metadataWorker: {
      serviceName:
        appEngineConfig.get("metadataServiceName") ?? "worker-metadata",
      entrypoint: "pnpm start",
      runtime: "nodejs24",
      instanceClass: appEngineConfig.get("metadataInstanceClass") ?? "F2",
    },
    transcriptionWorker: {
      serviceName:
        appEngineConfig.get("transcriptionServiceName") ??
        "worker-transcription",
      entrypoint: "pnpm start",
      runtime: "nodejs24",
      instanceClass: appEngineConfig.get("transcriptionInstanceClass") ?? "F2",
    },
  },
  pubsub: {
    workTopic: pubsubConfig.get("workTopic") ?? "work",
    eventsTopic: pubsubConfig.get("eventsTopic") ?? "events",
    dlqTopic: pubsubConfig.get("dlqTopic") ?? "work-dlq",
    metadataSubscription:
      pubsubConfig.get("metadataSubscription") ?? "work-metadata",
    transcriptionSubscription:
      pubsubConfig.get("transcriptionSubscription") ?? "work-transcription",
    eventsMonitorSubscription:
      pubsubConfig.get("eventsMonitorSubscription") ?? "events-monitor",
  },
  storage: {
    bucketBaseName:
      storageConfig.get("bucketBaseName") ?? "ingestion-shared-artifacts",
  },
};

export const stackMetadata = {
  project: pulumi.getProject(),
  stack: pulumi.getStack(),
};

export const configuration: StackConfig = defaultStackConfig;

const projectId = configuration.appEngineProject;
const apiServiceName = configuration.services.api.serviceName;
const apiVersionId = configuration.services.api.versionId;

/**
 * Reference the existing App Engine application so other resources can
 * depend on the established platform instead of attempting to recreate it.
 */
export const appEngineApplication = gcp.appengine.Application.get(
  "existingAppEngine",
  projectId
);

export const existingApiServiceVersion = apiVersionId
  ? gcp.appengine.StandardAppVersion.get(
      "existingApiService",
      `apps/${projectId}/services/${apiServiceName}/versions/${apiVersionId}`
    )
  : undefined;

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
  }
);

export const workTopic = new gcp.pubsub.Topic("workTopic", {
  name: configuration.pubsub.workTopic,
});

export const eventsTopic = new gcp.pubsub.Topic("eventsTopic", {
  name: configuration.pubsub.eventsTopic,
});

export const dlqTopic = new gcp.pubsub.Topic("workDlqTopic", {
  name: configuration.pubsub.dlqTopic,
});

const metadataPushEndpoint = pulumi.interpolate`https://${configuration.services.metadataWorker.serviceName}-dot-${projectId}.appspot.com/pubsub`;
const transcriptionPushEndpoint = pulumi.interpolate`https://${configuration.services.transcriptionWorker.serviceName}-dot-${projectId}.appspot.com/pubsub`;

export const metadataSubscription = new gcp.pubsub.Subscription(
  "metadataSubscription",
  {
    name: configuration.pubsub.metadataSubscription,
    topic: workTopic.name,
    ackDeadlineSeconds: 30,
    deadLetterPolicy: {
      deadLetterTopic: dlqTopic.id,
      maxDeliveryAttempts: 10,
    },
    retryPolicy: {
      maximumBackoff: "600s",
      minimumBackoff: "10s",
    },
    pushConfig: {
      pushEndpoint: metadataPushEndpoint,
      oidcToken: {
        serviceAccountEmail: configuration.appEngineServiceAccount,
        audience: metadataPushEndpoint,
      },
    },
  }
);

export const transcriptionSubscription = new gcp.pubsub.Subscription(
  "transcriptionSubscription",
  {
    name: configuration.pubsub.transcriptionSubscription,
    topic: workTopic.name,
    ackDeadlineSeconds: 30,
    deadLetterPolicy: {
      deadLetterTopic: dlqTopic.id,
      maxDeliveryAttempts: 10,
    },
    retryPolicy: {
      maximumBackoff: "600s",
      minimumBackoff: "10s",
    },
    pushConfig: {
      pushEndpoint: transcriptionPushEndpoint,
      oidcToken: {
        serviceAccountEmail: configuration.appEngineServiceAccount,
        audience: transcriptionPushEndpoint,
      },
    },
  }
);

export const eventsMonitorSubscription = new gcp.pubsub.Subscription(
  "eventsMonitorSubscription",
  {
    name: configuration.pubsub.eventsMonitorSubscription,
    topic: eventsTopic.name,
    ackDeadlineSeconds: 30,
    retainAckedMessages: false,
  }
);

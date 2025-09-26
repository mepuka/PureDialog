import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
const gcpConfig = new pulumi.Config("gcp");
const cloudRunConfig = new pulumi.Config("cloudrun");
const pubsubConfig = new pulumi.Config("pubsub");
const storageConfig = new pulumi.Config("storage");
const envConfig = new pulumi.Config("env");
const youtubeApiKey = envConfig.requireSecret("youtubeApiKey");
const defaultStackConfig = {
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
        workTopic: pubsubConfig.get("workTopic") ?? "work",
        eventsTopic: pubsubConfig.get("eventsTopic") ?? "events",
        dlqTopic: pubsubConfig.get("dlqTopic") ?? "work-dlq",
        metadataSubscription: pubsubConfig.get("metadataSubscription") ?? "work-metadata",
        transcriptionSubscription: pubsubConfig.get("transcriptionSubscription") ?? "work-transcription",
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
export const configuration = defaultStackConfig;
const envVars = (vars) => Object.entries(vars).map(([name, value]) => ({ name, value }));
const projectId = configuration.project;
// Shared storage bucket (retained from previous architecture)
const bucketSuffix = new random.RandomString("sharedArtifactsBucketSuffix", {
    length: 6,
    special: false,
    upper: false,
});
export const sharedArtifactsBucket = new gcp.storage.Bucket("sharedArtifactsBucket", {
    name: pulumi.interpolate `${configuration.storage.bucketBaseName}-${bucketSuffix.result}`,
    location: configuration.region,
    uniformBucketLevelAccess: true,
    forceDestroy: false,
    labels: {
        environment: stackMetadata.stack,
        managed_by: "pulumi",
    },
});
// Pub/Sub topics and subscriptions
export const workTopic = new gcp.pubsub.Topic("workTopic", {
    name: configuration.pubsub.workTopic,
});
export const eventsTopic = new gcp.pubsub.Topic("eventsTopic", {
    name: configuration.pubsub.eventsTopic,
});
export const dlqTopic = new gcp.pubsub.Topic("workDlqTopic", {
    name: configuration.pubsub.dlqTopic,
});
const createService = (logicalName, config, env, ingress) => new gcp.cloudrunv2.Service(logicalName, {
    project: projectId,
    location: configuration.region,
    name: config.serviceName,
    ingress,
    template: {
        serviceAccount: configuration.serviceAccountEmail,
        maxInstanceRequestConcurrency: config.concurrency,
        scaling: {
            minInstanceCount: config.minInstances,
            maxInstanceCount: config.maxInstances,
        },
        containers: [
            {
                image: config.image,
                ports: [{ containerPort: 8080 }],
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
const apiService = createService("apiService", configuration.services.api, {
    NODE_ENV: "production",
    PUBSUB_TOPIC_WORK: configuration.pubsub.workTopic,
    PUBSUB_TOPIC_EVENTS: configuration.pubsub.eventsTopic,
    SHARED_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
}, "INGRESS_TRAFFIC_ALL");
const metadataWorkerService = createService("metadataWorkerService", configuration.services.metadataWorker, {
    NODE_ENV: "production",
    PUBSUB_TOPIC_WORK: configuration.pubsub.workTopic,
    PUBSUB_TOPIC_EVENTS: configuration.pubsub.eventsTopic,
    PUBSUB_SUBSCRIPTION: configuration.pubsub.metadataSubscription,
    SHARED_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
}, "INGRESS_TRAFFIC_ALL");
const transcriptionWorkerService = createService("transcriptionWorkerService", configuration.services.transcriptionWorker, {
    NODE_ENV: "production",
    PUBSUB_TOPIC_WORK: configuration.pubsub.workTopic,
    PUBSUB_TOPIC_EVENTS: configuration.pubsub.eventsTopic,
    PUBSUB_SUBSCRIPTION: configuration.pubsub.transcriptionSubscription,
    SHARED_BUCKET: sharedArtifactsBucket.name,
    YOUTUBE_API_KEY: youtubeApiKey,
}, "INGRESS_TRAFFIC_ALL");
// IAM bindings
new gcp.cloudrunv2.ServiceIamMember("apiPublicInvoker", {
    project: projectId,
    location: configuration.region,
    name: apiService.name,
    role: "roles/run.invoker",
    member: "allUsers",
});
const pubsubInvokerMember = pulumi.interpolate `serviceAccount:${configuration.serviceAccountEmail}`;
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
// Pub/Sub subscriptions now target Cloud Run endpoints
const metadataPushEndpoint = metadataWorkerService.uri.apply((uri) => `${uri}/pubsub`);
const transcriptionPushEndpoint = transcriptionWorkerService.uri.apply((uri) => `${uri}/pubsub`);
export const metadataSubscription = new gcp.pubsub.Subscription("metadataSubscription", {
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
            serviceAccountEmail: configuration.serviceAccountEmail,
            audience: metadataPushEndpoint,
        },
    },
});
export const transcriptionSubscription = new gcp.pubsub.Subscription("transcriptionSubscription", {
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
            serviceAccountEmail: configuration.serviceAccountEmail,
            audience: transcriptionPushEndpoint,
        },
    },
});
export const eventsMonitorSubscription = new gcp.pubsub.Subscription("eventsMonitorSubscription", {
    name: configuration.pubsub.eventsMonitorSubscription,
    topic: eventsTopic.name,
    ackDeadlineSeconds: 30,
});
export const apiUrl = apiService.uri;
export const metadataWorkerUrl = metadataWorkerService.uri;
export const transcriptionWorkerUrl = transcriptionWorkerService.uri;
//# sourceMappingURL=index.js.map
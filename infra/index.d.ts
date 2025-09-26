import * as pulumi from "@pulumi/pulumi";
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
    readonly workTopic: string;
    readonly eventsTopic: string;
    readonly dlqTopic: string;
    readonly metadataSubscription: string;
    readonly transcriptionSubscription: string;
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
export declare const stackMetadata: {
    project: string;
    stack: string;
};
export declare const configuration: StackConfig;
export declare const sharedArtifactsBucket: import("@pulumi/gcp/storage/bucket.js").Bucket;
export declare const workTopic: import("@pulumi/gcp/pubsub/topic.js").Topic;
export declare const eventsTopic: import("@pulumi/gcp/pubsub/topic.js").Topic;
export declare const dlqTopic: import("@pulumi/gcp/pubsub/topic.js").Topic;
export declare const metadataSubscription: import("@pulumi/gcp/pubsub/subscription.js").Subscription;
export declare const transcriptionSubscription: import("@pulumi/gcp/pubsub/subscription.js").Subscription;
export declare const eventsMonitorSubscription: import("@pulumi/gcp/pubsub/subscription.js").Subscription;
export declare const apiUrl: pulumi.Output<string>;
export declare const metadataWorkerUrl: pulumi.Output<string>;
export declare const transcriptionWorkerUrl: pulumi.Output<string>;
export {};
//# sourceMappingURL=index.d.ts.map
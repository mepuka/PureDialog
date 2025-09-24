import { Schema } from "effect";
import { Data } from "effect";
/** TranscriptionJob processing status enumeration. */
export declare const JobStatus: Schema.Literal<["Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled"]>;
export type JobStatus = Schema.Schema.Type<typeof JobStatus>;
/** TranscriptionJob status transition as a tagged enum for better pattern matching. */
export type JobStatusTransition = Data.TaggedEnum<{
    Queued: {
        readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"];
        readonly isTerminal: false;
    };
    MetadataReady: {
        readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"];
        readonly isTerminal: false;
    };
    Processing: {
        readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"];
        readonly isTerminal: false;
    };
    Completed: {
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    };
    Failed: {
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    };
    Cancelled: {
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    };
}>;
/** Status transition constructors and utilities. */
export declare const QueuedTransition: Data.Case.Constructor<{
    readonly _tag: "Queued";
    readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"];
    readonly isTerminal: false;
}, "_tag">, MetadataReadyTransition: Data.Case.Constructor<{
    readonly _tag: "MetadataReady";
    readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"];
    readonly isTerminal: false;
}, "_tag">, ProcessingTransition: Data.Case.Constructor<{
    readonly _tag: "Processing";
    readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"];
    readonly isTerminal: false;
}, "_tag">, CompletedTransition: Data.Case.Constructor<{
    readonly _tag: "Completed";
    readonly allowedNext: readonly [];
    readonly isTerminal: true;
}, "_tag">, FailedTransition: Data.Case.Constructor<{
    readonly _tag: "Failed";
    readonly allowedNext: readonly [];
    readonly isTerminal: true;
}, "_tag">, CancelledTransition: Data.Case.Constructor<{
    readonly _tag: "Cancelled";
    readonly allowedNext: readonly [];
    readonly isTerminal: true;
}, "_tag">, isTransitionType: <Tag extends "Queued" | "MetadataReady" | "Processing" | "Completed" | "Failed" | "Cancelled">(tag: Tag) => (u: unknown) => u is Extract<{
    readonly _tag: "Queued";
    readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"];
    readonly isTerminal: false;
}, {
    readonly _tag: Tag;
}> | Extract<{
    readonly _tag: "MetadataReady";
    readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"];
    readonly isTerminal: false;
}, {
    readonly _tag: Tag;
}> | Extract<{
    readonly _tag: "Processing";
    readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"];
    readonly isTerminal: false;
}, {
    readonly _tag: Tag;
}> | Extract<{
    readonly _tag: "Completed";
    readonly allowedNext: readonly [];
    readonly isTerminal: true;
}, {
    readonly _tag: Tag;
}> | Extract<{
    readonly _tag: "Failed";
    readonly allowedNext: readonly [];
    readonly isTerminal: true;
}, {
    readonly _tag: Tag;
}> | Extract<{
    readonly _tag: "Cancelled";
    readonly allowedNext: readonly [];
    readonly isTerminal: true;
}, {
    readonly _tag: Tag;
}>, matchTransition: {
    <const Cases extends {
        readonly Queued: (args: {
            readonly _tag: "Queued";
            readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"];
            readonly isTerminal: false;
        }) => any;
        readonly MetadataReady: (args: {
            readonly _tag: "MetadataReady";
            readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"];
            readonly isTerminal: false;
        }) => any;
        readonly Processing: (args: {
            readonly _tag: "Processing";
            readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"];
            readonly isTerminal: false;
        }) => any;
        readonly Completed: (args: {
            readonly _tag: "Completed";
            readonly allowedNext: readonly [];
            readonly isTerminal: true;
        }) => any;
        readonly Failed: (args: {
            readonly _tag: "Failed";
            readonly allowedNext: readonly [];
            readonly isTerminal: true;
        }) => any;
        readonly Cancelled: (args: {
            readonly _tag: "Cancelled";
            readonly allowedNext: readonly [];
            readonly isTerminal: true;
        }) => any;
    }>(cases: Cases & { [K in Exclude<keyof Cases, "Queued" | "MetadataReady" | "Processing" | "Completed" | "Failed" | "Cancelled">]: never; }): (value: {
        readonly _tag: "Queued";
        readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"];
        readonly isTerminal: false;
    } | {
        readonly _tag: "MetadataReady";
        readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"];
        readonly isTerminal: false;
    } | {
        readonly _tag: "Processing";
        readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"];
        readonly isTerminal: false;
    } | {
        readonly _tag: "Completed";
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    } | {
        readonly _tag: "Failed";
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    } | {
        readonly _tag: "Cancelled";
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    }) => import("effect/Unify").Unify<ReturnType<Cases["Queued" | "MetadataReady" | "Processing" | "Completed" | "Failed" | "Cancelled"]>>;
    <const Cases extends {
        readonly Queued: (args: {
            readonly _tag: "Queued";
            readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"];
            readonly isTerminal: false;
        }) => any;
        readonly MetadataReady: (args: {
            readonly _tag: "MetadataReady";
            readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"];
            readonly isTerminal: false;
        }) => any;
        readonly Processing: (args: {
            readonly _tag: "Processing";
            readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"];
            readonly isTerminal: false;
        }) => any;
        readonly Completed: (args: {
            readonly _tag: "Completed";
            readonly allowedNext: readonly [];
            readonly isTerminal: true;
        }) => any;
        readonly Failed: (args: {
            readonly _tag: "Failed";
            readonly allowedNext: readonly [];
            readonly isTerminal: true;
        }) => any;
        readonly Cancelled: (args: {
            readonly _tag: "Cancelled";
            readonly allowedNext: readonly [];
            readonly isTerminal: true;
        }) => any;
    }>(value: {
        readonly _tag: "Queued";
        readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"];
        readonly isTerminal: false;
    } | {
        readonly _tag: "MetadataReady";
        readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"];
        readonly isTerminal: false;
    } | {
        readonly _tag: "Processing";
        readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"];
        readonly isTerminal: false;
    } | {
        readonly _tag: "Completed";
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    } | {
        readonly _tag: "Failed";
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    } | {
        readonly _tag: "Cancelled";
        readonly allowedNext: readonly [];
        readonly isTerminal: true;
    }, cases: Cases & { [K in Exclude<keyof Cases, "Queued" | "MetadataReady" | "Processing" | "Completed" | "Failed" | "Cancelled">]: never; }): import("effect/Unify").Unify<ReturnType<Cases["Queued" | "MetadataReady" | "Processing" | "Completed" | "Failed" | "Cancelled"]>>;
};
/** Get transition info for a given status. */
export declare const getStatusTransition: (status: JobStatus) => JobStatusTransition;
/** Check if a status transition is valid. */
export declare const isValidStatusTransition: (from: JobStatus, to: JobStatus) => boolean;
/** Check if a status is terminal (no further transitions allowed). */
export declare const isTerminalStatus: (status: JobStatus) => boolean;

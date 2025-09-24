import { Schema } from "effect";
/** Specifies a resource to be processed from input text. */
export declare const ResourceRequest: Schema.Struct<{
    /** Type of resource to extract and process */
    type: Schema.Literal<["youtube"]>;
    /** Optional specific identifier if known (e.g., video ID) */
    resourceId: Schema.optional<typeof Schema.String>;
    /** Optional additional processing options */
    options: Schema.optional<Schema.Record$<typeof Schema.String, typeof Schema.Unknown>>;
}>;
export type ResourceRequest = Schema.Schema.Type<typeof ResourceRequest>;
/** Request to create a new transcription job. */
export declare const CreateTranscriptionJobRequest: Schema.Struct<{
    /** User making the request */
    requestId: Schema.brand<typeof Schema.String, "RequestId">;
    /** Non-empty text input containing resource references */
    inputText: Schema.filter<typeof Schema.String>;
    /** Resources to extract and process from the input text */
    resources: Schema.filter<Schema.Array$<Schema.Struct<{
        /** Type of resource to extract and process */
        type: Schema.Literal<["youtube"]>;
        /** Optional specific identifier if known (e.g., video ID) */
        resourceId: Schema.optional<typeof Schema.String>;
        /** Optional additional processing options */
        options: Schema.optional<Schema.Record$<typeof Schema.String, typeof Schema.Unknown>>;
    }>>>;
}>;
export type CreateTranscriptionJobRequest = Schema.Schema.Type<typeof CreateTranscriptionJobRequest>;

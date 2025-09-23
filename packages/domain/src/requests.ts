import { Schema } from "@effect/schema";
import { RequestId } from "./ids";

/** Specifies a resource to be processed from input text. */
export const ResourceRequest = Schema.Struct({
  /** Type of resource to extract and process */
  type: Schema.Literal("youtube"), // Future: "spotify", "podcast", etc.
  /** Optional specific identifier if known (e.g., video ID) */
  resourceId: Schema.optional(Schema.String),
  /** Optional additional processing options */
  options: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
});
export type ResourceRequest = Schema.Schema.Type<typeof ResourceRequest>;

/** Request to create a new transcription job. */
export const CreateTranscriptionJobRequest = Schema.Struct({
  /** User making the request */
  requestId: RequestId,
  /** Non-empty text input containing resource references */
  inputText: Schema.String.pipe(Schema.nonEmpty()),
  /** Resources to extract and process from the input text */
  resources: Schema.Array(ResourceRequest).pipe(Schema.minItems(1)),
});
export type CreateTranscriptionJobRequest = Schema.Schema.Type<
  typeof CreateTranscriptionJobRequest
>;

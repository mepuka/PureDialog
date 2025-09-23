import { Schema } from "@effect/schema";
import { JobId, TranscriptId, RequestId } from "./ids";
import { MediaResource } from "./media-resources";
import { JobStatus } from "./status";

// --- TranscriptionJob & Status ---
/** The main entity representing the transcription work to be done. */
export const TranscriptionJob = Schema.Struct({
  id: JobId,
  requestId: RequestId,
  media: MediaResource,
  status: JobStatus,
  attempts: Schema.Number,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  transcriptId: Schema.optional(TranscriptId),
  error: Schema.optional(Schema.String),
});
export type TranscriptionJob = Schema.Schema.Type<typeof TranscriptionJob>;

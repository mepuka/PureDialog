import { Schema } from "effect"
import { TranscriptionContext } from "./context.js"
import { JobId, RequestId, TranscriptId } from "./ids.js"
import { MediaResource } from "./media.js"
import { JobStatus } from "./status.js"

// --- TranscriptionJob & Status ---
/** The main entity representing the transcription work to be done. */
export class TranscriptionJob extends Schema.Class<TranscriptionJob>("TranscriptionJob")({
  id: JobId,
  requestId: RequestId,
  media: MediaResource,
  status: JobStatus,
  attempts: Schema.Number,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  transcriptId: Schema.optional(TranscriptId),
  error: Schema.optional(Schema.String),
  // NEW: Context field for user-provided information
  transcriptionContext: Schema.optional(TranscriptionContext),
  idempotencyKey: Schema.optional(Schema.String),
  metadata: Schema.optional(Schema.Struct({
    priority: Schema.optional(Schema.String),
    source: Schema.optional(Schema.String),
    clientVersion: Schema.optional(Schema.String)
  }))
}) {}

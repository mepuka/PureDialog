import { Schema } from "effect"
import { JobId, RequestId, TranscriptId } from "../core/ids.js"
import { MediaResource } from "../media/resources.js"
import { TranscriptionContext } from "../transcription/context.js"
import { JobStatus } from "./status.js"

/**
 * Job entity types and schemas
 */

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

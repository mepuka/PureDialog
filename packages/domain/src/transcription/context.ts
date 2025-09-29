import { Schema } from "effect"
import { LanguageCode } from "../core/types.js"
import { SpeakerRole } from "../media/speakers.js"

/**
 * Transcription context types and schemas
 */

/**
 * MediaFormat enum for user-provided context hints
 */
const MediaFormat = Schema.Literal(
  "one_on_one_interview",
  "lecture",
  "panel_discussion",
  "tv_intervew",
  "radio_interview"
)

/**
 * TranscriptionContext captures user-provided information before processing begins.
 * This distinguishes between a priori user input and metadata extracted from sources.
 */
export const TranscriptionContext = Schema.Struct({
  // User-provided speaker information
  expectedSpeakers: Schema.Array(Schema.Struct({
    role: SpeakerRole,
    name: Schema.optional(Schema.String),
    affiliation: Schema.optional(Schema.String)
  })),

  // User-provided content hints
  contentHints: Schema.optional(Schema.Struct({
    domain: Schema.Array(Schema.String),
    tags: Schema.Array(Schema.String),
    summary: Schema.optional(Schema.String)
  })),

  // Processing preferences
  preferences: Schema.optional(Schema.Struct({
    language: Schema.optional(LanguageCode),
    format: Schema.optional(MediaFormat)
  }))
})

export type TranscriptionContext = Schema.Schema.Type<typeof TranscriptionContext>

import { Schema } from "effect"
import { JobId, MediaResourceId } from "../core/ids.js"
import { LanguageCode } from "../core/types.js"
import { Speaker } from "./speakers.js"

/**
 * Media metadata types and schemas
 */

const MediaFormat = Schema.Literal(
  "one_on_one_interview",
  "lecture",
  "panel_discussion",
  "tv_intervew",
  "radio_interview"
)

/**
 * The canonical MediaMetadata entity with improved optional parameter handling.
 * This is the complete, structured context extracted from a MediaResource
 * before the transcription process begins.
 */
export const MediaMetadata = Schema.Struct({
  mediaResourceId: MediaResourceId,
  jobId: JobId,
  title: Schema.String.pipe(
    Schema.nonEmptyString(),
    Schema.annotations({
      description: "The title of the media resource e.g. 'The Future of AI'"
    })
  ),
  organization: Schema.optional(
    Schema.String.pipe(
      Schema.nonEmptyString(),
      Schema.annotations({
        description: "The organization affiliation of the media resource e.g. 'AI Now Institute'"
      })
    )
  ),
  format: MediaFormat,
  summary: Schema.optional(
    Schema.String.pipe(
      Schema.nonEmptyString(),
      Schema.annotations({
        description:
          "A summary of the content of the media resource e.g. 'This podcast episode covers the recent advancements in AI'"
      })
    )
  ),
  // Keywords/tags provide crucial context for the ASR model's vocabulary.
  tags: Schema.Array(
    Schema.String.pipe(
      Schema.nonEmptyString(),
      Schema.annotations({
        description: "Individual keyword/tag describing the media content"
      })
    )
  ).pipe(
    Schema.annotations({
      description: "Keywords/tags that describe the content of the media resource e.g. 'AI', 'Technology'"
    })
  ),
  // The specific industry or topic domain is vital for improving accuracy.
  domain: Schema.Array(
    Schema.String.pipe(
      Schema.nonEmptyString(),
      Schema.annotations({
        description: "Individual domain/topic area"
      })
    )
  ).pipe(
    Schema.annotations({
      description: "The industries or topic domains of the media resource e.g. 'AI', 'Technology'"
    })
  ),
  speakers: Schema.Array(Speaker).pipe(
    Schema.minItems(1),
    Schema.annotations({
      description: "The speakers in the media resource e.g. 'John Doe', 'Jane Smith'"
    })
  ),
  language: LanguageCode,
  speakerCount: Schema.Int.pipe(
    Schema.positive(),
    Schema.annotations({
      description: "Number of speakers in the media resource"
    })
  ),
  durationSec: Schema.Number.pipe(
    Schema.positive(),
    Schema.annotations({
      description: "Duration of the media resource in seconds"
    })
  ),
  // represents any links found in the media resource (links in youtube description, etc.)
  links: Schema.Array(
    Schema.String.pipe(
      Schema.pattern(/^https?:\/\/.+/),
      Schema.annotations({
        description: "Individual link URL"
      })
    )
  ).pipe(
    Schema.annotations({
      description: "Links found in the media resource e.g. 'https://www.youtube.com/watch?v=dQw4w9WgXc'"
    })
  ),
  createdAt: Schema.Date
}).annotations({
  description: "Complete metadata extracted from media resources for transcription processing"
})
export type MediaMetadata = Schema.Schema.Type<typeof MediaMetadata>

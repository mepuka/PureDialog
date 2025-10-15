import { Core, Jobs, Media } from "@puredialog/domain"
import { Data, Effect, Schema } from "effect"
import type { YoutubeVideoDetails } from "./youtube.js"
import { YoutubeClient } from "./youtube.js"

export class UnsupportedMediaTypeError extends Data.TaggedError("UnsupportedMediaTypeError")<{
  readonly mediaType: string
}> {}

const buildMediaMetadata = (
  job: Jobs.QueuedJob,
  details: YoutubeVideoDetails
) => {
  const mediaResourceId = Schema.decodeUnknownSync(Core.MediaResourceId)(details.id)
  const language = Schema.decodeUnknownSync(Core.LanguageCode)("en")

  const tags = details.tags.length > 0 ? details.tags : ["transcription"]

  return Media.MediaMetadata.make({
    mediaResourceId,
    jobId: job.id,
    title: details.title,
    organization: details.channelTitle,
    format: "one_on_one_interview",
    summary: details.description.slice(0, 280),
    tags,
    domain: ["general"],
    speakers: [
      {
        role: "host",
        name: details.channelTitle
      }
    ],
    language,
    speakerCount: 1,
    durationSec: Math.max(1, details.durationSeconds),
    links: [`https://www.youtube.com/watch?v=${details.id}`],
    createdAt: details.publishedAt
  })
}

export const enrichQueuedJob = (job: Jobs.QueuedJob) =>
  Effect.gen(function*() {
    const youtube = yield* YoutubeClient

    switch (job.media.type) {
      case "youtube": {
        const details = yield* youtube.fetchVideo(job.media.data.id)
        const metadata = buildMediaMetadata(job, details)
        const metadataReady = Jobs.JobTransitions.enrichWithMetadata(job, metadata)
        return Jobs.JobTransitions.startProcessing(metadataReady)
      }
      default: {
        return yield* Effect.fail(
          new UnsupportedMediaTypeError({
            mediaType: job.media.type
          })
        )
      }
    }
  })

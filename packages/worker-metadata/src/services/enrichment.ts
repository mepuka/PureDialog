import { Core, Jobs, Media, YouTube } from "@puredialog/domain"
import { Data, Effect, Schema } from "effect"

export class UnsupportedMediaTypeError extends Data.TaggedError("UnsupportedMediaTypeError")<{
  readonly mediaType: string
}> {}

const buildMediaMetadata = (
  job: Jobs.QueuedJob,
  video: YouTube.YouTubeVideo
) => {
  const mediaResourceId = Schema.decodeUnknownSync(Core.MediaResourceId)(video.id)
  const language = Schema.decodeUnknownSync(Core.LanguageCode)("en")

  const tags = video.tags.length > 0 ? video.tags : ["transcription"]

  return Media.MediaMetadata.make({
    mediaResourceId,
    jobId: job.id,
    title: video.title,
    organization: video.channelTitle,
    format: "one_on_one_interview",
    summary: video.description.slice(0, 280),
    tags,
    domain: ["general"],
    speakers: [
      {
        role: "host",
        name: video.channelTitle
      }
    ],
    language,
    speakerCount: 1,
    durationSec: Math.max(1, video.duration),
    links: [`https://www.youtube.com/watch?v=${video.id}`],
    createdAt: new Date(video.publishedAt.epochMillis)
  })
}

export const enrichQueuedJob = (job: Jobs.QueuedJob) =>
  Effect.gen(function*() {
    const youtube = yield* YouTube.YouTubeClient

    switch (job.media.type) {
      case "youtube": {
        const video = yield* youtube.fetchVideo(job.media.data.id)
        const metadata = buildMediaMetadata(job, video)
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

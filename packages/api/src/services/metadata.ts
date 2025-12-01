import type { YouTube } from "@puredialog/domain"
import { Core, Media } from "@puredialog/domain"
import { Schema } from "effect"

export const buildMediaMetadata = (
  jobId: Core.JobId,
  video: YouTube.YouTubeVideo
): Media.MediaMetadata => {
  const mediaResourceId = Schema.decodeUnknownSync(Core.MediaResourceId)(video.id)
  const language = Schema.decodeUnknownSync(Core.LanguageCode)("en")

  const tags = video.tags.length > 0 ? video.tags : ["transcription"]

  return Media.MediaMetadata.make({
    mediaResourceId,
    jobId,
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

#!/usr/bin/env tsx
import type { YouTubeVideoId } from "@puredialog/domain"
import { Cause, Console, Effect, Layer, Option } from "effect"
import { YouTubeService, YouTubeServiceLive } from "../src/services/youtube.js"
import { YoutubeApiClientLive } from "../src/youtube/client.js"

const defaultVideoId = "dDPOpax2JBA" as YouTubeVideoId

const program = Effect.gen(function*() {
  const service = yield* YouTubeService
  const cliArg = process.argv[2]
  const videoId = Option.fromNullable(cliArg).pipe(
    Option.map((value) => value as YouTubeVideoId),
    Option.getOrElse(() => defaultVideoId)
  )

  yield* Console.log(`Fetching YouTube video ${videoId}`)
  const video = yield* service.getVideo(videoId)

  yield* Console.log("Title:", video.title)
  if (video.description) {
    yield* Console.log("Description:", video.description)
  }
  yield* Console.log("Channel:", video.channelTitle)
  yield* Console.log("Duration (seconds):", video.duration)
  yield* Console.log("Tags:", video.tags.join(", "))
})

await Effect.runPromise(
  program.pipe(
    Effect.provide(Layer.mergeAll(YoutubeApiClientLive, YouTubeServiceLive)),
    Effect.catchAllCause((cause) => Console.error(Cause.pretty(cause)))
  )
)

#!/usr/bin/env tsx

import type * as Domain from "@puredialog/domain"
import { Console, Effect, Layer } from "effect"
import { YouTubeService, YouTubeServiceLive } from "./src/services/youtube.js"

/**
 * Example demonstrating the working YouTube ingestion architecture
 *
 * Architecture:
 * 1. Domain package contains clean business types (YouTubeVideo, MediaResource)
 * 2. Adapters convert Google API types to domain types
 * 3. Services use adapters to provide domain-typed operations
 * 4. Clients handle raw Google API communication
 */

const program = Effect.gen(function*() {
  const youtubeService = yield* YouTubeService

  // Example: Get a specific video
  const videoId = "dQw4w9WgXcQ" as Domain.YouTubeVideoId // Rick Roll video ID

  yield* Console.log("Fetching video information...")

  const video = yield* youtubeService.getVideo(videoId).pipe(
    Effect.catchAll((error) =>
      Effect.gen(function*() {
        yield* Console.log(`Error fetching video: ${error.message}`)
        yield* Console.log("Note: You need a valid YOUTUBE_API_KEY environment variable")
        return {
          type: "youtube" as const,
          data: {
            id: videoId,
            title: "Example Video (API key needed for real data)",
            description: "This is a mock response - set YOUTUBE_API_KEY to get real data",
            publishedAt: new Date().toISOString(),
            channelId: "example-channel" as Domain.YouTubeChannelId,
            channelTitle: "Example Channel",
            thumbnails: {},
            duration: 213, // 3 minutes 33 seconds in seconds
            viewCount: 1000000000,
            likeCount: 1000000,
            commentCount: 100000
          }
        }
      })
    )
  )

  yield* Console.log("Video retrieved:")
  yield* Console.log(`Title: ${video.data.title}`)
  yield* Console.log(`Channel: ${video.data.channelTitle}`)
  yield* Console.log(`Views: ${video.data.viewCount.toLocaleString()}`)
  yield* Console.log(`Type: ${video.type}`)

  // Example: Search for videos
  yield* Console.log("\nSearching for videos about 'Effect TypeScript'...")

  const searchResults = yield* youtubeService.searchVideos("Effect TypeScript", 3).pipe(
    Effect.catchAll((error) =>
      Effect.gen(function*() {
        yield* Console.log(`Search error: ${error.message}`)
        return []
      })
    )
  )

  yield* Console.log(`Found ${searchResults.length} videos`)
  for (const result of searchResults) {
    yield* Console.log(`- ${result.data.title} (${result.data.viewCount} views)`)
  }
})

// Create the layer with a mock API key (replace with real key)
const AppLayer = YouTubeServiceLive

// Run the program
const runnable = program.pipe(Effect.provide(AppLayer))

Effect.runPromise(runnable).catch(console.error)

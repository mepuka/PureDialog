/**
 * Quick test of YouTube adapter functionality
 */

import { Effect } from "effect"
import { YouTubeAdapterLive, toDomainVideo, apiVideoToMediaResource } from "./src/adapters/youtube.js"

// Mock YouTube API video data
const mockApiVideo = {
  id: "dQw4w9WgXcQ",
  snippet: {
    title: "Test Video",
    description: "A test video description",
    channelId: "UC123456789012345678901234",
    channelTitle: "Test Channel",
    publishedAt: "2023-01-01T00:00:00Z",
    tags: ["test", "video"],
    thumbnails: {
      default: {
        url: "https://example.com/thumb.jpg",
        width: 120,
        height: 90
      }
    }
  },
  contentDetails: {
    duration: "PT3M30S"
  },
  statistics: {
    viewCount: "1000",
    likeCount: "100",
    commentCount: "10"
  }
}

// Test the adapter
const testAdapter = Effect.gen(function*() {
  console.log("Testing YouTube adapter...")
  
  // Test domain video transformation
  const domainVideo = yield* toDomainVideo(mockApiVideo)
  console.log("✅ Domain video transformation successful:", domainVideo.title)
  
  // Test MediaResource transformation
  const mediaResource = yield* apiVideoToMediaResource(mockApiVideo)
  console.log("✅ MediaResource transformation successful:", mediaResource.type)
  
  return "All tests passed!"
})

// Run the test
Effect.runPromise(testAdapter).then(
  (result) => console.log("🎉", result),
  (error) => console.error("❌ Test failed:", error)
)

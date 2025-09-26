#!/usr/bin/env tsx
import { JobId, LanguageCode, MediaMetadata, MediaResourceId, YouTubeVideo, YouTubeVideoId } from "@puredialog/domain";
import { Cause, Console, Effect } from "effect";
import { LLMService, LLMServiceLive } from "../src/service.js";
import { listVideoresponse } from "./example_list_videos_response.json";
const defaultVideoId = "dDPOpax2JBA";
const youtubeVideo = YouTubeVideo.make({
    id: YouTubeVideoId.make(defaultVideoId),
    title: listVideoresponse.items[0].snippet.title,
    description: listVideoresponse.items[0].snippet.description,
    tags: listVideoresponse.items[0].snippet.tags,
    duration: listVideoresponse.items[0].contentDetails.duration ? parseISO8601Duration(listVideoresponse.items[0].contentDetails.duration) : 0,
    channelId: listVideoresponse.items[0].snippet.channelId,
    channelTitle: listVideoresponse.items[0].snippet.channelTitle,
    publishedAt: listVideoresponse.items[0].snippet.publishedAt,
    language: listVideoresponse.items[0].snippet.defaultAudioLanguage
});
const program = Effect.gen(function* () {
    const service = yield* LLMService;
    // Create basic media metadata for testing
    const metadata = MediaMetadata.make({
        mediaResourceId: MediaResourceId.make(youtubeVideo.id),
        jobId: JobId.make("job-0001"),
        speakerCount: 2,
        speakers: [
            {
                name: "Kudzai Manditereza",
                role: "host",
                affiliation: { name: "Industry40.tv", },
                bio: `I help digital manufacturing professionals master the implementation of Intelligent Manufacturing with Industrial IoT and AI solutions.

I teach digital factory architectural principles and techniques, and I host a weekly podcast, AI in Manufacturing where I interview leading AI practitioners to provide you with detailed insights.`
            }
        ],
        domain: ["Industrial automation"],
        tags: ["manufacturing", "engineering", "automation", "OT/IT", "digital factory"],
        format: "one_on_one_interview",
        language: LanguageCode.make("en"),
        title: youtubeVideo.title,
        organization: "Industry40.tv",
        summary: `, 2025  AI in Manufacturing Podcast
Learn how AI is revolutionizing the manufacturing industry and how you can find opportunities for AI application in manufacturing.`,
        durationSec: youtubeVideo.duration,
        links: [],
        createdAt: new Date()
    });
    yield* Console.log("Starting transcription...");
    const transcript = yield* service.transcribeMedia(youtubeVideo, metadata);
    yield* Console.log(`Transcription completed! Found ${transcript.length} dialogue turns`);
    // Print first few turns for verification
    transcript.slice(0, 3).forEach((turn, index) => {
        yield * Console.log(`Turn ${index + 1}: [${turn.timestamp}] ${turn.speaker}: ${turn.text.substring(0, 50)}...`);
    });
});
await Effect.runPromise(program.pipe(Effect.provide(LLMServiceLive), Effect.catchAllCause((cause) => Console.error(Cause.pretty(cause)))));
//# sourceMappingURL=test-transcription.js.map
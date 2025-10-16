import { assert, describe, it } from "@effect/vitest";
import { Core, Jobs, Media, YouTube } from "@puredialog/domain";
import { Effect, Layer, Schema } from "effect";
import { enrichQueuedJob } from "../src/services/enrichment.js";
const makeQueuedJob = () => {
    const now = new Date();
    return Jobs.QueuedJob.make({
        id: Schema.decodeUnknownSync(Core.JobId)("job_test_metadata"),
        requestId: Schema.decodeUnknownSync(Core.RequestId)("req_test_metadata"),
        media: Schema.decodeUnknownSync(Media.MediaResource)({
            type: "youtube",
            data: {
                id: "dQw4w9WgXcQ",
                title: "Test Video",
                description: "A sample description",
                publishedAt: "2024-01-01T00:00:00Z",
                channelId: "UC1234567890123456789012",
                channelTitle: "Test Channel",
                thumbnails: [],
                duration: 60,
                viewCount: 1000,
                likeCount: 100,
                commentCount: 10,
                tags: ["test", "video"]
            }
        }),
        attempts: 0,
        createdAt: now,
        updatedAt: now
    });
};
const youtubeClientLayer = Layer.succeed(YouTube.YouTubeClient, {
    fetchVideo: () => Effect.succeed({
        id: YouTube.YouTubeVideoId.make("dQw4w9WgXcQ"),
        title: "Fetched Video",
        description: "Fetched description",
        publishedAt: new Date("2024-01-01T00:00:00Z"),
        channelId: YouTube.YouTubeChannelId.make("UC1234567890123456789012"),
        channelTitle: "Fetched Channel",
        tags: ["test"],
        durationSeconds: 90
    })
});
describe("enrichQueuedJob", () => {
    it.effect("promotes a queued job to processing with metadata", () => Effect.gen(function* () {
        const queuedJob = makeQueuedJob();
        const processingJob = yield* enrichQueuedJob(queuedJob).pipe(Effect.provide(youtubeClientLayer));
        assert.strictEqual(processingJob._tag, "ProcessingJob");
        assert.isDefined(processingJob.metadata);
        assert.strictEqual(processingJob.metadata.mediaResourceId, "dQw4w9WgXcQ");
        assert.strictEqual(processingJob.metadata.jobId, queuedJob.id);
        assert.strictEqual(processingJob.metadata.language, "en");
    }));
});
//# sourceMappingURL=enrichment.test.js.map
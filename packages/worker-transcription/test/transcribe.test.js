import { assert, describe, it } from "@effect/vitest";
import { Core, Jobs, LLM, Media, Transcription } from "@puredialog/domain";
import { LLMService } from "@puredialog/llm";
import { LLMArtifactStore } from "@puredialog/storage";
import { DateTime, Effect, Layer, Schema } from "effect";
import { generateTranscript } from "../src/services/transcribe.js";
const makeProcessingJob = () => {
    const now = new Date();
    const jobId = Schema.decodeUnknownSync(Core.JobId)("job_transcription_test");
    const mediaResource = Schema.decodeUnknownSync(Media.MediaResource)({
        type: "youtube",
        data: {
            id: "dQw4w9WgXcQ",
            title: "Processing Video",
            description: "Processing description",
            publishedAt: "2024-01-02T00:00:00Z",
            channelId: "UC1234567890123456789012",
            channelTitle: "Processing Channel",
            thumbnails: [],
            duration: 120,
            viewCount: 500,
            likeCount: 50,
            commentCount: 5,
            tags: ["processing", "test"]
        }
    });
    const metadata = Media.MediaMetadata.make({
        mediaResourceId: Schema.decodeUnknownSync(Core.MediaResourceId)("dQw4w9WgXcQ"),
        jobId,
        title: "Processing Video",
        organization: "Test Org",
        format: "one_on_one_interview",
        summary: "Summary",
        tags: ["processing"],
        domain: ["testing"],
        speakers: [
            {
                role: "host",
                name: "Test Host"
            }
        ],
        language: Schema.decodeUnknownSync(Core.LanguageCode)("en"),
        speakerCount: 1,
        durationSec: 120,
        links: [],
        createdAt: now
    });
    return {
        processingJob: Jobs.ProcessingJob.make({
            id: jobId,
            requestId: Schema.decodeUnknownSync(Core.RequestId)("req_transcription"),
            media: mediaResource,
            attempts: 0,
            createdAt: now,
            updatedAt: now,
            metadata,
            metadataFetchedAt: now,
            processingStartedAt: now
        }),
        jobId
    };
};
const llmLayer = Layer.succeed(LLMService, {
    transcribeMedia: (jobId) => Effect.succeed({
        turns: [
            Transcription.DialogueTurn.make({
                timestamp: Core.TimestampString.make(DateTime.unsafeMake("2024-01-02T00:00:00Z").toString()),
                speaker: "host",
                text: "Welcome to the test transcript"
            })
        ],
        artifact: LLM.LLMArtifacts.make({
            id: LLM.LLMArtifactId.make(`artifact_${jobId}`),
            jobId,
            providerConfig: LLM.GeminiProviderConfig.make({
                provider: "gemini",
                model: "gemini-test",
                temperature: 0,
                mediaResolution: "low"
            }),
            createdAt: DateTime.unsafeMake("2024-01-02T01:00:00Z"),
            additional: {
                promptArtifact: {
                    systemInstruction: "System prompt",
                    fullPromptText: "Full prompt"
                }
            }
        })
    })
});
const artifactStoreLayer = Layer.succeed(LLMArtifactStore, {
    save: () => Effect.void,
    listByJob: () => Effect.succeed([])
});
describe("generateTranscript", () => {
    it.effect("produces transcript and completed job", () => Effect.gen(function* () {
        const { jobId, processingJob } = makeProcessingJob();
        const { completedJob, transcript } = yield* generateTranscript(processingJob).pipe(Effect.provide(Layer.mergeAll(llmLayer, artifactStoreLayer)));
        assert.strictEqual(completedJob._tag, "CompletedJob");
        assert.strictEqual(completedJob.id, jobId);
        assert.strictEqual(transcript.jobId, jobId);
        assert.strictEqual(transcript.turns.length, 1);
        assert.match(transcript.id, /^trn_/);
    }));
});
//# sourceMappingURL=transcribe.test.js.map
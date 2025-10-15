import type { YouTube } from "@puredialog/domain"
import { Core, Jobs, Transcription } from "@puredialog/domain"
import { LLMService } from "@puredialog/llm"
import { LLMArtifactStore } from "@puredialog/storage"
import { Data, Effect, Schema } from "effect"
import { randomUUID } from "node:crypto"

export class TranscriptGenerationError extends Data.TaggedError("TranscriptGenerationError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class UnsupportedMediaTypeError extends Data.TaggedError("UnsupportedMediaTypeError")<{
  readonly mediaType: string
}> {}

const ensureTranscriptionContext = (
  context: Jobs.ProcessingJob["transcriptionContext"]
): Transcription.TranscriptionContext =>
  context
    ? context
    : Transcription.TranscriptionContext.make({
      expectedSpeakers: []
    })

const buildTranscriptId = (jobId: Core.JobId) =>
  Schema.decodeUnknownSync(Core.TranscriptId)(`trn_${jobId}_${randomUUID().slice(0, 6)}`)

export const generateTranscript = (job: Jobs.ProcessingJob) =>
  Effect.gen(function*() {
    if (job.media.type !== "youtube") {
      return yield* Effect.fail(
        new UnsupportedMediaTypeError({ mediaType: job.media.type })
      )
    }

    const llmService = yield* LLMService
    const artifactStore = yield* LLMArtifactStore

    const { artifact, turns } = yield* llmService.transcribeMedia(
      job.id,
      job.media.data as YouTube.YouTubeVideo,
      job.metadata
    )

    yield* artifactStore.save(artifact)

    const transcriptId = buildTranscriptId(job.id)
    const transcriptionContext = ensureTranscriptionContext(job.transcriptionContext)
    const createdAt = new Date()

    const inferenceConfig = Transcription.InferenceConfig.make({
      model: artifact.providerConfig.model,
      temperature: artifact.providerConfig.temperature,
      ...(artifact.providerConfig.mediaResolution ?
        {
          additionalParams: { mediaResolution: artifact.providerConfig.mediaResolution }
        } :
        {})
    })

    const promptArtifact = artifact.additional.promptArtifact as
      | { systemInstruction?: string; fullPromptText?: string }
      | undefined

    const generationPrompt = Transcription.GenerationPrompt.make({
      templateId: "gemini_transcribe_media",
      templateVersion: "1.0.0",
      compiledText: promptArtifact?.fullPromptText ?? "",
      compilationParams: promptArtifact?.systemInstruction
        ? { systemInstruction: promptArtifact.systemInstruction }
        : {},
      compiledAt: createdAt
    })

    const transcript = Transcription.Transcript.make({
      id: transcriptId,
      jobId: job.id,
      mediaResource: job.media,
      rawText: turns.map((turn) => turn.text).join("\n"),
      turns,
      inferenceConfig,
      generationPrompt,
      transcriptionContext,
      llmArtifactId: artifact.id,
      createdAt,
      updatedAt: createdAt
    })

    const completedJob = Jobs.JobTransitions.complete(job, transcriptId)

    return { transcript, completedJob } as const
  })

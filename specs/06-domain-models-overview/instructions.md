### 06 - Domain Models Overview

This document specifies the contracts that power `packages/domain`. Every exported type pairs a `Schema` definition with a pure constructor/helper. Downstream services may only interact with these values through Effect-powered decoders to keep boundaries explicit and code cleanliness high.

#### Shared Authoring Rules

- Prefer `Schema.Struct` compositions; use `Schema.optional` instead of `undefined` unions.
- All public creators return `Effect.Effect<_, DomainError>`; never throw.
- Stick to immutable data (readonly arrays/records) and literal version tags for forward migration.
- Provide `Schema.decodeUnknownEffect` helpers for each aggregate to centralise validation.

#### Identity & Keys

- **VideoId** – 11-character YouTube identifier.
  - Schema: `Schema.String.pipe(Schema.minLength(11), Schema.maxLength(11), Schema.pattern(/^[a-zA-Z0-9_-]+$/))`.
- **TranscriptId** – UUID v4 (`Schema.UUID` with version guard).
- **JobId** – UUID v7 for sortability. Implement `UuidV7Schema` (see `effect-schema-coding-patterns.md`).
- **UserId** – Auth subject string, min length 3.

All IDs expose `fromString` decoders that normalise and trim input before validation.

#### Job Status Lifecycle

Define a closed union for `JobStatus`:

- `Queued` – accepted and deduplicated.
- `MetadataFetched` – video metadata captured.
- `Processing` – transcription underway (Gemini request live).
- `Completed` – transcript persisted successfully.
- `Failed` – unrecoverable error; `ProcessingJob.lastError` populated.
- `Cancelled` – intentionally stopped; no retries.

State transitions are linear: `Queued → MetadataFetched → Processing → Completed|Failed|Cancelled`. Retrying a `Failed` job issues a new `JobId`; retries attach previous failure in the new job’s `relatedFailures` array.

#### Prompt & Topic Metadata

- **PromptMetadata**
  - Fields: `show`, `speakers`, `audio`, `structure`, `vocabulary`, `fallback`, each typed with nested structs mirroring spec 02 requirements.
  - Provide `PromptMetadata.Schema` with version tag (`"1.0.0"`) and `PromptMetadata.decodeUnknown` helper returning `Effect.Effect<PromptMetadata, DomainError>`.
  - Guard optional attributes (gender, pronouns) behind explicit `confidence` flags to avoid unverified data.

- **PromptContext**
  - Derived struct composed of `promptMetadata`, `videoMetadata`, `topicHints`, and `preambleHash`.
  - Expose `PromptContext.build` (pure) that merges stored metadata, heuristics, and defaults.

- **Topic Models**
  - `TopicTag` – `{ tag: string; score: number }` with score ≥ 0 and string length ≤ 48.
  - `VocabHints` – `{ canonical: ReadonlyArray<string>; aliases: ReadonlyRecord<string, string> }` ensuring canonical entries are unique.
  - `ChannelTopicModel` – `{ channelId: string; updatedAt: Schema.Date; tags: ReadonlyArray<TopicTag>; vocab: VocabHints; sampleSize: number; hash: string }`.
  - Provide codecs so ingestion/transcription/persistence share the same validation.

- **GlossaryStats**
  - Captures verification pass feedback: `{ term: string; seen: number; corrected: number; lastCorrectedAt?: Schema.Date }`.
  - Stored alongside transcripts for prompt refinement.

#### Core Entities

- **VideoMetadata**
  - Fields: `videoId`, `title`, `channelName`, `durationSeconds` (positive int), `publishedAt` (`Schema.Date`), `thumbnailUrl`, `language` (BCP-47 tag), `captionsAvailable` (boolean).
  - Invariants: `durationSeconds > 0`; `publishedAt` cannot be more than 24 hours in the future when validated.

- **ProcessingJob**
  - Fields: `jobId`, `videoId`, `userId`, `submittedAt` (`Schema.Date`), `status: JobStatus`, `dedupeKey` (stable hash of `videoId`), `attempts` (non-negative int), `metadataSnapshot?: PromptMetadata`, `topicHints?: ChannelTopicModel`, `preambleHash?: string`, `lastError?`, `relatedFailures: ReadonlyArray<DomainError>`, `version: "1.0.0"`.
  - Provide `ProcessingJob.create` that enforces `dedupeKey` derivation, normalises metadata snapshot to canonical schema, and initialises `status` to `Queued`.

- **SpeakerRole**
  - Enum: `"HOST" | "GUEST"`. This casing matches prompt/pipeline expectations.
  - Provide helpers: `SpeakerRole.fromInput(userInput)` (case-insensitive) and `SpeakerRole.isHost/Guest`.
  - Include `SpeakerRole.label` to render human-friendly strings when needed.

- **SpeakerTurn**
  - Fields: `speaker: SpeakerRole`, `startSeconds`, `endSeconds` (non-negative numbers); `text` (trimmed string); `confidence` (0.6–1 range).
  - Invariants: `startSeconds < endSeconds`; no overlaps across the transcript; contiguous turns alternate speaker role when both present.

- **Transcript**
  - Fields: `transcriptId`, `jobId`, `videoId`, `turns: ReadonlyArray<SpeakerTurn> (min length 1)`, `summary?`, `metrics`, `generatedAt` (`Schema.Date`), `metadata?: PromptContext`, `glossaryStats?: ReadonlyArray<GlossaryStats>`, `version: "1.0.0"`.
  - Provide derived combinators: `Transcript.duration` (max end time), `Transcript.primaryLanguage`.

- **TranscriptSummary**
  - Fields: `highlights: ReadonlyArray<string> (max 5)`, `keyMoments: ReadonlyArray<{ label: string; atSeconds: number }>` (sorted ascending), `tone: Schema.String`.

- **LLMMetrics**
  - Fields: `model`, `promptTokens`, `completionTokens`, `totalTokens`, `costUsd` (Schema.Number.pipe(Schema.nonNegative))`, `durationMs`.
  - Make `totalTokens` a computed field validated against prompt + completion totals.

- **LLMCall**
  - Fields: `requestId` (`Schema.UUID`), `model`, `startedAt`, `completedAt`, `statusCode` (int), `metrics: LLMMetrics`.
  - Invariants: `completedAt >= startedAt`; `metrics.durationMs` consistent with timestamp delta.

- **ValidationResults**
  - Fields: `invariant: string`, `status: "Passed" | "Failed"`, `details?`, `severity: "Warning" | "Error"`.
  - Provide `ValidationResults.combine` that accumulates failures without throwing.

#### Domain Errors

All errors extend `Data.TaggedError` and live in `packages/domain/src/errors.ts`.

- **ValidationError** `{ message: string; field?: string }`.
- **TranscriptionError** `{ message: string; stage: JobStatus }`.
- **ExternalServiceError** `{ provider: "YouTube" | "Gemini" | "Drive"; reason: string }`.
- **QuotaError** `{ userId: UserId; limit: string }`.

Export `DomainError = ValidationError | TranscriptionError | ExternalServiceError | QuotaError`.

#### Domain Events & Messages

Publish all inter-service communication through strongly typed events:

- **JobQueuedEvent** `{ job: ProcessingJob; userId: UserId }` – emitted post dedupe.
- **JobStatusChangedEvent** `{ jobId: JobId; previous: JobStatus; next: JobStatus; at: Schema.Date; userId: UserId; metadataVersion?: string }` – every transition.
- **TranscriptReadyEvent** `{ jobId: JobId; transcript: Transcript; promptHash?: string }` – consumed by persistence and notification layers.
- **JobFailedEvent** `{ jobId: JobId; error: DomainError; attempts: number; userId: UserId }`.
- **MetadataAppliedEvent** `{ jobId: JobId; metadataHash: string; source: "user" | "inferred"; missingFields: ReadonlyArray<string> }` to feed observability counters.

Each event has a `Codec` that wraps `Schema.encode`/`decode` for Pub/Sub payload safety.

#### Service Interfaces (Type-Level Only)

- **IngestionService** – `submit(videoId, userId) -> Effect<ProcessingJob>`; `status(jobId) -> Effect<ProcessingJob>`.
- **TranscriptionService** – `start(job: ProcessingJob) -> Effect<void>`; `resume(jobId) -> Effect<void>`.
- **TranscriptStore** – persistence layer returning `Effect<E, Transcript>`.
- **DedupStore** – `acquire(videoId, userId) -> Effect<boolean>` using `ProcessingJob.dedupeKey`.
- **PubSubPublisher/Subscriber** – generic interfaces parameterised by event schema.
- **GeminiClient** – typed around `LLMCall` metrics and explicit host/guest prompt roles.
- **YouTubeClient** – returns `VideoMetadata`.

Implementations live outside the domain package; this file ensures every consumer shares one canonical contract.

#### Invariants Recap

- Speaker roles resolved before transcription begins; transcripts must include both `Host` and `Guest` at least once unless failure is reported.
- Transcript turns cover the full video duration within ±2% gap and never overlap.
- `LLMMetrics.totalTokens === promptTokens + completionTokens`.
- All events include `JobId` and `at` timestamp for observability correlation.
- Domain helpers return Effects; no raw throws or `Promise` usage inside the package.

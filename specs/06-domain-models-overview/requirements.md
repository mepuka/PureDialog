### Requirements — 06 Domain Models (Phase 2)

#### Scope

Define canonical domain contracts in `packages/domain` with `Schema` + constructors, error taxonomy, and event codecs. No runtime side effects.

#### Functional Requirements

- Identity Schemas
  - `VideoId`, `TranscriptId (UUID v4)`, `JobId (UUID v7)`, `UserId` with strict decoding helpers.
- Status & Lifecycle
  - `JobStatus` closed union; transitions constrained in helpers.
- Core Aggregates
  - `VideoMetadata`, `ProcessingJob`, `SpeakerRole`, `SpeakerTurn`, `Transcript`, `TranscriptSummary`, `LLMMetrics`, `LLMCall`, `ValidationResults`.
  - Provide `Schema.decodeUnknownEffect` and safe constructors for each.
- Errors
  - `ValidationError`, `TranscriptionError`, `ExternalServiceError`, `QuotaError` using `Data.TaggedError`.
  - Export `DomainError` union.
- Events & Codecs
  - `JobQueuedEvent`, `JobStatusChangedEvent`, `TranscriptReadyEvent`, `JobFailedEvent` with codecs.

#### Non-Functional Requirements

- Zero `any`/unsafe assertions; explicit types only.
- Pure module; Effect-returning helpers only.

#### Acceptance Criteria

- [ ] All schemas compile; decoders return Effects.
- [ ] Events encode/decode round-trip in tests.
- [ ] Invariant helpers detect overlaps and invalid durations.

#### Improvements/Simplifications

- Provide a small `TypeId` branding utility for IDs to improve ergonomics.

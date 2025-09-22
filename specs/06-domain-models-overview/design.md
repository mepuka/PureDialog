### Design — 06 Domain Models (Phase 3)

#### Overview

`packages/domain` provides the canonical schemas, constructors, invariants, and event codecs. Pure module with Effect-returning decoders. No I/O.

#### Modules

- `ids.ts` — branded IDs and decoders: `VideoId`, `JobId(v7)`, `TranscriptId(v4)`, `UserId`.
- `status.ts` — `JobStatus` union, transition helpers.
- `entities/` — `VideoMetadata`, `ProcessingJob`, `SpeakerRole`, `SpeakerTurn`, `Transcript`, `TranscriptSummary`, `PromptMetadata`, `PromptContext`.
- `metrics.ts` — `LLMMetrics`, `LLMCall`.
- `validation.ts` — invariant checks and combinators.
- `errors.ts` — `Data.TaggedError` types and union `DomainError`.
- `events.ts` — domain events and codecs (metadata/prompt events only; omit topic modeling).

#### Design Notes

- All constructors return `Effect` and validate via `Schema.decodeUnknownEffect`.
- Use readonly arrays, exact object shapes, and literal version tags.
- Provide helper functions for common derived values (e.g., transcript duration).

#### References

- Patterns: `effect-schema-coding-patterns.md`, `effect-data-structure-patterns.md`.

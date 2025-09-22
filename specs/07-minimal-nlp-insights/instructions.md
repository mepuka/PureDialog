### 07 - Minimal NLP Insights Backbone

#### Feature Overview

Deliver the smallest viable Effect-based pipeline that (a) tracks canonical vocabulary and topic hints, (b) flags spelling / jargon anomalies, and (c) emits compact patches for visualization. The implementation seeds later streaming/LLM work but must already surface confidence cues for transcripts via `Trie`, `HashMap`, and `Differ` abstractions.

#### Success Criteria

- Streaming text ingested from transcription service produces:
  - Vocabulary hits/misses recorded in `TokenStats` map.
  - Suggestions for out-of-vocabulary terms ranked and stored.
  - Topic hints derived from token counts (top-N weighted tags).
- Snapshots + patches persisted: base artifacts plus `Differ.HashMap` delta per job.
- Visualization consumers receive normalized events with density metrics and correction spans.
- Prompt metadata diffing exposed, enabling audit of context changes across runs.

#### Minimal Architecture

```
Message(TranscriptTurn)
   │
   ▼
Tokenizer (Layer)
   │ Chunk<Token>
   ▼
Vocabulary Service (Trie + HashMap)
   │
   ├─► TokenStats HashMap (counts, confidence, corrections)
   ├─► Corrections Chunk (spelling/jargon suggestions)
   └─► Trie patch (new canonical terms)
   │
   ▼
Topic Scorer (TF weighting)
   │ Chunk<TopicVector>
   ▼
Differ Aggregator
   │ HashMapPatch + ChunkPatch
   ▼
Persistence + Event Publisher
```

#### Core Modules

1. **TokenizerLayer** – effect service delivering normalized tokens (`Token` + metadata). Minimal implementation uses deterministic regex + lowercasing with optional alias expansion.
2. **VocabularyService** – interface wrapping persistent `Trie` & `HashMap`:
   - `check(token) -> Effect<TokenResult>` (hit/miss, suggestions, phonetic code placeholder).
   - `insertCanonical(term, stats)` for validated jargon additions.
3. **TokenStatsAccumulator** – folds a `Chunk<TokenResult>` into `HashMap<Token, TokenStats>` and `Chunk<Correction>`.
4. **TopicHintBuilder** – converts `HashMap<Token, TokenStats>` into sorted `Chunk<TopicVector>` using weight = tf (frequency) × boost (if canonical).
5. **InsightsDiffer** – `Differ.HashMap` (token stats) × `Differ.Chunk` (topics) × `Differ.Trie` (alias patch placeholder) zipped into unified patch type.
6. **InsightsStore** – persistence adapter (Drive/GCS) storing base snapshot + patch log; provides `getLatest(jobId)` and `applyPatch`.
7. **InsightsPublisher** – emits `InsightsReadyEvent` with snapshot hash, patch size, key metrics.
8. **PromptContextDiff** – `Differ.Context` comparing previous/current `PromptContext`, reused from metadata spec to tie context changes to insights.

#### Data Model (Minimal)

- `Token = Data.struct({ value: string, canonical: string, position: number, turnId: string })`
- `TokenStats = Data.struct({ count: number, lastSeenAt: DateTime.Instant, confidence: number, corrections: Chunk<Correction> })`
- `Correction = Data.struct({ suggestion: string, score: number, source: CorrectionSource, applied: boolean })`
- `CorrectionSource = Data.taggedEnum({ Trie: Data.struct({ distance: number }), Alias: Data.struct({ alias: string }), Heuristic: Data.struct({ reason: string }) })`
- `TopicVector = Data.struct({ tag: string, weight: number, evidence: Chunk<EvidenceSpan> })`
- `EvidenceSpan = Data.struct({ turnId: string, start: number, end: number })`
- `TranscriptInsights = Data.struct({ tokenStats: HashMap<string, TokenStats>, topics: Chunk<TopicVector>, corrections: Chunk<Correction>, trieVersion: string, updatedAt: DateTime.Instant })`
- `InsightsPatch = Data.struct({ tokenStats: HashMapPatch<string, TokenStats, TokenStatsPatch>, topics: ChunkPatch<TopicVector>, triePatch: TriePatch, contextPatch: PromptContextPatch })`

Provide codecs (Schema.Struct) and `Equal`/`Order` instances where needed.

#### Algorithms & Flow

1. **Tokenization**
   - Input: `TranscriptTurn` effect stream.
   - Output: `Chunk<Token>` with canonical candidate (alias map) and positional data.
2. **Vocabulary Check**
   - Step: for each token, `Trie.has(token.canonical)`.
   - Miss pipeline:
     - Fuzzy candidate search (Levenshtein radius ≤1) limited to top 3 suggestions.
     - Alias fallback (HashMap alias -> canonical).
     - Confidence score computed from match ranking and frequency.
3. **Stats Aggregation**
   - Use `Chunk.reduce` into `HashMap<Token, TokenStats>`; update `count` and `lastSeenAt`.
   - Mark `applied` for corrections if canonical auto-selected.
4. **Topic Weighting**
   - Filter to canonical tokens; compute `weight = count * boost` (boost=1 + log(count)).
   - Select top N (default 10) via sorting with `Order.number` on weight.
5. **Diff Computation**
   - Load prior snapshot (`TranscriptInsights`) via store.
   - `tokenPatch = Differ.HashMap.diff(old.tokenStats, new.tokenStats)`.
   - `topicPatch = Differ.Chunk.diff(old.topics, new.topics)`.
   - `triePatch` from vocabulary additions (tracking inserted paths).
   - `contextPatch` from `PromptContextDiffer` using latest prompt metadata.
6. **Persistence**
   - Save new snapshot & patch file (`insights/{jobId}/snapshot.json`, `insights/{jobId}/patch-{timestamp}.json`).
   - Emit event with summary metrics (new terms, corrections applied, top topics).

#### Observability & Metrics

- `insights.tokens_processed_total`
- `insights.trie_hits_total` / `insights.trie_misses_total`
- `insights.corrections_suggested_total{source}`
- `insights.topics_updated_total`
- `insights.patch_size_bytes`
- Logs: `insights.snapshot.created`, `insights.patch.emitted`, `insights.context.diffed`.

#### Validation

- Unit tests for Trie suggestion ranking and Differ patch round-trips (`patch(diff(old,new), old) == new`).
- Property test: alias map never yields correction with confidence > 0.9 unless canonical exists.
- Integration test: feed fixture transcript -> expect deterministic top topics & correction patch.
- Persistence smoke: store→load→apply patch reconstructs exact snapshot.

#### Deliverables

- `packages/nlp/src/TrieVocabulary.ts` – vocabulary service implementation + tests.
- `packages/nlp/src/TokenStats.ts` – data models, schemas, differ combinators.
- `services/transcription/src/insights/Pipeline.ts` – pipeline composition hooking into existing stream.
- `services/transcription/src/insights/Publisher.ts` – event emission + metrics.
- `services/transcription/test/insights-pipeline.test.ts` – minimal end-to-end validation.
- Docs: `docs/insights/minimal-pipeline.md` summarizing usage & API shapes.

#### Constraints / Non-Goals

- No external ML model integration (semantic embeddings deferred).
- No UI work beyond data event contract.
- No multi-channel reconciliation—single job context only.
- Phonetic hashing placeholders accepted (structure prepared but minimal implementation may stub with TODO for real algorithm).


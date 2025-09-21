### 03 - Lightweight NLP for Topic Tags & Channel Context

#### Goal

Add fast, deterministic NLP to harvest channel/video metadata and generate topic tags and vocabulary hints with minimal compute and zero LLM calls. Use these hints to improve transcription accuracy and downstream search/UX without complicating the core pipeline.

#### Where It Fits (Spec Cross‑Refs)

- 00 Project Setup: none (pure runtime utility package later).
- 01 Ingestion Service: enrich jobs with `topicHints` and `vocabHints` derived from channel/video text.
- 02 Metadata Prompt Optimization: feed `vocabulary` and `show.structure` fields from the NLP outputs when available.

#### Inputs

- Channel level: title, description, custom tags, about text (if available), list of recent video titles/descriptions/tags.
- Video level: title, description, YouTube tags.

#### Outputs

- `TopicTag[]`: ranked strings (1–3 token keyphrases) representing the channel’s dominant subjects.
- `VocabHints`: canonical proper nouns and preferred spellings (e.g., "OPC UA", "Kubernetes").
- Optional `StructureHints`: simple patterns like intro/guest/closing derived from recurring phrasing in descriptions.

#### Minimal Algorithms (Deterministic, Fast)

1) Candidate extraction (per channel):
   - Tokenize titles+descriptions (simple Unicode word boundary).
   - Generate 1–3 gram candidates; lower‑case except for acronym detection.
   - Filter: remove stopwords, numeric‑only, length < 3, and generic podcast terms (e.g., "episode", "subscribe").

2) Scoring:
   - TF: frequency across videos (sum of occurrences in titles+descriptions, titles weighted x3).
   - IDF‑within‑channel: log(N_videos / (1 + videos_with_term)).
   - Boosts: +acronym/all‑caps, +ProperNoun (capitalized mid‑sentence), +present in YouTube tags, +bigrams/trigrams over unigrams.
   - Score = TF * IDF * (1 + boosts).

3) Proper noun/vocabulary recovery:
   - Preserve original casing for candidates when majority usage is capitalized or all‑caps.
   - Merge near‑duplicates via case‑folding and dash/space normalization (e.g., "edge-compute" vs "edge compute").
   - Keep top K spellings as canonical; record aliases.

4) Structure hints (optional):
   - Regex for recurring segments in descriptions: "Sponsored by", "Show notes", "Chapters", "Timestamps" → suggests intro/outro patterns.

#### Data Structures (Domain)

```ts
type TopicTag = {
  tag: string
  score: number
};

type VocabHints = {
  canonical: string[]            // Preferred spellings/proper nouns
  aliases: Record<string,string> // alias -> canonical
};

type ChannelTopicModel = {
  channelId: string
  updatedAt: string
  tags: TopicTag[]
  vocab: VocabHints
  sampleSize: number             // # of videos analyzed
  hash: string                   // content hash for change detection
};
```

Persist via a shared `ChannelTopicModelStore` (Drive/GCS adapter from spec 03 persistence) so results survive process restarts and avoid unnecessary recomputation.

#### Integration Points

- Ingestion (01):
  - On first encounter of a channel or when hash changes, compute ChannelTopicModel from the latest N videos (e.g., N=100 configurable; fallback N=20).
  - Attach `topicHints` (top 20 tags) and `vocabHints.canonical` to the `ProcessingJob.metadataSnapshot`.
  - Expose `GET /api/v1/channels/:id/topics` for debugging/UX.

- Metadata Preamble (02):
  - If `vocabHints.canonical` exists, include in the preamble’s "Vocabulary hints" line (bounded by token budget).
  - If `StructureHints` detected, set `show.structure` defaults.
- Persistence (03):
  - Store `ChannelTopicModel` artifacts and hashes alongside transcript metadata (see spec 03 storage layout) with versioned filenames (`topics-{channelId}.json`).

#### Performance & Robustness

- Single pass text collection; simple maps/sets; no network beyond YouTube metadata already fetched.
- Streaming processing to bound memory on large channels; cap to recent N videos.
- Language guard: optionally skip non‑English via stopword ratio heuristic.

#### Metrics & Validation

- `nlp.topic_tags_generated_total`, `nlp.vocab_hints_generated_total`.
- `nlp.channel_model_updates_total` with sampleSize and duration.
- Sanity checks: overlap with YouTube tags ≥ 60% for top 10; stability across weeks (Jaccard ≥ 0.7 for top 20).

#### Rollout

1) Phase A (read‑only): compute and log; do not change prompts.
2) Phase B (assist): attach hints to jobs; gated flag to include in preambles.
3) Phase C (product): surface tags in UI filters/search; export for analytics.

#### Risks

- Noisy channels (varied topics) → lower thresholds; shorten horizon (recent N videos).
- Non‑English content → language guard; future stopword lists per language.
- Acronym ambiguity → rely on co‑occurrence boosts and user overrides later.

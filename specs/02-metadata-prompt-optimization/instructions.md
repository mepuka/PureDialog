### 02 - Metadata‑Driven Prompt Optimization

#### Feature Overview

Introduce a reusable, metadata‑driven prompt preamble to reduce instruction length, improve transcription accuracy, and stabilize speaker attribution. The preamble encodes stable context (show/channel, host/guest roles, acoustic setting, recurring structure, domain jargon, and fallback rules) so per‑request prompts stay short and consistent.

#### Core Objectives

- Define a canonical metadata schema covering:
  - Show/channel context (title, channel, recurring segments, sponsor reads)
  - Speakers (names, roles, pronouns/gender, known affiliations)
  - Audio/acoustic profile (noise sources, intro/outro music, remote vs studio)
  - Conversation structure (intro → interview → closing patterns)
  - Vocabulary dictionary (proper nouns, acronyms, product names, spellings)
  - Fallback guidance (e.g., [inaudible], [crosstalk], [uncertain: …])
- Create a PromptContext generator that serializes metadata into a concise preamble for transcription/summarization LLM calls.
- Extend ingestion to accept optional metadata and persist canonical speaker role mapping per `VideoId`.
- Update transcription service to merge stored metadata with YouTube metadata and pass the generated preamble to the model.
- Add observability around metadata usage and impact.

#### Acceptance Criteria

- Preamble generator produces a deterministic, < 250 token preamble for typical 2‑speaker interviews (configurable limit).
- When metadata provides a host/guest mapping, transcripts use those labels consistently throughout (HOST/GUEST or provided aliases).
- Provided vocabulary dictionary is reflected in outputs (spelling of listed terms ≥ 95% across test fixtures).
- Fallback rules appear as specified (e.g., `[inaudible]`, `[crosstalk]`, `[uncertain: term]`).
- Metrics emitted: `metadata.applied_total`, `metadata.inference_used_total`, `metadata.missing_fields_total`, `metadata.override_rate`, `transcription.wer_ab`
- A/B harness documented to compare WER/diarization mismatch with vs without preamble on the same inputs.

#### Dependencies

- Domain package for types/codecs (new `PromptMetadata` + `SpeakerRoleRegistry`).
- Ingestion service (accept and store metadata; dedupe ties into canonical mapping).
- Transcription service (apply preamble; surface metrics).

#### Non‑Goals

- Multi‑guest/multi‑panel diarization beyond HOST/GUEST (covered in a future spec).
- Post‑processing summarization or semantic enrichment changes (separate specs).
- Any irreversible inference of sensitive attributes; metadata remains optional and overrideable.

#### Data Model (Proposed)

```json
{
  "show": {
    "title": "TechTalk Weekly",
    "channel": "TechTalk Channel",
    "structure": ["intro", "interview", "closing_sponsor"],
    "notes": "Usually a 20s music intro and sponsor at end"
  },
  "speakers": {
    "host": { "name": "Alex", "pronouns": "she/her", "gender": "female", "label": "HOST" },
    "guest": { "name": "Jordan", "pronouns": "he/him", "gender": "male", "label": "GUEST" }
  },
  "audio": {
    "setting": "studio",
    "noise": ["intro_music"],
    "notes": "Treat music and stings as non‑speech"
  },
  "vocabulary": {
    "properNouns": ["SCADA", "OPC UA", "ACME Robotics"],
    "spellings": { "PLC": "PLC", "kubernetes": "Kubernetes" }
  },
  "fallback": {
    "inaudible": "[inaudible]",
    "crosstalk": "[crosstalk]",
    "uncertain": "[uncertain: VALUE]"
  }
}
```

Types (to be implemented in `packages/domain`):

- `PromptMetadata` – codec with the fields above (strict, versioned)
- `SpeakerRoleRegistry` – maps `VideoId` ↔ canonical `{ host, guest }`
- `PromptContext` – derived view merged from stored metadata + video metadata

#### Prompt Preamble Template (Generator)

Rendered example (HOST/GUEST two‑speaker interview):

```
Context: You are transcribing the show "TechTalk Weekly". Exactly two speakers: HOST (Alex, she/her) and GUEST (Jordan, he/him). Treat intro/outro music as non‑speech. Typical structure: intro → interview → closing sponsor read.

Vocabulary hints: SCADA; OPC UA; ACME Robotics; Kubernetes. Use these spellings where applicable.

Output requirements:
- Verbatim with light punctuation; do not paraphrase.
- Label each turn as HOST: or GUEST: consistently.
- If unsure of a term, write [uncertain: term]; if inaudible, write [inaudible]; overlapping speech → [crosstalk].
```

Generator rules:

- Always include role mapping and structure in the first 1–2 sentences.
- Collapse vocabulary into a single line (semicolon‑separated) to bound tokens.
- Emit only sections with data; omit empty blocks (keep under token budget).
- Deterministic ordering: Context → Vocabulary → Output requirements.

#### Ingestion API Changes

- `POST /api/v1/ingest` accepts optional `metadata`:
  - `speakers?: { host?: { name; pronouns?; gender?; label? }, guest?: { … } }`
  - `vocabulary?: { properNouns?: string[]; spellings?: Record<string,string> }`
  - `audio?: { setting?: string; noise?: string[]; notes?: string }`
  - `show?: { title?: string; structure?: string[]; notes?: string }`
- If provided, persist via `SpeakerRoleRegistry` and store a `metadataSnapshot` on the job.
- Response unchanged; status includes whether metadata was applied.

#### Transcription Service Changes

- Build `PromptContext` from (priority): request metadata → stored registry → heuristics → defaults.
- Generate preamble string and prepend to the model prompt for transcription.
- Surface metrics and attach preamble hash to LLM call logs for A/B comparability.

#### Inference Heuristics (Optional, Low‑Confidence)

- If only channel title is known, assume channel owner is HOST.
- Parse titles/descriptions for patterns: "with <Guest>", "feat.", "interview".
- Do not infer gender unless explicitly provided; if inferred, mark low‑confidence and do not include in preamble by default.

#### Observability & Evaluation

- Logs: `metadata.applied`, `metadata.inferred`, `metadata.overridden` with `videoId`, field set, and confidence.
- Metrics: see Acceptance Criteria.
- Evaluation harness: paired runs on a fixed fixture set with/without metadata; compute WER and diarization mismatch deltas.

#### Rollout Plan

1. Phase 1 (Manual): API/UI accepts metadata; preamble generator integrated behind a flag.
2. Phase 2 (Assisted): Add lightweight heuristics from YouTube fields; user‑visible overrides.
3. Phase 3 (Scale): Dictionary sharing per show/channel; feedback‑driven corrections.

#### Risks & Mitigations

- Incorrect role mapping → default to generic labels if confidence < threshold; allow user overrides.
- Sensitive attributes (gender/pronouns) → optional fields; never inferred silently; clearly labeled if present.
- Token bloat → hard budget, section elision, compact formatting.

#### Deliverables

- `packages/domain`: `PromptMetadata` codec and `SpeakerRoleRegistry` helper.
- `packages/gemini` (or prompts module): `buildPreamble(promptContext)`.
- Ingestion: accept/persist metadata; store snapshot on job.
- Transcription: apply preamble and emit metrics.
- Docs: `docs/prompts/metadata-preamble.md` with examples and A/B guidance.


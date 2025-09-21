### Requirements — 05 Security, Auth & Rate Limiting (Phase 2)

#### Scope

AuthN/AuthZ for APIs, quotas and rate limits, secret handling policies.

#### Functional Requirements

- AuthN
  - Verify bearer tokens; extract `UserId`.
- Rate Limiting
  - Per-user: 100 requests/hour for ingest.
  - Per-video: 1 processing attempt per 24h per project.
- Secret Handling
  - Gemini/API keys present only on server; accessed via Config Layer.
- Metadata Safeguards
  - Sanitize user-supplied metadata fields; reject unsupported attributes (e.g., demographic guesses without confidence).
  - Tag sanitized metadata with provenance (`user`, `inferred`, `default`) for downstream auditing.
  - Emit `MetadataAppliedEvent` with provenance and redacted metadata reference only.

#### Non-Functional Requirements

- All checks enforced at Effect boundaries before business logic.
- Clear error responses with `QuotaError` for limit violations.

#### Observability Requirements

- Logs for allow/deny decisions with `userId`, reason, and `metadataProvenance` (no PII content persisted).
- Metrics: `rate_limit_denied_total{type}`, `metadata.rejected_total`, `metadata.sanitized_total`.

#### Acceptance Criteria

- [ ] Auth middleware blocks unauthenticated requests.
- [ ] Over-quota requests return structured `QuotaError`.
- [ ] Metadata sanitation strips/flags disallowed fields and emits provenance metrics.
- [ ] No secrets available in client bundle.

#### Improvements/Simplifications

- Start with fixed-window counters in memory; later move to Redis/Firestore.

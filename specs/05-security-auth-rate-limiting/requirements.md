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

#### Non-Functional Requirements

- All checks enforced at Effect boundaries before business logic.
- Clear error responses with `QuotaError` for limit violations.

#### Observability Requirements

- Logs for allow/deny decisions with `userId` and reason (no PII).
- Metrics: `rate_limit_denied_total{type}`.

#### Acceptance Criteria

- [ ] Auth middleware blocks unauthenticated requests.
- [ ] Over-quota requests return structured `QuotaError`.
- [ ] No secrets available in client bundle.

#### Improvements/Simplifications

- Start with fixed-window counters in memory; later move to Redis/Firestore.

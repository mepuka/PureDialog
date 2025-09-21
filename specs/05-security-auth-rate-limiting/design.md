### Design — 05 Security, Auth & Rate Limiting (Phase 3)

#### Overview

Boundary middleware and layers enforcing authentication, quotas, and secret handling policies.

#### Modules

- `auth/Middleware` — bearer token verification, extracts `UserId`.
- `ratelimit/Guards` — per-user and per-video limit checks.
- `config/Secrets` — centralized access to sensitive values via Layer.
- `metadata/Sanitizer` — whitelists metadata fields, applies confidence flags, redacts sensitive attributes.
- `audit/Emitter` — forwards security events (`rate_limit_denied`, `metadata.rejected`) to observability layer (spec 04).

#### Layers

- `AuthLayer`, `RateLimitLayer`, `MetadataSanitizerLayer`, `ConfigLayer`, `LoggerLayer`.

#### Flow

1. Request enters HTTP route → `AuthMiddleware` annotates context.
2. `RateLimitGuard` checks limits before business logic.
3. On deny: return `QuotaError` structured response and emit `rate_limit_denied_total` metric/log entry.
4. Sanitized metadata appended to request context with provenance (`user` vs `inferred`).

#### References

- Patterns: `effect-configuration-patterns.md`, `effect-error-handling-patterns.md`.

### Design — 05 Security, Auth & Rate Limiting (Phase 3)

#### Overview

Boundary middleware and layers enforcing authentication, quotas, and secret handling policies.

#### Modules

- `auth/Middleware` — bearer token verification, extracts `UserId`.
- `ratelimit/Guards` — per-user and per-video limit checks.
- `config/Secrets` — centralized access to sensitive values via Layer.

#### Layers

- `AuthLayer`, `RateLimitLayer`, `ConfigLayer`, `LoggerLayer`.

#### Flow

1. Request enters HTTP route → `AuthMiddleware` annotates context.
2. `RateLimitGuard` checks limits before business logic.
3. On deny: return `QuotaError` structured response.

#### References

- Patterns: `effect-configuration-patterns.md`, `effect-error-handling-patterns.md`.

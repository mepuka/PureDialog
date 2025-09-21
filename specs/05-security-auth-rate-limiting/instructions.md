### 05 - Security, Auth & Rate Limiting

#### Feature Overview

Add authentication (Google Identity/Firebase), rate limits, and quotas. Ensure server-side secret handling.

#### Core Functionality

- AuthN middleware validating bearer tokens
- Per-user rate limits and per-video dedup windows
- Secret management for Gemini and GCP services

#### Absolute Imperatives

- Never expose secrets to the client
- Enforce per-user quotas and abuse protection
- Deny reprocessing of same video within 24h window

#### Initial Architecture

- Auth Layer (Effect) verifying tokens and extracting UserId
- RateLimit Layer (token bucket or fixed window)
- Config Layer for quotas and policy toggles

# Effect Infrastructure Foundation Implementation Plan

> **For Claude:** Use `${SUPERPOWERS_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task.

**Goal:** Build a type-safe, testable GCP infrastructure foundation using Effect's Layer system where cloud resources are modeled as composable data transformations, making misconfiguration impossible through temporal dependencies enforced at compile time.

**Architecture:** Resources are Effect Layers that return immutable data structures. Deployment is modeled as functor transformations (Layer.map/flatMap) where each layer depends on previous layers through the type system. Application code and deployment scripts pull all configuration from the same Layer context, ensuring they can never drift apart.

**Tech Stack:** Effect TypeScript, Schema (branded types + validation), Layer composition, Exit/Cause error handling, @effect/vitest for testing

---

## Phase 1: Foundation Types (GCP Primitives)

### Task 1: Create GCP Branded Types Package

**Files:**
- Create: `packages/foundation/package.json`
- Create: `packages/foundation/tsconfig.json`
- Create: `packages/foundation/src/types/GcpTypes.ts`
- Create: `packages/foundation/src/types/index.ts`

**Step 1: Create package.json**

Create `packages/foundation/package.json`:

```json
{
  "name": "@puredialog/foundation",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc -b",
    "clean": "rm -rf dist",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "dependencies": {
    "effect": "^3.18.4"
  },
  "devDependencies": {
    "@effect/vitest": "^0.26.0",
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  }
}
```

**Step 2: Create tsconfig.json**

Create `packages/foundation/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": []
}
```

**Step 3: Write GCP branded types**

Create `packages/foundation/src/types/GcpTypes.ts`:

```typescript
import { Schema } from "effect"

/**
 * GCP Project ID
 * Format: lowercase alphanumeric + hyphens, 6-30 chars
 * Example: "gen-lang-client-0874846742"
 */
export const GcpProjectId = Schema.String.pipe(
  Schema.brand("GcpProjectId"),
  Schema.pattern(/^[a-z][-a-z0-9]{4,28}[a-z0-9]$/),
  Schema.annotations({
    identifier: "GcpProjectId",
    title: "GCP Project ID",
    description: "Google Cloud Platform project identifier",
    examples: ["my-project-123", "gen-lang-client-0874846742"]
  })
)

export type GcpProjectId = Schema.Schema.Type<typeof GcpProjectId>

/**
 * GCP Region
 * Format: {continent}-{direction}{number}
 * Example: "us-west1", "europe-west2"
 */
export const GcpRegion = Schema.String.pipe(
  Schema.brand("GcpRegion"),
  Schema.pattern(/^[a-z]+-[a-z]+\d+$/),
  Schema.annotations({
    identifier: "GcpRegion",
    title: "GCP Region",
    description: "Google Cloud Platform region identifier",
    examples: ["us-west1", "us-central1", "europe-west1"]
  })
)

export type GcpRegion = Schema.Schema.Type<typeof GcpRegion>

/**
 * Service Account Email
 * Format: {name}@{project}.iam.gserviceaccount.com
 * Example: "211636922435-compute@developer.gserviceaccount.com"
 */
export const ServiceAccountEmail = Schema.String.pipe(
  Schema.brand("ServiceAccountEmail"),
  Schema.pattern(/^.+@.+\.gserviceaccount\.com$/),
  Schema.annotations({
    identifier: "ServiceAccountEmail",
    title: "Service Account Email",
    description: "Google Cloud service account email address",
    examples: [
      "my-service@my-project.iam.gserviceaccount.com",
      "211636922435-compute@developer.gserviceaccount.com"
    ]
  })
)

export type ServiceAccountEmail = Schema.Schema.Type<typeof ServiceAccountEmail>

/**
 * Container Image URI
 * Format: {registry}/{project}/{image}:{tag}
 * Example: "gcr.io/my-project/my-service:latest"
 */
export const ContainerImageUri = Schema.String.pipe(
  Schema.brand("ContainerImageUri"),
  Schema.pattern(/^[a-z0-9.-]+\/[a-z0-9-_./]+:[a-z0-9-_.]+$/),
  Schema.annotations({
    identifier: "ContainerImageUri",
    title: "Container Image URI",
    description: "Container registry image URI with tag",
    examples: [
      "gcr.io/my-project/my-service:latest",
      "us-docker.pkg.dev/my-project/my-repo/my-image:v1.0.0"
    ]
  })
)

export type ContainerImageUri = Schema.Schema.Type<typeof ContainerImageUri>

/**
 * GCS Bucket Name
 * Format: lowercase alphanumeric + hyphens + underscores, 3-63 chars
 * Example: "my-bucket-name"
 */
export const GcsBucketName = Schema.String.pipe(
  Schema.brand("GcsBucketName"),
  Schema.pattern(/^[a-z0-9][a-z0-9-_]{1,61}[a-z0-9]$/),
  Schema.annotations({
    identifier: "GcsBucketName",
    title: "GCS Bucket Name",
    description: "Google Cloud Storage bucket name",
    examples: ["my-bucket", "ingestion-shared-artifacts-7qpl58"]
  })
)

export type GcsBucketName = Schema.Schema.Type<typeof GcsBucketName>
```

**Step 4: Create index exports**

Create `packages/foundation/src/types/index.ts`:

```typescript
export * from "./GcpTypes.js"
```

Create `packages/foundation/src/index.ts`:

```typescript
export * from "./types/index.js"
```

**Step 5: Update root package.json to include foundation**

Modify `pnpm-workspace.yaml` (if it doesn't already include):

```yaml
packages:
  - 'packages/*'
```

**Step 6: Install and build**

Run:
```bash
cd /Users/pooks/Dev/PureDialog/.worktrees/effect-infrastructure
pnpm install
pnpm --filter @puredialog/foundation build
```

Expected: Build succeeds, `packages/foundation/dist/` created

**Step 7: Commit**

```bash
git add packages/foundation
git commit -m "feat(foundation): add GCP branded types

Create type-safe branded primitives for GCP identifiers:
- GcpProjectId, GcpRegion
- ServiceAccountEmail, ContainerImageUri
- GcsBucketName

All types have Schema validation with regex patterns.

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Test GCP Branded Types

**Files:**
- Create: `packages/foundation/test/types/GcpTypes.test.ts`
- Create: `packages/foundation/vitest.config.ts`

**Step 1: Create vitest config**

Create `packages/foundation/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: false,
    environment: "node"
  }
})
```

**Step 2: Write failing test for valid GCP regions**

Create `packages/foundation/test/types/GcpTypes.test.ts`:

```typescript
import { assert, describe, it } from "@effect/vitest"
import { Either, Effect, Schema } from "effect"
import { GcpRegion, GcpProjectId, ServiceAccountEmail, ContainerImageUri, GcsBucketName } from "../../src/types/GcpTypes.js"

describe("GcpRegion", () => {
  it.effect("accepts valid GCP regions", () =>
    Effect.gen(function*() {
      const validRegions = [
        "us-west1",
        "us-central1",
        "europe-west1",
        "asia-east1"
      ]

      for (const region of validRegions) {
        const decoded = yield* Schema.decode(GcpRegion)(region)
        assert.strictEqual(decoded, region)
      }
    })
  )

  it.effect("rejects invalid region formats", () =>
    Effect.gen(function*() {
      const invalidRegions = [
        "us-west",        // missing number
        "west1",          // missing continent
        "US-WEST1",       // uppercase
        "",               // empty
        "us_west1"        // underscore instead of hyphen
      ]

      for (const invalid of invalidRegions) {
        const result = yield* Effect.either(Schema.decode(GcpRegion)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("GcpProjectId", () => {
  it.effect("accepts valid GCP project IDs", () =>
    Effect.gen(function*() {
      const validIds = [
        "my-project-123",
        "gen-lang-client-0874846742",
        "a-b-c-d",  // minimum length
        "a" + "-".repeat(28) + "b"  // maximum length (30 chars)
      ]

      for (const id of validIds) {
        const decoded = yield* Schema.decode(GcpProjectId)(id)
        assert.strictEqual(decoded, id)
      }
    })
  )

  it.effect("rejects invalid project ID formats", () =>
    Effect.gen(function*() {
      const invalidIds = [
        "My-Project",      // uppercase
        "project_name",    // underscore
        "123",             // too short
        "a",               // too short
        "a" + "-".repeat(30) + "b",  // too long (> 30 chars)
        "-project",        // starts with hyphen
        "project-"         // ends with hyphen
      ]

      for (const invalid of invalidIds) {
        const result = yield* Effect.either(Schema.decode(GcpProjectId)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("ServiceAccountEmail", () => {
  it.effect("accepts valid service account emails", () =>
    Effect.gen(function*() {
      const validEmails = [
        "my-service@my-project.iam.gserviceaccount.com",
        "211636922435-compute@developer.gserviceaccount.com"
      ]

      for (const email of validEmails) {
        const decoded = yield* Schema.decode(ServiceAccountEmail)(email)
        assert.strictEqual(decoded, email)
      }
    })
  )

  it.effect("rejects invalid service account formats", () =>
    Effect.gen(function*() {
      const invalidEmails = [
        "not-a-service-account",
        "user@gmail.com",
        "@project.gserviceaccount.com",
        ""
      ]

      for (const invalid of invalidEmails) {
        const result = yield* Effect.either(Schema.decode(ServiceAccountEmail)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("ContainerImageUri", () => {
  it.effect("accepts valid container image URIs", () =>
    Effect.gen(function*() {
      const validUris = [
        "gcr.io/my-project/my-service:latest",
        "us-docker.pkg.dev/my-project/my-repo/my-image:v1.0.0",
        "docker.io/library/node:18-alpine"
      ]

      for (const uri of validUris) {
        const decoded = yield* Schema.decode(ContainerImageUri)(uri)
        assert.strictEqual(decoded, uri)
      }
    })
  )

  it.effect("rejects invalid image URI formats", () =>
    Effect.gen(function*() {
      const invalidUris = [
        "not-a-uri",
        "gcr.io/project/image",  // missing tag
        ":latest",               // missing registry/image
        ""
      ]

      for (const invalid of invalidUris) {
        const result = yield* Effect.either(Schema.decode(ContainerImageUri)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("GcsBucketName", () => {
  it.effect("accepts valid GCS bucket names", () =>
    Effect.gen(function*() {
      const validNames = [
        "my-bucket",
        "ingestion-shared-artifacts-7qpl58",
        "a-b",  // minimum length
        "a" + "-".repeat(59) + "b"  // maximum length (63 chars)
      ]

      for (const name of validNames) {
        const decoded = yield* Schema.decode(GcsBucketName)(name)
        assert.strictEqual(decoded, name)
      }
    })
  )

  it.effect("rejects invalid bucket name formats", () =>
    Effect.gen(function*() {
      const invalidNames = [
        "My-Bucket",      // uppercase
        "-bucket",        // starts with hyphen
        "bucket-",        // ends with hyphen
        "a",              // too short
        "a" + "-".repeat(65),  // too long
        ""
      ]

      for (const invalid of invalidNames) {
        const result = yield* Effect.either(Schema.decode(GcsBucketName)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})
```

**Step 3: Run tests to verify they pass**

Run:
```bash
pnpm --filter @puredialog/foundation test
```

Expected: All tests PASS

**Step 4: Commit**

```bash
git add packages/foundation/test packages/foundation/vitest.config.ts
git commit -m "test(foundation): add tests for GCP branded types

Comprehensive validation tests for all branded types:
- Valid formats accepted
- Invalid formats rejected
- Edge cases (min/max length, special chars)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 2: GCP Operations Layer

### Task 3: Create GcloudCli Service

**Files:**
- Create: `packages/foundation/src/operations/GcloudCli.ts`
- Create: `packages/foundation/src/operations/index.ts`
- Create: `packages/foundation/src/errors/GcloudErrors.ts`
- Create: `packages/foundation/src/errors/index.ts`

**Step 1: Create error types**

Create `packages/foundation/src/errors/GcloudErrors.ts`:

```typescript
import { Schema } from "effect"

/**
 * Base error for gcloud CLI operations
 */
export class GcloudError extends Schema.TaggedError<GcloudError>()("GcloudError", {
  message: Schema.String,
  command: Schema.String,
  exitCode: Schema.Number,
  stderr: Schema.optional(Schema.String)
}) {}

/**
 * Defect when gcloud CLI is not installed or not in PATH
 */
export class GcloudNotInstalledDefect extends Schema.TaggedError<GcloudNotInstalledDefect>()("GcloudNotInstalled", {
  message: Schema.String
}) {}

/**
 * Defect when gcloud output can't be parsed
 */
export class InvalidGcloudOutputDefect extends Schema.TaggedError<InvalidGcloudOutputDefect>()("InvalidGcloudOutput", {
  message: Schema.String,
  command: Schema.String,
  output: Schema.String
}) {}
```

Create `packages/foundation/src/errors/index.ts`:

```typescript
export * from "./GcloudErrors.js"
```

**Step 2: Create GcloudCli service interface**

Create `packages/foundation/src/operations/GcloudCli.ts`:

```typescript
import { Command, Context, Effect, Layer, Schema } from "effect"
import { GcloudError, GcloudNotInstalledDefect } from "../errors/index.js"

/**
 * Service for executing gcloud CLI commands
 */
export class GcloudCli extends Context.Tag("@puredialog/foundation/GcloudCli")<
  GcloudCli,
  {
    /**
     * Execute a gcloud command with the given arguments
     *
     * @param args - Command arguments (e.g., ["run", "deploy", "my-service"])
     * @returns stdout output on success
     * @throws GcloudError on command failure
     * @throws GcloudNotInstalledDefect if gcloud not found
     */
    readonly run: (args: ReadonlyArray<string>) => Effect.Effect<string, GcloudError>
  }
>() {}

/**
 * Live implementation - calls real gcloud CLI
 */
export const GcloudCliLive = Layer.effect(
  GcloudCli,
  Effect.gen(function*() {
    // Check if gcloud is installed
    const checkResult = yield* Command.make("which", "gcloud").pipe(
      Command.exitCode,
      Effect.catchAll(() => Effect.succeed(1))
    )

    if (checkResult !== 0) {
      return yield* Effect.die(
        new GcloudNotInstalledDefect({
          message: "gcloud CLI not found in PATH. Please install Google Cloud SDK."
        })
      )
    }

    return {
      run: (args) =>
        Command.make("gcloud", ...args).pipe(
          Command.stdout("string"),
          Command.stderr("string"),
          Command.exitCode,
          Effect.flatMap(([stdout, stderr, exitCode]) =>
            exitCode === 0
              ? Effect.succeed(stdout.trim())
              : Effect.fail(
                  new GcloudError({
                    message: stderr || `Command failed with exit code ${exitCode}`,
                    command: `gcloud ${args.join(" ")}`,
                    exitCode,
                    stderr
                  })
                )
          )
        )
    }
  })
)

/**
 * Test implementation - returns canned responses based on command
 */
export const GcloudCliTest = (interactions: Map<string, string | Effect.Effect<string, GcloudError>>) =>
  Layer.succeed(
    GcloudCli,
    {
      run: (args) =>
        Effect.gen(function*() {
          const key = args.join(" ")
          const response = interactions.get(key)

          if (!response) {
            return yield* Effect.die(
              new Error(`Unexpected gcloud command in test: gcloud ${key}`)
            )
          }

          // Allow response to be either a string or an Effect
          if (typeof response === "string") {
            // Simulate network latency
            yield* Effect.sleep("10 millis")
            return response
          } else {
            return yield* response
          }
        })
    }
  )
```

Create `packages/foundation/src/operations/index.ts`:

```typescript
export * from "./GcloudCli.js"
```

**Step 3: Update foundation index exports**

Modify `packages/foundation/src/index.ts`:

```typescript
export * from "./types/index.js"
export * from "./operations/index.js"
export * from "./errors/index.js"
```

**Step 4: Install @effect/platform for Command**

Add to `packages/foundation/package.json` dependencies:

```json
"dependencies": {
  "effect": "^3.18.4",
  "@effect/platform": "^0.82.3",
  "@effect/platform-node": "^0.82.3"
}
```

Run:
```bash
pnpm install
pnpm --filter @puredialog/foundation build
```

Expected: Build succeeds

**Step 5: Commit**

```bash
git add packages/foundation/src/operations packages/foundation/src/errors packages/foundation/src/index.ts packages/foundation/package.json
git commit -m "feat(foundation): add GcloudCli service

Create Effect service for gcloud CLI operations:
- GcloudCliLive: calls real gcloud binary
- GcloudCliTest: canned responses for testing
- Error types: GcloudError, GcloudNotInstalledDefect

Service interface: run(args) => Effect<string, GcloudError>

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Test GcloudCli Service

**Files:**
- Create: `packages/foundation/test/operations/GcloudCli.test.ts`

**Step 1: Write failing test for GcloudCli**

Create `packages/foundation/test/operations/GcloudCli.test.ts`:

```typescript
import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { GcloudCli, GcloudCliTest, GcloudError } from "../../src/index.js"

describe("GcloudCli", () => {
  it.effect("executes gcloud commands and returns stdout", () =>
    Effect.gen(function*() {
      const interactions = new Map([
        ["projects list --format=json", JSON.stringify([{ projectId: "test-project" }])]
      ])

      const testLayer = GcloudCliTest(interactions)

      const result = yield* GcloudCli.run(["projects", "list", "--format=json"]).pipe(
        Effect.provide(testLayer)
      )

      const parsed = JSON.parse(result)
      assert.deepStrictEqual(parsed, [{ projectId: "test-project" }])
    })
  )

  it.effect("fails with GcloudError when command fails", () =>
    Effect.gen(function*() {
      const interactions = new Map<string, Effect.Effect<string, GcloudError>>([
        [
          "run deploy nonexistent --region us-west1",
          Effect.fail(
            new GcloudError({
              message: "Service not found",
              command: "gcloud run deploy nonexistent --region us-west1",
              exitCode: 1,
              stderr: "ERROR: (gcloud.run.deploy) Service not found"
            })
          )
        ]
      ])

      const testLayer = GcloudCliTest(interactions)

      const error = yield* Effect.flip(
        GcloudCli.run(["run", "deploy", "nonexistent", "--region", "us-west1"]).pipe(
          Effect.provide(testLayer)
        )
      )

      assert.isTrue(error instanceof GcloudError)
      assert.strictEqual(error.exitCode, 1)
      assert.include(error.message, "Service not found")
    })
  )

  it.effect("dies when unexpected command is called in test", () =>
    Effect.gen(function*() {
      const interactions = new Map<string, string>()  // Empty - no commands expected
      const testLayer = GcloudCliTest(interactions)

      // Attempt to call unexpected command
      const result = yield* Effect.exit(
        GcloudCli.run(["unexpected", "command"]).pipe(
          Effect.provide(testLayer)
        )
      )

      // Should die (defect), not fail
      assert.isTrue(result._tag === "Failure")
      // Dies throw defects, check the cause
    })
  )

  it.effect("simulates network latency in test mode", () =>
    Effect.gen(function*() {
      const interactions = new Map([
        ["projects list", "project-1\nproject-2"]
      ])

      const testLayer = GcloudCliTest(interactions)

      const start = Date.now()
      yield* GcloudCli.run(["projects", "list"]).pipe(
        Effect.provide(testLayer)
      )
      const elapsed = Date.now() - start

      // Should take at least 10ms due to simulated latency
      assert.isTrue(elapsed >= 10, `Expected >= 10ms latency, got ${elapsed}ms`)
    })
  )
})
```

**Step 2: Run tests to verify they pass**

Run:
```bash
pnpm --filter @puredialog/foundation test
```

Expected: All tests PASS

**Step 3: Commit**

```bash
git add packages/foundation/test/operations
git commit -m "test(foundation): add GcloudCli service tests

Test coverage:
- Command execution with stdout
- Error handling with GcloudError
- Unexpected command detection (defects)
- Simulated network latency

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Phase 3: Configuration Layer

### Task 5: Create GcpConfig Service

**Files:**
- Create: `packages/foundation/src/config/GcpConfig.ts`
- Create: `packages/foundation/src/config/index.ts`

**Step 1: Create GcpConfig service**

Create `packages/foundation/src/config/GcpConfig.ts`:

```typescript
import { Config, Context, Effect, Layer, Schema } from "effect"
import { GcpProjectId, GcpRegion, ServiceAccountEmail } from "../types/index.js"

/**
 * Core GCP configuration
 */
export const GcpConfigSchema = Schema.Struct({
  projectId: GcpProjectId,
  projectNumber: Schema.String,  // Just a numeric string, no special validation needed
  region: GcpRegion,
  serviceAccount: ServiceAccountEmail
})

export type GcpConfigData = Schema.Schema.Type<typeof GcpConfigSchema>

/**
 * GCP Configuration service
 */
export class GcpConfig extends Context.Tag("@puredialog/foundation/GcpConfig")<
  GcpConfig,
  GcpConfigData
>() {}

/**
 * Load GCP config from environment variables
 */
export const GcpConfigLive = Layer.effect(
  GcpConfig,
  Effect.gen(function*() {
    const projectId = yield* Config.string("GCP_PROJECT_ID")
    const projectNumber = yield* Config.string("GCP_PROJECT_NUMBER")
    const region = yield* Config.string("GCP_REGION").pipe(
      Config.withDefault("us-west1")
    )
    const serviceAccount = yield* Config.string("GCP_SERVICE_ACCOUNT")

    // Validate using schema
    return yield* Schema.decode(GcpConfigSchema)({
      projectId,
      projectNumber,
      region,
      serviceAccount
    })
  })
)

/**
 * Test config with hardcoded values
 */
export const GcpConfigTest = (config: GcpConfigData) =>
  Layer.succeed(GcpConfig, config)
```

Create `packages/foundation/src/config/index.ts`:

```typescript
export * from "./GcpConfig.js"
```

**Step 2: Update exports**

Modify `packages/foundation/src/index.ts`:

```typescript
export * from "./types/index.js"
export * from "./operations/index.js"
export * from "./errors/index.js"
export * from "./config/index.js"
```

**Step 3: Build**

Run:
```bash
pnpm --filter @puredialog/foundation build
```

Expected: Build succeeds

**Step 4: Commit**

```bash
git add packages/foundation/src/config packages/foundation/src/index.ts
git commit -m "feat(foundation): add GcpConfig service

Configuration service with environment variable loading:
- GCP_PROJECT_ID, GCP_PROJECT_NUMBER
- GCP_REGION (defaults to us-west1)
- GCP_SERVICE_ACCOUNT

Schema validation ensures all values are valid branded types.

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: Test GcpConfig Service

**Files:**
- Create: `packages/foundation/test/config/GcpConfig.test.ts`

**Step 1: Write tests for GcpConfig**

Create `packages/foundation/test/config/GcpConfig.test.ts`:

```typescript
import { assert, describe, it } from "@effect/vitest"
import { ConfigProvider, Effect, Layer } from "effect"
import { GcpConfig, GcpConfigLive, GcpConfigTest } from "../../src/index.js"

describe("GcpConfig", () => {
  it.effect("loads config from test layer", () =>
    Effect.gen(function*() {
      const testConfig = GcpConfigTest({
        projectId: "test-project-123",
        projectNumber: "123456789",
        region: "us-central1",
        serviceAccount: "test@test-project-123.iam.gserviceaccount.com"
      })

      const config = yield* Effect.provide(GcpConfig, testConfig)

      assert.strictEqual(config.projectId, "test-project-123")
      assert.strictEqual(config.region, "us-central1")
    })
  )

  it.effect("loads config from environment variables", () =>
    Effect.gen(function*() {
      const testEnv = ConfigProvider.fromMap(
        new Map([
          ["GCP_PROJECT_ID", "env-project-123"],
          ["GCP_PROJECT_NUMBER", "987654321"],
          ["GCP_REGION", "europe-west1"],
          ["GCP_SERVICE_ACCOUNT", "env@env-project-123.iam.gserviceaccount.com"]
        ])
      )

      const config = yield* Effect.provide(
        GcpConfig,
        GcpConfigLive.pipe(Layer.setConfigProvider(testEnv))
      )

      assert.strictEqual(config.projectId, "env-project-123")
      assert.strictEqual(config.region, "europe-west1")
    })
  )

  it.effect("uses default region when not specified", () =>
    Effect.gen(function*() {
      const testEnv = ConfigProvider.fromMap(
        new Map([
          ["GCP_PROJECT_ID", "default-test"],
          ["GCP_PROJECT_NUMBER", "111222333"],
          ["GCP_SERVICE_ACCOUNT", "test@default-test.iam.gserviceaccount.com"]
          // GCP_REGION not provided
        ])
      )

      const config = yield* Effect.provide(
        GcpConfig,
        GcpConfigLive.pipe(Layer.setConfigProvider(testEnv))
      )

      assert.strictEqual(config.region, "us-west1")  // Default
    })
  )

  it.effect("fails validation with invalid project ID", () =>
    Effect.gen(function*() {
      const testEnv = ConfigProvider.fromMap(
        new Map([
          ["GCP_PROJECT_ID", "INVALID-PROJECT"],  // Uppercase - invalid!
          ["GCP_PROJECT_NUMBER", "123"],
          ["GCP_SERVICE_ACCOUNT", "test@test.iam.gserviceaccount.com"]
        ])
      )

      const result = yield* Effect.exit(
        Effect.provide(
          GcpConfig,
          GcpConfigLive.pipe(Layer.setConfigProvider(testEnv))
        )
      )

      assert.isTrue(result._tag === "Failure")
    })
  )
})
```

**Step 2: Run tests**

Run:
```bash
pnpm --filter @puredialog/foundation test
```

Expected: All tests PASS

**Step 3: Commit**

```bash
git add packages/foundation/test/config
git commit -m "test(foundation): add GcpConfig tests

Test coverage:
- Test layer with hardcoded config
- Environment variable loading
- Default region fallback
- Schema validation failures

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Next Steps

This plan establishes the foundation for the infrastructure system. The next phases would include:

**Phase 4: Resource Data Types** - DeployedServiceData, EventTriggerData schemas
**Phase 5: Resource Layers** - ContainerImageLayer, DeployedServiceLayer with functor transformations
**Phase 6: Infrastructure Composition** - Full deployment pipeline using Layer.provide
**Phase 7: Application Integration** - Workers that consume infrastructure context

Each phase builds on the previous, maintaining testability and type safety throughout.

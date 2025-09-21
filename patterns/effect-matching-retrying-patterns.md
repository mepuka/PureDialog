### Effect Matching & Retrying Patterns: Agent Rules & Context

Here are the distilled patterns for matching outcomes and retrying failed operations, focusing on the most crucial, immediately useful concepts.

---

#### **Pattern 47: Unified Handling of Success and Failure (`matchEffect`)**

- **Main Point:** To provide separate, effectful handlers for both the success (`A`) and failure (`E`) channels at the same time. This is a fundamental way to resolve a computation chain into a final state.

- **Crucial Example:** Use `Effect.matchEffect` when your success or failure handlers need to perform their own effects, like logging or database writes. This guarantees the original effect's error channel is handled.

  ```typescript
  import { Effect } from "effect";

  const fallibleEffect: Effect.Effect<number, Error> = Effect.succeed(42);

  const program = Effect.matchEffect(fallibleEffect, {
    // Handler for the E channel
    onFailure: (error) => Effect.log(`Failed with: ${error.message}`),
    // Handler for the A channel
    onSuccess: (value) => Effect.log(`Succeeded with: ${value}`),
  });
  ```

---

#### **Pattern 48: Retrying Failures with a Policy (`retry`)**

- **Main Point:** To automatically re-execute a failing effect according to a defined `Schedule` policy (e.g., fixed intervals, exponential backoff). This is the core pattern for building resilience against transient errors.

- **Crucial Example:** Use `Effect.retry` with a `Schedule` to automatically handle temporary issues like network timeouts.

  ```typescript
  import { Effect, Schedule, Duration } from "effect";

  const transientEffect = Effect.fail("Network error");

  // Define a policy: wait 1s, then 2s, then 4s (3 retries total)
  const policy = Schedule.exponential(Duration.seconds(1)).pipe(
    Schedule.compose(Schedule.recurs(3))
  );

  const resilientProgram = Effect.retry(transientEffect, policy);
  ```

---

#### **Pattern 49: Inspecting the Full Failure Cause (Advanced)**

- **Main Point:** To handle **all** possible reasons a fiber might terminate, not just expected failures. This includes **defects** (`Die`) and **interruptions**, by inspecting the full `Cause` object.
- **Use Case / Problem Solved:** This is an advanced pattern for deep debugging or building low-level framework components. Functions like [`Effect.matchCause`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/error-management/matching/%23matchcause%5D(https://effect.website/docs/error-management/matching/%23matchcause)>) give you complete control to react differently to a programming bug versus a standard domain error, which is essential for robust, top-level application error logging.

---

#### **Pattern 50: Conditional Retrying (Advanced)**

- **Main Point:** To control retry logic based on the specific **error** that occurred or the **success value** that was produced.
- **Use Case / Problem Solved:** This provides fine-grained control. Use [`Effect.retryWhile`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/error-management/retrying/%23retrywhile%5D(https://effect.website/docs/error-management/retrying/%23retrywhile)>) to retry only for specific recoverable errors (like a "503 Service Unavailable") while failing immediately for others (like a "400 Bad Request"). This prevents wasting retries on errors that are guaranteed to fail again.

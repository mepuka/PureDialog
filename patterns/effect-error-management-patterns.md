### Effect Error Handling Patterns: Agent Rules & Context

Here are the distilled, reusable patterns from the documentation on handling expected errors.

---

#### **Pattern 38: Defining Tagged Errors for Precise Handling**

- **Rule:** To create a custom, identifiable error, define a class that extends `Data.TaggedError("TagName")`. This automatically adds a `_tag` property that enables type-safe pattern matching.

- **Context:** This is the foundational pattern for creating manageable domain errors. The `_tag` acts as a discriminant, allowing you to use handlers like `Effect.catchTag` to handle specific error types while letting others pass through, all with compile-time safety.

- **Code Example:**

  ```typescript
  import { Data } from "effect";

  // Defines an error with _tag: "HttpError"
  class HttpError extends Data.TaggedError("HttpError")<{}> {}

  // Defines an error with _tag: "ValidationError"
  class ValidationError extends Data.TaggedError("ValidationError")<{}> {}
  ```

---

#### **Pattern 39: Executing Sequentially Until First Failure (Short-Circuiting)**

- **Rule:** When composing effects sequentially (e.g., inside an `Effect.gen` block), execution stops immediately upon the first failure. All subsequent operations in the sequence are skipped.

- **Context:** This is the default error-handling behavior for sequential workflows. It ensures that a program doesn't continue executing in an invalid state after an error has occurred, making the flow predictable and preventing cascading failures.

- **Code Example:**

  ```typescript
  import { Effect, Console } from "effect";

  const task1 = Console.log("Executing task1...");
  const task2 = Effect.fail("Something went wrong!");
  const task3 = Console.log("Executing task3..."); // This line will never be reached.

  const program = Effect.gen(function* () {
    yield* task1;
    yield* task2;
    yield* task3; // Skipped due to the failure in task2.
  });
  ```

---

#### **Pattern 40: Converting Failures into Data with `either`**

- **Rule:** To handle a potential failure without short-circuiting, use `Effect.either()`. This transforms an `Effect<A, E>` into a new, infallible effect `Effect<Either<E, A>, never>`, moving the error from the error channel into the success channel as data.

- **Context:** This pattern is essential when you need to inspect the result of a fallible operation and make a decision based on it, rather than immediately stopping. It allows you to continue a workflow by explicitly handling both success (`Right`) and failure (`Left`) cases.

- **Code Example:**

  ```typescript
  import { Effect, Either } from "effect";

  const program = Effect.fail(new HttpError());

  const recovered = Effect.gen(function* () {
    const failureOrSuccess = yield* Effect.either(program);
    if (Either.isLeft(failureOrSuccess)) {
      const error = failureOrSuccess.left;
      return `Recovering from ${error._tag}`; // Handle the error.
    } else {
      return failureOrSuccess.right; // Continue with the success value.
    }
  });
  ```

---

#### **Pattern 41: Recovering from Any Expected Error with `catchAll`**

- **Rule:** To provide a fallback for _any_ expected error in an effect, pipe it to `Effect.catchAll((error) => recoveryEffect)`. This handles all failures and removes them from the effect's error channel, changing it to `never`.

- **Context:** Use `catchAll` when you want to provide a universal recovery mechanism or a default value, regardless of the specific type of error that occurred. It's a "catch-all" handler for the entire error channel (`E`).

- **Code Example:**

  ```typescript
  import { Effect } from "effect";

  const program: Effect.Effect<string, HttpError | ValidationError> =
    Effect.fail(new HttpError());

  // The resulting effect has its error channel changed to `never`.
  const recovered = program.pipe(
    Effect.catchAll((error) => Effect.succeed(`Recovering from ${error._tag}`))
  );
  ```

---

#### **Pattern 42: Handling Specific Errors by Tag (`catchTag` & `catchTags`)**

- **Rule:** To handle specific `TaggedError` types, use `Effect.catchTag("TagName", handler)` for a single error or `Effect.catchTags({ TagName1: handler1, ... })` for multiple. These functions remove the handled error types from the error channel.

- **Context:** This is the most idiomatic and common way to handle domain errors in Effect. It leverages the `_tag` property for type-safe pattern matching, allowing you to build resilient systems by explicitly handling each known failure case.

- **Code Example (`catchTags`):**

  ```typescript
  import { Effect } from "effect";

  const program: Effect.Effect<string, HttpError | ValidationError> =
    Effect.fail(new HttpError());

  const recovered = program.pipe(
    Effect.catchTags({
      HttpError: (_error) => Effect.succeed("Recovering from HttpError"),
      ValidationError: (_error) =>
        Effect.succeed("Recovering from ValidationError"),
    })
  );
  ```

---

#### **Pattern 43: Handling Specific Errors by Predicate (`catchIf`)**

- **Rule:** To handle errors that match a specific condition, use `Effect.catchIf(predicate, handler)`. The `predicate` must be a **user-defined type guard** (e.g., `(e): e is MyError => ...`) to correctly narrow and remove the error type from the effect's signature.

- **Context:** Use this pattern when you need more complex logic than a simple tag match to decide if an error should be handled. The type guard is critical for maintaining type safety and informing the compiler that a specific error has been dealt with.

- **Code Example:**

  ```typescript
  import { Effect } from "effect";

  const program: Effect.Effect<string, HttpError | ValidationError> =
    Effect.fail(new HttpError());

  const recovered = program.pipe(
    Effect.catchIf(
      // The type guard is essential for type-narrowing.
      (error): error is HttpError => error._tag === "HttpError",
      (_httpError) => Effect.succeed("Recovering from HttpError")
    )
  );
  ```

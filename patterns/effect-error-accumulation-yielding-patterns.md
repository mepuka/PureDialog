### Effect Error Accumulation & Yielding Patterns: Agent Rules & Context

Here are the distilled patterns for error accumulation and yieldable errors, focusing on the most crucial, immediately useful concepts.

-----

#### **Pattern 51: Accumulating All Errors from a Collection (`validateAll`)**

  * **Main Point:** To run all effects in a collection and gather all resulting errors, instead of stopping at the first one. Be aware that if any effect fails, **all success values are discarded**.

  * **Crucial Example:** Use [`Effect.validateAll`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/error-management/error-accumulation/%23validateall%5D\(https://effect.website/docs/error-management/error-accumulation/%23validateall\)) for validating multiple fields where you want to show the user all errors at once.

    ```typescript
    import { Effect } from "effect";

    const inputs = [1, 2, 3, 4, 5];

    // This program will collect failures from inputs 4 and 5.
    // The successful results for 1, 2, and 3 will be lost.
    const program = Effect.validateAll(inputs, (n) =>
      n < 4 ? Effect.succeed(n) : Effect.fail(`error with ${n}`)
    );
    ```

-----

#### **Pattern 52: Preserving Both Successes and Failures (`partition`)**

  * **Main Point:** To process a collection of effects and separate the outcomes into two distinct lists: one for all the failures and one for all the successes. This is the **non-lossy** way to accumulate results.

  * **Crucial Example:** Use [`Effect.partition`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/error-management/error-accumulation/%23partition%5D\(https://effect.website/docs/error-management/error-accumulation/%23partition\)) for batch jobs where you need a final report of which items succeeded and which failed.

    ```typescript
    import { Effect } from "effect";

    const inputs = [0, 1, 2, 3, 4];

    // The program is infallible and returns a tuple: [failures, successes]
    const program = Effect.partition(inputs, (n) =>
      n % 2 === 0
        ? Effect.succeed(n)
        : Effect.fail(`${n} is not even`)
    );

    // Result: [["1 is not even", "3 is not even"], [0, 2, 4]]
    ```

-----

#### **Pattern 53: Automatic Error Handling in Generators (`yieldable`)**

  * **Main Point:** Errors defined with `Data.TaggedError` (or `Schema.TaggedError`) are automatically **yieldable**. This means you can `throw` them inside an `Effect.gen` block, and Effect will automatically catch them and place them in the error channel, allowing for a more synchronous `try/throw` coding style.

  * **Crucial Example:** The most common use case is simply knowing that your custom tagged errors work seamlessly with generators without needing to be explicitly wrapped in `Effect.fail`.

    ```typescript
    import { Effect, Data } from "effect";

    // This error is automatically yieldable.
    class MyError extends Data.TaggedError("MyError")<{}> {}

    const program = Effect.gen(function* () {
      console.log("doing something...");
      // Throwing this works just like returning Effect.fail(new MyError())
      throw new MyError();
    });
    ```
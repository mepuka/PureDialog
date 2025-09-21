### Effect Defect Handling Patterns: Agent Rules & Context

Here are the distilled patterns for handling unexpected errors, or "defects," focusing on the most crucial, immediately useful concepts.

-----

#### **Pattern 44: Creating a Defect to Halt Execution**

  * **Main Point:** To immediately and unrecoverably terminate a computation due to a critical, unexpected error (like a bug or impossible state), you create a **defect**. This halts the current line of execution (the Fiber).

  * **Crucial Example:** Use `Effect.die` when you encounter a condition that should never happen.

    ```typescript
    import { Effect } from "effect";

    const divide = (a: number, b: number) =>
      b === 0
        ? Effect.die(new Error("Cannot divide by zero")) // This is an unrecoverable bug.
        : Effect.succeed(a / b);
    ```

-----

#### **Pattern 45: Promoting a Failure to a Defect (`orDie`)**

  * **Main Point:** To treat a normal, expected failure (`E`) as an unrecoverable defect, effectively "giving up" on the error channel because there is no sensible way to recover. This is a very common way to simplify error channels.

  * **Crucial Example:** Use `Effect.orDie` to escalate a known failure type into a program-halting defect when recovery isn't an option.

    ```typescript
    import { Effect } from "effect";

    // This effect can fail with an Error in its E channel.
    const fallibleEffect = Effect.fail(new Error("Something went wrong"));

    // We decide we can't recover, so we promote the failure to a defect.
    // The error channel is now `never`, simplifying its type.
    const program = Effect.orDie(fallibleEffect);
    ```

-----

#### **Pattern 46: Handling Defects at Application Boundaries (Advanced)**

  * **Main Point:** Catching defects is an advanced pattern that should **only be used at the edges of your application** (e.g., in your main entry point file). It is not for business logic recovery.
  * **Use Case / Problem Solved:** This is the application's last line of defense before crashing. You use functions like `Effect.exit` or `Effect.catchAllDefect` to inspect a defect, log critical information for debugging, or report the error to a monitoring service before the program gracefully shuts down. It allows you to observe unrecoverable errors without polluting your core logic with handling code for bugs.
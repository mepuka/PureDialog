### Effect Resource Management Patterns: Agent Rules & Context

Here are the distilled patterns for managing resources like files and connections, focusing on the most crucial and idiomatic concepts.

---

#### **Pattern 77: Safe Resource Management with `acquireUseRelease`**

- **Main Point**: The most idiomatic and safe way to manage a resource is with [`Effect.acquireUseRelease`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/resource-management/introduction/%23acquireuserelease%5D(https://effect.website/docs/resource-management/introduction/%23acquireuserelease)>). This pattern bundles the three stages of a resource's life into a single, safe operation, guaranteeing that the `release` action is always called.

- **Use Case / Problem Solved**: This is the primary tool to prevent resource leaks (e.g., open file handles, database connections). It completely abstracts away the complexity of `try/catch/finally` logic, ensuring that for every `acquire` operation, a corresponding `release` is always executed, even if the `use` step fails or is interrupted.

- **Crucial Example**:

  ```typescript
  import { Effect, Console } from "effect";

  // 1. An effect to acquire the resource (e.g., open a file)
  const acquire = Console.log("Resource acquired");

  // 2. An effect that uses the resource
  const use = Console.log("Using resource...");

  // 3. An effect to release the resource (e.g., close the file)
  const release = Console.log("Resource released!");

  const program = Effect.acquireUseRelease(
    acquire,
    () => use,
    () => release
  );
  ```

---

#### **Pattern 78: Guaranteed Cleanup with `ensuring`**

- **Main Point**: To guarantee that a specific cleanup effect runs after another effect completes—regardless of whether it succeeds, fails, or is interrupted—use [`Effect.ensuring`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/resource-management/introduction/%23ensuring%5D(https://effect.website/docs/resource-management/introduction/%23ensuring)>). It is the direct equivalent of a `try/finally` block.

- **Use Case / Problem Solved**: This provides a simple, general-purpose mechanism for cleanup actions that don't depend on the outcome of the primary effect. It's perfect for things like logging a "finished" message, closing a dialog, or decrementing a counter.

- **Crucial Example**:

  ```typescript
  import { Effect, Console } from "effect";

  const mainTask = Effect.fail("Something went wrong");
  const cleanup = Console.log("Cleanup logic is running!");

  // The cleanup logic will run even though mainTask fails.
  const program = Effect.ensuring(mainTask, cleanup);
  ```

---

#### **Pattern 79: Responding to the Outcome with `onExit`**

- **Main Point**: To run a finalizer that behaves differently based on whether the main effect succeeded, failed, or was interrupted, use [`Effect.onExit`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/resource-management/introduction/%23onexit%5D(https://effect.website/docs/resource-management/introduction/%23onexit)>). Your cleanup function receives an `Exit` object which you can inspect to determine the outcome.
- **Use Case / Problem Solved**: This is more powerful than `ensuring` when your cleanup logic needs to be conditional. For example, you might want to log a success message with the result, or log a detailed error message if a failure occurred.

---

#### **Pattern 80: Understanding Scopes (Advanced)**

- **Main Point**: A [`Scope`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/resource-management/scope/%5D(https://effect.website/docs/resource-management/scope/)>) is the low-level mechanism that powers all of Effect's safe resource management. It's a context that collects the finalizers for all acquired resources. When the scope is closed, it automatically runs all collected finalizers in the correct reverse order.
- **Use Case / Problem Solved**: Most of the time, you will **not** interact with `Scope` directly. High-level operators like `Effect.acquireUseRelease`, `Layer`, and `Stream` manage scopes for you automatically. Understanding `Scope` is for advanced use cases, like building your own complex, resource-managing data structures or needing fine-grained control over the lifetime of a group of resources.

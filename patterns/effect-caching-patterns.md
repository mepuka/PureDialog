### Effect Caching Patterns: Agent Rules & Context

Here are the distilled patterns for caching, focusing on the most crucial, immediately useful concepts.

-----

#### **Pattern 59: Simple, Self-Contained Caching (`cached`)**

  * **Main Point:** To create a lazy, single-use cached version of an effect. The first time the new effect is run, it computes and caches the result. All subsequent runs will return the cached value instantly without re-executing the original logic.

  * **Crucial Example:** Use [`Effect.cached`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/caching/caching-effects/%23cached%5D\(https://effect.website/docs/caching/caching-effects/%23cached\)) for expensive, idempotent operations within a local scope where you don't need manual control over the cache.

    ```typescript
    import { Effect } from "effect";

    const expensiveTask = Effect.log("expensive task...").pipe(
      Effect.zipRight(Effect.succeed("result"))
    );

    const program = Effect.gen(function* () {
      // 'cached' is a new effect that wraps 'expensiveTask'
      const cached = yield* Effect.cached(expensiveTask);

      // First run executes and caches
      yield* cached; // logs "expensive task..."
      // Second run returns the cached value immediately
      yield* cached; // does not log anything
    });
    ```

-----

#### **Pattern 60: Building a Stateful, Controllable Cache (`Cache`)**

  * **Main Point:** To create a more powerful, stateful cache object that can be shared across different parts of your application. You create it once with a **lookup function**, and then use its `.get(key)` method to retrieve values.

  * **Crucial Example:** Use [`Cache.make`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/caching/cache/%5D\(https://effect.website/docs/caching/cache/\)) when you need a centralized cache that multiple parts of your program can access, or when you need the ability to manually invalidate entries.

    ```typescript
    import { Effect, Cache } from "effect";

    // A lookup function that defines how to get a value when it's not in the cache.
    const getUser = (id: number) =>
      Effect.succeed(`user ${id}`).pipe(Effect.tap(() => Effect.log(`fetched user ${id}`)));

    const program = Effect.gen(function* () {
      const cache = yield* Cache.make({
        capacity: 256,
        timeToLive: "60 seconds",
        lookup: getUser, // Provide the lookup function here
      });

      // Both of these calls will only trigger the lookup function ONCE for id 1.
      yield* cache.get(1); // logs "fetched user 1"
      yield* cache.get(1); // does not log, returns cached value
    });
    ```

-----

#### **Pattern 61: Manual Cache Invalidation (Advanced)**

  * **Main Point:** The `Cache` object allows you to manually control the lifecycle of its entries, primarily by removing them with `.invalidate(key)`.
  * **Use Case / Problem Solved:** This is essential for preventing stale data. For example, after successfully updating a user's profile in the database, you would immediately call `cache.invalidate(userId)` to ensure the next request for that user fetches the new, updated data instead of serving a stale version from the cache.
### Effect Concurrency Patterns: Agent Rules & Context

Here are the distilled patterns for concurrency, focusing on the most crucial and idiomatic concepts for building concurrent applications.

---

#### **Pattern 98: Understanding Fibers (The Core of Concurrency)**

- **Main Point**: A [`Fiber`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/concurrency/fibers/%5D(https://effect.website/docs/concurrency/fibers/)>) is a lightweight, cooperative thread of execution. All concurrent operations in Effect are built on top of fibers. While you often use higher-level operators like `Effect.all`, understanding fibers is key to knowing how Effect manages concurrent tasks safely and efficiently.
- **Use Case / Problem Solved**: You can start an effect in the background with [`Effect.fork`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/concurrency/fibers/%23fork%5D(https://effect.website/docs/concurrency/fibers/%23fork)>) which immediately returns a `Fiber` without blocking the parent. You can then `Fiber.join` it later to get its result or `Fiber.interrupt` it to safely cancel its execution. This is the fundamental building block for all concurrent and parallel operations.

---

#### **Pattern 99: Distributing Work with Queues**

- **Main Point**: A [`Queue`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/concurrency/queue/%5D(https://effect.website/docs/concurrency/queue/)>) is a thread-safe, asynchronous communication channel used to distribute work between fibers. One or more "producer" fibers can `Queue.offer` items, and one or more "consumer" fibers can `Queue.take` them.

- **Use Case / Problem Solved**: This is the standard pattern for creating a "worker pool" or any producer-consumer setup. Using a **bounded** queue provides **back-pressure**, which is critical for building stable systems: it ensures that producers will pause if the queue is full, preventing them from overwhelming the consumers.

- **Crucial Example**: A classic use case is a web server where one fiber `offer`s incoming requests into a queue, and a pool of worker fibers calls `take` to process these requests concurrently.

  ```typescript
  import { Effect, Queue } from "effect";

  const program = Effect.gen(function* () {
    const queue = yield* Queue.bounded<number>(100);

    // Producer fiber
    yield* Queue.offer(queue, 1).pipe(Effect.fork);

    // Consumer fiber
    const value = yield* Queue.take(queue); // Will wait until a value is offered
    console.log(`Consumed: ${value}`);
  });
  ```

---

#### **Pattern 100: Broadcasting Messages with PubSub**

- **Main Point**: A [`PubSub`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/concurrency/pubsub/%5D(https://effect.website/docs/concurrency/pubsub/)>) is a broadcast hub. Unlike a Queue where each message goes to a single consumer, a message sent via `PubSub.publish` is delivered to **all** active subscribers.

- **Use Case / Problem Solved**: This is ideal for scenarios that require broadcasting events. For example, in a real-time chat application, a single incoming message needs to be sent to all connected users. Each user would have their own subscription `Queue` to the central `PubSub`.

- **Crucial Example**:

  ```typescript
  import { Effect, PubSub, Queue } from "effect";

  const program = Effect.scoped(
    Effect.gen(function* () {
      const pubsub = yield* PubSub.bounded<string>(10);

      // Two subscribers each get their own private queue
      const sub1Queue = yield* PubSub.subscribe(pubsub);
      const sub2Queue = yield* PubSub.subscribe(pubsub);

      // One message is published
      yield* PubSub.publish(pubsub, "hello world");

      // Both subscribers receive a copy
      const msg1 = yield* Queue.take(sub1Queue); // "hello world"
      const msg2 = yield* Queue.take(sub2Queue); // "hello world"
    })
  );
  ```

---

#### **Pattern 101: Limiting Concurrency with a Semaphore**

- **Main Point**: A [`Semaphore`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/concurrency/semaphore/%5D(https://effect.website/docs/concurrency/semaphore/)>) is used to control and limit concurrent access to a constrained resource. The safest way to use it is with `Semaphore.withPermits(n)(effect)`, which acquires `n` permits, runs the effect, and guarantees the permits are released afterward.

- **Use Case / Problem Solved**: This is crucial when interacting with external systems that have rate limits. If you need to call a third-party API that only allows 10 concurrent requests, you can use a `Semaphore.make(10)` to ensure that no more than 10 of your fibers are calling that API at the same time.

- **Crucial Example**:

  ```typescript
  import { Effect, Semaphore } from "effect";

  const apiCall = Effect.sleep("1 second");

  const program = Effect.gen(function* () {
    // Create a semaphore that allows up to 10 concurrent permits
    const sem = yield* Semaphore.make(10);

    // This will run all 100 apiCalls, but never more than 10 at the same time.
    yield* Effect.forEach(Array.range(1, 100), () =>
      sem.withPermits(1)(apiCall)
    );
  });
  ```

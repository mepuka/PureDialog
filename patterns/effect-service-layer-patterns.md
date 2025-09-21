Of course, here are the distilled patterns for services and layers in Effect.

### Effect Service & Layer Patterns: Agent Rules & Context

Here are the distilled patterns for service and layer management, focusing on the most crucial, immediately useful concepts.

---

#### **Pattern 54: Defining and Using a Service**

- **Main Point:** A **service** is defined by a `Context.Tag`, which acts as a unique identifier and specifies the service's interface. Effects declare their need for a service in their third type parameter (`R` for requirements).

- **Crucial Example:** This shows the full lifecycle: defining a `Random` service tag, using it in a program (which adds `Random` to the program's requirements), and finally providing a live implementation to make the program runnable.

  ```typescript
  import { Effect, Context } from "effect";

  // 1. Define the service tag and its interface
  class Random extends Context.Tag("MyRandomService")<
    Random,
    { readonly next: Effect.Effect<number> }
  >() {}

  // 2. Use the service, which adds it to the Effect's requirements
  const program: Effect.Effect<void, never, Random> = Effect.gen(function* () {
    const random = yield* Random;
    const randomNumber = yield* random.next;
    console.log(`random number: ${randomNumber}`);
  });

  // 3. Provide a live implementation to satisfy the requirement
  const runnable = Effect.provideService(program, Random, {
    next: Effect.sync(() => Math.random()),
  });

  // Now the effect is runnable because its requirements are met
  Effect.runPromise(runnable);
  ```

---

#### **Pattern 55: Defining a Layer to Construct a Service**

- **Main Point:** A **`Layer`** is a blueprint that describes _how_ to construct a service. It encapsulates the creation logic, including any dependencies the service itself might have.

- **Crucial Example:** Use [`Layer.succeed`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/requirements-management/layers/%23succeed%5D(https://effect.website/docs/requirements-management/layers/%23succeed)>) for services that don't need complex setup. For services that need initialization (e.g., opening a file, connecting to a DB), use `Layer.effect`.

  ```typescript
  import { Layer } from "effect";

  // A Layer that provides a live implementation of the Random service
  const RandomLive = Layer.succeed(Random, {
    next: Effect.sync(() => Math.random()),
  });
  ```

---

#### **Pattern 56: Composing Layers to Build a Dependency Graph**

- **Main Point:** You build your application's full set of services by composing layers. [`Layer.provide`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/requirements-management/layers/%23provide%5D(https://effect.website/docs/requirements-management/layers/%23provide)>) is used to supply one layer as a dependency to another, creating a new, more complete layer with fewer outstanding requirements.
- **Use Case / Problem Solved:** This is the core of dependency injection in Effect. It allows you to build a complex application from small, modular, and testable pieces. The compiler validates the dependency graph, ensuring you provide all necessary services.

---

#### **Pattern 57: Providing a Complete Layer to an Application**

- **Main Point:** Once you have composed a final layer that satisfies all of your application's service requirements, you provide it to your main `Effect` using [`Effect.provide`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/requirements-management/layers/%23providing-layers-to-effects%5D(https://effect.website/docs/requirements-management/layers/%23providing-layers-to-effects)>). This removes the `R` type parameter, making the effect self-contained and ready to run.

- **Crucial Example:** This is the final step that connects your business logic to its dependencies.

  ```typescript
  // Assuming `program` is an Effect that requires the `Random` service
  // And `RandomLive` is a Layer that provides the `Random` service

  const runnable: Effect.Effect<void, never, never> = Effect.provide(
    program,
    RandomLive
  );
  ```

---

#### **Pattern 58: Automatic Memoization of Layers**

- **Main Point:** Effect automatically ensures that within a single dependency graph, each service is only created **once**. That single instance is then shared with all other services that depend on it.
- **Use Case / Problem Solved:** This gives you singleton behavior for free, which is critical for managing resources like database connection pools or caches. It prevents redundant and costly initializations and ensures that all parts of your application are working with the same service instance, as explained in the [documentation on memoization](https://effect.website/docs/requirements-management/layer-memoization/).

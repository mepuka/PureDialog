Of course. Here are the distilled patterns for branded types and for avoiding nested code.

### Effect Code Style Patterns: Agent Rules & Context

Here are the distilled patterns for code style, focusing on the most crucial, immediately useful concepts.

---

#### **Pattern 62: Creating Distinct Types with Nominal Brands**

- **Main Point:** To prevent accidental misuse of types that have the same underlying structure (e.g., both `UserId` and `ProductId` being `number`s), you should create a **nominal brand**. This adds a unique, compile-time-only tag to a base type, making it incompatible with other types.

- **Crucial Example:** Use [`Brand.nominal`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/code-style/branded-types/%23nominal%5D(https://effect.website/docs/code-style/branded-types/%23nominal)>) to create safe, distinct constructors for your identifiers. This is a cornerstone of type safety in Effect applications.

  ```typescript
  import { Brand } from "effect";

  // 1. Define the branded type
  type UserId = number & Brand.Brand<"UserId">;

  // 2. Create a safe constructor
  const UserId = Brand.nominal<UserId>();

  function getUser(id: UserId) {
    /* ... */
  }

  getUser(UserId(123)); // Correct usage
  // getUser(123);       // Compile-time error! Prevents bug.
  ```

---

#### **Pattern 63: Avoiding Nesting with Generators (`gen`)**

- **Main Point:** To write complex, sequential asynchronous workflows without deep nesting (i.e., "callback hell"), use [`Effect.gen`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/code-style/do/%5D(https://effect.website/docs/code-style/do/)>). It uses generator functions (`function*`) and the `yield*` keyword to make your asynchronous code look and read like simple, synchronous code.

- **Crucial Example:** This is the most idiomatic way to write readable, multi-step effects.

  ```typescript
  import { Effect } from "effect";

  const program = Effect.gen(function* () {
    // Each `yield*` unwraps the success value of an Effect.
    const value1 = yield* Effect.succeed(1);
    const value2 = yield* Effect.succeed(value1 + 1);
    const value3 = yield* Effect.succeed(value2 + 1);
    return value3; // The final return is the success value of `program`.
  });
  ```

---

#### **Pattern 64: Self-Validating Types with Refined Brands (Advanced)**

- **Main Point:** A **refined brand** creates a type that also includes runtime validation. This guarantees that any value of the branded type has already passed a specific check.
- **Use Case / Problem Solved:** Use [`Brand.refined`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/code-style/branded-types/%23refined%5D(https://effect.website/docs/code-style/branded-types/%23refined)>) to create types with built-in business rules, like `Int` (a number that is guaranteed to be an integer) or `NonEmptyString`. This pushes validation to the "edges" of your application, allowing your core logic to safely assume the data is valid, which greatly simplifies your code.

---

#### **Pattern 65: Avoiding Nesting with `Do` Notation (Alternative)**

- **Main Point:** As an alternative to `Effect.gen`, you can use a pipeline of `Effect.Do`, `Effect.bind`, and `Effect.let` to build up a result step-by-step.
- **Use Case / Problem Solved:** This achieves the same goal as `Effect.gen`—flat, readable, sequential code—but with a more functional, pipe-based syntax. It's a matter of style and can be preferable in codebases that want to avoid generator syntax.

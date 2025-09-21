### Effect Data Structure Patterns: Agent Rules & Context

Here are the distilled patterns for Effect's core data structures, focusing on the most crucial, immediately useful concepts.

---

#### **Pattern 66: High-Performance Concatenation with `Chunk`**

- **Main Point:** A [`Chunk`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/data-types/chunk/%5D(https://effect.website/docs/data-types/chunk/)>) is an **immutable, array-like data structure** specifically optimized for scenarios involving **repeatedly appending or concatenating collections**.

- **Use Case / Problem Solved:** This is the ideal data structure when building up a large collection piece by piece, such as processing a data stream or parsing a file. Standard JavaScript array concatenation (`[...arr1, ...arr2]`) is inefficient in a loop because it copies the entire array each time. `Chunk` uses a more efficient internal tree structure to make these appends significantly faster.

- **Crucial Example:** Use `Chunk.appendAll` inside loops where you are incrementally building a larger collection.

  ```typescript
  import { Chunk } from "effect";

  // Imagine processing a large stream of data in smaller pieces
  let accumulator = Chunk.empty<string>();
  const dataPieces = [
    ["a", "b"],
    ["c", "d"],
    ["e", "f"],
  ];

  // In a loop, appending is highly efficient compared to array spreading
  for (const piece of dataPieces) {
    accumulator = Chunk.appendAll(accumulator, Chunk.fromIterable(piece));
  }
  ```

---

#### **Pattern 67: Creating a `Chunk`**

- **Main Point:** You can create a `Chunk` from individual elements using `Chunk.make` or from any existing iterable (like an array) using `Chunk.fromIterable`.

- **Crucial Example:** These are the standard, safe constructors for `Chunk`.

  ```typescript
  import { Chunk } from "effect";

  // From individual values (this creates a NonEmptyChunk)
  const fromValues = Chunk.make(1, 2, 3);

  // From an existing array (this creates a standard Chunk)
  const fromArray = Chunk.fromIterable([4, 5, 6]);
  ```

---

#### **Pattern 68: Interacting with Native Arrays (Advanced)**

- **Main Point:** While `Chunk` is powerful for building collections, you often need to convert back to a standard array to interoperate with other libraries.
- **Use Case / Problem Solved:**
  - **`Chunk.toReadonlyArray`**: Use this when you've finished all your high-performance `Chunk` operations and need to pass the final result to a function or library that expects a standard `readonly T[]`.
  - **`Chunk.unsafeFromArray`**: For extreme, performance-critical situations, this function creates a `Chunk` without copying the source array's data. **This is dangerous** because if the original array is mutated later, it breaks the immutability guarantee of the `Chunk` and can lead to unpredictable bugs. Use it with extreme caution.

Of course. Here are the distilled patterns for `Data`, `DateTime`, and `HashSet`.

### Effect Data Structure Patterns: Agent Rules & Context

Here are the distilled patterns for Effect's core data structures, focusing on the most crucial, immediately useful concepts.

---

#### **Pattern 69: Creating Data with Value-Based Equality (`Data`)**

- **Main Point:** To solve the problem of JavaScript comparing objects by reference (`{ a: 1 } !== { a: 1 }`), use the [`Data` module](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/data-types/data/%5D(https://effect.website/docs/data-types/data/)>). It provides constructors like `Data.struct` that create objects which can be compared by their internal values using `Equal.equals`.

- **Use Case / Problem Solved:** This is essential for reliable comparisons, especially when working with immutable data structures, adding elements to a `HashSet`, or writing tests. It ensures that two objects representing the same data are treated as equal.

- **Crucial Example:**

  ```typescript
  import { Data, Equal } from "effect";

  const alice1 = Data.struct({ name: "Alice", age: 30 });
  const alice2 = Data.struct({ name: "Alice", age: 30 });

  // This is `true` because Data.struct provides value-based equality.
  console.log(Equal.equals(alice1, alice2));

  // A standard object comparison would be `false`.
  ```

---

#### **Pattern 70: Modeling States with Tagged Unions (`TaggedEnum`)**

- **Main Point:** The most powerful and idiomatic way to create a discriminated union is with [`Data.TaggedEnum`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/data-types/data/%23union-of-tagged-structs%5D(https://effect.website/docs/data-types/data/%23union-of-tagged-structs)>). It automatically creates tagged constructors, type guards (`$is`), and a pattern matcher (`$match`) for all cases of your union.

- **Use Case / Problem Solved:** It provides a complete, type-safe, and ergonomic solution for modeling data that can be one of several distinct shapes, like the state of a network request (`Loading | Success | Failure`). It eliminates boilerplate and prevents common errors when working with unions.

- **Crucial Example:**

  ```typescript
  import { Data } from "effect";

  // 1. Define the union type
  type RemoteData = Data.TaggedEnum<{
    Loading: {};
    Success: { readonly data: string };
    Failure: { readonly reason: string };
  }>;

  // 2. Create the constructors and helpers
  const { Loading, Success, Failure, $match } = Data.taggedEnum<RemoteData>();

  // 3. Use them to model and handle state
  const currentState = Success({ data: "User data" });
  const view = $match(currentState, {
    Loading: () => "<div>Loading...</div>",
    Success: ({ data }) => `<div>${data}</div>`,
    Failure: ({ reason }) => `<div class="error">${reason}</div>`,
  });
  ```

---

#### **Pattern 71: Managing Unique Values with `HashSet`**

- **Main Point:** A [`HashSet`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/data-types/hash-set/%5D(https://effect.website/docs/data-types/hash-set/)>) is an **immutable** collection of unique values that, crucially, uses **value-based equality**.

- **Use Case / Problem Solved:** This is the correct choice when you need a "Set" of complex objects. A native JavaScript `Set` uses reference equality and would incorrectly store two separate but identical `Data.struct` objects. A `HashSet` correctly identifies them as the same value and stores only one. This is perfect for tasks like deduplicating a list of complex objects.

- **Crucial Example:**

  ```typescript
  import { HashSet, Data } from "effect";

  const alice1 = Data.struct({ name: "Alice" });
  const alice2 = Data.struct({ name: "Alice" });

  // Native Set incorrectly stores two entries due to reference equality.
  const nativeSet = new Set([alice1, alice2]); // nativeSet.size is 2

  // HashSet correctly stores only one entry due to value equality.
  const hashSet = HashSet.make(alice1, alice2); // HashSet.size(hashSet) is 1
  ```

---

#### **Pattern 72: Immutable Date Operations with `DateTime` (Advanced)**

- **Main Point:** The [`DateTime`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/data-types/datetime/%5D(https://effect.website/docs/data-types/datetime/)>) module provides an immutable and type-safe alternative to JavaScript's native `Date` object.
- **Use Case / Problem Solved:** JavaScript's `Date` object is mutable, which can lead to subtle bugs. `DateTime` solves this by having every operation (e.g., adding days) return a _new_ `DateTime` instance, preserving the original. This makes date logic predictable and safe, especially in concurrent or complex applications where you need more robust date handling.

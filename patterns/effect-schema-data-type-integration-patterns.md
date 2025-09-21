### Effect Schema Data Type Integration Patterns: Agent Rules & Context

Here are the distilled, reusable patterns from the documentation for integrating `Schema` with core `Effect` data types.

---

#### **Pattern 27: Adding Value-Based Equality to Schemas**

- **Rule:** To ensure decoded objects can be compared by their value rather than by reference, wrap the entire schema definition in `Schema.Data()`.
- **Context:** By default, two separately decoded objects are not considered equal (`===`) even if they have the same content. `Schema.Data()` makes them compatible with `Equal.equals()`, which is essential for use in `HashSet`, `HashMap`, or for reliable comparisons in tests.
- **Code Example:**

  ```typescript
  import { Schema, Equal } from "effect";

  const schema = Schema.Data(
    Schema.Struct({
      name: Schema.String,
      age: Schema.Number,
    })
  );

  const person1 = Schema.decodeUnknownSync(schema)({ name: "Alice", age: 30 });
  const person2 = Schema.decodeUnknownSync(schema)({ name: "Alice", age: 30 });

  // This is now `true`
  Equal.equals(person1, person2);
  ```

---

#### **Pattern 28: Defining Schemas for Application Configuration**

- **Rule:** To create a schema that reads from and validates application configuration (like environment variables), use `Schema.Config("VARIABLE_NAME", ValueSchema)`. The `ValueSchema` must be able to decode from a `string`.
- **Context:** This is the standard pattern for defining type-safe application configuration. It integrates directly with Effect's `Config` system, providing clear, structured error messages if a variable is missing or invalid.
- **Code Example:**

  ```typescript
  import { Effect, Schema } from "effect";

  // Defines a config that expects "Foo" to exist and be a string of at least 4 chars.
  const myConfig = Schema.Config(
    "Foo",
    Schema.String.pipe(Schema.minLength(4))
  );

  // Usage
  const program = Effect.gen(function* () {
    const foo = yield* myConfig;
    console.log(`ok: ${foo}`);
  });
  ```

---

#### **Pattern 29: Converting `null` or `undefined` to `Option`**

- **Rule:** To model optional values by converting `null`, `undefined`, or both into an `Option`, use `Schema.OptionFromNullOr()`, `Schema.OptionFromUndefinedOr()`, or `Schema.OptionFromNullishOr()`.
- **Context:** This is a key pattern for safely handling missing data from external sources (like JSON APIs). It transforms potentially unsafe `null`/`undefined` values into a type-safe `Option` that makes the absence of a value explicit.
- **Code Example:**

  ```typescript
  import { Schema, Option } from "effect";

  // Decodes `undefined` to `Option.none()` and a `string` to `Option.some(number)`
  // Encodes `Option.none()` back to `undefined`
  const schema = Schema.OptionFromUndefinedOr(Schema.NumberFromString);
  ```

---

#### **Pattern 30: Serializing `Option` and `Either` Types**

- **Rule:** To convert `Option` and `Either` types to and from a JSON-serializable format, use `Schema.Option(ValueSchema)` and `Schema.Either({ left: L, right: R })` respectively.
- **Context:** `Effect` data types like `Option` and `Either` are classes and cannot be directly serialized to JSON. These schemas convert them to and from a standard tagged object format (e.g., `{ _tag: "Some", value: ... }`) suitable for transport over a network.
- **Code Example (`Option`):**

  ```typescript
  import { Schema, Option } from "effect";

  // Encoded: { _tag: "Some", value: "1" } | { _tag: "None" }
  // Decoded: Option<number>
  const schema = Schema.Option(Schema.NumberFromString);
  ```

---

#### **Pattern 31: Serializing Immutable Collections**

- **Rule:** To convert immutable collections like `ReadonlySet`, `HashSet`, or `HashMap` to and from a JSON-serializable `Array`, use the corresponding schema constructor (`Schema.HashSet(ValueSchema)`, etc.).
- **Context:** This is the standard way to serialize Effect's performant, immutable collections. `HashSet` and `ReadonlySet` are converted to arrays of their values. `HashMap` and `ReadonlyMap` are converted to arrays of `[key, value]` tuples.
- **Code Example (`HashSet`):**

  ```typescript
  import { Schema, HashSet } from "effect";

  // Encoded: readonly string[]
  // Decoded: HashSet<number>
  const schema = Schema.HashSet(Schema.NumberFromString);
  ```

---

#### **Pattern 32: Converting between a `Map` and a `Record`**

- **Rule:** To convert between a `ReadonlyMap` and a plain JavaScript object (`Record<string, T>`), use `Schema.ReadonlyMapFromRecord({ key: KeySchema, value: ValueSchema })`.
- **Context:** While the default serialization for a Map is an array of tuples, this is often inconvenient. This pattern allows you to directly convert a map into a more common dictionary-like object, which is a very frequent requirement for JSON APIs.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  const schema = Schema.ReadonlyMapFromRecord({
    key: Schema.NumberFromString, // The object key will be a string
    value: Schema.NumberFromString, // The object value will be a string
  });

  // Decodes `{ "1": "4" }` into `new Map([[1, 4]])`
  ```

---

#### **Pattern 33: Handling Sensitive Data with `Redacted`**

- **Rule:** To prevent sensitive data from being logged or displayed, wrap its schema with `Schema.Redacted()`. This transforms the value into a `Redacted` object.
- **Context:** This is a security-focused pattern. When a `Redacted` value is converted to a string (e.g., by `console.log`), it outputs `<redacted>` instead of the actual value, preventing accidental exposure of secrets in logs while retaining the original value in memory.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  const schema = Schema.Redacted(Schema.String);

  const decoded = Schema.decodeUnknownSync(schema)("keep it secret");

  // This will print `<redacted>` instead of the secret string.
  console.log(decoded);
  ```

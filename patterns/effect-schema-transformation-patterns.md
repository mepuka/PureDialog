### Effect Schema Transformation Patterns: Agent Rules & Context

Here are the distilled, reusable patterns from the documentation on schema transformations.

---

#### **Pattern 15: Failsafe Two-Way Transformation**

- **Rule:** To create a bi-directional transformation between two schemas where the logic cannot fail, use `Schema.transform(SourceSchema, TargetSchema, { decode, encode })`.
- **Context:** This is for simple, deterministic conversions. Use it when you are certain the `decode` and `encode` functions will always succeed, such as converting `"on"`/`"off"` to a boolean. The transformation's success is entirely dependent on the source schema's validation.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  const BooleanFromString = Schema.transform(
    // Source schema
    Schema.Literal("on", "off"),
    // Target schema
    Schema.Boolean,
    {
      // Decode from "on" | "off" -> boolean
      decode: (literal) => literal === "on",
      // Encode from boolean -> "on" | "off"
      encode: (bool) => (bool ? "on" : "off"),
    }
  );
  ```

---

#### **Pattern 16: Fallible Two-Way Transformation**

- **Rule:** For transformations where the conversion logic itself might fail (e.g., parsing), use `Schema.transformOrFail(SourceSchema, TargetSchema, { decode, encode })`. The functions must return a `ParseResult`.
- **Context:** This is the standard for handling unreliable inputs. The `decode`/`encode` functions gain the ability to signal failure. Use `ParseResult.succeed(value)` for success and `ParseResult.fail(...)` for errors.
- **Code Example:**

  ```typescript
  import { ParseResult, Schema } from "effect";

  export const NumberFromString = Schema.transformOrFail(
    Schema.String,
    Schema.Number,
    {
      decode: (input, _, ast) => {
        const parsed = parseFloat(input);
        return isNaN(parsed)
          ? ParseResult.fail(
              new ParseResult.Type(ast, input, "Failed to convert")
            )
          : ParseResult.succeed(parsed);
      },
      encode: (input) => ParseResult.succeed(input.toString()),
    }
  );
  ```

---

#### **Pattern 17: Asynchronous Transformation (with Effect)**

- **Rule:** To perform an asynchronous transformation (e.g., an API call), use `Schema.transformOrFail` and have the `decode` or `encode` function return an `Effect`.
- **Context:** This pattern integrates Effect's core capabilities directly into schema validation. It's essential for validation that depends on external systems. The `Effect`'s success channel provides the transformed value, and its failure channel is mapped to a `ParseResult` error.
- **Code Example:**

  ```typescript
  import { Effect, Schema, ParseResult } from "effect";

  const PeopleIdFromString = Schema.transformOrFail(
    Schema.String,
    PeopleId, // A branded string type
    {
      decode: (s, _, ast) =>
        // The API call returns an Effect
        Effect.mapBoth(get(`https://swapi.dev/api/people/${s}`), {
          onFailure: (e) => new ParseResult.Type(ast, s, e.message),
          onSuccess: () => s,
        }),
      encode: ParseResult.succeed,
    }
  );
  ```

---

#### **Pattern 18: One-Way Transformation (Forbidden Encoding)**

- **Rule:** To create a transformation that only goes one way (like hashing), use `Schema.transformOrFail` and explicitly forbid the reverse operation by having the `encode` function return `ParseResult.fail(new ParseResult.Forbidden(...))`.
- **Context:** Use this for security-sensitive operations or any case where reversing a transformation is impossible or should be prevented. This makes the schema's intent explicit and type-safe.
- **Code Example:**

  ```typescript
  import { Schema, ParseResult, Redacted } from "effect";

  export const PasswordHashing = Schema.transformOrFail(
    PlainPassword, // Schema for a plain string
    Schema.RedactedFromSelf(HashedPassword), // Schema for the hashed output
    {
      decode: (plainPassword) => {
        /* ...hashing logic... */
      },
      encode: (hashedPassword, _, ast) =>
        ParseResult.fail(
          new ParseResult.Forbidden(
            ast,
            hashedPassword,
            "Encoding is forbidden."
          )
        ),
    }
  );
  ```

---

#### **Pattern 19: Chaining Transformations**

- **Rule:** To chain two schemas together, where the output of the first becomes the input of the second, use `Schema.compose(firstSchema, secondSchema)`.
- **Context:** This is a powerful composition pattern for building complex parsing logic from smaller, reusable pieces. It allows you to create a processing pipeline (e.g., split string -\> convert elements to numbers) in a declarative way.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  // First step: string -> readonly string[]
  const schema1 = Schema.asSchema(Schema.split(","));

  // Second step: readonly string[] -> readonly number[]
  const schema2 = Schema.asSchema(Schema.Array(Schema.NumberFromString));

  // Combined schema: string -> readonly number[]
  const ComposedSchema = Schema.asSchema(Schema.compose(schema1, schema2));
  ```

---

#### **Pattern 20: Using Built-in String/Number Parsers**

- **Rule:** For common data conversions, prefer the built-in transformation schemas like `Schema.NumberFromString`, `Schema.Date`, `Schema.Trim`, and `Schema.parseJson()`.
- **Context:** These pre-built schemas handle common edge cases and provide standardized error messages. Using them is faster and less error-prone than writing the transformation logic yourself.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  // Safely parses a string into a number, handling "NaN", "Infinity", etc.
  const schema = Schema.NumberFromString;

  // Parses a JSON string and validates its structure against another schema.
  const schema2 = Schema.parseJson(Schema.Struct({ a: Schema.Number }));
  ```

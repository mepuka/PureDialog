### Effect Schema Coding Patterns: Agent Rules & Context

Here are the distilled, reusable patterns from the documentation, designed for instructing an LLM coding agent.

---

#### **Pattern 1: Defining Primitive Types**

- **Rule:** To define a schema for a standard primitive type, use the corresponding constructor from the `Schema` module (e.g., `String`, `Number`, `Boolean`).
- **Context:** This is the most basic building block for all other schemas. It validates that a value is of a specific JavaScript primitive type.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  const schema = Schema.String;
  ```

---

#### **Pattern 2: Defining Exact Literal Values**

- **Rule:** To constrain a schema to one or more specific literal values (e.g., status codes, specific strings), use `Schema.Literal()`. You can pass multiple arguments to create a union of those literals.
- **Context:** Use this when a value must be one of a small, fixed set of constants, like in a dropdown menu or for a status field.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  // Allows one of "a", "b", or "c"
  const schema = Schema.Literal("a", "b", "c");
  ```

---

#### **Pattern 3: Defining Object Structures**

- **Rule:** To define a schema for an object with a fixed set of named properties, use `Schema.Struct({})`, passing an object where keys are property names and values are their corresponding schemas.
- **Context:** This is the primary pattern for defining data records, API payloads, and configuration objects where the shape is known ahead of time.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  const schema = Schema.Struct({
    name: Schema.String,
    age: Schema.Number,
  });
  ```

---

#### **Pattern 4: Defining "OR" Types (Unions)**

- **Rule:** To define a schema that can be one of several different types, combine them using `Schema.Union()`. When members are structs, place the most specific schemas first to ensure correct parsing.
- **Context:** Essential for modeling data that can have multiple valid shapes. The ordering rule is critical for parsing overlapping object structures correctly.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  // A value can be a string OR a number
  const schema = Schema.Union(Schema.String, Schema.Number);
  ```

---

#### **Pattern 5: Defining Discriminated Unions**

- **Rule:** Model a discriminated union by creating a `Schema.Union` of `Schema.Struct`s. Each struct must share a common "discriminant" property defined with a unique `Schema.Literal`.
- **Context:** This is the standard, type-safe pattern for handling objects that can be one of several distinct shapes, identifiable by a tag or `kind` property.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  const Circle = Schema.Struct({
    kind: Schema.Literal("circle"),
    radius: Schema.Number,
  });

  const Square = Schema.Struct({
    kind: Schema.Literal("square"),
    sideLength: Schema.Number,
  });

  const Shape = Schema.Union(Circle, Square);
  ```

---

#### **Pattern 6: Defining Arrays**

- **Rule:** To define a schema for an array where all elements are of the same type, use `Schema.Array()` and pass the element's schema as an argument.
- **Context:** Use this for any list or collection of items, such as a list of users, products, or tags.
- **Code Example:**

  ```typescript
  import { Schema } from "effect";

  // Defines a schema for an array of numbers
  const schema = Schema.Array(Schema.Number);
  ```

---

#### **Pattern 7: Modifying Structs (Pick/Omit/Partial)**

- **Rule:** To derive a new struct schema from an existing one, use its static methods: `.pick()` to select properties, `.omit()` to exclude properties, or `Schema.partial()` to make all properties optional.
- **Context:** This promotes reusability. Define a complete data model once, then derive variations for different use cases (e.g., API inputs vs. database models) without redefining the entire structure.
- **Code Example (Pick):**

  ```typescript
  import { Schema } from "effect";

  const MyStruct = Schema.Struct({
    a: Schema.String,
    b: Schema.Number,
    c: Schema.Boolean,
  });

  // Creates a new schema with only properties "a" and "c"
  const PickedSchema = MyStruct.pick("a", "c");
  ```

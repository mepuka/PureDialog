### Effect Schema Advanced Coding Patterns: Agent Rules & Context

Here are the next distilled, reusable patterns from the documentation on advanced usage.

-----

#### **Pattern 8: Creating Semantically Safe Branded Types**

  * **Rule:** To prevent structurally identical types (like two different string IDs) from being used interchangeably, create a "branded" type. Pipe a base schema to `Schema.brand("UniqueBrandName")`.
  * **Context:** This is a crucial pattern for improving type safety. It ensures that a function expecting a `UserId` cannot accidentally be given a `ProductId`, even though both may be strings underneath.
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    const UserId = Schema.String.pipe(Schema.brand("UserId"))

    // Creates the type: string & Brand<"UserId">
    type UserId = typeof UserId.Type
    ```

-----

#### **Pattern 9: Handling Optional Struct Properties**

  * **Rule:** To define a property that can be missing or `undefined` in a struct, wrap its schema with `Schema.optional()`.
  * **Context:** Use this for fields that are not always required in API payloads or data models. The resulting type will have the property marked as optional (e.g., `name?: string`).
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    const Product = Schema.Struct({
      quantity: Schema.optional(Schema.NumberFromString)
    })
    ```

-----

#### **Pattern 10: Providing Default Values**

  * **Rule:** To provide a default value for a field if it is missing or `undefined` in the input, use `Schema.optionalWith(SchemaType, { default: () => myDefaultValue })`.
  * **Context:** This pattern ensures that a field is always present in the decoded output type, even if it was absent in the input. The output property becomes non-optional (e.g., `quantity: number`).
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    const Product = Schema.Struct({
      quantity: Schema.optionalWith(Schema.NumberFromString, {
        default: () => 1
      })
    })
    ```

-----

#### **Pattern 11: Transforming Optional Fields into `Option`**

  * **Rule:** To explicitly model the presence or absence of a value, transform an optional field into an `Option` type by using `Schema.optionalWith(SchemaType, { as: "Option" })`.
  * **Context:** This is a functional programming pattern that avoids `null` or `undefined`. Missing input becomes `Option.none()`, and a present value becomes `Option.some(value)`, making the absence of a value explicit and type-safe.
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    const Product = Schema.Struct({
      quantity: Schema.optionalWith(Schema.NumberFromString, { as: "Option" })
    })
    ```

-----

#### **Pattern 12: Extending Existing Structs**

  * **Rule:** To add properties to an existing struct schema, create a new `Schema.Struct` and spread the `.fields` of the original schema into the new definition before adding the new fields.
  * **Context:** This promotes schema reuse. You can define a base schema and then create more specific versions by extending it, avoiding redundant definitions.
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    const Original = Schema.Struct({
      a: Schema.String
    })

    const Extended = Schema.Struct({
      ...Original.fields,
      c: Schema.String
    })
    ```

-----

#### **Pattern 13: Renaming Properties Between Encoded and Decoded Types**

  * **Rule:** To map a property from one name in the input (`Encoded` type) to another in the output (`Type`), define it with `Schema.propertySignature()` and pipe it to `Schema.fromKey("sourceKeyName")`.
  * **Context:** Essential for integrating with external APIs or databases that use different naming conventions (e.g., mapping `snake_case` from a JSON API to `camelCase` in your domain model).
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    const schema = Schema.Struct({
      // Maps incoming "c" property to outgoing "a" property
      a: Schema.propertySignature(Schema.String).pipe(Schema.fromKey("c"))
    })
    ```

-----

#### **Pattern 14: Defining Recursive Schemas**

  * **Rule:** To define a schema that refers to itself (e.g., a category with sub-categories), you must first define a TypeScript `interface` for the shape. Then, use `Schema.suspend(() => MySchema)` at the point of recursion.
  * **Context:** This is the standard way to model tree-like or nested data structures where the type definition is self-referential. The explicit interface is required to prevent TypeScript from inferring an `any` type.
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    // 1. Define the interface first
    interface Category {
      readonly name: string
      readonly subcategories: ReadonlyArray<Category>
    }

    // 2. Use Schema.suspend to break the circular reference
    const Category = Schema.Struct({
      name: Schema.String,
      subcategories: Schema.Array(
        Schema.suspend((): Schema.Schema<Category> => Category)
      )
    })
    ```
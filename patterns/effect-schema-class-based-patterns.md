### Effect Schema Class-based Patterns: Agent Rules & Context

Here are the distilled, reusable patterns from the documentation for defining schemas using classes.

-----

#### **Pattern 21: Defining a Schema and a Class Simultaneously**

  * **Rule:** To define a schema that is also an instantiable TypeScript class, extend `Schema.Class<MyClass>("Identifier")` and provide the field definitions.
  * **Context:** This is the core pattern of the `Class` API. It co-locates the data shape (`schema`) and behavior (`class`). The class constructor automatically validates input against the field schemas, throwing a `ParseError` on failure.
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    class Person extends Schema.Class<Person>("Person")({
      id: Schema.Number,
      name: Schema.NonEmptyString
    }) {}

    // Instantiation validates the input
    const person = new Person({ id: 1, name: "John" })
    ```

-----

#### **Pattern 22: Adding Custom Logic via Getters and Methods**

  * **Rule:** To add computed properties or business logic to your schema, define getters and methods inside the class body, just as you would with a standard class.
  * **Context:** This pattern enriches your data models, making them more than just data containers. Logic related to the data (like formatting or calculations) can live directly on the object instance.
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    class Person extends Schema.Class<Person>("Person")({
      name: Schema.NonEmptyString
    }) {
      // Custom getter
      get upperName() {
        return this.name.toUpperCase()
      }
      // Custom method
      greet() {
        return `Hello, my name is ${this.name}.`
      }
    }
    ```

-----

#### **Pattern 23: Extending an Existing Schema Class**

  * **Rule:** To create a new schema by adding fields to an existing one, use the static `.extend()` method on the parent `Schema.Class`. You can only add new fields; you cannot override existing ones.
  * **Context:** This promotes reusability by allowing you to build specialized schemas from a common base. The child class inherits all fields, getters, and methods from the parent.
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    class Person extends Schema.Class<Person>("Person")({
      id: Schema.Number,
      name: Schema.NonEmptyString
    }) {}

    // Creates a new class with id, name, AND age
    class PersonWithAge extends Person.extend<PersonWithAge>("PersonWithAge")({
      age: Schema.Number
    }) {}
    ```

-----

#### **Pattern 24: Defining Tagged Classes for Discriminated Unions**

  * **Rule:** To create a class with a built-in `_tag` property, extend `Schema.TaggedClass<MyClass>()("TagName", { ...fields })`. For creating tagged errors that capture a stack trace, use `Schema.TaggedError`.
  * **Context:** This is the class-based equivalent of creating a struct for a discriminated union. It simplifies creating variants for pattern matching, as the `_tag` is automatically managed.
  * **Code Example:**
    ```typescript
    import { Schema } from "effect"

    // Defines a class with `_tag: "TaggedPerson"`
    class TaggedPerson extends Schema.TaggedClass<TaggedPerson>()(
      "TaggedPerson",
      { name: Schema.String }
    ) {}

    // Defines an Error class with `_tag: "HttpError"`
    class HttpError extends Schema.TaggedError<HttpError>()("HttpError", {
      status: Schema.Number
    }) {}
    ```

-----

#### **Pattern 25: Applying Post-Decoding Asynchronous Transformations**

  * **Rule:** To enrich a class instance with fields derived from an `Effect` (e.g., an API call), use the static `.transformOrFail()` method on the base class.
  * **Context:** This is a powerful pattern for hydrating an entity. After an object is successfully parsed from raw input, you can run an async workflow to fetch additional data and merge it into the final class instance.
  * **Code Example:**
    ```typescript
    import { Effect, Option, Schema, ParseResult } from "effect"

    class Person extends Schema.Class<Person>("Person")({ id: Schema.Number }) {}
    function getAge(id: number) { return Effect.succeed(id + 20) }

    class PersonWithAge extends Person.transformOrFail<PersonWithAge>(
      "PersonWithAge"
    )(
      { age: Schema.Number }, // Define the new fields to be added
      {
        decode: (person) => // `person` is an instance of the base class
          Effect.map(getAge(person.id), (age) => ({ ...person, age })),
        encode: ParseResult.succeed
      }
    ) {}
    ```

-----

#### **Pattern 26: Enabling Deep Equality for Nested Data**

  * **Rule:** By default, `Schema.Class` instances use shallow equality. To enable deep, value-based equality for complex properties like arrays or nested objects, wrap their schema with `Schema.Data()`.
  * **Context:** This is crucial when you need to compare two class instances that contain non-primitive data. Without `Schema.Data()`, `Equal.equals(a, b)` will return `false` if `a` and `b` contain arrays with identical values, because the array references are different.
  * **Code Example:**
    ```typescript
    import { Schema, Data } from "effect"

    class Person extends Schema.Class<Person>("Person")({
      id: Schema.Number,
      // The `hobbies` array will now be compared by its values, not by reference.
      hobbies: Schema.Data(Schema.Array(Schema.String))
    }) {}
    ```
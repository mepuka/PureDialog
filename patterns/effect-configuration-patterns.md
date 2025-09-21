### Effect Configuration Patterns: Agent Rules & Context

Here are the distilled patterns for managing application configuration, focusing on the most crucial and idiomatic concepts.

---

#### **Pattern 93: Defining and Loading Basic Configuration**

- **Main Point**: To define a requirement for a configuration variable (which defaults to an environment variable), use the built-in constructors like [`Config.string("HOST")`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/configuration/%23basic-configuration-types%5D(https://effect.website/docs/configuration/%23basic-configuration-types)>) or `Config.number("PORT")`. This creates an effect that, when run, will read from the environment and fail with a clear error if the variable is missing.

- **Use Case / Problem Solved**: This provides a declarative and type-safe way to specify your application's configuration needs. It ensures that your application won't start in an invalid state due to missing configuration.

- **Crucial Example**:

  ```typescript
  import { Effect, Config } from "effect";

  const program = Effect.gen(function* () {
    const host = yield* Config.string("HOST");
    const port = yield* Config.number("PORT");
    console.log(`Application started: ${host}:${port}`);
  });

  // To run: HOST=localhost PORT=8080 npx tsx your-file.ts
  ```

---

#### **Pattern 94: Providing Default Values**

- **Main Point**: To make a configuration value optional, provide a fallback by piping its definition to [`Config.withDefault(defaultValue)`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/configuration/%23providing-default-values%5D(https://effect.website/docs/configuration/%23providing-default-values)>).

- **Use Case / Problem Solved**: This makes your application more robust by allowing it to run with a sensible default configuration, even if some environment variables are not explicitly set.

- **Crucial Example**:

  ```typescript
  import { Config } from "effect";

  // If the PORT environment variable is not set, this will default to 8080.
  const portConfig = Config.number("PORT").pipe(Config.withDefault(8080));
  ```

---

#### **Pattern 95: Organizing with Nested Configuration**

- **Main Point**: To group related configuration variables under a common prefix, use [`Config.nested(config, "NAMESPACE")`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/configuration/%23nested-configurations%5D(https://effect.website/docs/configuration/%23nested-configurations)>). This tells Effect to look for variables like `NAMESPACE_HOST` and `NAMESPACE_PORT` instead of the top-level names.

- **Use Case / Problem Solved**: This prevents naming collisions and keeps your configuration organized, which is especially important in large applications that might have multiple services with their own `HOST` or `PORT` settings.

- **Crucial Example**:

  ```typescript
  import { Config } from "effect";

  // Describes HOST and PORT variables
  const serverConfig = Config.all({
    host: Config.string("HOST"),
    port: Config.number("PORT"),
  });

  // This now looks for SERVER_HOST and SERVER_PORT environment variables
  const programConfig = Config.nested(serverConfig, "SERVER");
  ```

---

#### **Pattern 96: Mocking Configuration for Tests**

- **Main Point**: To test code that depends on configuration without needing to set actual environment variables, you can temporarily replace the configuration "backend" (`ConfigProvider`) with a simple map for the duration of a test.

- **Use Case / Problem Solved**: This decouples your tests from the environment, making them deterministic, reliable, and easy to run on any machine. Use [`ConfigProvider.fromMap`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/configuration/%23mocking-configurations-in-tests%5D(https://effect.website/docs/configuration/%23mocking-configurations-in-tests)>) to create a mock provider and [`Effect.withConfigProvider`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/configuration/%23mocking-configurations-in-tests%5D(https://effect.website/docs/configuration/%23mocking-configurations-in-tests)>) to run your program with it.

- **Crucial Example**:

  ```typescript
  import { ConfigProvider, Effect } from "effect";

  const program = Effect.succeed("..."); // An effect that needs configuration

  const mockProvider = ConfigProvider.fromMap(
    new Map([
      ["HOST", "localhost"],
      ["PORT", "8080"],
    ])
  );

  // This runs the program using the values from the map instead of env variables.
  const testableProgram = Effect.withConfigProvider(program, mockProvider);
  ```

---

#### **Pattern 97: Handling Sensitive Data (Advanced)**

- **Main Point**: To handle sensitive values like API keys or passwords, use [`Config.redacted("SECRET_API_KEY")`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/configuration/%23handling-sensitive-values%5D(https://effect.website/docs/configuration/%23handling-sensitive-values)>).
- **Use Case / Problem Solved**: This wraps the value in a `Redacted` object, which automatically prevents the secret from being printed in logs if the object is accidentally logged. This is a critical security pattern to avoid leaking credentials. To access the underlying value, you must explicitly use `Redacted.value()`.

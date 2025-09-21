Here's an overview of the primary ways to create effects based on the documentation.

### Why Not `throw`?

Effect avoids throwing errors directly. Instead, it uses specific constructors to create computations that explicitly track potential failures in the type system. This makes error handling robust and predictable, as a function's signature tells you exactly what kind of errors it can produce.

### Core Constructors

You can create effects from different kinds of values and computations:

  * **Pure Values**:

      * **[`Effect.succeed`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/creating-effects/%23succeed%5D\(https://effect.website/docs/getting-started/creating-effects/%23succeed\))**: Wraps a value that already exists, creating an effect that immediately succeeds.
      * **[`Effect.fail`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/creating-effects/%23fail%5D\(https://effect.website/docs/getting-started/creating-effects/%23fail\))**: Wraps an error value, creating an effect that immediately fails. This is used for expected, recoverable errors.

  * **Synchronous Computations**: These wrap a "thunk" (a function with no arguments like `() => ...`) to delay a synchronous operation.

      * **[`Effect.sync`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/creating-effects/%23sync%5D\(https://effect.website/docs/getting-started/creating-effects/%23sync\))**: For synchronous code that is **not expected to throw an error**, like `console.log()`. If it does throw, it's treated as an unrecoverable defect.
      * **[`Effect.try`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/creating-effects/%23try%5D\(https://effect.website/docs/getting-started/creating-effects/%23try\))**: For synchronous code that **might throw an error**, like `JSON.parse()`. It automatically catches the exception and places it in the effect's error channel.

  * **Asynchronous Computations**:

      * **[`Effect.promise`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/creating-effects/%23promise%5D\(https://effect.website/docs/getting-started/creating-effects/%23promise\))**: For a `Promise` that is **guaranteed to resolve**. If it rejects, it's treated as a defect.
      * **[`Effect.tryPromise`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/creating-effects/%23trypromise%5D\(https://effect.website/docs/getting-started/creating-effects/%23trypromise\))**: For a `Promise` that **might reject**. It automatically catches the rejection and places it in the effect's error channel.

  * **Callback-based Functions**:

      * **[`Effect.async`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/creating-effects/%23from-a-callback%5D\(https://effect.website/docs/getting-started/creating-effects/%23from-a-callback\))**: Wraps traditional callback-based APIs (like those in Node.js's `fs` module), allowing you to convert them into effects.

  * **Lazy or Recursive Effects**:

      * **[`Effect.suspend`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/creating-effects/%23suspended-effects%5D\(https://effect.website/docs/getting-started/creating-effects/%23suspended-effects\))**: Delays the creation of an effect until it's actually run. This is useful for controlling side effects, ensuring fresh values are used, and safely implementing recursive effects without causing a stack overflow.
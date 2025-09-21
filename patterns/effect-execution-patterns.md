Here's an overview of how to run effects, based on the documentation.

The main principle is to **run effects at the "edge" of your application**. Most of your code should build and compose effects, with a single call to a run function in your main entry point (e.g., `index.ts`).

### Asynchronous Execution (Most Common)

For most cases, asynchronous execution is the default and recommended approach.

  * **[`runPromise`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/running-effects/%23runpromise%5D\(https://effect.website/docs/getting-started/running-effects/%23runpromise\))**: This is the most common way to run an effect. It returns a `Promise` that resolves with the effect's success value or rejects with its failure. Use this to integrate Effect with other promise-based code.
  * **[`runPromiseExit`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/running-effects/%23runpromiseexit%5D\(https://effect.website/docs/getting-started/running-effects/%23runpromiseexit\))**: This also returns a `Promise`, but one that *always resolves*. The resolved value is an `Exit` object, which lets you safely inspect whether the effect succeeded or failed without needing a `try/catch` block.

### Synchronous Execution

Synchronous execution should be used sparingly, only when you are certain the effect contains no asynchronous operations.

  * **[`runSync`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/running-effects/%23runsync%5D\(https://effect.website/docs/getting-started/running-effects/%23runsync\))**: Runs a synchronous effect immediately. It will throw an error if the effect fails or contains any async work.
  * **[`runSyncExit`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/running-effects/%23runsyncexit%5D\(https://effect.website/docs/getting-started/running-effects/%23runsyncexit\))**: Runs a synchronous effect and returns an `Exit` object. This allows you to safely handle potential failures without a `try/catch` block.

### Background Execution

  * **[`runFork`](https://www.google.com/search?q=%5Bhttps://effect.website/docs/getting-started/running-effects/%23runfork%5D\(https://effect.website/docs/getting-started/running-effects/%23runfork\))**: This is the most fundamental way to run an effect. It starts the effect in the background and immediately returns a `Fiber`. You can then use the fiber to observe the effect's outcome or interrupt it. This is useful for long-running processes or when you need fine-grained control over execution.
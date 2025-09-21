### Effect Observability Patterns: Agent Rules & Context

Here are the distilled patterns for logging, focusing on the most crucial and idiomatic concepts.

---

#### **Pattern 81: Structured Logging with Levels**

- **Main Point**: To log messages within an effect, use the built-in, level-specific functions like [`Effect.logInfo`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/logging/%23loginfo%5D(https://effect.website/docs/observability/logging/%23loginfo)>) or [`Effect.logError`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/logging/%23logerror%5D(https://effect.website/docs/observability/logging/%23logerror)>). The logging system is structured by default, automatically including contextual information like the timestamp, log level, and fiber ID.

- **Use Case / Problem Solved**: This provides a structured and type-safe way to emit logs that is deeply integrated with the Effect runtime. Unlike a global `console.log`, this approach makes your logs machine-readable and easy to filter.

- **Crucial Example**:

  ```typescript
  import { Effect } from "effect";

  const program = Effect.gen(function* () {
    yield* Effect.logInfo("Application started");
    // ... do some work ...
    yield* Effect.logWarning("A minor issue occurred.");
    // ... more work ...
    yield* Effect.logInfo("Application finished");
  });
  ```

---

#### **Pattern 82: Adding Context with Annotations**

- **Main Point**: To add consistent, contextual key-value data to all logs within a specific scope, use [`Effect.annotateLogs`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/logging/%23custom-annotations%5D(https://effect.website/docs/observability/logging/%23custom-annotations)>). These annotations automatically propagate to any nested effects within that scope.

- **Use Case / Problem Solved**: This solves the problem of manually passing and logging contextual information (like a `userId` or `correlationId`) through every function. It makes logs much easier to search, filter, and correlate in a production environment.

- **Crucial Example**:

  ```typescript
  import { Effect } from "effect";

  function processRequest(requestId: string) {
    return Effect.gen(function* () {
      yield* Effect.log("Processing started");
      // ... all logic here ...
      yield* Effect.log("Processing finished");
    }).pipe(
      // All logs inside this scope will automatically have the `requestId` field.
      Effect.annotateLogs("requestId", requestId)
    );
  }
  ```

---

#### **Pattern 83: Measuring Duration with Log Spans**

- **Main Point**: To automatically measure and log the duration of an effect, wrap it with [`Effect.withLogSpan("my-span-name")`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/logging/%23log-spans%5D(https://effect.website/docs/observability/logging/%23log-spans)>). The duration is added as a key-value pair to all logs emitted from within that effect's scope.

- **Use Case / Problem Solved**: This provides a simple, declarative way to add performance timings to your application's logs without needing to manually calculate start and end times. It's invaluable for identifying performance bottlenecks.

- **Crucial Example**:

  ```typescript
  import { Effect } from "effect";

  const program = Effect.sleep("1 second").pipe(
    Effect.zipRight(Effect.log("The job is finished!")),
    // The log message will now include an annotation like "myJob=1003ms"
    Effect.withLogSpan("myJob")
  );
  ```

---

#### **Pattern 84: Configuring Log Levels (Advanced)**

- **Main Point**: You can control which log messages are visible by setting a minimum log level. This can be done for the entire application (using a `Layer`) or for a specific, targeted effect.
- **Use Case / Problem Solved**: This allows you to have verbose logging (e.g., `LogLevel.Debug`) during development while only showing higher-level messages (e.g., `LogLevel.Info` or `LogLevel.Warning`) in production to reduce noise. The ability to enable detailed logging for just one part of your application is a powerful debugging tool, as explained in the [documentation on log levels](https://effect.website/docs/observability/logging/#log-levels).

### Effect Observability Patterns: Agent Rules & Context

Here are the distilled patterns for using metrics, focusing on the most crucial and idiomatic concepts.

---

#### **Pattern 85: Tracking Cumulative Values with Counters**

- **Main Point**: To track values that accumulate over time (like total requests handled or errors occurred), use a [`Counter`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/metrics/%23counter%5D(https://effect.website/docs/observability/metrics/%23counter)>). You define the counter once and then apply it to effects to increment its value.

- **Use Case / Problem Solved**: This provides a simple, declarative way to count events without managing a manual counter variable. It's the standard for metrics like `http_requests_total`. The `.pipe(Metric.withConstantInput(1))` modifier is a common way to create a counter that simply increments by one each time it's used.

- **Crucial Example**:

  ```typescript
  import { Metric, Effect } from "effect";

  // Create a counter that will increment by 1 each time it's called.
  const taskCount = Metric.counter("task_count").pipe(
    Metric.withConstantInput(1)
  );

  const someTask = Effect.sleep("100 millis");

  // This program runs the task AND increments the counter.
  const program = taskCount(someTask);
  ```

---

#### **Pattern 86: Monitoring Point-in-Time Values with Gauges**

- **Main Point**: To monitor a single numerical value that can go up and down (like current memory usage or the number of items in a queue), use a [`Gauge`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/metrics/%23gauge%5D(https://effect.website/docs/observability/metrics/%23gauge)>). It always reflects the most recent value that was set.

- **Use Case / Problem Solved**: This is ideal for tracking the current state of any system resource, giving you a real-time snapshot of its value.

- **Crucial Example**:

  ```typescript
  import { Metric, Effect, Random } from "effect";

  const temperature = Metric.gauge("temperature");
  const getTemperature = Random.nextIntBetween(-10, 10);

  // Each time this program runs, the gauge's value is updated to the new random temperature.
  const program = temperature(getTemperature);
  ```

---

#### **Pattern 87: Measuring Performance with Timers & Histograms**

- **Main Point**: To measure the duration of operations and understand their distribution (e.g., how many requests were fast vs. slow), use a [`Histogram`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/metrics/%23histogram%5D(https://effect.website/docs/observability/metrics/%23histogram)>). The most common way to achieve this is with the `Metric.timerWithBoundaries` and `Metric.trackDuration` helpers.

- **Use Case / Problem Solved**: This provides powerful insights into your application's performance, helping you identify bottlenecks and calculate service level objectives (SLOs), such as "99% of requests must complete in under 200ms".

- **Crucial Example**:

  ```typescript
  import { Metric, Effect, Array } from "effect";

  // Create a timer with buckets for 10ms, 20ms, 30ms, etc.
  const timer = Metric.timerWithBoundaries(
    "task_duration",
    Array.range(10, 100)
  );
  const task = Effect.sleep("50 millis");

  // This will run the task and automatically record its duration in the histogram.
  const program = Metric.trackDuration(task, timer);
  ```

---

#### **Pattern 88: Adding Dimensions with Tags**

- **Main Point**: To categorize and filter your metrics, you can add key-value pairs called **tags**. You can tag an individual metric or apply a tag to all metrics within a specific scope.

- **Use Case / Problem Solved**: Tagging is what makes metrics truly powerful. It allows you to "slice and dice" your data in a monitoring dashboard. For example, you can use tags to see the error rate for a _specific_ HTTP route in your _production_ environment, as explained in the [documentation on tagging](https://effect.website/docs/observability/metrics/#tagging-metrics).

- **Crucial Example**:

  ```typescript
  import { Metric, Effect } from "effect";

  // Tagging a single metric with a "route" dimension
  const counter = Metric.counter("http_requests_total").pipe(
    Metric.tagged("route", "/users")
  );

  // Tagging all metrics within a scope with an "environment" dimension
  const programWithTags = Effect.log("...").pipe(
    Effect.tagMetrics("environment", "production")
  );
  ```

### Effect Observability Patterns: Agent Rules & Context

Here are the distilled patterns for using distributed tracing, focusing on the most crucial and idiomatic concepts.

---

#### **Pattern 89: Creating Spans to Trace Operations**

- **Main Point**: To trace a specific unit of work (like a database query or an API handler), wrap the corresponding effect with [`Effect.withSpan("span-name")`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/tracing/%23creating-spans%5D(https://effect.website/docs/observability/tracing/%23creating-spans)>). This automatically creates a **span** that records the operation's name, duration, and its success or failure status.

- **Use Case / Problem Solved**: This is the fundamental building block for distributed tracing. It allows you to visualize the flow and performance of requests as they move through your application and across different services, forming a "trace" of the entire operation.

- **Crucial Example**:

  ```typescript
  import { Effect } from "effect";

  const databaseQuery = Effect.sleep("50 millis");

  // This creates a span named "databaseQuery" that will capture
  // the duration and outcome of the sleep effect.
  const tracedQuery = databaseQuery.pipe(Effect.withSpan("databaseQuery"));
  ```

---

#### **Pattern 90: Adding Context with Span Attributes**

- **Main Point**: To add rich, searchable metadata (key-value pairs) to the current active span, use [`Effect.annotateCurrentSpan("key", "value")`](<https://www.google.com/search?q=%5Bhttps://effect.website/docs/observability/tracing/%23adding-annotations%5D(https://effect.website/docs/observability/tracing/%23adding-annotations)>).

- **Use Case / Problem Solved**: This enriches your trace data, making it possible to search, filter, and analyze traces based on application-specific context. For example, you can add a `userId` or `http.method` to quickly find all traces for a specific user or API endpoint.

- **Crucial Example**:

  ```typescript
  import { Effect } from "effect";

  const program = Effect.succeed("some work").pipe(
    Effect.tap(() => Effect.annotateCurrentSpan("http.method", "GET")),
    Effect.tap(() => Effect.annotateCurrentSpan("userId", "123")),
    Effect.withSpan("http.request")
  );
  ```

---

#### **Pattern 91: Building Trace Hierarchies with Nesting**

- **Main Point**: Effect automatically creates parent-child relationships between spans. If you execute one traced effect from within another, the inner span becomes a child of the outer one.

- **Use Case / Problem Solved**: This automatic nesting is what builds the "waterfall" diagram you see in tracing systems. It allows you to visualize the entire call stack of a request and see exactly how much time was spent in each sub-operation, making it easy to pinpoint bottlenecks.

- **Crucial Example**:

  ```typescript
  import { Effect } from "effect";

  const child = Effect.sleep("100 millis").pipe(Effect.withSpan("child"));

  const parent = Effect.gen(function* () {
    yield* Effect.sleep("20 millis");
    // The "child" span runs inside the "parent" and will be nested under it.
    yield* child;
    yield* Effect.sleep("10 millis");
  }).pipe(Effect.withSpan("parent"));
  ```

---

#### **Pattern 92: Integrating a Tracing Backend (Advanced)**

- **Main Point**: To actually export, collect, and visualize your traces, you must provide a tracing implementation `Layer`, typically from the `@effect/opentelemetry` package.
- **Use Case / Problem Solved**: This is the final and most critical step to make tracing useful. You configure a layer (e.g., `NodeSdk.layer`) to send your trace data to a compatible backend like [Jaeger](https://www.jaegertracing.io/), [Grafana Tempo](https://grafana.com/oss/tempo/), or [Sentry](https://effect.website/docs/observability/tracing/#sentry). This allows you to search, visualize, and analyze your application's performance in a dedicated UI.

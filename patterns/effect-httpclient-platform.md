# HTTP Client

## Overview

The `@effect/platform/HttpClient*` modules provide a way to send HTTP requests,
handle responses, and abstract over the differences between platforms.

The `HttpClient` interface has a set of methods for sending requests:

- `.execute` - takes a [HttpClientRequest](#httpclientrequest) and returns a `HttpClientResponse`
- `.{get, del, head, options, patch, post, put}` - convenience methods for creating a request and
  executing it in one step

To access the `HttpClient`, you can use the `HttpClient.HttpClient` [tag](https://effect.website/docs/guides/context-management/services).
This will give you access to a `HttpClient` instance.

**Example: Retrieving JSON Data (GET)**

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  // Access HttpClient
  const client = yield* HttpClient.HttpClient;

  // Create and execute a GET request
  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  const json = yield* response.json;

  console.log(json);
}).pipe(
  // Provide the HttpClient
  Effect.provide(FetchHttpClient.layer)
);

Effect.runPromise(program);
/*
Output:
{
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
*/
```

**Example: Retrieving JSON Data with accessor apis (GET)**

The `HttpClient` module also provides a set of accessor apis that allow you to
easily send requests without first accessing the `HttpClient` service.

Below is an example of using the `get` accessor api to send a GET request:

(The following examples will continue to use the `HttpClient` service approach).

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { Effect } from "effect";

const program = HttpClient.get(
  "https://jsonplaceholder.typicode.com/posts/1"
).pipe(
  Effect.andThen((response) => response.json),
  Effect.provide(FetchHttpClient.layer)
);

Effect.runPromise(program);
/*
Output:
{
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
*/
```

**Example: Creating and Executing a Custom Request**

Using [HttpClientRequest](#httpclientrequest), you can create and then execute a request. This is useful for customizing the request further.

```ts
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  // Access HttpClient
  const client = yield* HttpClient.HttpClient;

  // Create a GET request
  const req = HttpClientRequest.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  // Optionally customize the request

  // Execute the request and get the response
  const response = yield* client.execute(req);

  const json = yield* response.json;

  console.log(json);
}).pipe(
  // Provide the HttpClient
  Effect.provide(FetchHttpClient.layer)
);

Effect.runPromise(program);
/*
Output:
{
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
*/
```

## Customize a HttpClient

The `HttpClient` module allows you to customize the client in various ways. For instance, you can log details of a request before execution using the `tapRequest` function.

**Example: Tapping**

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { Console, Effect } from "effect";

const program = Effect.gen(function* () {
  const client = (yield* HttpClient.HttpClient).pipe(
    // Log the request before fetching
    HttpClient.tapRequest(Console.log)
  );

  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  const json = yield* response.json;

  console.log(json);
}).pipe(Effect.provide(FetchHttpClient.layer));

Effect.runPromise(program);
/*
Output:
{
  _id: '@effect/platform/HttpClientRequest',
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  urlParams: [],
  hash: { _id: 'Option', _tag: 'None' },
  headers: Object <[Object: null prototype]> {},
  body: { _id: '@effect/platform/HttpBody', _tag: 'Empty' }
}
{
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
*/
```

**Operations Summary**

| Operation                | Description                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `get`,`post`,`put`...    | Send a request without first accessing the `HttpClient` service.                        |
| `filterOrElse`           | Filters the result of a response, or runs an alternative effect if the predicate fails. |
| `filterOrFail`           | Filters the result of a response, or throws an error if the predicate fails.            |
| `filterStatus`           | Filters responses by HTTP status code.                                                  |
| `filterStatusOk`         | Filters responses that return a 2xx status code.                                        |
| `followRedirects`        | Follows HTTP redirects up to a specified number of times.                               |
| `mapRequest`             | Appends a transformation of the request object before sending it.                       |
| `mapRequestEffect`       | Appends an effectful transformation of the request object before sending it.            |
| `mapRequestInput`        | Prepends a transformation of the request object before sending it.                      |
| `mapRequestInputEffect`  | Prepends an effectful transformation of the request object before sending it.           |
| `retry`                  | Retries the request based on a provided schedule or policy.                             |
| `tap`                    | Performs an additional effect after a successful request.                               |
| `tapRequest`             | Performs an additional effect on the request before sending it.                         |
| `withCookiesRef`         | Associates a `Ref` of cookies with the client for handling cookies across requests.     |
| `withTracerDisabledWhen` | Disables tracing for specific requests based on a provided predicate.                   |
| `withTracerPropagation`  | Enables or disables tracing propagation for the request.                                |

### Mapping Requests

Note that `mapRequest` and `mapRequestEffect` add transformations at the end of the request chain, while `mapRequestInput` and `mapRequestInputEffect` apply transformations at the start:

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  const client = (yield* HttpClient.HttpClient).pipe(
    // Append transformation
    HttpClient.mapRequest((req) => {
      console.log(1);
      return req;
    }),
    // Another append transformation
    HttpClient.mapRequest((req) => {
      console.log(2);
      return req;
    }),
    // Prepend transformation, this executes first
    HttpClient.mapRequestInput((req) => {
      console.log(3);
      return req;
    })
  );

  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  const json = yield* response.json;

  console.log(json);
}).pipe(Effect.provide(FetchHttpClient.layer));

Effect.runPromise(program);
/*
Output:
3
1
2
{
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
*/
```

### Persisting Cookies

You can manage cookies across requests using the `HttpClient.withCookiesRef` function, which associates a reference to a `Cookies` object with the client.

```ts
import { Cookies, FetchHttpClient, HttpClient } from "@effect/platform";
import { Effect, Ref } from "effect";

const program = Effect.gen(function* () {
  // Create a reference to store cookies
  const ref = yield* Ref.make(Cookies.empty);

  // Access the HttpClient and associate the cookies reference with it
  const client = (yield* HttpClient.HttpClient).pipe(
    HttpClient.withCookiesRef(ref)
  );

  // Make a GET request to the specified URL
  yield* client.get("https://www.google.com/");

  // Log the keys of the cookies stored in the reference
  console.log(Object.keys((yield* ref).cookies));
}).pipe(Effect.provide(FetchHttpClient.layer));

Effect.runPromise(program);
// Output: [ 'SOCS', 'AEC', '__Secure-ENID' ]
```

## RequestInit Options

You can customize the `FetchHttpClient` by passing `RequestInit` options to configure aspects of the HTTP requests, such as credentials, headers, and more.

In this example, we customize the `FetchHttpClient` to include credentials with every request:

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { Effect, Layer } from "effect";

const CustomFetchLive = FetchHttpClient.layer.pipe(
  Layer.provide(
    Layer.succeed(FetchHttpClient.RequestInit, {
      credentials: "include",
    })
  )
);

const program = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  const json = yield* response.json;
  console.log(json);
}).pipe(Effect.provide(CustomFetchLive));
```

## Create a Custom HttpClient

You can create a custom `HttpClient` using the `HttpClient.make` function. This allows you to simulate or mock server responses within your application.

```ts
import { HttpClient, HttpClientResponse } from "@effect/platform";
import { Effect, Layer } from "effect";

const myClient = HttpClient.make((req) =>
  Effect.succeed(
    HttpClientResponse.fromWeb(
      req,
      // Simulate a response from a server
      new Response(
        JSON.stringify({
          userId: 1,
          id: 1,
          title: "title...",
          body: "body...",
        })
      )
    )
  )
);

const program = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  const json = yield* response.json;
  console.log(json);
}).pipe(
  // Provide the HttpClient
  Effect.provide(Layer.succeed(HttpClient.HttpClient, myClient))
);

Effect.runPromise(program);
/*
Output:
{ userId: 1, id: 1, title: 'title...', body: 'body...' }
*/
```

## HttpClientRequest

### Overview

You can create a `HttpClientRequest` using the following provided constructors:

| Constructor                 | Description               |
| --------------------------- | ------------------------- |
| `HttpClientRequest.del`     | Create a DELETE request   |
| `HttpClientRequest.get`     | Create a GET request      |
| `HttpClientRequest.head`    | Create a HEAD request     |
| `HttpClientRequest.options` | Create an OPTIONS request |
| `HttpClientRequest.patch`   | Create a PATCH request    |
| `HttpClientRequest.post`    | Create a POST request     |
| `HttpClientRequest.put`     | Create a PUT request      |

### Setting Headers

When making HTTP requests, sometimes you need to include additional information in the request headers. You can set headers using the `setHeader` function for a single header or `setHeaders` for multiple headers simultaneously.

```ts
import { HttpClientRequest } from "@effect/platform";

const req = HttpClientRequest.get("https://api.example.com/data").pipe(
  // Setting a single header
  HttpClientRequest.setHeader("Authorization", "Bearer your_token_here"),
  // Setting multiple headers
  HttpClientRequest.setHeaders({
    "Content-Type": "application/json; charset=UTF-8",
    "Custom-Header": "CustomValue",
  })
);

console.log(JSON.stringify(req.headers, null, 2));
/*
Output:
{
  "authorization": "Bearer your_token_here",
  "content-type": "application/json; charset=UTF-8",
  "custom-header": "CustomValue"
}
*/
```

### basicAuth

To include basic authentication in your HTTP request, you can use the `basicAuth` method provided by `HttpClientRequest`.

```ts
import { HttpClientRequest } from "@effect/platform";

const req = HttpClientRequest.get("https://api.example.com/data").pipe(
  HttpClientRequest.basicAuth("your_username", "your_password")
);

console.log(JSON.stringify(req.headers, null, 2));
/*
Output:
{
  "authorization": "Basic eW91cl91c2VybmFtZTp5b3VyX3Bhc3N3b3Jk"
}
*/
```

### bearerToken

To include a Bearer token in your HTTP request, use the `bearerToken` method provided by `HttpClientRequest`.

```ts
import { HttpClientRequest } from "@effect/platform";

const req = HttpClientRequest.get("https://api.example.com/data").pipe(
  HttpClientRequest.bearerToken("your_token")
);

console.log(JSON.stringify(req.headers, null, 2));
/*
Output:
{
  "authorization": "Bearer your_token"
}
*/
```

### accept

To specify the media types that are acceptable for the response, use the `accept` method provided by `HttpClientRequest`.

```ts
import { HttpClientRequest } from "@effect/platform";

const req = HttpClientRequest.get("https://api.example.com/data").pipe(
  HttpClientRequest.accept("application/xml")
);

console.log(JSON.stringify(req.headers, null, 2));
/*
Output:
{
  "accept": "application/xml"
}
*/
```

### acceptJson

To indicate that the client accepts JSON responses, use the `acceptJson` method provided by `HttpClientRequest`.

```ts
import { HttpClientRequest } from "@effect/platform";

const req = HttpClientRequest.get("https://api.example.com/data").pipe(
  HttpClientRequest.acceptJson
);

console.log(JSON.stringify(req.headers, null, 2));
/*
Output:
{
  "accept": "application/json"
}
*/
```

## GET

### Converting the Response

The `HttpClientResponse` provides several methods to convert a response into different formats.

**Example: Converting to JSON**

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";

const getPostAsJson = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  return yield* response.json;
}).pipe(Effect.provide(FetchHttpClient.layer));

getPostAsJson.pipe(
  Effect.andThen((post) => Console.log(typeof post, post)),
  NodeRuntime.runMain
);
/*
Output:
object {
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
*/
```

**Example: Converting to Text**

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";

const getPostAsText = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  return yield* response.text;
}).pipe(Effect.provide(FetchHttpClient.layer));

getPostAsText.pipe(
  Effect.andThen((post) => Console.log(typeof post, post)),
  NodeRuntime.runMain
);
/*
Output:
string {
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
*/
```

**Methods Summary**

| Method          | Description                           |
| --------------- | ------------------------------------- |
| `arrayBuffer`   | Convert to `ArrayBuffer`              |
| `formData`      | Convert to `FormData`                 |
| `json`          | Convert to JSON                       |
| `stream`        | Convert to a `Stream` of `Uint8Array` |
| `text`          | Convert to text                       |
| `urlParamsBody` | Convert to `UrlParams`                |

### Decoding Data with Schemas

A common use case when fetching data is to validate the received format. For this purpose, the `HttpClientResponse` module is integrated with `effect/Schema`.

```ts
import {
  FetchHttpClient,
  HttpClient,
  HttpClientResponse,
} from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Schema } from "effect";

const Post = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
});

const getPostAndValidate = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  return yield* HttpClientResponse.schemaBodyJson(Post)(response);
}).pipe(Effect.provide(FetchHttpClient.layer));

getPostAndValidate.pipe(Effect.andThen(Console.log), NodeRuntime.runMain);
/*
Output:
{
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
}
*/
```

In this example, we define a schema for a post object with properties `id` and `title`. Then, we fetch the data and validate it against this schema using `HttpClientResponse.schemaBodyJson`. Finally, we log the validated post object.

### Filtering And Error Handling

It's important to note that `HttpClient.get` doesn't consider non-`200` status codes as errors by default. This design choice allows for flexibility in handling different response scenarios. For instance, you might have a schema union where the status code serves as the discriminator, enabling you to define a schema that encompasses all possible response cases.

You can use `HttpClient.filterStatusOk` to ensure only `2xx` responses are treated as successes.

In this example, we attempt to fetch a non-existent page and don't receive any error:

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";

const getText = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/non-existing-page"
  );
  return yield* response.text;
}).pipe(Effect.provide(FetchHttpClient.layer));

getText.pipe(Effect.andThen(Console.log), NodeRuntime.runMain);
/*
Output:
{}
*/
```

However, if we use `HttpClient.filterStatusOk`, an error is logged:

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";

const getText = Effect.gen(function* () {
  const client = (yield* HttpClient.HttpClient).pipe(HttpClient.filterStatusOk);
  const response = yield* client.get(
    "https://jsonplaceholder.typicode.com/non-existing-page"
  );
  return yield* response.text;
}).pipe(Effect.provide(FetchHttpClient.layer));

getText.pipe(Effect.andThen(Console.log), NodeRuntime.runMain);
/*
Output:
[17:37:59.923] ERROR (#0):
  ResponseError: StatusCode: non 2xx status code (404 GET https://jsonplaceholder.typicode.com/non-existing-page)
      ... stack trace ...
*/
```

## POST

To make a POST request, you can use the `HttpClientRequest.post` function provided by the `HttpClientRequest` module. Here's an example of how to create and send a POST request:

```ts
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";

const addPost = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  return yield* HttpClientRequest.post(
    "https://jsonplaceholder.typicode.com/posts"
  ).pipe(
    HttpClientRequest.bodyJson({
      title: "foo",
      body: "bar",
      userId: 1,
    }),
    Effect.flatMap(client.execute),
    Effect.flatMap((res) => res.json)
  );
}).pipe(Effect.provide(FetchHttpClient.layer));

addPost.pipe(Effect.andThen(Console.log), NodeRuntime.runMain);
/*
Output:
{ title: 'foo', body: 'bar', userId: 1, id: 101 }
*/
```

If you need to send data in a format other than JSON, such as plain text, you can use different APIs provided by `HttpClientRequest`.

In the following example, we send the data as text:

```ts
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";

const addPost = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  return yield* HttpClientRequest.post(
    "https://jsonplaceholder.typicode.com/posts"
  ).pipe(
    HttpClientRequest.bodyText(
      JSON.stringify({
        title: "foo",
        body: "bar",
        userId: 1,
      }),
      "application/json; charset=UTF-8"
    ),
    client.execute,
    Effect.flatMap((res) => res.json)
  );
}).pipe(Effect.provide(FetchHttpClient.layer));

addPost.pipe(Effect.andThen(Console.log), NodeRuntime.runMain);
/*
Output:
{ title: 'foo', body: 'bar', userId: 1, id: 101 }
*/
```

### Decoding Data with Schemas

A common use case when fetching data is to validate the received format. For this purpose, the `HttpClientResponse` module is integrated with `effect/Schema`.

```ts
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Schema } from "effect";

const Post = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
});

const addPost = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;
  return yield* HttpClientRequest.post(
    "https://jsonplaceholder.typicode.com/posts"
  ).pipe(
    HttpClientRequest.bodyText(
      JSON.stringify({
        title: "foo",
        body: "bar",
        userId: 1,
      }),
      "application/json; charset=UTF-8"
    ),
    client.execute,
    Effect.flatMap(HttpClientResponse.schemaBodyJson(Post))
  );
}).pipe(Effect.provide(FetchHttpClient.layer));

addPost.pipe(Effect.andThen(Console.log), NodeRuntime.runMain);
/*
Output:
{ id: 101, title: 'foo' }
*/
```

## Testing

### Injecting Fetch

To test HTTP requests, you can inject a mock fetch implementation.

```ts
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { Effect, Layer } from "effect";
import * as assert from "node:assert";

// Mock fetch implementation
const FetchTest = Layer.succeed(FetchHttpClient.Fetch, () =>
  Promise.resolve(new Response("not found", { status: 404 }))
);

const TestLayer = FetchHttpClient.layer.pipe(Layer.provide(FetchTest));

const program = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient;

  return yield* client
    .get("https://www.google.com/")
    .pipe(Effect.flatMap((res) => res.text));
});

// Test
Effect.gen(function* () {
  const response = yield* program;
  assert.equal(response, "not found");
}).pipe(Effect.provide(TestLayer), Effect.runPromise);
```

# HTTP Server

## Overview

This section provides a simplified explanation of key concepts within the `@effect/platform` TypeScript library, focusing on components used to build HTTP servers. Understanding these terms and their relationships helps in structuring and managing server applications effectively.

### Core Concepts

- **HttpApp**: This is an `Effect` which results in a value `A`. It can utilize `ServerRequest` to produce the outcome `A`. Essentially, an `HttpApp` represents an application component that handles HTTP requests and generates responses based on those requests.

- **Default** (HttpApp): A special type of `HttpApp` that specifically produces a `ServerResponse` as its output `A`. This is the most common form of application where each interaction is expected to result in an HTTP response.

- **Server**: A construct that takes a `Default` app and converts it into an `Effect`. This serves as the execution layer where the `Default` app is operated, handling incoming requests and serving responses.

- **Router**: A type of `Default` app where the possible error outcome is `RouteNotFound`. Routers are used to direct incoming requests to appropriate handlers based on the request path and method.

- **Handler**: Another form of `Default` app, which has access to both `RouteContext` and `ServerRequest.ParsedSearchParams`. Handlers are specific functions designed to process requests and generate responses.

- **Middleware**: Functions that transform a `Default` app into another `Default` app. Middleware can be used to modify requests, responses, or handle tasks like logging, authentication, and more. Middleware can be applied in two ways:
  - On a `Router` using `router.use: Handler -> Default` which applies the middleware to specific routes.
  - On a `Server` using `server.serve: () -> Layer | Middleware -> Layer` which applies the middleware globally to all routes handled by the server.

### Applying Concepts

These components are designed to work together in a modular and flexible way, allowing developers to build complex server applications with reusable components. Here's how you might typically use these components in a project:

1. **Create Handlers**: Define functions that process specific types of requests (e.g., GET, POST) and return responses.

2. **Set Up Routers**: Organize handlers into routers, where each router manages a subset of application routes.

3. **Apply Middleware**: Enhance routers or entire servers with middleware to add extra functionality like error handling or request logging.

4. **Initialize the Server**: Wrap the main router with server functionality, applying any server-wide middleware, and start listening for requests.

## Getting Started

### Hello world example

In this example, we will create a simple HTTP server that listens on port `3000`. The server will respond with "Hello World!" when a request is made to the root URL (/) and return a `500` error for all other paths.

Node.js Example

```ts
import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";

// Define the router with a single route for the root URL
const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("Hello World"))
);

// Set up the application server with logging
const app = router.pipe(HttpServer.serve(), HttpServer.withLogAddress);

// Specify the port
const port = 3000;

// Create a server layer with the specified port
const ServerLive = NodeHttpServer.layer(() => createServer(), { port });

// Run the application
NodeRuntime.runMain(Layer.launch(Layer.provide(app, ServerLive)));

/*
Output:
timestamp=... level=INFO fiber=#0 message="Listening on http://localhost:3000"
*/
```

> [!NOTE]
> The `HttpServer.withLogAddress` middleware logs the address and port where the server is listening, helping to confirm that the server is running correctly and accessible on the expected endpoint.

Bun Example

```ts
import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Layer } from "effect";

// Define the router with a single route for the root URL
const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("Hello World"))
);

// Set up the application server with logging
const app = router.pipe(HttpServer.serve(), HttpServer.withLogAddress);

// Specify the port
const port = 3000;

// Create a server layer with the specified port
const ServerLive = BunHttpServer.layer({ port });

// Run the application
BunRuntime.runMain(Layer.launch(Layer.provide(app, ServerLive)));

/*
Output:
timestamp=... level=INFO fiber=#0 message="Listening on http://localhost:3000"
*/
```

To avoid boilerplate code for the final server setup, we'll use a helper function from the `listen.ts` file:

Node.js Example

```ts
import type { HttpPlatform, HttpServer } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";

export const listen = (
  app: Layer.Layer<
    never,
    never,
    HttpPlatform.HttpPlatform | HttpServer.HttpServer
  >,
  port: number
) =>
  NodeRuntime.runMain(
    Layer.launch(
      Layer.provide(
        app,
        NodeHttpServer.layer(() => createServer(), { port })
      )
    )
  );
```

Bun Example

```ts
import type { HttpPlatform, HttpServer } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Layer } from "effect";

export const listen = (
  app: Layer.Layer<
    never,
    never,
    HttpPlatform.HttpPlatform | HttpServer.HttpServer
  >,
  port: number
) =>
  BunRuntime.runMain(
    Layer.launch(Layer.provide(app, BunHttpServer.layer({ port })))
  );
```

### Basic routing

Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

Route definition takes the following structure:

```
router.pipe(HttpRouter.METHOD(PATH, HANDLER))
```

Where:

- **router** is an instance of `Router` (`import type { Router } from "@effect/platform/Http/Router"`).
- **METHOD** is an HTTP request method, in lowercase (e.g., get, post, put, del).
- **PATH** is the path on the server (e.g., "/", "/user").
- **HANDLER** is the action that gets executed when the route is matched.

The following examples illustrate defining simple routes.

Respond with `"Hello World!"` on the homepage:

```ts
router.pipe(HttpRouter.get("/", HttpServerResponse.text("Hello World")));
```

Respond to POST request on the root route (/), the application's home page:

```ts
router.pipe(
  HttpRouter.post("/", HttpServerResponse.text("Got a POST request"))
);
```

Respond to a PUT request to the `/user` route:

```ts
router.pipe(
  HttpRouter.put("/user", HttpServerResponse.text("Got a PUT request at /user"))
);
```

Respond to a DELETE request to the `/user` route:

```ts
router.pipe(
  HttpRouter.del(
    "/user",
    HttpServerResponse.text("Got a DELETE request at /user")
  )
);
```

### Serving static files

To serve static files such as images, CSS files, and JavaScript files, use the `HttpServerResponse.file` built-in action.

```ts
import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { listen } from "./listen.js";

const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.file("index.html"))
);

const app = router.pipe(HttpServer.serve());

listen(app, 3000);
```

Create an `index.html` file in your project directory:

```html filename="index.html"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>index.html</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    index.html
  </body>
</html>
```

## Routing

Routing refers to how an application's endpoints (URIs) respond to client requests.

You define routing using methods of the `HttpRouter` object that correspond to HTTP methods; for example, `HttpRouter.get()` to handle GET requests and `HttpRouter.post` to handle POST requests. You can also use `HttpRouter.all()` to handle all HTTP methods.

These routing methods specify a `Route.Handler` called when the application receives a request to the specified route (endpoint) and HTTP method. In other words, the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified handler.

The following code is an example of a very basic route.

```ts
// respond with "hello world" when a GET request is made to the homepage
HttpRouter.get("/", HttpServerResponse.text("Hello World"));
```

### Route methods

A route method is derived from one of the HTTP methods, and is attached to an instance of the `HttpRouter` object.

The following code is an example of routes that are defined for the GET and the POST methods to the root of the app.

```ts
// GET method route
HttpRouter.get("/", HttpServerResponse.text("GET request to the homepage"));

// POST method route
HttpRouter.post("/", HttpServerResponse.text("POST request to the homepage"));
```

`HttpRouter` supports methods that correspond to all HTTP request methods: `get`, `post`, and so on.

There is a special routing method, `HttpRouter.all()`, used to load middleware functions at a path for **all** HTTP request methods. For example, the following handler is executed for requests to the route “/secret” whether using GET, POST, PUT, DELETE.

```ts
HttpRouter.all(
  "/secret",
  HttpServerResponse.empty().pipe(
    Effect.tap(Console.log("Accessing the secret section ..."))
  )
);
```

### Route paths

Route paths, when combined with a request method, define the endpoints where requests can be made. Route paths can be specified as strings according to the following type:

```ts
type PathInput = `/${string}` | "*";
```

> [!NOTE]
> Query strings are not part of the route path.

Here are some examples of route paths based on strings.

This route path will match requests to the root route, /.

```ts
HttpRouter.get("/", HttpServerResponse.text("root"));
```

This route path will match requests to `/user`.

```ts
HttpRouter.get("/user", HttpServerResponse.text("user"));
```

This route path matches requests to any path starting with `/user` (e.g., `/user`, `/users`, etc.)

```ts
HttpRouter.get(
  "/user*",
  Effect.map(HttpServerRequest.HttpServerRequest, (req) =>
    HttpServerResponse.text(req.url)
  )
);
```

### Route parameters

Route parameters are named URL segments that are used to capture the values specified at their position in the URL. By using a schema the captured values are populated in an object, with the name of the route parameter specified in the path as their respective keys.

Route parameters are named segments in a URL that capture the values specified at those positions. These captured values are stored in an object, with the parameter names used as keys.

For example:

```
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
params: { "userId": "34", "bookId": "8989" }
```

To define routes with parameters, include the parameter names in the path and use a schema to validate and parse these parameters, as shown below.

```ts
import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { Effect, Schema } from "effect";
import { listen } from "./listen.js";

// Define the schema for route parameters
const Params = Schema.Struct({
  userId: Schema.String,
  bookId: Schema.String,
});

// Create a router with a route that captures parameters
const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/users/:userId/books/:bookId",
    HttpRouter.schemaPathParams(Params).pipe(
      Effect.flatMap((params) => HttpServerResponse.json(params))
    )
  )
);

const app = router.pipe(HttpServer.serve());

listen(app, 3000);
```

### Response methods

The methods on `HttpServerResponse` object in the following table can send a response to the client, and terminate the request-response cycle. If none of these methods are called from a route handler, the client request will be left hanging.

| Method       | Description                    |
| ------------ | ------------------------------ |
| **empty**    | Sends an empty response.       |
| **formData** | Sends form data.               |
| **html**     | Sends an HTML response.        |
| **raw**      | Sends a raw response.          |
| **setBody**  | Sets the body of the response. |
| **stream**   | Sends a streaming response.    |
| **text**     | Sends a plain text response.   |

### Router

Use the `HttpRouter` object to create modular, mountable route handlers. A `Router` instance is a complete middleware and routing system, often referred to as a "mini-app."

The following example shows how to create a router as a module, define some routes, and mount the router module on a path in the main app.

Create a file named `birds.ts` in your app directory with the following content:

```ts
import { HttpRouter, HttpServerResponse } from "@effect/platform";

export const birds = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("Birds home page")),
  HttpRouter.get("/about", HttpServerResponse.text("About birds"))
);
```

In your main application file, load the router module and mount it.

```ts
import { HttpRouter, HttpServer } from "@effect/platform";
import { birds } from "./birds.js";
import { listen } from "./listen.js";

// Create the main router and mount the birds router
const router = HttpRouter.empty.pipe(HttpRouter.mount("/birds", birds));

const app = router.pipe(HttpServer.serve());

listen(app, 3000);
```

When you run this code, your application will be able to handle requests to `/birds` and `/birds/about`, serving the respective responses defined in the `birds` router module.

## Writing Middleware

In this section, we'll build a simple "Hello World" application and demonstrate how to add three middleware functions: `myLogger` for logging, `requestTime` for displaying request timestamps, and `validateCookies` for validating incoming cookies.

### Example Application

Here is an example of a basic "Hello World" application with middleware.

### Middleware `myLogger`

This middleware logs "LOGGED" whenever a request passes through it.

```ts
const myLogger = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    console.log("LOGGED");
    return yield* app;
  })
);
```

To use the middleware, add it to the router using `HttpRouter.use()`:

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform";
import { Effect } from "effect";
import { listen } from "./listen.js";

const myLogger = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    console.log("LOGGED");
    return yield* app;
  })
);

const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("Hello World"))
);

const app = router.pipe(HttpRouter.use(myLogger), HttpServer.serve());

listen(app, 3000);
```

With this setup, every request to the app will log "LOGGED" to the terminal. Middleware execute in the order they are loaded.

### Middleware `requestTime`

Next, we'll create a middleware that records the timestamp of each HTTP request and provides it via a service called `RequestTime`.

```ts
class RequestTime extends Context.Tag("RequestTime")<RequestTime, number>() {}

const requestTime = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    return yield* app.pipe(Effect.provideService(RequestTime, Date.now()));
  })
);
```

Update the app to use this middleware and display the timestamp in the response:

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform";
import { Context, Effect } from "effect";
import { listen } from "./listen.js";

class RequestTime extends Context.Tag("RequestTime")<RequestTime, number>() {}

const requestTime = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    return yield* app.pipe(Effect.provideService(RequestTime, Date.now()));
  })
);

const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/",
    Effect.gen(function* () {
      const requestTime = yield* RequestTime;
      const responseText = `Hello World<br/><small>Requested at: ${requestTime}</small>`;
      return yield* HttpServerResponse.html(responseText);
    })
  )
);

const app = router.pipe(HttpRouter.use(requestTime), HttpServer.serve());

listen(app, 3000);
```

Now, when you make a request to the root path, the response will include the timestamp of the request.

### Middleware `validateCookies`

Finally, we'll create a middleware that validates incoming cookies. If the cookies are invalid, it sends a 400 response.

Here's an example that validates cookies using an external service:

```ts
class CookieError {
  readonly _tag = "CookieError";
}

const externallyValidateCookie = (testCookie: string | undefined) =>
  testCookie && testCookie.length > 0
    ? Effect.succeed(testCookie)
    : Effect.fail(new CookieError());

const cookieValidator = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const req = yield* HttpServerRequest.HttpServerRequest;
    yield* externallyValidateCookie(req.cookies.testCookie);
    return yield* app;
  }).pipe(
    Effect.catchTag("CookieError", () =>
      HttpServerResponse.text("Invalid cookie")
    )
  )
);
```

Update the app to use the `cookieValidator` middleware:

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect } from "effect";
import { listen } from "./listen.js";

class CookieError {
  readonly _tag = "CookieError";
}

const externallyValidateCookie = (testCookie: string | undefined) =>
  testCookie && testCookie.length > 0
    ? Effect.succeed(testCookie)
    : Effect.fail(new CookieError());

const cookieValidator = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const req = yield* HttpServerRequest.HttpServerRequest;
    yield* externallyValidateCookie(req.cookies.testCookie);
    return yield* app;
  }).pipe(
    Effect.catchTag("CookieError", () =>
      HttpServerResponse.text("Invalid cookie")
    )
  )
);

const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("Hello World"))
);

const app = router.pipe(HttpRouter.use(cookieValidator), HttpServer.serve());

listen(app, 3000);
```

Test the middleware with the following commands:

```sh
curl -i http://localhost:3000
curl -i http://localhost:3000 --cookie "testCookie=myvalue"
curl -i http://localhost:3000 --cookie "testCookie="
```

This setup validates the `testCookie` and returns "Invalid cookie" if the validation fails, or "Hello World" if it passes.

## Applying Middleware in Your Application

Middleware functions are powerful tools that allow you to modify the request-response cycle. Middlewares can be applied at various levels to achieve different scopes of influence:

- **Route Level**: Apply middleware to individual routes.
- **Router Level**: Apply middleware to a group of routes within a single router.
- **Server Level**: Apply middleware across all routes managed by a server.

### Applying Middleware at the Route Level

At the route level, middlewares are applied to specific endpoints, allowing for targeted modifications or enhancements such as logging, authentication, or parameter validation for a particular route.

**Example**

Here's a practical example showing how to apply middleware at the route level:

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform";
import { Effect } from "effect";
import { listen } from "./listen.js";

// Middleware constructor that logs the name of the middleware
const withMiddleware = (name: string) =>
  HttpMiddleware.make((app) =>
    Effect.gen(function* () {
      console.log(name); // Log the middleware name when the route is accessed
      return yield* app; // Continue with the original application flow
    })
  );

const router = HttpRouter.empty.pipe(
  // Applying middleware to route "/a"
  HttpRouter.get("/a", HttpServerResponse.text("a").pipe(withMiddleware("M1"))),
  // Applying middleware to route "/b"
  HttpRouter.get("/b", HttpServerResponse.text("b").pipe(withMiddleware("M2")))
);

const app = router.pipe(HttpServer.serve());

listen(app, 3000);
```

**Testing the Middleware**

You can test the middleware by making requests to the respective routes and observing the console output:

```sh
# Test route /a
curl -i http://localhost:3000/a
# Expected console output: M1

# Test route /b
curl -i http://localhost:3000/b
# Expected console output: M2
```

### Applying Middleware at the Router Level

Applying middleware at the router level is an efficient way to manage common functionalities across multiple routes within your application. Middleware can handle tasks such as logging, authentication, and response modifications before reaching the actual route handlers.

**Example**

Here's how you can structure and apply middleware across different routers using the `@effect/platform` library:

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform";
import { Effect } from "effect";
import { listen } from "./listen.js";

// Middleware constructor that logs the name of the middleware
const withMiddleware = (name: string) =>
  HttpMiddleware.make((app) =>
    Effect.gen(function* () {
      console.log(name); // Log the middleware name when a route is accessed
      return yield* app; // Continue with the original application flow
    })
  );

// Define Router1 with specific routes
const router1 = HttpRouter.empty.pipe(
  HttpRouter.get("/a", HttpServerResponse.text("a")), // Middleware M4, M3, M1 will apply
  HttpRouter.get("/b", HttpServerResponse.text("b")), // Middleware M4, M3, M1 will apply
  // Apply Middleware at the router level
  HttpRouter.use(withMiddleware("M1")),
  HttpRouter.get("/c", HttpServerResponse.text("c")) // Middleware M4, M3 will apply
);

// Define Router2 with specific routes
const router2 = HttpRouter.empty.pipe(
  HttpRouter.get("/d", HttpServerResponse.text("d")), // Middleware M4, M2 will apply
  HttpRouter.get("/e", HttpServerResponse.text("e")), // Middleware M4, M2 will apply
  HttpRouter.get("/f", HttpServerResponse.text("f")), // Middleware M4, M2 will apply
  // Apply Middleware at the router level
  HttpRouter.use(withMiddleware("M2"))
);

// Main router combining Router1 and Router2
const router = HttpRouter.empty.pipe(
  HttpRouter.mount("/r1", router1),
  // Apply Middleware affecting all routes under /r1
  HttpRouter.use(withMiddleware("M3")),
  HttpRouter.get("/g", HttpServerResponse.text("g")), // Only Middleware M4 will apply
  HttpRouter.mount("/r2", router2),
  // Apply Middleware affecting all routes
  HttpRouter.use(withMiddleware("M4"))
);

// Configure the application with the server middleware
const app = router.pipe(HttpServer.serve());

listen(app, 3000);
```

**Testing the Middleware**

To ensure that the middleware is working as expected, you can test it by making HTTP requests to the defined routes and checking the console output for middleware logs:

```sh
# Test route /a under router1
curl -i http://localhost:3000/r1/a
# Expected console output: M4 M3 M1

# Test route /c under router1
curl -i http://localhost:3000/r1/c
# Expected console output: M4 M3

# Test route /d under router2
curl -i http://localhost:3000/r2/d
# Expected console output: M4 M2

# Test route /g under the main router
curl -i http://localhost:3000/g
# Expected console output: M4
```

### Applying Middleware at the Server Level

Applying middleware at the server level allows you to introduce certain functionalities, such as logging, authentication, or general request processing, that affect every request handled by the server. This ensures that all incoming requests, regardless of the route, pass through the applied middleware, making it an essential feature for global error handling, logging, or authentication.

**Example**

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform";
import { Effect } from "effect";
import { listen } from "./listen.js";

// Middleware constructor that logs the name of the middleware
const withMiddleware = (name: string) =>
  HttpMiddleware.make((app) =>
    Effect.gen(function* () {
      console.log(name); // Log the middleware name when the route is accessed
      return yield* app; // Continue with the original application flow
    })
  );

const router = HttpRouter.empty.pipe(
  HttpRouter.get("/a", HttpServerResponse.text("a").pipe(withMiddleware("M1"))),
  HttpRouter.get("/b", HttpServerResponse.text("b")),
  HttpRouter.use(withMiddleware("M2")),
  HttpRouter.get("/", HttpServerResponse.text("root"))
);

const app = router.pipe(HttpServer.serve(withMiddleware("M3")));

listen(app, 3000);
```

**Testing the Middleware**

To confirm the middleware is functioning as intended, you can send HTTP requests to the defined routes and check the console for middleware logs:

```sh
# Test route /a and observe the middleware logs
curl -i http://localhost:3000/a
# Expected console output: M3 M2 M1  - Middleware M3 (server-level), M2 (router-level), and M1 (route-level) apply.

# Test route /b and observe the middleware logs
curl -i http://localhost:3000/b
# Expected console output: M3 M2  - Middleware M3 (server-level) and M2 (router-level) apply.

# Test route / and observe the middleware logs
curl -i http://localhost:3000/
# Expected console output: M3 M2  - Middleware M3 (server-level) and M2 (router-level) apply.
```

### Applying Multiple Middlewares

Middleware functions are simply functions that transform a `Default` app into another `Default` app. This flexibility allows for stacking multiple middleware functions, much like composing functions in functional programming. The `flow` function from the `Effect` library facilitates this by enabling function composition.

**Example**

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform";
import { Effect, flow } from "effect";
import { listen } from "./listen.js";

// Middleware constructor that logs the middleware's name when a route is accessed
const withMiddleware = (name: string) =>
  HttpMiddleware.make((app) =>
    Effect.gen(function* () {
      console.log(name); // Log the middleware name
      return yield* app; // Continue with the original application flow
    })
  );

// Setup routes and apply multiple middlewares using flow for function composition
const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/a",
    HttpServerResponse.text("a").pipe(
      flow(withMiddleware("M1"), withMiddleware("M2"))
    )
  ),
  HttpRouter.get("/b", HttpServerResponse.text("b")),
  // Apply combined middlewares to the entire router
  HttpRouter.use(flow(withMiddleware("M3"), withMiddleware("M4"))),
  HttpRouter.get("/", HttpServerResponse.text("root"))
);

// Apply combined middlewares at the server level
const app = router.pipe(
  HttpServer.serve(flow(withMiddleware("M5"), withMiddleware("M6")))
);

listen(app, 3000);
```

**Testing the Middleware Composition**

To verify that the middleware is functioning as expected, you can send HTTP requests to the routes and check the console for the expected middleware log output:

```sh
# Test route /a to see the output from multiple middleware layers
curl -i http://localhost:3000/a
# Expected console output: M6 M5 M4 M3 M2 M1

# Test route /b where fewer middleware are applied
curl -i http://localhost:3000/b
# Expected console output: M6 M5 M4 M3

# Test the root route to confirm top-level middleware application
curl -i http://localhost:3000/
# Expected console output: M6 M5
```

## Built-in middleware

### Middleware Summary

| Middleware            | Description                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Logger**            | Provides detailed logging of all requests and responses, aiding in debugging and monitoring application activities.               |
| **xForwardedHeaders** | Manages `X-Forwarded-*` headers to accurately maintain client information such as IP addresses and host names in proxy scenarios. |

### logger

The `HttpMiddleware.logger` middleware enables logging for your entire application, providing insights into each request and response. Here's how to set it up:

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform";
import { listen } from "./listen.js";

const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("Hello World"))
);

// Apply the logger middleware globally
const app = router.pipe(HttpServer.serve(HttpMiddleware.logger));

listen(app, 3000);
/*
curl -i http://localhost:3000
timestamp=... level=INFO fiber=#0 message="Listening on http://0.0.0.0:3000"
timestamp=... level=INFO fiber=#19 message="Sent HTTP response" http.span.1=8ms http.status=200 http.method=GET http.url=/
timestamp=... level=INFO fiber=#20 cause="RouteNotFound: GET /favicon.ico not found
    at ...
    at http.server GET" http.span.2=4ms http.status=500 http.method=GET http.url=/favicon.ico
*/
```

To disable the logger for specific routes, you can use `HttpMiddleware.withLoggerDisabled`:

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform";
import { listen } from "./listen.js";

// Create the router with routes that will and will not have logging
const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("Hello World")),
  HttpRouter.get(
    "/no-logger",
    HttpServerResponse.text("no-logger").pipe(HttpMiddleware.withLoggerDisabled)
  )
);

// Apply the logger middleware globally
const app = router.pipe(HttpServer.serve(HttpMiddleware.logger));

listen(app, 3000);
/*
curl -i http://localhost:3000/no-logger
timestamp=2024-05-19T09:53:29.877Z level=INFO fiber=#0 message="Listening on http://0.0.0.0:3000"
*/
```

### xForwardedHeaders

This middleware handles `X-Forwarded-*` headers, useful when your app is behind a reverse proxy or load balancer and you need to retrieve the original client's IP and host information.
**WARNING:** The `X-Forwarded-*` headers are untrustworthy when no trusted reverse proxy or load balancer is between the client and server.

```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect } from "effect";
import { listen } from "./listen.js";

// Create a router and a route that logs request headers and remote address
const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      console.log(req.headers);
      console.log(req.remoteAddress);
      return yield* HttpServerResponse.text("Hello World");
    })
  )
);

// Set up the server with xForwardedHeaders middleware
const app = router.pipe(HttpServer.serve(HttpMiddleware.xForwardedHeaders));

listen(app, 3000);
/*
curl -H "X-Forwarded-Host: 192.168.1.1" -H "X-Forwarded-For: 192.168.1.1" http://localhost:3000
timestamp=... level=INFO fiber=#0 message="Listening on http://0.0.0.0:3000"
{
  host: '192.168.1.1',
  'user-agent': 'curl/8.6.0',
  accept: '*\/*',
  'x-forwarded-host': '192.168.1.1',
  'x-forwarded-for': '192.168.1.1'
}
{ _id: 'Option', _tag: 'Some', value: '192.168.1.1' }
*/
```

## Error Handling

### Catching Errors

Below is an example illustrating how to catch and manage errors that occur during the execution of route handlers:

```ts
import { HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform";
import { Effect } from "effect";
import { listen } from "./listen.js";

// Define routes that might throw errors or fail
const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/throw",
    Effect.sync(() => {
      throw new Error("BROKEN"); // This will intentionally throw an error
    })
  ),
  HttpRouter.get("/fail", Effect.fail("Uh oh!")) // This will intentionally fail
);

// Configure the application to handle different types of errors
const app = router.pipe(
  Effect.catchTags({
    RouteNotFound: () =>
      HttpServerResponse.text("Route Not Found", { status: 404 }),
  }),
  Effect.catchAllCause((cause) =>
    HttpServerResponse.text(cause.toString(), { status: 500 })
  ),
  HttpServer.serve()
);

listen(app, 3000);
```

You can test the error handling setup with `curl` commands by trying to access routes that trigger errors:

```sh
# Accessing a route that does not exist
curl -i http://localhost:3000/nonexistent

# Accessing the route that throws an error
curl -i http://localhost:3000/throw

# Accessing the route that fails
curl -i http://localhost:3000/fail
```

## Validations

Validation is a critical aspect of handling HTTP requests to ensure that the data your server receives is as expected. We'll explore how to validate headers and cookies using the `@effect/platform` and `effect/Schema` libraries, which provide structured and robust methods for these tasks.

### Headers

Headers often contain important information needed by your application, such as content types, authentication tokens, or session data. Validating these headers ensures that your application can trust and correctly process the information it receives.

```ts
import {
  HttpRouter,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect, Schema } from "effect";
import { listen } from "./listen.js";

const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/",
    Effect.gen(function* () {
      // Define the schema for expected headers and validate them
      const headers = yield* HttpServerRequest.schemaHeaders(
        Schema.Struct({ test: Schema.String })
      );
      return yield* HttpServerResponse.text("header: " + headers.test);
    }).pipe(
      // Handle parsing errors
      Effect.catchTag("ParseError", (e) =>
        HttpServerResponse.text(`Invalid header: ${e.message}`)
      )
    )
  )
);

const app = router.pipe(HttpServer.serve());

listen(app, 3000);
```

You can test header validation using the following `curl` commands:

```sh
# Request without the required header
curl -i http://localhost:3000

# Request with the valid header
curl -i -H "test: myvalue" http://localhost:3000
```

### Cookies

Cookies are commonly used to maintain session state or user preferences. Validating cookies ensures that the data they carry is intact and as expected, enhancing security and application integrity.

Here's how you can validate cookies received in HTTP requests:

```ts
import {
  Cookies,
  HttpRouter,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect, Schema } from "effect";
import { listen } from "./listen.js";

const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/",
    Effect.gen(function* () {
      const cookies = yield* HttpServerRequest.schemaCookies(
        Schema.Struct({ test: Schema.String })
      );
      return yield* HttpServerResponse.text("cookie: " + cookies.test);
    }).pipe(
      Effect.catchTag("ParseError", (e) =>
        HttpServerResponse.text(`Invalid cookie: ${e.message}`)
      )
    )
  )
);

const app = router.pipe(HttpServer.serve());

listen(app, 3000);
```

Validate the cookie handling with the following `curl` commands:

```sh
# Request without any cookies
curl -i http://localhost:3000

# Request with the valid cookie
curl -i http://localhost:3000 --cookie "test=myvalue"
```

## ServerRequest

### How do I get the raw request?

The native request object depends on the platform you are using, and it is not directly modeled in `@effect/platform`. Instead, you need to refer to the specific platform package you are working with, such as `@effect/platform-node` or `@effect/platform-bun`.

Here is an example using Node.js:

```ts
import {
  HttpRouter,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { NodeHttpServer, NodeHttpServerRequest } from "@effect/platform-node";
import { Effect } from "effect";
import { listen } from "./listen.js";

const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const raw = NodeHttpServerRequest.toIncomingMessage(req);
      console.log(raw);
      return HttpServerResponse.empty();
    })
  )
);

listen(HttpServer.serve(router), 3000);
```

## Conversions

### toWebHandler

The `toWebHandler` function converts a `Default` (i.e. a type of `HttpApp` that specifically produces a `ServerResponse` as its output) into a web handler that can process `Request` objects and return `Response` objects.

```ts
import { HttpApp, HttpRouter, HttpServerResponse } from "@effect/platform";

// Define the router with some routes
const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("content 1")),
  HttpRouter.get("/foo", HttpServerResponse.text("content 2"))
);

// Convert the router to a web handler
// const handler: (request: Request) => Promise<Response>
const handler = HttpApp.toWebHandler(router);

// Test the handler with a request
const response = await handler(new Request("http://localhost:3000/foo"));
console.log(await response.text()); // Output: content 2
```

# Url

The `Url` module provides utilities for constructing and working with `URL` objects in a functional style. It includes:

- A safe constructor for parsing URLs from strings.
- Functions for immutably updating `URL` properties like `host`, `href`, and `search`.
- Tools for reading and modifying URL parameters using the `UrlParams` module.
- A focus on immutability, creating new `URL` instances for every change.

## Creating a URL

### fromString

This function takes a string and attempts to parse it into a `URL` object. If the string is invalid, it returns an `Either.Left` containing an `IllegalArgumentException` with the error details. Otherwise, it returns an `Either.Right` containing the parsed `URL`.

You can optionally provide a `base` parameter to resolve relative URLs. When supplied, the function treats the input `url` as relative to the `base`.

**Example** (Parsing a URL with Optional Base)

```ts
import { Url } from "@effect/platform";
import { Either } from "effect";

// Parse an absolute URL
//
//      ┌─── Either<URL, IllegalArgumentException>
//      ▼
const parsed = Url.fromString("https://example.com/path");

if (Either.isRight(parsed)) {
  console.log("Parsed URL:", parsed.right.toString());
} else {
  console.log("Error:", parsed.left.message);
}
// Output: Parsed URL: https://example.com/path

// Parse a relative URL with a base
const relativeParsed = Url.fromString("/relative-path", "https://example.com");

if (Either.isRight(relativeParsed)) {
  console.log("Parsed relative URL:", relativeParsed.right.toString());
} else {
  console.log("Error:", relativeParsed.left.message);
}
// Output: Parsed relative URL: https://example.com/relative-path
```

## Immutably Changing URL Properties

The `Url` module offers a set of functions for updating properties of a `URL` object without modifying the original instance. These functions create and return a new `URL` with the specified updates, preserving the immutability of the original.

### Available Setters

| Setter        | Description                                               |
| ------------- | --------------------------------------------------------- |
| `setHash`     | Updates the hash fragment of the URL.                     |
| `setHost`     | Updates the host (domain and port) of the URL.            |
| `setHostname` | Updates the domain of the URL without modifying the port. |
| `setHref`     | Replaces the entire URL string.                           |
| `setPassword` | Updates the password used for authentication.             |
| `setPathname` | Updates the path of the URL.                              |
| `setPort`     | Updates the port of the URL.                              |
| `setProtocol` | Updates the protocol (e.g., `http`, `https`).             |
| `setSearch`   | Updates the query string of the URL.                      |
| `setUsername` | Updates the username used for authentication.             |

**Example** (Using Setters to Modify URL Properties)

```ts
import { Url } from "@effect/platform";
import { pipe } from "effect";

const myUrl = new URL("https://example.com");

// Changing protocol, host, and port
const newUrl = pipe(
  myUrl,
  Url.setProtocol("http:"),
  Url.setHost("google.com"),
  Url.setPort("8080")
);

console.log("Original:", myUrl.toString());
// Output: Original: https://example.com/

console.log("New:", newUrl.toString());
// Output: New: http://google.com:8080/
```

### mutate

For more advanced modifications, use the `mutate` function. It clones the original `URL` object and applies a callback to the clone, allowing multiple updates at once.

**Example** (Applying Multiple Changes with `mutate`)

```ts
import { Url } from "@effect/platform";

const myUrl = new URL("https://example.com");

const mutatedUrl = Url.mutate(myUrl, (url) => {
  url.username = "user";
  url.password = "pass";
});

console.log("Mutated:", mutatedUrl.toString());
// Output: Mutated: https://user:pass@example.com/
```

## Reading and Writing URL Parameters

The `Url` module provides utilities for working with URL query parameters. These utilities allow you to read existing parameters and write new ones, all while maintaining immutability. This functionality is supported by the `UrlParams` module.

You can extract the query parameters from a `URL` object using the `urlParams` function.

To modify or add query parameters, use the `setUrlParams` function. This function creates a new `URL` with the updated query string.

**Example** (Reading and Writing Parameters)

```ts
import { Url, UrlParams } from "@effect/platform";

const myUrl = new URL("https://example.com?foo=bar");

// Read parameters
const params = Url.urlParams(myUrl);

console.log(params);
// Output: [ [ 'foo', 'bar' ] ]

// Write parameters
const updatedUrl = Url.setUrlParams(
  myUrl,
  UrlParams.fromInput([["key", "value"]])
);

console.log(updatedUrl.toString());
// Output: https://example.com/?key=value
```

### Modifying URL Parameters

The `modifyUrlParams` function allows you to read, modify, and overwrite URL parameters in a single operation.

**Example** (Appending a Parameter to a URL)

```ts
import { Url, UrlParams } from "@effect/platform";

const myUrl = new URL("https://example.com?foo=bar");

const changedUrl = Url.modifyUrlParams(myUrl, UrlParams.append("key", "value"));

console.log(changedUrl.toString());
// Output: https://example.com/?foo=bar&key=value
```

# OpenApiJsonSchema

The `OpenApiJsonSchema` module provides utilities to transform `Schema` objects into JSON schemas that comply with the OpenAPI Specification. These utilities are especially helpful for generating OpenAPI documentation or working with tools that require OpenAPI-compliant schemas.

## Creating a JSON Schema from a Schema

This module enables you to convert `Schema` objects into OpenAPI-compatible JSON schemas, making it easy to integrate with tools like Swagger or other OpenAPI-based frameworks.

**Example** (Generating a JSON Schema from a String Schema)

```ts
import { OpenApiJsonSchema } from "@effect/platform";
import { Schema } from "effect";

const schema = Schema.String;

// Convert the schema to OpenAPI JSON Schema
const openApiSchema = OpenApiJsonSchema.make(schema);

console.log(JSON.stringify(openApiSchema, null, 2));
/*
Output:
{
  "type": "string"
}
*/
```

## Differences from JSONSchema

The `OpenApiJsonSchema` module differs from the `JSONSchema` module in several ways. These differences are tailored to align with the OpenAPI Specification.

### `$schema` Property Omission

OpenAPI schemas do not include the `$schema` property, while JSON schemas do.

**Example** (Comparison of `$schema` Property)

```ts
import { OpenApiJsonSchema } from "@effect/platform";
import { JSONSchema, Schema } from "effect";

const schema = Schema.String;

const openApiSchema = OpenApiJsonSchema.make(schema);
const jsonSchema = JSONSchema.make(schema);

console.log(JSON.stringify(openApiSchema, null, 2));
/*
Output:
{
  "type": "string"
}
*/

console.log(JSON.stringify(jsonSchema, null, 2));
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "string"
}
*/
```

### Handling of `null` Values

OpenAPI does not support `{ "type": "null" }`. Instead, it uses an `enum` containing `null` to represent nullable values.

**Example** (Representation of `null` Values)

```ts
import { OpenApiJsonSchema } from "@effect/platform";
import { JSONSchema, Schema } from "effect";

const schema = Schema.Null;

const openApiSchema = OpenApiJsonSchema.make(schema);
const jsonSchema = JSONSchema.make(schema);

console.log(JSON.stringify(openApiSchema, null, 2));
/*
Output:
{
  "enum": [
    null
  ]
}
*/

console.log(JSON.stringify(jsonSchema, null, 2));
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "null"
}
*/
```

### Nullable Values

OpenAPI uses the `nullable` property to indicate that a value can be `null`, whereas JSON schemas use an `anyOf` structure.

**Example** (Nullable Property Representation)

```ts
import { OpenApiJsonSchema } from "@effect/platform";
import { JSONSchema, Schema } from "effect";

const schema = Schema.NullOr(Schema.String);

const openApiSchema = OpenApiJsonSchema.make(schema);
const jsonSchema = JSONSchema.make(schema);

console.log(JSON.stringify(openApiSchema, null, 2));
/*
Output:
{
  "type": "string",
  "nullable": true
}
*/

console.log(JSON.stringify(jsonSchema, null, 2));
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
*/
```

### `contentSchema` Support

OpenAPI schemas include a `contentSchema` property, which allows you to describe the structure of the content for a media type (e.g., `application/json`). This feature is not available in JSON schemas (Draft 7), making `contentSchema` particularly useful for defining structured payloads in OpenAPI documentation.

**Note**: Use `contentSchema` to define the internal structure of media types like `application/json` in OpenAPI specifications. This property provides clarity and detail for tools and users interacting with the API, especially when handling structured payloads.

**Example** (Defining a Schema with `contentSchema` for JSON Content)

```ts
import { OpenApiJsonSchema } from "@effect/platform";
import { JSONSchema, Schema } from "effect";

// Define a schema for parsing JSON content
const schema = Schema.parseJson(Schema.Struct({ a: Schema.String }));

const openApiSchema = OpenApiJsonSchema.make(schema);
const jsonSchema = JSONSchema.make(schema);

console.log(JSON.stringify(openApiSchema, null, 2));
/*
Output:
{
  "type": "string",
  "contentMediaType": "application/json",
  "contentSchema": {
    "type": "object",
    "required": [
      "a"
    ],
    "properties": {
      "a": {
        "type": "string"
      }
    },
    "additionalProperties": false
  }
}
*/

console.log(JSON.stringify(jsonSchema, null, 2));
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "a"
  ],
  "properties": {
    "a": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
*/
```

### makeWithDefs

The `makeWithDefs` function generates OpenAPI-compatible JSON schemas and collects schema definitions in a shared object. This is especially useful for consolidating multiple schemas into a single OpenAPI specification, enabling schema reuse across your API.

**Example** (Generating OpenAPI Schema with Definitions)

```ts
import { OpenApiJsonSchema } from "@effect/platform";
import { Schema } from "effect";

// Define a schema with an identifier annotation
const schema = Schema.Struct({ a: Schema.String }).annotations({
  identifier: "MyStruct",
});

// Create a definitions object
const defs = {};

// Generate the OpenAPI schema while collecting definitions
const openApiSchema = OpenApiJsonSchema.makeWithDefs(schema, { defs });

console.log(JSON.stringify(openApiSchema, null, 2));
/*
Output:
{
  "$ref": "#/components/schemas/MyStruct"
}
*/

console.log(JSON.stringify(defs, null, 2));
/*
Output:
{
  "MyStruct": {
    "type": "object",
    "required": [
      "a"
    ],
    "properties": {
      "a": {
        "type": "string"
      }
    },
    "additionalProperties": false
  }
}
*/
```

**Example** (Combining Multiple Schemas into One OpenAPI Specification)

```ts
import { OpenApiJsonSchema } from "@effect/platform";
import { Schema } from "effect";

// Define multiple schemas with unique identifiers
const schema1 = Schema.Struct({ a: Schema.String }).annotations({
  identifier: "MyStruct1",
});
const schema2 = Schema.Struct({ b: Schema.Number }).annotations({
  identifier: "MyStruct2",
});

// Create a shared definitions object
const defs = {};

// Use `makeWithDefs` to generate schemas for API paths
const paths = {
  paths: {
    "/path1": {
      get: {
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: OpenApiJsonSchema.makeWithDefs(schema1, { defs }),
              },
            },
          },
        },
      },
    },
    "/path2": {
      get: {
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: OpenApiJsonSchema.makeWithDefs(schema2, { defs }),
              },
            },
          },
        },
      },
    },
  },
};

// Combine paths and definitions into a single OpenAPI schema
const openApiSchema = {
  components: {
    schemas: defs,
  },
  paths,
};

console.log(JSON.stringify(openApiSchema, null, 2));
/*
Output:
{
  "components": {
    "schemas": {
      "MyStruct1": {
        "type": "object",
        "required": [
          "a"
        ],
        "properties": {
          "a": {
            "type": "string"
          }
        },
        "additionalProperties": false
      },
      "MyStruct2": {
        "type": "object",
        "required": [
          "b"
        ],
        "properties": {
          "b": {
            "type": "number"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "paths": {
    "paths": {
      "/path1": {
        "get": {
          "responses": {
            "200": {
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MyStruct1"
                  }
                }
              }
            }
          }
        }
      },
      "/path2": {
        "get": {
          "responses": {
            "200": {
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MyStruct2"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
*/
```

# HttpLayerRouter

The experimental `HttpLayerRouter` module provides a simplified way to create HTTP servers.
It aims to simplify the process of defining routes and registering other HTTP
services like `HttpApi` or `RpcServer`'s.

## Registering routes

```ts
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as HttpLayerRouter from "@effect/platform/HttpLayerRouter";
import * as HttpServerResponse from "@effect/platform/HttpServerResponse";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { createServer } from "http";

// Here is how you can register a simple GET route
const HelloRoute = Layer.effectDiscard(
  Effect.gen(function* () {
    // First, we need to access the `HttpRouter` service
    const router = yield* HttpLayerRouter.HttpRouter;

    // Then, we can add a new route to the router
    yield* router.add(
      "GET",
      "/hello",
      HttpServerResponse.text("Hello, World!")
    );
  })
);

// You can also use the `HttpLayerRouter.use` function to register a route
const GoodbyeRoute = HttpLayerRouter.use(
  Effect.fn(function* (router) {
    // The `router` parameter is the `HttpRouter` service
    yield* router.add(
      "GET",
      "/goodbye",
      HttpServerResponse.text("Goodbye, World!")
    );
  })
);
// Or use `HttpLayerRouter.add/addAll` for simple routes
const SimpleRoute = HttpLayerRouter.add(
  "GET",
  "/simple",
  HttpServerResponse.text("Simply fantastic!")
);

const AllRoutes = Layer.mergeAll(HelloRoute, GoodbyeRoute, SimpleRoute);

// To start the server, we use `HttpLayerRouter.serve` with the routes layer
HttpLayerRouter.serve(AllRoutes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.launch,
  NodeRuntime.runMain
);
```

## Applying middleware

```ts
import * as HttpLayerRouter from "@effect/platform/HttpLayerRouter";
import * as HttpMiddleware from "@effect/platform/HttpMiddleware";
import * as HttpServerResponse from "@effect/platform/HttpServerResponse";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

// Here is a service that we want to provide to every HTTP request
class CurrentSession extends Context.Tag("CurrentSession")<
  CurrentSession,
  {
    readonly token: string;
  }
>() {}

// Using the `HttpLayerRouter.middleware` function, we can create a middleware
// that provides the `CurrentSession` service to every HTTP request.
const SessionMiddleware = HttpLayerRouter.middleware<{
  provides: CurrentSession;
}>()(
  Effect.gen(function* () {
    yield* Effect.log("SessionMiddleware initialized");

    return (httpEffect) =>
      Effect.provideService(httpEffect, CurrentSession, {
        token: "dummy-token",
      });
  })
);

// And here is an example of global middleware, that modifies the HTTP response.
// Global middleware directly returns a `Layer`.
const CorsMiddleware = HttpLayerRouter.middleware(HttpMiddleware.cors(), {
  global: true,
});
// You can also use `HttpLayerRouter.cors()` to create a CORS middleware

const HelloRoute = HttpLayerRouter.add(
  "GET",
  "/hello",
  Effect.gen(function* () {
    // We can now access the `CurrentSession` service in our route handler
    const session = yield* CurrentSession;
    return HttpServerResponse.text(
      `Hello, World! Your session token is: ${session.token}`
    );
  })
).pipe(
  // We can provide the `SessionMiddleware.layer` to the `HelloRoute` layer
  Layer.provide(SessionMiddleware.layer),
  // And we can also provide the `CorsMiddleware` layer to handle CORS
  Layer.provide(CorsMiddleware)
);
```

## Interdependent middleware

If middleware depends on another middleware, you can use the `.combine` api to
combine them.

```ts
import * as HttpLayerRouter from "@effect/platform/HttpLayerRouter";
import * as HttpServerResponse from "@effect/platform/HttpServerResponse";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

class CurrentSession extends Context.Tag("CurrentSession")<
  CurrentSession,
  {
    readonly token: string;
  }
>() {}

const SessionMiddleware = HttpLayerRouter.middleware<{
  provides: CurrentSession;
}>()(
  Effect.gen(function* () {
    yield* Effect.log("SessionMiddleware initialized");

    return (httpEffect) =>
      Effect.provideService(httpEffect, CurrentSession, {
        token: "dummy-token",
      });
  })
);

// Here is a middleware that uses the `CurrentSession` service
const LogMiddleware = HttpLayerRouter.middleware(
  Effect.gen(function* () {
    yield* Effect.log("LogMiddleware initialized");

    return Effect.fn(function* (httpEffect) {
      const session = yield* CurrentSession;
      yield* Effect.log(`Current session token: ${session.token}`);
      return yield* httpEffect;
    });
  })
);

// We can then use the .combine method to combine the middlewares
const LogAndSessionMiddleware = LogMiddleware.combine(SessionMiddleware);

const HelloRoute = HttpLayerRouter.add(
  "GET",
  "/hello",
  Effect.gen(function* () {
    const session = yield* CurrentSession;
    return HttpServerResponse.text(
      `Hello, World! Your session token is: ${session.token}`
    );
  })
).pipe(Layer.provide(LogAndSessionMiddleware.layer));
```

## Registering a HttpApi

```ts
import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiScalar,
  HttpLayerRouter,
} from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { createServer } from "http";

// First, we define our HttpApi
class MyApi extends HttpApi.make("api").add(
  HttpApiGroup.make("users")
    .add(HttpApiEndpoint.get("me", "/me"))
    .prefix("/users")
) {}

// Implement the handlers for the API
const UsersApiLayer = HttpApiBuilder.group(MyApi, "users", (handers) =>
  handers.handle("me", () => Effect.void)
);

// Use `HttpLayerRouter.addHttpApi` to register the API with the router
const HttpApiRoutes = HttpLayerRouter.addHttpApi(MyApi, {
  openapiPath: "/docs/openapi.json",
}).pipe(
  // Provide the api handlers layer
  Layer.provide(UsersApiLayer)
);

// Create a /docs route for the API documentation
const DocsRoute = HttpApiScalar.layerHttpLayerRouter({
  api: MyApi,
  path: "/docs",
});

// Finally, we merge all routes and serve them using the Node HTTP server
const AllRoutes = Layer.mergeAll(HttpApiRoutes, DocsRoute).pipe(
  Layer.provide(HttpLayerRouter.cors())
);

HttpLayerRouter.serve(AllRoutes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.launch,
  NodeRuntime.runMain
);
```

## Registering a RpcServer

```ts
import { HttpLayerRouter } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Rpc, RpcGroup, RpcSerialization, RpcServer } from "@effect/rpc";
import { Effect, Layer, Schema } from "effect";
import { createServer } from "http";

export class User extends Schema.Class<User>("User")({
  id: Schema.String,
  name: Schema.String,
}) {}

// Define a group of RPCs
export class UserRpcs extends RpcGroup.make(
  Rpc.make("UserById", {
    success: User,
    error: Schema.String, // Indicates that errors, if any, will be returned as strings
    payload: {
      id: Schema.String,
    },
  })
) {}

const UserHandlers = UserRpcs.toLayer({
  UserById: ({ id }) => Effect.succeed(new User({ id, name: "John Doe" })),
});

// Use `HttpLayerRouter` to register the rpc server
const RpcRoute = RpcServer.layerHttpRouter({
  group: UserRpcs,
  path: "/rpc",
}).pipe(
  Layer.provide(UserHandlers),
  Layer.provide(RpcSerialization.layerJson),
  Layer.provide(HttpLayerRouter.cors()) // provide CORS middleware
);

// Start the HTTP server with the RPC route
HttpLayerRouter.serve(RpcRoute).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.launch,
  NodeRuntime.runMain
);
```

## Create a web handler

```ts
import * as HttpLayerRouter from "@effect/platform/HttpLayerRouter";
import * as HttpServerResponse from "@effect/platform/HttpServerResponse";
import * as Effect from "effect/Effect";

const HelloRoute = HttpLayerRouter.use(
  Effect.fn(function* (router) {
    yield* router.add(
      "GET",
      "/hello",
      HttpServerResponse.text("Hellow, World!")
    );
  })
);

const { dispose, handler } = HttpLayerRouter.toWebHandler(HelloRoute);

// When the process is interrupted, we want to clean up resources
process.on("SIGINT", () => {
  dispose().then(
    () => {
      process.exit(0);
    },
    () => {
      process.exit(1);
    }
  );
});

// Use the handler in your server setup
export { handler };
```

import { HttpRouter, HttpServer, HttpServerRequest, HttpServerResponse } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { CreateTranscriptionJobRequest } from "@puredialog/domain";
import type { CreateTranscriptionJobRequest as CreateReq } from "@puredialog/domain";
import { Effect, Layer } from "effect";
import { createServer } from "node:http";

const router = HttpRouter.empty.pipe(
  HttpRouter.get("/health", HttpServerResponse.json({ status: "ok" })),
  HttpRouter.post(
    "/v1/transcription-jobs",
    HttpServerRequest.schemaBodyJson(CreateTranscriptionJobRequest).pipe(
      Effect.matchEffect({
        onFailure: () => HttpServerResponse.json({ error: "invalid request" }, { status: 400 }),
        onSuccess: (body: CreateReq) =>
          HttpServerResponse.json(
            { jobId: "pending", requestId: body.requestId },
            { status: 202 },
          ),
      }),
    ),
  ),
);

const app = router.pipe(HttpServer.serve(), HttpServer.withLogAddress);

const port = Number(process.env.PORT ?? 8080);
const ServerLive = NodeHttpServer.layer(() => createServer(), { port });
const Provided = app.pipe(Layer.provide(ServerLive));

NodeRuntime.runMain()(Layer.launch(Provided));

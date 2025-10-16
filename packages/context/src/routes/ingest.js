import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";
import { v4 as uuidv4 } from "uuid";
import { contextApi } from "../http/api.js";
import { IngestResponse } from "../http/schemas.js";
export const ingestRoutes = HttpApiBuilder.group(contextApi, "ingest", (handlers) => handlers.handle("ingest", () => Effect.succeed(IngestResponse.make({
    id: uuidv4(),
    status: "pending"
}))));
//# sourceMappingURL=ingest.js.map
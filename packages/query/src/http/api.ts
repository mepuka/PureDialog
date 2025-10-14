import { HttpApi, HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"

const QueryResponse = Schema.Struct({
  id: Schema.String,
  content: Schema.String
})

const Query = HttpApiGroup.make("query").add(
  HttpApiEndpoint.get("stream", "/query/stream").addSuccess(QueryResponse).addError(HttpApiError.HttpApiDecodeError)
)

export const queryApi = HttpApi
  .make(
    "QueryApi"
  )
  .add(Query)

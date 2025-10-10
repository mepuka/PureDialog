import { Schema } from "effect"

export const IngestRequest = Schema.Struct({
  source: Schema.String,
  destination: Schema.String
})

export const IngestResponse = Schema.Struct({
  id: Schema.String,
  status: Schema.String
})

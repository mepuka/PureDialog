import { Schema } from "effect"

/**
 * LLM-related branded ID types
 */

export const LLMArtifactId = Schema.String.pipe(
  Schema.brand("LLMArtifactId"),
  Schema.annotations({
    description: "Unique identifier for an LLM artifact (config + execution metadata)"
  })
)
export type LLMArtifactId = Schema.Schema.Type<typeof LLMArtifactId>

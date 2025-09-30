import { Schema } from "effect"
import { JobId } from "../core/ids.js"
import { LLMArtifactId } from "./ids.js"
import { ProviderConfig } from "./provider.js"

/**
 * LLM artifact schemas for traceability and reproducibility
 */

/**
 * Complete LLM artifact for traceability.
 * Links jobId → provider config → execution metadata.
 * Prompts and raw responses are stored separately in @llm/ package.
 */
export const LLMArtifacts = Schema.Struct({
  id: LLMArtifactId,
  jobId: JobId,
  providerConfig: ProviderConfig,
  createdAt: Schema.DateTimeUtc,
  additional: Schema.Record({ key: Schema.String, value: Schema.Unknown })
}).annotations({
  description: "Complete LLM execution artifact for traceability (config + execution metadata)"
})
export type LLMArtifacts = Schema.Schema.Type<typeof LLMArtifacts>

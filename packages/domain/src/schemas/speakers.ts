import { Schema } from "effect"

export const SpeakerRole = Schema.Literal("host", "guest")
export type SpeakerRole = Schema.Schema.Type<typeof SpeakerRole>

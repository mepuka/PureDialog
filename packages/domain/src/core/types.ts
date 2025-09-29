import { Schema } from "effect"

/**
 * Fundamental types used throughout the domain
 */

/**
 * A specific, branded type for ISO 639-1 language codes (e.g., "en", "es").
 */
export const LanguageCode = Schema.String.pipe(
  Schema.pattern(/^[a-z]{2}(-[A-Z]{2})?$/),
  Schema.brand("LanguageCode")
)
export type LanguageCode = Schema.Schema.Type<typeof LanguageCode>

/**
 * A precise, branded type for HH:MM:SS timestamps.
 * This ensures consistency and prevents assignment of arbitrary strings.
 */
export const TimestampString = Schema.String.pipe(
  Schema.pattern(/^(\d{2,}):([0-5]\d):([0-5]\d)$/, {
    message: () => "Timestamp must be in HH:MM:SS format."
  }),
  Schema.brand("Timestamp")
)
export type Timestamp = Schema.Schema.Type<typeof TimestampString>

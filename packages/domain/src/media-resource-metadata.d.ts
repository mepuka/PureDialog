import { Schema } from "effect";
/**
 * A specific, branded type for ISO 639-1 language codes (e.g., "en", "es").
 */
export declare const LanguageCode: Schema.brand<Schema.filter<typeof Schema.String>, "LanguageCode">;
export type LanguageCode = Schema.Schema.Type<typeof LanguageCode>;
/**
 * A structured representation of a single speaker identified in the media.
 * This is a core entity within the metadata.
 */
export declare const Speaker: Schema.Struct<{
    id: Schema.filter<typeof Schema.String>;
    role: Schema.Literal<["host", "guest"]>;
    name: Schema.optional<typeof Schema.String>;
    affiliation: Schema.optional<Schema.Struct<{
        name: typeof Schema.String;
        url: Schema.optional<Schema.filter<typeof Schema.String>>;
    }>>;
    bio: Schema.optional<typeof Schema.String>;
}>;
export type Speaker = Schema.Schema.Type<typeof Speaker>;
/**
 * The canonical MediaMetadata entity.
 * This is the complete, structured context extracted from a MediaResource
 * before the transcription process begins.
 */
export declare const MediaMetadata: Schema.Struct<{
    mediaResourceId: Schema.brand<typeof Schema.String, "MediaResourceId">;
    jobId: Schema.brand<typeof Schema.String, "JobId">;
    title: Schema.filter<typeof Schema.String>;
    summary: Schema.optional<typeof Schema.String>;
    tags: Schema.Array$<typeof Schema.String>;
    domain: Schema.Array$<typeof Schema.String>;
    speakers: Schema.Array$<Schema.Struct<{
        id: Schema.filter<typeof Schema.String>;
        role: Schema.Literal<["host", "guest"]>;
        name: Schema.optional<typeof Schema.String>;
        affiliation: Schema.optional<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<Schema.filter<typeof Schema.String>>;
        }>>;
        bio: Schema.optional<typeof Schema.String>;
    }>>;
    language: Schema.brand<Schema.filter<typeof Schema.String>, "LanguageCode">;
    durationSec: Schema.filter<typeof Schema.Number>;
    links: Schema.optional<Schema.filter<typeof Schema.String>>;
    createdAt: typeof Schema.Date;
}>;
export type MediaMetadata = Schema.Schema.Type<typeof MediaMetadata>;

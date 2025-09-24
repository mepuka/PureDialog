import { Schema } from "effect";
/** A unique identifier for a YouTube video (11 characters). */
export declare const YouTubeVideoId: Schema.brand<Schema.filter<Schema.filter<Schema.filter<typeof Schema.String>>>, "YouTubeVideoId">;
export type YouTubeVideoId = Schema.Schema.Type<typeof YouTubeVideoId>;
/** A unique identifier for a YouTube channel (24 characters starting with UC). */
export declare const YouTubeChannelId: Schema.brand<Schema.filter<Schema.filter<Schema.filter<typeof Schema.String>>>, "YouTubeChannelId">;
export type YouTubeChannelId = Schema.Schema.Type<typeof YouTubeChannelId>;
declare const YouTubeVideo_base: Schema.Class<YouTubeVideo, {
    id: Schema.brand<Schema.filter<Schema.filter<Schema.filter<typeof Schema.String>>>, "YouTubeVideoId">;
    title: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    duration: typeof Schema.Number;
    channelId: typeof Schema.String;
    channelTitle: typeof Schema.String;
    publishedAt: Schema.optional<typeof Schema.String>;
    language: Schema.PropertySignature<"?:", string | undefined, never, "?:", string | undefined, true, never>;
}, Schema.Struct.Encoded<{
    id: Schema.brand<Schema.filter<Schema.filter<Schema.filter<typeof Schema.String>>>, "YouTubeVideoId">;
    title: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    duration: typeof Schema.Number;
    channelId: typeof Schema.String;
    channelTitle: typeof Schema.String;
    publishedAt: Schema.optional<typeof Schema.String>;
    language: Schema.PropertySignature<"?:", string | undefined, never, "?:", string | undefined, true, never>;
}>, never, {
    readonly id: string & import("effect/Brand").Brand<"YouTubeVideoId">;
} & {
    readonly title: string;
} & {
    readonly language?: string | undefined;
} & {
    readonly duration: number;
} & {
    readonly channelId: string;
} & {
    readonly channelTitle: string;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
}, {}, {}>;
/** Clean domain representation of a YouTube video resource. */
export declare class YouTubeVideo extends YouTubeVideo_base {
}
declare const YouTubeChannel_base: Schema.Class<YouTubeChannel, {
    id: Schema.brand<Schema.filter<Schema.filter<Schema.filter<typeof Schema.String>>>, "YouTubeChannelId">;
    title: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    customUrl: Schema.optional<typeof Schema.String>;
    publishedAt: typeof Schema.String;
    country: Schema.optional<typeof Schema.String>;
    subscriberCount: Schema.optional<typeof Schema.Number>;
}, Schema.Struct.Encoded<{
    id: Schema.brand<Schema.filter<Schema.filter<Schema.filter<typeof Schema.String>>>, "YouTubeChannelId">;
    title: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    customUrl: Schema.optional<typeof Schema.String>;
    publishedAt: typeof Schema.String;
    country: Schema.optional<typeof Schema.String>;
    subscriberCount: Schema.optional<typeof Schema.Number>;
}>, never, {
    readonly id: string & import("effect/Brand").Brand<"YouTubeChannelId">;
} & {
    readonly title: string;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt: string;
} & {
    readonly customUrl?: string | undefined;
} & {
    readonly country?: string | undefined;
} & {
    readonly subscriberCount?: number | undefined;
}, {}, {}>;
/** Clean domain representation of a YouTube channel resource. */
export declare class YouTubeChannel extends YouTubeChannel_base {
}
declare const YouTubeVideoResource_base: Schema.Class<YouTubeVideoResource, {
    type: Schema.Literal<["youtube"]>;
    id: Schema.brand<typeof Schema.String, "MediaResourceId">;
    metadata: Schema.Struct<{
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
    data: typeof YouTubeVideo;
}, Schema.Struct.Encoded<{
    type: Schema.Literal<["youtube"]>;
    id: Schema.brand<typeof Schema.String, "MediaResourceId">;
    metadata: Schema.Struct<{
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
    data: typeof YouTubeVideo;
}>, never, {
    readonly id: string & import("effect/Brand").Brand<"MediaResourceId">;
} & {
    readonly metadata: {
        readonly jobId: string & import("effect/Brand").Brand<"JobId">;
        readonly createdAt: Date;
        readonly mediaResourceId: string & import("effect/Brand").Brand<"MediaResourceId">;
        readonly title: string;
        readonly summary?: string | undefined;
        readonly tags: readonly string[];
        readonly domain: readonly string[];
        readonly speakers: readonly {
            readonly id: string;
            readonly role: "host" | "guest";
            readonly name?: string | undefined;
            readonly affiliation?: {
                readonly name: string;
                readonly url?: string | undefined;
            } | undefined;
            readonly bio?: string | undefined;
        }[];
        readonly language: string & import("effect/Brand").Brand<"LanguageCode">;
        readonly durationSec: number;
        readonly links?: string | undefined;
    };
} & {
    readonly data: YouTubeVideo;
} & {
    readonly type: "youtube";
}, {}, {}>;
export declare class YouTubeVideoResource extends YouTubeVideoResource_base {
}
declare const YouTubeChannelResource_base: Schema.Class<YouTubeChannelResource, {
    type: Schema.Literal<["youtube-channel"]>;
    id: Schema.brand<typeof Schema.String, "MediaResourceId">;
    metadata: Schema.Struct<{
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
    data: typeof YouTubeChannel;
}, Schema.Struct.Encoded<{
    type: Schema.Literal<["youtube-channel"]>;
    id: Schema.brand<typeof Schema.String, "MediaResourceId">;
    metadata: Schema.Struct<{
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
    data: typeof YouTubeChannel;
}>, never, {
    readonly id: string & import("effect/Brand").Brand<"MediaResourceId">;
} & {
    readonly metadata: {
        readonly jobId: string & import("effect/Brand").Brand<"JobId">;
        readonly createdAt: Date;
        readonly mediaResourceId: string & import("effect/Brand").Brand<"MediaResourceId">;
        readonly title: string;
        readonly summary?: string | undefined;
        readonly tags: readonly string[];
        readonly domain: readonly string[];
        readonly speakers: readonly {
            readonly id: string;
            readonly role: "host" | "guest";
            readonly name?: string | undefined;
            readonly affiliation?: {
                readonly name: string;
                readonly url?: string | undefined;
            } | undefined;
            readonly bio?: string | undefined;
        }[];
        readonly language: string & import("effect/Brand").Brand<"LanguageCode">;
        readonly durationSec: number;
        readonly links?: string | undefined;
    };
} & {
    readonly data: YouTubeChannel;
} & {
    readonly type: "youtube-channel";
}, {}, {}>;
export declare class YouTubeChannelResource extends YouTubeChannelResource_base {
}
/** MediaResource as discriminated union with clean {type, data} structure. */
export declare const MediaResource: Schema.Union<[typeof YouTubeVideoResource, typeof YouTubeChannelResource]>;
export type MediaResource = YouTubeVideoResource | YouTubeChannelResource;
export {};

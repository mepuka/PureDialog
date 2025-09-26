import type * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import type { ParseError } from "effect/ParseResult";
import * as S from "effect/Schema";
declare const YoutubeAbuseReportsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeAbuseReportsInsertParams extends YoutubeAbuseReportsInsertParams_base {
}
declare const AbuseType_base: S.Class<AbuseType, {
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
}, {}, {}>;
export declare class AbuseType extends AbuseType_base {
}
declare const Entity_base: S.Class<Entity, {
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    typeId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    url: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    typeId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    url: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly url?: string | undefined;
} & {
    readonly typeId?: string | undefined;
}, {}, {}>;
export declare class Entity extends Entity_base {
}
declare const RelatedEntity_base: S.Class<RelatedEntity, {
    entity: S.optionalWith<typeof Entity, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    entity: S.optionalWith<typeof Entity, {
        nullable: true;
    }>;
}>, never, {
    readonly entity?: Entity | undefined;
}, {}, {}>;
export declare class RelatedEntity extends RelatedEntity_base {
}
declare const AbuseReport_base: S.Class<AbuseReport, {
    abuseTypes: S.optionalWith<S.Array$<typeof AbuseType>, {
        nullable: true;
    }>;
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    relatedEntities: S.optionalWith<S.Array$<typeof RelatedEntity>, {
        nullable: true;
    }>;
    subject: S.optionalWith<typeof Entity, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    abuseTypes: S.optionalWith<S.Array$<typeof AbuseType>, {
        nullable: true;
    }>;
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    relatedEntities: S.optionalWith<S.Array$<typeof RelatedEntity>, {
        nullable: true;
    }>;
    subject: S.optionalWith<typeof Entity, {
        nullable: true;
    }>;
}>, never, {
    readonly description?: string | undefined;
} & {
    readonly abuseTypes?: readonly AbuseType[] | undefined;
} & {
    readonly relatedEntities?: readonly RelatedEntity[] | undefined;
} & {
    readonly subject?: Entity | undefined;
}, {}, {}>;
export declare class AbuseReport extends AbuseReport_base {
}
declare const YoutubeActivitiesListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    home: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    mine: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    publishedAfter: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    publishedBefore: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    regionCode: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeActivitiesListParams extends YoutubeActivitiesListParams_base {
}
declare const ResourceId_base: S.Class<ResourceId, {
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a channel. This property is only present if the resourceId.kind value is youtube#channel.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of the API resource.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a playlist. This property is only present if the resourceId.kind value is youtube#playlist.
     */
    playlistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a video. This property is only present if the resourceId.kind value is youtube#video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a channel. This property is only present if the resourceId.kind value is youtube#channel.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of the API resource.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a playlist. This property is only present if the resourceId.kind value is youtube#playlist.
     */
    playlistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a video. This property is only present if the resourceId.kind value is youtube#video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly channelId?: string | undefined;
} & {
    readonly kind?: string | undefined;
} & {
    readonly playlistId?: string | undefined;
} & {
    readonly videoId?: string | undefined;
}, {}, {}>;
/**
 * A resource id is a generic reference that points to another YouTube resource.
 */
export declare class ResourceId extends ResourceId_base {
}
declare const ActivityContentDetailsBulletin_base: S.Class<ActivityContentDetailsBulletin, {
    /**
     * The resourceId object contains information that identifies the resource associated with a bulletin post. @mutable youtube.activities.insert
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The resourceId object contains information that identifies the resource associated with a bulletin post. @mutable youtube.activities.insert
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}>, never, {
    readonly resourceId?: ResourceId | undefined;
}, {}, {}>;
/**
 * Details about a channel bulletin post.
 */
export declare class ActivityContentDetailsBulletin extends ActivityContentDetailsBulletin_base {
}
declare const ActivityContentDetailsChannelItem_base: S.Class<ActivityContentDetailsChannelItem, {
    /**
     * The resourceId object contains information that identifies the resource that was added to the channel.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The resourceId object contains information that identifies the resource that was added to the channel.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}>, never, {
    readonly resourceId?: ResourceId | undefined;
}, {}, {}>;
/**
 * Details about a resource which was added to a channel.
 */
export declare class ActivityContentDetailsChannelItem extends ActivityContentDetailsChannelItem_base {
}
declare const ActivityContentDetailsComment_base: S.Class<ActivityContentDetailsComment, {
    /**
     * The resourceId object contains information that identifies the resource associated with the comment.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The resourceId object contains information that identifies the resource associated with the comment.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}>, never, {
    readonly resourceId?: ResourceId | undefined;
}, {}, {}>;
/**
 * Information about a resource that received a comment.
 */
export declare class ActivityContentDetailsComment extends ActivityContentDetailsComment_base {
}
declare const ActivityContentDetailsFavorite_base: S.Class<ActivityContentDetailsFavorite, {
    /**
     * The resourceId object contains information that identifies the resource that was marked as a favorite.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The resourceId object contains information that identifies the resource that was marked as a favorite.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}>, never, {
    readonly resourceId?: ResourceId | undefined;
}, {}, {}>;
/**
 * Information about a video that was marked as a favorite video.
 */
export declare class ActivityContentDetailsFavorite extends ActivityContentDetailsFavorite_base {
}
declare const ActivityContentDetailsLike_base: S.Class<ActivityContentDetailsLike, {
    /**
     * The resourceId object contains information that identifies the rated resource.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The resourceId object contains information that identifies the rated resource.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}>, never, {
    readonly resourceId?: ResourceId | undefined;
}, {}, {}>;
/**
 * Information about a resource that received a positive (like) rating.
 */
export declare class ActivityContentDetailsLike extends ActivityContentDetailsLike_base {
}
declare const ActivityContentDetailsPlaylistItem_base: S.Class<ActivityContentDetailsPlaylistItem, {
    /**
     * The value that YouTube uses to uniquely identify the playlist.
     */
    playlistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * ID of the item within the playlist.
     */
    playlistItemId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The resourceId object contains information about the resource that was added to the playlist.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The value that YouTube uses to uniquely identify the playlist.
     */
    playlistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * ID of the item within the playlist.
     */
    playlistItemId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The resourceId object contains information about the resource that was added to the playlist.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}>, never, {
    readonly playlistId?: string | undefined;
} & {
    readonly resourceId?: ResourceId | undefined;
} & {
    readonly playlistItemId?: string | undefined;
}, {}, {}>;
/**
 * Information about a new playlist item.
 */
export declare class ActivityContentDetailsPlaylistItem extends ActivityContentDetailsPlaylistItem_base {
}
declare const ActivityContentDetailsPromotedItemCtaType_base: S.Literal<["ctaTypeUnspecified", "visitAdvertiserSite"]>;
/**
 * The type of call-to-action, a message to the user indicating action that can be taken.
 */
export declare class ActivityContentDetailsPromotedItemCtaType extends ActivityContentDetailsPromotedItemCtaType_base {
}
declare const ActivityContentDetailsPromotedItem_base: S.Class<ActivityContentDetailsPromotedItem, {
    /**
     * The URL the client should fetch to request a promoted item.
     */
    adTag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL the client should ping to indicate that the user clicked through on this promoted item.
     */
    clickTrackingUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL the client should ping to indicate that the user was shown this promoted item.
     */
    creativeViewUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of call-to-action, a message to the user indicating action that can be taken.
     */
    ctaType: S.optionalWith<typeof ActivityContentDetailsPromotedItemCtaType, {
        nullable: true;
    }>;
    /**
     * The custom call-to-action button text. If specified, it will override the default button text for the cta_type.
     */
    customCtaButtonText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The text description to accompany the promoted item.
     */
    descriptionText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL the client should direct the user to, if the user chooses to visit the advertiser's website.
     */
    destinationUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The list of forecasting URLs. The client should ping all of these URLs when a promoted item is not available, to indicate that a promoted item could have been shown.
     */
    forecastingUrl: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The list of impression URLs. The client should ping all of these URLs to indicate that the user was shown this promoted item.
     */
    impressionUrl: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the promoted video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The URL the client should fetch to request a promoted item.
     */
    adTag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL the client should ping to indicate that the user clicked through on this promoted item.
     */
    clickTrackingUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL the client should ping to indicate that the user was shown this promoted item.
     */
    creativeViewUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of call-to-action, a message to the user indicating action that can be taken.
     */
    ctaType: S.optionalWith<typeof ActivityContentDetailsPromotedItemCtaType, {
        nullable: true;
    }>;
    /**
     * The custom call-to-action button text. If specified, it will override the default button text for the cta_type.
     */
    customCtaButtonText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The text description to accompany the promoted item.
     */
    descriptionText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL the client should direct the user to, if the user chooses to visit the advertiser's website.
     */
    destinationUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The list of forecasting URLs. The client should ping all of these URLs when a promoted item is not available, to indicate that a promoted item could have been shown.
     */
    forecastingUrl: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The list of impression URLs. The client should ping all of these URLs to indicate that the user was shown this promoted item.
     */
    impressionUrl: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the promoted video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly videoId?: string | undefined;
} & {
    readonly adTag?: string | undefined;
} & {
    readonly clickTrackingUrl?: string | undefined;
} & {
    readonly creativeViewUrl?: string | undefined;
} & {
    readonly ctaType?: "ctaTypeUnspecified" | "visitAdvertiserSite" | undefined;
} & {
    readonly customCtaButtonText?: string | undefined;
} & {
    readonly descriptionText?: string | undefined;
} & {
    readonly destinationUrl?: string | undefined;
} & {
    readonly forecastingUrl?: readonly string[] | undefined;
} & {
    readonly impressionUrl?: readonly string[] | undefined;
}, {}, {}>;
/**
 * Details about a resource which is being promoted.
 */
export declare class ActivityContentDetailsPromotedItem extends ActivityContentDetailsPromotedItem_base {
}
declare const ActivityContentDetailsRecommendationReason_base: S.Literal<["reasonUnspecified", "videoFavorited", "videoLiked", "videoWatched"]>;
/**
 * The reason that the resource is recommended to the user.
 */
export declare class ActivityContentDetailsRecommendationReason extends ActivityContentDetailsRecommendationReason_base {
}
declare const ActivityContentDetailsRecommendation_base: S.Class<ActivityContentDetailsRecommendation, {
    /**
     * The reason that the resource is recommended to the user.
     */
    reason: S.optionalWith<typeof ActivityContentDetailsRecommendationReason, {
        nullable: true;
    }>;
    /**
     * The resourceId object contains information that identifies the recommended resource.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * The seedResourceId object contains information about the resource that caused the recommendation.
     */
    seedResourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The reason that the resource is recommended to the user.
     */
    reason: S.optionalWith<typeof ActivityContentDetailsRecommendationReason, {
        nullable: true;
    }>;
    /**
     * The resourceId object contains information that identifies the recommended resource.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * The seedResourceId object contains information about the resource that caused the recommendation.
     */
    seedResourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}>, never, {
    readonly resourceId?: ResourceId | undefined;
} & {
    readonly reason?: "reasonUnspecified" | "videoFavorited" | "videoLiked" | "videoWatched" | undefined;
} & {
    readonly seedResourceId?: ResourceId | undefined;
}, {}, {}>;
/**
 * Information that identifies the recommended resource.
 */
export declare class ActivityContentDetailsRecommendation extends ActivityContentDetailsRecommendation_base {
}
declare const ActivityContentDetailsSocialType_base: S.Literal<["unspecified", "googlePlus", "facebook", "twitter"]>;
/**
 * The name of the social network.
 */
export declare class ActivityContentDetailsSocialType extends ActivityContentDetailsSocialType_base {
}
declare const ActivityContentDetailsSocial_base: S.Class<ActivityContentDetailsSocial, {
    /**
     * The author of the social network post.
     */
    author: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An image of the post's author.
     */
    imageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL of the social network post.
     */
    referenceUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The resourceId object encapsulates information that identifies the resource associated with a social network post.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * The name of the social network.
     */
    type: S.optionalWith<typeof ActivityContentDetailsSocialType, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The author of the social network post.
     */
    author: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An image of the post's author.
     */
    imageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL of the social network post.
     */
    referenceUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The resourceId object encapsulates information that identifies the resource associated with a social network post.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * The name of the social network.
     */
    type: S.optionalWith<typeof ActivityContentDetailsSocialType, {
        nullable: true;
    }>;
}>, never, {
    readonly type?: "unspecified" | "googlePlus" | "facebook" | "twitter" | undefined;
} & {
    readonly resourceId?: ResourceId | undefined;
} & {
    readonly author?: string | undefined;
} & {
    readonly imageUrl?: string | undefined;
} & {
    readonly referenceUrl?: string | undefined;
}, {}, {}>;
/**
 * Details about a social network post.
 */
export declare class ActivityContentDetailsSocial extends ActivityContentDetailsSocial_base {
}
declare const ActivityContentDetailsSubscription_base: S.Class<ActivityContentDetailsSubscription, {
    /**
     * The resourceId object contains information that identifies the resource that the user subscribed to.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The resourceId object contains information that identifies the resource that the user subscribed to.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
}>, never, {
    readonly resourceId?: ResourceId | undefined;
}, {}, {}>;
/**
 * Information about a channel that a user subscribed to.
 */
export declare class ActivityContentDetailsSubscription extends ActivityContentDetailsSubscription_base {
}
declare const ActivityContentDetailsUpload_base: S.Class<ActivityContentDetailsUpload, {
    /**
     * The ID that YouTube uses to uniquely identify the uploaded video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID that YouTube uses to uniquely identify the uploaded video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly videoId?: string | undefined;
}, {}, {}>;
/**
 * Information about the uploaded video.
 */
export declare class ActivityContentDetailsUpload extends ActivityContentDetailsUpload_base {
}
declare const ActivityContentDetails_base: S.Class<ActivityContentDetails, {
    /**
     * The bulletin object contains details about a channel bulletin post. This object is only present if the snippet.type is bulletin.
     */
    bulletin: S.optionalWith<typeof ActivityContentDetailsBulletin, {
        nullable: true;
    }>;
    /**
     * The channelItem object contains details about a resource which was added to a channel. This property is only present if the snippet.type is channelItem.
     */
    channelItem: S.optionalWith<typeof ActivityContentDetailsChannelItem, {
        nullable: true;
    }>;
    /**
     * The comment object contains information about a resource that received a comment. This property is only present if the snippet.type is comment.
     */
    comment: S.optionalWith<typeof ActivityContentDetailsComment, {
        nullable: true;
    }>;
    /**
     * The favorite object contains information about a video that was marked as a favorite video. This property is only present if the snippet.type is favorite.
     */
    favorite: S.optionalWith<typeof ActivityContentDetailsFavorite, {
        nullable: true;
    }>;
    /**
     * The like object contains information about a resource that received a positive (like) rating. This property is only present if the snippet.type is like.
     */
    like: S.optionalWith<typeof ActivityContentDetailsLike, {
        nullable: true;
    }>;
    /**
     * The playlistItem object contains information about a new playlist item. This property is only present if the snippet.type is playlistItem.
     */
    playlistItem: S.optionalWith<typeof ActivityContentDetailsPlaylistItem, {
        nullable: true;
    }>;
    /**
     * The promotedItem object contains details about a resource which is being promoted. This property is only present if the snippet.type is promotedItem.
     */
    promotedItem: S.optionalWith<typeof ActivityContentDetailsPromotedItem, {
        nullable: true;
    }>;
    /**
     * The recommendation object contains information about a recommended resource. This property is only present if the snippet.type is recommendation.
     */
    recommendation: S.optionalWith<typeof ActivityContentDetailsRecommendation, {
        nullable: true;
    }>;
    /**
     * The social object contains details about a social network post. This property is only present if the snippet.type is social.
     */
    social: S.optionalWith<typeof ActivityContentDetailsSocial, {
        nullable: true;
    }>;
    /**
     * The subscription object contains information about a channel that a user subscribed to. This property is only present if the snippet.type is subscription.
     */
    subscription: S.optionalWith<typeof ActivityContentDetailsSubscription, {
        nullable: true;
    }>;
    /**
     * The upload object contains information about the uploaded video. This property is only present if the snippet.type is upload.
     */
    upload: S.optionalWith<typeof ActivityContentDetailsUpload, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The bulletin object contains details about a channel bulletin post. This object is only present if the snippet.type is bulletin.
     */
    bulletin: S.optionalWith<typeof ActivityContentDetailsBulletin, {
        nullable: true;
    }>;
    /**
     * The channelItem object contains details about a resource which was added to a channel. This property is only present if the snippet.type is channelItem.
     */
    channelItem: S.optionalWith<typeof ActivityContentDetailsChannelItem, {
        nullable: true;
    }>;
    /**
     * The comment object contains information about a resource that received a comment. This property is only present if the snippet.type is comment.
     */
    comment: S.optionalWith<typeof ActivityContentDetailsComment, {
        nullable: true;
    }>;
    /**
     * The favorite object contains information about a video that was marked as a favorite video. This property is only present if the snippet.type is favorite.
     */
    favorite: S.optionalWith<typeof ActivityContentDetailsFavorite, {
        nullable: true;
    }>;
    /**
     * The like object contains information about a resource that received a positive (like) rating. This property is only present if the snippet.type is like.
     */
    like: S.optionalWith<typeof ActivityContentDetailsLike, {
        nullable: true;
    }>;
    /**
     * The playlistItem object contains information about a new playlist item. This property is only present if the snippet.type is playlistItem.
     */
    playlistItem: S.optionalWith<typeof ActivityContentDetailsPlaylistItem, {
        nullable: true;
    }>;
    /**
     * The promotedItem object contains details about a resource which is being promoted. This property is only present if the snippet.type is promotedItem.
     */
    promotedItem: S.optionalWith<typeof ActivityContentDetailsPromotedItem, {
        nullable: true;
    }>;
    /**
     * The recommendation object contains information about a recommended resource. This property is only present if the snippet.type is recommendation.
     */
    recommendation: S.optionalWith<typeof ActivityContentDetailsRecommendation, {
        nullable: true;
    }>;
    /**
     * The social object contains details about a social network post. This property is only present if the snippet.type is social.
     */
    social: S.optionalWith<typeof ActivityContentDetailsSocial, {
        nullable: true;
    }>;
    /**
     * The subscription object contains information about a channel that a user subscribed to. This property is only present if the snippet.type is subscription.
     */
    subscription: S.optionalWith<typeof ActivityContentDetailsSubscription, {
        nullable: true;
    }>;
    /**
     * The upload object contains information about the uploaded video. This property is only present if the snippet.type is upload.
     */
    upload: S.optionalWith<typeof ActivityContentDetailsUpload, {
        nullable: true;
    }>;
}>, never, {
    readonly bulletin?: ActivityContentDetailsBulletin | undefined;
} & {
    readonly channelItem?: ActivityContentDetailsChannelItem | undefined;
} & {
    readonly comment?: ActivityContentDetailsComment | undefined;
} & {
    readonly favorite?: ActivityContentDetailsFavorite | undefined;
} & {
    readonly like?: ActivityContentDetailsLike | undefined;
} & {
    readonly playlistItem?: ActivityContentDetailsPlaylistItem | undefined;
} & {
    readonly promotedItem?: ActivityContentDetailsPromotedItem | undefined;
} & {
    readonly recommendation?: ActivityContentDetailsRecommendation | undefined;
} & {
    readonly social?: ActivityContentDetailsSocial | undefined;
} & {
    readonly subscription?: ActivityContentDetailsSubscription | undefined;
} & {
    readonly upload?: ActivityContentDetailsUpload | undefined;
}, {}, {}>;
/**
 * Details about the content of an activity: the video that was shared, the channel that was subscribed to, etc.
 */
export declare class ActivityContentDetails extends ActivityContentDetails_base {
}
declare const Thumbnail_base: S.Class<Thumbnail, {
    /**
     * (Optional) Height of the thumbnail image.
     */
    height: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The thumbnail image's URL.
     */
    url: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * (Optional) Width of the thumbnail image.
     */
    width: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * (Optional) Height of the thumbnail image.
     */
    height: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The thumbnail image's URL.
     */
    url: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * (Optional) Width of the thumbnail image.
     */
    width: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}>, never, {
    readonly url?: string | undefined;
} & {
    readonly width?: number | undefined;
} & {
    readonly height?: number | undefined;
}, {}, {}>;
/**
 * A thumbnail is an image representing a YouTube resource.
 */
export declare class Thumbnail extends Thumbnail_base {
}
declare const ThumbnailDetails_base: S.Class<ThumbnailDetails, {
    /**
     * The high quality image for this resource.
     */
    high: S.optionalWith<typeof Thumbnail, {
        nullable: true;
    }>;
    /**
     * The maximum resolution quality image for this resource.
     */
    maxres: S.optionalWith<typeof Thumbnail, {
        nullable: true;
    }>;
    /**
     * The medium quality image for this resource.
     */
    medium: S.optionalWith<typeof Thumbnail, {
        nullable: true;
    }>;
    /**
     * The standard quality image for this resource.
     */
    standard: S.optionalWith<typeof Thumbnail, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The high quality image for this resource.
     */
    high: S.optionalWith<typeof Thumbnail, {
        nullable: true;
    }>;
    /**
     * The maximum resolution quality image for this resource.
     */
    maxres: S.optionalWith<typeof Thumbnail, {
        nullable: true;
    }>;
    /**
     * The medium quality image for this resource.
     */
    medium: S.optionalWith<typeof Thumbnail, {
        nullable: true;
    }>;
    /**
     * The standard quality image for this resource.
     */
    standard: S.optionalWith<typeof Thumbnail, {
        nullable: true;
    }>;
}>, never, {
    readonly medium?: Thumbnail | undefined;
} & {
    readonly high?: Thumbnail | undefined;
} & {
    readonly standard?: Thumbnail | undefined;
} & {
    readonly maxres?: Thumbnail | undefined;
}, {}, {}>;
/**
 * Internal representation of thumbnails for a YouTube resource.
 */
export declare class ThumbnailDetails extends ThumbnailDetails_base {
}
declare const ActivitySnippetType_base: S.Literal<["typeUnspecified", "upload", "like", "favorite", "comment", "subscription", "playlistItem", "recommendation", "bulletin", "social", "channelItem", "promotedItem"]>;
/**
 * The type of activity that the resource describes.
 */
export declare class ActivitySnippetType extends ActivitySnippetType_base {
}
declare const ActivitySnippet_base: S.Class<ActivitySnippet, {
    /**
     * The ID that YouTube uses to uniquely identify the channel associated with the activity.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel responsible for this activity
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The description of the resource primarily associated with the activity. @mutable youtube.activities.insert
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The group ID associated with the activity. A group ID identifies user events that are associated with the same user and resource. For example, if a user rates a video and marks the same video as a favorite, the entries for those events would have the same group ID in the user's activity feed. In your user interface, you can avoid repetition by grouping events with the same groupId value.
     */
    groupId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the video was uploaded.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the resource that is primarily associated with the activity. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The title of the resource primarily associated with the activity.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of activity that the resource describes.
     */
    type: S.optionalWith<typeof ActivitySnippetType, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID that YouTube uses to uniquely identify the channel associated with the activity.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel responsible for this activity
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The description of the resource primarily associated with the activity. @mutable youtube.activities.insert
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The group ID associated with the activity. A group ID identifies user events that are associated with the same user and resource. For example, if a user rates a video and marks the same video as a favorite, the entries for those events would have the same group ID in the user's activity feed. In your user interface, you can avoid repetition by grouping events with the same groupId value.
     */
    groupId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the video was uploaded.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the resource that is primarily associated with the activity. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The title of the resource primarily associated with the activity.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of activity that the resource describes.
     */
    type: S.optionalWith<typeof ActivitySnippetType, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly channelTitle?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
} & {
    readonly type?: "bulletin" | "channelItem" | "comment" | "favorite" | "like" | "playlistItem" | "promotedItem" | "recommendation" | "social" | "subscription" | "upload" | "typeUnspecified" | undefined;
} & {
    readonly groupId?: string | undefined;
}, {}, {}>;
/**
 * Basic details about an activity, including title, description, thumbnails, activity type and group. Next ID: 12
 */
export declare class ActivitySnippet extends ActivitySnippet_base {
}
declare const Activity_base: S.Class<Activity, {
    /**
     * The contentDetails object contains information about the content associated with the activity. For example, if the snippet.type value is videoRated, then the contentDetails object's content identifies the rated video.
     */
    contentDetails: S.optionalWith<typeof ActivityContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the activity.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#activity".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#activity";
    }>;
    /**
     * The snippet object contains basic details about the activity, including the activity's type and group ID.
     */
    snippet: S.optionalWith<typeof ActivitySnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The contentDetails object contains information about the content associated with the activity. For example, if the snippet.type value is videoRated, then the contentDetails object's content identifies the rated video.
     */
    contentDetails: S.optionalWith<typeof ActivityContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the activity.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#activity".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#activity";
    }>;
    /**
     * The snippet object contains basic details about the activity, including the activity's type and group ID.
     */
    snippet: S.optionalWith<typeof ActivitySnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: ActivityContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: ActivitySnippet | undefined;
}, {}, {}>;
/**
 * An *activity* resource contains information about an action that a particular channel, or user, has taken on YouTube.The actions reported in activity feeds include rating a video, sharing a video, marking a video as a favorite, commenting on a video, uploading a video, and so forth. Each activity resource identifies the type of action, the channel associated with the action, and the resource(s) associated with the action, such as the video that was rated or uploaded.
 */
export declare class Activity extends Activity_base {
}
declare const PageInfo_base: S.Class<PageInfo, {
    /**
     * The number of results included in the API response.
     */
    resultsPerPage: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The total number of results in the result set.
     */
    totalResults: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The number of results included in the API response.
     */
    resultsPerPage: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The total number of results in the result set.
     */
    totalResults: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}>, never, {
    readonly resultsPerPage?: number | undefined;
} & {
    readonly totalResults?: number | undefined;
}, {}, {}>;
/**
 * Paging details for lists of resources, including total number of items available and number of resources returned in a single page.
 */
export declare class PageInfo extends PageInfo_base {
}
declare const TokenPagination_base: S.Class<TokenPagination, {}, S.Struct.Encoded<{}>, never, unknown, {}, {}>;
/**
 * Stub token pagination template to suppress results.
 */
export declare class TokenPagination extends TokenPagination_base {
}
declare const ActivityListResponse_base: S.Class<ActivityListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof Activity>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#activityListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#activityListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof Activity>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#activityListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#activityListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly Activity[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class ActivityListResponse extends ActivityListResponse_base {
}
declare const YoutubeCaptionsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    videoId: typeof S.String;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    onBehalfOf: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeCaptionsListParams extends YoutubeCaptionsListParams_base {
}
declare const CaptionSnippetAudioTrackType_base: S.Literal<["unknown", "primary", "commentary", "descriptive"]>;
/**
 * The type of audio track associated with the caption track.
 */
export declare class CaptionSnippetAudioTrackType extends CaptionSnippetAudioTrackType_base {
}
declare const CaptionSnippetFailureReason_base: S.Literal<["unknownFormat", "unsupportedFormat", "processingFailed"]>;
/**
 * The reason that YouTube failed to process the caption track. This property is only present if the state property's value is failed.
 */
export declare class CaptionSnippetFailureReason extends CaptionSnippetFailureReason_base {
}
declare const CaptionSnippetStatus_base: S.Literal<["serving", "syncing", "failed"]>;
/**
 * The caption track's status.
 */
export declare class CaptionSnippetStatus extends CaptionSnippetStatus_base {
}
declare const CaptionSnippetTrackKind_base: S.Literal<["standard", "ASR", "forced"]>;
/**
 * The caption track's type.
 */
export declare class CaptionSnippetTrackKind extends CaptionSnippetTrackKind_base {
}
declare const CaptionSnippet_base: S.Class<CaptionSnippet, {
    /**
     * The type of audio track associated with the caption track.
     */
    audioTrackType: S.optionalWith<typeof CaptionSnippetAudioTrackType, {
        nullable: true;
    }>;
    /**
     * The reason that YouTube failed to process the caption track. This property is only present if the state property's value is failed.
     */
    failureReason: S.optionalWith<typeof CaptionSnippetFailureReason, {
        nullable: true;
    }>;
    /**
     * Indicates whether YouTube synchronized the caption track to the audio track in the video. The value will be true if a sync was explicitly requested when the caption track was uploaded. For example, when calling the captions.insert or captions.update methods, you can set the sync parameter to true to instruct YouTube to sync the uploaded track to the video. If the value is false, YouTube uses the time codes in the uploaded caption track to determine when to display captions.
     */
    isAutoSynced: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether the track contains closed captions for the deaf and hard of hearing. The default value is false.
     */
    isCC: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether the caption track is a draft. If the value is true, then the track is not publicly visible. The default value is false. @mutable youtube.captions.insert youtube.captions.update
     */
    isDraft: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether caption track is formatted for "easy reader," meaning it is at a third-grade level for language learners. The default value is false.
     */
    isEasyReader: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether the caption track uses large text for the vision-impaired. The default value is false.
     */
    isLarge: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The language of the caption track. The property value is a BCP-47 language tag.
     */
    language: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the caption track was last updated.
     */
    lastUpdated: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The name of the caption track. The name is intended to be visible to the user as an option during playback.
     */
    name: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The caption track's status.
     */
    status: S.optionalWith<typeof CaptionSnippetStatus, {
        nullable: true;
    }>;
    /**
     * The caption track's type.
     */
    trackKind: S.optionalWith<typeof CaptionSnippetTrackKind, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video associated with the caption track. @mutable youtube.captions.insert
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The type of audio track associated with the caption track.
     */
    audioTrackType: S.optionalWith<typeof CaptionSnippetAudioTrackType, {
        nullable: true;
    }>;
    /**
     * The reason that YouTube failed to process the caption track. This property is only present if the state property's value is failed.
     */
    failureReason: S.optionalWith<typeof CaptionSnippetFailureReason, {
        nullable: true;
    }>;
    /**
     * Indicates whether YouTube synchronized the caption track to the audio track in the video. The value will be true if a sync was explicitly requested when the caption track was uploaded. For example, when calling the captions.insert or captions.update methods, you can set the sync parameter to true to instruct YouTube to sync the uploaded track to the video. If the value is false, YouTube uses the time codes in the uploaded caption track to determine when to display captions.
     */
    isAutoSynced: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether the track contains closed captions for the deaf and hard of hearing. The default value is false.
     */
    isCC: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether the caption track is a draft. If the value is true, then the track is not publicly visible. The default value is false. @mutable youtube.captions.insert youtube.captions.update
     */
    isDraft: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether caption track is formatted for "easy reader," meaning it is at a third-grade level for language learners. The default value is false.
     */
    isEasyReader: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether the caption track uses large text for the vision-impaired. The default value is false.
     */
    isLarge: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The language of the caption track. The property value is a BCP-47 language tag.
     */
    language: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the caption track was last updated.
     */
    lastUpdated: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The name of the caption track. The name is intended to be visible to the user as an option during playback.
     */
    name: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The caption track's status.
     */
    status: S.optionalWith<typeof CaptionSnippetStatus, {
        nullable: true;
    }>;
    /**
     * The caption track's type.
     */
    trackKind: S.optionalWith<typeof CaptionSnippetTrackKind, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video associated with the caption track. @mutable youtube.captions.insert
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly name?: string | undefined;
} & {
    readonly videoId?: string | undefined;
} & {
    readonly audioTrackType?: "unknown" | "primary" | "commentary" | "descriptive" | undefined;
} & {
    readonly failureReason?: "unknownFormat" | "unsupportedFormat" | "processingFailed" | undefined;
} & {
    readonly isAutoSynced?: boolean | undefined;
} & {
    readonly isCC?: boolean | undefined;
} & {
    readonly isDraft?: boolean | undefined;
} & {
    readonly isEasyReader?: boolean | undefined;
} & {
    readonly isLarge?: boolean | undefined;
} & {
    readonly language?: string | undefined;
} & {
    readonly lastUpdated?: string | undefined;
} & {
    readonly status?: "serving" | "syncing" | "failed" | undefined;
} & {
    readonly trackKind?: "standard" | "ASR" | "forced" | undefined;
}, {}, {}>;
/**
 * Basic details about a caption track, such as its language and name.
 */
export declare class CaptionSnippet extends CaptionSnippet_base {
}
declare const Caption_base: S.Class<Caption, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the caption track.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#caption".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#caption";
    }>;
    /**
     * The snippet object contains basic details about the caption.
     */
    snippet: S.optionalWith<typeof CaptionSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the caption track.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#caption".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#caption";
    }>;
    /**
     * The snippet object contains basic details about the caption.
     */
    snippet: S.optionalWith<typeof CaptionSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: CaptionSnippet | undefined;
}, {}, {}>;
/**
 * A *caption* resource represents a YouTube caption track. A caption track is associated with exactly one YouTube video.
 */
export declare class Caption extends Caption_base {
}
declare const CaptionListResponse_base: S.Class<CaptionListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of captions that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof Caption>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#captionListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#captionListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of captions that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof Caption>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#captionListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#captionListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly Caption[] | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class CaptionListResponse extends CaptionListResponse_base {
}
declare const YoutubeCaptionsUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOf: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    sync: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>;
export declare class YoutubeCaptionsUpdateParams extends YoutubeCaptionsUpdateParams_base {
}
declare const YoutubeCaptionsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOf: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    sync: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>;
export declare class YoutubeCaptionsInsertParams extends YoutubeCaptionsInsertParams_base {
}
declare const YoutubeCaptionsDeleteParams_base: S.Struct<{
    id: typeof S.String;
    onBehalfOf: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeCaptionsDeleteParams extends YoutubeCaptionsDeleteParams_base {
}
declare const YoutubeCaptionsDownloadParams_base: S.Struct<{
    onBehalfOf: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tfmt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tlang: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeCaptionsDownloadParams extends YoutubeCaptionsDownloadParams_base {
}
declare const YoutubeChannelBannersInsertParams_base: S.Struct<{
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeChannelBannersInsertParams extends YoutubeChannelBannersInsertParams_base {
}
declare const ChannelBannerResource_base: S.Class<ChannelBannerResource, {
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelBannerResource".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channelBannerResource";
    }>;
    /**
     * The URL of this banner image.
     */
    url: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelBannerResource".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channelBannerResource";
    }>;
    /**
     * The URL of this banner image.
     */
    url: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly url?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
}, {}, {}>;
/**
 * A channel banner returned as the response to a channel_banner.insert call.
 */
export declare class ChannelBannerResource extends ChannelBannerResource_base {
}
declare const YoutubeChannelSectionsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    mine: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeChannelSectionsListParams extends YoutubeChannelSectionsListParams_base {
}
declare const ChannelSectionContentDetails_base: S.Class<ChannelSectionContentDetails, {
    /**
     * The channel ids for type multiple_channels.
     */
    channels: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The playlist ids for type single_playlist and multiple_playlists. For singlePlaylist, only one playlistId is allowed.
     */
    playlists: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The channel ids for type multiple_channels.
     */
    channels: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The playlist ids for type single_playlist and multiple_playlists. For singlePlaylist, only one playlistId is allowed.
     */
    playlists: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>, never, {
    readonly channels?: readonly string[] | undefined;
} & {
    readonly playlists?: readonly string[] | undefined;
}, {}, {}>;
/**
 * Details about a channelsection, including playlists and channels.
 */
export declare class ChannelSectionContentDetails extends ChannelSectionContentDetails_base {
}
declare const ChannelSectionLocalization_base: S.Class<ChannelSectionLocalization, {
    /**
     * The localized strings for channel section's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The localized strings for channel section's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
}, {}, {}>;
/**
 * ChannelSection localization setting
 */
export declare class ChannelSectionLocalization extends ChannelSectionLocalization_base {
}
declare const ChannelSectionSnippetStyle_base: S.Literal<["channelsectionStyleUnspecified", "horizontalRow", "verticalList"]>;
/**
 * The style of the channel section.
 */
export declare class ChannelSectionSnippetStyle extends ChannelSectionSnippetStyle_base {
}
declare const ChannelSectionSnippetType_base: S.Literal<["channelsectionTypeUndefined", "singlePlaylist", "multiplePlaylists", "popularUploads", "recentUploads", "likes", "allPlaylists", "likedPlaylists", "recentPosts", "recentActivity", "liveEvents", "upcomingEvents", "completedEvents", "multipleChannels", "postedVideos", "postedPlaylists", "subscriptions"]>;
/**
 * The type of the channel section.
 */
export declare class ChannelSectionSnippetType extends ChannelSectionSnippetType_base {
}
declare const ChannelSectionSnippet_base: S.Class<ChannelSectionSnippet, {
    /**
     * The ID that YouTube uses to uniquely identify the channel that published the channel section.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language of the channel section's default title and description.
     */
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Localized title, read-only.
     */
    localized: S.optionalWith<typeof ChannelSectionLocalization, {
        nullable: true;
    }>;
    /**
     * The position of the channel section in the channel.
     */
    position: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The style of the channel section.
     */
    style: S.optionalWith<typeof ChannelSectionSnippetStyle, {
        nullable: true;
    }>;
    /**
     * The channel section's title for multiple_playlists and multiple_channels.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of the channel section.
     */
    type: S.optionalWith<typeof ChannelSectionSnippetType, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID that YouTube uses to uniquely identify the channel that published the channel section.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language of the channel section's default title and description.
     */
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Localized title, read-only.
     */
    localized: S.optionalWith<typeof ChannelSectionLocalization, {
        nullable: true;
    }>;
    /**
     * The position of the channel section in the channel.
     */
    position: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The style of the channel section.
     */
    style: S.optionalWith<typeof ChannelSectionSnippetStyle, {
        nullable: true;
    }>;
    /**
     * The channel section's title for multiple_playlists and multiple_channels.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of the channel section.
     */
    type: S.optionalWith<typeof ChannelSectionSnippetType, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly type?: "channelsectionTypeUndefined" | "singlePlaylist" | "multiplePlaylists" | "popularUploads" | "recentUploads" | "likes" | "allPlaylists" | "likedPlaylists" | "recentPosts" | "recentActivity" | "liveEvents" | "upcomingEvents" | "completedEvents" | "multipleChannels" | "postedVideos" | "postedPlaylists" | "subscriptions" | undefined;
} & {
    readonly defaultLanguage?: string | undefined;
} & {
    readonly localized?: ChannelSectionLocalization | undefined;
} & {
    readonly position?: number | undefined;
} & {
    readonly style?: "channelsectionStyleUnspecified" | "horizontalRow" | "verticalList" | undefined;
}, {}, {}>;
/**
 * Basic details about a channel section, including title, style and position.
 */
export declare class ChannelSectionSnippet extends ChannelSectionSnippet_base {
}
declare const ChannelSectionTargeting_base: S.Class<ChannelSectionTargeting, {
    /**
     * The country the channel section is targeting.
     */
    countries: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The language the channel section is targeting.
     */
    languages: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The region the channel section is targeting.
     */
    regions: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The country the channel section is targeting.
     */
    countries: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The language the channel section is targeting.
     */
    languages: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The region the channel section is targeting.
     */
    regions: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>, never, {
    readonly countries?: readonly string[] | undefined;
} & {
    readonly languages?: readonly string[] | undefined;
} & {
    readonly regions?: readonly string[] | undefined;
}, {}, {}>;
/**
 * ChannelSection targeting setting.
 */
export declare class ChannelSectionTargeting extends ChannelSectionTargeting_base {
}
declare const ChannelSection_base: S.Class<ChannelSection, {
    /**
     * The contentDetails object contains details about the channel section content, such as a list of playlists or channels featured in the section.
     */
    contentDetails: S.optionalWith<typeof ChannelSectionContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the channel section.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelSection".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channelSection";
    }>;
    /**
     * Localizations for different languages
     */
    localizations: S.optionalWith<S.Record$<typeof S.String, typeof S.Unknown>, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the channel section, such as its type, style and title.
     */
    snippet: S.optionalWith<typeof ChannelSectionSnippet, {
        nullable: true;
    }>;
    /**
     * The targeting object contains basic targeting settings about the channel section.
     */
    targeting: S.optionalWith<typeof ChannelSectionTargeting, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The contentDetails object contains details about the channel section content, such as a list of playlists or channels featured in the section.
     */
    contentDetails: S.optionalWith<typeof ChannelSectionContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the channel section.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelSection".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channelSection";
    }>;
    /**
     * Localizations for different languages
     */
    localizations: S.optionalWith<S.Record$<typeof S.String, typeof S.Unknown>, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the channel section, such as its type, style and title.
     */
    snippet: S.optionalWith<typeof ChannelSectionSnippet, {
        nullable: true;
    }>;
    /**
     * The targeting object contains basic targeting settings about the channel section.
     */
    targeting: S.optionalWith<typeof ChannelSectionTargeting, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: ChannelSectionContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: ChannelSectionSnippet | undefined;
} & {
    readonly localizations?: {
        readonly [x: string]: unknown;
    } | undefined;
} & {
    readonly targeting?: ChannelSectionTargeting | undefined;
}, {}, {}>;
export declare class ChannelSection extends ChannelSection_base {
}
declare const ChannelSectionListResponse_base: S.Class<ChannelSectionListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of ChannelSections that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof ChannelSection>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelSectionListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channelSectionListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of ChannelSections that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof ChannelSection>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelSectionListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channelSectionListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly ChannelSection[] | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class ChannelSectionListResponse extends ChannelSectionListResponse_base {
}
declare const YoutubeChannelSectionsUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeChannelSectionsUpdateParams extends YoutubeChannelSectionsUpdateParams_base {
}
declare const YoutubeChannelSectionsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeChannelSectionsInsertParams extends YoutubeChannelSectionsInsertParams_base {
}
declare const YoutubeChannelSectionsDeleteParams_base: S.Struct<{
    id: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeChannelSectionsDeleteParams extends YoutubeChannelSectionsDeleteParams_base {
}
declare const YoutubeChannelsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    categoryId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    forUsername: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    managedByMe: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    mine: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    mySubscribers: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeChannelsListParams extends YoutubeChannelsListParams_base {
}
declare const ChannelAuditDetails_base: S.Class<ChannelAuditDetails, {
    /**
     * Whether or not the channel respects the community guidelines.
     */
    communityGuidelinesGoodStanding: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether or not the channel has any unresolved claims.
     */
    contentIdClaimsGoodStanding: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether or not the channel has any copyright strikes.
     */
    copyrightStrikesGoodStanding: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Whether or not the channel respects the community guidelines.
     */
    communityGuidelinesGoodStanding: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether or not the channel has any unresolved claims.
     */
    contentIdClaimsGoodStanding: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether or not the channel has any copyright strikes.
     */
    copyrightStrikesGoodStanding: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>, never, {
    readonly communityGuidelinesGoodStanding?: boolean | undefined;
} & {
    readonly contentIdClaimsGoodStanding?: boolean | undefined;
} & {
    readonly copyrightStrikesGoodStanding?: boolean | undefined;
}, {}, {}>;
/**
 * The auditDetails object encapsulates channel data that is relevant for YouTube Partners during the audit process.
 */
export declare class ChannelAuditDetails extends ChannelAuditDetails_base {
}
declare const ChannelSettings_base: S.Class<ChannelSettings, {
    /**
     * The country of the channel.
     */
    country: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Which content tab users should see when viewing the channel.
     */
    defaultTab: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Specifies the channel description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Title for the featured channels tab.
     */
    featuredChannelsTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The list of featured channels.
     */
    featuredChannelsUrls: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * Lists keywords associated with the channel, comma-separated.
     */
    keywords: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether user-submitted comments left on the channel page need to be approved by the channel owner to be publicly visible.
     */
    moderateComments: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * A prominent color that can be rendered on this channel page.
     */
    profileColor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether the tab to browse the videos should be displayed.
     */
    showBrowseView: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether related channels should be proposed.
     */
    showRelatedChannels: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Specifies the channel title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID for a Google Analytics account to track and measure traffic to the channels.
     */
    trackingAnalyticsAccountId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The trailer of the channel, for users that are not subscribers.
     */
    unsubscribedTrailer: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The country of the channel.
     */
    country: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Which content tab users should see when viewing the channel.
     */
    defaultTab: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Specifies the channel description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Title for the featured channels tab.
     */
    featuredChannelsTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The list of featured channels.
     */
    featuredChannelsUrls: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * Lists keywords associated with the channel, comma-separated.
     */
    keywords: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether user-submitted comments left on the channel page need to be approved by the channel owner to be publicly visible.
     */
    moderateComments: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * A prominent color that can be rendered on this channel page.
     */
    profileColor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether the tab to browse the videos should be displayed.
     */
    showBrowseView: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether related channels should be proposed.
     */
    showRelatedChannels: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Specifies the channel title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID for a Google Analytics account to track and measure traffic to the channels.
     */
    trackingAnalyticsAccountId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The trailer of the channel, for users that are not subscribers.
     */
    unsubscribedTrailer: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly defaultLanguage?: string | undefined;
} & {
    readonly country?: string | undefined;
} & {
    readonly defaultTab?: string | undefined;
} & {
    readonly featuredChannelsTitle?: string | undefined;
} & {
    readonly featuredChannelsUrls?: readonly string[] | undefined;
} & {
    readonly keywords?: string | undefined;
} & {
    readonly moderateComments?: boolean | undefined;
} & {
    readonly profileColor?: string | undefined;
} & {
    readonly showBrowseView?: boolean | undefined;
} & {
    readonly showRelatedChannels?: boolean | undefined;
} & {
    readonly trackingAnalyticsAccountId?: string | undefined;
} & {
    readonly unsubscribedTrailer?: string | undefined;
}, {}, {}>;
/**
 * Branding properties for the channel view.
 */
export declare class ChannelSettings extends ChannelSettings_base {
}
declare const PropertyValue_base: S.Class<PropertyValue, {
    /**
     * A property.
     */
    property: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The property's value.
     */
    value: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A property.
     */
    property: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The property's value.
     */
    value: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly value?: string | undefined;
} & {
    readonly property?: string | undefined;
}, {}, {}>;
/**
 * A pair Property / Value.
 */
export declare class PropertyValue extends PropertyValue_base {
}
declare const LanguageTag_base: S.Class<LanguageTag, {
    value: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    value: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly value?: string | undefined;
}, {}, {}>;
export declare class LanguageTag extends LanguageTag_base {
}
declare const LocalizedString_base: S.Class<LocalizedString, {
    language: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    value: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    language: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    value: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly value?: string | undefined;
} & {
    readonly language?: string | undefined;
}, {}, {}>;
export declare class LocalizedString extends LocalizedString_base {
}
declare const LocalizedProperty_base: S.Class<LocalizedProperty, {
    /**
     * The language of the default property.
     */
    defaultLanguage: S.optionalWith<typeof LanguageTag, {
        nullable: true;
    }>;
    localized: S.optionalWith<S.Array$<typeof LocalizedString>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The language of the default property.
     */
    defaultLanguage: S.optionalWith<typeof LanguageTag, {
        nullable: true;
    }>;
    localized: S.optionalWith<S.Array$<typeof LocalizedString>, {
        nullable: true;
    }>;
}>, never, {
    readonly defaultLanguage?: LanguageTag | undefined;
} & {
    readonly localized?: readonly LocalizedString[] | undefined;
}, {}, {}>;
export declare class LocalizedProperty extends LocalizedProperty_base {
}
declare const ImageSettings_base: S.Class<ImageSettings, {
    /**
     * The URL for the background image shown on the video watch page. The image should be 1200px by 615px, with a maximum file size of 128k.
     */
    backgroundImageUrl: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * This is generated when a ChannelBanner.Insert request has succeeded for the given channel.
     */
    bannerExternalUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Desktop size (1060x175).
     */
    bannerImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size high resolution (1440x395).
     */
    bannerMobileExtraHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size high resolution (1280x360).
     */
    bannerMobileHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size (640x175).
     */
    bannerMobileImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size low resolution (320x88).
     */
    bannerMobileLowImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size medium/high resolution (960x263).
     */
    bannerMobileMediumHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Tablet size extra high resolution (2560x424).
     */
    bannerTabletExtraHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Tablet size high resolution (2276x377).
     */
    bannerTabletHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Tablet size (1707x283).
     */
    bannerTabletImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Tablet size low resolution (1138x188).
     */
    bannerTabletLowImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. TV size high resolution (1920x1080).
     */
    bannerTvHighImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. TV size extra high resolution (2120x1192).
     */
    bannerTvImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. TV size low resolution (854x480).
     */
    bannerTvLowImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. TV size medium resolution (1280x720).
     */
    bannerTvMediumImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The image map script for the large banner image.
     */
    largeBrandedBannerImageImapScript: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * The URL for the 854px by 70px image that appears below the video player in the expanded video view of the video watch page.
     */
    largeBrandedBannerImageUrl: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * The image map script for the small banner image.
     */
    smallBrandedBannerImageImapScript: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * The URL for the 640px by 70px banner image that appears below the video player in the default view of the video watch page. The URL for the image that appears above the top-left corner of the video player. This is a 25-pixel-high image with a flexible width that cannot exceed 170 pixels.
     */
    smallBrandedBannerImageUrl: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * The URL for a 1px by 1px tracking pixel that can be used to collect statistics for views of the channel or video pages.
     */
    trackingImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    watchIconImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The URL for the background image shown on the video watch page. The image should be 1200px by 615px, with a maximum file size of 128k.
     */
    backgroundImageUrl: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * This is generated when a ChannelBanner.Insert request has succeeded for the given channel.
     */
    bannerExternalUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Desktop size (1060x175).
     */
    bannerImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size high resolution (1440x395).
     */
    bannerMobileExtraHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size high resolution (1280x360).
     */
    bannerMobileHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size (640x175).
     */
    bannerMobileImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size low resolution (320x88).
     */
    bannerMobileLowImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Mobile size medium/high resolution (960x263).
     */
    bannerMobileMediumHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Tablet size extra high resolution (2560x424).
     */
    bannerTabletExtraHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Tablet size high resolution (2276x377).
     */
    bannerTabletHdImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Tablet size (1707x283).
     */
    bannerTabletImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. Tablet size low resolution (1138x188).
     */
    bannerTabletLowImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. TV size high resolution (1920x1080).
     */
    bannerTvHighImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. TV size extra high resolution (2120x1192).
     */
    bannerTvImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. TV size low resolution (854x480).
     */
    bannerTvLowImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Banner image. TV size medium resolution (1280x720).
     */
    bannerTvMediumImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The image map script for the large banner image.
     */
    largeBrandedBannerImageImapScript: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * The URL for the 854px by 70px image that appears below the video player in the expanded video view of the video watch page.
     */
    largeBrandedBannerImageUrl: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * The image map script for the small banner image.
     */
    smallBrandedBannerImageImapScript: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * The URL for the 640px by 70px banner image that appears below the video player in the default view of the video watch page. The URL for the image that appears above the top-left corner of the video player. This is a 25-pixel-high image with a flexible width that cannot exceed 170 pixels.
     */
    smallBrandedBannerImageUrl: S.optionalWith<typeof LocalizedProperty, {
        nullable: true;
    }>;
    /**
     * The URL for a 1px by 1px tracking pixel that can be used to collect statistics for views of the channel or video pages.
     */
    trackingImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    watchIconImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly backgroundImageUrl?: LocalizedProperty | undefined;
} & {
    readonly bannerExternalUrl?: string | undefined;
} & {
    readonly bannerImageUrl?: string | undefined;
} & {
    readonly bannerMobileExtraHdImageUrl?: string | undefined;
} & {
    readonly bannerMobileHdImageUrl?: string | undefined;
} & {
    readonly bannerMobileImageUrl?: string | undefined;
} & {
    readonly bannerMobileLowImageUrl?: string | undefined;
} & {
    readonly bannerMobileMediumHdImageUrl?: string | undefined;
} & {
    readonly bannerTabletExtraHdImageUrl?: string | undefined;
} & {
    readonly bannerTabletHdImageUrl?: string | undefined;
} & {
    readonly bannerTabletImageUrl?: string | undefined;
} & {
    readonly bannerTabletLowImageUrl?: string | undefined;
} & {
    readonly bannerTvHighImageUrl?: string | undefined;
} & {
    readonly bannerTvImageUrl?: string | undefined;
} & {
    readonly bannerTvLowImageUrl?: string | undefined;
} & {
    readonly bannerTvMediumImageUrl?: string | undefined;
} & {
    readonly largeBrandedBannerImageImapScript?: LocalizedProperty | undefined;
} & {
    readonly largeBrandedBannerImageUrl?: LocalizedProperty | undefined;
} & {
    readonly smallBrandedBannerImageImapScript?: LocalizedProperty | undefined;
} & {
    readonly smallBrandedBannerImageUrl?: LocalizedProperty | undefined;
} & {
    readonly trackingImageUrl?: string | undefined;
} & {
    readonly watchIconImageUrl?: string | undefined;
}, {}, {}>;
/**
 * Branding properties for images associated with the channel.
 */
export declare class ImageSettings extends ImageSettings_base {
}
declare const WatchSettings_base: S.Class<WatchSettings, {
    /**
     * The text color for the video watch page's branded area.
     */
    backgroundColor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An ID that uniquely identifies a playlist that displays next to the video player.
     */
    featuredPlaylistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The background color for the video watch page's branded area.
     */
    textColor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The text color for the video watch page's branded area.
     */
    backgroundColor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An ID that uniquely identifies a playlist that displays next to the video player.
     */
    featuredPlaylistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The background color for the video watch page's branded area.
     */
    textColor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly backgroundColor?: string | undefined;
} & {
    readonly featuredPlaylistId?: string | undefined;
} & {
    readonly textColor?: string | undefined;
}, {}, {}>;
/**
 * Branding properties for the watch. All deprecated.
 */
export declare class WatchSettings extends WatchSettings_base {
}
declare const ChannelBrandingSettings_base: S.Class<ChannelBrandingSettings, {
    /**
     * Branding properties for the channel view.
     */
    channel: S.optionalWith<typeof ChannelSettings, {
        nullable: true;
    }>;
    /**
     * Additional experimental branding properties.
     */
    hints: S.optionalWith<S.Array$<typeof PropertyValue>, {
        nullable: true;
    }>;
    /**
     * Branding properties for branding images.
     */
    image: S.optionalWith<typeof ImageSettings, {
        nullable: true;
    }>;
    /**
     * Branding properties for the watch page.
     */
    watch: S.optionalWith<typeof WatchSettings, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Branding properties for the channel view.
     */
    channel: S.optionalWith<typeof ChannelSettings, {
        nullable: true;
    }>;
    /**
     * Additional experimental branding properties.
     */
    hints: S.optionalWith<S.Array$<typeof PropertyValue>, {
        nullable: true;
    }>;
    /**
     * Branding properties for branding images.
     */
    image: S.optionalWith<typeof ImageSettings, {
        nullable: true;
    }>;
    /**
     * Branding properties for the watch page.
     */
    watch: S.optionalWith<typeof WatchSettings, {
        nullable: true;
    }>;
}>, never, {
    readonly watch?: WatchSettings | undefined;
} & {
    readonly image?: ImageSettings | undefined;
} & {
    readonly channel?: ChannelSettings | undefined;
} & {
    readonly hints?: readonly PropertyValue[] | undefined;
}, {}, {}>;
/**
 * Branding properties of a YouTube channel.
 */
export declare class ChannelBrandingSettings extends ChannelBrandingSettings_base {
}
declare const ChannelContentDetails_base: S.Class<ChannelContentDetails, {
    relatedPlaylists: S.optionalWith<S.Struct<{
        /**
         * The ID of the playlist that contains the channel"s favorite videos. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        favorites: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
        /**
         * The ID of the playlist that contains the channel"s liked videos. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        likes: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
        /**
         * The ID of the playlist that contains the channel"s uploaded videos. Use the videos.insert method to upload new videos and the videos.delete method to delete previously uploaded videos.
         */
        uploads: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
        /**
         * The ID of the playlist that contains the channel"s watch history. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        watchHistory: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
        /**
         * The ID of the playlist that contains the channel"s watch later playlist. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        watchLater: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
    }>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    relatedPlaylists: S.optionalWith<S.Struct<{
        /**
         * The ID of the playlist that contains the channel"s favorite videos. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        favorites: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
        /**
         * The ID of the playlist that contains the channel"s liked videos. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        likes: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
        /**
         * The ID of the playlist that contains the channel"s uploaded videos. Use the videos.insert method to upload new videos and the videos.delete method to delete previously uploaded videos.
         */
        uploads: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
        /**
         * The ID of the playlist that contains the channel"s watch history. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        watchHistory: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
        /**
         * The ID of the playlist that contains the channel"s watch later playlist. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        watchLater: S.optionalWith<typeof S.String, {
            nullable: true;
        }>;
    }>, {
        nullable: true;
    }>;
}>, never, {
    readonly relatedPlaylists?: {
        readonly likes?: string | undefined;
        readonly favorites?: string | undefined;
        readonly uploads?: string | undefined;
        readonly watchHistory?: string | undefined;
        readonly watchLater?: string | undefined;
    } | undefined;
}, {}, {}>;
/**
 * Details about the content of a channel.
 */
export declare class ChannelContentDetails extends ChannelContentDetails_base {
}
declare const ChannelContentOwnerDetails_base: S.Class<ChannelContentOwnerDetails, {
    /**
     * The ID of the content owner linked to the channel.
     */
    contentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the channel was linked to the content owner.
     */
    timeLinked: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID of the content owner linked to the channel.
     */
    contentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the channel was linked to the content owner.
     */
    timeLinked: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly contentOwner?: string | undefined;
} & {
    readonly timeLinked?: string | undefined;
}, {}, {}>;
/**
 * The contentOwnerDetails object encapsulates channel data that is relevant for YouTube Partners linked with the channel.
 */
export declare class ChannelContentOwnerDetails extends ChannelContentOwnerDetails_base {
}
declare const ChannelConversionPingContext_base: S.Literal<["subscribe", "unsubscribe", "cview"]>;
/**
 * Defines the context of the ping.
 */
export declare class ChannelConversionPingContext extends ChannelConversionPingContext_base {
}
declare const ChannelConversionPing_base: S.Class<ChannelConversionPing, {
    /**
     * Defines the context of the ping.
     */
    context: S.optionalWith<typeof ChannelConversionPingContext, {
        nullable: true;
    }>;
    /**
     * The url (without the schema) that the player shall send the ping to. It's at caller's descretion to decide which schema to use (http vs https) Example of a returned url: //googleads.g.doubleclick.net/pagead/ viewthroughconversion/962985656/?data=path%3DtHe_path%3Btype%3D cview%3Butuid%3DGISQtTNGYqaYl4sKxoVvKA&labe=default The caller must append biscotti authentication (ms param in case of mobile, for example) to this ping.
     */
    conversionUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Defines the context of the ping.
     */
    context: S.optionalWith<typeof ChannelConversionPingContext, {
        nullable: true;
    }>;
    /**
     * The url (without the schema) that the player shall send the ping to. It's at caller's descretion to decide which schema to use (http vs https) Example of a returned url: //googleads.g.doubleclick.net/pagead/ viewthroughconversion/962985656/?data=path%3DtHe_path%3Btype%3D cview%3Butuid%3DGISQtTNGYqaYl4sKxoVvKA&labe=default The caller must append biscotti authentication (ms param in case of mobile, for example) to this ping.
     */
    conversionUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly context?: "subscribe" | "unsubscribe" | "cview" | undefined;
} & {
    readonly conversionUrl?: string | undefined;
}, {}, {}>;
/**
 * Pings that the app shall fire (authenticated by biscotti cookie). Each ping has a context, in which the app must fire the ping, and a url identifying the ping.
 */
export declare class ChannelConversionPing extends ChannelConversionPing_base {
}
declare const ChannelConversionPings_base: S.Class<ChannelConversionPings, {
    /**
     * Pings that the app shall fire (authenticated by biscotti cookie). Each ping has a context, in which the app must fire the ping, and a url identifying the ping.
     */
    pings: S.optionalWith<S.Array$<typeof ChannelConversionPing>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Pings that the app shall fire (authenticated by biscotti cookie). Each ping has a context, in which the app must fire the ping, and a url identifying the ping.
     */
    pings: S.optionalWith<S.Array$<typeof ChannelConversionPing>, {
        nullable: true;
    }>;
}>, never, {
    readonly pings?: readonly ChannelConversionPing[] | undefined;
}, {}, {}>;
/**
 * The conversionPings object encapsulates information about conversion pings that need to be respected by the channel.
 */
export declare class ChannelConversionPings extends ChannelConversionPings_base {
}
declare const ChannelLocalization_base: S.Class<ChannelLocalization, {
    /**
     * The localized strings for channel's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The localized strings for channel's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The localized strings for channel's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The localized strings for channel's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
}, {}, {}>;
/**
 * Channel localization setting
 */
export declare class ChannelLocalization extends ChannelLocalization_base {
}
declare const ChannelSnippet_base: S.Class<ChannelSnippet, {
    /**
     * The country of the channel.
     */
    country: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The custom url of the channel.
     */
    customUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language of the channel's default title and description.
     */
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The description of the channel.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Localized title and description, read-only.
     */
    localized: S.optionalWith<typeof ChannelLocalization, {
        nullable: true;
    }>;
    /**
     * The date and time that the channel was created.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the channel. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail. When displaying thumbnails in your application, make sure that your code uses the image URLs exactly as they are returned in API responses. For example, your application should not use the http domain instead of the https domain in a URL returned in an API response. Beginning in July 2018, channel thumbnail URLs will only be available in the https domain, which is how the URLs appear in API responses. After that time, you might see broken images in your application if it tries to load YouTube images from the http domain. Thumbnail images might be empty for newly created channels and might take up to one day to populate.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The channel's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The country of the channel.
     */
    country: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The custom url of the channel.
     */
    customUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language of the channel's default title and description.
     */
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The description of the channel.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Localized title and description, read-only.
     */
    localized: S.optionalWith<typeof ChannelLocalization, {
        nullable: true;
    }>;
    /**
     * The date and time that the channel was created.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the channel. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail. When displaying thumbnails in your application, make sure that your code uses the image URLs exactly as they are returned in API responses. For example, your application should not use the http domain instead of the https domain in a URL returned in an API response. Beginning in July 2018, channel thumbnail URLs will only be available in the https domain, which is how the URLs appear in API responses. After that time, you might see broken images in your application if it tries to load YouTube images from the http domain. Thumbnail images might be empty for newly created channels and might take up to one day to populate.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The channel's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
} & {
    readonly defaultLanguage?: string | undefined;
} & {
    readonly localized?: ChannelLocalization | undefined;
} & {
    readonly country?: string | undefined;
} & {
    readonly customUrl?: string | undefined;
}, {}, {}>;
/**
 * Basic details about a channel, including title, description and thumbnails.
 */
export declare class ChannelSnippet extends ChannelSnippet_base {
}
declare const ChannelStatistics_base: S.Class<ChannelStatistics, {
    /**
     * The number of comments for the channel.
     */
    commentCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether or not the number of subscribers is shown for this user.
     */
    hiddenSubscriberCount: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The number of subscribers that the channel has.
     */
    subscriberCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of videos uploaded to the channel.
     */
    videoCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of times the channel has been viewed.
     */
    viewCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The number of comments for the channel.
     */
    commentCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether or not the number of subscribers is shown for this user.
     */
    hiddenSubscriberCount: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The number of subscribers that the channel has.
     */
    subscriberCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of videos uploaded to the channel.
     */
    videoCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of times the channel has been viewed.
     */
    viewCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly viewCount?: string | undefined;
} & {
    readonly commentCount?: string | undefined;
} & {
    readonly subscriberCount?: string | undefined;
} & {
    readonly videoCount?: string | undefined;
} & {
    readonly hiddenSubscriberCount?: boolean | undefined;
}, {}, {}>;
/**
 * Statistics about a channel: number of subscribers, number of videos in the channel, etc.
 */
export declare class ChannelStatistics extends ChannelStatistics_base {
}
declare const ChannelStatusLongUploadsStatus_base: S.Literal<["longUploadsUnspecified", "allowed", "eligible", "disallowed"]>;
/**
 * The long uploads status of this channel. See https://support.google.com/youtube/answer/71673 for more information.
 */
export declare class ChannelStatusLongUploadsStatus extends ChannelStatusLongUploadsStatus_base {
}
declare const ChannelStatusPrivacyStatus_base: S.Literal<["public", "unlisted", "private"]>;
/**
 * Privacy status of the channel.
 */
export declare class ChannelStatusPrivacyStatus extends ChannelStatusPrivacyStatus_base {
}
declare const ChannelStatus_base: S.Class<ChannelStatus, {
    /**
     * If true, then the user is linked to either a YouTube username or G+ account. Otherwise, the user doesn't have a public YouTube identity.
     */
    isLinked: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The long uploads status of this channel. See https://support.google.com/youtube/answer/71673 for more information.
     */
    longUploadsStatus: S.optionalWith<typeof ChannelStatusLongUploadsStatus, {
        nullable: true;
    }>;
    madeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Privacy status of the channel.
     */
    privacyStatus: S.optionalWith<typeof ChannelStatusPrivacyStatus, {
        nullable: true;
    }>;
    selfDeclaredMadeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * If true, then the user is linked to either a YouTube username or G+ account. Otherwise, the user doesn't have a public YouTube identity.
     */
    isLinked: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The long uploads status of this channel. See https://support.google.com/youtube/answer/71673 for more information.
     */
    longUploadsStatus: S.optionalWith<typeof ChannelStatusLongUploadsStatus, {
        nullable: true;
    }>;
    madeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Privacy status of the channel.
     */
    privacyStatus: S.optionalWith<typeof ChannelStatusPrivacyStatus, {
        nullable: true;
    }>;
    selfDeclaredMadeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>, never, {
    readonly isLinked?: boolean | undefined;
} & {
    readonly longUploadsStatus?: "longUploadsUnspecified" | "allowed" | "eligible" | "disallowed" | undefined;
} & {
    readonly madeForKids?: boolean | undefined;
} & {
    readonly privacyStatus?: "public" | "unlisted" | "private" | undefined;
} & {
    readonly selfDeclaredMadeForKids?: boolean | undefined;
}, {}, {}>;
/**
 * JSON template for the status part of a channel.
 */
export declare class ChannelStatus extends ChannelStatus_base {
}
declare const ChannelTopicDetails_base: S.Class<ChannelTopicDetails, {
    /**
     * A list of Wikipedia URLs that describe the channel's content.
     */
    topicCategories: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A list of Freebase topic IDs associated with the channel. You can retrieve information about each topic using the Freebase Topic API.
     */
    topicIds: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A list of Wikipedia URLs that describe the channel's content.
     */
    topicCategories: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A list of Freebase topic IDs associated with the channel. You can retrieve information about each topic using the Freebase Topic API.
     */
    topicIds: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>, never, {
    readonly topicCategories?: readonly string[] | undefined;
} & {
    readonly topicIds?: readonly string[] | undefined;
}, {}, {}>;
/**
 * Freebase topic information related to the channel.
 */
export declare class ChannelTopicDetails extends ChannelTopicDetails_base {
}
declare const Channel_base: S.Class<Channel, {
    /**
     * The auditionDetails object encapsulates channel data that is relevant for YouTube Partners during the audition process.
     */
    auditDetails: S.optionalWith<typeof ChannelAuditDetails, {
        nullable: true;
    }>;
    /**
     * The brandingSettings object encapsulates information about the branding of the channel.
     */
    brandingSettings: S.optionalWith<typeof ChannelBrandingSettings, {
        nullable: true;
    }>;
    /**
     * The contentDetails object encapsulates information about the channel's content.
     */
    contentDetails: S.optionalWith<typeof ChannelContentDetails, {
        nullable: true;
    }>;
    /**
     * The contentOwnerDetails object encapsulates channel data that is relevant for YouTube Partners linked with the channel.
     */
    contentOwnerDetails: S.optionalWith<typeof ChannelContentOwnerDetails, {
        nullable: true;
    }>;
    /**
     * The conversionPings object encapsulates information about conversion pings that need to be respected by the channel.
     */
    conversionPings: S.optionalWith<typeof ChannelConversionPings, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the channel.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channel".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channel";
    }>;
    /**
     * Localizations for different languages
     */
    localizations: S.optionalWith<S.Record$<typeof S.String, typeof S.Unknown>, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the channel, such as its title, description, and thumbnail images.
     */
    snippet: S.optionalWith<typeof ChannelSnippet, {
        nullable: true;
    }>;
    /**
     * The statistics object encapsulates statistics for the channel.
     */
    statistics: S.optionalWith<typeof ChannelStatistics, {
        nullable: true;
    }>;
    /**
     * The status object encapsulates information about the privacy status of the channel.
     */
    status: S.optionalWith<typeof ChannelStatus, {
        nullable: true;
    }>;
    /**
     * The topicDetails object encapsulates information about Freebase topics associated with the channel.
     */
    topicDetails: S.optionalWith<typeof ChannelTopicDetails, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The auditionDetails object encapsulates channel data that is relevant for YouTube Partners during the audition process.
     */
    auditDetails: S.optionalWith<typeof ChannelAuditDetails, {
        nullable: true;
    }>;
    /**
     * The brandingSettings object encapsulates information about the branding of the channel.
     */
    brandingSettings: S.optionalWith<typeof ChannelBrandingSettings, {
        nullable: true;
    }>;
    /**
     * The contentDetails object encapsulates information about the channel's content.
     */
    contentDetails: S.optionalWith<typeof ChannelContentDetails, {
        nullable: true;
    }>;
    /**
     * The contentOwnerDetails object encapsulates channel data that is relevant for YouTube Partners linked with the channel.
     */
    contentOwnerDetails: S.optionalWith<typeof ChannelContentOwnerDetails, {
        nullable: true;
    }>;
    /**
     * The conversionPings object encapsulates information about conversion pings that need to be respected by the channel.
     */
    conversionPings: S.optionalWith<typeof ChannelConversionPings, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the channel.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channel".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channel";
    }>;
    /**
     * Localizations for different languages
     */
    localizations: S.optionalWith<S.Record$<typeof S.String, typeof S.Unknown>, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the channel, such as its title, description, and thumbnail images.
     */
    snippet: S.optionalWith<typeof ChannelSnippet, {
        nullable: true;
    }>;
    /**
     * The statistics object encapsulates statistics for the channel.
     */
    statistics: S.optionalWith<typeof ChannelStatistics, {
        nullable: true;
    }>;
    /**
     * The status object encapsulates information about the privacy status of the channel.
     */
    status: S.optionalWith<typeof ChannelStatus, {
        nullable: true;
    }>;
    /**
     * The topicDetails object encapsulates information about Freebase topics associated with the channel.
     */
    topicDetails: S.optionalWith<typeof ChannelTopicDetails, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: ChannelContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: ChannelSnippet | undefined;
} & {
    readonly status?: ChannelStatus | undefined;
} & {
    readonly localizations?: {
        readonly [x: string]: unknown;
    } | undefined;
} & {
    readonly auditDetails?: ChannelAuditDetails | undefined;
} & {
    readonly brandingSettings?: ChannelBrandingSettings | undefined;
} & {
    readonly contentOwnerDetails?: ChannelContentOwnerDetails | undefined;
} & {
    readonly conversionPings?: ChannelConversionPings | undefined;
} & {
    readonly statistics?: ChannelStatistics | undefined;
} & {
    readonly topicDetails?: ChannelTopicDetails | undefined;
}, {}, {}>;
/**
 * A *channel* resource contains information about a YouTube channel.
 */
export declare class Channel extends Channel_base {
}
declare const ChannelListResponse_base: S.Class<ChannelListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof Channel>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channelListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof Channel>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#channelListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly Channel[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class ChannelListResponse extends ChannelListResponse_base {
}
declare const YoutubeChannelsUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeChannelsUpdateParams extends YoutubeChannelsUpdateParams_base {
}
declare const YoutubeCommentThreadsListParamsModerationStatus_base: S.Literal<["published", "heldForReview", "likelySpam", "rejected"]>;
export declare class YoutubeCommentThreadsListParamsModerationStatus extends YoutubeCommentThreadsListParamsModerationStatus_base {
}
declare const YoutubeCommentThreadsListParamsOrder_base: S.Literal<["orderUnspecified", "time", "relevance"]>;
export declare class YoutubeCommentThreadsListParamsOrder extends YoutubeCommentThreadsListParamsOrder_base {
}
declare const YoutubeCommentThreadsListParamsTextFormat_base: S.Literal<["textFormatUnspecified", "html", "plainText"]>;
export declare class YoutubeCommentThreadsListParamsTextFormat extends YoutubeCommentThreadsListParamsTextFormat_base {
}
declare const YoutubeCommentThreadsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    allThreadsRelatedToChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    moderationStatus: S.optionalWith<typeof YoutubeCommentThreadsListParamsModerationStatus, {
        nullable: true;
    }>;
    order: S.optionalWith<typeof YoutubeCommentThreadsListParamsOrder, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    searchTerms: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    textFormat: S.optionalWith<typeof YoutubeCommentThreadsListParamsTextFormat, {
        nullable: true;
    }>;
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeCommentThreadsListParams extends YoutubeCommentThreadsListParams_base {
}
declare const CommentSnippetAuthorChannelId_base: S.Class<CommentSnippetAuthorChannelId, {
    value: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    value: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly value?: string | undefined;
}, {}, {}>;
/**
 * The id of the author's YouTube channel, if any.
 */
export declare class CommentSnippetAuthorChannelId extends CommentSnippetAuthorChannelId_base {
}
declare const CommentSnippetModerationStatus_base: S.Literal<["published", "heldForReview", "likelySpam", "rejected"]>;
/**
 * The comment's moderation status. Will not be set if the comments were requested through the id filter.
 */
export declare class CommentSnippetModerationStatus extends CommentSnippetModerationStatus_base {
}
declare const CommentSnippetViewerRating_base: S.Literal<["none", "like", "dislike"]>;
/**
 * The rating the viewer has given to this comment. For the time being this will never return RATE_TYPE_DISLIKE and instead return RATE_TYPE_NONE. This may change in the future.
 */
export declare class CommentSnippetViewerRating extends CommentSnippetViewerRating_base {
}
declare const CommentSnippet_base: S.Class<CommentSnippet, {
    authorChannelId: S.optionalWith<typeof CommentSnippetAuthorChannelId, {
        nullable: true;
    }>;
    /**
     * Link to the author's YouTube channel, if any.
     */
    authorChannelUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The name of the user who posted the comment.
     */
    authorDisplayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL for the avatar of the user who posted the comment.
     */
    authorProfileImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether the current viewer can rate this comment.
     */
    canRate: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The id of the corresponding YouTube channel. In case of a channel comment this is the channel the comment refers to. In case of a video comment it's the video's channel.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The total number of likes this comment has received.
     */
    likeCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The comment's moderation status. Will not be set if the comments were requested through the id filter.
     */
    moderationStatus: S.optionalWith<typeof CommentSnippetModerationStatus, {
        nullable: true;
    }>;
    /**
     * The unique id of the parent comment, only set for replies.
     */
    parentId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the comment was originally published.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The comment's text. The format is either plain text or HTML dependent on what has been requested. Even the plain text representation may differ from the text originally posted in that it may replace video links with video titles etc.
     */
    textDisplay: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The comment's original raw text as initially posted or last updated. The original text will only be returned if it is accessible to the viewer, which is only guaranteed if the viewer is the comment's author.
     */
    textOriginal: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the comment was last updated.
     */
    updatedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID of the video the comment refers to, if any.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The rating the viewer has given to this comment. For the time being this will never return RATE_TYPE_DISLIKE and instead return RATE_TYPE_NONE. This may change in the future.
     */
    viewerRating: S.optionalWith<typeof CommentSnippetViewerRating, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    authorChannelId: S.optionalWith<typeof CommentSnippetAuthorChannelId, {
        nullable: true;
    }>;
    /**
     * Link to the author's YouTube channel, if any.
     */
    authorChannelUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The name of the user who posted the comment.
     */
    authorDisplayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The URL for the avatar of the user who posted the comment.
     */
    authorProfileImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether the current viewer can rate this comment.
     */
    canRate: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The id of the corresponding YouTube channel. In case of a channel comment this is the channel the comment refers to. In case of a video comment it's the video's channel.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The total number of likes this comment has received.
     */
    likeCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The comment's moderation status. Will not be set if the comments were requested through the id filter.
     */
    moderationStatus: S.optionalWith<typeof CommentSnippetModerationStatus, {
        nullable: true;
    }>;
    /**
     * The unique id of the parent comment, only set for replies.
     */
    parentId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the comment was originally published.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The comment's text. The format is either plain text or HTML dependent on what has been requested. Even the plain text representation may differ from the text originally posted in that it may replace video links with video titles etc.
     */
    textDisplay: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The comment's original raw text as initially posted or last updated. The original text will only be returned if it is accessible to the viewer, which is only guaranteed if the viewer is the comment's author.
     */
    textOriginal: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the comment was last updated.
     */
    updatedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID of the video the comment refers to, if any.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The rating the viewer has given to this comment. For the time being this will never return RATE_TYPE_DISLIKE and instead return RATE_TYPE_NONE. This may change in the future.
     */
    viewerRating: S.optionalWith<typeof CommentSnippetViewerRating, {
        nullable: true;
    }>;
}>, never, {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly likeCount?: number | undefined;
} & {
    readonly videoId?: string | undefined;
} & {
    readonly moderationStatus?: "published" | "heldForReview" | "likelySpam" | "rejected" | undefined;
} & {
    readonly authorChannelId?: CommentSnippetAuthorChannelId | undefined;
} & {
    readonly authorChannelUrl?: string | undefined;
} & {
    readonly authorDisplayName?: string | undefined;
} & {
    readonly authorProfileImageUrl?: string | undefined;
} & {
    readonly canRate?: boolean | undefined;
} & {
    readonly parentId?: string | undefined;
} & {
    readonly textDisplay?: string | undefined;
} & {
    readonly textOriginal?: string | undefined;
} & {
    readonly updatedAt?: string | undefined;
} & {
    readonly viewerRating?: "like" | "none" | "dislike" | undefined;
}, {}, {}>;
/**
 * Basic details about a comment, such as its author and text.
 */
export declare class CommentSnippet extends CommentSnippet_base {
}
declare const Comment_base: S.Class<Comment, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the comment.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#comment".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#comment";
    }>;
    /**
     * The snippet object contains basic details about the comment.
     */
    snippet: S.optionalWith<typeof CommentSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the comment.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#comment".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#comment";
    }>;
    /**
     * The snippet object contains basic details about the comment.
     */
    snippet: S.optionalWith<typeof CommentSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: CommentSnippet | undefined;
}, {}, {}>;
/**
 * A *comment* represents a single YouTube comment.
 */
export declare class Comment extends Comment_base {
}
declare const CommentThreadReplies_base: S.Class<CommentThreadReplies, {
    /**
     * A limited number of replies. Unless the number of replies returned equals total_reply_count in the snippet the returned replies are only a subset of the total number of replies.
     */
    comments: S.optionalWith<S.Array$<typeof Comment>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A limited number of replies. Unless the number of replies returned equals total_reply_count in the snippet the returned replies are only a subset of the total number of replies.
     */
    comments: S.optionalWith<S.Array$<typeof Comment>, {
        nullable: true;
    }>;
}>, never, {
    readonly comments?: readonly Comment[] | undefined;
}, {}, {}>;
/**
 * Comments written in (direct or indirect) reply to the top level comment.
 */
export declare class CommentThreadReplies extends CommentThreadReplies_base {
}
declare const CommentThreadSnippet_base: S.Class<CommentThreadSnippet, {
    /**
     * Whether the current viewer of the thread can reply to it. This is viewer specific - other viewers may see a different value for this field.
     */
    canReply: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The YouTube channel the comments in the thread refer to or the channel with the video the comments refer to. If video_id isn't set the comments refer to the channel itself.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether the thread (and therefore all its comments) is visible to all YouTube users.
     */
    isPublic: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The top level comment of this thread.
     */
    topLevelComment: S.optionalWith<typeof Comment, {
        nullable: true;
    }>;
    /**
     * The total number of replies (not including the top level comment).
     */
    totalReplyCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The ID of the video the comments refer to, if any. No video_id implies a channel discussion comment.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Whether the current viewer of the thread can reply to it. This is viewer specific - other viewers may see a different value for this field.
     */
    canReply: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The YouTube channel the comments in the thread refer to or the channel with the video the comments refer to. If video_id isn't set the comments refer to the channel itself.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether the thread (and therefore all its comments) is visible to all YouTube users.
     */
    isPublic: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The top level comment of this thread.
     */
    topLevelComment: S.optionalWith<typeof Comment, {
        nullable: true;
    }>;
    /**
     * The total number of replies (not including the top level comment).
     */
    totalReplyCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The ID of the video the comments refer to, if any. No video_id implies a channel discussion comment.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly channelId?: string | undefined;
} & {
    readonly videoId?: string | undefined;
} & {
    readonly canReply?: boolean | undefined;
} & {
    readonly isPublic?: boolean | undefined;
} & {
    readonly topLevelComment?: Comment | undefined;
} & {
    readonly totalReplyCount?: number | undefined;
}, {}, {}>;
/**
 * Basic details about a comment thread.
 */
export declare class CommentThreadSnippet extends CommentThreadSnippet_base {
}
declare const CommentThread_base: S.Class<CommentThread, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the comment thread.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentThread".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#commentThread";
    }>;
    /**
     * The replies object contains a limited number of replies (if any) to the top level comment found in the snippet.
     */
    replies: S.optionalWith<typeof CommentThreadReplies, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the comment thread and also the top level comment.
     */
    snippet: S.optionalWith<typeof CommentThreadSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the comment thread.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentThread".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#commentThread";
    }>;
    /**
     * The replies object contains a limited number of replies (if any) to the top level comment found in the snippet.
     */
    replies: S.optionalWith<typeof CommentThreadReplies, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the comment thread and also the top level comment.
     */
    snippet: S.optionalWith<typeof CommentThreadSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: CommentThreadSnippet | undefined;
} & {
    readonly replies?: CommentThreadReplies | undefined;
}, {}, {}>;
/**
 * A *comment thread* represents information that applies to a top level comment and all its replies. It can also include the top level comment itself and some of the replies.
 */
export declare class CommentThread extends CommentThread_base {
}
declare const CommentThreadListResponse_base: S.Class<CommentThreadListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of comment threads that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof CommentThread>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentThreadListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#commentThreadListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of comment threads that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof CommentThread>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentThreadListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#commentThreadListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly CommentThread[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class CommentThreadListResponse extends CommentThreadListResponse_base {
}
declare const YoutubeYoutubeV3UpdateCommentThreadsParams_base: S.Struct<{
    part: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>;
export declare class YoutubeYoutubeV3UpdateCommentThreadsParams extends YoutubeYoutubeV3UpdateCommentThreadsParams_base {
}
declare const YoutubeCommentThreadsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeCommentThreadsInsertParams extends YoutubeCommentThreadsInsertParams_base {
}
declare const YoutubeCommentsListParamsTextFormat_base: S.Literal<["textFormatUnspecified", "html", "plainText"]>;
export declare class YoutubeCommentsListParamsTextFormat extends YoutubeCommentsListParamsTextFormat_base {
}
declare const YoutubeCommentsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    parentId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    textFormat: S.optionalWith<typeof YoutubeCommentsListParamsTextFormat, {
        nullable: true;
    }>;
}>;
export declare class YoutubeCommentsListParams extends YoutubeCommentsListParams_base {
}
declare const CommentListResponse_base: S.Class<CommentListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of comments that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof Comment>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#commentListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of comments that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof Comment>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#commentListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly Comment[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class CommentListResponse extends CommentListResponse_base {
}
declare const YoutubeCommentsUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeCommentsUpdateParams extends YoutubeCommentsUpdateParams_base {
}
declare const YoutubeCommentsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeCommentsInsertParams extends YoutubeCommentsInsertParams_base {
}
declare const YoutubeCommentsDeleteParams_base: S.Struct<{
    id: typeof S.String;
}>;
export declare class YoutubeCommentsDeleteParams extends YoutubeCommentsDeleteParams_base {
}
declare const YoutubeCommentsMarkAsSpamParams_base: S.Struct<{
    id: S.Array$<typeof S.String>;
}>;
export declare class YoutubeCommentsMarkAsSpamParams extends YoutubeCommentsMarkAsSpamParams_base {
}
declare const YoutubeCommentsSetModerationStatusParamsModerationStatus_base: S.Literal<["published", "heldForReview", "likelySpam", "rejected"]>;
export declare class YoutubeCommentsSetModerationStatusParamsModerationStatus extends YoutubeCommentsSetModerationStatusParamsModerationStatus_base {
}
declare const YoutubeCommentsSetModerationStatusParams_base: S.Struct<{
    id: S.Array$<typeof S.String>;
    moderationStatus: typeof YoutubeCommentsSetModerationStatusParamsModerationStatus;
    banAuthor: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>;
export declare class YoutubeCommentsSetModerationStatusParams extends YoutubeCommentsSetModerationStatusParams_base {
}
declare const YoutubeI18NLanguagesListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeI18NLanguagesListParams extends YoutubeI18NLanguagesListParams_base {
}
declare const I18NLanguageSnippet_base: S.Class<I18NLanguageSnippet, {
    /**
     * A short BCP-47 code that uniquely identifies a language.
     */
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The human-readable name of the language in the language itself.
     */
    name: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A short BCP-47 code that uniquely identifies a language.
     */
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The human-readable name of the language in the language itself.
     */
    name: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly name?: string | undefined;
} & {
    readonly hl?: string | undefined;
}, {}, {}>;
/**
 * Basic details about an i18n language, such as language code and human-readable name.
 */
export declare class I18NLanguageSnippet extends I18NLanguageSnippet_base {
}
declare const I18NLanguage_base: S.Class<I18NLanguage, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the i18n language.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nLanguage".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#i18nLanguage";
    }>;
    /**
     * The snippet object contains basic details about the i18n language, such as language code and human-readable name.
     */
    snippet: S.optionalWith<typeof I18NLanguageSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the i18n language.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nLanguage".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#i18nLanguage";
    }>;
    /**
     * The snippet object contains basic details about the i18n language, such as language code and human-readable name.
     */
    snippet: S.optionalWith<typeof I18NLanguageSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: I18NLanguageSnippet | undefined;
}, {}, {}>;
/**
 * An *i18nLanguage* resource identifies a UI language currently supported by YouTube.
 */
export declare class I18NLanguage extends I18NLanguage_base {
}
declare const I18NLanguageListResponse_base: S.Class<I18NLanguageListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of supported i18n languages. In this map, the i18n language ID is the map key, and its value is the corresponding i18nLanguage resource.
     */
    items: S.optionalWith<S.Array$<typeof I18NLanguage>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nLanguageListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#i18nLanguageListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of supported i18n languages. In this map, the i18n language ID is the map key, and its value is the corresponding i18nLanguage resource.
     */
    items: S.optionalWith<S.Array$<typeof I18NLanguage>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nLanguageListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#i18nLanguageListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly I18NLanguage[] | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class I18NLanguageListResponse extends I18NLanguageListResponse_base {
}
declare const YoutubeI18NRegionsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeI18NRegionsListParams extends YoutubeI18NRegionsListParams_base {
}
declare const I18NRegionSnippet_base: S.Class<I18NRegionSnippet, {
    /**
     * The region code as a 2-letter ISO country code.
     */
    gl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The human-readable name of the region.
     */
    name: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The region code as a 2-letter ISO country code.
     */
    gl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The human-readable name of the region.
     */
    name: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly name?: string | undefined;
} & {
    readonly gl?: string | undefined;
}, {}, {}>;
/**
 * Basic details about an i18n region, such as region code and human-readable name.
 */
export declare class I18NRegionSnippet extends I18NRegionSnippet_base {
}
declare const I18NRegion_base: S.Class<I18NRegion, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the i18n region.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nRegion".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#i18nRegion";
    }>;
    /**
     * The snippet object contains basic details about the i18n region, such as region code and human-readable name.
     */
    snippet: S.optionalWith<typeof I18NRegionSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the i18n region.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nRegion".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#i18nRegion";
    }>;
    /**
     * The snippet object contains basic details about the i18n region, such as region code and human-readable name.
     */
    snippet: S.optionalWith<typeof I18NRegionSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: I18NRegionSnippet | undefined;
}, {}, {}>;
/**
 * A *i18nRegion* resource identifies a region where YouTube is available.
 */
export declare class I18NRegion extends I18NRegion_base {
}
declare const I18NRegionListResponse_base: S.Class<I18NRegionListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of regions where YouTube is available. In this map, the i18n region ID is the map key, and its value is the corresponding i18nRegion resource.
     */
    items: S.optionalWith<S.Array$<typeof I18NRegion>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nRegionListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#i18nRegionListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of regions where YouTube is available. In this map, the i18n region ID is the map key, and its value is the corresponding i18nRegion resource.
     */
    items: S.optionalWith<S.Array$<typeof I18NRegion>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nRegionListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#i18nRegionListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly I18NRegion[] | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class I18NRegionListResponse extends I18NRegionListResponse_base {
}
declare const YoutubeLiveBroadcastsListParamsBroadcastStatus_base: S.Literal<["broadcastStatusFilterUnspecified", "all", "active", "upcoming", "completed"]>;
export declare class YoutubeLiveBroadcastsListParamsBroadcastStatus extends YoutubeLiveBroadcastsListParamsBroadcastStatus_base {
}
declare const YoutubeLiveBroadcastsListParamsBroadcastType_base: S.Literal<["broadcastTypeFilterUnspecified", "all", "event", "persistent"]>;
export declare class YoutubeLiveBroadcastsListParamsBroadcastType extends YoutubeLiveBroadcastsListParamsBroadcastType_base {
}
declare const YoutubeLiveBroadcastsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    broadcastStatus: S.optionalWith<typeof YoutubeLiveBroadcastsListParamsBroadcastStatus, {
        nullable: true;
    }>;
    broadcastType: S.optionalWith<typeof YoutubeLiveBroadcastsListParamsBroadcastType, {
        nullable: true;
    }>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    mine: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveBroadcastsListParams extends YoutubeLiveBroadcastsListParams_base {
}
declare const LiveBroadcastContentDetailsClosedCaptionsType_base: S.Literal<["closedCaptionsTypeUnspecified", "closedCaptionsDisabled", "closedCaptionsHttpPost", "closedCaptionsEmbedded"]>;
export declare class LiveBroadcastContentDetailsClosedCaptionsType extends LiveBroadcastContentDetailsClosedCaptionsType_base {
}
declare const LiveBroadcastContentDetailsLatencyPreference_base: S.Literal<["latencyPreferenceUnspecified", "normal", "low", "ultraLow"]>;
/**
 * If both this and enable_low_latency are set, they must match. LATENCY_NORMAL should match enable_low_latency=false LATENCY_LOW should match enable_low_latency=true LATENCY_ULTRA_LOW should have enable_low_latency omitted.
 */
export declare class LiveBroadcastContentDetailsLatencyPreference extends LiveBroadcastContentDetailsLatencyPreference_base {
}
declare const MonitorStreamInfo_base: S.Class<MonitorStreamInfo, {
    /**
     * If you have set the enableMonitorStream property to true, then this property determines the length of the live broadcast delay.
     */
    broadcastStreamDelayMs: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * HTML code that embeds a player that plays the monitor stream.
     */
    embedHtml: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This value determines whether the monitor stream is enabled for the broadcast. If the monitor stream is enabled, then YouTube will broadcast the event content on a special stream intended only for the broadcaster's consumption. The broadcaster can use the stream to review the event content and also to identify the optimal times to insert cuepoints. You need to set this value to true if you intend to have a broadcast delay for your event. *Note:* This property cannot be updated once the broadcast is in the testing or live state.
     */
    enableMonitorStream: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * If you have set the enableMonitorStream property to true, then this property determines the length of the live broadcast delay.
     */
    broadcastStreamDelayMs: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * HTML code that embeds a player that plays the monitor stream.
     */
    embedHtml: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This value determines whether the monitor stream is enabled for the broadcast. If the monitor stream is enabled, then YouTube will broadcast the event content on a special stream intended only for the broadcaster's consumption. The broadcaster can use the stream to review the event content and also to identify the optimal times to insert cuepoints. You need to set this value to true if you intend to have a broadcast delay for your event. *Note:* This property cannot be updated once the broadcast is in the testing or live state.
     */
    enableMonitorStream: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>, never, {
    readonly broadcastStreamDelayMs?: number | undefined;
} & {
    readonly embedHtml?: string | undefined;
} & {
    readonly enableMonitorStream?: boolean | undefined;
}, {}, {}>;
/**
 * Settings and Info of the monitor stream
 */
export declare class MonitorStreamInfo extends MonitorStreamInfo_base {
}
declare const LiveBroadcastContentDetailsProjection_base: S.Literal<["projectionUnspecified", "rectangular", "360", "mesh"]>;
/**
 * The projection format of this broadcast. This defaults to rectangular.
 */
export declare class LiveBroadcastContentDetailsProjection extends LiveBroadcastContentDetailsProjection_base {
}
declare const LiveBroadcastContentDetailsStereoLayout_base: S.Literal<["stereoLayoutUnspecified", "mono", "leftRight", "topBottom"]>;
/**
 * The 3D stereo layout of this broadcast. This defaults to mono.
 */
export declare class LiveBroadcastContentDetailsStereoLayout extends LiveBroadcastContentDetailsStereoLayout_base {
}
declare const LiveBroadcastContentDetails_base: S.Class<LiveBroadcastContentDetails, {
    /**
     * This value uniquely identifies the live stream bound to the broadcast.
     */
    boundStreamId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the live stream referenced by boundStreamId was last updated.
     */
    boundStreamLastUpdateTimeMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    closedCaptionsType: S.optionalWith<typeof LiveBroadcastContentDetailsClosedCaptionsType, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether auto start is enabled for this broadcast. The default value for this property is false. This setting can only be used by Events.
     */
    enableAutoStart: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether auto stop is enabled for this broadcast. The default value for this property is false. This setting can only be used by Events.
     */
    enableAutoStop: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether HTTP POST closed captioning is enabled for this broadcast. The ingestion URL of the closed captions is returned through the liveStreams API. This is mutually exclusive with using the closed_captions_type property, and is equivalent to setting closed_captions_type to CLOSED_CAPTIONS_HTTP_POST.
     */
    enableClosedCaptions: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether YouTube should enable content encryption for the broadcast.
     */
    enableContentEncryption: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting determines whether viewers can access DVR controls while watching the video. DVR controls enable the viewer to control the video playback experience by pausing, rewinding, or fast forwarding content. The default value for this property is true. *Important:* You must set the value to true and also set the enableArchive property's value to true if you want to make playback available immediately after the broadcast ends.
     */
    enableDvr: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether the broadcast video can be played in an embedded player. If you choose to archive the video (using the enableArchive property), this setting will also apply to the archived video.
     */
    enableEmbed: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether this broadcast has low latency enabled.
     */
    enableLowLatency: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * If both this and enable_low_latency are set, they must match. LATENCY_NORMAL should match enable_low_latency=false LATENCY_LOW should match enable_low_latency=true LATENCY_ULTRA_LOW should have enable_low_latency omitted.
     */
    latencyPreference: S.optionalWith<typeof LiveBroadcastContentDetailsLatencyPreference, {
        nullable: true;
    }>;
    /**
     * The mesh for projecting the video if projection is mesh. The mesh value must be a UTF-8 string containing the base-64 encoding of 3D mesh data that follows the Spherical Video V2 RFC specification for an mshp box, excluding the box size and type but including the following four reserved zero bytes for the version and flags.
     */
    mesh: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The monitorStream object contains information about the monitor stream, which the broadcaster can use to review the event content before the broadcast stream is shown publicly.
     */
    monitorStream: S.optionalWith<typeof MonitorStreamInfo, {
        nullable: true;
    }>;
    /**
     * The projection format of this broadcast. This defaults to rectangular.
     */
    projection: S.optionalWith<typeof LiveBroadcastContentDetailsProjection, {
        nullable: true;
    }>;
    /**
     * Automatically start recording after the event goes live. The default value for this property is true. *Important:* You must also set the enableDvr property's value to true if you want the playback to be available immediately after the broadcast ends. If you set this property's value to true but do not also set the enableDvr property to true, there may be a delay of around one day before the archived video will be available for playback.
     */
    recordFromStart: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether the broadcast should automatically begin with an in-stream slate when you update the broadcast's status to live. After updating the status, you then need to send a liveCuepoints.insert request that sets the cuepoint's eventState to end to remove the in-stream slate and make your broadcast stream visible to viewers.
     */
    startWithSlate: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The 3D stereo layout of this broadcast. This defaults to mono.
     */
    stereoLayout: S.optionalWith<typeof LiveBroadcastContentDetailsStereoLayout, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * This value uniquely identifies the live stream bound to the broadcast.
     */
    boundStreamId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the live stream referenced by boundStreamId was last updated.
     */
    boundStreamLastUpdateTimeMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    closedCaptionsType: S.optionalWith<typeof LiveBroadcastContentDetailsClosedCaptionsType, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether auto start is enabled for this broadcast. The default value for this property is false. This setting can only be used by Events.
     */
    enableAutoStart: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether auto stop is enabled for this broadcast. The default value for this property is false. This setting can only be used by Events.
     */
    enableAutoStop: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether HTTP POST closed captioning is enabled for this broadcast. The ingestion URL of the closed captions is returned through the liveStreams API. This is mutually exclusive with using the closed_captions_type property, and is equivalent to setting closed_captions_type to CLOSED_CAPTIONS_HTTP_POST.
     */
    enableClosedCaptions: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether YouTube should enable content encryption for the broadcast.
     */
    enableContentEncryption: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting determines whether viewers can access DVR controls while watching the video. DVR controls enable the viewer to control the video playback experience by pausing, rewinding, or fast forwarding content. The default value for this property is true. *Important:* You must set the value to true and also set the enableArchive property's value to true if you want to make playback available immediately after the broadcast ends.
     */
    enableDvr: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether the broadcast video can be played in an embedded player. If you choose to archive the video (using the enableArchive property), this setting will also apply to the archived video.
     */
    enableEmbed: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Indicates whether this broadcast has low latency enabled.
     */
    enableLowLatency: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * If both this and enable_low_latency are set, they must match. LATENCY_NORMAL should match enable_low_latency=false LATENCY_LOW should match enable_low_latency=true LATENCY_ULTRA_LOW should have enable_low_latency omitted.
     */
    latencyPreference: S.optionalWith<typeof LiveBroadcastContentDetailsLatencyPreference, {
        nullable: true;
    }>;
    /**
     * The mesh for projecting the video if projection is mesh. The mesh value must be a UTF-8 string containing the base-64 encoding of 3D mesh data that follows the Spherical Video V2 RFC specification for an mshp box, excluding the box size and type but including the following four reserved zero bytes for the version and flags.
     */
    mesh: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The monitorStream object contains information about the monitor stream, which the broadcaster can use to review the event content before the broadcast stream is shown publicly.
     */
    monitorStream: S.optionalWith<typeof MonitorStreamInfo, {
        nullable: true;
    }>;
    /**
     * The projection format of this broadcast. This defaults to rectangular.
     */
    projection: S.optionalWith<typeof LiveBroadcastContentDetailsProjection, {
        nullable: true;
    }>;
    /**
     * Automatically start recording after the event goes live. The default value for this property is true. *Important:* You must also set the enableDvr property's value to true if you want the playback to be available immediately after the broadcast ends. If you set this property's value to true but do not also set the enableDvr property to true, there may be a delay of around one day before the archived video will be available for playback.
     */
    recordFromStart: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This setting indicates whether the broadcast should automatically begin with an in-stream slate when you update the broadcast's status to live. After updating the status, you then need to send a liveCuepoints.insert request that sets the cuepoint's eventState to end to remove the in-stream slate and make your broadcast stream visible to viewers.
     */
    startWithSlate: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The 3D stereo layout of this broadcast. This defaults to mono.
     */
    stereoLayout: S.optionalWith<typeof LiveBroadcastContentDetailsStereoLayout, {
        nullable: true;
    }>;
}>, never, {
    readonly mesh?: string | undefined;
} & {
    readonly boundStreamId?: string | undefined;
} & {
    readonly boundStreamLastUpdateTimeMs?: string | undefined;
} & {
    readonly closedCaptionsType?: "closedCaptionsTypeUnspecified" | "closedCaptionsDisabled" | "closedCaptionsHttpPost" | "closedCaptionsEmbedded" | undefined;
} & {
    readonly enableAutoStart?: boolean | undefined;
} & {
    readonly enableAutoStop?: boolean | undefined;
} & {
    readonly enableClosedCaptions?: boolean | undefined;
} & {
    readonly enableContentEncryption?: boolean | undefined;
} & {
    readonly enableDvr?: boolean | undefined;
} & {
    readonly enableEmbed?: boolean | undefined;
} & {
    readonly enableLowLatency?: boolean | undefined;
} & {
    readonly latencyPreference?: "latencyPreferenceUnspecified" | "normal" | "low" | "ultraLow" | undefined;
} & {
    readonly monitorStream?: MonitorStreamInfo | undefined;
} & {
    readonly projection?: "projectionUnspecified" | "rectangular" | "360" | "mesh" | undefined;
} & {
    readonly recordFromStart?: boolean | undefined;
} & {
    readonly startWithSlate?: boolean | undefined;
} & {
    readonly stereoLayout?: "stereoLayoutUnspecified" | "mono" | "leftRight" | "topBottom" | undefined;
}, {}, {}>;
/**
 * Detailed settings of a broadcast.
 */
export declare class LiveBroadcastContentDetails extends LiveBroadcastContentDetails_base {
}
declare const LiveBroadcastSnippet_base: S.Class<LiveBroadcastSnippet, {
    /**
     * The date and time that the broadcast actually ended. This information is only available once the broadcast's state is complete.
     */
    actualEndTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the broadcast actually started. This information is only available once the broadcast's state is live.
     */
    actualStartTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the channel that is publishing the broadcast.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The broadcast's description. As with the title, you can set this field by modifying the broadcast resource or by setting the description field of the corresponding video resource.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Indicates whether this broadcast is the default broadcast. Internal only.
     */
    isDefaultBroadcast: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The id of the live chat for this broadcast.
     */
    liveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the broadcast was added to YouTube's live broadcast schedule.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the broadcast is scheduled to end.
     */
    scheduledEndTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the broadcast is scheduled to start.
     */
    scheduledStartTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the broadcast. For each nested object in this object, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The broadcast's title. Note that the broadcast represents exactly one YouTube video. You can set this field by modifying the broadcast resource or by setting the title field of the corresponding video resource.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The date and time that the broadcast actually ended. This information is only available once the broadcast's state is complete.
     */
    actualEndTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the broadcast actually started. This information is only available once the broadcast's state is live.
     */
    actualStartTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the channel that is publishing the broadcast.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The broadcast's description. As with the title, you can set this field by modifying the broadcast resource or by setting the description field of the corresponding video resource.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Indicates whether this broadcast is the default broadcast. Internal only.
     */
    isDefaultBroadcast: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The id of the live chat for this broadcast.
     */
    liveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the broadcast was added to YouTube's live broadcast schedule.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the broadcast is scheduled to end.
     */
    scheduledEndTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the broadcast is scheduled to start.
     */
    scheduledStartTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the broadcast. For each nested object in this object, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The broadcast's title. Note that the broadcast represents exactly one YouTube video. You can set this field by modifying the broadcast resource or by setting the title field of the corresponding video resource.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
} & {
    readonly actualEndTime?: string | undefined;
} & {
    readonly actualStartTime?: string | undefined;
} & {
    readonly isDefaultBroadcast?: boolean | undefined;
} & {
    readonly liveChatId?: string | undefined;
} & {
    readonly scheduledEndTime?: string | undefined;
} & {
    readonly scheduledStartTime?: string | undefined;
}, {}, {}>;
/**
 * Basic broadcast information.
 */
export declare class LiveBroadcastSnippet extends LiveBroadcastSnippet_base {
}
declare const LiveBroadcastStatistics_base: S.Class<LiveBroadcastStatistics, {
    /**
     * The number of viewers currently watching the broadcast. The property and its value will be present if the broadcast has current viewers and the broadcast owner has not hidden the viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers for a broadcast when the broadcast ends. So, this property would not identify the number of viewers watching an archived video of a live broadcast that already ended.
     */
    concurrentViewers: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The number of viewers currently watching the broadcast. The property and its value will be present if the broadcast has current viewers and the broadcast owner has not hidden the viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers for a broadcast when the broadcast ends. So, this property would not identify the number of viewers watching an archived video of a live broadcast that already ended.
     */
    concurrentViewers: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly concurrentViewers?: string | undefined;
}, {}, {}>;
/**
 * Statistics about the live broadcast. These represent a snapshot of the values at the time of the request. Statistics are only returned for live broadcasts.
 */
export declare class LiveBroadcastStatistics extends LiveBroadcastStatistics_base {
}
declare const LiveBroadcastStatusLifeCycleStatus_base: S.Literal<["lifeCycleStatusUnspecified", "created", "ready", "testing", "live", "complete", "revoked", "testStarting", "liveStarting"]>;
/**
 * The broadcast's status. The status can be updated using the API's liveBroadcasts.transition method.
 */
export declare class LiveBroadcastStatusLifeCycleStatus extends LiveBroadcastStatusLifeCycleStatus_base {
}
declare const LiveBroadcastStatusLiveBroadcastPriority_base: S.Literal<["liveBroadcastPriorityUnspecified", "low", "normal", "high"]>;
/**
 * Priority of the live broadcast event (internal state).
 */
export declare class LiveBroadcastStatusLiveBroadcastPriority extends LiveBroadcastStatusLiveBroadcastPriority_base {
}
declare const LiveBroadcastStatusPrivacyStatus_base: S.Literal<["public", "unlisted", "private"]>;
/**
 * The broadcast's privacy status. Note that the broadcast represents exactly one YouTube video, so the privacy settings are identical to those supported for videos. In addition, you can set this field by modifying the broadcast resource or by setting the privacyStatus field of the corresponding video resource.
 */
export declare class LiveBroadcastStatusPrivacyStatus extends LiveBroadcastStatusPrivacyStatus_base {
}
declare const LiveBroadcastStatusRecordingStatus_base: S.Literal<["liveBroadcastRecordingStatusUnspecified", "notRecording", "recording", "recorded"]>;
/**
 * The broadcast's recording status.
 */
export declare class LiveBroadcastStatusRecordingStatus extends LiveBroadcastStatusRecordingStatus_base {
}
declare const LiveBroadcastStatus_base: S.Class<LiveBroadcastStatus, {
    /**
     * The broadcast's status. The status can be updated using the API's liveBroadcasts.transition method.
     */
    lifeCycleStatus: S.optionalWith<typeof LiveBroadcastStatusLifeCycleStatus, {
        nullable: true;
    }>;
    /**
     * Priority of the live broadcast event (internal state).
     */
    liveBroadcastPriority: S.optionalWith<typeof LiveBroadcastStatusLiveBroadcastPriority, {
        nullable: true;
    }>;
    /**
     * Whether the broadcast is made for kids or not, decided by YouTube instead of the creator. This field is read only.
     */
    madeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The broadcast's privacy status. Note that the broadcast represents exactly one YouTube video, so the privacy settings are identical to those supported for videos. In addition, you can set this field by modifying the broadcast resource or by setting the privacyStatus field of the corresponding video resource.
     */
    privacyStatus: S.optionalWith<typeof LiveBroadcastStatusPrivacyStatus, {
        nullable: true;
    }>;
    /**
     * The broadcast's recording status.
     */
    recordingStatus: S.optionalWith<typeof LiveBroadcastStatusRecordingStatus, {
        nullable: true;
    }>;
    /**
     * This field will be set to True if the creator declares the broadcast to be kids only: go/live-cw-work.
     */
    selfDeclaredMadeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The broadcast's status. The status can be updated using the API's liveBroadcasts.transition method.
     */
    lifeCycleStatus: S.optionalWith<typeof LiveBroadcastStatusLifeCycleStatus, {
        nullable: true;
    }>;
    /**
     * Priority of the live broadcast event (internal state).
     */
    liveBroadcastPriority: S.optionalWith<typeof LiveBroadcastStatusLiveBroadcastPriority, {
        nullable: true;
    }>;
    /**
     * Whether the broadcast is made for kids or not, decided by YouTube instead of the creator. This field is read only.
     */
    madeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The broadcast's privacy status. Note that the broadcast represents exactly one YouTube video, so the privacy settings are identical to those supported for videos. In addition, you can set this field by modifying the broadcast resource or by setting the privacyStatus field of the corresponding video resource.
     */
    privacyStatus: S.optionalWith<typeof LiveBroadcastStatusPrivacyStatus, {
        nullable: true;
    }>;
    /**
     * The broadcast's recording status.
     */
    recordingStatus: S.optionalWith<typeof LiveBroadcastStatusRecordingStatus, {
        nullable: true;
    }>;
    /**
     * This field will be set to True if the creator declares the broadcast to be kids only: go/live-cw-work.
     */
    selfDeclaredMadeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>, never, {
    readonly madeForKids?: boolean | undefined;
} & {
    readonly privacyStatus?: "public" | "unlisted" | "private" | undefined;
} & {
    readonly selfDeclaredMadeForKids?: boolean | undefined;
} & {
    readonly lifeCycleStatus?: "lifeCycleStatusUnspecified" | "created" | "ready" | "testing" | "live" | "complete" | "revoked" | "testStarting" | "liveStarting" | undefined;
} & {
    readonly liveBroadcastPriority?: "high" | "normal" | "low" | "liveBroadcastPriorityUnspecified" | undefined;
} & {
    readonly recordingStatus?: "liveBroadcastRecordingStatusUnspecified" | "notRecording" | "recording" | "recorded" | undefined;
}, {}, {}>;
/**
 * Live broadcast state.
 */
export declare class LiveBroadcastStatus extends LiveBroadcastStatus_base {
}
declare const LiveBroadcast_base: S.Class<LiveBroadcast, {
    /**
     * The contentDetails object contains information about the event's video content, such as whether the content can be shown in an embedded video player or if it will be archived and therefore available for viewing after the event has concluded.
     */
    contentDetails: S.optionalWith<typeof LiveBroadcastContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the broadcast.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveBroadcast".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveBroadcast";
    }>;
    /**
     * The snippet object contains basic details about the event, including its title, description, start time, and end time.
     */
    snippet: S.optionalWith<typeof LiveBroadcastSnippet, {
        nullable: true;
    }>;
    /**
     * The statistics object contains info about the event's current stats. These include concurrent viewers and total chat count. Statistics can change (in either direction) during the lifetime of an event. Statistics are only returned while the event is live.
     */
    statistics: S.optionalWith<typeof LiveBroadcastStatistics, {
        nullable: true;
    }>;
    /**
     * The status object contains information about the event's status.
     */
    status: S.optionalWith<typeof LiveBroadcastStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The contentDetails object contains information about the event's video content, such as whether the content can be shown in an embedded video player or if it will be archived and therefore available for viewing after the event has concluded.
     */
    contentDetails: S.optionalWith<typeof LiveBroadcastContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the broadcast.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveBroadcast".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveBroadcast";
    }>;
    /**
     * The snippet object contains basic details about the event, including its title, description, start time, and end time.
     */
    snippet: S.optionalWith<typeof LiveBroadcastSnippet, {
        nullable: true;
    }>;
    /**
     * The statistics object contains info about the event's current stats. These include concurrent viewers and total chat count. Statistics can change (in either direction) during the lifetime of an event. Statistics are only returned while the event is live.
     */
    statistics: S.optionalWith<typeof LiveBroadcastStatistics, {
        nullable: true;
    }>;
    /**
     * The status object contains information about the event's status.
     */
    status: S.optionalWith<typeof LiveBroadcastStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: LiveBroadcastContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: LiveBroadcastSnippet | undefined;
} & {
    readonly status?: LiveBroadcastStatus | undefined;
} & {
    readonly statistics?: LiveBroadcastStatistics | undefined;
}, {}, {}>;
/**
 * A *liveBroadcast* resource represents an event that will be streamed, via live video, on YouTube.
 */
export declare class LiveBroadcast extends LiveBroadcast_base {
}
declare const LiveBroadcastListResponse_base: S.Class<LiveBroadcastListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of broadcasts that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof LiveBroadcast>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveBroadcastListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveBroadcastListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of broadcasts that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof LiveBroadcast>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveBroadcastListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveBroadcastListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly LiveBroadcast[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class LiveBroadcastListResponse extends LiveBroadcastListResponse_base {
}
declare const YoutubeLiveBroadcastsUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveBroadcastsUpdateParams extends YoutubeLiveBroadcastsUpdateParams_base {
}
declare const YoutubeLiveBroadcastsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveBroadcastsInsertParams extends YoutubeLiveBroadcastsInsertParams_base {
}
declare const YoutubeLiveBroadcastsDeleteParams_base: S.Struct<{
    id: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveBroadcastsDeleteParams extends YoutubeLiveBroadcastsDeleteParams_base {
}
declare const YoutubeLiveBroadcastsBindParams_base: S.Struct<{
    id: typeof S.String;
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    streamId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveBroadcastsBindParams extends YoutubeLiveBroadcastsBindParams_base {
}
declare const YoutubeLiveBroadcastsInsertCuepointParams_base: S.Struct<{
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    part: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveBroadcastsInsertCuepointParams extends YoutubeLiveBroadcastsInsertCuepointParams_base {
}
declare const CuepointCueType_base: S.Literal<["cueTypeUnspecified", "cueTypeAd"]>;
export declare class CuepointCueType extends CuepointCueType_base {
}
declare const Cuepoint_base: S.Class<Cuepoint, {
    cueType: S.optionalWith<typeof CuepointCueType, {
        nullable: true;
    }>;
    /**
     * The duration of this cuepoint.
     */
    durationSecs: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The identifier for cuepoint resource.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time when the cuepoint should be inserted by offset to the broadcast actual start time.
     */
    insertionOffsetTimeMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The wall clock time at which the cuepoint should be inserted. Only one of insertion_offset_time_ms and walltime_ms may be set at a time.
     */
    walltimeMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    cueType: S.optionalWith<typeof CuepointCueType, {
        nullable: true;
    }>;
    /**
     * The duration of this cuepoint.
     */
    durationSecs: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The identifier for cuepoint resource.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time when the cuepoint should be inserted by offset to the broadcast actual start time.
     */
    insertionOffsetTimeMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The wall clock time at which the cuepoint should be inserted. Only one of insertion_offset_time_ms and walltime_ms may be set at a time.
     */
    walltimeMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly cueType?: "cueTypeUnspecified" | "cueTypeAd" | undefined;
} & {
    readonly durationSecs?: number | undefined;
} & {
    readonly insertionOffsetTimeMs?: string | undefined;
} & {
    readonly walltimeMs?: string | undefined;
}, {}, {}>;
/**
 * Note that there may be a 5-second end-point resolution issue. For instance, if a cuepoint comes in for 22:03:27, we may stuff the cuepoint into 22:03:25 or 22:03:30, depending. This is an artifact of HLS.
 */
export declare class Cuepoint extends Cuepoint_base {
}
declare const YoutubeLiveBroadcastsTransitionParamsBroadcastStatus_base: S.Literal<["statusUnspecified", "testing", "live", "complete"]>;
export declare class YoutubeLiveBroadcastsTransitionParamsBroadcastStatus extends YoutubeLiveBroadcastsTransitionParamsBroadcastStatus_base {
}
declare const YoutubeLiveBroadcastsTransitionParams_base: S.Struct<{
    broadcastStatus: typeof YoutubeLiveBroadcastsTransitionParamsBroadcastStatus;
    id: typeof S.String;
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveBroadcastsTransitionParams extends YoutubeLiveBroadcastsTransitionParams_base {
}
declare const YoutubeLiveChatBansInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeLiveChatBansInsertParams extends YoutubeLiveChatBansInsertParams_base {
}
declare const ChannelProfileDetails_base: S.Class<ChannelProfileDetails, {
    /**
     * The YouTube channel ID.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel's URL.
     */
    channelUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel's display name.
     */
    displayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channels's avatar URL.
     */
    profileImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The YouTube channel ID.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel's URL.
     */
    channelUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel's display name.
     */
    displayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channels's avatar URL.
     */
    profileImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly channelId?: string | undefined;
} & {
    readonly channelUrl?: string | undefined;
} & {
    readonly displayName?: string | undefined;
} & {
    readonly profileImageUrl?: string | undefined;
}, {}, {}>;
export declare class ChannelProfileDetails extends ChannelProfileDetails_base {
}
declare const LiveChatBanSnippetType_base: S.Literal<["liveChatBanTypeUnspecified", "permanent", "temporary"]>;
/**
 * The type of ban.
 */
export declare class LiveChatBanSnippetType extends LiveChatBanSnippetType_base {
}
declare const LiveChatBanSnippet_base: S.Class<LiveChatBanSnippet, {
    /**
     * The duration of a ban, only filled if the ban has type TEMPORARY.
     */
    banDurationSeconds: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    bannedUserDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
    /**
     * The chat this ban is pertinent to.
     */
    liveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of ban.
     */
    type: S.optionalWith<typeof LiveChatBanSnippetType, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The duration of a ban, only filled if the ban has type TEMPORARY.
     */
    banDurationSeconds: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    bannedUserDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
    /**
     * The chat this ban is pertinent to.
     */
    liveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of ban.
     */
    type: S.optionalWith<typeof LiveChatBanSnippetType, {
        nullable: true;
    }>;
}>, never, {
    readonly type?: "liveChatBanTypeUnspecified" | "permanent" | "temporary" | undefined;
} & {
    readonly liveChatId?: string | undefined;
} & {
    readonly banDurationSeconds?: string | undefined;
} & {
    readonly bannedUserDetails?: ChannelProfileDetails | undefined;
}, {}, {}>;
export declare class LiveChatBanSnippet extends LiveChatBanSnippet_base {
}
declare const LiveChatBan_base: S.Class<LiveChatBan, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the ban.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#liveChatBan"`.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatBan";
    }>;
    /**
     * The `snippet` object contains basic details about the ban.
     */
    snippet: S.optionalWith<typeof LiveChatBanSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the ban.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#liveChatBan"`.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatBan";
    }>;
    /**
     * The `snippet` object contains basic details about the ban.
     */
    snippet: S.optionalWith<typeof LiveChatBanSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: LiveChatBanSnippet | undefined;
}, {}, {}>;
/**
 * A `__liveChatBan__` resource represents a ban for a YouTube live chat.
 */
export declare class LiveChatBan extends LiveChatBan_base {
}
declare const YoutubeLiveChatBansDeleteParams_base: S.Struct<{
    id: typeof S.String;
}>;
export declare class YoutubeLiveChatBansDeleteParams extends YoutubeLiveChatBansDeleteParams_base {
}
declare const YoutubeLiveChatMessagesListParams_base: S.Struct<{
    liveChatId: typeof S.String;
    part: S.Array$<typeof S.String>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    profileImageSize: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveChatMessagesListParams extends YoutubeLiveChatMessagesListParams_base {
}
declare const LiveChatMessageAuthorDetails_base: S.Class<LiveChatMessageAuthorDetails, {
    /**
     * The YouTube channel ID.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel's URL.
     */
    channelUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel's display name.
     */
    displayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether the author is a moderator of the live chat.
     */
    isChatModerator: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether the author is the owner of the live chat.
     */
    isChatOwner: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether the author is a sponsor of the live chat.
     */
    isChatSponsor: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether the author's identity has been verified by YouTube.
     */
    isVerified: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The channels's avatar URL.
     */
    profileImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The YouTube channel ID.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel's URL.
     */
    channelUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel's display name.
     */
    displayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Whether the author is a moderator of the live chat.
     */
    isChatModerator: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether the author is the owner of the live chat.
     */
    isChatOwner: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether the author is a sponsor of the live chat.
     */
    isChatSponsor: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Whether the author's identity has been verified by YouTube.
     */
    isVerified: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The channels's avatar URL.
     */
    profileImageUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly channelId?: string | undefined;
} & {
    readonly channelUrl?: string | undefined;
} & {
    readonly displayName?: string | undefined;
} & {
    readonly profileImageUrl?: string | undefined;
} & {
    readonly isChatModerator?: boolean | undefined;
} & {
    readonly isChatOwner?: boolean | undefined;
} & {
    readonly isChatSponsor?: boolean | undefined;
} & {
    readonly isVerified?: boolean | undefined;
}, {}, {}>;
export declare class LiveChatMessageAuthorDetails extends LiveChatMessageAuthorDetails_base {
}
declare const LiveChatFanFundingEventDetails_base: S.Class<LiveChatFanFundingEventDetails, {
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    amountDisplayString: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The amount of the fund.
     */
    amountMicros: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The currency in which the fund was made.
     */
    currency: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The comment added by the user to this fan funding event.
     */
    userComment: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    amountDisplayString: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The amount of the fund.
     */
    amountMicros: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The currency in which the fund was made.
     */
    currency: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The comment added by the user to this fan funding event.
     */
    userComment: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly amountDisplayString?: string | undefined;
} & {
    readonly amountMicros?: string | undefined;
} & {
    readonly currency?: string | undefined;
} & {
    readonly userComment?: string | undefined;
}, {}, {}>;
export declare class LiveChatFanFundingEventDetails extends LiveChatFanFundingEventDetails_base {
}
declare const LiveChatGiftMembershipReceivedDetails_base: S.Class<LiveChatGiftMembershipReceivedDetails, {
    /**
     * The ID of the membership gifting message that is related to this gift membership. This ID will always refer to a message whose type is 'membershipGiftingEvent'.
     */
    associatedMembershipGiftingMessageId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID of the user that made the membership gifting purchase. This matches the `snippet.authorChannelId` of the associated membership gifting message.
     */
    gifterChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The name of the Level at which the viewer is a member. This matches the `snippet.membershipGiftingDetails.giftMembershipsLevelName` of the associated membership gifting message. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    memberLevelName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID of the membership gifting message that is related to this gift membership. This ID will always refer to a message whose type is 'membershipGiftingEvent'.
     */
    associatedMembershipGiftingMessageId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID of the user that made the membership gifting purchase. This matches the `snippet.authorChannelId` of the associated membership gifting message.
     */
    gifterChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The name of the Level at which the viewer is a member. This matches the `snippet.membershipGiftingDetails.giftMembershipsLevelName` of the associated membership gifting message. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    memberLevelName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly associatedMembershipGiftingMessageId?: string | undefined;
} & {
    readonly gifterChannelId?: string | undefined;
} & {
    readonly memberLevelName?: string | undefined;
}, {}, {}>;
export declare class LiveChatGiftMembershipReceivedDetails extends LiveChatGiftMembershipReceivedDetails_base {
}
declare const LiveChatMemberMilestoneChatDetails_base: S.Class<LiveChatMemberMilestoneChatDetails, {
    /**
     * The name of the Level at which the viever is a member. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    memberLevelName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The total amount of months (rounded up) the viewer has been a member that granted them this Member Milestone Chat. This is the same number of months as is being displayed to YouTube users.
     */
    memberMonth: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The comment added by the member to this Member Milestone Chat. This field is empty for messages without a comment from the member.
     */
    userComment: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The name of the Level at which the viever is a member. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    memberLevelName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The total amount of months (rounded up) the viewer has been a member that granted them this Member Milestone Chat. This is the same number of months as is being displayed to YouTube users.
     */
    memberMonth: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The comment added by the member to this Member Milestone Chat. This field is empty for messages without a comment from the member.
     */
    userComment: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly userComment?: string | undefined;
} & {
    readonly memberLevelName?: string | undefined;
} & {
    readonly memberMonth?: number | undefined;
}, {}, {}>;
export declare class LiveChatMemberMilestoneChatDetails extends LiveChatMemberMilestoneChatDetails_base {
}
declare const LiveChatMembershipGiftingDetails_base: S.Class<LiveChatMembershipGiftingDetails, {
    /**
     * The number of gift memberships purchased by the user.
     */
    giftMembershipsCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The name of the level of the gift memberships purchased by the user. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    giftMembershipsLevelName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The number of gift memberships purchased by the user.
     */
    giftMembershipsCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The name of the level of the gift memberships purchased by the user. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    giftMembershipsLevelName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly giftMembershipsCount?: number | undefined;
} & {
    readonly giftMembershipsLevelName?: string | undefined;
}, {}, {}>;
export declare class LiveChatMembershipGiftingDetails extends LiveChatMembershipGiftingDetails_base {
}
declare const LiveChatMessageDeletedDetails_base: S.Class<LiveChatMessageDeletedDetails, {
    deletedMessageId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    deletedMessageId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly deletedMessageId?: string | undefined;
}, {}, {}>;
export declare class LiveChatMessageDeletedDetails extends LiveChatMessageDeletedDetails_base {
}
declare const LiveChatMessageRetractedDetails_base: S.Class<LiveChatMessageRetractedDetails, {
    retractedMessageId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    retractedMessageId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly retractedMessageId?: string | undefined;
}, {}, {}>;
export declare class LiveChatMessageRetractedDetails extends LiveChatMessageRetractedDetails_base {
}
declare const LiveChatNewSponsorDetails_base: S.Class<LiveChatNewSponsorDetails, {
    /**
     * If the viewer just had upgraded from a lower level. For viewers that were not members at the time of purchase, this field is false.
     */
    isUpgrade: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The name of the Level that the viewer just had joined. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    memberLevelName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * If the viewer just had upgraded from a lower level. For viewers that were not members at the time of purchase, this field is false.
     */
    isUpgrade: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The name of the Level that the viewer just had joined. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    memberLevelName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly memberLevelName?: string | undefined;
} & {
    readonly isUpgrade?: boolean | undefined;
}, {}, {}>;
export declare class LiveChatNewSponsorDetails extends LiveChatNewSponsorDetails_base {
}
declare const LiveChatSuperChatDetails_base: S.Class<LiveChatSuperChatDetails, {
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    amountDisplayString: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The amount purchased by the user, in micros (1,750,000 micros = 1.75).
     */
    amountMicros: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The currency in which the purchase was made.
     */
    currency: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The tier in which the amount belongs. Lower amounts belong to lower tiers. The lowest tier is 1.
     */
    tier: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The comment added by the user to this Super Chat event.
     */
    userComment: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    amountDisplayString: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The amount purchased by the user, in micros (1,750,000 micros = 1.75).
     */
    amountMicros: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The currency in which the purchase was made.
     */
    currency: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The tier in which the amount belongs. Lower amounts belong to lower tiers. The lowest tier is 1.
     */
    tier: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The comment added by the user to this Super Chat event.
     */
    userComment: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly amountDisplayString?: string | undefined;
} & {
    readonly amountMicros?: string | undefined;
} & {
    readonly currency?: string | undefined;
} & {
    readonly userComment?: string | undefined;
} & {
    readonly tier?: number | undefined;
}, {}, {}>;
export declare class LiveChatSuperChatDetails extends LiveChatSuperChatDetails_base {
}
declare const SuperStickerMetadata_base: S.Class<SuperStickerMetadata, {
    /**
     * Internationalized alt text that describes the sticker image and any animation associated with it.
     */
    altText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Specifies the localization language in which the alt text is returned.
     */
    altTextLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Unique identifier of the Super Sticker. This is a shorter form of the alt_text that includes pack name and a recognizable characteristic of the sticker.
     */
    stickerId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Internationalized alt text that describes the sticker image and any animation associated with it.
     */
    altText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Specifies the localization language in which the alt text is returned.
     */
    altTextLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Unique identifier of the Super Sticker. This is a shorter form of the alt_text that includes pack name and a recognizable characteristic of the sticker.
     */
    stickerId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly altText?: string | undefined;
} & {
    readonly altTextLanguage?: string | undefined;
} & {
    readonly stickerId?: string | undefined;
}, {}, {}>;
export declare class SuperStickerMetadata extends SuperStickerMetadata_base {
}
declare const LiveChatSuperStickerDetails_base: S.Class<LiveChatSuperStickerDetails, {
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    amountDisplayString: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The amount purchased by the user, in micros (1,750,000 micros = 1.75).
     */
    amountMicros: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The currency in which the purchase was made.
     */
    currency: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Information about the Super Sticker.
     */
    superStickerMetadata: S.optionalWith<typeof SuperStickerMetadata, {
        nullable: true;
    }>;
    /**
     * The tier in which the amount belongs. Lower amounts belong to lower tiers. The lowest tier is 1.
     */
    tier: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    amountDisplayString: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The amount purchased by the user, in micros (1,750,000 micros = 1.75).
     */
    amountMicros: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The currency in which the purchase was made.
     */
    currency: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Information about the Super Sticker.
     */
    superStickerMetadata: S.optionalWith<typeof SuperStickerMetadata, {
        nullable: true;
    }>;
    /**
     * The tier in which the amount belongs. Lower amounts belong to lower tiers. The lowest tier is 1.
     */
    tier: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}>, never, {
    readonly amountDisplayString?: string | undefined;
} & {
    readonly amountMicros?: string | undefined;
} & {
    readonly currency?: string | undefined;
} & {
    readonly tier?: number | undefined;
} & {
    readonly superStickerMetadata?: SuperStickerMetadata | undefined;
}, {}, {}>;
export declare class LiveChatSuperStickerDetails extends LiveChatSuperStickerDetails_base {
}
declare const LiveChatTextMessageDetails_base: S.Class<LiveChatTextMessageDetails, {
    /**
     * The user's message.
     */
    messageText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The user's message.
     */
    messageText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly messageText?: string | undefined;
}, {}, {}>;
export declare class LiveChatTextMessageDetails extends LiveChatTextMessageDetails_base {
}
declare const LiveChatMessageSnippetType_base: S.Literal<["invalidType", "textMessageEvent", "tombstone", "fanFundingEvent", "chatEndedEvent", "sponsorOnlyModeStartedEvent", "sponsorOnlyModeEndedEvent", "newSponsorEvent", "memberMilestoneChatEvent", "membershipGiftingEvent", "giftMembershipReceivedEvent", "messageDeletedEvent", "messageRetractedEvent", "userBannedEvent", "superChatEvent", "superStickerEvent"]>;
/**
 * The type of message, this will always be present, it determines the contents of the message as well as which fields will be present.
 */
export declare class LiveChatMessageSnippetType extends LiveChatMessageSnippetType_base {
}
declare const LiveChatUserBannedMessageDetailsBanType_base: S.Literal<["permanent", "temporary"]>;
/**
 * The type of ban.
 */
export declare class LiveChatUserBannedMessageDetailsBanType extends LiveChatUserBannedMessageDetailsBanType_base {
}
declare const LiveChatUserBannedMessageDetails_base: S.Class<LiveChatUserBannedMessageDetails, {
    /**
     * The duration of the ban. This property is only present if the banType is temporary.
     */
    banDurationSeconds: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of ban.
     */
    banType: S.optionalWith<typeof LiveChatUserBannedMessageDetailsBanType, {
        nullable: true;
    }>;
    /**
     * The details of the user that was banned.
     */
    bannedUserDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The duration of the ban. This property is only present if the banType is temporary.
     */
    banDurationSeconds: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The type of ban.
     */
    banType: S.optionalWith<typeof LiveChatUserBannedMessageDetailsBanType, {
        nullable: true;
    }>;
    /**
     * The details of the user that was banned.
     */
    bannedUserDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
}>, never, {
    readonly banDurationSeconds?: string | undefined;
} & {
    readonly bannedUserDetails?: ChannelProfileDetails | undefined;
} & {
    readonly banType?: "permanent" | "temporary" | undefined;
}, {}, {}>;
export declare class LiveChatUserBannedMessageDetails extends LiveChatUserBannedMessageDetails_base {
}
declare const LiveChatMessageSnippet_base: S.Class<LiveChatMessageSnippet, {
    /**
     * The ID of the user that authored this message, this field is not always filled. textMessageEvent - the user that wrote the message fanFundingEvent - the user that funded the broadcast newSponsorEvent - the user that just became a sponsor memberMilestoneChatEvent - the member that sent the message membershipGiftingEvent - the user that made the purchase giftMembershipReceivedEvent - the user that received the gift membership messageDeletedEvent - the moderator that took the action messageRetractedEvent - the author that retracted their message userBannedEvent - the moderator that took the action superChatEvent - the user that made the purchase superStickerEvent - the user that made the purchase
     */
    authorChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Contains a string that can be displayed to the user. If this field is not present the message is silent, at the moment only messages of type TOMBSTONE and CHAT_ENDED_EVENT are silent.
     */
    displayMessage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the funding event, this is only set if the type is 'fanFundingEvent'.
     */
    fanFundingEventDetails: S.optionalWith<typeof LiveChatFanFundingEventDetails, {
        nullable: true;
    }>;
    /**
     * Details about the Gift Membership Received event, this is only set if the type is 'giftMembershipReceivedEvent'.
     */
    giftMembershipReceivedDetails: S.optionalWith<typeof LiveChatGiftMembershipReceivedDetails, {
        nullable: true;
    }>;
    /**
     * Whether the message has display content that should be displayed to users.
     */
    hasDisplayContent: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    liveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the Member Milestone Chat event, this is only set if the type is 'memberMilestoneChatEvent'.
     */
    memberMilestoneChatDetails: S.optionalWith<typeof LiveChatMemberMilestoneChatDetails, {
        nullable: true;
    }>;
    /**
     * Details about the Membership Gifting event, this is only set if the type is 'membershipGiftingEvent'.
     */
    membershipGiftingDetails: S.optionalWith<typeof LiveChatMembershipGiftingDetails, {
        nullable: true;
    }>;
    messageDeletedDetails: S.optionalWith<typeof LiveChatMessageDeletedDetails, {
        nullable: true;
    }>;
    messageRetractedDetails: S.optionalWith<typeof LiveChatMessageRetractedDetails, {
        nullable: true;
    }>;
    /**
     * Details about the New Member Announcement event, this is only set if the type is 'newSponsorEvent'. Please note that "member" is the new term for "sponsor".
     */
    newSponsorDetails: S.optionalWith<typeof LiveChatNewSponsorDetails, {
        nullable: true;
    }>;
    /**
     * The date and time when the message was orignally published.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the Super Chat event, this is only set if the type is 'superChatEvent'.
     */
    superChatDetails: S.optionalWith<typeof LiveChatSuperChatDetails, {
        nullable: true;
    }>;
    /**
     * Details about the Super Sticker event, this is only set if the type is 'superStickerEvent'.
     */
    superStickerDetails: S.optionalWith<typeof LiveChatSuperStickerDetails, {
        nullable: true;
    }>;
    /**
     * Details about the text message, this is only set if the type is 'textMessageEvent'.
     */
    textMessageDetails: S.optionalWith<typeof LiveChatTextMessageDetails, {
        nullable: true;
    }>;
    /**
     * The type of message, this will always be present, it determines the contents of the message as well as which fields will be present.
     */
    type: S.optionalWith<typeof LiveChatMessageSnippetType, {
        nullable: true;
    }>;
    userBannedDetails: S.optionalWith<typeof LiveChatUserBannedMessageDetails, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID of the user that authored this message, this field is not always filled. textMessageEvent - the user that wrote the message fanFundingEvent - the user that funded the broadcast newSponsorEvent - the user that just became a sponsor memberMilestoneChatEvent - the member that sent the message membershipGiftingEvent - the user that made the purchase giftMembershipReceivedEvent - the user that received the gift membership messageDeletedEvent - the moderator that took the action messageRetractedEvent - the author that retracted their message userBannedEvent - the moderator that took the action superChatEvent - the user that made the purchase superStickerEvent - the user that made the purchase
     */
    authorChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Contains a string that can be displayed to the user. If this field is not present the message is silent, at the moment only messages of type TOMBSTONE and CHAT_ENDED_EVENT are silent.
     */
    displayMessage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the funding event, this is only set if the type is 'fanFundingEvent'.
     */
    fanFundingEventDetails: S.optionalWith<typeof LiveChatFanFundingEventDetails, {
        nullable: true;
    }>;
    /**
     * Details about the Gift Membership Received event, this is only set if the type is 'giftMembershipReceivedEvent'.
     */
    giftMembershipReceivedDetails: S.optionalWith<typeof LiveChatGiftMembershipReceivedDetails, {
        nullable: true;
    }>;
    /**
     * Whether the message has display content that should be displayed to users.
     */
    hasDisplayContent: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    liveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the Member Milestone Chat event, this is only set if the type is 'memberMilestoneChatEvent'.
     */
    memberMilestoneChatDetails: S.optionalWith<typeof LiveChatMemberMilestoneChatDetails, {
        nullable: true;
    }>;
    /**
     * Details about the Membership Gifting event, this is only set if the type is 'membershipGiftingEvent'.
     */
    membershipGiftingDetails: S.optionalWith<typeof LiveChatMembershipGiftingDetails, {
        nullable: true;
    }>;
    messageDeletedDetails: S.optionalWith<typeof LiveChatMessageDeletedDetails, {
        nullable: true;
    }>;
    messageRetractedDetails: S.optionalWith<typeof LiveChatMessageRetractedDetails, {
        nullable: true;
    }>;
    /**
     * Details about the New Member Announcement event, this is only set if the type is 'newSponsorEvent'. Please note that "member" is the new term for "sponsor".
     */
    newSponsorDetails: S.optionalWith<typeof LiveChatNewSponsorDetails, {
        nullable: true;
    }>;
    /**
     * The date and time when the message was orignally published.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the Super Chat event, this is only set if the type is 'superChatEvent'.
     */
    superChatDetails: S.optionalWith<typeof LiveChatSuperChatDetails, {
        nullable: true;
    }>;
    /**
     * Details about the Super Sticker event, this is only set if the type is 'superStickerEvent'.
     */
    superStickerDetails: S.optionalWith<typeof LiveChatSuperStickerDetails, {
        nullable: true;
    }>;
    /**
     * Details about the text message, this is only set if the type is 'textMessageEvent'.
     */
    textMessageDetails: S.optionalWith<typeof LiveChatTextMessageDetails, {
        nullable: true;
    }>;
    /**
     * The type of message, this will always be present, it determines the contents of the message as well as which fields will be present.
     */
    type: S.optionalWith<typeof LiveChatMessageSnippetType, {
        nullable: true;
    }>;
    userBannedDetails: S.optionalWith<typeof LiveChatUserBannedMessageDetails, {
        nullable: true;
    }>;
}>, never, {
    readonly publishedAt?: string | undefined;
} & {
    readonly type?: "invalidType" | "textMessageEvent" | "tombstone" | "fanFundingEvent" | "chatEndedEvent" | "sponsorOnlyModeStartedEvent" | "sponsorOnlyModeEndedEvent" | "newSponsorEvent" | "memberMilestoneChatEvent" | "membershipGiftingEvent" | "giftMembershipReceivedEvent" | "messageDeletedEvent" | "messageRetractedEvent" | "userBannedEvent" | "superChatEvent" | "superStickerEvent" | undefined;
} & {
    readonly authorChannelId?: string | undefined;
} & {
    readonly liveChatId?: string | undefined;
} & {
    readonly displayMessage?: string | undefined;
} & {
    readonly fanFundingEventDetails?: LiveChatFanFundingEventDetails | undefined;
} & {
    readonly giftMembershipReceivedDetails?: LiveChatGiftMembershipReceivedDetails | undefined;
} & {
    readonly hasDisplayContent?: boolean | undefined;
} & {
    readonly memberMilestoneChatDetails?: LiveChatMemberMilestoneChatDetails | undefined;
} & {
    readonly membershipGiftingDetails?: LiveChatMembershipGiftingDetails | undefined;
} & {
    readonly messageDeletedDetails?: LiveChatMessageDeletedDetails | undefined;
} & {
    readonly messageRetractedDetails?: LiveChatMessageRetractedDetails | undefined;
} & {
    readonly newSponsorDetails?: LiveChatNewSponsorDetails | undefined;
} & {
    readonly superChatDetails?: LiveChatSuperChatDetails | undefined;
} & {
    readonly superStickerDetails?: LiveChatSuperStickerDetails | undefined;
} & {
    readonly textMessageDetails?: LiveChatTextMessageDetails | undefined;
} & {
    readonly userBannedDetails?: LiveChatUserBannedMessageDetails | undefined;
}, {}, {}>;
/**
 * Next ID: 33
 */
export declare class LiveChatMessageSnippet extends LiveChatMessageSnippet_base {
}
declare const LiveChatMessage_base: S.Class<LiveChatMessage, {
    /**
     * The authorDetails object contains basic details about the user that posted this message.
     */
    authorDetails: S.optionalWith<typeof LiveChatMessageAuthorDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the message.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatMessage".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatMessage";
    }>;
    /**
     * The snippet object contains basic details about the message.
     */
    snippet: S.optionalWith<typeof LiveChatMessageSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The authorDetails object contains basic details about the user that posted this message.
     */
    authorDetails: S.optionalWith<typeof LiveChatMessageAuthorDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the message.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatMessage".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatMessage";
    }>;
    /**
     * The snippet object contains basic details about the message.
     */
    snippet: S.optionalWith<typeof LiveChatMessageSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: LiveChatMessageSnippet | undefined;
} & {
    readonly authorDetails?: LiveChatMessageAuthorDetails | undefined;
}, {}, {}>;
/**
 * A *liveChatMessage* resource represents a chat message in a YouTube Live Chat.
 */
export declare class LiveChatMessage extends LiveChatMessage_base {
}
declare const LiveChatMessageListResponse_base: S.Class<LiveChatMessageListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof LiveChatMessage>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatMessageListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatMessageListResponse";
    }>;
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the underlying stream went offline.
     */
    offlineAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The amount of time the client should wait before polling again.
     */
    pollingIntervalMillis: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof LiveChatMessage>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatMessageListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatMessageListResponse";
    }>;
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the underlying stream went offline.
     */
    offlineAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The amount of time the client should wait before polling again.
     */
    pollingIntervalMillis: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly LiveChatMessage[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
} & {
    readonly offlineAt?: string | undefined;
} & {
    readonly pollingIntervalMillis?: number | undefined;
}, {}, {}>;
export declare class LiveChatMessageListResponse extends LiveChatMessageListResponse_base {
}
declare const YoutubeLiveChatMessagesInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeLiveChatMessagesInsertParams extends YoutubeLiveChatMessagesInsertParams_base {
}
declare const YoutubeLiveChatMessagesDeleteParams_base: S.Struct<{
    id: typeof S.String;
}>;
export declare class YoutubeLiveChatMessagesDeleteParams extends YoutubeLiveChatMessagesDeleteParams_base {
}
declare const YoutubeLiveChatModeratorsListParams_base: S.Struct<{
    liveChatId: typeof S.String;
    part: S.Array$<typeof S.String>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveChatModeratorsListParams extends YoutubeLiveChatModeratorsListParams_base {
}
declare const LiveChatModeratorSnippet_base: S.Class<LiveChatModeratorSnippet, {
    /**
     * The ID of the live chat this moderator can act on.
     */
    liveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the moderator.
     */
    moderatorDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID of the live chat this moderator can act on.
     */
    liveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the moderator.
     */
    moderatorDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
}>, never, {
    readonly liveChatId?: string | undefined;
} & {
    readonly moderatorDetails?: ChannelProfileDetails | undefined;
}, {}, {}>;
export declare class LiveChatModeratorSnippet extends LiveChatModeratorSnippet_base {
}
declare const LiveChatModerator_base: S.Class<LiveChatModerator, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the moderator.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatModerator".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatModerator";
    }>;
    /**
     * The snippet object contains basic details about the moderator.
     */
    snippet: S.optionalWith<typeof LiveChatModeratorSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the moderator.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatModerator".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatModerator";
    }>;
    /**
     * The snippet object contains basic details about the moderator.
     */
    snippet: S.optionalWith<typeof LiveChatModeratorSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: LiveChatModeratorSnippet | undefined;
}, {}, {}>;
/**
 * A *liveChatModerator* resource represents a moderator for a YouTube live chat. A chat moderator has the ability to ban/unban users from a chat, remove message, etc.
 */
export declare class LiveChatModerator extends LiveChatModerator_base {
}
declare const LiveChatModeratorListResponse_base: S.Class<LiveChatModeratorListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of moderators that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof LiveChatModerator>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatModeratorListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatModeratorListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of moderators that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof LiveChatModerator>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatModeratorListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveChatModeratorListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly LiveChatModerator[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class LiveChatModeratorListResponse extends LiveChatModeratorListResponse_base {
}
declare const YoutubeLiveChatModeratorsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeLiveChatModeratorsInsertParams extends YoutubeLiveChatModeratorsInsertParams_base {
}
declare const YoutubeLiveChatModeratorsDeleteParams_base: S.Struct<{
    id: typeof S.String;
}>;
export declare class YoutubeLiveChatModeratorsDeleteParams extends YoutubeLiveChatModeratorsDeleteParams_base {
}
declare const YoutubeLiveStreamsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    mine: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveStreamsListParams extends YoutubeLiveStreamsListParams_base {
}
declare const CdnSettingsFrameRate_base: S.Literal<["30fps", "60fps", "variable"]>;
/**
 * The frame rate of the inbound video data.
 */
export declare class CdnSettingsFrameRate extends CdnSettingsFrameRate_base {
}
declare const IngestionInfo_base: S.Class<IngestionInfo, {
    /**
     * The backup ingestion URL that you should use to stream video to YouTube. You have the option of simultaneously streaming the content that you are sending to the ingestionAddress to this URL.
     */
    backupIngestionAddress: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The primary ingestion URL that you should use to stream video to YouTube. You must stream video to this URL. Depending on which application or tool you use to encode your video stream, you may need to enter the stream URL and stream name separately or you may need to concatenate them in the following format: *STREAM_URL/STREAM_NAME*
     */
    ingestionAddress: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This ingestion url may be used instead of backupIngestionAddress in order to stream via RTMPS. Not applicable to non-RTMP streams.
     */
    rtmpsBackupIngestionAddress: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This ingestion url may be used instead of ingestionAddress in order to stream via RTMPS. Not applicable to non-RTMP streams.
     */
    rtmpsIngestionAddress: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The stream name that YouTube assigns to the video stream.
     */
    streamName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The backup ingestion URL that you should use to stream video to YouTube. You have the option of simultaneously streaming the content that you are sending to the ingestionAddress to this URL.
     */
    backupIngestionAddress: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The primary ingestion URL that you should use to stream video to YouTube. You must stream video to this URL. Depending on which application or tool you use to encode your video stream, you may need to enter the stream URL and stream name separately or you may need to concatenate them in the following format: *STREAM_URL/STREAM_NAME*
     */
    ingestionAddress: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This ingestion url may be used instead of backupIngestionAddress in order to stream via RTMPS. Not applicable to non-RTMP streams.
     */
    rtmpsBackupIngestionAddress: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This ingestion url may be used instead of ingestionAddress in order to stream via RTMPS. Not applicable to non-RTMP streams.
     */
    rtmpsIngestionAddress: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The stream name that YouTube assigns to the video stream.
     */
    streamName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly backupIngestionAddress?: string | undefined;
} & {
    readonly ingestionAddress?: string | undefined;
} & {
    readonly rtmpsBackupIngestionAddress?: string | undefined;
} & {
    readonly rtmpsIngestionAddress?: string | undefined;
} & {
    readonly streamName?: string | undefined;
}, {}, {}>;
/**
 * Describes information necessary for ingesting an RTMP, HTTP, or SRT stream.
 */
export declare class IngestionInfo extends IngestionInfo_base {
}
declare const CdnSettingsIngestionType_base: S.Literal<["rtmp", "dash", "webrtc", "hls"]>;
/**
 * The method or protocol used to transmit the video stream.
 */
export declare class CdnSettingsIngestionType extends CdnSettingsIngestionType_base {
}
declare const CdnSettingsResolution_base: S.Literal<["240p", "360p", "480p", "720p", "1080p", "1440p", "2160p", "variable"]>;
/**
 * The resolution of the inbound video data.
 */
export declare class CdnSettingsResolution extends CdnSettingsResolution_base {
}
declare const CdnSettings_base: S.Class<CdnSettings, {
    /**
     * The format of the video stream that you are sending to Youtube.
     */
    format: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The frame rate of the inbound video data.
     */
    frameRate: S.optionalWith<typeof CdnSettingsFrameRate, {
        nullable: true;
    }>;
    /**
     * The ingestionInfo object contains information that YouTube provides that you need to transmit your RTMP or HTTP stream to YouTube.
     */
    ingestionInfo: S.optionalWith<typeof IngestionInfo, {
        nullable: true;
    }>;
    /**
     * The method or protocol used to transmit the video stream.
     */
    ingestionType: S.optionalWith<typeof CdnSettingsIngestionType, {
        nullable: true;
    }>;
    /**
     * The resolution of the inbound video data.
     */
    resolution: S.optionalWith<typeof CdnSettingsResolution, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The format of the video stream that you are sending to Youtube.
     */
    format: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The frame rate of the inbound video data.
     */
    frameRate: S.optionalWith<typeof CdnSettingsFrameRate, {
        nullable: true;
    }>;
    /**
     * The ingestionInfo object contains information that YouTube provides that you need to transmit your RTMP or HTTP stream to YouTube.
     */
    ingestionInfo: S.optionalWith<typeof IngestionInfo, {
        nullable: true;
    }>;
    /**
     * The method or protocol used to transmit the video stream.
     */
    ingestionType: S.optionalWith<typeof CdnSettingsIngestionType, {
        nullable: true;
    }>;
    /**
     * The resolution of the inbound video data.
     */
    resolution: S.optionalWith<typeof CdnSettingsResolution, {
        nullable: true;
    }>;
}>, never, {
    readonly format?: string | undefined;
} & {
    readonly frameRate?: "30fps" | "60fps" | "variable" | undefined;
} & {
    readonly ingestionInfo?: IngestionInfo | undefined;
} & {
    readonly ingestionType?: "rtmp" | "dash" | "webrtc" | "hls" | undefined;
} & {
    readonly resolution?: "variable" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | undefined;
}, {}, {}>;
/**
 * Brief description of the live stream cdn settings.
 */
export declare class CdnSettings extends CdnSettings_base {
}
declare const LiveStreamContentDetails_base: S.Class<LiveStreamContentDetails, {
    /**
     * The ingestion URL where the closed captions of this stream are sent.
     */
    closedCaptionsIngestionUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Indicates whether the stream is reusable, which means that it can be bound to multiple broadcasts. It is common for broadcasters to reuse the same stream for many different broadcasts if those broadcasts occur at different times. If you set this value to false, then the stream will not be reusable, which means that it can only be bound to one broadcast. Non-reusable streams differ from reusable streams in the following ways: - A non-reusable stream can only be bound to one broadcast. - A non-reusable stream might be deleted by an automated process after the broadcast ends. - The liveStreams.list method does not list non-reusable streams if you call the method and set the mine parameter to true. The only way to use that method to retrieve the resource for a non-reusable stream is to use the id parameter to identify the stream.
     */
    isReusable: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ingestion URL where the closed captions of this stream are sent.
     */
    closedCaptionsIngestionUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Indicates whether the stream is reusable, which means that it can be bound to multiple broadcasts. It is common for broadcasters to reuse the same stream for many different broadcasts if those broadcasts occur at different times. If you set this value to false, then the stream will not be reusable, which means that it can only be bound to one broadcast. Non-reusable streams differ from reusable streams in the following ways: - A non-reusable stream can only be bound to one broadcast. - A non-reusable stream might be deleted by an automated process after the broadcast ends. - The liveStreams.list method does not list non-reusable streams if you call the method and set the mine parameter to true. The only way to use that method to retrieve the resource for a non-reusable stream is to use the id parameter to identify the stream.
     */
    isReusable: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>, never, {
    readonly closedCaptionsIngestionUrl?: string | undefined;
} & {
    readonly isReusable?: boolean | undefined;
}, {}, {}>;
/**
 * Detailed settings of a stream.
 */
export declare class LiveStreamContentDetails extends LiveStreamContentDetails_base {
}
declare const LiveStreamSnippet_base: S.Class<LiveStreamSnippet, {
    /**
     * The ID that YouTube uses to uniquely identify the channel that is transmitting the stream.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The stream's description. The value cannot be longer than 10000 characters.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    isDefaultStream: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The date and time that the stream was created.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The stream's title. The value must be between 1 and 128 characters long.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID that YouTube uses to uniquely identify the channel that is transmitting the stream.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The stream's description. The value cannot be longer than 10000 characters.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    isDefaultStream: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The date and time that the stream was created.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The stream's title. The value must be between 1 and 128 characters long.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly isDefaultStream?: boolean | undefined;
}, {}, {}>;
export declare class LiveStreamSnippet extends LiveStreamSnippet_base {
}
declare const LiveStreamConfigurationIssueSeverity_base: S.Literal<["info", "warning", "error"]>;
/**
 * How severe this issue is to the stream.
 */
export declare class LiveStreamConfigurationIssueSeverity extends LiveStreamConfigurationIssueSeverity_base {
}
declare const LiveStreamConfigurationIssueType_base: S.Literal<["gopSizeOver", "gopSizeLong", "gopSizeShort", "openGop", "badContainer", "audioBitrateHigh", "audioBitrateLow", "audioSampleRate", "bitrateHigh", "bitrateLow", "audioCodec", "videoCodec", "noAudioStream", "noVideoStream", "multipleVideoStreams", "multipleAudioStreams", "audioTooManyChannels", "interlacedVideo", "frameRateHigh", "resolutionMismatch", "videoCodecMismatch", "videoInterlaceMismatch", "videoProfileMismatch", "videoBitrateMismatch", "framerateMismatch", "gopMismatch", "audioSampleRateMismatch", "audioStereoMismatch", "audioCodecMismatch", "audioBitrateMismatch", "videoResolutionSuboptimal", "videoResolutionUnsupported", "videoIngestionStarved", "videoIngestionFasterThanRealtime"]>;
/**
 * The kind of error happening.
 */
export declare class LiveStreamConfigurationIssueType extends LiveStreamConfigurationIssueType_base {
}
declare const LiveStreamConfigurationIssue_base: S.Class<LiveStreamConfigurationIssue, {
    /**
     * The long-form description of the issue and how to resolve it.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The short-form reason for this issue.
     */
    reason: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * How severe this issue is to the stream.
     */
    severity: S.optionalWith<typeof LiveStreamConfigurationIssueSeverity, {
        nullable: true;
    }>;
    /**
     * The kind of error happening.
     */
    type: S.optionalWith<typeof LiveStreamConfigurationIssueType, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The long-form description of the issue and how to resolve it.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The short-form reason for this issue.
     */
    reason: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * How severe this issue is to the stream.
     */
    severity: S.optionalWith<typeof LiveStreamConfigurationIssueSeverity, {
        nullable: true;
    }>;
    /**
     * The kind of error happening.
     */
    type: S.optionalWith<typeof LiveStreamConfigurationIssueType, {
        nullable: true;
    }>;
}>, never, {
    readonly description?: string | undefined;
} & {
    readonly type?: "gopSizeOver" | "gopSizeLong" | "gopSizeShort" | "openGop" | "badContainer" | "audioBitrateHigh" | "audioBitrateLow" | "audioSampleRate" | "bitrateHigh" | "bitrateLow" | "audioCodec" | "videoCodec" | "noAudioStream" | "noVideoStream" | "multipleVideoStreams" | "multipleAudioStreams" | "audioTooManyChannels" | "interlacedVideo" | "frameRateHigh" | "resolutionMismatch" | "videoCodecMismatch" | "videoInterlaceMismatch" | "videoProfileMismatch" | "videoBitrateMismatch" | "framerateMismatch" | "gopMismatch" | "audioSampleRateMismatch" | "audioStereoMismatch" | "audioCodecMismatch" | "audioBitrateMismatch" | "videoResolutionSuboptimal" | "videoResolutionUnsupported" | "videoIngestionStarved" | "videoIngestionFasterThanRealtime" | undefined;
} & {
    readonly reason?: string | undefined;
} & {
    readonly severity?: "info" | "warning" | "error" | undefined;
}, {}, {}>;
export declare class LiveStreamConfigurationIssue extends LiveStreamConfigurationIssue_base {
}
declare const LiveStreamHealthStatusStatus_base: S.Literal<["good", "ok", "bad", "noData", "revoked"]>;
/**
 * The status code of this stream
 */
export declare class LiveStreamHealthStatusStatus extends LiveStreamHealthStatusStatus_base {
}
declare const LiveStreamHealthStatus_base: S.Class<LiveStreamHealthStatus, {
    /**
     * The configurations issues on this stream
     */
    configurationIssues: S.optionalWith<S.Array$<typeof LiveStreamConfigurationIssue>, {
        nullable: true;
    }>;
    /**
     * The last time this status was updated (in seconds)
     */
    lastUpdateTimeSeconds: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The status code of this stream
     */
    status: S.optionalWith<typeof LiveStreamHealthStatusStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The configurations issues on this stream
     */
    configurationIssues: S.optionalWith<S.Array$<typeof LiveStreamConfigurationIssue>, {
        nullable: true;
    }>;
    /**
     * The last time this status was updated (in seconds)
     */
    lastUpdateTimeSeconds: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The status code of this stream
     */
    status: S.optionalWith<typeof LiveStreamHealthStatusStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly status?: "revoked" | "good" | "ok" | "bad" | "noData" | undefined;
} & {
    readonly configurationIssues?: readonly LiveStreamConfigurationIssue[] | undefined;
} & {
    readonly lastUpdateTimeSeconds?: string | undefined;
}, {}, {}>;
export declare class LiveStreamHealthStatus extends LiveStreamHealthStatus_base {
}
declare const LiveStreamStatusStreamStatus_base: S.Literal<["created", "ready", "active", "inactive", "error"]>;
export declare class LiveStreamStatusStreamStatus extends LiveStreamStatusStreamStatus_base {
}
declare const LiveStreamStatus_base: S.Class<LiveStreamStatus, {
    /**
     * The health status of the stream.
     */
    healthStatus: S.optionalWith<typeof LiveStreamHealthStatus, {
        nullable: true;
    }>;
    streamStatus: S.optionalWith<typeof LiveStreamStatusStreamStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The health status of the stream.
     */
    healthStatus: S.optionalWith<typeof LiveStreamHealthStatus, {
        nullable: true;
    }>;
    streamStatus: S.optionalWith<typeof LiveStreamStatusStreamStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly healthStatus?: LiveStreamHealthStatus | undefined;
} & {
    readonly streamStatus?: "active" | "created" | "ready" | "error" | "inactive" | undefined;
}, {}, {}>;
/**
 * Brief description of the live stream status.
 */
export declare class LiveStreamStatus extends LiveStreamStatus_base {
}
declare const LiveStream_base: S.Class<LiveStream, {
    /**
     * The cdn object defines the live stream's content delivery network (CDN) settings. These settings provide details about the manner in which you stream your content to YouTube.
     */
    cdn: S.optionalWith<typeof CdnSettings, {
        nullable: true;
    }>;
    /**
     * The content_details object contains information about the stream, including the closed captions ingestion URL.
     */
    contentDetails: S.optionalWith<typeof LiveStreamContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the stream.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveStream".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveStream";
    }>;
    /**
     * The snippet object contains basic details about the stream, including its channel, title, and description.
     */
    snippet: S.optionalWith<typeof LiveStreamSnippet, {
        nullable: true;
    }>;
    /**
     * The status object contains information about live stream's status.
     */
    status: S.optionalWith<typeof LiveStreamStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The cdn object defines the live stream's content delivery network (CDN) settings. These settings provide details about the manner in which you stream your content to YouTube.
     */
    cdn: S.optionalWith<typeof CdnSettings, {
        nullable: true;
    }>;
    /**
     * The content_details object contains information about the stream, including the closed captions ingestion URL.
     */
    contentDetails: S.optionalWith<typeof LiveStreamContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the stream.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveStream".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveStream";
    }>;
    /**
     * The snippet object contains basic details about the stream, including its channel, title, and description.
     */
    snippet: S.optionalWith<typeof LiveStreamSnippet, {
        nullable: true;
    }>;
    /**
     * The status object contains information about live stream's status.
     */
    status: S.optionalWith<typeof LiveStreamStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: LiveStreamContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: LiveStreamSnippet | undefined;
} & {
    readonly status?: LiveStreamStatus | undefined;
} & {
    readonly cdn?: CdnSettings | undefined;
}, {}, {}>;
/**
 * A live stream describes a live ingestion point.
 */
export declare class LiveStream extends LiveStream_base {
}
declare const LiveStreamListResponse_base: S.Class<LiveStreamListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of live streams that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof LiveStream>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveStreamListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveStreamListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of live streams that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof LiveStream>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveStreamListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#liveStreamListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly LiveStream[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class LiveStreamListResponse extends LiveStreamListResponse_base {
}
declare const YoutubeLiveStreamsUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveStreamsUpdateParams extends YoutubeLiveStreamsUpdateParams_base {
}
declare const YoutubeLiveStreamsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveStreamsInsertParams extends YoutubeLiveStreamsInsertParams_base {
}
declare const YoutubeLiveStreamsDeleteParams_base: S.Struct<{
    id: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeLiveStreamsDeleteParams extends YoutubeLiveStreamsDeleteParams_base {
}
declare const YoutubeMembersListParamsMode_base: S.Literal<["listMembersModeUnknown", "updates", "all_current"]>;
export declare class YoutubeMembersListParamsMode extends YoutubeMembersListParamsMode_base {
}
declare const YoutubeMembersListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    filterByMemberChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    hasAccessToLevel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    mode: S.optionalWith<typeof YoutubeMembersListParamsMode, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeMembersListParams extends YoutubeMembersListParams_base {
}
declare const MembershipsDuration_base: S.Class<MembershipsDuration, {
    /**
     * The date and time when the user became a continuous member across all levels.
     */
    memberSince: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The cumulative time the user has been a member across all levels in complete months (the time is rounded down to the nearest integer).
     */
    memberTotalDurationMonths: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The date and time when the user became a continuous member across all levels.
     */
    memberSince: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The cumulative time the user has been a member across all levels in complete months (the time is rounded down to the nearest integer).
     */
    memberTotalDurationMonths: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}>, never, {
    readonly memberSince?: string | undefined;
} & {
    readonly memberTotalDurationMonths?: number | undefined;
}, {}, {}>;
export declare class MembershipsDuration extends MembershipsDuration_base {
}
declare const MembershipsDurationAtLevel_base: S.Class<MembershipsDurationAtLevel, {
    /**
     * Pricing level ID.
     */
    level: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the user became a continuous member for the given level.
     */
    memberSince: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The cumulative time the user has been a member for the given level in complete months (the time is rounded down to the nearest integer).
     */
    memberTotalDurationMonths: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Pricing level ID.
     */
    level: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the user became a continuous member for the given level.
     */
    memberSince: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The cumulative time the user has been a member for the given level in complete months (the time is rounded down to the nearest integer).
     */
    memberTotalDurationMonths: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}>, never, {
    readonly memberSince?: string | undefined;
} & {
    readonly memberTotalDurationMonths?: number | undefined;
} & {
    readonly level?: string | undefined;
}, {}, {}>;
export declare class MembershipsDurationAtLevel extends MembershipsDurationAtLevel_base {
}
declare const MembershipsDetails_base: S.Class<MembershipsDetails, {
    /**
     * Ids of all levels that the user has access to. This includes the currently active level and all other levels that are included because of a higher purchase.
     */
    accessibleLevels: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * Id of the highest level that the user has access to at the moment.
     */
    highestAccessibleLevel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Display name for the highest level that the user has access to at the moment.
     */
    highestAccessibleLevelDisplayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Data about memberships duration without taking into consideration pricing levels.
     */
    membershipsDuration: S.optionalWith<typeof MembershipsDuration, {
        nullable: true;
    }>;
    /**
     * Data about memberships duration on particular pricing levels.
     */
    membershipsDurationAtLevels: S.optionalWith<S.Array$<typeof MembershipsDurationAtLevel>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Ids of all levels that the user has access to. This includes the currently active level and all other levels that are included because of a higher purchase.
     */
    accessibleLevels: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * Id of the highest level that the user has access to at the moment.
     */
    highestAccessibleLevel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Display name for the highest level that the user has access to at the moment.
     */
    highestAccessibleLevelDisplayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Data about memberships duration without taking into consideration pricing levels.
     */
    membershipsDuration: S.optionalWith<typeof MembershipsDuration, {
        nullable: true;
    }>;
    /**
     * Data about memberships duration on particular pricing levels.
     */
    membershipsDurationAtLevels: S.optionalWith<S.Array$<typeof MembershipsDurationAtLevel>, {
        nullable: true;
    }>;
}>, never, {
    readonly accessibleLevels?: readonly string[] | undefined;
} & {
    readonly highestAccessibleLevel?: string | undefined;
} & {
    readonly highestAccessibleLevelDisplayName?: string | undefined;
} & {
    readonly membershipsDuration?: MembershipsDuration | undefined;
} & {
    readonly membershipsDurationAtLevels?: readonly MembershipsDurationAtLevel[] | undefined;
}, {}, {}>;
export declare class MembershipsDetails extends MembershipsDetails_base {
}
declare const MemberSnippet_base: S.Class<MemberSnippet, {
    /**
     * The id of the channel that's offering memberships.
     */
    creatorChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the member.
     */
    memberDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
    /**
     * Details about the user's membership.
     */
    membershipsDetails: S.optionalWith<typeof MembershipsDetails, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The id of the channel that's offering memberships.
     */
    creatorChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the member.
     */
    memberDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
    /**
     * Details about the user's membership.
     */
    membershipsDetails: S.optionalWith<typeof MembershipsDetails, {
        nullable: true;
    }>;
}>, never, {
    readonly creatorChannelId?: string | undefined;
} & {
    readonly memberDetails?: ChannelProfileDetails | undefined;
} & {
    readonly membershipsDetails?: MembershipsDetails | undefined;
}, {}, {}>;
export declare class MemberSnippet extends MemberSnippet_base {
}
declare const Member_base: S.Class<Member, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#member".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#member";
    }>;
    /**
     * The snippet object contains basic details about the member.
     */
    snippet: S.optionalWith<typeof MemberSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#member".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#member";
    }>;
    /**
     * The snippet object contains basic details about the member.
     */
    snippet: S.optionalWith<typeof MemberSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: MemberSnippet | undefined;
}, {}, {}>;
/**
 * A *member* resource represents a member for a YouTube channel. A member provides recurring monetary support to a creator and receives special benefits.
 */
export declare class Member extends Member_base {
}
declare const MemberListResponse_base: S.Class<MemberListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of members that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof Member>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#memberListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#memberListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of members that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof Member>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#memberListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#memberListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly Member[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class MemberListResponse extends MemberListResponse_base {
}
declare const YoutubeMembershipsLevelsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeMembershipsLevelsListParams extends YoutubeMembershipsLevelsListParams_base {
}
declare const LevelDetails_base: S.Class<LevelDetails, {
    /**
     * The name that should be used when referring to this level.
     */
    displayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The name that should be used when referring to this level.
     */
    displayName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly displayName?: string | undefined;
}, {}, {}>;
export declare class LevelDetails extends LevelDetails_base {
}
declare const MembershipsLevelSnippet_base: S.Class<MembershipsLevelSnippet, {
    /**
     * The id of the channel that's offering channel memberships.
     */
    creatorChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the pricing level.
     */
    levelDetails: S.optionalWith<typeof LevelDetails, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The id of the channel that's offering channel memberships.
     */
    creatorChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Details about the pricing level.
     */
    levelDetails: S.optionalWith<typeof LevelDetails, {
        nullable: true;
    }>;
}>, never, {
    readonly creatorChannelId?: string | undefined;
} & {
    readonly levelDetails?: LevelDetails | undefined;
}, {}, {}>;
export declare class MembershipsLevelSnippet extends MembershipsLevelSnippet_base {
}
declare const MembershipsLevel_base: S.Class<MembershipsLevel, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the memberships level.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#membershipsLevelListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#membershipsLevel";
    }>;
    /**
     * The snippet object contains basic details about the level.
     */
    snippet: S.optionalWith<typeof MembershipsLevelSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the memberships level.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#membershipsLevelListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#membershipsLevel";
    }>;
    /**
     * The snippet object contains basic details about the level.
     */
    snippet: S.optionalWith<typeof MembershipsLevelSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: MembershipsLevelSnippet | undefined;
}, {}, {}>;
/**
 * A *membershipsLevel* resource represents an offer made by YouTube creators for their fans. Users can become members of the channel by joining one of the available levels. They will provide recurring monetary support and receives special benefits.
 */
export declare class MembershipsLevel extends MembershipsLevel_base {
}
declare const MembershipsLevelListResponse_base: S.Class<MembershipsLevelListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of pricing levels offered by a creator to the fans.
     */
    items: S.optionalWith<S.Array$<typeof MembershipsLevel>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#membershipsLevelListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#membershipsLevelListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of pricing levels offered by a creator to the fans.
     */
    items: S.optionalWith<S.Array$<typeof MembershipsLevel>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#membershipsLevelListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#membershipsLevelListResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly MembershipsLevel[] | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class MembershipsLevelListResponse extends MembershipsLevelListResponse_base {
}
declare const YoutubePlaylistItemsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    playlistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubePlaylistItemsListParams extends YoutubePlaylistItemsListParams_base {
}
declare const PlaylistItemContentDetails_base: S.Class<PlaylistItemContentDetails, {
    /**
     * The time, measured in seconds from the start of the video, when the video should stop playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) By default, assume that the video.endTime is the end of the video.
     */
    endAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A user-generated note for this item.
     */
    note: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time, measured in seconds from the start of the video, when the video should start playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) The default value is 0.
     */
    startAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify a video. To retrieve the video resource, set the id query parameter to this value in your API request.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the video was published to YouTube.
     */
    videoPublishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The time, measured in seconds from the start of the video, when the video should stop playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) By default, assume that the video.endTime is the end of the video.
     */
    endAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A user-generated note for this item.
     */
    note: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time, measured in seconds from the start of the video, when the video should start playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) The default value is 0.
     */
    startAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify a video. To retrieve the video resource, set the id query parameter to this value in your API request.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the video was published to YouTube.
     */
    videoPublishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly videoId?: string | undefined;
} & {
    readonly endAt?: string | undefined;
} & {
    readonly note?: string | undefined;
} & {
    readonly startAt?: string | undefined;
} & {
    readonly videoPublishedAt?: string | undefined;
}, {}, {}>;
export declare class PlaylistItemContentDetails extends PlaylistItemContentDetails_base {
}
declare const PlaylistItemSnippet_base: S.Class<PlaylistItemSnippet, {
    /**
     * The ID that YouTube uses to uniquely identify the user that added the item to the playlist.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel that the playlist item belongs to.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The item's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify thGe playlist that the playlist item is in.
     */
    playlistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The order in which the item appears in the playlist. The value uses a zero-based index, so the first item has a position of 0, the second item has a position of 1, and so forth.
     */
    position: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The date and time that the item was added to the playlist.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The id object contains information that can be used to uniquely identify the resource that is included in the playlist as the playlist item.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the playlist item. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The item's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel id for the channel this video belongs to.
     */
    videoOwnerChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel this video belongs to.
     */
    videoOwnerChannelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID that YouTube uses to uniquely identify the user that added the item to the playlist.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel that the playlist item belongs to.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The item's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify thGe playlist that the playlist item is in.
     */
    playlistId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The order in which the item appears in the playlist. The value uses a zero-based index, so the first item has a position of 0, the second item has a position of 1, and so forth.
     */
    position: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The date and time that the item was added to the playlist.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The id object contains information that can be used to uniquely identify the resource that is included in the playlist as the playlist item.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the playlist item. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The item's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel id for the channel this video belongs to.
     */
    videoOwnerChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel this video belongs to.
     */
    videoOwnerChannelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly channelTitle?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
} & {
    readonly playlistId?: string | undefined;
} & {
    readonly resourceId?: ResourceId | undefined;
} & {
    readonly position?: number | undefined;
} & {
    readonly videoOwnerChannelId?: string | undefined;
} & {
    readonly videoOwnerChannelTitle?: string | undefined;
}, {}, {}>;
/**
 * Basic details about a playlist, including title, description and thumbnails. Basic details of a YouTube Playlist item provided by the author. Next ID: 15
 */
export declare class PlaylistItemSnippet extends PlaylistItemSnippet_base {
}
declare const PlaylistItemStatusPrivacyStatus_base: S.Literal<["public", "unlisted", "private"]>;
/**
 * This resource's privacy status.
 */
export declare class PlaylistItemStatusPrivacyStatus extends PlaylistItemStatusPrivacyStatus_base {
}
declare const PlaylistItemStatus_base: S.Class<PlaylistItemStatus, {
    /**
     * This resource's privacy status.
     */
    privacyStatus: S.optionalWith<typeof PlaylistItemStatusPrivacyStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * This resource's privacy status.
     */
    privacyStatus: S.optionalWith<typeof PlaylistItemStatusPrivacyStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly privacyStatus?: "public" | "unlisted" | "private" | undefined;
}, {}, {}>;
/**
 * Information about the playlist item's privacy status.
 */
export declare class PlaylistItemStatus extends PlaylistItemStatus_base {
}
declare const PlaylistItem_base: S.Class<PlaylistItem, {
    /**
     * The contentDetails object is included in the resource if the included item is a YouTube video. The object contains additional information about the video.
     */
    contentDetails: S.optionalWith<typeof PlaylistItemContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the playlist item.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItem".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#playlistItem";
    }>;
    /**
     * The snippet object contains basic details about the playlist item, such as its title and position in the playlist.
     */
    snippet: S.optionalWith<typeof PlaylistItemSnippet, {
        nullable: true;
    }>;
    /**
     * The status object contains information about the playlist item's privacy status.
     */
    status: S.optionalWith<typeof PlaylistItemStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The contentDetails object is included in the resource if the included item is a YouTube video. The object contains additional information about the video.
     */
    contentDetails: S.optionalWith<typeof PlaylistItemContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the playlist item.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItem".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#playlistItem";
    }>;
    /**
     * The snippet object contains basic details about the playlist item, such as its title and position in the playlist.
     */
    snippet: S.optionalWith<typeof PlaylistItemSnippet, {
        nullable: true;
    }>;
    /**
     * The status object contains information about the playlist item's privacy status.
     */
    status: S.optionalWith<typeof PlaylistItemStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: PlaylistItemContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: PlaylistItemSnippet | undefined;
} & {
    readonly status?: PlaylistItemStatus | undefined;
}, {}, {}>;
/**
 * A *playlistItem* resource identifies another resource, such as a video, that is included in a playlist. In addition, the playlistItem resource contains details about the included resource that pertain specifically to how that resource is used in that playlist. YouTube uses playlists to identify special collections of videos for a channel, such as: - uploaded videos - favorite videos - positively rated (liked) videos - watch history - watch later To be more specific, these lists are associated with a channel, which is a collection of a person, group, or company's videos, playlists, and other YouTube information. You can retrieve the playlist IDs for each of these lists from the channel resource for a given channel. You can then use the playlistItems.list method to retrieve any of those lists. You can also add or remove items from those lists by calling the playlistItems.insert and playlistItems.delete methods. For example, if a user gives a positive rating to a video, you would insert that video into the liked videos playlist for that user's channel.
 */
export declare class PlaylistItem extends PlaylistItem_base {
}
declare const PlaylistItemListResponse_base: S.Class<PlaylistItemListResponse, {
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of playlist items that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof PlaylistItem>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItemListResponse". Etag of this resource.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#playlistItemListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of playlist items that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof PlaylistItem>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItemListResponse". Etag of this resource.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#playlistItemListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly PlaylistItem[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class PlaylistItemListResponse extends PlaylistItemListResponse_base {
}
declare const YoutubePlaylistItemsUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubePlaylistItemsUpdateParams extends YoutubePlaylistItemsUpdateParams_base {
}
declare const YoutubePlaylistItemsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubePlaylistItemsInsertParams extends YoutubePlaylistItemsInsertParams_base {
}
declare const YoutubePlaylistItemsDeleteParams_base: S.Struct<{
    id: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubePlaylistItemsDeleteParams extends YoutubePlaylistItemsDeleteParams_base {
}
declare const YoutubePlaylistsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    mine: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubePlaylistsListParams extends YoutubePlaylistsListParams_base {
}
declare const PlaylistContentDetails_base: S.Class<PlaylistContentDetails, {
    /**
     * The number of videos in the playlist.
     */
    itemCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The number of videos in the playlist.
     */
    itemCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}>, never, {
    readonly itemCount?: number | undefined;
}, {}, {}>;
export declare class PlaylistContentDetails extends PlaylistContentDetails_base {
}
declare const PlaylistPlayer_base: S.Class<PlaylistPlayer, {
    /**
     * An <iframe> tag that embeds a player that will play the playlist.
     */
    embedHtml: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * An <iframe> tag that embeds a player that will play the playlist.
     */
    embedHtml: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly embedHtml?: string | undefined;
}, {}, {}>;
export declare class PlaylistPlayer extends PlaylistPlayer_base {
}
declare const PlaylistLocalization_base: S.Class<PlaylistLocalization, {
    /**
     * The localized strings for playlist's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The localized strings for playlist's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The localized strings for playlist's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The localized strings for playlist's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
}, {}, {}>;
/**
 * Playlist localization setting
 */
export declare class PlaylistLocalization extends PlaylistLocalization_base {
}
declare const PlaylistSnippet_base: S.Class<PlaylistSnippet, {
    /**
     * The ID that YouTube uses to uniquely identify the channel that published the playlist.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel title of the channel that the video belongs to.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language of the playlist's default title and description.
     */
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The playlist's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Localized title and description, read-only.
     */
    localized: S.optionalWith<typeof PlaylistLocalization, {
        nullable: true;
    }>;
    /**
     * The date and time that the playlist was created.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Keyword tags associated with the playlist.
     */
    tags: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * Note: if the playlist has a custom thumbnail, this field will not be populated. The video id selected by the user that will be used as the thumbnail of this playlist. This field defaults to the first publicly viewable video in the playlist, if: 1. The user has never selected a video to be the thumbnail of the playlist. 2. The user selects a video to be the thumbnail, and then removes that video from the playlist. 3. The user selects a non-owned video to be the thumbnail, but that video becomes private, or gets deleted.
     */
    thumbnailVideoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the playlist. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The playlist's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID that YouTube uses to uniquely identify the channel that published the playlist.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The channel title of the channel that the video belongs to.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language of the playlist's default title and description.
     */
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The playlist's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Localized title and description, read-only.
     */
    localized: S.optionalWith<typeof PlaylistLocalization, {
        nullable: true;
    }>;
    /**
     * The date and time that the playlist was created.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Keyword tags associated with the playlist.
     */
    tags: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * Note: if the playlist has a custom thumbnail, this field will not be populated. The video id selected by the user that will be used as the thumbnail of this playlist. This field defaults to the first publicly viewable video in the playlist, if: 1. The user has never selected a video to be the thumbnail of the playlist. 2. The user selects a video to be the thumbnail, and then removes that video from the playlist. 3. The user selects a non-owned video to be the thumbnail, but that video becomes private, or gets deleted.
     */
    thumbnailVideoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the playlist. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The playlist's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly channelTitle?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
} & {
    readonly tags?: readonly string[] | undefined;
} & {
    readonly defaultLanguage?: string | undefined;
} & {
    readonly localized?: PlaylistLocalization | undefined;
} & {
    readonly thumbnailVideoId?: string | undefined;
}, {}, {}>;
/**
 * Basic details about a playlist, including title, description and thumbnails.
 */
export declare class PlaylistSnippet extends PlaylistSnippet_base {
}
declare const PlaylistStatusPrivacyStatus_base: S.Literal<["public", "unlisted", "private"]>;
/**
 * The playlist's privacy status.
 */
export declare class PlaylistStatusPrivacyStatus extends PlaylistStatusPrivacyStatus_base {
}
declare const PlaylistStatus_base: S.Class<PlaylistStatus, {
    /**
     * The playlist's privacy status.
     */
    privacyStatus: S.optionalWith<typeof PlaylistStatusPrivacyStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The playlist's privacy status.
     */
    privacyStatus: S.optionalWith<typeof PlaylistStatusPrivacyStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly privacyStatus?: "public" | "unlisted" | "private" | undefined;
}, {}, {}>;
export declare class PlaylistStatus extends PlaylistStatus_base {
}
declare const Playlist_base: S.Class<Playlist, {
    /**
     * The contentDetails object contains information like video count.
     */
    contentDetails: S.optionalWith<typeof PlaylistContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the playlist.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlist".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#playlist";
    }>;
    /**
     * Localizations for different languages
     */
    localizations: S.optionalWith<S.Record$<typeof S.String, typeof S.Unknown>, {
        nullable: true;
    }>;
    /**
     * The player object contains information that you would use to play the playlist in an embedded player.
     */
    player: S.optionalWith<typeof PlaylistPlayer, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the playlist, such as its title and description.
     */
    snippet: S.optionalWith<typeof PlaylistSnippet, {
        nullable: true;
    }>;
    /**
     * The status object contains status information for the playlist.
     */
    status: S.optionalWith<typeof PlaylistStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The contentDetails object contains information like video count.
     */
    contentDetails: S.optionalWith<typeof PlaylistContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the playlist.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlist".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#playlist";
    }>;
    /**
     * Localizations for different languages
     */
    localizations: S.optionalWith<S.Record$<typeof S.String, typeof S.Unknown>, {
        nullable: true;
    }>;
    /**
     * The player object contains information that you would use to play the playlist in an embedded player.
     */
    player: S.optionalWith<typeof PlaylistPlayer, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the playlist, such as its title and description.
     */
    snippet: S.optionalWith<typeof PlaylistSnippet, {
        nullable: true;
    }>;
    /**
     * The status object contains status information for the playlist.
     */
    status: S.optionalWith<typeof PlaylistStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: PlaylistContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: PlaylistSnippet | undefined;
} & {
    readonly status?: PlaylistStatus | undefined;
} & {
    readonly localizations?: {
        readonly [x: string]: unknown;
    } | undefined;
} & {
    readonly player?: PlaylistPlayer | undefined;
}, {}, {}>;
/**
 * A *playlist* resource represents a YouTube playlist. A playlist is a collection of videos that can be viewed sequentially and shared with other users. A playlist can contain up to 200 videos, and YouTube does not limit the number of playlists that each user creates. By default, playlists are publicly visible to other users, but playlists can be public or private. YouTube also uses playlists to identify special collections of videos for a channel, such as: - uploaded videos - favorite videos - positively rated (liked) videos - watch history - watch later To be more specific, these lists are associated with a channel, which is a collection of a person, group, or company's videos, playlists, and other YouTube information. You can retrieve the playlist IDs for each of these lists from the channel resource for a given channel. You can then use the playlistItems.list method to retrieve any of those lists. You can also add or remove items from those lists by calling the playlistItems.insert and playlistItems.delete methods.
 */
export declare class Playlist extends Playlist_base {
}
declare const PlaylistListResponse_base: S.Class<PlaylistListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of playlists that match the request criteria
     */
    items: S.optionalWith<S.Array$<typeof Playlist>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#playlistListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of playlists that match the request criteria
     */
    items: S.optionalWith<S.Array$<typeof Playlist>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#playlistListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly Playlist[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class PlaylistListResponse extends PlaylistListResponse_base {
}
declare const YoutubePlaylistsUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubePlaylistsUpdateParams extends YoutubePlaylistsUpdateParams_base {
}
declare const YoutubePlaylistsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubePlaylistsInsertParams extends YoutubePlaylistsInsertParams_base {
}
declare const YoutubePlaylistsDeleteParams_base: S.Struct<{
    id: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubePlaylistsDeleteParams extends YoutubePlaylistsDeleteParams_base {
}
declare const YoutubeSearchListParamsChannelType_base: S.Literal<["channelTypeUnspecified", "any", "show"]>;
export declare class YoutubeSearchListParamsChannelType extends YoutubeSearchListParamsChannelType_base {
}
declare const YoutubeSearchListParamsEventType_base: S.Literal<["none", "upcoming", "live", "completed"]>;
export declare class YoutubeSearchListParamsEventType extends YoutubeSearchListParamsEventType_base {
}
declare const YoutubeSearchListParamsOrder_base: S.Literal<["searchSortUnspecified", "date", "rating", "viewCount", "relevance", "title", "videoCount"]>;
export declare class YoutubeSearchListParamsOrder extends YoutubeSearchListParamsOrder_base {
}
declare const YoutubeSearchListParamsSafeSearch_base: S.Literal<["safeSearchSettingUnspecified", "none", "moderate", "strict"]>;
export declare class YoutubeSearchListParamsSafeSearch extends YoutubeSearchListParamsSafeSearch_base {
}
declare const YoutubeSearchListParamsVideoCaption_base: S.Literal<["videoCaptionUnspecified", "any", "closedCaption", "none"]>;
export declare class YoutubeSearchListParamsVideoCaption extends YoutubeSearchListParamsVideoCaption_base {
}
declare const YoutubeSearchListParamsVideoDefinition_base: S.Literal<["any", "standard", "high"]>;
export declare class YoutubeSearchListParamsVideoDefinition extends YoutubeSearchListParamsVideoDefinition_base {
}
declare const YoutubeSearchListParamsVideoDimension_base: S.Literal<["any", "2d", "3d"]>;
export declare class YoutubeSearchListParamsVideoDimension extends YoutubeSearchListParamsVideoDimension_base {
}
declare const YoutubeSearchListParamsVideoDuration_base: S.Literal<["videoDurationUnspecified", "any", "short", "medium", "long"]>;
export declare class YoutubeSearchListParamsVideoDuration extends YoutubeSearchListParamsVideoDuration_base {
}
declare const YoutubeSearchListParamsVideoEmbeddable_base: S.Literal<["videoEmbeddableUnspecified", "any", "true"]>;
export declare class YoutubeSearchListParamsVideoEmbeddable extends YoutubeSearchListParamsVideoEmbeddable_base {
}
declare const YoutubeSearchListParamsVideoLicense_base: S.Literal<["any", "youtube", "creativeCommon"]>;
export declare class YoutubeSearchListParamsVideoLicense extends YoutubeSearchListParamsVideoLicense_base {
}
declare const YoutubeSearchListParamsVideoSyndicated_base: S.Literal<["videoSyndicatedUnspecified", "any", "true"]>;
export declare class YoutubeSearchListParamsVideoSyndicated extends YoutubeSearchListParamsVideoSyndicated_base {
}
declare const YoutubeSearchListParamsVideoType_base: S.Literal<["videoTypeUnspecified", "any", "movie", "episode"]>;
export declare class YoutubeSearchListParamsVideoType extends YoutubeSearchListParamsVideoType_base {
}
declare const YoutubeSearchListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    channelType: S.optionalWith<typeof YoutubeSearchListParamsChannelType, {
        nullable: true;
    }>;
    eventType: S.optionalWith<typeof YoutubeSearchListParamsEventType, {
        nullable: true;
    }>;
    forContentOwner: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    forDeveloper: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    forMine: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    location: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    locationRadius: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    order: S.optionalWith<typeof YoutubeSearchListParamsOrder, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    publishedAfter: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    publishedBefore: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    q: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    regionCode: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    relatedToVideoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    relevanceLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    safeSearch: S.optionalWith<typeof YoutubeSearchListParamsSafeSearch, {
        nullable: true;
    }>;
    topicId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    type: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    videoCaption: S.optionalWith<typeof YoutubeSearchListParamsVideoCaption, {
        nullable: true;
    }>;
    videoCategoryId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    videoDefinition: S.optionalWith<typeof YoutubeSearchListParamsVideoDefinition, {
        nullable: true;
    }>;
    videoDimension: S.optionalWith<typeof YoutubeSearchListParamsVideoDimension, {
        nullable: true;
    }>;
    videoDuration: S.optionalWith<typeof YoutubeSearchListParamsVideoDuration, {
        nullable: true;
    }>;
    videoEmbeddable: S.optionalWith<typeof YoutubeSearchListParamsVideoEmbeddable, {
        nullable: true;
    }>;
    videoLicense: S.optionalWith<typeof YoutubeSearchListParamsVideoLicense, {
        nullable: true;
    }>;
    videoSyndicated: S.optionalWith<typeof YoutubeSearchListParamsVideoSyndicated, {
        nullable: true;
    }>;
    videoType: S.optionalWith<typeof YoutubeSearchListParamsVideoType, {
        nullable: true;
    }>;
}>;
export declare class YoutubeSearchListParams extends YoutubeSearchListParams_base {
}
declare const SearchResultSnippetLiveBroadcastContent_base: S.Literal<["none", "upcoming", "live", "completed"]>;
/**
 * It indicates if the resource (video or channel) has upcoming/active live broadcast content. Or it's "none" if there is not any upcoming/active live broadcasts.
 */
export declare class SearchResultSnippetLiveBroadcastContent extends SearchResultSnippetLiveBroadcastContent_base {
}
declare const SearchResultSnippet_base: S.Class<SearchResultSnippet, {
    /**
     * The value that YouTube uses to uniquely identify the channel that published the resource that the search result identifies.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The title of the channel that published the resource that the search result identifies.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A description of the search result.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * It indicates if the resource (video or channel) has upcoming/active live broadcast content. Or it's "none" if there is not any upcoming/active live broadcasts.
     */
    liveBroadcastContent: S.optionalWith<typeof SearchResultSnippetLiveBroadcastContent, {
        nullable: true;
    }>;
    /**
     * The creation date and time of the resource that the search result identifies.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the search result. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The title of the search result.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The value that YouTube uses to uniquely identify the channel that published the resource that the search result identifies.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The title of the channel that published the resource that the search result identifies.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A description of the search result.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * It indicates if the resource (video or channel) has upcoming/active live broadcast content. Or it's "none" if there is not any upcoming/active live broadcasts.
     */
    liveBroadcastContent: S.optionalWith<typeof SearchResultSnippetLiveBroadcastContent, {
        nullable: true;
    }>;
    /**
     * The creation date and time of the resource that the search result identifies.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the search result. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The title of the search result.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly channelTitle?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
} & {
    readonly liveBroadcastContent?: "none" | "upcoming" | "completed" | "live" | undefined;
}, {}, {}>;
/**
 * Basic details about a search result, including title, description and thumbnails of the item referenced by the search result.
 */
export declare class SearchResultSnippet extends SearchResultSnippet_base {
}
declare const SearchResult_base: S.Class<SearchResult, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The id object contains information that can be used to uniquely identify the resource that matches the search request.
     */
    id: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#searchResult".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#searchResult";
    }>;
    /**
     * The snippet object contains basic details about a search result, such as its title or description. For example, if the search result is a video, then the title will be the video's title and the description will be the video's description.
     */
    snippet: S.optionalWith<typeof SearchResultSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The id object contains information that can be used to uniquely identify the resource that matches the search request.
     */
    id: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#searchResult".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#searchResult";
    }>;
    /**
     * The snippet object contains basic details about a search result, such as its title or description. For example, if the search result is a video, then the title will be the video's title and the description will be the video's description.
     */
    snippet: S.optionalWith<typeof SearchResultSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: ResourceId | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: SearchResultSnippet | undefined;
}, {}, {}>;
/**
 * A search result contains information about a YouTube video, channel, or playlist that matches the search parameters specified in an API request. While a search result points to a uniquely identifiable resource, like a video, it does not have its own persistent data.
 */
export declare class SearchResult extends SearchResult_base {
}
declare const SearchListResponse_base: S.Class<SearchListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Pagination information for token pagination.
     */
    items: S.optionalWith<S.Array$<typeof SearchResult>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#searchListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#searchListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    regionCode: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Pagination information for token pagination.
     */
    items: S.optionalWith<S.Array$<typeof SearchResult>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#searchListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#searchListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    regionCode: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly regionCode?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly SearchResult[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class SearchListResponse extends SearchListResponse_base {
}
declare const YoutubeSubscriptionsListParamsOrder_base: S.Literal<["subscriptionOrderUnspecified", "relevance", "unread", "alphabetical"]>;
export declare class YoutubeSubscriptionsListParamsOrder extends YoutubeSubscriptionsListParamsOrder_base {
}
declare const YoutubeSubscriptionsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    forChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    mine: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    myRecentSubscribers: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    mySubscribers: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    order: S.optionalWith<typeof YoutubeSubscriptionsListParamsOrder, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeSubscriptionsListParams extends YoutubeSubscriptionsListParams_base {
}
declare const SubscriptionContentDetailsActivityType_base: S.Literal<["subscriptionActivityTypeUnspecified", "all", "uploads"]>;
/**
 * The type of activity this subscription is for (only uploads, everything).
 */
export declare class SubscriptionContentDetailsActivityType extends SubscriptionContentDetailsActivityType_base {
}
declare const SubscriptionContentDetails_base: S.Class<SubscriptionContentDetails, {
    /**
     * The type of activity this subscription is for (only uploads, everything).
     */
    activityType: S.optionalWith<typeof SubscriptionContentDetailsActivityType, {
        nullable: true;
    }>;
    /**
     * The number of new items in the subscription since its content was last read.
     */
    newItemCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The approximate number of items that the subscription points to.
     */
    totalItemCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The type of activity this subscription is for (only uploads, everything).
     */
    activityType: S.optionalWith<typeof SubscriptionContentDetailsActivityType, {
        nullable: true;
    }>;
    /**
     * The number of new items in the subscription since its content was last read.
     */
    newItemCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The approximate number of items that the subscription points to.
     */
    totalItemCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}>, never, {
    readonly activityType?: "uploads" | "all" | "subscriptionActivityTypeUnspecified" | undefined;
} & {
    readonly newItemCount?: number | undefined;
} & {
    readonly totalItemCount?: number | undefined;
}, {}, {}>;
/**
 * Details about the content to witch a subscription refers.
 */
export declare class SubscriptionContentDetails extends SubscriptionContentDetails_base {
}
declare const SubscriptionSnippet_base: S.Class<SubscriptionSnippet, {
    /**
     * The ID that YouTube uses to uniquely identify the subscriber's channel.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel that the subscription belongs to.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The subscription's details.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the subscription was created.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The id object contains information about the channel that the user subscribed to.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The subscription's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID that YouTube uses to uniquely identify the subscriber's channel.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel that the subscription belongs to.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The subscription's details.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time that the subscription was created.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The id object contains information about the channel that the user subscribed to.
     */
    resourceId: S.optionalWith<typeof ResourceId, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The subscription's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly channelTitle?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
} & {
    readonly resourceId?: ResourceId | undefined;
}, {}, {}>;
/**
 * Basic details about a subscription, including title, description and thumbnails of the subscribed item.
 */
export declare class SubscriptionSnippet extends SubscriptionSnippet_base {
}
declare const SubscriptionSubscriberSnippet_base: S.Class<SubscriptionSubscriberSnippet, {
    /**
     * The channel ID of the subscriber.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The description of the subscriber.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Thumbnails for this subscriber.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The title of the subscriber.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The channel ID of the subscriber.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The description of the subscriber.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Thumbnails for this subscriber.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The title of the subscriber.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
}, {}, {}>;
/**
 * Basic details about a subscription's subscriber including title, description, channel ID and thumbnails.
 */
export declare class SubscriptionSubscriberSnippet extends SubscriptionSubscriberSnippet_base {
}
declare const Subscription_base: S.Class<Subscription, {
    /**
     * The contentDetails object contains basic statistics about the subscription.
     */
    contentDetails: S.optionalWith<typeof SubscriptionContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the subscription.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#subscription".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#subscription";
    }>;
    /**
     * The snippet object contains basic details about the subscription, including its title and the channel that the user subscribed to.
     */
    snippet: S.optionalWith<typeof SubscriptionSnippet, {
        nullable: true;
    }>;
    /**
     * The subscriberSnippet object contains basic details about the subscriber.
     */
    subscriberSnippet: S.optionalWith<typeof SubscriptionSubscriberSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The contentDetails object contains basic statistics about the subscription.
     */
    contentDetails: S.optionalWith<typeof SubscriptionContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the subscription.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#subscription".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#subscription";
    }>;
    /**
     * The snippet object contains basic details about the subscription, including its title and the channel that the user subscribed to.
     */
    snippet: S.optionalWith<typeof SubscriptionSnippet, {
        nullable: true;
    }>;
    /**
     * The subscriberSnippet object contains basic details about the subscriber.
     */
    subscriberSnippet: S.optionalWith<typeof SubscriptionSubscriberSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: SubscriptionContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: SubscriptionSnippet | undefined;
} & {
    readonly subscriberSnippet?: SubscriptionSubscriberSnippet | undefined;
}, {}, {}>;
/**
 * A *subscription* resource contains information about a YouTube user subscription. A subscription notifies a user when new videos are added to a channel or when another user takes one of several actions on YouTube, such as uploading a video, rating a video, or commenting on a video.
 */
export declare class Subscription extends Subscription_base {
}
declare const SubscriptionListResponse_base: S.Class<SubscriptionListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of subscriptions that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof Subscription>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#subscriptionListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#subscriptionListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of subscriptions that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof Subscription>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#subscriptionListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#subscriptionListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly Subscription[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class SubscriptionListResponse extends SubscriptionListResponse_base {
}
declare const YoutubeSubscriptionsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
}>;
export declare class YoutubeSubscriptionsInsertParams extends YoutubeSubscriptionsInsertParams_base {
}
declare const YoutubeSubscriptionsDeleteParams_base: S.Struct<{
    id: typeof S.String;
}>;
export declare class YoutubeSubscriptionsDeleteParams extends YoutubeSubscriptionsDeleteParams_base {
}
declare const YoutubeSuperChatEventsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeSuperChatEventsListParams extends YoutubeSuperChatEventsListParams_base {
}
declare const SuperChatEventSnippet_base: S.Class<SuperChatEventSnippet, {
    /**
     * The purchase amount, in micros of the purchase currency. e.g., 1 is represented as 1000000.
     */
    amountMicros: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel id where the event occurred.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The text contents of the comment left by the user.
     */
    commentText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the event occurred.
     */
    createdAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The currency in which the purchase was made. ISO 4217.
     */
    currency: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A rendered string that displays the purchase amount and currency (e.g., "$1.00"). The string is rendered for the given language.
     */
    displayString: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * True if this event is a Super Sticker event.
     */
    isSuperStickerEvent: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The tier for the paid message, which is based on the amount of money spent to purchase the message.
     */
    messageType: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * If this event is a Super Sticker event, this field will contain metadata about the Super Sticker.
     */
    superStickerMetadata: S.optionalWith<typeof SuperStickerMetadata, {
        nullable: true;
    }>;
    /**
     * Details about the supporter.
     */
    supporterDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The purchase amount, in micros of the purchase currency. e.g., 1 is represented as 1000000.
     */
    amountMicros: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel id where the event occurred.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The text contents of the comment left by the user.
     */
    commentText: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the event occurred.
     */
    createdAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The currency in which the purchase was made. ISO 4217.
     */
    currency: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A rendered string that displays the purchase amount and currency (e.g., "$1.00"). The string is rendered for the given language.
     */
    displayString: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * True if this event is a Super Sticker event.
     */
    isSuperStickerEvent: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The tier for the paid message, which is based on the amount of money spent to purchase the message.
     */
    messageType: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * If this event is a Super Sticker event, this field will contain metadata about the Super Sticker.
     */
    superStickerMetadata: S.optionalWith<typeof SuperStickerMetadata, {
        nullable: true;
    }>;
    /**
     * Details about the supporter.
     */
    supporterDetails: S.optionalWith<typeof ChannelProfileDetails, {
        nullable: true;
    }>;
}>, never, {
    readonly channelId?: string | undefined;
} & {
    readonly amountMicros?: string | undefined;
} & {
    readonly currency?: string | undefined;
} & {
    readonly superStickerMetadata?: SuperStickerMetadata | undefined;
} & {
    readonly commentText?: string | undefined;
} & {
    readonly createdAt?: string | undefined;
} & {
    readonly displayString?: string | undefined;
} & {
    readonly isSuperStickerEvent?: boolean | undefined;
} & {
    readonly messageType?: number | undefined;
} & {
    readonly supporterDetails?: ChannelProfileDetails | undefined;
}, {}, {}>;
export declare class SuperChatEventSnippet extends SuperChatEventSnippet_base {
}
declare const SuperChatEvent_base: S.Class<SuperChatEvent, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the Super Chat event.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#superChatEvent"`.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#superChatEvent";
    }>;
    /**
     * The `snippet` object contains basic details about the Super Chat event.
     */
    snippet: S.optionalWith<typeof SuperChatEventSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube assigns to uniquely identify the Super Chat event.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#superChatEvent"`.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#superChatEvent";
    }>;
    /**
     * The `snippet` object contains basic details about the Super Chat event.
     */
    snippet: S.optionalWith<typeof SuperChatEventSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: SuperChatEventSnippet | undefined;
}, {}, {}>;
/**
 * A `__superChatEvent__` resource represents a Super Chat purchase on a YouTube channel.
 */
export declare class SuperChatEvent extends SuperChatEvent_base {
}
declare const SuperChatEventListResponse_base: S.Class<SuperChatEventListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of Super Chat purchases that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof SuperChatEvent>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#superChatEventListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#superChatEventListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of Super Chat purchases that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof SuperChatEvent>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#superChatEventListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#superChatEventListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly SuperChatEvent[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class SuperChatEventListResponse extends SuperChatEventListResponse_base {
}
declare const YoutubeTestsInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    externalChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeTestsInsertParams extends YoutubeTestsInsertParams_base {
}
declare const TestItemTestItemSnippet_base: S.Class<TestItemTestItemSnippet, {}, S.Struct.Encoded<{}>, never, unknown, {}, {}>;
export declare class TestItemTestItemSnippet extends TestItemTestItemSnippet_base {
}
declare const TestItem_base: S.Class<TestItem, {
    featuredPart: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    gaia: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    snippet: S.optionalWith<typeof TestItemTestItemSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    featuredPart: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    gaia: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    snippet: S.optionalWith<typeof TestItemTestItemSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly snippet?: TestItemTestItemSnippet | undefined;
} & {
    readonly featuredPart?: boolean | undefined;
} & {
    readonly gaia?: string | undefined;
}, {}, {}>;
export declare class TestItem extends TestItem_base {
}
declare const YoutubeThirdPartyLinksListParamsType_base: S.Literal<["linkUnspecified", "channelToStoreLink"]>;
export declare class YoutubeThirdPartyLinksListParamsType extends YoutubeThirdPartyLinksListParamsType_base {
}
declare const YoutubeThirdPartyLinksListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    externalChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    linkingToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    type: S.optionalWith<typeof YoutubeThirdPartyLinksListParamsType, {
        nullable: true;
    }>;
}>;
export declare class YoutubeThirdPartyLinksListParams extends YoutubeThirdPartyLinksListParams_base {
}
declare const ChannelToStoreLinkDetails_base: S.Class<ChannelToStoreLinkDetails, {
    /**
     * Google Merchant Center id of the store.
     */
    merchantId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Name of the store.
     */
    storeName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Landing page of the store.
     */
    storeUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Google Merchant Center id of the store.
     */
    merchantId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Name of the store.
     */
    storeName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Landing page of the store.
     */
    storeUrl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly merchantId?: string | undefined;
} & {
    readonly storeName?: string | undefined;
} & {
    readonly storeUrl?: string | undefined;
}, {}, {}>;
/**
 * Information specific to a store on a merchandising platform linked to a YouTube channel.
 */
export declare class ChannelToStoreLinkDetails extends ChannelToStoreLinkDetails_base {
}
declare const ThirdPartyLinkSnippetType_base: S.Literal<["linkUnspecified", "channelToStoreLink"]>;
/**
 * Type of the link named after the entities that are being linked.
 */
export declare class ThirdPartyLinkSnippetType extends ThirdPartyLinkSnippetType_base {
}
declare const ThirdPartyLinkSnippet_base: S.Class<ThirdPartyLinkSnippet, {
    /**
     * Information specific to a link between a channel and a store on a merchandising platform.
     */
    channelToStoreLink: S.optionalWith<typeof ChannelToStoreLinkDetails, {
        nullable: true;
    }>;
    /**
     * Type of the link named after the entities that are being linked.
     */
    type: S.optionalWith<typeof ThirdPartyLinkSnippetType, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Information specific to a link between a channel and a store on a merchandising platform.
     */
    channelToStoreLink: S.optionalWith<typeof ChannelToStoreLinkDetails, {
        nullable: true;
    }>;
    /**
     * Type of the link named after the entities that are being linked.
     */
    type: S.optionalWith<typeof ThirdPartyLinkSnippetType, {
        nullable: true;
    }>;
}>, never, {
    readonly type?: "linkUnspecified" | "channelToStoreLink" | undefined;
} & {
    readonly channelToStoreLink?: ChannelToStoreLinkDetails | undefined;
}, {}, {}>;
/**
 * Basic information about a third party account link, including its type and type-specific information.
 */
export declare class ThirdPartyLinkSnippet extends ThirdPartyLinkSnippet_base {
}
declare const ThirdPartyLinkStatusLinkStatus_base: S.Literal<["unknown", "failed", "pending", "linked"]>;
export declare class ThirdPartyLinkStatusLinkStatus extends ThirdPartyLinkStatusLinkStatus_base {
}
declare const ThirdPartyLinkStatus_base: S.Class<ThirdPartyLinkStatus, {
    linkStatus: S.optionalWith<typeof ThirdPartyLinkStatusLinkStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    linkStatus: S.optionalWith<typeof ThirdPartyLinkStatusLinkStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly linkStatus?: "unknown" | "failed" | "pending" | "linked" | undefined;
}, {}, {}>;
/**
 * The third-party link status object contains information about the status of the link.
 */
export declare class ThirdPartyLinkStatus extends ThirdPartyLinkStatus_base {
}
declare const ThirdPartyLink_base: S.Class<ThirdPartyLink, {
    /**
     * Etag of this resource
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thirdPartyLink".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#thirdPartyLink";
    }>;
    /**
     * The linking_token identifies a YouTube account and channel with which the third party account is linked.
     */
    linkingToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the third- party account link.
     */
    snippet: S.optionalWith<typeof ThirdPartyLinkSnippet, {
        nullable: true;
    }>;
    /**
     * The status object contains information about the status of the link.
     */
    status: S.optionalWith<typeof ThirdPartyLinkStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thirdPartyLink".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#thirdPartyLink";
    }>;
    /**
     * The linking_token identifies a YouTube account and channel with which the third party account is linked.
     */
    linkingToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the third- party account link.
     */
    snippet: S.optionalWith<typeof ThirdPartyLinkSnippet, {
        nullable: true;
    }>;
    /**
     * The status object contains information about the status of the link.
     */
    status: S.optionalWith<typeof ThirdPartyLinkStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: ThirdPartyLinkSnippet | undefined;
} & {
    readonly status?: ThirdPartyLinkStatus | undefined;
} & {
    readonly linkingToken?: string | undefined;
}, {}, {}>;
/**
 * A *third party account link* resource represents a link between a YouTube account or a channel and an account on a third-party service.
 */
export declare class ThirdPartyLink extends ThirdPartyLink_base {
}
declare const ThirdPartyLinkListResponse_base: S.Class<ThirdPartyLinkListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof ThirdPartyLink>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thirdPartyLinkListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#thirdPartyLinkListResponse";
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof ThirdPartyLink>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thirdPartyLinkListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#thirdPartyLinkListResponse";
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly items?: readonly ThirdPartyLink[] | undefined;
}, {}, {}>;
export declare class ThirdPartyLinkListResponse extends ThirdPartyLinkListResponse_base {
}
declare const YoutubeThirdPartyLinksUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    externalChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeThirdPartyLinksUpdateParams extends YoutubeThirdPartyLinksUpdateParams_base {
}
declare const YoutubeThirdPartyLinksInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    externalChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeThirdPartyLinksInsertParams extends YoutubeThirdPartyLinksInsertParams_base {
}
declare const YoutubeThirdPartyLinksDeleteParamsType_base: S.Literal<["linkUnspecified", "channelToStoreLink"]>;
export declare class YoutubeThirdPartyLinksDeleteParamsType extends YoutubeThirdPartyLinksDeleteParamsType_base {
}
declare const YoutubeThirdPartyLinksDeleteParams_base: S.Struct<{
    linkingToken: typeof S.String;
    type: typeof YoutubeThirdPartyLinksDeleteParamsType;
    externalChannelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    part: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>;
export declare class YoutubeThirdPartyLinksDeleteParams extends YoutubeThirdPartyLinksDeleteParams_base {
}
declare const YoutubeThumbnailsSetParams_base: S.Struct<{
    videoId: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeThumbnailsSetParams extends YoutubeThumbnailsSetParams_base {
}
declare const ThumbnailSetResponse_base: S.Class<ThumbnailSetResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of thumbnails.
     */
    items: S.optionalWith<S.Array$<typeof ThumbnailDetails>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thumbnailSetResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#thumbnailSetResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of thumbnails.
     */
    items: S.optionalWith<S.Array$<typeof ThumbnailDetails>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thumbnailSetResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#thumbnailSetResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly ThumbnailDetails[] | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class ThumbnailSetResponse extends ThumbnailSetResponse_base {
}
declare const YoutubeVideoAbuseReportReasonsListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeVideoAbuseReportReasonsListParams extends YoutubeVideoAbuseReportReasonsListParams_base {
}
declare const VideoAbuseReportSecondaryReason_base: S.Class<VideoAbuseReportSecondaryReason, {
    /**
     * The ID of this abuse report secondary reason.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The localized label for this abuse report secondary reason.
     */
    label: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID of this abuse report secondary reason.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The localized label for this abuse report secondary reason.
     */
    label: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly label?: string | undefined;
}, {}, {}>;
export declare class VideoAbuseReportSecondaryReason extends VideoAbuseReportSecondaryReason_base {
}
declare const VideoAbuseReportReasonSnippet_base: S.Class<VideoAbuseReportReasonSnippet, {
    /**
     * The localized label belonging to this abuse report reason.
     */
    label: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The secondary reasons associated with this reason, if any are available. (There might be 0 or more.)
     */
    secondaryReasons: S.optionalWith<S.Array$<typeof VideoAbuseReportSecondaryReason>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The localized label belonging to this abuse report reason.
     */
    label: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The secondary reasons associated with this reason, if any are available. (There might be 0 or more.)
     */
    secondaryReasons: S.optionalWith<S.Array$<typeof VideoAbuseReportSecondaryReason>, {
        nullable: true;
    }>;
}>, never, {
    readonly label?: string | undefined;
} & {
    readonly secondaryReasons?: readonly VideoAbuseReportSecondaryReason[] | undefined;
}, {}, {}>;
/**
 * Basic details about a video category, such as its localized title.
 */
export declare class VideoAbuseReportReasonSnippet extends VideoAbuseReportReasonSnippet_base {
}
declare const VideoAbuseReportReason_base: S.Class<VideoAbuseReportReason, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID of this abuse report reason.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#videoAbuseReportReason"`.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoAbuseReportReason";
    }>;
    /**
     * The `snippet` object contains basic details about the abuse report reason.
     */
    snippet: S.optionalWith<typeof VideoAbuseReportReasonSnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID of this abuse report reason.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#videoAbuseReportReason"`.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoAbuseReportReason";
    }>;
    /**
     * The `snippet` object contains basic details about the abuse report reason.
     */
    snippet: S.optionalWith<typeof VideoAbuseReportReasonSnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: VideoAbuseReportReasonSnippet | undefined;
}, {}, {}>;
/**
 * A `__videoAbuseReportReason__` resource identifies a reason that a video could be reported as abusive. Video abuse report reasons are used with `video.ReportAbuse`.
 */
export declare class VideoAbuseReportReason extends VideoAbuseReportReason_base {
}
declare const VideoAbuseReportReasonListResponse_base: S.Class<VideoAbuseReportReasonListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of valid abuse reasons that are used with `video.ReportAbuse`.
     */
    items: S.optionalWith<S.Array$<typeof VideoAbuseReportReason>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#videoAbuseReportReasonListResponse"`.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoAbuseReportReasonListResponse";
    }>;
    /**
     * The `visitorId` identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of valid abuse reasons that are used with `video.ReportAbuse`.
     */
    items: S.optionalWith<S.Array$<typeof VideoAbuseReportReason>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#videoAbuseReportReasonListResponse"`.
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoAbuseReportReasonListResponse";
    }>;
    /**
     * The `visitorId` identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly VideoAbuseReportReason[] | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class VideoAbuseReportReasonListResponse extends VideoAbuseReportReasonListResponse_base {
}
declare const YoutubeVideoCategoriesListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    regionCode: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeVideoCategoriesListParams extends YoutubeVideoCategoriesListParams_base {
}
declare const VideoCategorySnippet_base: S.Class<VideoCategorySnippet, {
    assignable: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The YouTube channel that created the video category.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "UCBR8-60-B28hp2BmDPdntcQ";
    }>;
    /**
     * The video category's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    assignable: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The YouTube channel that created the video category.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "UCBR8-60-B28hp2BmDPdntcQ";
    }>;
    /**
     * The video category's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly channelId?: string;
} & {
    readonly assignable?: boolean | undefined;
}, {}, {}>;
/**
 * Basic details about a video category, such as its localized title.
 */
export declare class VideoCategorySnippet extends VideoCategorySnippet_base {
}
declare const VideoCategory_base: S.Class<VideoCategory, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video category.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoCategory".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoCategory";
    }>;
    /**
     * The snippet object contains basic details about the video category, including its title.
     */
    snippet: S.optionalWith<typeof VideoCategorySnippet, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video category.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoCategory".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoCategory";
    }>;
    /**
     * The snippet object contains basic details about the video category, including its title.
     */
    snippet: S.optionalWith<typeof VideoCategorySnippet, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: VideoCategorySnippet | undefined;
}, {}, {}>;
/**
 * A *videoCategory* resource identifies a category that has been or could be associated with uploaded videos.
 */
export declare class VideoCategory extends VideoCategory_base {
}
declare const VideoCategoryListResponse_base: S.Class<VideoCategoryListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of video categories that can be associated with YouTube videos. In this map, the video category ID is the map key, and its value is the corresponding videoCategory resource.
     */
    items: S.optionalWith<S.Array$<typeof VideoCategory>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoCategoryListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoCategoryListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of video categories that can be associated with YouTube videos. In this map, the video category ID is the map key, and its value is the corresponding videoCategory resource.
     */
    items: S.optionalWith<S.Array$<typeof VideoCategory>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoCategoryListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoCategoryListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly VideoCategory[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class VideoCategoryListResponse extends VideoCategoryListResponse_base {
}
declare const YoutubeVideosListParamsChart_base: S.Literal<["chartUnspecified", "mostPopular"]>;
export declare class YoutubeVideosListParamsChart extends YoutubeVideosListParamsChart_base {
}
declare const YoutubeVideosListParamsMyRating_base: S.Literal<["none", "like", "dislike"]>;
export declare class YoutubeVideosListParamsMyRating extends YoutubeVideosListParamsMyRating_base {
}
declare const YoutubeVideosListParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    chart: S.optionalWith<typeof YoutubeVideosListParamsChart, {
        nullable: true;
    }>;
    hl: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    id: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    locale: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    maxHeight: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    maxResults: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    maxWidth: S.optionalWith<S.filter<S.filter<typeof S.Int>>, {
        nullable: true;
    }>;
    myRating: S.optionalWith<typeof YoutubeVideosListParamsMyRating, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    pageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    regionCode: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    videoCategoryId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeVideosListParams extends YoutubeVideosListParams_base {
}
declare const VideoAgeGatingVideoGameRating_base: S.Literal<["anyone", "m15Plus", "m16Plus", "m17Plus"]>;
/**
 * Video game rating, if any.
 */
export declare class VideoAgeGatingVideoGameRating extends VideoAgeGatingVideoGameRating_base {
}
declare const VideoAgeGating_base: S.Class<VideoAgeGating, {
    /**
     * Indicates whether or not the video has alcoholic beverage content. Only users of legal purchasing age in a particular country, as identified by ICAP, can view the content.
     */
    alcoholContent: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Age-restricted trailers. For redband trailers and adult-rated video-games. Only users aged 18+ can view the content. The the field is true the content is restricted to viewers aged 18+. Otherwise The field won't be present.
     */
    restricted: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Video game rating, if any.
     */
    videoGameRating: S.optionalWith<typeof VideoAgeGatingVideoGameRating, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Indicates whether or not the video has alcoholic beverage content. Only users of legal purchasing age in a particular country, as identified by ICAP, can view the content.
     */
    alcoholContent: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Age-restricted trailers. For redband trailers and adult-rated video-games. Only users aged 18+ can view the content. The the field is true the content is restricted to viewers aged 18+. Otherwise The field won't be present.
     */
    restricted: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Video game rating, if any.
     */
    videoGameRating: S.optionalWith<typeof VideoAgeGatingVideoGameRating, {
        nullable: true;
    }>;
}>, never, {
    readonly alcoholContent?: boolean | undefined;
} & {
    readonly restricted?: boolean | undefined;
} & {
    readonly videoGameRating?: "anyone" | "m15Plus" | "m16Plus" | "m17Plus" | undefined;
}, {}, {}>;
export declare class VideoAgeGating extends VideoAgeGating_base {
}
declare const VideoContentDetailsCaption_base: S.Literal<["true", "false"]>;
/**
 * The value of captions indicates whether the video has captions or not.
 */
export declare class VideoContentDetailsCaption extends VideoContentDetailsCaption_base {
}
declare const ContentRatingAcbRating_base: S.Literal<["acbUnspecified", "acbE", "acbP", "acbC", "acbG", "acbPg", "acbM", "acbMa15plus", "acbR18plus", "acbUnrated"]>;
/**
 * The video's Australian Classification Board (ACB) or Australian Communications and Media Authority (ACMA) rating. ACMA ratings are used to classify children's television programming.
 */
export declare class ContentRatingAcbRating extends ContentRatingAcbRating_base {
}
declare const ContentRatingAgcomRating_base: S.Literal<["agcomUnspecified", "agcomT", "agcomVm14", "agcomVm18", "agcomUnrated"]>;
/**
 * The video's rating from Italy's Autorità per le Garanzie nelle Comunicazioni (AGCOM).
 */
export declare class ContentRatingAgcomRating extends ContentRatingAgcomRating_base {
}
declare const ContentRatingAnatelRating_base: S.Literal<["anatelUnspecified", "anatelF", "anatelI", "anatelI7", "anatelI10", "anatelI12", "anatelR", "anatelA", "anatelUnrated"]>;
/**
 * The video's Anatel (Asociación Nacional de Televisión) rating for Chilean television.
 */
export declare class ContentRatingAnatelRating extends ContentRatingAnatelRating_base {
}
declare const ContentRatingBbfcRating_base: S.Literal<["bbfcUnspecified", "bbfcU", "bbfcPg", "bbfc12a", "bbfc12", "bbfc15", "bbfc18", "bbfcR18", "bbfcUnrated"]>;
/**
 * The video's British Board of Film Classification (BBFC) rating.
 */
export declare class ContentRatingBbfcRating extends ContentRatingBbfcRating_base {
}
declare const ContentRatingBfvcRating_base: S.Literal<["bfvcUnspecified", "bfvcG", "bfvcE", "bfvc13", "bfvc15", "bfvc18", "bfvc20", "bfvcB", "bfvcUnrated"]>;
/**
 * The video's rating from Thailand's Board of Film and Video Censors.
 */
export declare class ContentRatingBfvcRating extends ContentRatingBfvcRating_base {
}
declare const ContentRatingBmukkRating_base: S.Literal<["bmukkUnspecified", "bmukkAa", "bmukk6", "bmukk8", "bmukk10", "bmukk12", "bmukk14", "bmukk16", "bmukkUnrated"]>;
/**
 * The video's rating from the Austrian Board of Media Classification (Bundesministerium für Unterricht, Kunst und Kultur).
 */
export declare class ContentRatingBmukkRating extends ContentRatingBmukkRating_base {
}
declare const ContentRatingCatvRating_base: S.Literal<["catvUnspecified", "catvC", "catvC8", "catvG", "catvPg", "catv14plus", "catv18plus", "catvUnrated", "catvE"]>;
/**
 * Rating system for Canadian TV - Canadian TV Classification System The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian English-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
 */
export declare class ContentRatingCatvRating extends ContentRatingCatvRating_base {
}
declare const ContentRatingCatvfrRating_base: S.Literal<["catvfrUnspecified", "catvfrG", "catvfr8plus", "catvfr13plus", "catvfr16plus", "catvfr18plus", "catvfrUnrated", "catvfrE"]>;
/**
 * The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian French-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
 */
export declare class ContentRatingCatvfrRating extends ContentRatingCatvfrRating_base {
}
declare const ContentRatingCbfcRating_base: S.Literal<["cbfcUnspecified", "cbfcU", "cbfcUA", "cbfcUA7plus", "cbfcUA13plus", "cbfcUA16plus", "cbfcA", "cbfcS", "cbfcUnrated"]>;
/**
 * The video's Central Board of Film Certification (CBFC - India) rating.
 */
export declare class ContentRatingCbfcRating extends ContentRatingCbfcRating_base {
}
declare const ContentRatingCccRating_base: S.Literal<["cccUnspecified", "cccTe", "ccc6", "ccc14", "ccc18", "ccc18v", "ccc18s", "cccUnrated"]>;
/**
 * The video's Consejo de Calificación Cinematográfica (Chile) rating.
 */
export declare class ContentRatingCccRating extends ContentRatingCccRating_base {
}
declare const ContentRatingCceRating_base: S.Literal<["cceUnspecified", "cceM4", "cceM6", "cceM12", "cceM16", "cceM18", "cceUnrated", "cceM14"]>;
/**
 * The video's rating from Portugal's Comissão de Classificação de Espect´culos.
 */
export declare class ContentRatingCceRating extends ContentRatingCceRating_base {
}
declare const ContentRatingChfilmRating_base: S.Literal<["chfilmUnspecified", "chfilm0", "chfilm6", "chfilm12", "chfilm16", "chfilm18", "chfilmUnrated"]>;
/**
 * The video's rating in Switzerland.
 */
export declare class ContentRatingChfilmRating extends ContentRatingChfilmRating_base {
}
declare const ContentRatingChvrsRating_base: S.Literal<["chvrsUnspecified", "chvrsG", "chvrsPg", "chvrs14a", "chvrs18a", "chvrsR", "chvrsE", "chvrsUnrated"]>;
/**
 * The video's Canadian Home Video Rating System (CHVRS) rating.
 */
export declare class ContentRatingChvrsRating extends ContentRatingChvrsRating_base {
}
declare const ContentRatingCicfRating_base: S.Literal<["cicfUnspecified", "cicfE", "cicfKtEa", "cicfKntEna", "cicfUnrated"]>;
/**
 * The video's rating from the Commission de Contrôle des Films (Belgium).
 */
export declare class ContentRatingCicfRating extends ContentRatingCicfRating_base {
}
declare const ContentRatingCnaRating_base: S.Literal<["cnaUnspecified", "cnaAp", "cna12", "cna15", "cna18", "cna18plus", "cnaUnrated"]>;
/**
 * The video's rating from Romania's CONSILIUL NATIONAL AL AUDIOVIZUALULUI (CNA).
 */
export declare class ContentRatingCnaRating extends ContentRatingCnaRating_base {
}
declare const ContentRatingCncRating_base: S.Literal<["cncUnspecified", "cncT", "cnc10", "cnc12", "cnc16", "cnc18", "cncE", "cncInterdiction", "cncUnrated"]>;
/**
 * Rating system in France - Commission de classification cinematographique
 */
export declare class ContentRatingCncRating extends ContentRatingCncRating_base {
}
declare const ContentRatingCsaRating_base: S.Literal<["csaUnspecified", "csaT", "csa10", "csa12", "csa16", "csa18", "csaInterdiction", "csaUnrated"]>;
/**
 * The video's rating from France's Conseil supérieur de l’audiovisuel, which rates broadcast content.
 */
export declare class ContentRatingCsaRating extends ContentRatingCsaRating_base {
}
declare const ContentRatingCscfRating_base: S.Literal<["cscfUnspecified", "cscfAl", "cscfA", "cscf6", "cscf9", "cscf12", "cscf16", "cscf18", "cscfUnrated"]>;
/**
 * The video's rating from Luxembourg's Commission de surveillance de la classification des films (CSCF).
 */
export declare class ContentRatingCscfRating extends ContentRatingCscfRating_base {
}
declare const ContentRatingCzfilmRating_base: S.Literal<["czfilmUnspecified", "czfilmU", "czfilm12", "czfilm14", "czfilm18", "czfilmUnrated"]>;
/**
 * The video's rating in the Czech Republic.
 */
export declare class ContentRatingCzfilmRating extends ContentRatingCzfilmRating_base {
}
declare const ContentRatingDjctqRating_base: S.Literal<["djctqUnspecified", "djctqL", "djctq10", "djctq12", "djctq14", "djctq16", "djctq18", "djctqEr", "djctqL10", "djctqL12", "djctqL14", "djctqL16", "djctqL18", "djctq1012", "djctq1014", "djctq1016", "djctq1018", "djctq1214", "djctq1216", "djctq1218", "djctq1416", "djctq1418", "djctq1618", "djctqUnrated"]>;
/**
 * The video's Departamento de Justiça, Classificação, Qualificação e Títulos (DJCQT - Brazil) rating.
 */
export declare class ContentRatingDjctqRating extends ContentRatingDjctqRating_base {
}
declare const ContentRatingEcbmctRating_base: S.Literal<["ecbmctUnspecified", "ecbmctG", "ecbmct7a", "ecbmct7plus", "ecbmct13a", "ecbmct13plus", "ecbmct15a", "ecbmct15plus", "ecbmct18plus", "ecbmctUnrated"]>;
/**
 * Rating system in Turkey - Evaluation and Classification Board of the Ministry of Culture and Tourism
 */
export declare class ContentRatingEcbmctRating extends ContentRatingEcbmctRating_base {
}
declare const ContentRatingEefilmRating_base: S.Literal<["eefilmUnspecified", "eefilmPere", "eefilmL", "eefilmMs6", "eefilmK6", "eefilmMs12", "eefilmK12", "eefilmK14", "eefilmK16", "eefilmUnrated"]>;
/**
 * The video's rating in Estonia.
 */
export declare class ContentRatingEefilmRating extends ContentRatingEefilmRating_base {
}
declare const ContentRatingEgfilmRating_base: S.Literal<["egfilmUnspecified", "egfilmGn", "egfilm18", "egfilmBn", "egfilmUnrated"]>;
/**
 * The video's rating in Egypt.
 */
export declare class ContentRatingEgfilmRating extends ContentRatingEgfilmRating_base {
}
declare const ContentRatingEirinRating_base: S.Literal<["eirinUnspecified", "eirinG", "eirinPg12", "eirinR15plus", "eirinR18plus", "eirinUnrated"]>;
/**
 * The video's Eirin (映倫) rating. Eirin is the Japanese rating system.
 */
export declare class ContentRatingEirinRating extends ContentRatingEirinRating_base {
}
declare const ContentRatingFcbmRating_base: S.Literal<["fcbmUnspecified", "fcbmU", "fcbmPg13", "fcbmP13", "fcbm18", "fcbm18sx", "fcbm18pa", "fcbm18sg", "fcbm18pl", "fcbmUnrated"]>;
/**
 * The video's rating from Malaysia's Film Censorship Board.
 */
export declare class ContentRatingFcbmRating extends ContentRatingFcbmRating_base {
}
declare const ContentRatingFcoRating_base: S.Literal<["fcoUnspecified", "fcoI", "fcoIia", "fcoIib", "fcoIi", "fcoIii", "fcoUnrated"]>;
/**
 * The video's rating from Hong Kong's Office for Film, Newspaper and Article Administration.
 */
export declare class ContentRatingFcoRating extends ContentRatingFcoRating_base {
}
declare const ContentRatingFmocRating_base: S.Literal<["fmocUnspecified", "fmocU", "fmoc10", "fmoc12", "fmoc16", "fmoc18", "fmocE", "fmocUnrated"]>;
/**
 * This property has been deprecated. Use the contentDetails.contentRating.cncRating instead.
 */
export declare class ContentRatingFmocRating extends ContentRatingFmocRating_base {
}
declare const ContentRatingFpbRating_base: S.Literal<["fpbUnspecified", "fpbA", "fpbPg", "fpb79Pg", "fpb1012Pg", "fpb13", "fpb16", "fpb18", "fpbX18", "fpbXx", "fpbUnrated", "fpb10"]>;
/**
 * The video's rating from South Africa's Film and Publication Board.
 */
export declare class ContentRatingFpbRating extends ContentRatingFpbRating_base {
}
declare const ContentRatingFskRating_base: S.Literal<["fskUnspecified", "fsk0", "fsk6", "fsk12", "fsk16", "fsk18", "fskUnrated"]>;
/**
 * The video's Freiwillige Selbstkontrolle der Filmwirtschaft (FSK - Germany) rating.
 */
export declare class ContentRatingFskRating extends ContentRatingFskRating_base {
}
declare const ContentRatingGrfilmRating_base: S.Literal<["grfilmUnspecified", "grfilmK", "grfilmE", "grfilmK12", "grfilmK13", "grfilmK15", "grfilmK17", "grfilmK18", "grfilmUnrated"]>;
/**
 * The video's rating in Greece.
 */
export declare class ContentRatingGrfilmRating extends ContentRatingGrfilmRating_base {
}
declare const ContentRatingIcaaRating_base: S.Literal<["icaaUnspecified", "icaaApta", "icaa7", "icaa12", "icaa13", "icaa16", "icaa18", "icaaX", "icaaUnrated"]>;
/**
 * The video's Instituto de la Cinematografía y de las Artes Audiovisuales (ICAA - Spain) rating.
 */
export declare class ContentRatingIcaaRating extends ContentRatingIcaaRating_base {
}
declare const ContentRatingIfcoRating_base: S.Literal<["ifcoUnspecified", "ifcoG", "ifcoPg", "ifco12", "ifco12a", "ifco15", "ifco15a", "ifco16", "ifco18", "ifcoUnrated"]>;
/**
 * The video's Irish Film Classification Office (IFCO - Ireland) rating. See the IFCO website for more information.
 */
export declare class ContentRatingIfcoRating extends ContentRatingIfcoRating_base {
}
declare const ContentRatingIlfilmRating_base: S.Literal<["ilfilmUnspecified", "ilfilmAa", "ilfilm12", "ilfilm14", "ilfilm16", "ilfilm18", "ilfilmUnrated"]>;
/**
 * The video's rating in Israel.
 */
export declare class ContentRatingIlfilmRating extends ContentRatingIlfilmRating_base {
}
declare const ContentRatingIncaaRating_base: S.Literal<["incaaUnspecified", "incaaAtp", "incaaSam13", "incaaSam16", "incaaSam18", "incaaC", "incaaUnrated"]>;
/**
 * The video's INCAA (Instituto Nacional de Cine y Artes Audiovisuales - Argentina) rating.
 */
export declare class ContentRatingIncaaRating extends ContentRatingIncaaRating_base {
}
declare const ContentRatingKfcbRating_base: S.Literal<["kfcbUnspecified", "kfcbG", "kfcbPg", "kfcb16plus", "kfcbR", "kfcbUnrated"]>;
/**
 * The video's rating from the Kenya Film Classification Board.
 */
export declare class ContentRatingKfcbRating extends ContentRatingKfcbRating_base {
}
declare const ContentRatingKijkwijzerRating_base: S.Literal<["kijkwijzerUnspecified", "kijkwijzerAl", "kijkwijzer6", "kijkwijzer9", "kijkwijzer12", "kijkwijzer16", "kijkwijzer18", "kijkwijzerUnrated"]>;
/**
 * The video's NICAM/Kijkwijzer rating from the Nederlands Instituut voor de Classificatie van Audiovisuele Media (Netherlands).
 */
export declare class ContentRatingKijkwijzerRating extends ContentRatingKijkwijzerRating_base {
}
declare const ContentRatingKmrbRating_base: S.Literal<["kmrbUnspecified", "kmrbAll", "kmrb12plus", "kmrb15plus", "kmrbTeenr", "kmrbR", "kmrbUnrated"]>;
/**
 * The video's Korea Media Rating Board (영상물등급위원회) rating. The KMRB rates videos in South Korea.
 */
export declare class ContentRatingKmrbRating extends ContentRatingKmrbRating_base {
}
declare const ContentRatingLsfRating_base: S.Literal<["lsfUnspecified", "lsfSu", "lsfA", "lsfBo", "lsf13", "lsfR", "lsf17", "lsfD", "lsf21", "lsfUnrated"]>;
/**
 * The video's rating from Indonesia's Lembaga Sensor Film.
 */
export declare class ContentRatingLsfRating extends ContentRatingLsfRating_base {
}
declare const ContentRatingMccaaRating_base: S.Literal<["mccaaUnspecified", "mccaaU", "mccaaPg", "mccaa12a", "mccaa12", "mccaa14", "mccaa15", "mccaa16", "mccaa18", "mccaaUnrated"]>;
/**
 * The video's rating from Malta's Film Age-Classification Board.
 */
export declare class ContentRatingMccaaRating extends ContentRatingMccaaRating_base {
}
declare const ContentRatingMccypRating_base: S.Literal<["mccypUnspecified", "mccypA", "mccyp7", "mccyp11", "mccyp15", "mccypUnrated"]>;
/**
 * The video's rating from the Danish Film Institute's (Det Danske Filminstitut) Media Council for Children and Young People.
 */
export declare class ContentRatingMccypRating extends ContentRatingMccypRating_base {
}
declare const ContentRatingMcstRating_base: S.Literal<["mcstUnspecified", "mcstP", "mcst0", "mcstC13", "mcstC16", "mcst16plus", "mcstC18", "mcstGPg", "mcstUnrated"]>;
/**
 * The video's rating system for Vietnam - MCST
 */
export declare class ContentRatingMcstRating extends ContentRatingMcstRating_base {
}
declare const ContentRatingMdaRating_base: S.Literal<["mdaUnspecified", "mdaG", "mdaPg", "mdaPg13", "mdaNc16", "mdaM18", "mdaR21", "mdaUnrated"]>;
/**
 * The video's rating from Singapore's Media Development Authority (MDA) and, specifically, it's Board of Film Censors (BFC).
 */
export declare class ContentRatingMdaRating extends ContentRatingMdaRating_base {
}
declare const ContentRatingMedietilsynetRating_base: S.Literal<["medietilsynetUnspecified", "medietilsynetA", "medietilsynet6", "medietilsynet7", "medietilsynet9", "medietilsynet11", "medietilsynet12", "medietilsynet15", "medietilsynet18", "medietilsynetUnrated"]>;
/**
 * The video's rating from Medietilsynet, the Norwegian Media Authority.
 */
export declare class ContentRatingMedietilsynetRating extends ContentRatingMedietilsynetRating_base {
}
declare const ContentRatingMekuRating_base: S.Literal<["mekuUnspecified", "mekuS", "meku7", "meku12", "meku16", "meku18", "mekuUnrated"]>;
/**
 * The video's rating from Finland's Kansallinen Audiovisuaalinen Instituutti (National Audiovisual Institute).
 */
export declare class ContentRatingMekuRating extends ContentRatingMekuRating_base {
}
declare const ContentRatingMenaMpaaRating_base: S.Literal<["menaMpaaUnspecified", "menaMpaaG", "menaMpaaPg", "menaMpaaPg13", "menaMpaaR", "menaMpaaUnrated"]>;
/**
 * The rating system for MENA countries, a clone of MPAA. It is needed to prevent titles go live w/o additional QC check, since some of them can be inappropriate for the countries at all. See b/33408548 for more details.
 */
export declare class ContentRatingMenaMpaaRating extends ContentRatingMenaMpaaRating_base {
}
declare const ContentRatingMibacRating_base: S.Literal<["mibacUnspecified", "mibacT", "mibacVap", "mibacVm6", "mibacVm12", "mibacVm14", "mibacVm16", "mibacVm18", "mibacUnrated"]>;
/**
 * The video's rating from the Ministero dei Beni e delle Attività Culturali e del Turismo (Italy).
 */
export declare class ContentRatingMibacRating extends ContentRatingMibacRating_base {
}
declare const ContentRatingMocRating_base: S.Literal<["mocUnspecified", "mocE", "mocT", "moc7", "moc12", "moc15", "moc18", "mocX", "mocBanned", "mocUnrated"]>;
/**
 * The video's Ministerio de Cultura (Colombia) rating.
 */
export declare class ContentRatingMocRating extends ContentRatingMocRating_base {
}
declare const ContentRatingMoctwRating_base: S.Literal<["moctwUnspecified", "moctwG", "moctwP", "moctwPg", "moctwR", "moctwUnrated", "moctwR12", "moctwR15"]>;
/**
 * The video's rating from Taiwan's Ministry of Culture (文化部).
 */
export declare class ContentRatingMoctwRating extends ContentRatingMoctwRating_base {
}
declare const ContentRatingMpaaRating_base: S.Literal<["mpaaUnspecified", "mpaaG", "mpaaPg", "mpaaPg13", "mpaaR", "mpaaNc17", "mpaaX", "mpaaUnrated"]>;
/**
 * The video's Motion Picture Association of America (MPAA) rating.
 */
export declare class ContentRatingMpaaRating extends ContentRatingMpaaRating_base {
}
declare const ContentRatingMpaatRating_base: S.Literal<["mpaatUnspecified", "mpaatGb", "mpaatRb"]>;
/**
 * The rating system for trailer, DVD, and Ad in the US. See http://movielabs.com/md/ratings/v2.3/html/US_MPAAT_Ratings.html.
 */
export declare class ContentRatingMpaatRating extends ContentRatingMpaatRating_base {
}
declare const ContentRatingMtrcbRating_base: S.Literal<["mtrcbUnspecified", "mtrcbG", "mtrcbPg", "mtrcbR13", "mtrcbR16", "mtrcbR18", "mtrcbX", "mtrcbUnrated"]>;
/**
 * The video's rating from the Movie and Television Review and Classification Board (Philippines).
 */
export declare class ContentRatingMtrcbRating extends ContentRatingMtrcbRating_base {
}
declare const ContentRatingNbcRating_base: S.Literal<["nbcUnspecified", "nbcG", "nbcPg", "nbc12plus", "nbc15plus", "nbc18plus", "nbc18plusr", "nbcPu", "nbcUnrated"]>;
/**
 * The video's rating from the Maldives National Bureau of Classification.
 */
export declare class ContentRatingNbcRating extends ContentRatingNbcRating_base {
}
declare const ContentRatingNbcplRating_base: S.Literal<["nbcplUnspecified", "nbcplI", "nbcplIi", "nbcplIii", "nbcplIv", "nbcpl18plus", "nbcplUnrated"]>;
/**
 * The video's rating in Poland.
 */
export declare class ContentRatingNbcplRating extends ContentRatingNbcplRating_base {
}
declare const ContentRatingNfrcRating_base: S.Literal<["nfrcUnspecified", "nfrcA", "nfrcB", "nfrcC", "nfrcD", "nfrcX", "nfrcUnrated"]>;
/**
 * The video's rating from the Bulgarian National Film Center.
 */
export declare class ContentRatingNfrcRating extends ContentRatingNfrcRating_base {
}
declare const ContentRatingNfvcbRating_base: S.Literal<["nfvcbUnspecified", "nfvcbG", "nfvcbPg", "nfvcb12", "nfvcb12a", "nfvcb15", "nfvcb18", "nfvcbRe", "nfvcbUnrated"]>;
/**
 * The video's rating from Nigeria's National Film and Video Censors Board.
 */
export declare class ContentRatingNfvcbRating extends ContentRatingNfvcbRating_base {
}
declare const ContentRatingNkclvRating_base: S.Literal<["nkclvUnspecified", "nkclvU", "nkclv7plus", "nkclv12plus", "nkclv16plus", "nkclv18plus", "nkclvUnrated"]>;
/**
 * The video's rating from the Nacionãlais Kino centrs (National Film Centre of Latvia).
 */
export declare class ContentRatingNkclvRating extends ContentRatingNkclvRating_base {
}
declare const ContentRatingNmcRating_base: S.Literal<["nmcUnspecified", "nmcG", "nmcPg", "nmcPg13", "nmcPg15", "nmc15plus", "nmc18plus", "nmc18tc", "nmcUnrated"]>;
/**
 * The National Media Council ratings system for United Arab Emirates.
 */
export declare class ContentRatingNmcRating extends ContentRatingNmcRating_base {
}
declare const ContentRatingOflcRating_base: S.Literal<["oflcUnspecified", "oflcG", "oflcPg", "oflcM", "oflcR13", "oflcR15", "oflcR16", "oflcR18", "oflcUnrated", "oflcRp13", "oflcRp16", "oflcRp18"]>;
/**
 * The video's Office of Film and Literature Classification (OFLC - New Zealand) rating.
 */
export declare class ContentRatingOflcRating extends ContentRatingOflcRating_base {
}
declare const ContentRatingPefilmRating_base: S.Literal<["pefilmUnspecified", "pefilmPt", "pefilmPg", "pefilm14", "pefilm18", "pefilmUnrated"]>;
/**
 * The video's rating in Peru.
 */
export declare class ContentRatingPefilmRating extends ContentRatingPefilmRating_base {
}
declare const ContentRatingRcnofRating_base: S.Literal<["rcnofUnspecified", "rcnofI", "rcnofIi", "rcnofIii", "rcnofIv", "rcnofV", "rcnofVi", "rcnofUnrated"]>;
/**
 * The video's rating from the Hungarian Nemzeti Filmiroda, the Rating Committee of the National Office of Film.
 */
export declare class ContentRatingRcnofRating extends ContentRatingRcnofRating_base {
}
declare const ContentRatingResorteviolenciaRating_base: S.Literal<["resorteviolenciaUnspecified", "resorteviolenciaA", "resorteviolenciaB", "resorteviolenciaC", "resorteviolenciaD", "resorteviolenciaE", "resorteviolenciaUnrated"]>;
/**
 * The video's rating in Venezuela.
 */
export declare class ContentRatingResorteviolenciaRating extends ContentRatingResorteviolenciaRating_base {
}
declare const ContentRatingRtcRating_base: S.Literal<["rtcUnspecified", "rtcAa", "rtcA", "rtcB", "rtcB15", "rtcC", "rtcD", "rtcUnrated"]>;
/**
 * The video's General Directorate of Radio, Television and Cinematography (Mexico) rating.
 */
export declare class ContentRatingRtcRating extends ContentRatingRtcRating_base {
}
declare const ContentRatingRteRating_base: S.Literal<["rteUnspecified", "rteGa", "rteCh", "rtePs", "rteMa", "rteUnrated"]>;
/**
 * The video's rating from Ireland's Raidió Teilifís Éireann.
 */
export declare class ContentRatingRteRating extends ContentRatingRteRating_base {
}
declare const ContentRatingRussiaRating_base: S.Literal<["russiaUnspecified", "russia0", "russia6", "russia12", "russia16", "russia18", "russiaUnrated"]>;
/**
 * The video's National Film Registry of the Russian Federation (MKRF - Russia) rating.
 */
export declare class ContentRatingRussiaRating extends ContentRatingRussiaRating_base {
}
declare const ContentRatingSkfilmRating_base: S.Literal<["skfilmUnspecified", "skfilmG", "skfilmP2", "skfilmP5", "skfilmP8", "skfilmUnrated"]>;
/**
 * The video's rating in Slovakia.
 */
export declare class ContentRatingSkfilmRating extends ContentRatingSkfilmRating_base {
}
declare const ContentRatingSmaisRating_base: S.Literal<["smaisUnspecified", "smaisL", "smais7", "smais12", "smais14", "smais16", "smais18", "smaisUnrated"]>;
/**
 * The video's rating in Iceland.
 */
export declare class ContentRatingSmaisRating extends ContentRatingSmaisRating_base {
}
declare const ContentRatingSmsaRating_base: S.Literal<["smsaUnspecified", "smsaA", "smsa7", "smsa11", "smsa15", "smsaUnrated"]>;
/**
 * The video's rating from Statens medieråd (Sweden's National Media Council).
 */
export declare class ContentRatingSmsaRating extends ContentRatingSmsaRating_base {
}
declare const ContentRatingTvpgRating_base: S.Literal<["tvpgUnspecified", "tvpgY", "tvpgY7", "tvpgY7Fv", "tvpgG", "tvpgPg", "pg14", "tvpgMa", "tvpgUnrated"]>;
/**
 * The video's TV Parental Guidelines (TVPG) rating.
 */
export declare class ContentRatingTvpgRating extends ContentRatingTvpgRating_base {
}
declare const ContentRatingYtRating_base: S.Literal<["ytUnspecified", "ytAgeRestricted"]>;
/**
 * A rating that YouTube uses to identify age-restricted content.
 */
export declare class ContentRatingYtRating extends ContentRatingYtRating_base {
}
declare const ContentRating_base: S.Class<ContentRating, {
    /**
     * The video's Australian Classification Board (ACB) or Australian Communications and Media Authority (ACMA) rating. ACMA ratings are used to classify children's television programming.
     */
    acbRating: S.optionalWith<typeof ContentRatingAcbRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Italy's Autorità per le Garanzie nelle Comunicazioni (AGCOM).
     */
    agcomRating: S.optionalWith<typeof ContentRatingAgcomRating, {
        nullable: true;
    }>;
    /**
     * The video's Anatel (Asociación Nacional de Televisión) rating for Chilean television.
     */
    anatelRating: S.optionalWith<typeof ContentRatingAnatelRating, {
        nullable: true;
    }>;
    /**
     * The video's British Board of Film Classification (BBFC) rating.
     */
    bbfcRating: S.optionalWith<typeof ContentRatingBbfcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Thailand's Board of Film and Video Censors.
     */
    bfvcRating: S.optionalWith<typeof ContentRatingBfvcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Austrian Board of Media Classification (Bundesministerium für Unterricht, Kunst und Kultur).
     */
    bmukkRating: S.optionalWith<typeof ContentRatingBmukkRating, {
        nullable: true;
    }>;
    /**
     * Rating system for Canadian TV - Canadian TV Classification System The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian English-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
     */
    catvRating: S.optionalWith<typeof ContentRatingCatvRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian French-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
     */
    catvfrRating: S.optionalWith<typeof ContentRatingCatvfrRating, {
        nullable: true;
    }>;
    /**
     * The video's Central Board of Film Certification (CBFC - India) rating.
     */
    cbfcRating: S.optionalWith<typeof ContentRatingCbfcRating, {
        nullable: true;
    }>;
    /**
     * The video's Consejo de Calificación Cinematográfica (Chile) rating.
     */
    cccRating: S.optionalWith<typeof ContentRatingCccRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Portugal's Comissão de Classificação de Espect´culos.
     */
    cceRating: S.optionalWith<typeof ContentRatingCceRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Switzerland.
     */
    chfilmRating: S.optionalWith<typeof ContentRatingChfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's Canadian Home Video Rating System (CHVRS) rating.
     */
    chvrsRating: S.optionalWith<typeof ContentRatingChvrsRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Commission de Contrôle des Films (Belgium).
     */
    cicfRating: S.optionalWith<typeof ContentRatingCicfRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Romania's CONSILIUL NATIONAL AL AUDIOVIZUALULUI (CNA).
     */
    cnaRating: S.optionalWith<typeof ContentRatingCnaRating, {
        nullable: true;
    }>;
    /**
     * Rating system in France - Commission de classification cinematographique
     */
    cncRating: S.optionalWith<typeof ContentRatingCncRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from France's Conseil supérieur de l’audiovisuel, which rates broadcast content.
     */
    csaRating: S.optionalWith<typeof ContentRatingCsaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Luxembourg's Commission de surveillance de la classification des films (CSCF).
     */
    cscfRating: S.optionalWith<typeof ContentRatingCscfRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in the Czech Republic.
     */
    czfilmRating: S.optionalWith<typeof ContentRatingCzfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's Departamento de Justiça, Classificação, Qualificação e Títulos (DJCQT - Brazil) rating.
     */
    djctqRating: S.optionalWith<typeof ContentRatingDjctqRating, {
        nullable: true;
    }>;
    /**
     * Reasons that explain why the video received its DJCQT (Brazil) rating.
     */
    djctqRatingReasons: S.optionalWith<S.Array$<S.Literal<["djctqRatingReasonUnspecified", "djctqViolence", "djctqExtremeViolence", "djctqSexualContent", "djctqNudity", "djctqSex", "djctqExplicitSex", "djctqDrugs", "djctqLegalDrugs", "djctqIllegalDrugs", "djctqInappropriateLanguage", "djctqCriminalActs", "djctqImpactingContent"]>>, {
        nullable: true;
    }>;
    /**
     * Rating system in Turkey - Evaluation and Classification Board of the Ministry of Culture and Tourism
     */
    ecbmctRating: S.optionalWith<typeof ContentRatingEcbmctRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Estonia.
     */
    eefilmRating: S.optionalWith<typeof ContentRatingEefilmRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Egypt.
     */
    egfilmRating: S.optionalWith<typeof ContentRatingEgfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's Eirin (映倫) rating. Eirin is the Japanese rating system.
     */
    eirinRating: S.optionalWith<typeof ContentRatingEirinRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Malaysia's Film Censorship Board.
     */
    fcbmRating: S.optionalWith<typeof ContentRatingFcbmRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Hong Kong's Office for Film, Newspaper and Article Administration.
     */
    fcoRating: S.optionalWith<typeof ContentRatingFcoRating, {
        nullable: true;
    }>;
    /**
     * This property has been deprecated. Use the contentDetails.contentRating.cncRating instead.
     */
    fmocRating: S.optionalWith<typeof ContentRatingFmocRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from South Africa's Film and Publication Board.
     */
    fpbRating: S.optionalWith<typeof ContentRatingFpbRating, {
        nullable: true;
    }>;
    /**
     * Reasons that explain why the video received its FPB (South Africa) rating.
     */
    fpbRatingReasons: S.optionalWith<S.Array$<S.Literal<["fpbRatingReasonUnspecified", "fpbBlasphemy", "fpbLanguage", "fpbNudity", "fpbPrejudice", "fpbSex", "fpbViolence", "fpbDrugs", "fpbSexualViolence", "fpbHorror", "fpbCriminalTechniques", "fpbImitativeActsTechniques"]>>, {
        nullable: true;
    }>;
    /**
     * The video's Freiwillige Selbstkontrolle der Filmwirtschaft (FSK - Germany) rating.
     */
    fskRating: S.optionalWith<typeof ContentRatingFskRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Greece.
     */
    grfilmRating: S.optionalWith<typeof ContentRatingGrfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's Instituto de la Cinematografía y de las Artes Audiovisuales (ICAA - Spain) rating.
     */
    icaaRating: S.optionalWith<typeof ContentRatingIcaaRating, {
        nullable: true;
    }>;
    /**
     * The video's Irish Film Classification Office (IFCO - Ireland) rating. See the IFCO website for more information.
     */
    ifcoRating: S.optionalWith<typeof ContentRatingIfcoRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Israel.
     */
    ilfilmRating: S.optionalWith<typeof ContentRatingIlfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's INCAA (Instituto Nacional de Cine y Artes Audiovisuales - Argentina) rating.
     */
    incaaRating: S.optionalWith<typeof ContentRatingIncaaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Kenya Film Classification Board.
     */
    kfcbRating: S.optionalWith<typeof ContentRatingKfcbRating, {
        nullable: true;
    }>;
    /**
     * The video's NICAM/Kijkwijzer rating from the Nederlands Instituut voor de Classificatie van Audiovisuele Media (Netherlands).
     */
    kijkwijzerRating: S.optionalWith<typeof ContentRatingKijkwijzerRating, {
        nullable: true;
    }>;
    /**
     * The video's Korea Media Rating Board (영상물등급위원회) rating. The KMRB rates videos in South Korea.
     */
    kmrbRating: S.optionalWith<typeof ContentRatingKmrbRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Indonesia's Lembaga Sensor Film.
     */
    lsfRating: S.optionalWith<typeof ContentRatingLsfRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Malta's Film Age-Classification Board.
     */
    mccaaRating: S.optionalWith<typeof ContentRatingMccaaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Danish Film Institute's (Det Danske Filminstitut) Media Council for Children and Young People.
     */
    mccypRating: S.optionalWith<typeof ContentRatingMccypRating, {
        nullable: true;
    }>;
    /**
     * The video's rating system for Vietnam - MCST
     */
    mcstRating: S.optionalWith<typeof ContentRatingMcstRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Singapore's Media Development Authority (MDA) and, specifically, it's Board of Film Censors (BFC).
     */
    mdaRating: S.optionalWith<typeof ContentRatingMdaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Medietilsynet, the Norwegian Media Authority.
     */
    medietilsynetRating: S.optionalWith<typeof ContentRatingMedietilsynetRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Finland's Kansallinen Audiovisuaalinen Instituutti (National Audiovisual Institute).
     */
    mekuRating: S.optionalWith<typeof ContentRatingMekuRating, {
        nullable: true;
    }>;
    /**
     * The rating system for MENA countries, a clone of MPAA. It is needed to prevent titles go live w/o additional QC check, since some of them can be inappropriate for the countries at all. See b/33408548 for more details.
     */
    menaMpaaRating: S.optionalWith<typeof ContentRatingMenaMpaaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Ministero dei Beni e delle Attività Culturali e del Turismo (Italy).
     */
    mibacRating: S.optionalWith<typeof ContentRatingMibacRating, {
        nullable: true;
    }>;
    /**
     * The video's Ministerio de Cultura (Colombia) rating.
     */
    mocRating: S.optionalWith<typeof ContentRatingMocRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Taiwan's Ministry of Culture (文化部).
     */
    moctwRating: S.optionalWith<typeof ContentRatingMoctwRating, {
        nullable: true;
    }>;
    /**
     * The video's Motion Picture Association of America (MPAA) rating.
     */
    mpaaRating: S.optionalWith<typeof ContentRatingMpaaRating, {
        nullable: true;
    }>;
    /**
     * The rating system for trailer, DVD, and Ad in the US. See http://movielabs.com/md/ratings/v2.3/html/US_MPAAT_Ratings.html.
     */
    mpaatRating: S.optionalWith<typeof ContentRatingMpaatRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Movie and Television Review and Classification Board (Philippines).
     */
    mtrcbRating: S.optionalWith<typeof ContentRatingMtrcbRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Maldives National Bureau of Classification.
     */
    nbcRating: S.optionalWith<typeof ContentRatingNbcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Poland.
     */
    nbcplRating: S.optionalWith<typeof ContentRatingNbcplRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Bulgarian National Film Center.
     */
    nfrcRating: S.optionalWith<typeof ContentRatingNfrcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Nigeria's National Film and Video Censors Board.
     */
    nfvcbRating: S.optionalWith<typeof ContentRatingNfvcbRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Nacionãlais Kino centrs (National Film Centre of Latvia).
     */
    nkclvRating: S.optionalWith<typeof ContentRatingNkclvRating, {
        nullable: true;
    }>;
    /**
     * The National Media Council ratings system for United Arab Emirates.
     */
    nmcRating: S.optionalWith<typeof ContentRatingNmcRating, {
        nullable: true;
    }>;
    /**
     * The video's Office of Film and Literature Classification (OFLC - New Zealand) rating.
     */
    oflcRating: S.optionalWith<typeof ContentRatingOflcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Peru.
     */
    pefilmRating: S.optionalWith<typeof ContentRatingPefilmRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Hungarian Nemzeti Filmiroda, the Rating Committee of the National Office of Film.
     */
    rcnofRating: S.optionalWith<typeof ContentRatingRcnofRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Venezuela.
     */
    resorteviolenciaRating: S.optionalWith<typeof ContentRatingResorteviolenciaRating, {
        nullable: true;
    }>;
    /**
     * The video's General Directorate of Radio, Television and Cinematography (Mexico) rating.
     */
    rtcRating: S.optionalWith<typeof ContentRatingRtcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Ireland's Raidió Teilifís Éireann.
     */
    rteRating: S.optionalWith<typeof ContentRatingRteRating, {
        nullable: true;
    }>;
    /**
     * The video's National Film Registry of the Russian Federation (MKRF - Russia) rating.
     */
    russiaRating: S.optionalWith<typeof ContentRatingRussiaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Slovakia.
     */
    skfilmRating: S.optionalWith<typeof ContentRatingSkfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Iceland.
     */
    smaisRating: S.optionalWith<typeof ContentRatingSmaisRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Statens medieråd (Sweden's National Media Council).
     */
    smsaRating: S.optionalWith<typeof ContentRatingSmsaRating, {
        nullable: true;
    }>;
    /**
     * The video's TV Parental Guidelines (TVPG) rating.
     */
    tvpgRating: S.optionalWith<typeof ContentRatingTvpgRating, {
        nullable: true;
    }>;
    /**
     * A rating that YouTube uses to identify age-restricted content.
     */
    ytRating: S.optionalWith<typeof ContentRatingYtRating, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The video's Australian Classification Board (ACB) or Australian Communications and Media Authority (ACMA) rating. ACMA ratings are used to classify children's television programming.
     */
    acbRating: S.optionalWith<typeof ContentRatingAcbRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Italy's Autorità per le Garanzie nelle Comunicazioni (AGCOM).
     */
    agcomRating: S.optionalWith<typeof ContentRatingAgcomRating, {
        nullable: true;
    }>;
    /**
     * The video's Anatel (Asociación Nacional de Televisión) rating for Chilean television.
     */
    anatelRating: S.optionalWith<typeof ContentRatingAnatelRating, {
        nullable: true;
    }>;
    /**
     * The video's British Board of Film Classification (BBFC) rating.
     */
    bbfcRating: S.optionalWith<typeof ContentRatingBbfcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Thailand's Board of Film and Video Censors.
     */
    bfvcRating: S.optionalWith<typeof ContentRatingBfvcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Austrian Board of Media Classification (Bundesministerium für Unterricht, Kunst und Kultur).
     */
    bmukkRating: S.optionalWith<typeof ContentRatingBmukkRating, {
        nullable: true;
    }>;
    /**
     * Rating system for Canadian TV - Canadian TV Classification System The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian English-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
     */
    catvRating: S.optionalWith<typeof ContentRatingCatvRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian French-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
     */
    catvfrRating: S.optionalWith<typeof ContentRatingCatvfrRating, {
        nullable: true;
    }>;
    /**
     * The video's Central Board of Film Certification (CBFC - India) rating.
     */
    cbfcRating: S.optionalWith<typeof ContentRatingCbfcRating, {
        nullable: true;
    }>;
    /**
     * The video's Consejo de Calificación Cinematográfica (Chile) rating.
     */
    cccRating: S.optionalWith<typeof ContentRatingCccRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Portugal's Comissão de Classificação de Espect´culos.
     */
    cceRating: S.optionalWith<typeof ContentRatingCceRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Switzerland.
     */
    chfilmRating: S.optionalWith<typeof ContentRatingChfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's Canadian Home Video Rating System (CHVRS) rating.
     */
    chvrsRating: S.optionalWith<typeof ContentRatingChvrsRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Commission de Contrôle des Films (Belgium).
     */
    cicfRating: S.optionalWith<typeof ContentRatingCicfRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Romania's CONSILIUL NATIONAL AL AUDIOVIZUALULUI (CNA).
     */
    cnaRating: S.optionalWith<typeof ContentRatingCnaRating, {
        nullable: true;
    }>;
    /**
     * Rating system in France - Commission de classification cinematographique
     */
    cncRating: S.optionalWith<typeof ContentRatingCncRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from France's Conseil supérieur de l’audiovisuel, which rates broadcast content.
     */
    csaRating: S.optionalWith<typeof ContentRatingCsaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Luxembourg's Commission de surveillance de la classification des films (CSCF).
     */
    cscfRating: S.optionalWith<typeof ContentRatingCscfRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in the Czech Republic.
     */
    czfilmRating: S.optionalWith<typeof ContentRatingCzfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's Departamento de Justiça, Classificação, Qualificação e Títulos (DJCQT - Brazil) rating.
     */
    djctqRating: S.optionalWith<typeof ContentRatingDjctqRating, {
        nullable: true;
    }>;
    /**
     * Reasons that explain why the video received its DJCQT (Brazil) rating.
     */
    djctqRatingReasons: S.optionalWith<S.Array$<S.Literal<["djctqRatingReasonUnspecified", "djctqViolence", "djctqExtremeViolence", "djctqSexualContent", "djctqNudity", "djctqSex", "djctqExplicitSex", "djctqDrugs", "djctqLegalDrugs", "djctqIllegalDrugs", "djctqInappropriateLanguage", "djctqCriminalActs", "djctqImpactingContent"]>>, {
        nullable: true;
    }>;
    /**
     * Rating system in Turkey - Evaluation and Classification Board of the Ministry of Culture and Tourism
     */
    ecbmctRating: S.optionalWith<typeof ContentRatingEcbmctRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Estonia.
     */
    eefilmRating: S.optionalWith<typeof ContentRatingEefilmRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Egypt.
     */
    egfilmRating: S.optionalWith<typeof ContentRatingEgfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's Eirin (映倫) rating. Eirin is the Japanese rating system.
     */
    eirinRating: S.optionalWith<typeof ContentRatingEirinRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Malaysia's Film Censorship Board.
     */
    fcbmRating: S.optionalWith<typeof ContentRatingFcbmRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Hong Kong's Office for Film, Newspaper and Article Administration.
     */
    fcoRating: S.optionalWith<typeof ContentRatingFcoRating, {
        nullable: true;
    }>;
    /**
     * This property has been deprecated. Use the contentDetails.contentRating.cncRating instead.
     */
    fmocRating: S.optionalWith<typeof ContentRatingFmocRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from South Africa's Film and Publication Board.
     */
    fpbRating: S.optionalWith<typeof ContentRatingFpbRating, {
        nullable: true;
    }>;
    /**
     * Reasons that explain why the video received its FPB (South Africa) rating.
     */
    fpbRatingReasons: S.optionalWith<S.Array$<S.Literal<["fpbRatingReasonUnspecified", "fpbBlasphemy", "fpbLanguage", "fpbNudity", "fpbPrejudice", "fpbSex", "fpbViolence", "fpbDrugs", "fpbSexualViolence", "fpbHorror", "fpbCriminalTechniques", "fpbImitativeActsTechniques"]>>, {
        nullable: true;
    }>;
    /**
     * The video's Freiwillige Selbstkontrolle der Filmwirtschaft (FSK - Germany) rating.
     */
    fskRating: S.optionalWith<typeof ContentRatingFskRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Greece.
     */
    grfilmRating: S.optionalWith<typeof ContentRatingGrfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's Instituto de la Cinematografía y de las Artes Audiovisuales (ICAA - Spain) rating.
     */
    icaaRating: S.optionalWith<typeof ContentRatingIcaaRating, {
        nullable: true;
    }>;
    /**
     * The video's Irish Film Classification Office (IFCO - Ireland) rating. See the IFCO website for more information.
     */
    ifcoRating: S.optionalWith<typeof ContentRatingIfcoRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Israel.
     */
    ilfilmRating: S.optionalWith<typeof ContentRatingIlfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's INCAA (Instituto Nacional de Cine y Artes Audiovisuales - Argentina) rating.
     */
    incaaRating: S.optionalWith<typeof ContentRatingIncaaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Kenya Film Classification Board.
     */
    kfcbRating: S.optionalWith<typeof ContentRatingKfcbRating, {
        nullable: true;
    }>;
    /**
     * The video's NICAM/Kijkwijzer rating from the Nederlands Instituut voor de Classificatie van Audiovisuele Media (Netherlands).
     */
    kijkwijzerRating: S.optionalWith<typeof ContentRatingKijkwijzerRating, {
        nullable: true;
    }>;
    /**
     * The video's Korea Media Rating Board (영상물등급위원회) rating. The KMRB rates videos in South Korea.
     */
    kmrbRating: S.optionalWith<typeof ContentRatingKmrbRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Indonesia's Lembaga Sensor Film.
     */
    lsfRating: S.optionalWith<typeof ContentRatingLsfRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Malta's Film Age-Classification Board.
     */
    mccaaRating: S.optionalWith<typeof ContentRatingMccaaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Danish Film Institute's (Det Danske Filminstitut) Media Council for Children and Young People.
     */
    mccypRating: S.optionalWith<typeof ContentRatingMccypRating, {
        nullable: true;
    }>;
    /**
     * The video's rating system for Vietnam - MCST
     */
    mcstRating: S.optionalWith<typeof ContentRatingMcstRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Singapore's Media Development Authority (MDA) and, specifically, it's Board of Film Censors (BFC).
     */
    mdaRating: S.optionalWith<typeof ContentRatingMdaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Medietilsynet, the Norwegian Media Authority.
     */
    medietilsynetRating: S.optionalWith<typeof ContentRatingMedietilsynetRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Finland's Kansallinen Audiovisuaalinen Instituutti (National Audiovisual Institute).
     */
    mekuRating: S.optionalWith<typeof ContentRatingMekuRating, {
        nullable: true;
    }>;
    /**
     * The rating system for MENA countries, a clone of MPAA. It is needed to prevent titles go live w/o additional QC check, since some of them can be inappropriate for the countries at all. See b/33408548 for more details.
     */
    menaMpaaRating: S.optionalWith<typeof ContentRatingMenaMpaaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Ministero dei Beni e delle Attività Culturali e del Turismo (Italy).
     */
    mibacRating: S.optionalWith<typeof ContentRatingMibacRating, {
        nullable: true;
    }>;
    /**
     * The video's Ministerio de Cultura (Colombia) rating.
     */
    mocRating: S.optionalWith<typeof ContentRatingMocRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Taiwan's Ministry of Culture (文化部).
     */
    moctwRating: S.optionalWith<typeof ContentRatingMoctwRating, {
        nullable: true;
    }>;
    /**
     * The video's Motion Picture Association of America (MPAA) rating.
     */
    mpaaRating: S.optionalWith<typeof ContentRatingMpaaRating, {
        nullable: true;
    }>;
    /**
     * The rating system for trailer, DVD, and Ad in the US. See http://movielabs.com/md/ratings/v2.3/html/US_MPAAT_Ratings.html.
     */
    mpaatRating: S.optionalWith<typeof ContentRatingMpaatRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Movie and Television Review and Classification Board (Philippines).
     */
    mtrcbRating: S.optionalWith<typeof ContentRatingMtrcbRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Maldives National Bureau of Classification.
     */
    nbcRating: S.optionalWith<typeof ContentRatingNbcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Poland.
     */
    nbcplRating: S.optionalWith<typeof ContentRatingNbcplRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Bulgarian National Film Center.
     */
    nfrcRating: S.optionalWith<typeof ContentRatingNfrcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Nigeria's National Film and Video Censors Board.
     */
    nfvcbRating: S.optionalWith<typeof ContentRatingNfvcbRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Nacionãlais Kino centrs (National Film Centre of Latvia).
     */
    nkclvRating: S.optionalWith<typeof ContentRatingNkclvRating, {
        nullable: true;
    }>;
    /**
     * The National Media Council ratings system for United Arab Emirates.
     */
    nmcRating: S.optionalWith<typeof ContentRatingNmcRating, {
        nullable: true;
    }>;
    /**
     * The video's Office of Film and Literature Classification (OFLC - New Zealand) rating.
     */
    oflcRating: S.optionalWith<typeof ContentRatingOflcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Peru.
     */
    pefilmRating: S.optionalWith<typeof ContentRatingPefilmRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from the Hungarian Nemzeti Filmiroda, the Rating Committee of the National Office of Film.
     */
    rcnofRating: S.optionalWith<typeof ContentRatingRcnofRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Venezuela.
     */
    resorteviolenciaRating: S.optionalWith<typeof ContentRatingResorteviolenciaRating, {
        nullable: true;
    }>;
    /**
     * The video's General Directorate of Radio, Television and Cinematography (Mexico) rating.
     */
    rtcRating: S.optionalWith<typeof ContentRatingRtcRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Ireland's Raidió Teilifís Éireann.
     */
    rteRating: S.optionalWith<typeof ContentRatingRteRating, {
        nullable: true;
    }>;
    /**
     * The video's National Film Registry of the Russian Federation (MKRF - Russia) rating.
     */
    russiaRating: S.optionalWith<typeof ContentRatingRussiaRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Slovakia.
     */
    skfilmRating: S.optionalWith<typeof ContentRatingSkfilmRating, {
        nullable: true;
    }>;
    /**
     * The video's rating in Iceland.
     */
    smaisRating: S.optionalWith<typeof ContentRatingSmaisRating, {
        nullable: true;
    }>;
    /**
     * The video's rating from Statens medieråd (Sweden's National Media Council).
     */
    smsaRating: S.optionalWith<typeof ContentRatingSmsaRating, {
        nullable: true;
    }>;
    /**
     * The video's TV Parental Guidelines (TVPG) rating.
     */
    tvpgRating: S.optionalWith<typeof ContentRatingTvpgRating, {
        nullable: true;
    }>;
    /**
     * A rating that YouTube uses to identify age-restricted content.
     */
    ytRating: S.optionalWith<typeof ContentRatingYtRating, {
        nullable: true;
    }>;
}>, never, {
    readonly acbRating?: "acbUnspecified" | "acbE" | "acbP" | "acbC" | "acbG" | "acbPg" | "acbM" | "acbMa15plus" | "acbR18plus" | "acbUnrated" | undefined;
} & {
    readonly agcomRating?: "agcomUnspecified" | "agcomT" | "agcomVm14" | "agcomVm18" | "agcomUnrated" | undefined;
} & {
    readonly anatelRating?: "anatelUnspecified" | "anatelF" | "anatelI" | "anatelI7" | "anatelI10" | "anatelI12" | "anatelR" | "anatelA" | "anatelUnrated" | undefined;
} & {
    readonly bbfcRating?: "bbfcUnspecified" | "bbfcU" | "bbfcPg" | "bbfc12a" | "bbfc12" | "bbfc15" | "bbfc18" | "bbfcR18" | "bbfcUnrated" | undefined;
} & {
    readonly bfvcRating?: "bfvcUnspecified" | "bfvcG" | "bfvcE" | "bfvc13" | "bfvc15" | "bfvc18" | "bfvc20" | "bfvcB" | "bfvcUnrated" | undefined;
} & {
    readonly bmukkRating?: "bmukkUnspecified" | "bmukkAa" | "bmukk6" | "bmukk8" | "bmukk10" | "bmukk12" | "bmukk14" | "bmukk16" | "bmukkUnrated" | undefined;
} & {
    readonly catvRating?: "catvUnspecified" | "catvC" | "catvC8" | "catvG" | "catvPg" | "catv14plus" | "catv18plus" | "catvUnrated" | "catvE" | undefined;
} & {
    readonly catvfrRating?: "catvfrUnspecified" | "catvfrG" | "catvfr8plus" | "catvfr13plus" | "catvfr16plus" | "catvfr18plus" | "catvfrUnrated" | "catvfrE" | undefined;
} & {
    readonly cbfcRating?: "cbfcUnspecified" | "cbfcU" | "cbfcUA" | "cbfcUA7plus" | "cbfcUA13plus" | "cbfcUA16plus" | "cbfcA" | "cbfcS" | "cbfcUnrated" | undefined;
} & {
    readonly cccRating?: "cccUnspecified" | "cccTe" | "ccc6" | "ccc14" | "ccc18" | "ccc18v" | "ccc18s" | "cccUnrated" | undefined;
} & {
    readonly cceRating?: "cceUnspecified" | "cceM4" | "cceM6" | "cceM12" | "cceM16" | "cceM18" | "cceUnrated" | "cceM14" | undefined;
} & {
    readonly chfilmRating?: "chfilmUnspecified" | "chfilm0" | "chfilm6" | "chfilm12" | "chfilm16" | "chfilm18" | "chfilmUnrated" | undefined;
} & {
    readonly chvrsRating?: "chvrsUnspecified" | "chvrsG" | "chvrsPg" | "chvrs14a" | "chvrs18a" | "chvrsR" | "chvrsE" | "chvrsUnrated" | undefined;
} & {
    readonly cicfRating?: "cicfUnspecified" | "cicfE" | "cicfKtEa" | "cicfKntEna" | "cicfUnrated" | undefined;
} & {
    readonly cnaRating?: "cnaUnspecified" | "cnaAp" | "cna12" | "cna15" | "cna18" | "cna18plus" | "cnaUnrated" | undefined;
} & {
    readonly cncRating?: "cncUnspecified" | "cncT" | "cnc10" | "cnc12" | "cnc16" | "cnc18" | "cncE" | "cncInterdiction" | "cncUnrated" | undefined;
} & {
    readonly csaRating?: "csaUnspecified" | "csaT" | "csa10" | "csa12" | "csa16" | "csa18" | "csaInterdiction" | "csaUnrated" | undefined;
} & {
    readonly cscfRating?: "cscfUnspecified" | "cscfAl" | "cscfA" | "cscf6" | "cscf9" | "cscf12" | "cscf16" | "cscf18" | "cscfUnrated" | undefined;
} & {
    readonly czfilmRating?: "czfilmUnspecified" | "czfilmU" | "czfilm12" | "czfilm14" | "czfilm18" | "czfilmUnrated" | undefined;
} & {
    readonly djctqRating?: "djctqUnspecified" | "djctqL" | "djctq10" | "djctq12" | "djctq14" | "djctq16" | "djctq18" | "djctqEr" | "djctqL10" | "djctqL12" | "djctqL14" | "djctqL16" | "djctqL18" | "djctq1012" | "djctq1014" | "djctq1016" | "djctq1018" | "djctq1214" | "djctq1216" | "djctq1218" | "djctq1416" | "djctq1418" | "djctq1618" | "djctqUnrated" | undefined;
} & {
    readonly djctqRatingReasons?: readonly ("djctqRatingReasonUnspecified" | "djctqViolence" | "djctqExtremeViolence" | "djctqSexualContent" | "djctqNudity" | "djctqSex" | "djctqExplicitSex" | "djctqDrugs" | "djctqLegalDrugs" | "djctqIllegalDrugs" | "djctqInappropriateLanguage" | "djctqCriminalActs" | "djctqImpactingContent")[] | undefined;
} & {
    readonly ecbmctRating?: "ecbmctUnspecified" | "ecbmctG" | "ecbmct7a" | "ecbmct7plus" | "ecbmct13a" | "ecbmct13plus" | "ecbmct15a" | "ecbmct15plus" | "ecbmct18plus" | "ecbmctUnrated" | undefined;
} & {
    readonly eefilmRating?: "eefilmUnspecified" | "eefilmPere" | "eefilmL" | "eefilmMs6" | "eefilmK6" | "eefilmMs12" | "eefilmK12" | "eefilmK14" | "eefilmK16" | "eefilmUnrated" | undefined;
} & {
    readonly egfilmRating?: "egfilmUnspecified" | "egfilmGn" | "egfilm18" | "egfilmBn" | "egfilmUnrated" | undefined;
} & {
    readonly eirinRating?: "eirinUnspecified" | "eirinG" | "eirinPg12" | "eirinR15plus" | "eirinR18plus" | "eirinUnrated" | undefined;
} & {
    readonly fcbmRating?: "fcbmUnspecified" | "fcbmU" | "fcbmPg13" | "fcbmP13" | "fcbm18" | "fcbm18sx" | "fcbm18pa" | "fcbm18sg" | "fcbm18pl" | "fcbmUnrated" | undefined;
} & {
    readonly fcoRating?: "fcoUnspecified" | "fcoI" | "fcoIia" | "fcoIib" | "fcoIi" | "fcoIii" | "fcoUnrated" | undefined;
} & {
    readonly fmocRating?: "fmocUnspecified" | "fmocU" | "fmoc10" | "fmoc12" | "fmoc16" | "fmoc18" | "fmocE" | "fmocUnrated" | undefined;
} & {
    readonly fpbRating?: "fpbUnspecified" | "fpbA" | "fpbPg" | "fpb79Pg" | "fpb1012Pg" | "fpb13" | "fpb16" | "fpb18" | "fpbX18" | "fpbXx" | "fpbUnrated" | "fpb10" | undefined;
} & {
    readonly fpbRatingReasons?: readonly ("fpbRatingReasonUnspecified" | "fpbBlasphemy" | "fpbLanguage" | "fpbNudity" | "fpbPrejudice" | "fpbSex" | "fpbViolence" | "fpbDrugs" | "fpbSexualViolence" | "fpbHorror" | "fpbCriminalTechniques" | "fpbImitativeActsTechniques")[] | undefined;
} & {
    readonly fskRating?: "fskUnspecified" | "fsk0" | "fsk6" | "fsk12" | "fsk16" | "fsk18" | "fskUnrated" | undefined;
} & {
    readonly grfilmRating?: "grfilmUnspecified" | "grfilmK" | "grfilmE" | "grfilmK12" | "grfilmK13" | "grfilmK15" | "grfilmK17" | "grfilmK18" | "grfilmUnrated" | undefined;
} & {
    readonly icaaRating?: "icaaUnspecified" | "icaaApta" | "icaa7" | "icaa12" | "icaa13" | "icaa16" | "icaa18" | "icaaX" | "icaaUnrated" | undefined;
} & {
    readonly ifcoRating?: "ifcoUnspecified" | "ifcoG" | "ifcoPg" | "ifco12" | "ifco12a" | "ifco15" | "ifco15a" | "ifco16" | "ifco18" | "ifcoUnrated" | undefined;
} & {
    readonly ilfilmRating?: "ilfilmUnspecified" | "ilfilmAa" | "ilfilm12" | "ilfilm14" | "ilfilm16" | "ilfilm18" | "ilfilmUnrated" | undefined;
} & {
    readonly incaaRating?: "incaaUnspecified" | "incaaAtp" | "incaaSam13" | "incaaSam16" | "incaaSam18" | "incaaC" | "incaaUnrated" | undefined;
} & {
    readonly kfcbRating?: "kfcbUnspecified" | "kfcbG" | "kfcbPg" | "kfcb16plus" | "kfcbR" | "kfcbUnrated" | undefined;
} & {
    readonly kijkwijzerRating?: "kijkwijzerUnspecified" | "kijkwijzerAl" | "kijkwijzer6" | "kijkwijzer9" | "kijkwijzer12" | "kijkwijzer16" | "kijkwijzer18" | "kijkwijzerUnrated" | undefined;
} & {
    readonly kmrbRating?: "kmrbUnspecified" | "kmrbAll" | "kmrb12plus" | "kmrb15plus" | "kmrbTeenr" | "kmrbR" | "kmrbUnrated" | undefined;
} & {
    readonly lsfRating?: "lsfUnspecified" | "lsfSu" | "lsfA" | "lsfBo" | "lsf13" | "lsfR" | "lsf17" | "lsfD" | "lsf21" | "lsfUnrated" | undefined;
} & {
    readonly mccaaRating?: "mccaaUnspecified" | "mccaaU" | "mccaaPg" | "mccaa12a" | "mccaa12" | "mccaa14" | "mccaa15" | "mccaa16" | "mccaa18" | "mccaaUnrated" | undefined;
} & {
    readonly mccypRating?: "mccypUnspecified" | "mccypA" | "mccyp7" | "mccyp11" | "mccyp15" | "mccypUnrated" | undefined;
} & {
    readonly mcstRating?: "mcstUnspecified" | "mcstP" | "mcst0" | "mcstC13" | "mcstC16" | "mcst16plus" | "mcstC18" | "mcstGPg" | "mcstUnrated" | undefined;
} & {
    readonly mdaRating?: "mdaUnspecified" | "mdaG" | "mdaPg" | "mdaPg13" | "mdaNc16" | "mdaM18" | "mdaR21" | "mdaUnrated" | undefined;
} & {
    readonly medietilsynetRating?: "medietilsynetUnspecified" | "medietilsynetA" | "medietilsynet6" | "medietilsynet7" | "medietilsynet9" | "medietilsynet11" | "medietilsynet12" | "medietilsynet15" | "medietilsynet18" | "medietilsynetUnrated" | undefined;
} & {
    readonly mekuRating?: "mekuUnspecified" | "mekuS" | "meku7" | "meku12" | "meku16" | "meku18" | "mekuUnrated" | undefined;
} & {
    readonly menaMpaaRating?: "menaMpaaUnspecified" | "menaMpaaG" | "menaMpaaPg" | "menaMpaaPg13" | "menaMpaaR" | "menaMpaaUnrated" | undefined;
} & {
    readonly mibacRating?: "mibacUnspecified" | "mibacT" | "mibacVap" | "mibacVm6" | "mibacVm12" | "mibacVm14" | "mibacVm16" | "mibacVm18" | "mibacUnrated" | undefined;
} & {
    readonly mocRating?: "mocUnspecified" | "mocE" | "mocT" | "moc7" | "moc12" | "moc15" | "moc18" | "mocX" | "mocBanned" | "mocUnrated" | undefined;
} & {
    readonly moctwRating?: "moctwUnspecified" | "moctwG" | "moctwP" | "moctwPg" | "moctwR" | "moctwUnrated" | "moctwR12" | "moctwR15" | undefined;
} & {
    readonly mpaaRating?: "mpaaUnspecified" | "mpaaG" | "mpaaPg" | "mpaaPg13" | "mpaaR" | "mpaaNc17" | "mpaaX" | "mpaaUnrated" | undefined;
} & {
    readonly mpaatRating?: "mpaatUnspecified" | "mpaatGb" | "mpaatRb" | undefined;
} & {
    readonly mtrcbRating?: "mtrcbUnspecified" | "mtrcbG" | "mtrcbPg" | "mtrcbR13" | "mtrcbR16" | "mtrcbR18" | "mtrcbX" | "mtrcbUnrated" | undefined;
} & {
    readonly nbcRating?: "nbcUnspecified" | "nbcG" | "nbcPg" | "nbc12plus" | "nbc15plus" | "nbc18plus" | "nbc18plusr" | "nbcPu" | "nbcUnrated" | undefined;
} & {
    readonly nbcplRating?: "nbcplUnspecified" | "nbcplI" | "nbcplIi" | "nbcplIii" | "nbcplIv" | "nbcpl18plus" | "nbcplUnrated" | undefined;
} & {
    readonly nfrcRating?: "nfrcUnspecified" | "nfrcA" | "nfrcB" | "nfrcC" | "nfrcD" | "nfrcX" | "nfrcUnrated" | undefined;
} & {
    readonly nfvcbRating?: "nfvcbUnspecified" | "nfvcbG" | "nfvcbPg" | "nfvcb12" | "nfvcb12a" | "nfvcb15" | "nfvcb18" | "nfvcbRe" | "nfvcbUnrated" | undefined;
} & {
    readonly nkclvRating?: "nkclvUnspecified" | "nkclvU" | "nkclv7plus" | "nkclv12plus" | "nkclv16plus" | "nkclv18plus" | "nkclvUnrated" | undefined;
} & {
    readonly nmcRating?: "nmcUnspecified" | "nmcG" | "nmcPg" | "nmcPg13" | "nmcPg15" | "nmc15plus" | "nmc18plus" | "nmc18tc" | "nmcUnrated" | undefined;
} & {
    readonly oflcRating?: "oflcUnspecified" | "oflcG" | "oflcPg" | "oflcM" | "oflcR13" | "oflcR15" | "oflcR16" | "oflcR18" | "oflcUnrated" | "oflcRp13" | "oflcRp16" | "oflcRp18" | undefined;
} & {
    readonly pefilmRating?: "pefilmUnspecified" | "pefilmPt" | "pefilmPg" | "pefilm14" | "pefilm18" | "pefilmUnrated" | undefined;
} & {
    readonly rcnofRating?: "rcnofUnspecified" | "rcnofI" | "rcnofIi" | "rcnofIii" | "rcnofIv" | "rcnofV" | "rcnofVi" | "rcnofUnrated" | undefined;
} & {
    readonly resorteviolenciaRating?: "resorteviolenciaUnspecified" | "resorteviolenciaA" | "resorteviolenciaB" | "resorteviolenciaC" | "resorteviolenciaD" | "resorteviolenciaE" | "resorteviolenciaUnrated" | undefined;
} & {
    readonly rtcRating?: "rtcUnspecified" | "rtcAa" | "rtcA" | "rtcB" | "rtcB15" | "rtcC" | "rtcD" | "rtcUnrated" | undefined;
} & {
    readonly rteRating?: "rteUnspecified" | "rteGa" | "rteCh" | "rtePs" | "rteMa" | "rteUnrated" | undefined;
} & {
    readonly russiaRating?: "russiaUnspecified" | "russia0" | "russia6" | "russia12" | "russia16" | "russia18" | "russiaUnrated" | undefined;
} & {
    readonly skfilmRating?: "skfilmUnspecified" | "skfilmG" | "skfilmP2" | "skfilmP5" | "skfilmP8" | "skfilmUnrated" | undefined;
} & {
    readonly smaisRating?: "smaisUnspecified" | "smaisL" | "smais7" | "smais12" | "smais14" | "smais16" | "smais18" | "smaisUnrated" | undefined;
} & {
    readonly smsaRating?: "smsaUnspecified" | "smsaA" | "smsa7" | "smsa11" | "smsa15" | "smsaUnrated" | undefined;
} & {
    readonly tvpgRating?: "tvpgUnspecified" | "tvpgY" | "tvpgY7" | "tvpgY7Fv" | "tvpgG" | "tvpgPg" | "pg14" | "tvpgMa" | "tvpgUnrated" | undefined;
} & {
    readonly ytRating?: "ytUnspecified" | "ytAgeRestricted" | undefined;
}, {}, {}>;
/**
 * Ratings schemes. The country-specific ratings are mostly for movies and shows. LINT.IfChange
 */
export declare class ContentRating extends ContentRating_base {
}
declare const AccessPolicy_base: S.Class<AccessPolicy, {
    /**
     * The value of allowed indicates whether the access to the policy is allowed or denied by default.
     */
    allowed: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * A list of region codes that identify countries where the default policy do not apply.
     */
    exception: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The value of allowed indicates whether the access to the policy is allowed or denied by default.
     */
    allowed: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * A list of region codes that identify countries where the default policy do not apply.
     */
    exception: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>, never, {
    readonly allowed?: boolean | undefined;
} & {
    readonly exception?: readonly string[] | undefined;
}, {}, {}>;
/**
 * Rights management policy for YouTube resources.
 */
export declare class AccessPolicy extends AccessPolicy_base {
}
declare const VideoContentDetailsDefinition_base: S.Literal<["sd", "hd"]>;
/**
 * The value of definition indicates whether the video is available in high definition or only in standard definition.
 */
export declare class VideoContentDetailsDefinition extends VideoContentDetailsDefinition_base {
}
declare const VideoContentDetailsProjection_base: S.Literal<["rectangular", "360"]>;
/**
 * Specifies the projection format of the video.
 */
export declare class VideoContentDetailsProjection extends VideoContentDetailsProjection_base {
}
declare const VideoContentDetailsRegionRestriction_base: S.Class<VideoContentDetailsRegionRestriction, {
    /**
     * A list of region codes that identify countries where the video is viewable. If this property is present and a country is not listed in its value, then the video is blocked from appearing in that country. If this property is present and contains an empty list, the video is blocked in all countries.
     */
    allowed: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A list of region codes that identify countries where the video is blocked. If this property is present and a country is not listed in its value, then the video is viewable in that country. If this property is present and contains an empty list, the video is viewable in all countries.
     */
    blocked: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A list of region codes that identify countries where the video is viewable. If this property is present and a country is not listed in its value, then the video is blocked from appearing in that country. If this property is present and contains an empty list, the video is blocked in all countries.
     */
    allowed: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A list of region codes that identify countries where the video is blocked. If this property is present and a country is not listed in its value, then the video is viewable in that country. If this property is present and contains an empty list, the video is viewable in all countries.
     */
    blocked: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>, never, {
    readonly allowed?: readonly string[] | undefined;
} & {
    readonly blocked?: readonly string[] | undefined;
}, {}, {}>;
/**
 * DEPRECATED Region restriction of the video.
 */
export declare class VideoContentDetailsRegionRestriction extends VideoContentDetailsRegionRestriction_base {
}
declare const VideoContentDetails_base: S.Class<VideoContentDetails, {
    /**
     * The value of captions indicates whether the video has captions or not.
     */
    caption: S.optionalWith<typeof VideoContentDetailsCaption, {
        nullable: true;
    }>;
    /**
     * Specifies the ratings that the video received under various rating schemes.
     */
    contentRating: S.optionalWith<typeof ContentRating, {
        nullable: true;
    }>;
    /**
     * The countryRestriction object contains information about the countries where a video is (or is not) viewable.
     */
    countryRestriction: S.optionalWith<typeof AccessPolicy, {
        nullable: true;
    }>;
    /**
     * The value of definition indicates whether the video is available in high definition or only in standard definition.
     */
    definition: S.optionalWith<typeof VideoContentDetailsDefinition, {
        nullable: true;
    }>;
    /**
     * The value of dimension indicates whether the video is available in 3D or in 2D.
     */
    dimension: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The length of the video. The tag value is an ISO 8601 duration in the format PT#M#S, in which the letters PT indicate that the value specifies a period of time, and the letters M and S refer to length in minutes and seconds, respectively. The # characters preceding the M and S letters are both integers that specify the number of minutes (or seconds) of the video. For example, a value of PT15M51S indicates that the video is 15 minutes and 51 seconds long.
     */
    duration: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Indicates whether the video uploader has provided a custom thumbnail image for the video. This property is only visible to the video uploader.
     */
    hasCustomThumbnail: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The value of is_license_content indicates whether the video is licensed content.
     */
    licensedContent: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Specifies the projection format of the video.
     */
    projection: S.optionalWith<typeof VideoContentDetailsProjection, {
        nullable: true;
    }>;
    /**
     * The regionRestriction object contains information about the countries where a video is (or is not) viewable. The object will contain either the contentDetails.regionRestriction.allowed property or the contentDetails.regionRestriction.blocked property.
     */
    regionRestriction: S.optionalWith<typeof VideoContentDetailsRegionRestriction, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The value of captions indicates whether the video has captions or not.
     */
    caption: S.optionalWith<typeof VideoContentDetailsCaption, {
        nullable: true;
    }>;
    /**
     * Specifies the ratings that the video received under various rating schemes.
     */
    contentRating: S.optionalWith<typeof ContentRating, {
        nullable: true;
    }>;
    /**
     * The countryRestriction object contains information about the countries where a video is (or is not) viewable.
     */
    countryRestriction: S.optionalWith<typeof AccessPolicy, {
        nullable: true;
    }>;
    /**
     * The value of definition indicates whether the video is available in high definition or only in standard definition.
     */
    definition: S.optionalWith<typeof VideoContentDetailsDefinition, {
        nullable: true;
    }>;
    /**
     * The value of dimension indicates whether the video is available in 3D or in 2D.
     */
    dimension: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The length of the video. The tag value is an ISO 8601 duration in the format PT#M#S, in which the letters PT indicate that the value specifies a period of time, and the letters M and S refer to length in minutes and seconds, respectively. The # characters preceding the M and S letters are both integers that specify the number of minutes (or seconds) of the video. For example, a value of PT15M51S indicates that the video is 15 minutes and 51 seconds long.
     */
    duration: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Indicates whether the video uploader has provided a custom thumbnail image for the video. This property is only visible to the video uploader.
     */
    hasCustomThumbnail: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The value of is_license_content indicates whether the video is licensed content.
     */
    licensedContent: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * Specifies the projection format of the video.
     */
    projection: S.optionalWith<typeof VideoContentDetailsProjection, {
        nullable: true;
    }>;
    /**
     * The regionRestriction object contains information about the countries where a video is (or is not) viewable. The object will contain either the contentDetails.regionRestriction.allowed property or the contentDetails.regionRestriction.blocked property.
     */
    regionRestriction: S.optionalWith<typeof VideoContentDetailsRegionRestriction, {
        nullable: true;
    }>;
}>, never, {
    readonly duration?: string | undefined;
} & {
    readonly projection?: "rectangular" | "360" | undefined;
} & {
    readonly caption?: "true" | "false" | undefined;
} & {
    readonly contentRating?: ContentRating | undefined;
} & {
    readonly countryRestriction?: AccessPolicy | undefined;
} & {
    readonly definition?: "sd" | "hd" | undefined;
} & {
    readonly dimension?: string | undefined;
} & {
    readonly hasCustomThumbnail?: boolean | undefined;
} & {
    readonly licensedContent?: boolean | undefined;
} & {
    readonly regionRestriction?: VideoContentDetailsRegionRestriction | undefined;
}, {}, {}>;
/**
 * Details about the content of a YouTube Video.
 */
export declare class VideoContentDetails extends VideoContentDetails_base {
}
declare const VideoFileDetailsAudioStream_base: S.Class<VideoFileDetailsAudioStream, {
    /**
     * The audio stream's bitrate, in bits per second.
     */
    bitrateBps: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of audio channels that the stream contains.
     */
    channelCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The audio codec that the stream uses.
     */
    codec: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.
     */
    vendor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The audio stream's bitrate, in bits per second.
     */
    bitrateBps: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of audio channels that the stream contains.
     */
    channelCount: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The audio codec that the stream uses.
     */
    codec: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.
     */
    vendor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly bitrateBps?: string | undefined;
} & {
    readonly channelCount?: number | undefined;
} & {
    readonly codec?: string | undefined;
} & {
    readonly vendor?: string | undefined;
}, {}, {}>;
/**
 * Information about an audio stream.
 */
export declare class VideoFileDetailsAudioStream extends VideoFileDetailsAudioStream_base {
}
declare const VideoFileDetailsFileType_base: S.Literal<["video", "audio", "image", "archive", "document", "project", "other"]>;
/**
 * The uploaded file's type as detected by YouTube's video processing engine. Currently, YouTube only processes video files, but this field is present whether a video file or another type of file was uploaded.
 */
export declare class VideoFileDetailsFileType extends VideoFileDetailsFileType_base {
}
declare const VideoFileDetailsVideoStreamRotation_base: S.Literal<["none", "clockwise", "upsideDown", "counterClockwise", "other"]>;
/**
 * The amount that YouTube needs to rotate the original source content to properly display the video.
 */
export declare class VideoFileDetailsVideoStreamRotation extends VideoFileDetailsVideoStreamRotation_base {
}
declare const VideoFileDetailsVideoStream_base: S.Class<VideoFileDetailsVideoStream, {
    /**
     * The video content's display aspect ratio, which specifies the aspect ratio in which the video should be displayed.
     */
    aspectRatio: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
    /**
     * The video stream's bitrate, in bits per second.
     */
    bitrateBps: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The video codec that the stream uses.
     */
    codec: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The video stream's frame rate, in frames per second.
     */
    frameRateFps: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
    /**
     * The encoded video content's height in pixels.
     */
    heightPixels: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The amount that YouTube needs to rotate the original source content to properly display the video.
     */
    rotation: S.optionalWith<typeof VideoFileDetailsVideoStreamRotation, {
        nullable: true;
    }>;
    /**
     * A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.
     */
    vendor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The encoded video content's width in pixels. You can calculate the video's encoding aspect ratio as width_pixels / height_pixels.
     */
    widthPixels: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The video content's display aspect ratio, which specifies the aspect ratio in which the video should be displayed.
     */
    aspectRatio: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
    /**
     * The video stream's bitrate, in bits per second.
     */
    bitrateBps: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The video codec that the stream uses.
     */
    codec: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The video stream's frame rate, in frames per second.
     */
    frameRateFps: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
    /**
     * The encoded video content's height in pixels.
     */
    heightPixels: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
    /**
     * The amount that YouTube needs to rotate the original source content to properly display the video.
     */
    rotation: S.optionalWith<typeof VideoFileDetailsVideoStreamRotation, {
        nullable: true;
    }>;
    /**
     * A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.
     */
    vendor: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The encoded video content's width in pixels. You can calculate the video's encoding aspect ratio as width_pixels / height_pixels.
     */
    widthPixels: S.optionalWith<typeof S.Int, {
        nullable: true;
    }>;
}>, never, {
    readonly bitrateBps?: string | undefined;
} & {
    readonly codec?: string | undefined;
} & {
    readonly vendor?: string | undefined;
} & {
    readonly aspectRatio?: number | undefined;
} & {
    readonly frameRateFps?: number | undefined;
} & {
    readonly heightPixels?: number | undefined;
} & {
    readonly rotation?: "none" | "other" | "clockwise" | "upsideDown" | "counterClockwise" | undefined;
} & {
    readonly widthPixels?: number | undefined;
}, {}, {}>;
/**
 * Information about a video stream.
 */
export declare class VideoFileDetailsVideoStream extends VideoFileDetailsVideoStream_base {
}
declare const VideoFileDetails_base: S.Class<VideoFileDetails, {
    /**
     * A list of audio streams contained in the uploaded video file. Each item in the list contains detailed metadata about an audio stream.
     */
    audioStreams: S.optionalWith<S.Array$<typeof VideoFileDetailsAudioStream>, {
        nullable: true;
    }>;
    /**
     * The uploaded video file's combined (video and audio) bitrate in bits per second.
     */
    bitrateBps: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The uploaded video file's container format.
     */
    container: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the uploaded video file was created. The value is specified in ISO 8601 format. Currently, the following ISO 8601 formats are supported: - Date only: YYYY-MM-DD - Naive time: YYYY-MM-DDTHH:MM:SS - Time with timezone: YYYY-MM-DDTHH:MM:SS+HH:MM
     */
    creationTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The length of the uploaded video in milliseconds.
     */
    durationMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The uploaded file's name. This field is present whether a video file or another type of file was uploaded.
     */
    fileName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The uploaded file's size in bytes. This field is present whether a video file or another type of file was uploaded.
     */
    fileSize: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The uploaded file's type as detected by YouTube's video processing engine. Currently, YouTube only processes video files, but this field is present whether a video file or another type of file was uploaded.
     */
    fileType: S.optionalWith<typeof VideoFileDetailsFileType, {
        nullable: true;
    }>;
    /**
     * A list of video streams contained in the uploaded video file. Each item in the list contains detailed metadata about a video stream.
     */
    videoStreams: S.optionalWith<S.Array$<typeof VideoFileDetailsVideoStream>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A list of audio streams contained in the uploaded video file. Each item in the list contains detailed metadata about an audio stream.
     */
    audioStreams: S.optionalWith<S.Array$<typeof VideoFileDetailsAudioStream>, {
        nullable: true;
    }>;
    /**
     * The uploaded video file's combined (video and audio) bitrate in bits per second.
     */
    bitrateBps: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The uploaded video file's container format.
     */
    container: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the uploaded video file was created. The value is specified in ISO 8601 format. Currently, the following ISO 8601 formats are supported: - Date only: YYYY-MM-DD - Naive time: YYYY-MM-DDTHH:MM:SS - Time with timezone: YYYY-MM-DDTHH:MM:SS+HH:MM
     */
    creationTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The length of the uploaded video in milliseconds.
     */
    durationMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The uploaded file's name. This field is present whether a video file or another type of file was uploaded.
     */
    fileName: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The uploaded file's size in bytes. This field is present whether a video file or another type of file was uploaded.
     */
    fileSize: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The uploaded file's type as detected by YouTube's video processing engine. Currently, YouTube only processes video files, but this field is present whether a video file or another type of file was uploaded.
     */
    fileType: S.optionalWith<typeof VideoFileDetailsFileType, {
        nullable: true;
    }>;
    /**
     * A list of video streams contained in the uploaded video file. Each item in the list contains detailed metadata about a video stream.
     */
    videoStreams: S.optionalWith<S.Array$<typeof VideoFileDetailsVideoStream>, {
        nullable: true;
    }>;
}>, never, {
    readonly bitrateBps?: string | undefined;
} & {
    readonly audioStreams?: readonly VideoFileDetailsAudioStream[] | undefined;
} & {
    readonly container?: string | undefined;
} & {
    readonly creationTime?: string | undefined;
} & {
    readonly durationMs?: string | undefined;
} & {
    readonly fileName?: string | undefined;
} & {
    readonly fileSize?: string | undefined;
} & {
    readonly fileType?: "project" | "image" | "video" | "audio" | "archive" | "document" | "other" | undefined;
} & {
    readonly videoStreams?: readonly VideoFileDetailsVideoStream[] | undefined;
}, {}, {}>;
/**
 * Describes original video file properties, including technical details about audio and video streams, but also metadata information like content length, digitization time, or geotagging information.
 */
export declare class VideoFileDetails extends VideoFileDetails_base {
}
declare const VideoLiveStreamingDetails_base: S.Class<VideoLiveStreamingDetails, {
    /**
     * The ID of the currently active live chat attached to this video. This field is filled only if the video is a currently live broadcast that has live chat. Once the broadcast transitions to complete this field will be removed and the live chat closed down. For persistent broadcasts that live chat id will no longer be tied to this video but rather to the new video being displayed at the persistent page.
     */
    activeLiveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time that the broadcast actually ended. This value will not be available until the broadcast is over.
     */
    actualEndTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time that the broadcast actually started. This value will not be available until the broadcast begins.
     */
    actualStartTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of viewers currently watching the broadcast. The property and its value will be present if the broadcast has current viewers and the broadcast owner has not hidden the viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers for a broadcast when the broadcast ends. So, this property would not identify the number of viewers watching an archived video of a live broadcast that already ended.
     */
    concurrentViewers: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time that the broadcast is scheduled to end. If the value is empty or the property is not present, then the broadcast is scheduled to contiue indefinitely.
     */
    scheduledEndTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time that the broadcast is scheduled to begin.
     */
    scheduledStartTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The ID of the currently active live chat attached to this video. This field is filled only if the video is a currently live broadcast that has live chat. Once the broadcast transitions to complete this field will be removed and the live chat closed down. For persistent broadcasts that live chat id will no longer be tied to this video but rather to the new video being displayed at the persistent page.
     */
    activeLiveChatId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time that the broadcast actually ended. This value will not be available until the broadcast is over.
     */
    actualEndTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time that the broadcast actually started. This value will not be available until the broadcast begins.
     */
    actualStartTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of viewers currently watching the broadcast. The property and its value will be present if the broadcast has current viewers and the broadcast owner has not hidden the viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers for a broadcast when the broadcast ends. So, this property would not identify the number of viewers watching an archived video of a live broadcast that already ended.
     */
    concurrentViewers: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time that the broadcast is scheduled to end. If the value is empty or the property is not present, then the broadcast is scheduled to contiue indefinitely.
     */
    scheduledEndTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The time that the broadcast is scheduled to begin.
     */
    scheduledStartTime: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly actualEndTime?: string | undefined;
} & {
    readonly actualStartTime?: string | undefined;
} & {
    readonly scheduledEndTime?: string | undefined;
} & {
    readonly scheduledStartTime?: string | undefined;
} & {
    readonly concurrentViewers?: string | undefined;
} & {
    readonly activeLiveChatId?: string | undefined;
}, {}, {}>;
/**
 * Details about the live streaming metadata.
 */
export declare class VideoLiveStreamingDetails extends VideoLiveStreamingDetails_base {
}
declare const VideoMonetizationDetails_base: S.Class<VideoMonetizationDetails, {
    /**
     * The value of access indicates whether the video can be monetized or not.
     */
    access: S.optionalWith<typeof AccessPolicy, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The value of access indicates whether the video can be monetized or not.
     */
    access: S.optionalWith<typeof AccessPolicy, {
        nullable: true;
    }>;
}>, never, {
    readonly access?: AccessPolicy | undefined;
}, {}, {}>;
/**
 * Details about monetization of a YouTube Video.
 */
export declare class VideoMonetizationDetails extends VideoMonetizationDetails_base {
}
declare const VideoPlayer_base: S.Class<VideoPlayer, {
    embedHeight: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An <iframe> tag that embeds a player that will play the video.
     */
    embedHtml: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The embed width
     */
    embedWidth: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    embedHeight: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An <iframe> tag that embeds a player that will play the video.
     */
    embedHtml: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The embed width
     */
    embedWidth: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly embedHtml?: string | undefined;
} & {
    readonly embedHeight?: string | undefined;
} & {
    readonly embedWidth?: string | undefined;
}, {}, {}>;
/**
 * Player to be used for a video playback.
 */
export declare class VideoPlayer extends VideoPlayer_base {
}
declare const VideoProcessingDetailsProcessingFailureReason_base: S.Literal<["uploadFailed", "transcodeFailed", "streamingFailed", "other"]>;
/**
 * The reason that YouTube failed to process the video. This property will only have a value if the processingStatus property's value is failed.
 */
export declare class VideoProcessingDetailsProcessingFailureReason extends VideoProcessingDetailsProcessingFailureReason_base {
}
declare const VideoProcessingDetailsProcessingProgress_base: S.Class<VideoProcessingDetailsProcessingProgress, {
    /**
     * The number of parts of the video that YouTube has already processed. You can estimate the percentage of the video that YouTube has already processed by calculating: 100 * parts_processed / parts_total Note that since the estimated number of parts could increase without a corresponding increase in the number of parts that have already been processed, it is possible that the calculated progress could periodically decrease while YouTube processes a video.
     */
    partsProcessed: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An estimate of the total number of parts that need to be processed for the video. The number may be updated with more precise estimates while YouTube processes the video.
     */
    partsTotal: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An estimate of the amount of time, in millseconds, that YouTube needs to finish processing the video.
     */
    timeLeftMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The number of parts of the video that YouTube has already processed. You can estimate the percentage of the video that YouTube has already processed by calculating: 100 * parts_processed / parts_total Note that since the estimated number of parts could increase without a corresponding increase in the number of parts that have already been processed, it is possible that the calculated progress could periodically decrease while YouTube processes a video.
     */
    partsProcessed: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An estimate of the total number of parts that need to be processed for the video. The number may be updated with more precise estimates while YouTube processes the video.
     */
    partsTotal: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * An estimate of the amount of time, in millseconds, that YouTube needs to finish processing the video.
     */
    timeLeftMs: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly partsProcessed?: string | undefined;
} & {
    readonly partsTotal?: string | undefined;
} & {
    readonly timeLeftMs?: string | undefined;
}, {}, {}>;
/**
 * Video processing progress and completion time estimate.
 */
export declare class VideoProcessingDetailsProcessingProgress extends VideoProcessingDetailsProcessingProgress_base {
}
declare const VideoProcessingDetailsProcessingStatus_base: S.Literal<["processing", "succeeded", "failed", "terminated"]>;
/**
 * The video's processing status. This value indicates whether YouTube was able to process the video or if the video is still being processed.
 */
export declare class VideoProcessingDetailsProcessingStatus extends VideoProcessingDetailsProcessingStatus_base {
}
declare const VideoProcessingDetails_base: S.Class<VideoProcessingDetails, {
    /**
     * This value indicates whether video editing suggestions, which might improve video quality or the playback experience, are available for the video. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    editorSuggestionsAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This value indicates whether file details are available for the uploaded video. You can retrieve a video's file details by requesting the fileDetails part in your videos.list() request.
     */
    fileDetailsAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The reason that YouTube failed to process the video. This property will only have a value if the processingStatus property's value is failed.
     */
    processingFailureReason: S.optionalWith<typeof VideoProcessingDetailsProcessingFailureReason, {
        nullable: true;
    }>;
    /**
     * This value indicates whether the video processing engine has generated suggestions that might improve YouTube's ability to process the the video, warnings that explain video processing problems, or errors that cause video processing problems. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    processingIssuesAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The processingProgress object contains information about the progress YouTube has made in processing the video. The values are really only relevant if the video's processing status is processing.
     */
    processingProgress: S.optionalWith<typeof VideoProcessingDetailsProcessingProgress, {
        nullable: true;
    }>;
    /**
     * The video's processing status. This value indicates whether YouTube was able to process the video or if the video is still being processed.
     */
    processingStatus: S.optionalWith<typeof VideoProcessingDetailsProcessingStatus, {
        nullable: true;
    }>;
    /**
     * This value indicates whether keyword (tag) suggestions are available for the video. Tags can be added to a video's metadata to make it easier for other users to find the video. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    tagSuggestionsAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This value indicates whether thumbnail images have been generated for the video.
     */
    thumbnailsAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * This value indicates whether video editing suggestions, which might improve video quality or the playback experience, are available for the video. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    editorSuggestionsAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This value indicates whether file details are available for the uploaded video. You can retrieve a video's file details by requesting the fileDetails part in your videos.list() request.
     */
    fileDetailsAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The reason that YouTube failed to process the video. This property will only have a value if the processingStatus property's value is failed.
     */
    processingFailureReason: S.optionalWith<typeof VideoProcessingDetailsProcessingFailureReason, {
        nullable: true;
    }>;
    /**
     * This value indicates whether the video processing engine has generated suggestions that might improve YouTube's ability to process the the video, warnings that explain video processing problems, or errors that cause video processing problems. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    processingIssuesAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The processingProgress object contains information about the progress YouTube has made in processing the video. The values are really only relevant if the video's processing status is processing.
     */
    processingProgress: S.optionalWith<typeof VideoProcessingDetailsProcessingProgress, {
        nullable: true;
    }>;
    /**
     * The video's processing status. This value indicates whether YouTube was able to process the video or if the video is still being processed.
     */
    processingStatus: S.optionalWith<typeof VideoProcessingDetailsProcessingStatus, {
        nullable: true;
    }>;
    /**
     * This value indicates whether keyword (tag) suggestions are available for the video. Tags can be added to a video's metadata to make it easier for other users to find the video. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    tagSuggestionsAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This value indicates whether thumbnail images have been generated for the video.
     */
    thumbnailsAvailability: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly editorSuggestionsAvailability?: string | undefined;
} & {
    readonly fileDetailsAvailability?: string | undefined;
} & {
    readonly processingFailureReason?: "other" | "uploadFailed" | "transcodeFailed" | "streamingFailed" | undefined;
} & {
    readonly processingIssuesAvailability?: string | undefined;
} & {
    readonly processingProgress?: VideoProcessingDetailsProcessingProgress | undefined;
} & {
    readonly processingStatus?: "failed" | "processing" | "succeeded" | "terminated" | undefined;
} & {
    readonly tagSuggestionsAvailability?: string | undefined;
} & {
    readonly thumbnailsAvailability?: string | undefined;
}, {}, {}>;
/**
 * Describes processing status and progress and availability of some other Video resource parts.
 */
export declare class VideoProcessingDetails extends VideoProcessingDetails_base {
}
declare const VideoProjectDetails_base: S.Class<VideoProjectDetails, {}, S.Struct.Encoded<{}>, never, unknown, {}, {}>;
/**
 * DEPRECATED. b/157517979: This part was never populated after it was added. However, it sees non-zero traffic because there is generated client code in the wild that refers to it [1]. We keep this field and do NOT remove it because otherwise V3 would return an error when this part gets requested [2]. [1] https://developers.google.com/resources/api-libraries/documentation/youtube/v3/csharp/latest/classGoogle_1_1Apis_1_1YouTube_1_1v3_1_1Data_1_1VideoProjectDetails.html [2] http://google3/video/youtube/src/python/servers/data_api/common.py?l=1565-1569&rcl=344141677
 */
export declare class VideoProjectDetails extends VideoProjectDetails_base {
}
declare const GeoPoint_base: S.Class<GeoPoint, {
    /**
     * Altitude above the reference ellipsoid, in meters.
     */
    altitude: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
    /**
     * Latitude in degrees.
     */
    latitude: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
    /**
     * Longitude in degrees.
     */
    longitude: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Altitude above the reference ellipsoid, in meters.
     */
    altitude: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
    /**
     * Latitude in degrees.
     */
    latitude: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
    /**
     * Longitude in degrees.
     */
    longitude: S.optionalWith<typeof S.Number, {
        nullable: true;
    }>;
}>, never, {
    readonly altitude?: number | undefined;
} & {
    readonly latitude?: number | undefined;
} & {
    readonly longitude?: number | undefined;
}, {}, {}>;
/**
 * Geographical coordinates of a point, in WGS84.
 */
export declare class GeoPoint extends GeoPoint_base {
}
declare const VideoRecordingDetails_base: S.Class<VideoRecordingDetails, {
    /**
     * The geolocation information associated with the video.
     */
    location: S.optionalWith<typeof GeoPoint, {
        nullable: true;
    }>;
    /**
     * The text description of the location where the video was recorded.
     */
    locationDescription: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the video was recorded.
     */
    recordingDate: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The geolocation information associated with the video.
     */
    location: S.optionalWith<typeof GeoPoint, {
        nullable: true;
    }>;
    /**
     * The text description of the location where the video was recorded.
     */
    locationDescription: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The date and time when the video was recorded.
     */
    recordingDate: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly location?: GeoPoint | undefined;
} & {
    readonly locationDescription?: string | undefined;
} & {
    readonly recordingDate?: string | undefined;
}, {}, {}>;
/**
 * Recording information associated with the video.
 */
export declare class VideoRecordingDetails extends VideoRecordingDetails_base {
}
declare const VideoSnippetLiveBroadcastContent_base: S.Literal<["none", "upcoming", "live", "completed"]>;
/**
 * Indicates if the video is an upcoming/active live broadcast. Or it's "none" if the video is not an upcoming/active live broadcast.
 */
export declare class VideoSnippetLiveBroadcastContent extends VideoSnippetLiveBroadcastContent_base {
}
declare const VideoLocalization_base: S.Class<VideoLocalization, {
    /**
     * Localized version of the video's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Localized version of the video's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Localized version of the video's description.
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Localized version of the video's title.
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
}, {}, {}>;
/**
 * Localized versions of certain video properties (e.g. title).
 */
export declare class VideoLocalization extends VideoLocalization_base {
}
declare const VideoSnippet_base: S.Class<VideoSnippet, {
    /**
     * The YouTube video category associated with the video.
     */
    categoryId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the channel that the video was uploaded to.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel that the video belongs to.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The default_audio_language property specifies the language spoken in the video's default audio track.
     */
    defaultAudioLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language of the videos's default snippet.
     */
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The video's description. @mutable youtube.videos.insert youtube.videos.update
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Indicates if the video is an upcoming/active live broadcast. Or it's "none" if the video is not an upcoming/active live broadcast.
     */
    liveBroadcastContent: S.optionalWith<typeof VideoSnippetLiveBroadcastContent, {
        nullable: true;
    }>;
    /**
     * Localized snippet selected with the hl parameter. If no such localization exists, this field is populated with the default snippet. (Read-only)
     */
    localized: S.optionalWith<typeof VideoLocalization, {
        nullable: true;
    }>;
    /**
     * The date and time when the video was uploaded.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of keyword tags associated with the video. Tags may contain spaces.
     */
    tags: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The video's title. @mutable youtube.videos.insert youtube.videos.update
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The YouTube video category associated with the video.
     */
    categoryId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the channel that the video was uploaded to.
     */
    channelId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Channel title for the channel that the video belongs to.
     */
    channelTitle: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The default_audio_language property specifies the language spoken in the video's default audio track.
     */
    defaultAudioLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language of the videos's default snippet.
     */
    defaultLanguage: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The video's description. @mutable youtube.videos.insert youtube.videos.update
     */
    description: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Indicates if the video is an upcoming/active live broadcast. Or it's "none" if the video is not an upcoming/active live broadcast.
     */
    liveBroadcastContent: S.optionalWith<typeof VideoSnippetLiveBroadcastContent, {
        nullable: true;
    }>;
    /**
     * Localized snippet selected with the hl parameter. If no such localization exists, this field is populated with the default snippet. (Read-only)
     */
    localized: S.optionalWith<typeof VideoLocalization, {
        nullable: true;
    }>;
    /**
     * The date and time when the video was uploaded.
     */
    publishedAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of keyword tags associated with the video. Tags may contain spaces.
     */
    tags: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    thumbnails: S.optionalWith<typeof ThumbnailDetails, {
        nullable: true;
    }>;
    /**
     * The video's title. @mutable youtube.videos.insert youtube.videos.update
     */
    title: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly title?: string | undefined;
} & {
    readonly description?: string | undefined;
} & {
    readonly publishedAt?: string | undefined;
} & {
    readonly channelId?: string | undefined;
} & {
    readonly channelTitle?: string | undefined;
} & {
    readonly thumbnails?: ThumbnailDetails | undefined;
} & {
    readonly tags?: readonly string[] | undefined;
} & {
    readonly defaultLanguage?: string | undefined;
} & {
    readonly localized?: VideoLocalization | undefined;
} & {
    readonly categoryId?: string | undefined;
} & {
    readonly liveBroadcastContent?: "none" | "upcoming" | "completed" | "live" | undefined;
} & {
    readonly defaultAudioLanguage?: string | undefined;
}, {}, {}>;
/**
 * Basic details about a video, including title, description, uploader, thumbnails and category.
 */
export declare class VideoSnippet extends VideoSnippet_base {
}
declare const VideoStatistics_base: S.Class<VideoStatistics, {
    /**
     * The number of comments for the video.
     */
    commentCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of users who have indicated that they disliked the video by giving it a negative rating.
     */
    dislikeCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of users who currently have the video marked as a favorite video.
     */
    favoriteCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of users who have indicated that they liked the video by giving it a positive rating.
     */
    likeCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of times the video has been viewed.
     */
    viewCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * The number of comments for the video.
     */
    commentCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of users who have indicated that they disliked the video by giving it a negative rating.
     */
    dislikeCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of users who currently have the video marked as a favorite video.
     */
    favoriteCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of users who have indicated that they liked the video by giving it a positive rating.
     */
    likeCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The number of times the video has been viewed.
     */
    viewCount: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly viewCount?: string | undefined;
} & {
    readonly likeCount?: string | undefined;
} & {
    readonly commentCount?: string | undefined;
} & {
    readonly dislikeCount?: string | undefined;
} & {
    readonly favoriteCount?: string | undefined;
}, {}, {}>;
/**
 * Statistics about the video, such as the number of times the video was viewed or liked.
 */
export declare class VideoStatistics extends VideoStatistics_base {
}
declare const VideoStatusFailureReason_base: S.Literal<["conversion", "invalidFile", "emptyFile", "tooSmall", "codec", "uploadAborted"]>;
/**
 * This value explains why a video failed to upload. This property is only present if the uploadStatus property indicates that the upload failed.
 */
export declare class VideoStatusFailureReason extends VideoStatusFailureReason_base {
}
declare const VideoStatusLicense_base: S.Literal<["youtube", "creativeCommon"]>;
/**
 * The video's license. @mutable youtube.videos.insert youtube.videos.update
 */
export declare class VideoStatusLicense extends VideoStatusLicense_base {
}
declare const VideoStatusPrivacyStatus_base: S.Literal<["public", "unlisted", "private"]>;
/**
 * The video's privacy status.
 */
export declare class VideoStatusPrivacyStatus extends VideoStatusPrivacyStatus_base {
}
declare const VideoStatusRejectionReason_base: S.Literal<["copyright", "inappropriate", "duplicate", "termsOfUse", "uploaderAccountSuspended", "length", "claim", "uploaderAccountClosed", "trademark", "legal"]>;
/**
 * This value explains why YouTube rejected an uploaded video. This property is only present if the uploadStatus property indicates that the upload was rejected.
 */
export declare class VideoStatusRejectionReason extends VideoStatusRejectionReason_base {
}
declare const VideoStatusUploadStatus_base: S.Literal<["uploaded", "processed", "failed", "rejected", "deleted"]>;
/**
 * The status of the uploaded video.
 */
export declare class VideoStatusUploadStatus extends VideoStatusUploadStatus_base {
}
declare const VideoStatus_base: S.Class<VideoStatus, {
    /**
     * This value indicates if the video can be embedded on another website. @mutable youtube.videos.insert youtube.videos.update
     */
    embeddable: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This value explains why a video failed to upload. This property is only present if the uploadStatus property indicates that the upload failed.
     */
    failureReason: S.optionalWith<typeof VideoStatusFailureReason, {
        nullable: true;
    }>;
    /**
     * The video's license. @mutable youtube.videos.insert youtube.videos.update
     */
    license: S.optionalWith<typeof VideoStatusLicense, {
        nullable: true;
    }>;
    madeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The video's privacy status.
     */
    privacyStatus: S.optionalWith<typeof VideoStatusPrivacyStatus, {
        nullable: true;
    }>;
    /**
     * This value indicates if the extended video statistics on the watch page can be viewed by everyone. Note that the view count, likes, etc will still be visible if this is disabled. @mutable youtube.videos.insert youtube.videos.update
     */
    publicStatsViewable: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The date and time when the video is scheduled to publish. It can be set only if the privacy status of the video is private..
     */
    publishAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This value explains why YouTube rejected an uploaded video. This property is only present if the uploadStatus property indicates that the upload was rejected.
     */
    rejectionReason: S.optionalWith<typeof VideoStatusRejectionReason, {
        nullable: true;
    }>;
    selfDeclaredMadeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The status of the uploaded video.
     */
    uploadStatus: S.optionalWith<typeof VideoStatusUploadStatus, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * This value indicates if the video can be embedded on another website. @mutable youtube.videos.insert youtube.videos.update
     */
    embeddable: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * This value explains why a video failed to upload. This property is only present if the uploadStatus property indicates that the upload failed.
     */
    failureReason: S.optionalWith<typeof VideoStatusFailureReason, {
        nullable: true;
    }>;
    /**
     * The video's license. @mutable youtube.videos.insert youtube.videos.update
     */
    license: S.optionalWith<typeof VideoStatusLicense, {
        nullable: true;
    }>;
    madeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The video's privacy status.
     */
    privacyStatus: S.optionalWith<typeof VideoStatusPrivacyStatus, {
        nullable: true;
    }>;
    /**
     * This value indicates if the extended video statistics on the watch page can be viewed by everyone. Note that the view count, likes, etc will still be visible if this is disabled. @mutable youtube.videos.insert youtube.videos.update
     */
    publicStatsViewable: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The date and time when the video is scheduled to publish. It can be set only if the privacy status of the video is private..
     */
    publishAt: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * This value explains why YouTube rejected an uploaded video. This property is only present if the uploadStatus property indicates that the upload was rejected.
     */
    rejectionReason: S.optionalWith<typeof VideoStatusRejectionReason, {
        nullable: true;
    }>;
    selfDeclaredMadeForKids: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    /**
     * The status of the uploaded video.
     */
    uploadStatus: S.optionalWith<typeof VideoStatusUploadStatus, {
        nullable: true;
    }>;
}>, never, {
    readonly failureReason?: "codec" | "conversion" | "invalidFile" | "emptyFile" | "tooSmall" | "uploadAborted" | undefined;
} & {
    readonly madeForKids?: boolean | undefined;
} & {
    readonly privacyStatus?: "public" | "unlisted" | "private" | undefined;
} & {
    readonly selfDeclaredMadeForKids?: boolean | undefined;
} & {
    readonly embeddable?: boolean | undefined;
} & {
    readonly license?: "youtube" | "creativeCommon" | undefined;
} & {
    readonly publicStatsViewable?: boolean | undefined;
} & {
    readonly publishAt?: string | undefined;
} & {
    readonly rejectionReason?: "length" | "copyright" | "inappropriate" | "duplicate" | "termsOfUse" | "uploaderAccountSuspended" | "claim" | "uploaderAccountClosed" | "trademark" | "legal" | undefined;
} & {
    readonly uploadStatus?: "failed" | "rejected" | "uploaded" | "processed" | "deleted" | undefined;
}, {}, {}>;
/**
 * Basic details about a video category, such as its localized title. Next Id: 18
 */
export declare class VideoStatus extends VideoStatus_base {
}
declare const VideoSuggestionsTagSuggestion_base: S.Class<VideoSuggestionsTagSuggestion, {
    /**
     * A set of video categories for which the tag is relevant. You can use this information to display appropriate tag suggestions based on the video category that the video uploader associates with the video. By default, tag suggestions are relevant for all categories if there are no restricts defined for the keyword.
     */
    categoryRestricts: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The keyword tag suggested for the video.
     */
    tag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A set of video categories for which the tag is relevant. You can use this information to display appropriate tag suggestions based on the video category that the video uploader associates with the video. By default, tag suggestions are relevant for all categories if there are no restricts defined for the keyword.
     */
    categoryRestricts: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * The keyword tag suggested for the video.
     */
    tag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly categoryRestricts?: readonly string[] | undefined;
} & {
    readonly tag?: string | undefined;
}, {}, {}>;
/**
 * A single tag suggestion with it's relevance information.
 */
export declare class VideoSuggestionsTagSuggestion extends VideoSuggestionsTagSuggestion_base {
}
declare const VideoSuggestions_base: S.Class<VideoSuggestions, {
    /**
     * A list of video editing operations that might improve the video quality or playback experience of the uploaded video.
     */
    editorSuggestions: S.optionalWith<S.Array$<S.Literal<["videoAutoLevels", "videoStabilize", "videoCrop", "audioQuietAudioSwap"]>>, {
        nullable: true;
    }>;
    /**
     * A list of errors that will prevent YouTube from successfully processing the uploaded video video. These errors indicate that, regardless of the video's current processing status, eventually, that status will almost certainly be failed.
     */
    processingErrors: S.optionalWith<S.Array$<S.Literal<["audioFile", "imageFile", "projectFile", "notAVideoFile", "docFile", "archiveFile", "unsupportedSpatialAudioLayout"]>>, {
        nullable: true;
    }>;
    /**
     * A list of suggestions that may improve YouTube's ability to process the video.
     */
    processingHints: S.optionalWith<S.Array$<S.Literal<["nonStreamableMov", "sendBestQualityVideo", "sphericalVideo", "spatialAudio", "vrVideo", "hdrVideo"]>>, {
        nullable: true;
    }>;
    /**
     * A list of reasons why YouTube may have difficulty transcoding the uploaded video or that might result in an erroneous transcoding. These warnings are generated before YouTube actually processes the uploaded video file. In addition, they identify issues that are unlikely to cause the video processing to fail but that might cause problems such as sync issues, video artifacts, or a missing audio track.
     */
    processingWarnings: S.optionalWith<S.Array$<S.Literal<["unknownContainer", "unknownVideoCodec", "unknownAudioCodec", "inconsistentResolution", "hasEditlist", "problematicVideoCodec", "problematicAudioCodec", "unsupportedVrStereoMode", "unsupportedSphericalProjectionType", "unsupportedHdrPixelFormat", "unsupportedHdrColorMetadata", "problematicHdrLookupTable"]>>, {
        nullable: true;
    }>;
    /**
     * A list of keyword tags that could be added to the video's metadata to increase the likelihood that users will locate your video when searching or browsing on YouTube.
     */
    tagSuggestions: S.optionalWith<S.Array$<typeof VideoSuggestionsTagSuggestion>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * A list of video editing operations that might improve the video quality or playback experience of the uploaded video.
     */
    editorSuggestions: S.optionalWith<S.Array$<S.Literal<["videoAutoLevels", "videoStabilize", "videoCrop", "audioQuietAudioSwap"]>>, {
        nullable: true;
    }>;
    /**
     * A list of errors that will prevent YouTube from successfully processing the uploaded video video. These errors indicate that, regardless of the video's current processing status, eventually, that status will almost certainly be failed.
     */
    processingErrors: S.optionalWith<S.Array$<S.Literal<["audioFile", "imageFile", "projectFile", "notAVideoFile", "docFile", "archiveFile", "unsupportedSpatialAudioLayout"]>>, {
        nullable: true;
    }>;
    /**
     * A list of suggestions that may improve YouTube's ability to process the video.
     */
    processingHints: S.optionalWith<S.Array$<S.Literal<["nonStreamableMov", "sendBestQualityVideo", "sphericalVideo", "spatialAudio", "vrVideo", "hdrVideo"]>>, {
        nullable: true;
    }>;
    /**
     * A list of reasons why YouTube may have difficulty transcoding the uploaded video or that might result in an erroneous transcoding. These warnings are generated before YouTube actually processes the uploaded video file. In addition, they identify issues that are unlikely to cause the video processing to fail but that might cause problems such as sync issues, video artifacts, or a missing audio track.
     */
    processingWarnings: S.optionalWith<S.Array$<S.Literal<["unknownContainer", "unknownVideoCodec", "unknownAudioCodec", "inconsistentResolution", "hasEditlist", "problematicVideoCodec", "problematicAudioCodec", "unsupportedVrStereoMode", "unsupportedSphericalProjectionType", "unsupportedHdrPixelFormat", "unsupportedHdrColorMetadata", "problematicHdrLookupTable"]>>, {
        nullable: true;
    }>;
    /**
     * A list of keyword tags that could be added to the video's metadata to increase the likelihood that users will locate your video when searching or browsing on YouTube.
     */
    tagSuggestions: S.optionalWith<S.Array$<typeof VideoSuggestionsTagSuggestion>, {
        nullable: true;
    }>;
}>, never, {
    readonly editorSuggestions?: readonly ("videoAutoLevels" | "videoStabilize" | "videoCrop" | "audioQuietAudioSwap")[] | undefined;
} & {
    readonly processingErrors?: readonly ("audioFile" | "imageFile" | "projectFile" | "notAVideoFile" | "docFile" | "archiveFile" | "unsupportedSpatialAudioLayout")[] | undefined;
} & {
    readonly processingHints?: readonly ("nonStreamableMov" | "sendBestQualityVideo" | "sphericalVideo" | "spatialAudio" | "vrVideo" | "hdrVideo")[] | undefined;
} & {
    readonly processingWarnings?: readonly ("unknownContainer" | "unknownVideoCodec" | "unknownAudioCodec" | "inconsistentResolution" | "hasEditlist" | "problematicVideoCodec" | "problematicAudioCodec" | "unsupportedVrStereoMode" | "unsupportedSphericalProjectionType" | "unsupportedHdrPixelFormat" | "unsupportedHdrColorMetadata" | "problematicHdrLookupTable")[] | undefined;
} & {
    readonly tagSuggestions?: readonly VideoSuggestionsTagSuggestion[] | undefined;
}, {}, {}>;
/**
 * Specifies suggestions on how to improve video content, including encoding hints, tag suggestions, and editor suggestions.
 */
export declare class VideoSuggestions extends VideoSuggestions_base {
}
declare const VideoTopicDetails_base: S.Class<VideoTopicDetails, {
    /**
     * Similar to topic_id, except that these topics are merely relevant to the video. These are topics that may be mentioned in, or appear in the video. You can retrieve information about each topic using Freebase Topic API.
     */
    relevantTopicIds: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A list of Wikipedia URLs that provide a high-level description of the video's content.
     */
    topicCategories: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A list of Freebase topic IDs that are centrally associated with the video. These are topics that are centrally featured in the video, and it can be said that the video is mainly about each of these. You can retrieve information about each topic using the < a href="http://wiki.freebase.com/wiki/Topic_API">Freebase Topic API.
     */
    topicIds: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Similar to topic_id, except that these topics are merely relevant to the video. These are topics that may be mentioned in, or appear in the video. You can retrieve information about each topic using Freebase Topic API.
     */
    relevantTopicIds: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A list of Wikipedia URLs that provide a high-level description of the video's content.
     */
    topicCategories: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
    /**
     * A list of Freebase topic IDs that are centrally associated with the video. These are topics that are centrally featured in the video, and it can be said that the video is mainly about each of these. You can retrieve information about each topic using the < a href="http://wiki.freebase.com/wiki/Topic_API">Freebase Topic API.
     */
    topicIds: S.optionalWith<S.Array$<typeof S.String>, {
        nullable: true;
    }>;
}>, never, {
    readonly topicCategories?: readonly string[] | undefined;
} & {
    readonly topicIds?: readonly string[] | undefined;
} & {
    readonly relevantTopicIds?: readonly string[] | undefined;
}, {}, {}>;
/**
 * Freebase topic information related to the video.
 */
export declare class VideoTopicDetails extends VideoTopicDetails_base {
}
declare const Video_base: S.Class<Video, {
    /**
     * Age restriction details related to a video. This data can only be retrieved by the video owner.
     */
    ageGating: S.optionalWith<typeof VideoAgeGating, {
        nullable: true;
    }>;
    /**
     * The contentDetails object contains information about the video content, including the length of the video and its aspect ratio.
     */
    contentDetails: S.optionalWith<typeof VideoContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The fileDetails object encapsulates information about the video file that was uploaded to YouTube, including the file's resolution, duration, audio and video codecs, stream bitrates, and more. This data can only be retrieved by the video owner.
     */
    fileDetails: S.optionalWith<typeof VideoFileDetails, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#video".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#video";
    }>;
    /**
     * The liveStreamingDetails object contains metadata about a live video broadcast. The object will only be present in a video resource if the video is an upcoming, live, or completed live broadcast.
     */
    liveStreamingDetails: S.optionalWith<typeof VideoLiveStreamingDetails, {
        nullable: true;
    }>;
    /**
     * The localizations object contains localized versions of the basic details about the video, such as its title and description.
     */
    localizations: S.optionalWith<S.Record$<typeof S.String, typeof S.Unknown>, {
        nullable: true;
    }>;
    /**
     * The monetizationDetails object encapsulates information about the monetization status of the video.
     */
    monetizationDetails: S.optionalWith<typeof VideoMonetizationDetails, {
        nullable: true;
    }>;
    /**
     * The player object contains information that you would use to play the video in an embedded player.
     */
    player: S.optionalWith<typeof VideoPlayer, {
        nullable: true;
    }>;
    /**
     * The processingDetails object encapsulates information about YouTube's progress in processing the uploaded video file. The properties in the object identify the current processing status and an estimate of the time remaining until YouTube finishes processing the video. This part also indicates whether different types of data or content, such as file details or thumbnail images, are available for the video. The processingProgress object is designed to be polled so that the video uploaded can track the progress that YouTube has made in processing the uploaded video file. This data can only be retrieved by the video owner.
     */
    processingDetails: S.optionalWith<typeof VideoProcessingDetails, {
        nullable: true;
    }>;
    /**
     * The projectDetails object contains information about the project specific video metadata. b/157517979: This part was never populated after it was added. However, it sees non-zero traffic because there is generated client code in the wild that refers to it [1]. We keep this field and do NOT remove it because otherwise V3 would return an error when this part gets requested [2]. [1] https://developers.google.com/resources/api-libraries/documentation/youtube/v3/csharp/latest/classGoogle_1_1Apis_1_1YouTube_1_1v3_1_1Data_1_1VideoProjectDetails.html [2] http://google3/video/youtube/src/python/servers/data_api/common.py?l=1565-1569&rcl=344141677
     */
    projectDetails: S.optionalWith<typeof VideoProjectDetails, {
        nullable: true;
    }>;
    /**
     * The recordingDetails object encapsulates information about the location, date and address where the video was recorded.
     */
    recordingDetails: S.optionalWith<typeof VideoRecordingDetails, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the video, such as its title, description, and category.
     */
    snippet: S.optionalWith<typeof VideoSnippet, {
        nullable: true;
    }>;
    /**
     * The statistics object contains statistics about the video.
     */
    statistics: S.optionalWith<typeof VideoStatistics, {
        nullable: true;
    }>;
    /**
     * The status object contains information about the video's uploading, processing, and privacy statuses.
     */
    status: S.optionalWith<typeof VideoStatus, {
        nullable: true;
    }>;
    /**
     * The suggestions object encapsulates suggestions that identify opportunities to improve the video quality or the metadata for the uploaded video. This data can only be retrieved by the video owner.
     */
    suggestions: S.optionalWith<typeof VideoSuggestions, {
        nullable: true;
    }>;
    /**
     * The topicDetails object encapsulates information about Freebase topics associated with the video.
     */
    topicDetails: S.optionalWith<typeof VideoTopicDetails, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Age restriction details related to a video. This data can only be retrieved by the video owner.
     */
    ageGating: S.optionalWith<typeof VideoAgeGating, {
        nullable: true;
    }>;
    /**
     * The contentDetails object contains information about the video content, including the length of the video and its aspect ratio.
     */
    contentDetails: S.optionalWith<typeof VideoContentDetails, {
        nullable: true;
    }>;
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The fileDetails object encapsulates information about the video file that was uploaded to YouTube, including the file's resolution, duration, audio and video codecs, stream bitrates, and more. This data can only be retrieved by the video owner.
     */
    fileDetails: S.optionalWith<typeof VideoFileDetails, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    id: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#video".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#video";
    }>;
    /**
     * The liveStreamingDetails object contains metadata about a live video broadcast. The object will only be present in a video resource if the video is an upcoming, live, or completed live broadcast.
     */
    liveStreamingDetails: S.optionalWith<typeof VideoLiveStreamingDetails, {
        nullable: true;
    }>;
    /**
     * The localizations object contains localized versions of the basic details about the video, such as its title and description.
     */
    localizations: S.optionalWith<S.Record$<typeof S.String, typeof S.Unknown>, {
        nullable: true;
    }>;
    /**
     * The monetizationDetails object encapsulates information about the monetization status of the video.
     */
    monetizationDetails: S.optionalWith<typeof VideoMonetizationDetails, {
        nullable: true;
    }>;
    /**
     * The player object contains information that you would use to play the video in an embedded player.
     */
    player: S.optionalWith<typeof VideoPlayer, {
        nullable: true;
    }>;
    /**
     * The processingDetails object encapsulates information about YouTube's progress in processing the uploaded video file. The properties in the object identify the current processing status and an estimate of the time remaining until YouTube finishes processing the video. This part also indicates whether different types of data or content, such as file details or thumbnail images, are available for the video. The processingProgress object is designed to be polled so that the video uploaded can track the progress that YouTube has made in processing the uploaded video file. This data can only be retrieved by the video owner.
     */
    processingDetails: S.optionalWith<typeof VideoProcessingDetails, {
        nullable: true;
    }>;
    /**
     * The projectDetails object contains information about the project specific video metadata. b/157517979: This part was never populated after it was added. However, it sees non-zero traffic because there is generated client code in the wild that refers to it [1]. We keep this field and do NOT remove it because otherwise V3 would return an error when this part gets requested [2]. [1] https://developers.google.com/resources/api-libraries/documentation/youtube/v3/csharp/latest/classGoogle_1_1Apis_1_1YouTube_1_1v3_1_1Data_1_1VideoProjectDetails.html [2] http://google3/video/youtube/src/python/servers/data_api/common.py?l=1565-1569&rcl=344141677
     */
    projectDetails: S.optionalWith<typeof VideoProjectDetails, {
        nullable: true;
    }>;
    /**
     * The recordingDetails object encapsulates information about the location, date and address where the video was recorded.
     */
    recordingDetails: S.optionalWith<typeof VideoRecordingDetails, {
        nullable: true;
    }>;
    /**
     * The snippet object contains basic details about the video, such as its title, description, and category.
     */
    snippet: S.optionalWith<typeof VideoSnippet, {
        nullable: true;
    }>;
    /**
     * The statistics object contains statistics about the video.
     */
    statistics: S.optionalWith<typeof VideoStatistics, {
        nullable: true;
    }>;
    /**
     * The status object contains information about the video's uploading, processing, and privacy statuses.
     */
    status: S.optionalWith<typeof VideoStatus, {
        nullable: true;
    }>;
    /**
     * The suggestions object encapsulates suggestions that identify opportunities to improve the video quality or the metadata for the uploaded video. This data can only be retrieved by the video owner.
     */
    suggestions: S.optionalWith<typeof VideoSuggestions, {
        nullable: true;
    }>;
    /**
     * The topicDetails object encapsulates information about Freebase topics associated with the video.
     */
    topicDetails: S.optionalWith<typeof VideoTopicDetails, {
        nullable: true;
    }>;
}>, never, {
    readonly id?: string | undefined;
} & {
    readonly kind?: string;
} & {
    readonly contentDetails?: VideoContentDetails | undefined;
} & {
    readonly etag?: string | undefined;
} & {
    readonly snippet?: VideoSnippet | undefined;
} & {
    readonly status?: VideoStatus | undefined;
} & {
    readonly localizations?: {
        readonly [x: string]: unknown;
    } | undefined;
} & {
    readonly statistics?: VideoStatistics | undefined;
} & {
    readonly topicDetails?: VideoTopicDetails | undefined;
} & {
    readonly player?: VideoPlayer | undefined;
} & {
    readonly ageGating?: VideoAgeGating | undefined;
} & {
    readonly fileDetails?: VideoFileDetails | undefined;
} & {
    readonly liveStreamingDetails?: VideoLiveStreamingDetails | undefined;
} & {
    readonly monetizationDetails?: VideoMonetizationDetails | undefined;
} & {
    readonly processingDetails?: VideoProcessingDetails | undefined;
} & {
    readonly projectDetails?: VideoProjectDetails | undefined;
} & {
    readonly recordingDetails?: VideoRecordingDetails | undefined;
} & {
    readonly suggestions?: VideoSuggestions | undefined;
}, {}, {}>;
/**
 * A *video* resource represents a YouTube video.
 */
export declare class Video extends Video_base {
}
declare const VideoListResponse_base: S.Class<VideoListResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof Video>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    items: S.optionalWith<S.Array$<typeof Video>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoListResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoListResponse";
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    nextPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * General pagination information.
     */
    pageInfo: S.optionalWith<typeof PageInfo, {
        nullable: true;
    }>;
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    prevPageToken: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    tokenPagination: S.optionalWith<typeof TokenPagination, {
        nullable: true;
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly Video[] | undefined;
} & {
    readonly nextPageToken?: string | undefined;
} & {
    readonly pageInfo?: PageInfo | undefined;
} & {
    readonly prevPageToken?: string | undefined;
} & {
    readonly tokenPagination?: TokenPagination | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class VideoListResponse extends VideoListResponse_base {
}
declare const YoutubeVideosUpdateParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeVideosUpdateParams extends YoutubeVideosUpdateParams_base {
}
declare const YoutubeVideosInsertParams_base: S.Struct<{
    part: S.Array$<typeof S.String>;
    autoLevels: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    notifySubscribers: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    onBehalfOfContentOwnerChannel: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    stabilize: S.optionalWith<typeof S.Boolean, {
        nullable: true;
    }>;
}>;
export declare class YoutubeVideosInsertParams extends YoutubeVideosInsertParams_base {
}
declare const YoutubeVideosDeleteParams_base: S.Struct<{
    id: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeVideosDeleteParams extends YoutubeVideosDeleteParams_base {
}
declare const YoutubeVideosGetRatingParams_base: S.Struct<{
    id: S.Array$<typeof S.String>;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeVideosGetRatingParams extends YoutubeVideosGetRatingParams_base {
}
declare const VideoRatingRating_base: S.Literal<["none", "like", "dislike"]>;
/**
 * Rating of a video.
 */
export declare class VideoRatingRating extends VideoRatingRating_base {
}
declare const VideoRating_base: S.Class<VideoRating, {
    /**
     * Rating of a video.
     */
    rating: S.optionalWith<typeof VideoRatingRating, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Rating of a video.
     */
    rating: S.optionalWith<typeof VideoRatingRating, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly videoId?: string | undefined;
} & {
    readonly rating?: "like" | "none" | "dislike" | undefined;
}, {}, {}>;
/**
 * Basic details about rating of a video.
 */
export declare class VideoRating extends VideoRating_base {
}
declare const VideoGetRatingResponse_base: S.Class<VideoGetRatingResponse, {
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of ratings that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof VideoRating>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoGetRatingResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoGetRatingResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Etag of this resource.
     */
    etag: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * Serialized EventId of the request which produced this response.
     */
    eventId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * A list of ratings that match the request criteria.
     */
    items: S.optionalWith<S.Array$<typeof VideoRating>, {
        nullable: true;
    }>;
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoGetRatingResponse".
     */
    kind: S.optionalWith<typeof S.String, {
        nullable: true;
        default: () => "youtube#videoGetRatingResponse";
    }>;
    /**
     * The visitorId identifies the visitor.
     */
    visitorId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly kind?: string;
} & {
    readonly etag?: string | undefined;
} & {
    readonly eventId?: string | undefined;
} & {
    readonly items?: readonly VideoRating[] | undefined;
} & {
    readonly visitorId?: string | undefined;
}, {}, {}>;
export declare class VideoGetRatingResponse extends VideoGetRatingResponse_base {
}
declare const YoutubeVideosRateParamsRating_base: S.Literal<["none", "like", "dislike"]>;
export declare class YoutubeVideosRateParamsRating extends YoutubeVideosRateParamsRating_base {
}
declare const YoutubeVideosRateParams_base: S.Struct<{
    id: typeof S.String;
    rating: typeof YoutubeVideosRateParamsRating;
}>;
export declare class YoutubeVideosRateParams extends YoutubeVideosRateParams_base {
}
declare const YoutubeVideosReportAbuseParams_base: S.Struct<{
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeVideosReportAbuseParams extends YoutubeVideosReportAbuseParams_base {
}
declare const VideoAbuseReport_base: S.Class<VideoAbuseReport, {
    /**
     * Additional comments regarding the abuse report.
     */
    comments: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language that the content was viewed in.
     */
    language: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The high-level, or primary, reason that the content is abusive. The value is an abuse report reason ID.
     */
    reasonId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The specific, or secondary, reason that this content is abusive (if available). The value is an abuse report reason ID that is a valid secondary reason for the primary reason.
     */
    secondaryReasonId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}, S.Struct.Encoded<{
    /**
     * Additional comments regarding the abuse report.
     */
    comments: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The language that the content was viewed in.
     */
    language: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The high-level, or primary, reason that the content is abusive. The value is an abuse report reason ID.
     */
    reasonId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The specific, or secondary, reason that this content is abusive (if available). The value is an abuse report reason ID that is a valid secondary reason for the primary reason.
     */
    secondaryReasonId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    videoId: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>, never, {
    readonly videoId?: string | undefined;
} & {
    readonly language?: string | undefined;
} & {
    readonly comments?: string | undefined;
} & {
    readonly reasonId?: string | undefined;
} & {
    readonly secondaryReasonId?: string | undefined;
}, {}, {}>;
export declare class VideoAbuseReport extends VideoAbuseReport_base {
}
declare const YoutubeWatermarksSetParams_base: S.Struct<{
    channelId: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeWatermarksSetParams extends YoutubeWatermarksSetParams_base {
}
declare const YoutubeWatermarksUnsetParams_base: S.Struct<{
    channelId: typeof S.String;
    onBehalfOfContentOwner: S.optionalWith<typeof S.String, {
        nullable: true;
    }>;
}>;
export declare class YoutubeWatermarksUnsetParams extends YoutubeWatermarksUnsetParams_base {
}
export declare const make: (httpClient: HttpClient.HttpClient, options?: {
    readonly transformClient?: ((client: HttpClient.HttpClient) => Effect.Effect<HttpClient.HttpClient>) | undefined;
}) => Client;
export interface Client {
    readonly httpClient: HttpClient.HttpClient;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeAbuseReportsInsert": (options: {
        readonly params: typeof YoutubeAbuseReportsInsertParams.Encoded;
        readonly payload: typeof AbuseReport.Encoded;
    }) => Effect.Effect<typeof AbuseReport.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeActivitiesList": (options: typeof YoutubeActivitiesListParams.Encoded) => Effect.Effect<typeof ActivityListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeCaptionsList": (options: typeof YoutubeCaptionsListParams.Encoded) => Effect.Effect<typeof CaptionListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubeCaptionsUpdate": (options: typeof YoutubeCaptionsUpdateParams.Encoded) => Effect.Effect<typeof Caption.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeCaptionsInsert": (options: typeof YoutubeCaptionsInsertParams.Encoded) => Effect.Effect<typeof Caption.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a resource.
     */
    readonly "youtubeCaptionsDelete": (options: typeof YoutubeCaptionsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Downloads a caption track.
     */
    readonly "youtubeCaptionsDownload": (id: string, options?: typeof YoutubeCaptionsDownloadParams.Encoded | undefined) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeChannelBannersInsert": (options?: typeof YoutubeChannelBannersInsertParams.Encoded | undefined) => Effect.Effect<typeof ChannelBannerResource.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeChannelSectionsList": (options: typeof YoutubeChannelSectionsListParams.Encoded) => Effect.Effect<typeof ChannelSectionListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubeChannelSectionsUpdate": (options: {
        readonly params: typeof YoutubeChannelSectionsUpdateParams.Encoded;
        readonly payload: typeof ChannelSection.Encoded;
    }) => Effect.Effect<typeof ChannelSection.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeChannelSectionsInsert": (options: {
        readonly params: typeof YoutubeChannelSectionsInsertParams.Encoded;
        readonly payload: typeof ChannelSection.Encoded;
    }) => Effect.Effect<typeof ChannelSection.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a resource.
     */
    readonly "youtubeChannelSectionsDelete": (options: typeof YoutubeChannelSectionsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeChannelsList": (options: typeof YoutubeChannelsListParams.Encoded) => Effect.Effect<typeof ChannelListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubeChannelsUpdate": (options: {
        readonly params: typeof YoutubeChannelsUpdateParams.Encoded;
        readonly payload: typeof Channel.Encoded;
    }) => Effect.Effect<typeof Channel.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeCommentThreadsList": (options: typeof YoutubeCommentThreadsListParams.Encoded) => Effect.Effect<typeof CommentThreadListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubeYoutubeV3UpdateCommentThreads": (options: {
        readonly params?: typeof YoutubeYoutubeV3UpdateCommentThreadsParams.Encoded | undefined;
        readonly payload: typeof CommentThread.Encoded;
    }) => Effect.Effect<typeof CommentThread.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeCommentThreadsInsert": (options: {
        readonly params: typeof YoutubeCommentThreadsInsertParams.Encoded;
        readonly payload: typeof CommentThread.Encoded;
    }) => Effect.Effect<typeof CommentThread.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeCommentsList": (options: typeof YoutubeCommentsListParams.Encoded) => Effect.Effect<typeof CommentListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubeCommentsUpdate": (options: {
        readonly params: typeof YoutubeCommentsUpdateParams.Encoded;
        readonly payload: typeof Comment.Encoded;
    }) => Effect.Effect<typeof Comment.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeCommentsInsert": (options: {
        readonly params: typeof YoutubeCommentsInsertParams.Encoded;
        readonly payload: typeof Comment.Encoded;
    }) => Effect.Effect<typeof Comment.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a resource.
     */
    readonly "youtubeCommentsDelete": (options: typeof YoutubeCommentsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Expresses the caller's opinion that one or more comments should be flagged as spam.
     */
    readonly "youtubeCommentsMarkAsSpam": (options: typeof YoutubeCommentsMarkAsSpamParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Sets the moderation status of one or more comments.
     */
    readonly "youtubeCommentsSetModerationStatus": (options: typeof YoutubeCommentsSetModerationStatusParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeI18NLanguagesList": (options: typeof YoutubeI18NLanguagesListParams.Encoded) => Effect.Effect<typeof I18NLanguageListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeI18NRegionsList": (options: typeof YoutubeI18NRegionsListParams.Encoded) => Effect.Effect<typeof I18NRegionListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieve the list of broadcasts associated with the given channel.
     */
    readonly "youtubeLiveBroadcastsList": (options: typeof YoutubeLiveBroadcastsListParams.Encoded) => Effect.Effect<typeof LiveBroadcastListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing broadcast for the authenticated user.
     */
    readonly "youtubeLiveBroadcastsUpdate": (options: {
        readonly params: typeof YoutubeLiveBroadcastsUpdateParams.Encoded;
        readonly payload: typeof LiveBroadcast.Encoded;
    }) => Effect.Effect<typeof LiveBroadcast.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new stream for the authenticated user.
     */
    readonly "youtubeLiveBroadcastsInsert": (options: {
        readonly params: typeof YoutubeLiveBroadcastsInsertParams.Encoded;
        readonly payload: typeof LiveBroadcast.Encoded;
    }) => Effect.Effect<typeof LiveBroadcast.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Delete a given broadcast.
     */
    readonly "youtubeLiveBroadcastsDelete": (options: typeof YoutubeLiveBroadcastsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Bind a broadcast to a stream.
     */
    readonly "youtubeLiveBroadcastsBind": (options: typeof YoutubeLiveBroadcastsBindParams.Encoded) => Effect.Effect<typeof LiveBroadcast.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Insert cuepoints in a broadcast
     */
    readonly "youtubeLiveBroadcastsInsertCuepoint": (options: {
        readonly params?: typeof YoutubeLiveBroadcastsInsertCuepointParams.Encoded | undefined;
        readonly payload: typeof Cuepoint.Encoded;
    }) => Effect.Effect<typeof Cuepoint.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Transition a broadcast to a given status.
     */
    readonly "youtubeLiveBroadcastsTransition": (options: typeof YoutubeLiveBroadcastsTransitionParams.Encoded) => Effect.Effect<typeof LiveBroadcast.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeLiveChatBansInsert": (options: {
        readonly params: typeof YoutubeLiveChatBansInsertParams.Encoded;
        readonly payload: typeof LiveChatBan.Encoded;
    }) => Effect.Effect<typeof LiveChatBan.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a chat ban.
     */
    readonly "youtubeLiveChatBansDelete": (options: typeof YoutubeLiveChatBansDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeLiveChatMessagesList": (options: typeof YoutubeLiveChatMessagesListParams.Encoded) => Effect.Effect<typeof LiveChatMessageListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeLiveChatMessagesInsert": (options: {
        readonly params: typeof YoutubeLiveChatMessagesInsertParams.Encoded;
        readonly payload: typeof LiveChatMessage.Encoded;
    }) => Effect.Effect<typeof LiveChatMessage.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a chat message.
     */
    readonly "youtubeLiveChatMessagesDelete": (options: typeof YoutubeLiveChatMessagesDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeLiveChatModeratorsList": (options: typeof YoutubeLiveChatModeratorsListParams.Encoded) => Effect.Effect<typeof LiveChatModeratorListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeLiveChatModeratorsInsert": (options: {
        readonly params: typeof YoutubeLiveChatModeratorsInsertParams.Encoded;
        readonly payload: typeof LiveChatModerator.Encoded;
    }) => Effect.Effect<typeof LiveChatModerator.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a chat moderator.
     */
    readonly "youtubeLiveChatModeratorsDelete": (options: typeof YoutubeLiveChatModeratorsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieve the list of streams associated with the given channel. --
     */
    readonly "youtubeLiveStreamsList": (options: typeof YoutubeLiveStreamsListParams.Encoded) => Effect.Effect<typeof LiveStreamListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing stream for the authenticated user.
     */
    readonly "youtubeLiveStreamsUpdate": (options: {
        readonly params: typeof YoutubeLiveStreamsUpdateParams.Encoded;
        readonly payload: typeof LiveStream.Encoded;
    }) => Effect.Effect<typeof LiveStream.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new stream for the authenticated user.
     */
    readonly "youtubeLiveStreamsInsert": (options: {
        readonly params: typeof YoutubeLiveStreamsInsertParams.Encoded;
        readonly payload: typeof LiveStream.Encoded;
    }) => Effect.Effect<typeof LiveStream.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes an existing stream for the authenticated user.
     */
    readonly "youtubeLiveStreamsDelete": (options: typeof YoutubeLiveStreamsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of members that match the request criteria for a channel.
     */
    readonly "youtubeMembersList": (options: typeof YoutubeMembersListParams.Encoded) => Effect.Effect<typeof MemberListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of all pricing levels offered by a creator to the fans.
     */
    readonly "youtubeMembershipsLevelsList": (options: typeof YoutubeMembershipsLevelsListParams.Encoded) => Effect.Effect<typeof MembershipsLevelListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubePlaylistItemsList": (options: typeof YoutubePlaylistItemsListParams.Encoded) => Effect.Effect<typeof PlaylistItemListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubePlaylistItemsUpdate": (options: {
        readonly params: typeof YoutubePlaylistItemsUpdateParams.Encoded;
        readonly payload: typeof PlaylistItem.Encoded;
    }) => Effect.Effect<typeof PlaylistItem.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubePlaylistItemsInsert": (options: {
        readonly params: typeof YoutubePlaylistItemsInsertParams.Encoded;
        readonly payload: typeof PlaylistItem.Encoded;
    }) => Effect.Effect<typeof PlaylistItem.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a resource.
     */
    readonly "youtubePlaylistItemsDelete": (options: typeof YoutubePlaylistItemsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubePlaylistsList": (options: typeof YoutubePlaylistsListParams.Encoded) => Effect.Effect<typeof PlaylistListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubePlaylistsUpdate": (options: {
        readonly params: typeof YoutubePlaylistsUpdateParams.Encoded;
        readonly payload: typeof Playlist.Encoded;
    }) => Effect.Effect<typeof Playlist.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubePlaylistsInsert": (options: {
        readonly params: typeof YoutubePlaylistsInsertParams.Encoded;
        readonly payload: typeof Playlist.Encoded;
    }) => Effect.Effect<typeof Playlist.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a resource.
     */
    readonly "youtubePlaylistsDelete": (options: typeof YoutubePlaylistsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of search resources
     */
    readonly "youtubeSearchList": (options: typeof YoutubeSearchListParams.Encoded) => Effect.Effect<typeof SearchListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeSubscriptionsList": (options: typeof YoutubeSubscriptionsListParams.Encoded) => Effect.Effect<typeof SubscriptionListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeSubscriptionsInsert": (options: {
        readonly params: typeof YoutubeSubscriptionsInsertParams.Encoded;
        readonly payload: typeof Subscription.Encoded;
    }) => Effect.Effect<typeof Subscription.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a resource.
     */
    readonly "youtubeSubscriptionsDelete": (options: typeof YoutubeSubscriptionsDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeSuperChatEventsList": (options: typeof YoutubeSuperChatEventsListParams.Encoded) => Effect.Effect<typeof SuperChatEventListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * POST method.
     */
    readonly "youtubeTestsInsert": (options: {
        readonly params: typeof YoutubeTestsInsertParams.Encoded;
        readonly payload: typeof TestItem.Encoded;
    }) => Effect.Effect<typeof TestItem.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeThirdPartyLinksList": (options: typeof YoutubeThirdPartyLinksListParams.Encoded) => Effect.Effect<typeof ThirdPartyLinkListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubeThirdPartyLinksUpdate": (options: {
        readonly params: typeof YoutubeThirdPartyLinksUpdateParams.Encoded;
        readonly payload: typeof ThirdPartyLink.Encoded;
    }) => Effect.Effect<typeof ThirdPartyLink.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeThirdPartyLinksInsert": (options: {
        readonly params: typeof YoutubeThirdPartyLinksInsertParams.Encoded;
        readonly payload: typeof ThirdPartyLink.Encoded;
    }) => Effect.Effect<typeof ThirdPartyLink.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a resource.
     */
    readonly "youtubeThirdPartyLinksDelete": (options: typeof YoutubeThirdPartyLinksDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * As this is not an insert in a strict sense (it supports uploading/setting of a thumbnail for multiple videos, which doesn't result in creation of a single resource), I use a custom verb here.
     */
    readonly "youtubeThumbnailsSet": (options: typeof YoutubeThumbnailsSetParams.Encoded) => Effect.Effect<typeof ThumbnailSetResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeVideoAbuseReportReasonsList": (options: typeof YoutubeVideoAbuseReportReasonsListParams.Encoded) => Effect.Effect<typeof VideoAbuseReportReasonListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeVideoCategoriesList": (options: typeof YoutubeVideoCategoriesListParams.Encoded) => Effect.Effect<typeof VideoCategoryListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves a list of resources, possibly filtered.
     */
    readonly "youtubeVideosList": (options: typeof YoutubeVideosListParams.Encoded) => Effect.Effect<typeof VideoListResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Updates an existing resource.
     */
    readonly "youtubeVideosUpdate": (options: {
        readonly params: typeof YoutubeVideosUpdateParams.Encoded;
        readonly payload: typeof Video.Encoded;
    }) => Effect.Effect<typeof Video.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Inserts a new resource into this collection.
     */
    readonly "youtubeVideosInsert": (options: typeof YoutubeVideosInsertParams.Encoded) => Effect.Effect<typeof Video.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Deletes a resource.
     */
    readonly "youtubeVideosDelete": (options: typeof YoutubeVideosDeleteParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Retrieves the ratings that the authorized user gave to a list of specified videos.
     */
    readonly "youtubeVideosGetRating": (options: typeof YoutubeVideosGetRatingParams.Encoded) => Effect.Effect<typeof VideoGetRatingResponse.Type, HttpClientError.HttpClientError | ParseError>;
    /**
     * Adds a like or dislike rating to a video or removes a rating from a video.
     */
    readonly "youtubeVideosRate": (options: typeof YoutubeVideosRateParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Report abuse for a video.
     */
    readonly "youtubeVideosReportAbuse": (options: {
        readonly params?: typeof YoutubeVideosReportAbuseParams.Encoded | undefined;
        readonly payload: typeof VideoAbuseReport.Encoded;
    }) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Allows upload of watermark image and setting it for a channel.
     */
    readonly "youtubeWatermarksSet": (options: typeof YoutubeWatermarksSetParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
    /**
     * Allows removal of channel watermark.
     */
    readonly "youtubeWatermarksUnset": (options: typeof YoutubeWatermarksUnsetParams.Encoded) => Effect.Effect<void, HttpClientError.HttpClientError | ParseError>;
}
export interface ClientError<Tag extends string, E> {
    readonly _tag: Tag;
    readonly request: HttpClientRequest.HttpClientRequest;
    readonly response: HttpClientResponse.HttpClientResponse;
    readonly cause: E;
}
export declare const ClientError: <Tag extends string, E>(tag: Tag, cause: E, response: HttpClientResponse.HttpClientResponse) => ClientError<Tag, E>;
export {};
//# sourceMappingURL=youtube_client.d.ts.map
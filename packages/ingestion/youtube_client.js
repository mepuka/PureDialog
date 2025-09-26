import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
export class YoutubeAbuseReportsInsertParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class AbuseType extends S.Class("AbuseType")({
    "id": S.optionalWith(S.String, { nullable: true })
}) {
}
export class Entity extends S.Class("Entity")({
    "id": S.optionalWith(S.String, { nullable: true }),
    "typeId": S.optionalWith(S.String, { nullable: true }),
    "url": S.optionalWith(S.String, { nullable: true })
}) {
}
export class RelatedEntity extends S.Class("RelatedEntity")({
    "entity": S.optionalWith(Entity, { nullable: true })
}) {
}
export class AbuseReport extends S.Class("AbuseReport")({
    "abuseTypes": S.optionalWith(S.Array(AbuseType), { nullable: true }),
    "description": S.optionalWith(S.String, { nullable: true }),
    "relatedEntities": S.optionalWith(S.Array(RelatedEntity), { nullable: true }),
    "subject": S.optionalWith(Entity, { nullable: true })
}) {
}
export class YoutubeActivitiesListParams extends S.Struct({
    "part": S.Array(S.String),
    "channelId": S.optionalWith(S.String, { nullable: true }),
    "home": S.optionalWith(S.Boolean, { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "mine": S.optionalWith(S.Boolean, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true }),
    "publishedAfter": S.optionalWith(S.String, { nullable: true }),
    "publishedBefore": S.optionalWith(S.String, { nullable: true }),
    "regionCode": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A resource id is a generic reference that points to another YouTube resource.
 */
export class ResourceId extends S.Class("ResourceId")({
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a channel. This property is only present if the resourceId.kind value is youtube#channel.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The type of the API resource.
     */
    "kind": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a playlist. This property is only present if the resourceId.kind value is youtube#playlist.
     */
    "playlistId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a video. This property is only present if the resourceId.kind value is youtube#video.
     */
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Details about a channel bulletin post.
 */
export class ActivityContentDetailsBulletin extends S.Class("ActivityContentDetailsBulletin")({
    /**
     * The resourceId object contains information that identifies the resource associated with a bulletin post. @mutable youtube.activities.insert
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true })
}) {
}
/**
 * Details about a resource which was added to a channel.
 */
export class ActivityContentDetailsChannelItem extends S.Class("ActivityContentDetailsChannelItem")({
    /**
     * The resourceId object contains information that identifies the resource that was added to the channel.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true })
}) {
}
/**
 * Information about a resource that received a comment.
 */
export class ActivityContentDetailsComment extends S.Class("ActivityContentDetailsComment")({
    /**
     * The resourceId object contains information that identifies the resource associated with the comment.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true })
}) {
}
/**
 * Information about a video that was marked as a favorite video.
 */
export class ActivityContentDetailsFavorite extends S.Class("ActivityContentDetailsFavorite")({
    /**
     * The resourceId object contains information that identifies the resource that was marked as a favorite.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true })
}) {
}
/**
 * Information about a resource that received a positive (like) rating.
 */
export class ActivityContentDetailsLike extends S.Class("ActivityContentDetailsLike")({
    /**
     * The resourceId object contains information that identifies the rated resource.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true })
}) {
}
/**
 * Information about a new playlist item.
 */
export class ActivityContentDetailsPlaylistItem extends S.Class("ActivityContentDetailsPlaylistItem")({
    /**
     * The value that YouTube uses to uniquely identify the playlist.
     */
    "playlistId": S.optionalWith(S.String, { nullable: true }),
    /**
     * ID of the item within the playlist.
     */
    "playlistItemId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The resourceId object contains information about the resource that was added to the playlist.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true })
}) {
}
/**
 * The type of call-to-action, a message to the user indicating action that can be taken.
 */
export class ActivityContentDetailsPromotedItemCtaType extends S.Literal("ctaTypeUnspecified", "visitAdvertiserSite") {
}
/**
 * Details about a resource which is being promoted.
 */
export class ActivityContentDetailsPromotedItem extends S.Class("ActivityContentDetailsPromotedItem")({
    /**
     * The URL the client should fetch to request a promoted item.
     */
    "adTag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The URL the client should ping to indicate that the user clicked through on this promoted item.
     */
    "clickTrackingUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The URL the client should ping to indicate that the user was shown this promoted item.
     */
    "creativeViewUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The type of call-to-action, a message to the user indicating action that can be taken.
     */
    "ctaType": S.optionalWith(ActivityContentDetailsPromotedItemCtaType, { nullable: true }),
    /**
     * The custom call-to-action button text. If specified, it will override the default button text for the cta_type.
     */
    "customCtaButtonText": S.optionalWith(S.String, { nullable: true }),
    /**
     * The text description to accompany the promoted item.
     */
    "descriptionText": S.optionalWith(S.String, { nullable: true }),
    /**
     * The URL the client should direct the user to, if the user chooses to visit the advertiser's website.
     */
    "destinationUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The list of forecasting URLs. The client should ping all of these URLs when a promoted item is not available, to indicate that a promoted item could have been shown.
     */
    "forecastingUrl": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * The list of impression URLs. The client should ping all of these URLs to indicate that the user was shown this promoted item.
     */
    "impressionUrl": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the promoted video.
     */
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The reason that the resource is recommended to the user.
 */
export class ActivityContentDetailsRecommendationReason extends S.Literal("reasonUnspecified", "videoFavorited", "videoLiked", "videoWatched") {
}
/**
 * Information that identifies the recommended resource.
 */
export class ActivityContentDetailsRecommendation extends S.Class("ActivityContentDetailsRecommendation")({
    /**
     * The reason that the resource is recommended to the user.
     */
    "reason": S.optionalWith(ActivityContentDetailsRecommendationReason, { nullable: true }),
    /**
     * The resourceId object contains information that identifies the recommended resource.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true }),
    /**
     * The seedResourceId object contains information about the resource that caused the recommendation.
     */
    "seedResourceId": S.optionalWith(ResourceId, { nullable: true })
}) {
}
/**
 * The name of the social network.
 */
export class ActivityContentDetailsSocialType extends S.Literal("unspecified", "googlePlus", "facebook", "twitter") {
}
/**
 * Details about a social network post.
 */
export class ActivityContentDetailsSocial extends S.Class("ActivityContentDetailsSocial")({
    /**
     * The author of the social network post.
     */
    "author": S.optionalWith(S.String, { nullable: true }),
    /**
     * An image of the post's author.
     */
    "imageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The URL of the social network post.
     */
    "referenceUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The resourceId object encapsulates information that identifies the resource associated with a social network post.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true }),
    /**
     * The name of the social network.
     */
    "type": S.optionalWith(ActivityContentDetailsSocialType, { nullable: true })
}) {
}
/**
 * Information about a channel that a user subscribed to.
 */
export class ActivityContentDetailsSubscription extends S.Class("ActivityContentDetailsSubscription")({
    /**
     * The resourceId object contains information that identifies the resource that the user subscribed to.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true })
}) {
}
/**
 * Information about the uploaded video.
 */
export class ActivityContentDetailsUpload extends S.Class("ActivityContentDetailsUpload")({
    /**
     * The ID that YouTube uses to uniquely identify the uploaded video.
     */
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Details about the content of an activity: the video that was shared, the channel that was subscribed to, etc.
 */
export class ActivityContentDetails extends S.Class("ActivityContentDetails")({
    /**
     * The bulletin object contains details about a channel bulletin post. This object is only present if the snippet.type is bulletin.
     */
    "bulletin": S.optionalWith(ActivityContentDetailsBulletin, { nullable: true }),
    /**
     * The channelItem object contains details about a resource which was added to a channel. This property is only present if the snippet.type is channelItem.
     */
    "channelItem": S.optionalWith(ActivityContentDetailsChannelItem, { nullable: true }),
    /**
     * The comment object contains information about a resource that received a comment. This property is only present if the snippet.type is comment.
     */
    "comment": S.optionalWith(ActivityContentDetailsComment, { nullable: true }),
    /**
     * The favorite object contains information about a video that was marked as a favorite video. This property is only present if the snippet.type is favorite.
     */
    "favorite": S.optionalWith(ActivityContentDetailsFavorite, { nullable: true }),
    /**
     * The like object contains information about a resource that received a positive (like) rating. This property is only present if the snippet.type is like.
     */
    "like": S.optionalWith(ActivityContentDetailsLike, { nullable: true }),
    /**
     * The playlistItem object contains information about a new playlist item. This property is only present if the snippet.type is playlistItem.
     */
    "playlistItem": S.optionalWith(ActivityContentDetailsPlaylistItem, { nullable: true }),
    /**
     * The promotedItem object contains details about a resource which is being promoted. This property is only present if the snippet.type is promotedItem.
     */
    "promotedItem": S.optionalWith(ActivityContentDetailsPromotedItem, { nullable: true }),
    /**
     * The recommendation object contains information about a recommended resource. This property is only present if the snippet.type is recommendation.
     */
    "recommendation": S.optionalWith(ActivityContentDetailsRecommendation, { nullable: true }),
    /**
     * The social object contains details about a social network post. This property is only present if the snippet.type is social.
     */
    "social": S.optionalWith(ActivityContentDetailsSocial, { nullable: true }),
    /**
     * The subscription object contains information about a channel that a user subscribed to. This property is only present if the snippet.type is subscription.
     */
    "subscription": S.optionalWith(ActivityContentDetailsSubscription, { nullable: true }),
    /**
     * The upload object contains information about the uploaded video. This property is only present if the snippet.type is upload.
     */
    "upload": S.optionalWith(ActivityContentDetailsUpload, { nullable: true })
}) {
}
/**
 * A thumbnail is an image representing a YouTube resource.
 */
export class Thumbnail extends S.Class("Thumbnail")({
    /**
     * (Optional) Height of the thumbnail image.
     */
    "height": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The thumbnail image's URL.
     */
    "url": S.optionalWith(S.String, { nullable: true }),
    /**
     * (Optional) Width of the thumbnail image.
     */
    "width": S.optionalWith(S.Int, { nullable: true })
}) {
}
/**
 * Internal representation of thumbnails for a YouTube resource.
 */
export class ThumbnailDetails extends S.Class("ThumbnailDetails")({
    /**
     * The high quality image for this resource.
     */
    "high": S.optionalWith(Thumbnail, { nullable: true }),
    /**
     * The maximum resolution quality image for this resource.
     */
    "maxres": S.optionalWith(Thumbnail, { nullable: true }),
    /**
     * The medium quality image for this resource.
     */
    "medium": S.optionalWith(Thumbnail, { nullable: true }),
    /**
     * The standard quality image for this resource.
     */
    "standard": S.optionalWith(Thumbnail, { nullable: true })
}) {
}
/**
 * The type of activity that the resource describes.
 */
export class ActivitySnippetType extends S.Literal("typeUnspecified", "upload", "like", "favorite", "comment", "subscription", "playlistItem", "recommendation", "bulletin", "social", "channelItem", "promotedItem") {
}
/**
 * Basic details about an activity, including title, description, thumbnails, activity type and group. Next ID: 12
 */
export class ActivitySnippet extends S.Class("ActivitySnippet")({
    /**
     * The ID that YouTube uses to uniquely identify the channel associated with the activity.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Channel title for the channel responsible for this activity
     */
    "channelTitle": S.optionalWith(S.String, { nullable: true }),
    /**
     * The description of the resource primarily associated with the activity. @mutable youtube.activities.insert
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * The group ID associated with the activity. A group ID identifies user events that are associated with the same user and resource. For example, if a user rates a video and marks the same video as a favorite, the entries for those events would have the same group ID in the user's activity feed. In your user interface, you can avoid repetition by grouping events with the same groupId value.
     */
    "groupId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time that the video was uploaded.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * A map of thumbnail images associated with the resource that is primarily associated with the activity. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The title of the resource primarily associated with the activity.
     */
    "title": S.optionalWith(S.String, { nullable: true }),
    /**
     * The type of activity that the resource describes.
     */
    "type": S.optionalWith(ActivitySnippetType, { nullable: true })
}) {
}
/**
 * An *activity* resource contains information about an action that a particular channel, or user, has taken on YouTube.The actions reported in activity feeds include rating a video, sharing a video, marking a video as a favorite, commenting on a video, uploading a video, and so forth. Each activity resource identifies the type of action, the channel associated with the action, and the resource(s) associated with the action, such as the video that was rated or uploaded.
 */
export class Activity extends S.Class("Activity")({
    /**
     * The contentDetails object contains information about the content associated with the activity. For example, if the snippet.type value is videoRated, then the contentDetails object's content identifies the rated video.
     */
    "contentDetails": S.optionalWith(ActivityContentDetails, { nullable: true }),
    /**
     * Etag of this resource
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the activity.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#activity".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#activity" }),
    /**
     * The snippet object contains basic details about the activity, including the activity's type and group ID.
     */
    "snippet": S.optionalWith(ActivitySnippet, { nullable: true })
}) {
}
/**
 * Paging details for lists of resources, including total number of items available and number of resources returned in a single page.
 */
export class PageInfo extends S.Class("PageInfo")({
    /**
     * The number of results included in the API response.
     */
    "resultsPerPage": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The total number of results in the result set.
     */
    "totalResults": S.optionalWith(S.Int, { nullable: true })
}) {
}
/**
 * Stub token pagination template to suppress results.
 */
export class TokenPagination extends S.Class("TokenPagination")({}) {
}
export class ActivityListResponse extends S.Class("ActivityListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    "items": S.optionalWith(S.Array(Activity), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#activityListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#activityListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeCaptionsListParams extends S.Struct({
    "part": S.Array(S.String),
    "videoId": S.String,
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "onBehalfOf": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The type of audio track associated with the caption track.
 */
export class CaptionSnippetAudioTrackType extends S.Literal("unknown", "primary", "commentary", "descriptive") {
}
/**
 * The reason that YouTube failed to process the caption track. This property is only present if the state property's value is failed.
 */
export class CaptionSnippetFailureReason extends S.Literal("unknownFormat", "unsupportedFormat", "processingFailed") {
}
/**
 * The caption track's status.
 */
export class CaptionSnippetStatus extends S.Literal("serving", "syncing", "failed") {
}
/**
 * The caption track's type.
 */
export class CaptionSnippetTrackKind extends S.Literal("standard", "ASR", "forced") {
}
/**
 * Basic details about a caption track, such as its language and name.
 */
export class CaptionSnippet extends S.Class("CaptionSnippet")({
    /**
     * The type of audio track associated with the caption track.
     */
    "audioTrackType": S.optionalWith(CaptionSnippetAudioTrackType, { nullable: true }),
    /**
     * The reason that YouTube failed to process the caption track. This property is only present if the state property's value is failed.
     */
    "failureReason": S.optionalWith(CaptionSnippetFailureReason, { nullable: true }),
    /**
     * Indicates whether YouTube synchronized the caption track to the audio track in the video. The value will be true if a sync was explicitly requested when the caption track was uploaded. For example, when calling the captions.insert or captions.update methods, you can set the sync parameter to true to instruct YouTube to sync the uploaded track to the video. If the value is false, YouTube uses the time codes in the uploaded caption track to determine when to display captions.
     */
    "isAutoSynced": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Indicates whether the track contains closed captions for the deaf and hard of hearing. The default value is false.
     */
    "isCC": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Indicates whether the caption track is a draft. If the value is true, then the track is not publicly visible. The default value is false. @mutable youtube.captions.insert youtube.captions.update
     */
    "isDraft": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Indicates whether caption track is formatted for "easy reader," meaning it is at a third-grade level for language learners. The default value is false.
     */
    "isEasyReader": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Indicates whether the caption track uses large text for the vision-impaired. The default value is false.
     */
    "isLarge": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The language of the caption track. The property value is a BCP-47 language tag.
     */
    "language": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the caption track was last updated.
     */
    "lastUpdated": S.optionalWith(S.String, { nullable: true }),
    /**
     * The name of the caption track. The name is intended to be visible to the user as an option during playback.
     */
    "name": S.optionalWith(S.String, { nullable: true }),
    /**
     * The caption track's status.
     */
    "status": S.optionalWith(CaptionSnippetStatus, { nullable: true }),
    /**
     * The caption track's type.
     */
    "trackKind": S.optionalWith(CaptionSnippetTrackKind, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the video associated with the caption track. @mutable youtube.captions.insert
     */
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A *caption* resource represents a YouTube caption track. A caption track is associated with exactly one YouTube video.
 */
export class Caption extends S.Class("Caption")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the caption track.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#caption".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#caption" }),
    /**
     * The snippet object contains basic details about the caption.
     */
    "snippet": S.optionalWith(CaptionSnippet, { nullable: true })
}) {
}
export class CaptionListResponse extends S.Class("CaptionListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of captions that match the request criteria.
     */
    "items": S.optionalWith(S.Array(Caption), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#captionListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#captionListResponse" }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeCaptionsUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOf": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "sync": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
export class YoutubeCaptionsInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOf": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "sync": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
export class YoutubeCaptionsDeleteParams extends S.Struct({
    "id": S.String,
    "onBehalfOf": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeCaptionsDownloadParams extends S.Struct({
    "onBehalfOf": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "tfmt": S.optionalWith(S.String, { nullable: true }),
    "tlang": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeChannelBannersInsertParams extends S.Struct({
    "channelId": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A channel banner returned as the response to a channel_banner.insert call.
 */
export class ChannelBannerResource extends S.Class("ChannelBannerResource")({
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelBannerResource".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#channelBannerResource" }),
    /**
     * The URL of this banner image.
     */
    "url": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeChannelSectionsListParams extends S.Struct({
    "part": S.Array(S.String),
    "channelId": S.optionalWith(S.String, { nullable: true }),
    "hl": S.optionalWith(S.String, { nullable: true }),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "mine": S.optionalWith(S.Boolean, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Details about a channelsection, including playlists and channels.
 */
export class ChannelSectionContentDetails extends S.Class("ChannelSectionContentDetails")({
    /**
     * The channel ids for type multiple_channels.
     */
    "channels": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * The playlist ids for type single_playlist and multiple_playlists. For singlePlaylist, only one playlistId is allowed.
     */
    "playlists": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
/**
 * ChannelSection localization setting
 */
export class ChannelSectionLocalization extends S.Class("ChannelSectionLocalization")({
    /**
     * The localized strings for channel section's title.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The style of the channel section.
 */
export class ChannelSectionSnippetStyle extends S.Literal("channelsectionStyleUnspecified", "horizontalRow", "verticalList") {
}
/**
 * The type of the channel section.
 */
export class ChannelSectionSnippetType extends S.Literal("channelsectionTypeUndefined", "singlePlaylist", "multiplePlaylists", "popularUploads", "recentUploads", "likes", "allPlaylists", "likedPlaylists", "recentPosts", "recentActivity", "liveEvents", "upcomingEvents", "completedEvents", "multipleChannels", "postedVideos", "postedPlaylists", "subscriptions") {
}
/**
 * Basic details about a channel section, including title, style and position.
 */
export class ChannelSectionSnippet extends S.Class("ChannelSectionSnippet")({
    /**
     * The ID that YouTube uses to uniquely identify the channel that published the channel section.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The language of the channel section's default title and description.
     */
    "defaultLanguage": S.optionalWith(S.String, { nullable: true }),
    /**
     * Localized title, read-only.
     */
    "localized": S.optionalWith(ChannelSectionLocalization, { nullable: true }),
    /**
     * The position of the channel section in the channel.
     */
    "position": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The style of the channel section.
     */
    "style": S.optionalWith(ChannelSectionSnippetStyle, { nullable: true }),
    /**
     * The channel section's title for multiple_playlists and multiple_channels.
     */
    "title": S.optionalWith(S.String, { nullable: true }),
    /**
     * The type of the channel section.
     */
    "type": S.optionalWith(ChannelSectionSnippetType, { nullable: true })
}) {
}
/**
 * ChannelSection targeting setting.
 */
export class ChannelSectionTargeting extends S.Class("ChannelSectionTargeting")({
    /**
     * The country the channel section is targeting.
     */
    "countries": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * The language the channel section is targeting.
     */
    "languages": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * The region the channel section is targeting.
     */
    "regions": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
export class ChannelSection extends S.Class("ChannelSection")({
    /**
     * The contentDetails object contains details about the channel section content, such as a list of playlists or channels featured in the section.
     */
    "contentDetails": S.optionalWith(ChannelSectionContentDetails, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the channel section.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelSection".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#channelSection" }),
    /**
     * Localizations for different languages
     */
    "localizations": S.optionalWith(S.Record({ key: S.String, value: S.Unknown }), { nullable: true }),
    /**
     * The snippet object contains basic details about the channel section, such as its type, style and title.
     */
    "snippet": S.optionalWith(ChannelSectionSnippet, { nullable: true }),
    /**
     * The targeting object contains basic targeting settings about the channel section.
     */
    "targeting": S.optionalWith(ChannelSectionTargeting, { nullable: true })
}) {
}
export class ChannelSectionListResponse extends S.Class("ChannelSectionListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of ChannelSections that match the request criteria.
     */
    "items": S.optionalWith(S.Array(ChannelSection), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelSectionListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#channelSectionListResponse" }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeChannelSectionsUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeChannelSectionsInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeChannelSectionsDeleteParams extends S.Struct({
    "id": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeChannelsListParams extends S.Struct({
    "part": S.Array(S.String),
    "categoryId": S.optionalWith(S.String, { nullable: true }),
    "forUsername": S.optionalWith(S.String, { nullable: true }),
    "hl": S.optionalWith(S.String, { nullable: true }),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "managedByMe": S.optionalWith(S.Boolean, { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "mine": S.optionalWith(S.Boolean, { nullable: true }),
    "mySubscribers": S.optionalWith(S.Boolean, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The auditDetails object encapsulates channel data that is relevant for YouTube Partners during the audit process.
 */
export class ChannelAuditDetails extends S.Class("ChannelAuditDetails")({
    /**
     * Whether or not the channel respects the community guidelines.
     */
    "communityGuidelinesGoodStanding": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Whether or not the channel has any unresolved claims.
     */
    "contentIdClaimsGoodStanding": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Whether or not the channel has any copyright strikes.
     */
    "copyrightStrikesGoodStanding": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
/**
 * Branding properties for the channel view.
 */
export class ChannelSettings extends S.Class("ChannelSettings")({
    /**
     * The country of the channel.
     */
    "country": S.optionalWith(S.String, { nullable: true }),
    "defaultLanguage": S.optionalWith(S.String, { nullable: true }),
    /**
     * Which content tab users should see when viewing the channel.
     */
    "defaultTab": S.optionalWith(S.String, { nullable: true }),
    /**
     * Specifies the channel description.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * Title for the featured channels tab.
     */
    "featuredChannelsTitle": S.optionalWith(S.String, { nullable: true }),
    /**
     * The list of featured channels.
     */
    "featuredChannelsUrls": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * Lists keywords associated with the channel, comma-separated.
     */
    "keywords": S.optionalWith(S.String, { nullable: true }),
    /**
     * Whether user-submitted comments left on the channel page need to be approved by the channel owner to be publicly visible.
     */
    "moderateComments": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * A prominent color that can be rendered on this channel page.
     */
    "profileColor": S.optionalWith(S.String, { nullable: true }),
    /**
     * Whether the tab to browse the videos should be displayed.
     */
    "showBrowseView": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Whether related channels should be proposed.
     */
    "showRelatedChannels": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Specifies the channel title.
     */
    "title": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID for a Google Analytics account to track and measure traffic to the channels.
     */
    "trackingAnalyticsAccountId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The trailer of the channel, for users that are not subscribers.
     */
    "unsubscribedTrailer": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A pair Property / Value.
 */
export class PropertyValue extends S.Class("PropertyValue")({
    /**
     * A property.
     */
    "property": S.optionalWith(S.String, { nullable: true }),
    /**
     * The property's value.
     */
    "value": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LanguageTag extends S.Class("LanguageTag")({
    "value": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LocalizedString extends S.Class("LocalizedString")({
    "language": S.optionalWith(S.String, { nullable: true }),
    "value": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LocalizedProperty extends S.Class("LocalizedProperty")({
    /**
     * The language of the default property.
     */
    "defaultLanguage": S.optionalWith(LanguageTag, { nullable: true }),
    "localized": S.optionalWith(S.Array(LocalizedString), { nullable: true })
}) {
}
/**
 * Branding properties for images associated with the channel.
 */
export class ImageSettings extends S.Class("ImageSettings")({
    /**
     * The URL for the background image shown on the video watch page. The image should be 1200px by 615px, with a maximum file size of 128k.
     */
    "backgroundImageUrl": S.optionalWith(LocalizedProperty, { nullable: true }),
    /**
     * This is generated when a ChannelBanner.Insert request has succeeded for the given channel.
     */
    "bannerExternalUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Desktop size (1060x175).
     */
    "bannerImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Mobile size high resolution (1440x395).
     */
    "bannerMobileExtraHdImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Mobile size high resolution (1280x360).
     */
    "bannerMobileHdImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Mobile size (640x175).
     */
    "bannerMobileImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Mobile size low resolution (320x88).
     */
    "bannerMobileLowImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Mobile size medium/high resolution (960x263).
     */
    "bannerMobileMediumHdImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Tablet size extra high resolution (2560x424).
     */
    "bannerTabletExtraHdImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Tablet size high resolution (2276x377).
     */
    "bannerTabletHdImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Tablet size (1707x283).
     */
    "bannerTabletImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. Tablet size low resolution (1138x188).
     */
    "bannerTabletLowImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. TV size high resolution (1920x1080).
     */
    "bannerTvHighImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. TV size extra high resolution (2120x1192).
     */
    "bannerTvImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. TV size low resolution (854x480).
     */
    "bannerTvLowImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Banner image. TV size medium resolution (1280x720).
     */
    "bannerTvMediumImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The image map script for the large banner image.
     */
    "largeBrandedBannerImageImapScript": S.optionalWith(LocalizedProperty, { nullable: true }),
    /**
     * The URL for the 854px by 70px image that appears below the video player in the expanded video view of the video watch page.
     */
    "largeBrandedBannerImageUrl": S.optionalWith(LocalizedProperty, { nullable: true }),
    /**
     * The image map script for the small banner image.
     */
    "smallBrandedBannerImageImapScript": S.optionalWith(LocalizedProperty, { nullable: true }),
    /**
     * The URL for the 640px by 70px banner image that appears below the video player in the default view of the video watch page. The URL for the image that appears above the top-left corner of the video player. This is a 25-pixel-high image with a flexible width that cannot exceed 170 pixels.
     */
    "smallBrandedBannerImageUrl": S.optionalWith(LocalizedProperty, { nullable: true }),
    /**
     * The URL for a 1px by 1px tracking pixel that can be used to collect statistics for views of the channel or video pages.
     */
    "trackingImageUrl": S.optionalWith(S.String, { nullable: true }),
    "watchIconImageUrl": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Branding properties for the watch. All deprecated.
 */
export class WatchSettings extends S.Class("WatchSettings")({
    /**
     * The text color for the video watch page's branded area.
     */
    "backgroundColor": S.optionalWith(S.String, { nullable: true }),
    /**
     * An ID that uniquely identifies a playlist that displays next to the video player.
     */
    "featuredPlaylistId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The background color for the video watch page's branded area.
     */
    "textColor": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Branding properties of a YouTube channel.
 */
export class ChannelBrandingSettings extends S.Class("ChannelBrandingSettings")({
    /**
     * Branding properties for the channel view.
     */
    "channel": S.optionalWith(ChannelSettings, { nullable: true }),
    /**
     * Additional experimental branding properties.
     */
    "hints": S.optionalWith(S.Array(PropertyValue), { nullable: true }),
    /**
     * Branding properties for branding images.
     */
    "image": S.optionalWith(ImageSettings, { nullable: true }),
    /**
     * Branding properties for the watch page.
     */
    "watch": S.optionalWith(WatchSettings, { nullable: true })
}) {
}
/**
 * Details about the content of a channel.
 */
export class ChannelContentDetails extends S.Class("ChannelContentDetails")({
    "relatedPlaylists": S.optionalWith(S.Struct({
        /**
         * The ID of the playlist that contains the channel"s favorite videos. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        "favorites": S.optionalWith(S.String, { nullable: true }),
        /**
         * The ID of the playlist that contains the channel"s liked videos. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        "likes": S.optionalWith(S.String, { nullable: true }),
        /**
         * The ID of the playlist that contains the channel"s uploaded videos. Use the videos.insert method to upload new videos and the videos.delete method to delete previously uploaded videos.
         */
        "uploads": S.optionalWith(S.String, { nullable: true }),
        /**
         * The ID of the playlist that contains the channel"s watch history. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        "watchHistory": S.optionalWith(S.String, { nullable: true }),
        /**
         * The ID of the playlist that contains the channel"s watch later playlist. Use the playlistItems.insert and playlistItems.delete to add or remove items from that list.
         */
        "watchLater": S.optionalWith(S.String, { nullable: true })
    }), { nullable: true })
}) {
}
/**
 * The contentOwnerDetails object encapsulates channel data that is relevant for YouTube Partners linked with the channel.
 */
export class ChannelContentOwnerDetails extends S.Class("ChannelContentOwnerDetails")({
    /**
     * The ID of the content owner linked to the channel.
     */
    "contentOwner": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the channel was linked to the content owner.
     */
    "timeLinked": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Defines the context of the ping.
 */
export class ChannelConversionPingContext extends S.Literal("subscribe", "unsubscribe", "cview") {
}
/**
 * Pings that the app shall fire (authenticated by biscotti cookie). Each ping has a context, in which the app must fire the ping, and a url identifying the ping.
 */
export class ChannelConversionPing extends S.Class("ChannelConversionPing")({
    /**
     * Defines the context of the ping.
     */
    "context": S.optionalWith(ChannelConversionPingContext, { nullable: true }),
    /**
     * The url (without the schema) that the player shall send the ping to. It's at caller's descretion to decide which schema to use (http vs https) Example of a returned url: //googleads.g.doubleclick.net/pagead/ viewthroughconversion/962985656/?data=path%3DtHe_path%3Btype%3D cview%3Butuid%3DGISQtTNGYqaYl4sKxoVvKA&labe=default The caller must append biscotti authentication (ms param in case of mobile, for example) to this ping.
     */
    "conversionUrl": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The conversionPings object encapsulates information about conversion pings that need to be respected by the channel.
 */
export class ChannelConversionPings extends S.Class("ChannelConversionPings")({
    /**
     * Pings that the app shall fire (authenticated by biscotti cookie). Each ping has a context, in which the app must fire the ping, and a url identifying the ping.
     */
    "pings": S.optionalWith(S.Array(ChannelConversionPing), { nullable: true })
}) {
}
/**
 * Channel localization setting
 */
export class ChannelLocalization extends S.Class("ChannelLocalization")({
    /**
     * The localized strings for channel's description.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * The localized strings for channel's title.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about a channel, including title, description and thumbnails.
 */
export class ChannelSnippet extends S.Class("ChannelSnippet")({
    /**
     * The country of the channel.
     */
    "country": S.optionalWith(S.String, { nullable: true }),
    /**
     * The custom url of the channel.
     */
    "customUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The language of the channel's default title and description.
     */
    "defaultLanguage": S.optionalWith(S.String, { nullable: true }),
    /**
     * The description of the channel.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * Localized title and description, read-only.
     */
    "localized": S.optionalWith(ChannelLocalization, { nullable: true }),
    /**
     * The date and time that the channel was created.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * A map of thumbnail images associated with the channel. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail. When displaying thumbnails in your application, make sure that your code uses the image URLs exactly as they are returned in API responses. For example, your application should not use the http domain instead of the https domain in a URL returned in an API response. Beginning in July 2018, channel thumbnail URLs will only be available in the https domain, which is how the URLs appear in API responses. After that time, you might see broken images in your application if it tries to load YouTube images from the http domain. Thumbnail images might be empty for newly created channels and might take up to one day to populate.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The channel's title.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Statistics about a channel: number of subscribers, number of videos in the channel, etc.
 */
export class ChannelStatistics extends S.Class("ChannelStatistics")({
    /**
     * The number of comments for the channel.
     */
    "commentCount": S.optionalWith(S.String, { nullable: true }),
    /**
     * Whether or not the number of subscribers is shown for this user.
     */
    "hiddenSubscriberCount": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The number of subscribers that the channel has.
     */
    "subscriberCount": S.optionalWith(S.String, { nullable: true }),
    /**
     * The number of videos uploaded to the channel.
     */
    "videoCount": S.optionalWith(S.String, { nullable: true }),
    /**
     * The number of times the channel has been viewed.
     */
    "viewCount": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The long uploads status of this channel. See https://support.google.com/youtube/answer/71673 for more information.
 */
export class ChannelStatusLongUploadsStatus extends S.Literal("longUploadsUnspecified", "allowed", "eligible", "disallowed") {
}
/**
 * Privacy status of the channel.
 */
export class ChannelStatusPrivacyStatus extends S.Literal("public", "unlisted", "private") {
}
/**
 * JSON template for the status part of a channel.
 */
export class ChannelStatus extends S.Class("ChannelStatus")({
    /**
     * If true, then the user is linked to either a YouTube username or G+ account. Otherwise, the user doesn't have a public YouTube identity.
     */
    "isLinked": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The long uploads status of this channel. See https://support.google.com/youtube/answer/71673 for more information.
     */
    "longUploadsStatus": S.optionalWith(ChannelStatusLongUploadsStatus, { nullable: true }),
    "madeForKids": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Privacy status of the channel.
     */
    "privacyStatus": S.optionalWith(ChannelStatusPrivacyStatus, { nullable: true }),
    "selfDeclaredMadeForKids": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
/**
 * Freebase topic information related to the channel.
 */
export class ChannelTopicDetails extends S.Class("ChannelTopicDetails")({
    /**
     * A list of Wikipedia URLs that describe the channel's content.
     */
    "topicCategories": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * A list of Freebase topic IDs associated with the channel. You can retrieve information about each topic using the Freebase Topic API.
     */
    "topicIds": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
/**
 * A *channel* resource contains information about a YouTube channel.
 */
export class Channel extends S.Class("Channel")({
    /**
     * The auditionDetails object encapsulates channel data that is relevant for YouTube Partners during the audition process.
     */
    "auditDetails": S.optionalWith(ChannelAuditDetails, { nullable: true }),
    /**
     * The brandingSettings object encapsulates information about the branding of the channel.
     */
    "brandingSettings": S.optionalWith(ChannelBrandingSettings, { nullable: true }),
    /**
     * The contentDetails object encapsulates information about the channel's content.
     */
    "contentDetails": S.optionalWith(ChannelContentDetails, { nullable: true }),
    /**
     * The contentOwnerDetails object encapsulates channel data that is relevant for YouTube Partners linked with the channel.
     */
    "contentOwnerDetails": S.optionalWith(ChannelContentOwnerDetails, { nullable: true }),
    /**
     * The conversionPings object encapsulates information about conversion pings that need to be respected by the channel.
     */
    "conversionPings": S.optionalWith(ChannelConversionPings, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the channel.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channel".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#channel" }),
    /**
     * Localizations for different languages
     */
    "localizations": S.optionalWith(S.Record({ key: S.String, value: S.Unknown }), { nullable: true }),
    /**
     * The snippet object contains basic details about the channel, such as its title, description, and thumbnail images.
     */
    "snippet": S.optionalWith(ChannelSnippet, { nullable: true }),
    /**
     * The statistics object encapsulates statistics for the channel.
     */
    "statistics": S.optionalWith(ChannelStatistics, { nullable: true }),
    /**
     * The status object encapsulates information about the privacy status of the channel.
     */
    "status": S.optionalWith(ChannelStatus, { nullable: true }),
    /**
     * The topicDetails object encapsulates information about Freebase topics associated with the channel.
     */
    "topicDetails": S.optionalWith(ChannelTopicDetails, { nullable: true })
}) {
}
export class ChannelListResponse extends S.Class("ChannelListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    "items": S.optionalWith(S.Array(Channel), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#channelListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#channelListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeChannelsUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeCommentThreadsListParamsModerationStatus extends S.Literal("published", "heldForReview", "likelySpam", "rejected") {
}
export class YoutubeCommentThreadsListParamsOrder extends S.Literal("orderUnspecified", "time", "relevance") {
}
export class YoutubeCommentThreadsListParamsTextFormat extends S.Literal("textFormatUnspecified", "html", "plainText") {
}
export class YoutubeCommentThreadsListParams extends S.Struct({
    "part": S.Array(S.String),
    "allThreadsRelatedToChannelId": S.optionalWith(S.String, { nullable: true }),
    "channelId": S.optionalWith(S.String, { nullable: true }),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(1), S.lessThanOrEqualTo(100)), { nullable: true }),
    "moderationStatus": S.optionalWith(YoutubeCommentThreadsListParamsModerationStatus, { nullable: true }),
    "order": S.optionalWith(YoutubeCommentThreadsListParamsOrder, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true }),
    "searchTerms": S.optionalWith(S.String, { nullable: true }),
    "textFormat": S.optionalWith(YoutubeCommentThreadsListParamsTextFormat, { nullable: true }),
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The id of the author's YouTube channel, if any.
 */
export class CommentSnippetAuthorChannelId extends S.Class("CommentSnippetAuthorChannelId")({
    "value": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The comment's moderation status. Will not be set if the comments were requested through the id filter.
 */
export class CommentSnippetModerationStatus extends S.Literal("published", "heldForReview", "likelySpam", "rejected") {
}
/**
 * The rating the viewer has given to this comment. For the time being this will never return RATE_TYPE_DISLIKE and instead return RATE_TYPE_NONE. This may change in the future.
 */
export class CommentSnippetViewerRating extends S.Literal("none", "like", "dislike") {
}
/**
 * Basic details about a comment, such as its author and text.
 */
export class CommentSnippet extends S.Class("CommentSnippet")({
    "authorChannelId": S.optionalWith(CommentSnippetAuthorChannelId, { nullable: true }),
    /**
     * Link to the author's YouTube channel, if any.
     */
    "authorChannelUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The name of the user who posted the comment.
     */
    "authorDisplayName": S.optionalWith(S.String, { nullable: true }),
    /**
     * The URL for the avatar of the user who posted the comment.
     */
    "authorProfileImageUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Whether the current viewer can rate this comment.
     */
    "canRate": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The id of the corresponding YouTube channel. In case of a channel comment this is the channel the comment refers to. In case of a video comment it's the video's channel.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The total number of likes this comment has received.
     */
    "likeCount": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The comment's moderation status. Will not be set if the comments were requested through the id filter.
     */
    "moderationStatus": S.optionalWith(CommentSnippetModerationStatus, { nullable: true }),
    /**
     * The unique id of the parent comment, only set for replies.
     */
    "parentId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the comment was originally published.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * The comment's text. The format is either plain text or HTML dependent on what has been requested. Even the plain text representation may differ from the text originally posted in that it may replace video links with video titles etc.
     */
    "textDisplay": S.optionalWith(S.String, { nullable: true }),
    /**
     * The comment's original raw text as initially posted or last updated. The original text will only be returned if it is accessible to the viewer, which is only guaranteed if the viewer is the comment's author.
     */
    "textOriginal": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the comment was last updated.
     */
    "updatedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID of the video the comment refers to, if any.
     */
    "videoId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The rating the viewer has given to this comment. For the time being this will never return RATE_TYPE_DISLIKE and instead return RATE_TYPE_NONE. This may change in the future.
     */
    "viewerRating": S.optionalWith(CommentSnippetViewerRating, { nullable: true })
}) {
}
/**
 * A *comment* represents a single YouTube comment.
 */
export class Comment extends S.Class("Comment")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the comment.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#comment".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#comment" }),
    /**
     * The snippet object contains basic details about the comment.
     */
    "snippet": S.optionalWith(CommentSnippet, { nullable: true })
}) {
}
/**
 * Comments written in (direct or indirect) reply to the top level comment.
 */
export class CommentThreadReplies extends S.Class("CommentThreadReplies")({
    /**
     * A limited number of replies. Unless the number of replies returned equals total_reply_count in the snippet the returned replies are only a subset of the total number of replies.
     */
    "comments": S.optionalWith(S.Array(Comment), { nullable: true })
}) {
}
/**
 * Basic details about a comment thread.
 */
export class CommentThreadSnippet extends S.Class("CommentThreadSnippet")({
    /**
     * Whether the current viewer of the thread can reply to it. This is viewer specific - other viewers may see a different value for this field.
     */
    "canReply": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The YouTube channel the comments in the thread refer to or the channel with the video the comments refer to. If video_id isn't set the comments refer to the channel itself.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Whether the thread (and therefore all its comments) is visible to all YouTube users.
     */
    "isPublic": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The top level comment of this thread.
     */
    "topLevelComment": S.optionalWith(Comment, { nullable: true }),
    /**
     * The total number of replies (not including the top level comment).
     */
    "totalReplyCount": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The ID of the video the comments refer to, if any. No video_id implies a channel discussion comment.
     */
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A *comment thread* represents information that applies to a top level comment and all its replies. It can also include the top level comment itself and some of the replies.
 */
export class CommentThread extends S.Class("CommentThread")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the comment thread.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentThread".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#commentThread" }),
    /**
     * The replies object contains a limited number of replies (if any) to the top level comment found in the snippet.
     */
    "replies": S.optionalWith(CommentThreadReplies, { nullable: true }),
    /**
     * The snippet object contains basic details about the comment thread and also the top level comment.
     */
    "snippet": S.optionalWith(CommentThreadSnippet, { nullable: true })
}) {
}
export class CommentThreadListResponse extends S.Class("CommentThreadListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of comment threads that match the request criteria.
     */
    "items": S.optionalWith(S.Array(CommentThread), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentThreadListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#commentThreadListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeYoutubeV3UpdateCommentThreadsParams extends S.Struct({
    "part": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
export class YoutubeCommentThreadsInsertParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class YoutubeCommentsListParamsTextFormat extends S.Literal("textFormatUnspecified", "html", "plainText") {
}
export class YoutubeCommentsListParams extends S.Struct({
    "part": S.Array(S.String),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(1), S.lessThanOrEqualTo(100)), { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true }),
    "parentId": S.optionalWith(S.String, { nullable: true }),
    "textFormat": S.optionalWith(YoutubeCommentsListParamsTextFormat, { nullable: true })
}) {
}
export class CommentListResponse extends S.Class("CommentListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of comments that match the request criteria.
     */
    "items": S.optionalWith(S.Array(Comment), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#commentListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#commentListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeCommentsUpdateParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class YoutubeCommentsInsertParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class YoutubeCommentsDeleteParams extends S.Struct({
    "id": S.String
}) {
}
export class YoutubeCommentsMarkAsSpamParams extends S.Struct({
    "id": S.Array(S.String)
}) {
}
export class YoutubeCommentsSetModerationStatusParamsModerationStatus extends S.Literal("published", "heldForReview", "likelySpam", "rejected") {
}
export class YoutubeCommentsSetModerationStatusParams extends S.Struct({
    "id": S.Array(S.String),
    "moderationStatus": YoutubeCommentsSetModerationStatusParamsModerationStatus,
    "banAuthor": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
export class YoutubeI18NLanguagesListParams extends S.Struct({
    "part": S.Array(S.String),
    "hl": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about an i18n language, such as language code and human-readable name.
 */
export class I18NLanguageSnippet extends S.Class("I18NLanguageSnippet")({
    /**
     * A short BCP-47 code that uniquely identifies a language.
     */
    "hl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The human-readable name of the language in the language itself.
     */
    "name": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * An *i18nLanguage* resource identifies a UI language currently supported by YouTube.
 */
export class I18NLanguage extends S.Class("I18NLanguage")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the i18n language.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nLanguage".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#i18nLanguage" }),
    /**
     * The snippet object contains basic details about the i18n language, such as language code and human-readable name.
     */
    "snippet": S.optionalWith(I18NLanguageSnippet, { nullable: true })
}) {
}
export class I18NLanguageListResponse extends S.Class("I18NLanguageListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of supported i18n languages. In this map, the i18n language ID is the map key, and its value is the corresponding i18nLanguage resource.
     */
    "items": S.optionalWith(S.Array(I18NLanguage), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nLanguageListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#i18nLanguageListResponse" }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeI18NRegionsListParams extends S.Struct({
    "part": S.Array(S.String),
    "hl": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about an i18n region, such as region code and human-readable name.
 */
export class I18NRegionSnippet extends S.Class("I18NRegionSnippet")({
    /**
     * The region code as a 2-letter ISO country code.
     */
    "gl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The human-readable name of the region.
     */
    "name": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A *i18nRegion* resource identifies a region where YouTube is available.
 */
export class I18NRegion extends S.Class("I18NRegion")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the i18n region.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nRegion".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#i18nRegion" }),
    /**
     * The snippet object contains basic details about the i18n region, such as region code and human-readable name.
     */
    "snippet": S.optionalWith(I18NRegionSnippet, { nullable: true })
}) {
}
export class I18NRegionListResponse extends S.Class("I18NRegionListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of regions where YouTube is available. In this map, the i18n region ID is the map key, and its value is the corresponding i18nRegion resource.
     */
    "items": S.optionalWith(S.Array(I18NRegion), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#i18nRegionListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#i18nRegionListResponse" }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveBroadcastsListParamsBroadcastStatus extends S.Literal("broadcastStatusFilterUnspecified", "all", "active", "upcoming", "completed") {
}
export class YoutubeLiveBroadcastsListParamsBroadcastType extends S.Literal("broadcastTypeFilterUnspecified", "all", "event", "persistent") {
}
export class YoutubeLiveBroadcastsListParams extends S.Struct({
    "part": S.Array(S.String),
    "broadcastStatus": S.optionalWith(YoutubeLiveBroadcastsListParamsBroadcastStatus, { nullable: true }),
    "broadcastType": S.optionalWith(YoutubeLiveBroadcastsListParamsBroadcastType, { nullable: true }),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "mine": S.optionalWith(S.Boolean, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveBroadcastContentDetailsClosedCaptionsType extends S.Literal("closedCaptionsTypeUnspecified", "closedCaptionsDisabled", "closedCaptionsHttpPost", "closedCaptionsEmbedded") {
}
/**
 * If both this and enable_low_latency are set, they must match. LATENCY_NORMAL should match enable_low_latency=false LATENCY_LOW should match enable_low_latency=true LATENCY_ULTRA_LOW should have enable_low_latency omitted.
 */
export class LiveBroadcastContentDetailsLatencyPreference extends S.Literal("latencyPreferenceUnspecified", "normal", "low", "ultraLow") {
}
/**
 * Settings and Info of the monitor stream
 */
export class MonitorStreamInfo extends S.Class("MonitorStreamInfo")({
    /**
     * If you have set the enableMonitorStream property to true, then this property determines the length of the live broadcast delay.
     */
    "broadcastStreamDelayMs": S.optionalWith(S.Int, { nullable: true }),
    /**
     * HTML code that embeds a player that plays the monitor stream.
     */
    "embedHtml": S.optionalWith(S.String, { nullable: true }),
    /**
     * This value determines whether the monitor stream is enabled for the broadcast. If the monitor stream is enabled, then YouTube will broadcast the event content on a special stream intended only for the broadcaster's consumption. The broadcaster can use the stream to review the event content and also to identify the optimal times to insert cuepoints. You need to set this value to true if you intend to have a broadcast delay for your event. *Note:* This property cannot be updated once the broadcast is in the testing or live state.
     */
    "enableMonitorStream": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
/**
 * The projection format of this broadcast. This defaults to rectangular.
 */
export class LiveBroadcastContentDetailsProjection extends S.Literal("projectionUnspecified", "rectangular", "360", "mesh") {
}
/**
 * The 3D stereo layout of this broadcast. This defaults to mono.
 */
export class LiveBroadcastContentDetailsStereoLayout extends S.Literal("stereoLayoutUnspecified", "mono", "leftRight", "topBottom") {
}
/**
 * Detailed settings of a broadcast.
 */
export class LiveBroadcastContentDetails extends S.Class("LiveBroadcastContentDetails")({
    /**
     * This value uniquely identifies the live stream bound to the broadcast.
     */
    "boundStreamId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time that the live stream referenced by boundStreamId was last updated.
     */
    "boundStreamLastUpdateTimeMs": S.optionalWith(S.String, { nullable: true }),
    "closedCaptionsType": S.optionalWith(LiveBroadcastContentDetailsClosedCaptionsType, { nullable: true }),
    /**
     * This setting indicates whether auto start is enabled for this broadcast. The default value for this property is false. This setting can only be used by Events.
     */
    "enableAutoStart": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * This setting indicates whether auto stop is enabled for this broadcast. The default value for this property is false. This setting can only be used by Events.
     */
    "enableAutoStop": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * This setting indicates whether HTTP POST closed captioning is enabled for this broadcast. The ingestion URL of the closed captions is returned through the liveStreams API. This is mutually exclusive with using the closed_captions_type property, and is equivalent to setting closed_captions_type to CLOSED_CAPTIONS_HTTP_POST.
     */
    "enableClosedCaptions": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * This setting indicates whether YouTube should enable content encryption for the broadcast.
     */
    "enableContentEncryption": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * This setting determines whether viewers can access DVR controls while watching the video. DVR controls enable the viewer to control the video playback experience by pausing, rewinding, or fast forwarding content. The default value for this property is true. *Important:* You must set the value to true and also set the enableArchive property's value to true if you want to make playback available immediately after the broadcast ends.
     */
    "enableDvr": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * This setting indicates whether the broadcast video can be played in an embedded player. If you choose to archive the video (using the enableArchive property), this setting will also apply to the archived video.
     */
    "enableEmbed": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Indicates whether this broadcast has low latency enabled.
     */
    "enableLowLatency": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * If both this and enable_low_latency are set, they must match. LATENCY_NORMAL should match enable_low_latency=false LATENCY_LOW should match enable_low_latency=true LATENCY_ULTRA_LOW should have enable_low_latency omitted.
     */
    "latencyPreference": S.optionalWith(LiveBroadcastContentDetailsLatencyPreference, { nullable: true }),
    /**
     * The mesh for projecting the video if projection is mesh. The mesh value must be a UTF-8 string containing the base-64 encoding of 3D mesh data that follows the Spherical Video V2 RFC specification for an mshp box, excluding the box size and type but including the following four reserved zero bytes for the version and flags.
     */
    "mesh": S.optionalWith(S.String, { nullable: true }),
    /**
     * The monitorStream object contains information about the monitor stream, which the broadcaster can use to review the event content before the broadcast stream is shown publicly.
     */
    "monitorStream": S.optionalWith(MonitorStreamInfo, { nullable: true }),
    /**
     * The projection format of this broadcast. This defaults to rectangular.
     */
    "projection": S.optionalWith(LiveBroadcastContentDetailsProjection, { nullable: true }),
    /**
     * Automatically start recording after the event goes live. The default value for this property is true. *Important:* You must also set the enableDvr property's value to true if you want the playback to be available immediately after the broadcast ends. If you set this property's value to true but do not also set the enableDvr property to true, there may be a delay of around one day before the archived video will be available for playback.
     */
    "recordFromStart": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * This setting indicates whether the broadcast should automatically begin with an in-stream slate when you update the broadcast's status to live. After updating the status, you then need to send a liveCuepoints.insert request that sets the cuepoint's eventState to end to remove the in-stream slate and make your broadcast stream visible to viewers.
     */
    "startWithSlate": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The 3D stereo layout of this broadcast. This defaults to mono.
     */
    "stereoLayout": S.optionalWith(LiveBroadcastContentDetailsStereoLayout, { nullable: true })
}) {
}
/**
 * Basic broadcast information.
 */
export class LiveBroadcastSnippet extends S.Class("LiveBroadcastSnippet")({
    /**
     * The date and time that the broadcast actually ended. This information is only available once the broadcast's state is complete.
     */
    "actualEndTime": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time that the broadcast actually started. This information is only available once the broadcast's state is live.
     */
    "actualStartTime": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the channel that is publishing the broadcast.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The broadcast's description. As with the title, you can set this field by modifying the broadcast resource or by setting the description field of the corresponding video resource.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * Indicates whether this broadcast is the default broadcast. Internal only.
     */
    "isDefaultBroadcast": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The id of the live chat for this broadcast.
     */
    "liveChatId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time that the broadcast was added to YouTube's live broadcast schedule.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time that the broadcast is scheduled to end.
     */
    "scheduledEndTime": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time that the broadcast is scheduled to start.
     */
    "scheduledStartTime": S.optionalWith(S.String, { nullable: true }),
    /**
     * A map of thumbnail images associated with the broadcast. For each nested object in this object, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The broadcast's title. Note that the broadcast represents exactly one YouTube video. You can set this field by modifying the broadcast resource or by setting the title field of the corresponding video resource.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Statistics about the live broadcast. These represent a snapshot of the values at the time of the request. Statistics are only returned for live broadcasts.
 */
export class LiveBroadcastStatistics extends S.Class("LiveBroadcastStatistics")({
    /**
     * The number of viewers currently watching the broadcast. The property and its value will be present if the broadcast has current viewers and the broadcast owner has not hidden the viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers for a broadcast when the broadcast ends. So, this property would not identify the number of viewers watching an archived video of a live broadcast that already ended.
     */
    "concurrentViewers": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The broadcast's status. The status can be updated using the API's liveBroadcasts.transition method.
 */
export class LiveBroadcastStatusLifeCycleStatus extends S.Literal("lifeCycleStatusUnspecified", "created", "ready", "testing", "live", "complete", "revoked", "testStarting", "liveStarting") {
}
/**
 * Priority of the live broadcast event (internal state).
 */
export class LiveBroadcastStatusLiveBroadcastPriority extends S.Literal("liveBroadcastPriorityUnspecified", "low", "normal", "high") {
}
/**
 * The broadcast's privacy status. Note that the broadcast represents exactly one YouTube video, so the privacy settings are identical to those supported for videos. In addition, you can set this field by modifying the broadcast resource or by setting the privacyStatus field of the corresponding video resource.
 */
export class LiveBroadcastStatusPrivacyStatus extends S.Literal("public", "unlisted", "private") {
}
/**
 * The broadcast's recording status.
 */
export class LiveBroadcastStatusRecordingStatus extends S.Literal("liveBroadcastRecordingStatusUnspecified", "notRecording", "recording", "recorded") {
}
/**
 * Live broadcast state.
 */
export class LiveBroadcastStatus extends S.Class("LiveBroadcastStatus")({
    /**
     * The broadcast's status. The status can be updated using the API's liveBroadcasts.transition method.
     */
    "lifeCycleStatus": S.optionalWith(LiveBroadcastStatusLifeCycleStatus, { nullable: true }),
    /**
     * Priority of the live broadcast event (internal state).
     */
    "liveBroadcastPriority": S.optionalWith(LiveBroadcastStatusLiveBroadcastPriority, { nullable: true }),
    /**
     * Whether the broadcast is made for kids or not, decided by YouTube instead of the creator. This field is read only.
     */
    "madeForKids": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The broadcast's privacy status. Note that the broadcast represents exactly one YouTube video, so the privacy settings are identical to those supported for videos. In addition, you can set this field by modifying the broadcast resource or by setting the privacyStatus field of the corresponding video resource.
     */
    "privacyStatus": S.optionalWith(LiveBroadcastStatusPrivacyStatus, { nullable: true }),
    /**
     * The broadcast's recording status.
     */
    "recordingStatus": S.optionalWith(LiveBroadcastStatusRecordingStatus, { nullable: true }),
    /**
     * This field will be set to True if the creator declares the broadcast to be kids only: go/live-cw-work.
     */
    "selfDeclaredMadeForKids": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
/**
 * A *liveBroadcast* resource represents an event that will be streamed, via live video, on YouTube.
 */
export class LiveBroadcast extends S.Class("LiveBroadcast")({
    /**
     * The contentDetails object contains information about the event's video content, such as whether the content can be shown in an embedded video player or if it will be archived and therefore available for viewing after the event has concluded.
     */
    "contentDetails": S.optionalWith(LiveBroadcastContentDetails, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube assigns to uniquely identify the broadcast.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveBroadcast".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#liveBroadcast" }),
    /**
     * The snippet object contains basic details about the event, including its title, description, start time, and end time.
     */
    "snippet": S.optionalWith(LiveBroadcastSnippet, { nullable: true }),
    /**
     * The statistics object contains info about the event's current stats. These include concurrent viewers and total chat count. Statistics can change (in either direction) during the lifetime of an event. Statistics are only returned while the event is live.
     */
    "statistics": S.optionalWith(LiveBroadcastStatistics, { nullable: true }),
    /**
     * The status object contains information about the event's status.
     */
    "status": S.optionalWith(LiveBroadcastStatus, { nullable: true })
}) {
}
export class LiveBroadcastListResponse extends S.Class("LiveBroadcastListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of broadcasts that match the request criteria.
     */
    "items": S.optionalWith(S.Array(LiveBroadcast), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveBroadcastListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#liveBroadcastListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveBroadcastsUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveBroadcastsInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveBroadcastsDeleteParams extends S.Struct({
    "id": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveBroadcastsBindParams extends S.Struct({
    "id": S.String,
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true }),
    "streamId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveBroadcastsInsertCuepointParams extends S.Struct({
    "id": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true }),
    "part": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
export class CuepointCueType extends S.Literal("cueTypeUnspecified", "cueTypeAd") {
}
/**
 * Note that there may be a 5-second end-point resolution issue. For instance, if a cuepoint comes in for 22:03:27, we may stuff the cuepoint into 22:03:25 or 22:03:30, depending. This is an artifact of HLS.
 */
export class Cuepoint extends S.Class("Cuepoint")({
    "cueType": S.optionalWith(CuepointCueType, { nullable: true }),
    /**
     * The duration of this cuepoint.
     */
    "durationSecs": S.optionalWith(S.Int, { nullable: true }),
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The identifier for cuepoint resource.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * The time when the cuepoint should be inserted by offset to the broadcast actual start time.
     */
    "insertionOffsetTimeMs": S.optionalWith(S.String, { nullable: true }),
    /**
     * The wall clock time at which the cuepoint should be inserted. Only one of insertion_offset_time_ms and walltime_ms may be set at a time.
     */
    "walltimeMs": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveBroadcastsTransitionParamsBroadcastStatus extends S.Literal("statusUnspecified", "testing", "live", "complete") {
}
export class YoutubeLiveBroadcastsTransitionParams extends S.Struct({
    "broadcastStatus": YoutubeLiveBroadcastsTransitionParamsBroadcastStatus,
    "id": S.String,
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveChatBansInsertParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class ChannelProfileDetails extends S.Class("ChannelProfileDetails")({
    /**
     * The YouTube channel ID.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The channel's URL.
     */
    "channelUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The channel's display name.
     */
    "displayName": S.optionalWith(S.String, { nullable: true }),
    /**
     * The channels's avatar URL.
     */
    "profileImageUrl": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The type of ban.
 */
export class LiveChatBanSnippetType extends S.Literal("liveChatBanTypeUnspecified", "permanent", "temporary") {
}
export class LiveChatBanSnippet extends S.Class("LiveChatBanSnippet")({
    /**
     * The duration of a ban, only filled if the ban has type TEMPORARY.
     */
    "banDurationSeconds": S.optionalWith(S.String, { nullable: true }),
    "bannedUserDetails": S.optionalWith(ChannelProfileDetails, { nullable: true }),
    /**
     * The chat this ban is pertinent to.
     */
    "liveChatId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The type of ban.
     */
    "type": S.optionalWith(LiveChatBanSnippetType, { nullable: true })
}) {
}
/**
 * A `__liveChatBan__` resource represents a ban for a YouTube live chat.
 */
export class LiveChatBan extends S.Class("LiveChatBan")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube assigns to uniquely identify the ban.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#liveChatBan"`.
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#liveChatBan" }),
    /**
     * The `snippet` object contains basic details about the ban.
     */
    "snippet": S.optionalWith(LiveChatBanSnippet, { nullable: true })
}) {
}
export class YoutubeLiveChatBansDeleteParams extends S.Struct({
    "id": S.String
}) {
}
export class YoutubeLiveChatMessagesListParams extends S.Struct({
    "liveChatId": S.String,
    "part": S.Array(S.String),
    "hl": S.optionalWith(S.String, { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(200), S.lessThanOrEqualTo(2000)), { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true }),
    "profileImageSize": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(16), S.lessThanOrEqualTo(720)), {
        nullable: true
    })
}) {
}
export class LiveChatMessageAuthorDetails extends S.Class("LiveChatMessageAuthorDetails")({
    /**
     * The YouTube channel ID.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The channel's URL.
     */
    "channelUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * The channel's display name.
     */
    "displayName": S.optionalWith(S.String, { nullable: true }),
    /**
     * Whether the author is a moderator of the live chat.
     */
    "isChatModerator": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Whether the author is the owner of the live chat.
     */
    "isChatOwner": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Whether the author is a sponsor of the live chat.
     */
    "isChatSponsor": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Whether the author's identity has been verified by YouTube.
     */
    "isVerified": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The channels's avatar URL.
     */
    "profileImageUrl": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatFanFundingEventDetails extends S.Class("LiveChatFanFundingEventDetails")({
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    "amountDisplayString": S.optionalWith(S.String, { nullable: true }),
    /**
     * The amount of the fund.
     */
    "amountMicros": S.optionalWith(S.String, { nullable: true }),
    /**
     * The currency in which the fund was made.
     */
    "currency": S.optionalWith(S.String, { nullable: true }),
    /**
     * The comment added by the user to this fan funding event.
     */
    "userComment": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatGiftMembershipReceivedDetails extends S.Class("LiveChatGiftMembershipReceivedDetails")({
    /**
     * The ID of the membership gifting message that is related to this gift membership. This ID will always refer to a message whose type is 'membershipGiftingEvent'.
     */
    "associatedMembershipGiftingMessageId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID of the user that made the membership gifting purchase. This matches the `snippet.authorChannelId` of the associated membership gifting message.
     */
    "gifterChannelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The name of the Level at which the viewer is a member. This matches the `snippet.membershipGiftingDetails.giftMembershipsLevelName` of the associated membership gifting message. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    "memberLevelName": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatMemberMilestoneChatDetails extends S.Class("LiveChatMemberMilestoneChatDetails")({
    /**
     * The name of the Level at which the viever is a member. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    "memberLevelName": S.optionalWith(S.String, { nullable: true }),
    /**
     * The total amount of months (rounded up) the viewer has been a member that granted them this Member Milestone Chat. This is the same number of months as is being displayed to YouTube users.
     */
    "memberMonth": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The comment added by the member to this Member Milestone Chat. This field is empty for messages without a comment from the member.
     */
    "userComment": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatMembershipGiftingDetails extends S.Class("LiveChatMembershipGiftingDetails")({
    /**
     * The number of gift memberships purchased by the user.
     */
    "giftMembershipsCount": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The name of the level of the gift memberships purchased by the user. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    "giftMembershipsLevelName": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatMessageDeletedDetails extends S.Class("LiveChatMessageDeletedDetails")({
    "deletedMessageId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatMessageRetractedDetails extends S.Class("LiveChatMessageRetractedDetails")({
    "retractedMessageId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatNewSponsorDetails extends S.Class("LiveChatNewSponsorDetails")({
    /**
     * If the viewer just had upgraded from a lower level. For viewers that were not members at the time of purchase, this field is false.
     */
    "isUpgrade": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The name of the Level that the viewer just had joined. The Level names are defined by the YouTube channel offering the Membership. In some situations this field isn't filled.
     */
    "memberLevelName": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatSuperChatDetails extends S.Class("LiveChatSuperChatDetails")({
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    "amountDisplayString": S.optionalWith(S.String, { nullable: true }),
    /**
     * The amount purchased by the user, in micros (1,750,000 micros = 1.75).
     */
    "amountMicros": S.optionalWith(S.String, { nullable: true }),
    /**
     * The currency in which the purchase was made.
     */
    "currency": S.optionalWith(S.String, { nullable: true }),
    /**
     * The tier in which the amount belongs. Lower amounts belong to lower tiers. The lowest tier is 1.
     */
    "tier": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The comment added by the user to this Super Chat event.
     */
    "userComment": S.optionalWith(S.String, { nullable: true })
}) {
}
export class SuperStickerMetadata extends S.Class("SuperStickerMetadata")({
    /**
     * Internationalized alt text that describes the sticker image and any animation associated with it.
     */
    "altText": S.optionalWith(S.String, { nullable: true }),
    /**
     * Specifies the localization language in which the alt text is returned.
     */
    "altTextLanguage": S.optionalWith(S.String, { nullable: true }),
    /**
     * Unique identifier of the Super Sticker. This is a shorter form of the alt_text that includes pack name and a recognizable characteristic of the sticker.
     */
    "stickerId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatSuperStickerDetails extends S.Class("LiveChatSuperStickerDetails")({
    /**
     * A rendered string that displays the fund amount and currency to the user.
     */
    "amountDisplayString": S.optionalWith(S.String, { nullable: true }),
    /**
     * The amount purchased by the user, in micros (1,750,000 micros = 1.75).
     */
    "amountMicros": S.optionalWith(S.String, { nullable: true }),
    /**
     * The currency in which the purchase was made.
     */
    "currency": S.optionalWith(S.String, { nullable: true }),
    /**
     * Information about the Super Sticker.
     */
    "superStickerMetadata": S.optionalWith(SuperStickerMetadata, { nullable: true }),
    /**
     * The tier in which the amount belongs. Lower amounts belong to lower tiers. The lowest tier is 1.
     */
    "tier": S.optionalWith(S.Int, { nullable: true })
}) {
}
export class LiveChatTextMessageDetails extends S.Class("LiveChatTextMessageDetails")({
    /**
     * The user's message.
     */
    "messageText": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The type of message, this will always be present, it determines the contents of the message as well as which fields will be present.
 */
export class LiveChatMessageSnippetType extends S.Literal("invalidType", "textMessageEvent", "tombstone", "fanFundingEvent", "chatEndedEvent", "sponsorOnlyModeStartedEvent", "sponsorOnlyModeEndedEvent", "newSponsorEvent", "memberMilestoneChatEvent", "membershipGiftingEvent", "giftMembershipReceivedEvent", "messageDeletedEvent", "messageRetractedEvent", "userBannedEvent", "superChatEvent", "superStickerEvent") {
}
/**
 * The type of ban.
 */
export class LiveChatUserBannedMessageDetailsBanType extends S.Literal("permanent", "temporary") {
}
export class LiveChatUserBannedMessageDetails extends S.Class("LiveChatUserBannedMessageDetails")({
    /**
     * The duration of the ban. This property is only present if the banType is temporary.
     */
    "banDurationSeconds": S.optionalWith(S.String, { nullable: true }),
    /**
     * The type of ban.
     */
    "banType": S.optionalWith(LiveChatUserBannedMessageDetailsBanType, { nullable: true }),
    /**
     * The details of the user that was banned.
     */
    "bannedUserDetails": S.optionalWith(ChannelProfileDetails, { nullable: true })
}) {
}
/**
 * Next ID: 33
 */
export class LiveChatMessageSnippet extends S.Class("LiveChatMessageSnippet")({
    /**
     * The ID of the user that authored this message, this field is not always filled. textMessageEvent - the user that wrote the message fanFundingEvent - the user that funded the broadcast newSponsorEvent - the user that just became a sponsor memberMilestoneChatEvent - the member that sent the message membershipGiftingEvent - the user that made the purchase giftMembershipReceivedEvent - the user that received the gift membership messageDeletedEvent - the moderator that took the action messageRetractedEvent - the author that retracted their message userBannedEvent - the moderator that took the action superChatEvent - the user that made the purchase superStickerEvent - the user that made the purchase
     */
    "authorChannelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Contains a string that can be displayed to the user. If this field is not present the message is silent, at the moment only messages of type TOMBSTONE and CHAT_ENDED_EVENT are silent.
     */
    "displayMessage": S.optionalWith(S.String, { nullable: true }),
    /**
     * Details about the funding event, this is only set if the type is 'fanFundingEvent'.
     */
    "fanFundingEventDetails": S.optionalWith(LiveChatFanFundingEventDetails, { nullable: true }),
    /**
     * Details about the Gift Membership Received event, this is only set if the type is 'giftMembershipReceivedEvent'.
     */
    "giftMembershipReceivedDetails": S.optionalWith(LiveChatGiftMembershipReceivedDetails, { nullable: true }),
    /**
     * Whether the message has display content that should be displayed to users.
     */
    "hasDisplayContent": S.optionalWith(S.Boolean, { nullable: true }),
    "liveChatId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Details about the Member Milestone Chat event, this is only set if the type is 'memberMilestoneChatEvent'.
     */
    "memberMilestoneChatDetails": S.optionalWith(LiveChatMemberMilestoneChatDetails, { nullable: true }),
    /**
     * Details about the Membership Gifting event, this is only set if the type is 'membershipGiftingEvent'.
     */
    "membershipGiftingDetails": S.optionalWith(LiveChatMembershipGiftingDetails, { nullable: true }),
    "messageDeletedDetails": S.optionalWith(LiveChatMessageDeletedDetails, { nullable: true }),
    "messageRetractedDetails": S.optionalWith(LiveChatMessageRetractedDetails, { nullable: true }),
    /**
     * Details about the New Member Announcement event, this is only set if the type is 'newSponsorEvent'. Please note that "member" is the new term for "sponsor".
     */
    "newSponsorDetails": S.optionalWith(LiveChatNewSponsorDetails, { nullable: true }),
    /**
     * The date and time when the message was orignally published.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * Details about the Super Chat event, this is only set if the type is 'superChatEvent'.
     */
    "superChatDetails": S.optionalWith(LiveChatSuperChatDetails, { nullable: true }),
    /**
     * Details about the Super Sticker event, this is only set if the type is 'superStickerEvent'.
     */
    "superStickerDetails": S.optionalWith(LiveChatSuperStickerDetails, { nullable: true }),
    /**
     * Details about the text message, this is only set if the type is 'textMessageEvent'.
     */
    "textMessageDetails": S.optionalWith(LiveChatTextMessageDetails, { nullable: true }),
    /**
     * The type of message, this will always be present, it determines the contents of the message as well as which fields will be present.
     */
    "type": S.optionalWith(LiveChatMessageSnippetType, { nullable: true }),
    "userBannedDetails": S.optionalWith(LiveChatUserBannedMessageDetails, { nullable: true })
}) {
}
/**
 * A *liveChatMessage* resource represents a chat message in a YouTube Live Chat.
 */
export class LiveChatMessage extends S.Class("LiveChatMessage")({
    /**
     * The authorDetails object contains basic details about the user that posted this message.
     */
    "authorDetails": S.optionalWith(LiveChatMessageAuthorDetails, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube assigns to uniquely identify the message.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatMessage".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#liveChatMessage" }),
    /**
     * The snippet object contains basic details about the message.
     */
    "snippet": S.optionalWith(LiveChatMessageSnippet, { nullable: true })
}) {
}
export class LiveChatMessageListResponse extends S.Class("LiveChatMessageListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    "items": S.optionalWith(S.Array(LiveChatMessage), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatMessageListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#liveChatMessageListResponse" }),
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the underlying stream went offline.
     */
    "offlineAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The amount of time the client should wait before polling again.
     */
    "pollingIntervalMillis": S.optionalWith(S.Int, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveChatMessagesInsertParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class YoutubeLiveChatMessagesDeleteParams extends S.Struct({
    "id": S.String
}) {
}
export class YoutubeLiveChatModeratorsListParams extends S.Struct({
    "liveChatId": S.String,
    "part": S.Array(S.String),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true })
}) {
}
export class LiveChatModeratorSnippet extends S.Class("LiveChatModeratorSnippet")({
    /**
     * The ID of the live chat this moderator can act on.
     */
    "liveChatId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Details about the moderator.
     */
    "moderatorDetails": S.optionalWith(ChannelProfileDetails, { nullable: true })
}) {
}
/**
 * A *liveChatModerator* resource represents a moderator for a YouTube live chat. A chat moderator has the ability to ban/unban users from a chat, remove message, etc.
 */
export class LiveChatModerator extends S.Class("LiveChatModerator")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube assigns to uniquely identify the moderator.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatModerator".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#liveChatModerator" }),
    /**
     * The snippet object contains basic details about the moderator.
     */
    "snippet": S.optionalWith(LiveChatModeratorSnippet, { nullable: true })
}) {
}
export class LiveChatModeratorListResponse extends S.Class("LiveChatModeratorListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of moderators that match the request criteria.
     */
    "items": S.optionalWith(S.Array(LiveChatModerator), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveChatModeratorListResponse".
     */
    "kind": S.optionalWith(S.String, {
        nullable: true,
        default: () => "youtube#liveChatModeratorListResponse"
    }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveChatModeratorsInsertParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class YoutubeLiveChatModeratorsDeleteParams extends S.Struct({
    "id": S.String
}) {
}
export class YoutubeLiveStreamsListParams extends S.Struct({
    "part": S.Array(S.String),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "mine": S.optionalWith(S.Boolean, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The frame rate of the inbound video data.
 */
export class CdnSettingsFrameRate extends S.Literal("30fps", "60fps", "variable") {
}
/**
 * Describes information necessary for ingesting an RTMP, HTTP, or SRT stream.
 */
export class IngestionInfo extends S.Class("IngestionInfo")({
    /**
     * The backup ingestion URL that you should use to stream video to YouTube. You have the option of simultaneously streaming the content that you are sending to the ingestionAddress to this URL.
     */
    "backupIngestionAddress": S.optionalWith(S.String, { nullable: true }),
    /**
     * The primary ingestion URL that you should use to stream video to YouTube. You must stream video to this URL. Depending on which application or tool you use to encode your video stream, you may need to enter the stream URL and stream name separately or you may need to concatenate them in the following format: *STREAM_URL/STREAM_NAME*
     */
    "ingestionAddress": S.optionalWith(S.String, { nullable: true }),
    /**
     * This ingestion url may be used instead of backupIngestionAddress in order to stream via RTMPS. Not applicable to non-RTMP streams.
     */
    "rtmpsBackupIngestionAddress": S.optionalWith(S.String, { nullable: true }),
    /**
     * This ingestion url may be used instead of ingestionAddress in order to stream via RTMPS. Not applicable to non-RTMP streams.
     */
    "rtmpsIngestionAddress": S.optionalWith(S.String, { nullable: true }),
    /**
     * The stream name that YouTube assigns to the video stream.
     */
    "streamName": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The method or protocol used to transmit the video stream.
 */
export class CdnSettingsIngestionType extends S.Literal("rtmp", "dash", "webrtc", "hls") {
}
/**
 * The resolution of the inbound video data.
 */
export class CdnSettingsResolution extends S.Literal("240p", "360p", "480p", "720p", "1080p", "1440p", "2160p", "variable") {
}
/**
 * Brief description of the live stream cdn settings.
 */
export class CdnSettings extends S.Class("CdnSettings")({
    /**
     * The format of the video stream that you are sending to Youtube.
     */
    "format": S.optionalWith(S.String, { nullable: true }),
    /**
     * The frame rate of the inbound video data.
     */
    "frameRate": S.optionalWith(CdnSettingsFrameRate, { nullable: true }),
    /**
     * The ingestionInfo object contains information that YouTube provides that you need to transmit your RTMP or HTTP stream to YouTube.
     */
    "ingestionInfo": S.optionalWith(IngestionInfo, { nullable: true }),
    /**
     * The method or protocol used to transmit the video stream.
     */
    "ingestionType": S.optionalWith(CdnSettingsIngestionType, { nullable: true }),
    /**
     * The resolution of the inbound video data.
     */
    "resolution": S.optionalWith(CdnSettingsResolution, { nullable: true })
}) {
}
/**
 * Detailed settings of a stream.
 */
export class LiveStreamContentDetails extends S.Class("LiveStreamContentDetails")({
    /**
     * The ingestion URL where the closed captions of this stream are sent.
     */
    "closedCaptionsIngestionUrl": S.optionalWith(S.String, { nullable: true }),
    /**
     * Indicates whether the stream is reusable, which means that it can be bound to multiple broadcasts. It is common for broadcasters to reuse the same stream for many different broadcasts if those broadcasts occur at different times. If you set this value to false, then the stream will not be reusable, which means that it can only be bound to one broadcast. Non-reusable streams differ from reusable streams in the following ways: - A non-reusable stream can only be bound to one broadcast. - A non-reusable stream might be deleted by an automated process after the broadcast ends. - The liveStreams.list method does not list non-reusable streams if you call the method and set the mine parameter to true. The only way to use that method to retrieve the resource for a non-reusable stream is to use the id parameter to identify the stream.
     */
    "isReusable": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
export class LiveStreamSnippet extends S.Class("LiveStreamSnippet")({
    /**
     * The ID that YouTube uses to uniquely identify the channel that is transmitting the stream.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The stream's description. The value cannot be longer than 10000 characters.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    "isDefaultStream": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The date and time that the stream was created.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * The stream's title. The value must be between 1 and 128 characters long.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * How severe this issue is to the stream.
 */
export class LiveStreamConfigurationIssueSeverity extends S.Literal("info", "warning", "error") {
}
/**
 * The kind of error happening.
 */
export class LiveStreamConfigurationIssueType extends S.Literal("gopSizeOver", "gopSizeLong", "gopSizeShort", "openGop", "badContainer", "audioBitrateHigh", "audioBitrateLow", "audioSampleRate", "bitrateHigh", "bitrateLow", "audioCodec", "videoCodec", "noAudioStream", "noVideoStream", "multipleVideoStreams", "multipleAudioStreams", "audioTooManyChannels", "interlacedVideo", "frameRateHigh", "resolutionMismatch", "videoCodecMismatch", "videoInterlaceMismatch", "videoProfileMismatch", "videoBitrateMismatch", "framerateMismatch", "gopMismatch", "audioSampleRateMismatch", "audioStereoMismatch", "audioCodecMismatch", "audioBitrateMismatch", "videoResolutionSuboptimal", "videoResolutionUnsupported", "videoIngestionStarved", "videoIngestionFasterThanRealtime") {
}
export class LiveStreamConfigurationIssue extends S.Class("LiveStreamConfigurationIssue")({
    /**
     * The long-form description of the issue and how to resolve it.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * The short-form reason for this issue.
     */
    "reason": S.optionalWith(S.String, { nullable: true }),
    /**
     * How severe this issue is to the stream.
     */
    "severity": S.optionalWith(LiveStreamConfigurationIssueSeverity, { nullable: true }),
    /**
     * The kind of error happening.
     */
    "type": S.optionalWith(LiveStreamConfigurationIssueType, { nullable: true })
}) {
}
/**
 * The status code of this stream
 */
export class LiveStreamHealthStatusStatus extends S.Literal("good", "ok", "bad", "noData", "revoked") {
}
export class LiveStreamHealthStatus extends S.Class("LiveStreamHealthStatus")({
    /**
     * The configurations issues on this stream
     */
    "configurationIssues": S.optionalWith(S.Array(LiveStreamConfigurationIssue), { nullable: true }),
    /**
     * The last time this status was updated (in seconds)
     */
    "lastUpdateTimeSeconds": S.optionalWith(S.String, { nullable: true }),
    /**
     * The status code of this stream
     */
    "status": S.optionalWith(LiveStreamHealthStatusStatus, { nullable: true })
}) {
}
export class LiveStreamStatusStreamStatus extends S.Literal("created", "ready", "active", "inactive", "error") {
}
/**
 * Brief description of the live stream status.
 */
export class LiveStreamStatus extends S.Class("LiveStreamStatus")({
    /**
     * The health status of the stream.
     */
    "healthStatus": S.optionalWith(LiveStreamHealthStatus, { nullable: true }),
    "streamStatus": S.optionalWith(LiveStreamStatusStreamStatus, { nullable: true })
}) {
}
/**
 * A live stream describes a live ingestion point.
 */
export class LiveStream extends S.Class("LiveStream")({
    /**
     * The cdn object defines the live stream's content delivery network (CDN) settings. These settings provide details about the manner in which you stream your content to YouTube.
     */
    "cdn": S.optionalWith(CdnSettings, { nullable: true }),
    /**
     * The content_details object contains information about the stream, including the closed captions ingestion URL.
     */
    "contentDetails": S.optionalWith(LiveStreamContentDetails, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube assigns to uniquely identify the stream.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveStream".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#liveStream" }),
    /**
     * The snippet object contains basic details about the stream, including its channel, title, and description.
     */
    "snippet": S.optionalWith(LiveStreamSnippet, { nullable: true }),
    /**
     * The status object contains information about live stream's status.
     */
    "status": S.optionalWith(LiveStreamStatus, { nullable: true })
}) {
}
export class LiveStreamListResponse extends S.Class("LiveStreamListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of live streams that match the request criteria.
     */
    "items": S.optionalWith(S.Array(LiveStream), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#liveStreamListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#liveStreamListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveStreamsUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveStreamsInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeLiveStreamsDeleteParams extends S.Struct({
    "id": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeMembersListParamsMode extends S.Literal("listMembersModeUnknown", "updates", "all_current") {
}
export class YoutubeMembersListParams extends S.Struct({
    "part": S.Array(S.String),
    "filterByMemberChannelId": S.optionalWith(S.String, { nullable: true }),
    "hasAccessToLevel": S.optionalWith(S.String, { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(1000)), { nullable: true }),
    "mode": S.optionalWith(YoutubeMembersListParamsMode, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true })
}) {
}
export class MembershipsDuration extends S.Class("MembershipsDuration")({
    /**
     * The date and time when the user became a continuous member across all levels.
     */
    "memberSince": S.optionalWith(S.String, { nullable: true }),
    /**
     * The cumulative time the user has been a member across all levels in complete months (the time is rounded down to the nearest integer).
     */
    "memberTotalDurationMonths": S.optionalWith(S.Int, { nullable: true })
}) {
}
export class MembershipsDurationAtLevel extends S.Class("MembershipsDurationAtLevel")({
    /**
     * Pricing level ID.
     */
    "level": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the user became a continuous member for the given level.
     */
    "memberSince": S.optionalWith(S.String, { nullable: true }),
    /**
     * The cumulative time the user has been a member for the given level in complete months (the time is rounded down to the nearest integer).
     */
    "memberTotalDurationMonths": S.optionalWith(S.Int, { nullable: true })
}) {
}
export class MembershipsDetails extends S.Class("MembershipsDetails")({
    /**
     * Ids of all levels that the user has access to. This includes the currently active level and all other levels that are included because of a higher purchase.
     */
    "accessibleLevels": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * Id of the highest level that the user has access to at the moment.
     */
    "highestAccessibleLevel": S.optionalWith(S.String, { nullable: true }),
    /**
     * Display name for the highest level that the user has access to at the moment.
     */
    "highestAccessibleLevelDisplayName": S.optionalWith(S.String, { nullable: true }),
    /**
     * Data about memberships duration without taking into consideration pricing levels.
     */
    "membershipsDuration": S.optionalWith(MembershipsDuration, { nullable: true }),
    /**
     * Data about memberships duration on particular pricing levels.
     */
    "membershipsDurationAtLevels": S.optionalWith(S.Array(MembershipsDurationAtLevel), { nullable: true })
}) {
}
export class MemberSnippet extends S.Class("MemberSnippet")({
    /**
     * The id of the channel that's offering memberships.
     */
    "creatorChannelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Details about the member.
     */
    "memberDetails": S.optionalWith(ChannelProfileDetails, { nullable: true }),
    /**
     * Details about the user's membership.
     */
    "membershipsDetails": S.optionalWith(MembershipsDetails, { nullable: true })
}) {
}
/**
 * A *member* resource represents a member for a YouTube channel. A member provides recurring monetary support to a creator and receives special benefits.
 */
export class Member extends S.Class("Member")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#member".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#member" }),
    /**
     * The snippet object contains basic details about the member.
     */
    "snippet": S.optionalWith(MemberSnippet, { nullable: true })
}) {
}
export class MemberListResponse extends S.Class("MemberListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of members that match the request criteria.
     */
    "items": S.optionalWith(S.Array(Member), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#memberListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#memberListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeMembershipsLevelsListParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class LevelDetails extends S.Class("LevelDetails")({
    /**
     * The name that should be used when referring to this level.
     */
    "displayName": S.optionalWith(S.String, { nullable: true })
}) {
}
export class MembershipsLevelSnippet extends S.Class("MembershipsLevelSnippet")({
    /**
     * The id of the channel that's offering channel memberships.
     */
    "creatorChannelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Details about the pricing level.
     */
    "levelDetails": S.optionalWith(LevelDetails, { nullable: true })
}) {
}
/**
 * A *membershipsLevel* resource represents an offer made by YouTube creators for their fans. Users can become members of the channel by joining one of the available levels. They will provide recurring monetary support and receives special benefits.
 */
export class MembershipsLevel extends S.Class("MembershipsLevel")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube assigns to uniquely identify the memberships level.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#membershipsLevelListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#membershipsLevel" }),
    /**
     * The snippet object contains basic details about the level.
     */
    "snippet": S.optionalWith(MembershipsLevelSnippet, { nullable: true })
}) {
}
export class MembershipsLevelListResponse extends S.Class("MembershipsLevelListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of pricing levels offered by a creator to the fans.
     */
    "items": S.optionalWith(S.Array(MembershipsLevel), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#membershipsLevelListResponse".
     */
    "kind": S.optionalWith(S.String, {
        nullable: true,
        default: () => "youtube#membershipsLevelListResponse"
    }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubePlaylistItemsListParams extends S.Struct({
    "part": S.Array(S.String),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true }),
    "playlistId": S.optionalWith(S.String, { nullable: true }),
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class PlaylistItemContentDetails extends S.Class("PlaylistItemContentDetails")({
    /**
     * The time, measured in seconds from the start of the video, when the video should stop playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) By default, assume that the video.endTime is the end of the video.
     */
    "endAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * A user-generated note for this item.
     */
    "note": S.optionalWith(S.String, { nullable: true }),
    /**
     * The time, measured in seconds from the start of the video, when the video should start playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) The default value is 0.
     */
    "startAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify a video. To retrieve the video resource, set the id query parameter to this value in your API request.
     */
    "videoId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time that the video was published to YouTube.
     */
    "videoPublishedAt": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about a playlist, including title, description and thumbnails. Basic details of a YouTube Playlist item provided by the author. Next ID: 15
 */
export class PlaylistItemSnippet extends S.Class("PlaylistItemSnippet")({
    /**
     * The ID that YouTube uses to uniquely identify the user that added the item to the playlist.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Channel title for the channel that the playlist item belongs to.
     */
    "channelTitle": S.optionalWith(S.String, { nullable: true }),
    /**
     * The item's description.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify thGe playlist that the playlist item is in.
     */
    "playlistId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The order in which the item appears in the playlist. The value uses a zero-based index, so the first item has a position of 0, the second item has a position of 1, and so forth.
     */
    "position": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The date and time that the item was added to the playlist.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * The id object contains information that can be used to uniquely identify the resource that is included in the playlist as the playlist item.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true }),
    /**
     * A map of thumbnail images associated with the playlist item. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The item's title.
     */
    "title": S.optionalWith(S.String, { nullable: true }),
    /**
     * Channel id for the channel this video belongs to.
     */
    "videoOwnerChannelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Channel title for the channel this video belongs to.
     */
    "videoOwnerChannelTitle": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * This resource's privacy status.
 */
export class PlaylistItemStatusPrivacyStatus extends S.Literal("public", "unlisted", "private") {
}
/**
 * Information about the playlist item's privacy status.
 */
export class PlaylistItemStatus extends S.Class("PlaylistItemStatus")({
    /**
     * This resource's privacy status.
     */
    "privacyStatus": S.optionalWith(PlaylistItemStatusPrivacyStatus, { nullable: true })
}) {
}
/**
 * A *playlistItem* resource identifies another resource, such as a video, that is included in a playlist. In addition, the playlistItem resource contains details about the included resource that pertain specifically to how that resource is used in that playlist. YouTube uses playlists to identify special collections of videos for a channel, such as: - uploaded videos - favorite videos - positively rated (liked) videos - watch history - watch later To be more specific, these lists are associated with a channel, which is a collection of a person, group, or company's videos, playlists, and other YouTube information. You can retrieve the playlist IDs for each of these lists from the channel resource for a given channel. You can then use the playlistItems.list method to retrieve any of those lists. You can also add or remove items from those lists by calling the playlistItems.insert and playlistItems.delete methods. For example, if a user gives a positive rating to a video, you would insert that video into the liked videos playlist for that user's channel.
 */
export class PlaylistItem extends S.Class("PlaylistItem")({
    /**
     * The contentDetails object is included in the resource if the included item is a YouTube video. The object contains additional information about the video.
     */
    "contentDetails": S.optionalWith(PlaylistItemContentDetails, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the playlist item.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItem".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#playlistItem" }),
    /**
     * The snippet object contains basic details about the playlist item, such as its title and position in the playlist.
     */
    "snippet": S.optionalWith(PlaylistItemSnippet, { nullable: true }),
    /**
     * The status object contains information about the playlist item's privacy status.
     */
    "status": S.optionalWith(PlaylistItemStatus, { nullable: true })
}) {
}
export class PlaylistItemListResponse extends S.Class("PlaylistItemListResponse")({
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of playlist items that match the request criteria.
     */
    "items": S.optionalWith(S.Array(PlaylistItem), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItemListResponse". Etag of this resource.
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#playlistItemListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubePlaylistItemsUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubePlaylistItemsInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubePlaylistItemsDeleteParams extends S.Struct({
    "id": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubePlaylistsListParams extends S.Struct({
    "part": S.Array(S.String),
    "channelId": S.optionalWith(S.String, { nullable: true }),
    "hl": S.optionalWith(S.String, { nullable: true }),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "mine": S.optionalWith(S.Boolean, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true })
}) {
}
export class PlaylistContentDetails extends S.Class("PlaylistContentDetails")({
    /**
     * The number of videos in the playlist.
     */
    "itemCount": S.optionalWith(S.Int, { nullable: true })
}) {
}
export class PlaylistPlayer extends S.Class("PlaylistPlayer")({
    /**
     * An <iframe> tag that embeds a player that will play the playlist.
     */
    "embedHtml": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Playlist localization setting
 */
export class PlaylistLocalization extends S.Class("PlaylistLocalization")({
    /**
     * The localized strings for playlist's description.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * The localized strings for playlist's title.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about a playlist, including title, description and thumbnails.
 */
export class PlaylistSnippet extends S.Class("PlaylistSnippet")({
    /**
     * The ID that YouTube uses to uniquely identify the channel that published the playlist.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The channel title of the channel that the video belongs to.
     */
    "channelTitle": S.optionalWith(S.String, { nullable: true }),
    /**
     * The language of the playlist's default title and description.
     */
    "defaultLanguage": S.optionalWith(S.String, { nullable: true }),
    /**
     * The playlist's description.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * Localized title and description, read-only.
     */
    "localized": S.optionalWith(PlaylistLocalization, { nullable: true }),
    /**
     * The date and time that the playlist was created.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * Keyword tags associated with the playlist.
     */
    "tags": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * Note: if the playlist has a custom thumbnail, this field will not be populated. The video id selected by the user that will be used as the thumbnail of this playlist. This field defaults to the first publicly viewable video in the playlist, if: 1. The user has never selected a video to be the thumbnail of the playlist. 2. The user selects a video to be the thumbnail, and then removes that video from the playlist. 3. The user selects a non-owned video to be the thumbnail, but that video becomes private, or gets deleted.
     */
    "thumbnailVideoId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A map of thumbnail images associated with the playlist. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The playlist's title.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The playlist's privacy status.
 */
export class PlaylistStatusPrivacyStatus extends S.Literal("public", "unlisted", "private") {
}
export class PlaylistStatus extends S.Class("PlaylistStatus")({
    /**
     * The playlist's privacy status.
     */
    "privacyStatus": S.optionalWith(PlaylistStatusPrivacyStatus, { nullable: true })
}) {
}
/**
 * A *playlist* resource represents a YouTube playlist. A playlist is a collection of videos that can be viewed sequentially and shared with other users. A playlist can contain up to 200 videos, and YouTube does not limit the number of playlists that each user creates. By default, playlists are publicly visible to other users, but playlists can be public or private. YouTube also uses playlists to identify special collections of videos for a channel, such as: - uploaded videos - favorite videos - positively rated (liked) videos - watch history - watch later To be more specific, these lists are associated with a channel, which is a collection of a person, group, or company's videos, playlists, and other YouTube information. You can retrieve the playlist IDs for each of these lists from the channel resource for a given channel. You can then use the playlistItems.list method to retrieve any of those lists. You can also add or remove items from those lists by calling the playlistItems.insert and playlistItems.delete methods.
 */
export class Playlist extends S.Class("Playlist")({
    /**
     * The contentDetails object contains information like video count.
     */
    "contentDetails": S.optionalWith(PlaylistContentDetails, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the playlist.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlist".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#playlist" }),
    /**
     * Localizations for different languages
     */
    "localizations": S.optionalWith(S.Record({ key: S.String, value: S.Unknown }), { nullable: true }),
    /**
     * The player object contains information that you would use to play the playlist in an embedded player.
     */
    "player": S.optionalWith(PlaylistPlayer, { nullable: true }),
    /**
     * The snippet object contains basic details about the playlist, such as its title and description.
     */
    "snippet": S.optionalWith(PlaylistSnippet, { nullable: true }),
    /**
     * The status object contains status information for the playlist.
     */
    "status": S.optionalWith(PlaylistStatus, { nullable: true })
}) {
}
export class PlaylistListResponse extends S.Class("PlaylistListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of playlists that match the request criteria
     */
    "items": S.optionalWith(S.Array(Playlist), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#playlistListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubePlaylistsUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubePlaylistsInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubePlaylistsDeleteParams extends S.Struct({
    "id": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeSearchListParamsChannelType extends S.Literal("channelTypeUnspecified", "any", "show") {
}
export class YoutubeSearchListParamsEventType extends S.Literal("none", "upcoming", "live", "completed") {
}
export class YoutubeSearchListParamsOrder extends S.Literal("searchSortUnspecified", "date", "rating", "viewCount", "relevance", "title", "videoCount") {
}
export class YoutubeSearchListParamsSafeSearch extends S.Literal("safeSearchSettingUnspecified", "none", "moderate", "strict") {
}
export class YoutubeSearchListParamsVideoCaption extends S.Literal("videoCaptionUnspecified", "any", "closedCaption", "none") {
}
export class YoutubeSearchListParamsVideoDefinition extends S.Literal("any", "standard", "high") {
}
export class YoutubeSearchListParamsVideoDimension extends S.Literal("any", "2d", "3d") {
}
export class YoutubeSearchListParamsVideoDuration extends S.Literal("videoDurationUnspecified", "any", "short", "medium", "long") {
}
export class YoutubeSearchListParamsVideoEmbeddable extends S.Literal("videoEmbeddableUnspecified", "any", "true") {
}
export class YoutubeSearchListParamsVideoLicense extends S.Literal("any", "youtube", "creativeCommon") {
}
export class YoutubeSearchListParamsVideoSyndicated extends S.Literal("videoSyndicatedUnspecified", "any", "true") {
}
export class YoutubeSearchListParamsVideoType extends S.Literal("videoTypeUnspecified", "any", "movie", "episode") {
}
export class YoutubeSearchListParams extends S.Struct({
    "part": S.Array(S.String),
    "channelId": S.optionalWith(S.String, { nullable: true }),
    "channelType": S.optionalWith(YoutubeSearchListParamsChannelType, { nullable: true }),
    "eventType": S.optionalWith(YoutubeSearchListParamsEventType, { nullable: true }),
    "forContentOwner": S.optionalWith(S.Boolean, { nullable: true }),
    "forDeveloper": S.optionalWith(S.Boolean, { nullable: true }),
    "forMine": S.optionalWith(S.Boolean, { nullable: true }),
    "location": S.optionalWith(S.String, { nullable: true }),
    "locationRadius": S.optionalWith(S.String, { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "order": S.optionalWith(YoutubeSearchListParamsOrder, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true }),
    "publishedAfter": S.optionalWith(S.String, { nullable: true }),
    "publishedBefore": S.optionalWith(S.String, { nullable: true }),
    "q": S.optionalWith(S.String, { nullable: true }),
    "regionCode": S.optionalWith(S.String, { nullable: true }),
    "relatedToVideoId": S.optionalWith(S.String, { nullable: true }),
    "relevanceLanguage": S.optionalWith(S.String, { nullable: true }),
    "safeSearch": S.optionalWith(YoutubeSearchListParamsSafeSearch, { nullable: true }),
    "topicId": S.optionalWith(S.String, { nullable: true }),
    "type": S.optionalWith(S.Array(S.String), { nullable: true }),
    "videoCaption": S.optionalWith(YoutubeSearchListParamsVideoCaption, { nullable: true }),
    "videoCategoryId": S.optionalWith(S.String, { nullable: true }),
    "videoDefinition": S.optionalWith(YoutubeSearchListParamsVideoDefinition, { nullable: true }),
    "videoDimension": S.optionalWith(YoutubeSearchListParamsVideoDimension, { nullable: true }),
    "videoDuration": S.optionalWith(YoutubeSearchListParamsVideoDuration, { nullable: true }),
    "videoEmbeddable": S.optionalWith(YoutubeSearchListParamsVideoEmbeddable, { nullable: true }),
    "videoLicense": S.optionalWith(YoutubeSearchListParamsVideoLicense, { nullable: true }),
    "videoSyndicated": S.optionalWith(YoutubeSearchListParamsVideoSyndicated, { nullable: true }),
    "videoType": S.optionalWith(YoutubeSearchListParamsVideoType, { nullable: true })
}) {
}
/**
 * It indicates if the resource (video or channel) has upcoming/active live broadcast content. Or it's "none" if there is not any upcoming/active live broadcasts.
 */
export class SearchResultSnippetLiveBroadcastContent extends S.Literal("none", "upcoming", "live", "completed") {
}
/**
 * Basic details about a search result, including title, description and thumbnails of the item referenced by the search result.
 */
export class SearchResultSnippet extends S.Class("SearchResultSnippet")({
    /**
     * The value that YouTube uses to uniquely identify the channel that published the resource that the search result identifies.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The title of the channel that published the resource that the search result identifies.
     */
    "channelTitle": S.optionalWith(S.String, { nullable: true }),
    /**
     * A description of the search result.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * It indicates if the resource (video or channel) has upcoming/active live broadcast content. Or it's "none" if there is not any upcoming/active live broadcasts.
     */
    "liveBroadcastContent": S.optionalWith(SearchResultSnippetLiveBroadcastContent, { nullable: true }),
    /**
     * The creation date and time of the resource that the search result identifies.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * A map of thumbnail images associated with the search result. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The title of the search result.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A search result contains information about a YouTube video, channel, or playlist that matches the search parameters specified in an API request. While a search result points to a uniquely identifiable resource, like a video, it does not have its own persistent data.
 */
export class SearchResult extends S.Class("SearchResult")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The id object contains information that can be used to uniquely identify the resource that matches the search request.
     */
    "id": S.optionalWith(ResourceId, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#searchResult".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#searchResult" }),
    /**
     * The snippet object contains basic details about a search result, such as its title or description. For example, if the search result is a video, then the title will be the video's title and the description will be the video's description.
     */
    "snippet": S.optionalWith(SearchResultSnippet, { nullable: true })
}) {
}
export class SearchListResponse extends S.Class("SearchListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Pagination information for token pagination.
     */
    "items": S.optionalWith(S.Array(SearchResult), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#searchListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#searchListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "regionCode": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeSubscriptionsListParamsOrder extends S.Literal("subscriptionOrderUnspecified", "relevance", "unread", "alphabetical") {
}
export class YoutubeSubscriptionsListParams extends S.Struct({
    "part": S.Array(S.String),
    "channelId": S.optionalWith(S.String, { nullable: true }),
    "forChannelId": S.optionalWith(S.String, { nullable: true }),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(50)), { nullable: true }),
    "mine": S.optionalWith(S.Boolean, { nullable: true }),
    "myRecentSubscribers": S.optionalWith(S.Boolean, { nullable: true }),
    "mySubscribers": S.optionalWith(S.Boolean, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true }),
    "order": S.optionalWith(YoutubeSubscriptionsListParamsOrder, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The type of activity this subscription is for (only uploads, everything).
 */
export class SubscriptionContentDetailsActivityType extends S.Literal("subscriptionActivityTypeUnspecified", "all", "uploads") {
}
/**
 * Details about the content to witch a subscription refers.
 */
export class SubscriptionContentDetails extends S.Class("SubscriptionContentDetails")({
    /**
     * The type of activity this subscription is for (only uploads, everything).
     */
    "activityType": S.optionalWith(SubscriptionContentDetailsActivityType, { nullable: true }),
    /**
     * The number of new items in the subscription since its content was last read.
     */
    "newItemCount": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The approximate number of items that the subscription points to.
     */
    "totalItemCount": S.optionalWith(S.Int, { nullable: true })
}) {
}
/**
 * Basic details about a subscription, including title, description and thumbnails of the subscribed item.
 */
export class SubscriptionSnippet extends S.Class("SubscriptionSnippet")({
    /**
     * The ID that YouTube uses to uniquely identify the subscriber's channel.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Channel title for the channel that the subscription belongs to.
     */
    "channelTitle": S.optionalWith(S.String, { nullable: true }),
    /**
     * The subscription's details.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time that the subscription was created.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * The id object contains information about the channel that the user subscribed to.
     */
    "resourceId": S.optionalWith(ResourceId, { nullable: true }),
    /**
     * A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The subscription's title.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about a subscription's subscriber including title, description, channel ID and thumbnails.
 */
export class SubscriptionSubscriberSnippet extends S.Class("SubscriptionSubscriberSnippet")({
    /**
     * The channel ID of the subscriber.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The description of the subscriber.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * Thumbnails for this subscriber.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The title of the subscriber.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A *subscription* resource contains information about a YouTube user subscription. A subscription notifies a user when new videos are added to a channel or when another user takes one of several actions on YouTube, such as uploading a video, rating a video, or commenting on a video.
 */
export class Subscription extends S.Class("Subscription")({
    /**
     * The contentDetails object contains basic statistics about the subscription.
     */
    "contentDetails": S.optionalWith(SubscriptionContentDetails, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the subscription.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#subscription".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#subscription" }),
    /**
     * The snippet object contains basic details about the subscription, including its title and the channel that the user subscribed to.
     */
    "snippet": S.optionalWith(SubscriptionSnippet, { nullable: true }),
    /**
     * The subscriberSnippet object contains basic details about the subscriber.
     */
    "subscriberSnippet": S.optionalWith(SubscriptionSubscriberSnippet, { nullable: true })
}) {
}
export class SubscriptionListResponse extends S.Class("SubscriptionListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of subscriptions that match the request criteria.
     */
    "items": S.optionalWith(S.Array(Subscription), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#subscriptionListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#subscriptionListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeSubscriptionsInsertParams extends S.Struct({
    "part": S.Array(S.String)
}) {
}
export class YoutubeSubscriptionsDeleteParams extends S.Struct({
    "id": S.String
}) {
}
export class YoutubeSuperChatEventsListParams extends S.Struct({
    "part": S.Array(S.String),
    "hl": S.optionalWith(S.String, { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(1), S.lessThanOrEqualTo(50)), { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true })
}) {
}
export class SuperChatEventSnippet extends S.Class("SuperChatEventSnippet")({
    /**
     * The purchase amount, in micros of the purchase currency. e.g., 1 is represented as 1000000.
     */
    "amountMicros": S.optionalWith(S.String, { nullable: true }),
    /**
     * Channel id where the event occurred.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The text contents of the comment left by the user.
     */
    "commentText": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the event occurred.
     */
    "createdAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * The currency in which the purchase was made. ISO 4217.
     */
    "currency": S.optionalWith(S.String, { nullable: true }),
    /**
     * A rendered string that displays the purchase amount and currency (e.g., "$1.00"). The string is rendered for the given language.
     */
    "displayString": S.optionalWith(S.String, { nullable: true }),
    /**
     * True if this event is a Super Sticker event.
     */
    "isSuperStickerEvent": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The tier for the paid message, which is based on the amount of money spent to purchase the message.
     */
    "messageType": S.optionalWith(S.Int, { nullable: true }),
    /**
     * If this event is a Super Sticker event, this field will contain metadata about the Super Sticker.
     */
    "superStickerMetadata": S.optionalWith(SuperStickerMetadata, { nullable: true }),
    /**
     * Details about the supporter.
     */
    "supporterDetails": S.optionalWith(ChannelProfileDetails, { nullable: true })
}) {
}
/**
 * A `__superChatEvent__` resource represents a Super Chat purchase on a YouTube channel.
 */
export class SuperChatEvent extends S.Class("SuperChatEvent")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube assigns to uniquely identify the Super Chat event.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#superChatEvent"`.
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#superChatEvent" }),
    /**
     * The `snippet` object contains basic details about the Super Chat event.
     */
    "snippet": S.optionalWith(SuperChatEventSnippet, { nullable: true })
}) {
}
export class SuperChatEventListResponse extends S.Class("SuperChatEventListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of Super Chat purchases that match the request criteria.
     */
    "items": S.optionalWith(S.Array(SuperChatEvent), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#superChatEventListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#superChatEventListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeTestsInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "externalChannelId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class TestItemTestItemSnippet extends S.Class("TestItemTestItemSnippet")({}) {
}
export class TestItem extends S.Class("TestItem")({
    "featuredPart": S.optionalWith(S.Boolean, { nullable: true }),
    "gaia": S.optionalWith(S.String, { nullable: true }),
    "id": S.optionalWith(S.String, { nullable: true }),
    "snippet": S.optionalWith(TestItemTestItemSnippet, { nullable: true })
}) {
}
export class YoutubeThirdPartyLinksListParamsType extends S.Literal("linkUnspecified", "channelToStoreLink") {
}
export class YoutubeThirdPartyLinksListParams extends S.Struct({
    "part": S.Array(S.String),
    "externalChannelId": S.optionalWith(S.String, { nullable: true }),
    "linkingToken": S.optionalWith(S.String, { nullable: true }),
    "type": S.optionalWith(YoutubeThirdPartyLinksListParamsType, { nullable: true })
}) {
}
/**
 * Information specific to a store on a merchandising platform linked to a YouTube channel.
 */
export class ChannelToStoreLinkDetails extends S.Class("ChannelToStoreLinkDetails")({
    /**
     * Google Merchant Center id of the store.
     */
    "merchantId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Name of the store.
     */
    "storeName": S.optionalWith(S.String, { nullable: true }),
    /**
     * Landing page of the store.
     */
    "storeUrl": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Type of the link named after the entities that are being linked.
 */
export class ThirdPartyLinkSnippetType extends S.Literal("linkUnspecified", "channelToStoreLink") {
}
/**
 * Basic information about a third party account link, including its type and type-specific information.
 */
export class ThirdPartyLinkSnippet extends S.Class("ThirdPartyLinkSnippet")({
    /**
     * Information specific to a link between a channel and a store on a merchandising platform.
     */
    "channelToStoreLink": S.optionalWith(ChannelToStoreLinkDetails, { nullable: true }),
    /**
     * Type of the link named after the entities that are being linked.
     */
    "type": S.optionalWith(ThirdPartyLinkSnippetType, { nullable: true })
}) {
}
export class ThirdPartyLinkStatusLinkStatus extends S.Literal("unknown", "failed", "pending", "linked") {
}
/**
 * The third-party link status object contains information about the status of the link.
 */
export class ThirdPartyLinkStatus extends S.Class("ThirdPartyLinkStatus")({
    "linkStatus": S.optionalWith(ThirdPartyLinkStatusLinkStatus, { nullable: true })
}) {
}
/**
 * A *third party account link* resource represents a link between a YouTube account or a channel and an account on a third-party service.
 */
export class ThirdPartyLink extends S.Class("ThirdPartyLink")({
    /**
     * Etag of this resource
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thirdPartyLink".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#thirdPartyLink" }),
    /**
     * The linking_token identifies a YouTube account and channel with which the third party account is linked.
     */
    "linkingToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * The snippet object contains basic details about the third- party account link.
     */
    "snippet": S.optionalWith(ThirdPartyLinkSnippet, { nullable: true }),
    /**
     * The status object contains information about the status of the link.
     */
    "status": S.optionalWith(ThirdPartyLinkStatus, { nullable: true })
}) {
}
export class ThirdPartyLinkListResponse extends S.Class("ThirdPartyLinkListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    "items": S.optionalWith(S.Array(ThirdPartyLink), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thirdPartyLinkListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#thirdPartyLinkListResponse" })
}) {
}
export class YoutubeThirdPartyLinksUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "externalChannelId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeThirdPartyLinksInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "externalChannelId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeThirdPartyLinksDeleteParamsType extends S.Literal("linkUnspecified", "channelToStoreLink") {
}
export class YoutubeThirdPartyLinksDeleteParams extends S.Struct({
    "linkingToken": S.String,
    "type": YoutubeThirdPartyLinksDeleteParamsType,
    "externalChannelId": S.optionalWith(S.String, { nullable: true }),
    "part": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
export class YoutubeThumbnailsSetParams extends S.Struct({
    "videoId": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class ThumbnailSetResponse extends S.Class("ThumbnailSetResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of thumbnails.
     */
    "items": S.optionalWith(S.Array(ThumbnailDetails), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#thumbnailSetResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#thumbnailSetResponse" }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeVideoAbuseReportReasonsListParams extends S.Struct({
    "part": S.Array(S.String),
    "hl": S.optionalWith(S.String, { nullable: true })
}) {
}
export class VideoAbuseReportSecondaryReason extends S.Class("VideoAbuseReportSecondaryReason")({
    /**
     * The ID of this abuse report secondary reason.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * The localized label for this abuse report secondary reason.
     */
    "label": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about a video category, such as its localized title.
 */
export class VideoAbuseReportReasonSnippet extends S.Class("VideoAbuseReportReasonSnippet")({
    /**
     * The localized label belonging to this abuse report reason.
     */
    "label": S.optionalWith(S.String, { nullable: true }),
    /**
     * The secondary reasons associated with this reason, if any are available. (There might be 0 or more.)
     */
    "secondaryReasons": S.optionalWith(S.Array(VideoAbuseReportSecondaryReason), { nullable: true })
}) {
}
/**
 * A `__videoAbuseReportReason__` resource identifies a reason that a video could be reported as abusive. Video abuse report reasons are used with `video.ReportAbuse`.
 */
export class VideoAbuseReportReason extends S.Class("VideoAbuseReportReason")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID of this abuse report reason.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#videoAbuseReportReason"`.
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#videoAbuseReportReason" }),
    /**
     * The `snippet` object contains basic details about the abuse report reason.
     */
    "snippet": S.optionalWith(VideoAbuseReportReasonSnippet, { nullable: true })
}) {
}
export class VideoAbuseReportReasonListResponse extends S.Class("VideoAbuseReportReasonListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of valid abuse reasons that are used with `video.ReportAbuse`.
     */
    "items": S.optionalWith(S.Array(VideoAbuseReportReason), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string `"youtube#videoAbuseReportReasonListResponse"`.
     */
    "kind": S.optionalWith(S.String, {
        nullable: true,
        default: () => "youtube#videoAbuseReportReasonListResponse"
    }),
    /**
     * The `visitorId` identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeVideoCategoriesListParams extends S.Struct({
    "part": S.Array(S.String),
    "hl": S.optionalWith(S.String, { nullable: true }),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "regionCode": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about a video category, such as its localized title.
 */
export class VideoCategorySnippet extends S.Class("VideoCategorySnippet")({
    "assignable": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The YouTube channel that created the video category.
     */
    "channelId": S.optionalWith(S.String, { nullable: true, default: () => "UCBR8-60-B28hp2BmDPdntcQ" }),
    /**
     * The video category's title.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * A *videoCategory* resource identifies a category that has been or could be associated with uploaded videos.
 */
export class VideoCategory extends S.Class("VideoCategory")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the video category.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoCategory".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#videoCategory" }),
    /**
     * The snippet object contains basic details about the video category, including its title.
     */
    "snippet": S.optionalWith(VideoCategorySnippet, { nullable: true })
}) {
}
export class VideoCategoryListResponse extends S.Class("VideoCategoryListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of video categories that can be associated with YouTube videos. In this map, the video category ID is the map key, and its value is the corresponding videoCategory resource.
     */
    "items": S.optionalWith(S.Array(VideoCategory), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoCategoryListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#videoCategoryListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeVideosListParamsChart extends S.Literal("chartUnspecified", "mostPopular") {
}
export class YoutubeVideosListParamsMyRating extends S.Literal("none", "like", "dislike") {
}
export class YoutubeVideosListParams extends S.Struct({
    "part": S.Array(S.String),
    "chart": S.optionalWith(YoutubeVideosListParamsChart, { nullable: true }),
    "hl": S.optionalWith(S.String, { nullable: true }),
    "id": S.optionalWith(S.Array(S.String), { nullable: true }),
    "locale": S.optionalWith(S.String, { nullable: true }),
    "maxHeight": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(72), S.lessThanOrEqualTo(8192)), { nullable: true }),
    "maxResults": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(1), S.lessThanOrEqualTo(50)), { nullable: true }),
    "maxWidth": S.optionalWith(S.Int.pipe(S.greaterThanOrEqualTo(72), S.lessThanOrEqualTo(8192)), { nullable: true }),
    "myRating": S.optionalWith(YoutubeVideosListParamsMyRating, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "pageToken": S.optionalWith(S.String, { nullable: true }),
    "regionCode": S.optionalWith(S.String, { nullable: true }),
    "videoCategoryId": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Video game rating, if any.
 */
export class VideoAgeGatingVideoGameRating extends S.Literal("anyone", "m15Plus", "m16Plus", "m17Plus") {
}
export class VideoAgeGating extends S.Class("VideoAgeGating")({
    /**
     * Indicates whether or not the video has alcoholic beverage content. Only users of legal purchasing age in a particular country, as identified by ICAP, can view the content.
     */
    "alcoholContent": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Age-restricted trailers. For redband trailers and adult-rated video-games. Only users aged 18+ can view the content. The the field is true the content is restricted to viewers aged 18+. Otherwise The field won't be present.
     */
    "restricted": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Video game rating, if any.
     */
    "videoGameRating": S.optionalWith(VideoAgeGatingVideoGameRating, { nullable: true })
}) {
}
/**
 * The value of captions indicates whether the video has captions or not.
 */
export class VideoContentDetailsCaption extends S.Literal("true", "false") {
}
/**
 * The video's Australian Classification Board (ACB) or Australian Communications and Media Authority (ACMA) rating. ACMA ratings are used to classify children's television programming.
 */
export class ContentRatingAcbRating extends S.Literal("acbUnspecified", "acbE", "acbP", "acbC", "acbG", "acbPg", "acbM", "acbMa15plus", "acbR18plus", "acbUnrated") {
}
/**
 * The video's rating from Italy's Autorità per le Garanzie nelle Comunicazioni (AGCOM).
 */
export class ContentRatingAgcomRating extends S.Literal("agcomUnspecified", "agcomT", "agcomVm14", "agcomVm18", "agcomUnrated") {
}
/**
 * The video's Anatel (Asociación Nacional de Televisión) rating for Chilean television.
 */
export class ContentRatingAnatelRating extends S.Literal("anatelUnspecified", "anatelF", "anatelI", "anatelI7", "anatelI10", "anatelI12", "anatelR", "anatelA", "anatelUnrated") {
}
/**
 * The video's British Board of Film Classification (BBFC) rating.
 */
export class ContentRatingBbfcRating extends S.Literal("bbfcUnspecified", "bbfcU", "bbfcPg", "bbfc12a", "bbfc12", "bbfc15", "bbfc18", "bbfcR18", "bbfcUnrated") {
}
/**
 * The video's rating from Thailand's Board of Film and Video Censors.
 */
export class ContentRatingBfvcRating extends S.Literal("bfvcUnspecified", "bfvcG", "bfvcE", "bfvc13", "bfvc15", "bfvc18", "bfvc20", "bfvcB", "bfvcUnrated") {
}
/**
 * The video's rating from the Austrian Board of Media Classification (Bundesministerium für Unterricht, Kunst und Kultur).
 */
export class ContentRatingBmukkRating extends S.Literal("bmukkUnspecified", "bmukkAa", "bmukk6", "bmukk8", "bmukk10", "bmukk12", "bmukk14", "bmukk16", "bmukkUnrated") {
}
/**
 * Rating system for Canadian TV - Canadian TV Classification System The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian English-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
 */
export class ContentRatingCatvRating extends S.Literal("catvUnspecified", "catvC", "catvC8", "catvG", "catvPg", "catv14plus", "catv18plus", "catvUnrated", "catvE") {
}
/**
 * The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian French-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
 */
export class ContentRatingCatvfrRating extends S.Literal("catvfrUnspecified", "catvfrG", "catvfr8plus", "catvfr13plus", "catvfr16plus", "catvfr18plus", "catvfrUnrated", "catvfrE") {
}
/**
 * The video's Central Board of Film Certification (CBFC - India) rating.
 */
export class ContentRatingCbfcRating extends S.Literal("cbfcUnspecified", "cbfcU", "cbfcUA", "cbfcUA7plus", "cbfcUA13plus", "cbfcUA16plus", "cbfcA", "cbfcS", "cbfcUnrated") {
}
/**
 * The video's Consejo de Calificación Cinematográfica (Chile) rating.
 */
export class ContentRatingCccRating extends S.Literal("cccUnspecified", "cccTe", "ccc6", "ccc14", "ccc18", "ccc18v", "ccc18s", "cccUnrated") {
}
/**
 * The video's rating from Portugal's Comissão de Classificação de Espect´culos.
 */
export class ContentRatingCceRating extends S.Literal("cceUnspecified", "cceM4", "cceM6", "cceM12", "cceM16", "cceM18", "cceUnrated", "cceM14") {
}
/**
 * The video's rating in Switzerland.
 */
export class ContentRatingChfilmRating extends S.Literal("chfilmUnspecified", "chfilm0", "chfilm6", "chfilm12", "chfilm16", "chfilm18", "chfilmUnrated") {
}
/**
 * The video's Canadian Home Video Rating System (CHVRS) rating.
 */
export class ContentRatingChvrsRating extends S.Literal("chvrsUnspecified", "chvrsG", "chvrsPg", "chvrs14a", "chvrs18a", "chvrsR", "chvrsE", "chvrsUnrated") {
}
/**
 * The video's rating from the Commission de Contrôle des Films (Belgium).
 */
export class ContentRatingCicfRating extends S.Literal("cicfUnspecified", "cicfE", "cicfKtEa", "cicfKntEna", "cicfUnrated") {
}
/**
 * The video's rating from Romania's CONSILIUL NATIONAL AL AUDIOVIZUALULUI (CNA).
 */
export class ContentRatingCnaRating extends S.Literal("cnaUnspecified", "cnaAp", "cna12", "cna15", "cna18", "cna18plus", "cnaUnrated") {
}
/**
 * Rating system in France - Commission de classification cinematographique
 */
export class ContentRatingCncRating extends S.Literal("cncUnspecified", "cncT", "cnc10", "cnc12", "cnc16", "cnc18", "cncE", "cncInterdiction", "cncUnrated") {
}
/**
 * The video's rating from France's Conseil supérieur de l’audiovisuel, which rates broadcast content.
 */
export class ContentRatingCsaRating extends S.Literal("csaUnspecified", "csaT", "csa10", "csa12", "csa16", "csa18", "csaInterdiction", "csaUnrated") {
}
/**
 * The video's rating from Luxembourg's Commission de surveillance de la classification des films (CSCF).
 */
export class ContentRatingCscfRating extends S.Literal("cscfUnspecified", "cscfAl", "cscfA", "cscf6", "cscf9", "cscf12", "cscf16", "cscf18", "cscfUnrated") {
}
/**
 * The video's rating in the Czech Republic.
 */
export class ContentRatingCzfilmRating extends S.Literal("czfilmUnspecified", "czfilmU", "czfilm12", "czfilm14", "czfilm18", "czfilmUnrated") {
}
/**
 * The video's Departamento de Justiça, Classificação, Qualificação e Títulos (DJCQT - Brazil) rating.
 */
export class ContentRatingDjctqRating extends S.Literal("djctqUnspecified", "djctqL", "djctq10", "djctq12", "djctq14", "djctq16", "djctq18", "djctqEr", "djctqL10", "djctqL12", "djctqL14", "djctqL16", "djctqL18", "djctq1012", "djctq1014", "djctq1016", "djctq1018", "djctq1214", "djctq1216", "djctq1218", "djctq1416", "djctq1418", "djctq1618", "djctqUnrated") {
}
/**
 * Rating system in Turkey - Evaluation and Classification Board of the Ministry of Culture and Tourism
 */
export class ContentRatingEcbmctRating extends S.Literal("ecbmctUnspecified", "ecbmctG", "ecbmct7a", "ecbmct7plus", "ecbmct13a", "ecbmct13plus", "ecbmct15a", "ecbmct15plus", "ecbmct18plus", "ecbmctUnrated") {
}
/**
 * The video's rating in Estonia.
 */
export class ContentRatingEefilmRating extends S.Literal("eefilmUnspecified", "eefilmPere", "eefilmL", "eefilmMs6", "eefilmK6", "eefilmMs12", "eefilmK12", "eefilmK14", "eefilmK16", "eefilmUnrated") {
}
/**
 * The video's rating in Egypt.
 */
export class ContentRatingEgfilmRating extends S.Literal("egfilmUnspecified", "egfilmGn", "egfilm18", "egfilmBn", "egfilmUnrated") {
}
/**
 * The video's Eirin (映倫) rating. Eirin is the Japanese rating system.
 */
export class ContentRatingEirinRating extends S.Literal("eirinUnspecified", "eirinG", "eirinPg12", "eirinR15plus", "eirinR18plus", "eirinUnrated") {
}
/**
 * The video's rating from Malaysia's Film Censorship Board.
 */
export class ContentRatingFcbmRating extends S.Literal("fcbmUnspecified", "fcbmU", "fcbmPg13", "fcbmP13", "fcbm18", "fcbm18sx", "fcbm18pa", "fcbm18sg", "fcbm18pl", "fcbmUnrated") {
}
/**
 * The video's rating from Hong Kong's Office for Film, Newspaper and Article Administration.
 */
export class ContentRatingFcoRating extends S.Literal("fcoUnspecified", "fcoI", "fcoIia", "fcoIib", "fcoIi", "fcoIii", "fcoUnrated") {
}
/**
 * This property has been deprecated. Use the contentDetails.contentRating.cncRating instead.
 */
export class ContentRatingFmocRating extends S.Literal("fmocUnspecified", "fmocU", "fmoc10", "fmoc12", "fmoc16", "fmoc18", "fmocE", "fmocUnrated") {
}
/**
 * The video's rating from South Africa's Film and Publication Board.
 */
export class ContentRatingFpbRating extends S.Literal("fpbUnspecified", "fpbA", "fpbPg", "fpb79Pg", "fpb1012Pg", "fpb13", "fpb16", "fpb18", "fpbX18", "fpbXx", "fpbUnrated", "fpb10") {
}
/**
 * The video's Freiwillige Selbstkontrolle der Filmwirtschaft (FSK - Germany) rating.
 */
export class ContentRatingFskRating extends S.Literal("fskUnspecified", "fsk0", "fsk6", "fsk12", "fsk16", "fsk18", "fskUnrated") {
}
/**
 * The video's rating in Greece.
 */
export class ContentRatingGrfilmRating extends S.Literal("grfilmUnspecified", "grfilmK", "grfilmE", "grfilmK12", "grfilmK13", "grfilmK15", "grfilmK17", "grfilmK18", "grfilmUnrated") {
}
/**
 * The video's Instituto de la Cinematografía y de las Artes Audiovisuales (ICAA - Spain) rating.
 */
export class ContentRatingIcaaRating extends S.Literal("icaaUnspecified", "icaaApta", "icaa7", "icaa12", "icaa13", "icaa16", "icaa18", "icaaX", "icaaUnrated") {
}
/**
 * The video's Irish Film Classification Office (IFCO - Ireland) rating. See the IFCO website for more information.
 */
export class ContentRatingIfcoRating extends S.Literal("ifcoUnspecified", "ifcoG", "ifcoPg", "ifco12", "ifco12a", "ifco15", "ifco15a", "ifco16", "ifco18", "ifcoUnrated") {
}
/**
 * The video's rating in Israel.
 */
export class ContentRatingIlfilmRating extends S.Literal("ilfilmUnspecified", "ilfilmAa", "ilfilm12", "ilfilm14", "ilfilm16", "ilfilm18", "ilfilmUnrated") {
}
/**
 * The video's INCAA (Instituto Nacional de Cine y Artes Audiovisuales - Argentina) rating.
 */
export class ContentRatingIncaaRating extends S.Literal("incaaUnspecified", "incaaAtp", "incaaSam13", "incaaSam16", "incaaSam18", "incaaC", "incaaUnrated") {
}
/**
 * The video's rating from the Kenya Film Classification Board.
 */
export class ContentRatingKfcbRating extends S.Literal("kfcbUnspecified", "kfcbG", "kfcbPg", "kfcb16plus", "kfcbR", "kfcbUnrated") {
}
/**
 * The video's NICAM/Kijkwijzer rating from the Nederlands Instituut voor de Classificatie van Audiovisuele Media (Netherlands).
 */
export class ContentRatingKijkwijzerRating extends S.Literal("kijkwijzerUnspecified", "kijkwijzerAl", "kijkwijzer6", "kijkwijzer9", "kijkwijzer12", "kijkwijzer16", "kijkwijzer18", "kijkwijzerUnrated") {
}
/**
 * The video's Korea Media Rating Board (영상물등급위원회) rating. The KMRB rates videos in South Korea.
 */
export class ContentRatingKmrbRating extends S.Literal("kmrbUnspecified", "kmrbAll", "kmrb12plus", "kmrb15plus", "kmrbTeenr", "kmrbR", "kmrbUnrated") {
}
/**
 * The video's rating from Indonesia's Lembaga Sensor Film.
 */
export class ContentRatingLsfRating extends S.Literal("lsfUnspecified", "lsfSu", "lsfA", "lsfBo", "lsf13", "lsfR", "lsf17", "lsfD", "lsf21", "lsfUnrated") {
}
/**
 * The video's rating from Malta's Film Age-Classification Board.
 */
export class ContentRatingMccaaRating extends S.Literal("mccaaUnspecified", "mccaaU", "mccaaPg", "mccaa12a", "mccaa12", "mccaa14", "mccaa15", "mccaa16", "mccaa18", "mccaaUnrated") {
}
/**
 * The video's rating from the Danish Film Institute's (Det Danske Filminstitut) Media Council for Children and Young People.
 */
export class ContentRatingMccypRating extends S.Literal("mccypUnspecified", "mccypA", "mccyp7", "mccyp11", "mccyp15", "mccypUnrated") {
}
/**
 * The video's rating system for Vietnam - MCST
 */
export class ContentRatingMcstRating extends S.Literal("mcstUnspecified", "mcstP", "mcst0", "mcstC13", "mcstC16", "mcst16plus", "mcstC18", "mcstGPg", "mcstUnrated") {
}
/**
 * The video's rating from Singapore's Media Development Authority (MDA) and, specifically, it's Board of Film Censors (BFC).
 */
export class ContentRatingMdaRating extends S.Literal("mdaUnspecified", "mdaG", "mdaPg", "mdaPg13", "mdaNc16", "mdaM18", "mdaR21", "mdaUnrated") {
}
/**
 * The video's rating from Medietilsynet, the Norwegian Media Authority.
 */
export class ContentRatingMedietilsynetRating extends S.Literal("medietilsynetUnspecified", "medietilsynetA", "medietilsynet6", "medietilsynet7", "medietilsynet9", "medietilsynet11", "medietilsynet12", "medietilsynet15", "medietilsynet18", "medietilsynetUnrated") {
}
/**
 * The video's rating from Finland's Kansallinen Audiovisuaalinen Instituutti (National Audiovisual Institute).
 */
export class ContentRatingMekuRating extends S.Literal("mekuUnspecified", "mekuS", "meku7", "meku12", "meku16", "meku18", "mekuUnrated") {
}
/**
 * The rating system for MENA countries, a clone of MPAA. It is needed to prevent titles go live w/o additional QC check, since some of them can be inappropriate for the countries at all. See b/33408548 for more details.
 */
export class ContentRatingMenaMpaaRating extends S.Literal("menaMpaaUnspecified", "menaMpaaG", "menaMpaaPg", "menaMpaaPg13", "menaMpaaR", "menaMpaaUnrated") {
}
/**
 * The video's rating from the Ministero dei Beni e delle Attività Culturali e del Turismo (Italy).
 */
export class ContentRatingMibacRating extends S.Literal("mibacUnspecified", "mibacT", "mibacVap", "mibacVm6", "mibacVm12", "mibacVm14", "mibacVm16", "mibacVm18", "mibacUnrated") {
}
/**
 * The video's Ministerio de Cultura (Colombia) rating.
 */
export class ContentRatingMocRating extends S.Literal("mocUnspecified", "mocE", "mocT", "moc7", "moc12", "moc15", "moc18", "mocX", "mocBanned", "mocUnrated") {
}
/**
 * The video's rating from Taiwan's Ministry of Culture (文化部).
 */
export class ContentRatingMoctwRating extends S.Literal("moctwUnspecified", "moctwG", "moctwP", "moctwPg", "moctwR", "moctwUnrated", "moctwR12", "moctwR15") {
}
/**
 * The video's Motion Picture Association of America (MPAA) rating.
 */
export class ContentRatingMpaaRating extends S.Literal("mpaaUnspecified", "mpaaG", "mpaaPg", "mpaaPg13", "mpaaR", "mpaaNc17", "mpaaX", "mpaaUnrated") {
}
/**
 * The rating system for trailer, DVD, and Ad in the US. See http://movielabs.com/md/ratings/v2.3/html/US_MPAAT_Ratings.html.
 */
export class ContentRatingMpaatRating extends S.Literal("mpaatUnspecified", "mpaatGb", "mpaatRb") {
}
/**
 * The video's rating from the Movie and Television Review and Classification Board (Philippines).
 */
export class ContentRatingMtrcbRating extends S.Literal("mtrcbUnspecified", "mtrcbG", "mtrcbPg", "mtrcbR13", "mtrcbR16", "mtrcbR18", "mtrcbX", "mtrcbUnrated") {
}
/**
 * The video's rating from the Maldives National Bureau of Classification.
 */
export class ContentRatingNbcRating extends S.Literal("nbcUnspecified", "nbcG", "nbcPg", "nbc12plus", "nbc15plus", "nbc18plus", "nbc18plusr", "nbcPu", "nbcUnrated") {
}
/**
 * The video's rating in Poland.
 */
export class ContentRatingNbcplRating extends S.Literal("nbcplUnspecified", "nbcplI", "nbcplIi", "nbcplIii", "nbcplIv", "nbcpl18plus", "nbcplUnrated") {
}
/**
 * The video's rating from the Bulgarian National Film Center.
 */
export class ContentRatingNfrcRating extends S.Literal("nfrcUnspecified", "nfrcA", "nfrcB", "nfrcC", "nfrcD", "nfrcX", "nfrcUnrated") {
}
/**
 * The video's rating from Nigeria's National Film and Video Censors Board.
 */
export class ContentRatingNfvcbRating extends S.Literal("nfvcbUnspecified", "nfvcbG", "nfvcbPg", "nfvcb12", "nfvcb12a", "nfvcb15", "nfvcb18", "nfvcbRe", "nfvcbUnrated") {
}
/**
 * The video's rating from the Nacionãlais Kino centrs (National Film Centre of Latvia).
 */
export class ContentRatingNkclvRating extends S.Literal("nkclvUnspecified", "nkclvU", "nkclv7plus", "nkclv12plus", "nkclv16plus", "nkclv18plus", "nkclvUnrated") {
}
/**
 * The National Media Council ratings system for United Arab Emirates.
 */
export class ContentRatingNmcRating extends S.Literal("nmcUnspecified", "nmcG", "nmcPg", "nmcPg13", "nmcPg15", "nmc15plus", "nmc18plus", "nmc18tc", "nmcUnrated") {
}
/**
 * The video's Office of Film and Literature Classification (OFLC - New Zealand) rating.
 */
export class ContentRatingOflcRating extends S.Literal("oflcUnspecified", "oflcG", "oflcPg", "oflcM", "oflcR13", "oflcR15", "oflcR16", "oflcR18", "oflcUnrated", "oflcRp13", "oflcRp16", "oflcRp18") {
}
/**
 * The video's rating in Peru.
 */
export class ContentRatingPefilmRating extends S.Literal("pefilmUnspecified", "pefilmPt", "pefilmPg", "pefilm14", "pefilm18", "pefilmUnrated") {
}
/**
 * The video's rating from the Hungarian Nemzeti Filmiroda, the Rating Committee of the National Office of Film.
 */
export class ContentRatingRcnofRating extends S.Literal("rcnofUnspecified", "rcnofI", "rcnofIi", "rcnofIii", "rcnofIv", "rcnofV", "rcnofVi", "rcnofUnrated") {
}
/**
 * The video's rating in Venezuela.
 */
export class ContentRatingResorteviolenciaRating extends S.Literal("resorteviolenciaUnspecified", "resorteviolenciaA", "resorteviolenciaB", "resorteviolenciaC", "resorteviolenciaD", "resorteviolenciaE", "resorteviolenciaUnrated") {
}
/**
 * The video's General Directorate of Radio, Television and Cinematography (Mexico) rating.
 */
export class ContentRatingRtcRating extends S.Literal("rtcUnspecified", "rtcAa", "rtcA", "rtcB", "rtcB15", "rtcC", "rtcD", "rtcUnrated") {
}
/**
 * The video's rating from Ireland's Raidió Teilifís Éireann.
 */
export class ContentRatingRteRating extends S.Literal("rteUnspecified", "rteGa", "rteCh", "rtePs", "rteMa", "rteUnrated") {
}
/**
 * The video's National Film Registry of the Russian Federation (MKRF - Russia) rating.
 */
export class ContentRatingRussiaRating extends S.Literal("russiaUnspecified", "russia0", "russia6", "russia12", "russia16", "russia18", "russiaUnrated") {
}
/**
 * The video's rating in Slovakia.
 */
export class ContentRatingSkfilmRating extends S.Literal("skfilmUnspecified", "skfilmG", "skfilmP2", "skfilmP5", "skfilmP8", "skfilmUnrated") {
}
/**
 * The video's rating in Iceland.
 */
export class ContentRatingSmaisRating extends S.Literal("smaisUnspecified", "smaisL", "smais7", "smais12", "smais14", "smais16", "smais18", "smaisUnrated") {
}
/**
 * The video's rating from Statens medieråd (Sweden's National Media Council).
 */
export class ContentRatingSmsaRating extends S.Literal("smsaUnspecified", "smsaA", "smsa7", "smsa11", "smsa15", "smsaUnrated") {
}
/**
 * The video's TV Parental Guidelines (TVPG) rating.
 */
export class ContentRatingTvpgRating extends S.Literal("tvpgUnspecified", "tvpgY", "tvpgY7", "tvpgY7Fv", "tvpgG", "tvpgPg", "pg14", "tvpgMa", "tvpgUnrated") {
}
/**
 * A rating that YouTube uses to identify age-restricted content.
 */
export class ContentRatingYtRating extends S.Literal("ytUnspecified", "ytAgeRestricted") {
}
/**
 * Ratings schemes. The country-specific ratings are mostly for movies and shows. LINT.IfChange
 */
export class ContentRating extends S.Class("ContentRating")({
    /**
     * The video's Australian Classification Board (ACB) or Australian Communications and Media Authority (ACMA) rating. ACMA ratings are used to classify children's television programming.
     */
    "acbRating": S.optionalWith(ContentRatingAcbRating, { nullable: true }),
    /**
     * The video's rating from Italy's Autorità per le Garanzie nelle Comunicazioni (AGCOM).
     */
    "agcomRating": S.optionalWith(ContentRatingAgcomRating, { nullable: true }),
    /**
     * The video's Anatel (Asociación Nacional de Televisión) rating for Chilean television.
     */
    "anatelRating": S.optionalWith(ContentRatingAnatelRating, { nullable: true }),
    /**
     * The video's British Board of Film Classification (BBFC) rating.
     */
    "bbfcRating": S.optionalWith(ContentRatingBbfcRating, { nullable: true }),
    /**
     * The video's rating from Thailand's Board of Film and Video Censors.
     */
    "bfvcRating": S.optionalWith(ContentRatingBfvcRating, { nullable: true }),
    /**
     * The video's rating from the Austrian Board of Media Classification (Bundesministerium für Unterricht, Kunst und Kultur).
     */
    "bmukkRating": S.optionalWith(ContentRatingBmukkRating, { nullable: true }),
    /**
     * Rating system for Canadian TV - Canadian TV Classification System The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian English-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
     */
    "catvRating": S.optionalWith(ContentRatingCatvRating, { nullable: true }),
    /**
     * The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian French-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
     */
    "catvfrRating": S.optionalWith(ContentRatingCatvfrRating, { nullable: true }),
    /**
     * The video's Central Board of Film Certification (CBFC - India) rating.
     */
    "cbfcRating": S.optionalWith(ContentRatingCbfcRating, { nullable: true }),
    /**
     * The video's Consejo de Calificación Cinematográfica (Chile) rating.
     */
    "cccRating": S.optionalWith(ContentRatingCccRating, { nullable: true }),
    /**
     * The video's rating from Portugal's Comissão de Classificação de Espect´culos.
     */
    "cceRating": S.optionalWith(ContentRatingCceRating, { nullable: true }),
    /**
     * The video's rating in Switzerland.
     */
    "chfilmRating": S.optionalWith(ContentRatingChfilmRating, { nullable: true }),
    /**
     * The video's Canadian Home Video Rating System (CHVRS) rating.
     */
    "chvrsRating": S.optionalWith(ContentRatingChvrsRating, { nullable: true }),
    /**
     * The video's rating from the Commission de Contrôle des Films (Belgium).
     */
    "cicfRating": S.optionalWith(ContentRatingCicfRating, { nullable: true }),
    /**
     * The video's rating from Romania's CONSILIUL NATIONAL AL AUDIOVIZUALULUI (CNA).
     */
    "cnaRating": S.optionalWith(ContentRatingCnaRating, { nullable: true }),
    /**
     * Rating system in France - Commission de classification cinematographique
     */
    "cncRating": S.optionalWith(ContentRatingCncRating, { nullable: true }),
    /**
     * The video's rating from France's Conseil supérieur de l’audiovisuel, which rates broadcast content.
     */
    "csaRating": S.optionalWith(ContentRatingCsaRating, { nullable: true }),
    /**
     * The video's rating from Luxembourg's Commission de surveillance de la classification des films (CSCF).
     */
    "cscfRating": S.optionalWith(ContentRatingCscfRating, { nullable: true }),
    /**
     * The video's rating in the Czech Republic.
     */
    "czfilmRating": S.optionalWith(ContentRatingCzfilmRating, { nullable: true }),
    /**
     * The video's Departamento de Justiça, Classificação, Qualificação e Títulos (DJCQT - Brazil) rating.
     */
    "djctqRating": S.optionalWith(ContentRatingDjctqRating, { nullable: true }),
    /**
     * Reasons that explain why the video received its DJCQT (Brazil) rating.
     */
    "djctqRatingReasons": S.optionalWith(S.Array(S.Literal("djctqRatingReasonUnspecified", "djctqViolence", "djctqExtremeViolence", "djctqSexualContent", "djctqNudity", "djctqSex", "djctqExplicitSex", "djctqDrugs", "djctqLegalDrugs", "djctqIllegalDrugs", "djctqInappropriateLanguage", "djctqCriminalActs", "djctqImpactingContent")), { nullable: true }),
    /**
     * Rating system in Turkey - Evaluation and Classification Board of the Ministry of Culture and Tourism
     */
    "ecbmctRating": S.optionalWith(ContentRatingEcbmctRating, { nullable: true }),
    /**
     * The video's rating in Estonia.
     */
    "eefilmRating": S.optionalWith(ContentRatingEefilmRating, { nullable: true }),
    /**
     * The video's rating in Egypt.
     */
    "egfilmRating": S.optionalWith(ContentRatingEgfilmRating, { nullable: true }),
    /**
     * The video's Eirin (映倫) rating. Eirin is the Japanese rating system.
     */
    "eirinRating": S.optionalWith(ContentRatingEirinRating, { nullable: true }),
    /**
     * The video's rating from Malaysia's Film Censorship Board.
     */
    "fcbmRating": S.optionalWith(ContentRatingFcbmRating, { nullable: true }),
    /**
     * The video's rating from Hong Kong's Office for Film, Newspaper and Article Administration.
     */
    "fcoRating": S.optionalWith(ContentRatingFcoRating, { nullable: true }),
    /**
     * This property has been deprecated. Use the contentDetails.contentRating.cncRating instead.
     */
    "fmocRating": S.optionalWith(ContentRatingFmocRating, { nullable: true }),
    /**
     * The video's rating from South Africa's Film and Publication Board.
     */
    "fpbRating": S.optionalWith(ContentRatingFpbRating, { nullable: true }),
    /**
     * Reasons that explain why the video received its FPB (South Africa) rating.
     */
    "fpbRatingReasons": S.optionalWith(S.Array(S.Literal("fpbRatingReasonUnspecified", "fpbBlasphemy", "fpbLanguage", "fpbNudity", "fpbPrejudice", "fpbSex", "fpbViolence", "fpbDrugs", "fpbSexualViolence", "fpbHorror", "fpbCriminalTechniques", "fpbImitativeActsTechniques")), { nullable: true }),
    /**
     * The video's Freiwillige Selbstkontrolle der Filmwirtschaft (FSK - Germany) rating.
     */
    "fskRating": S.optionalWith(ContentRatingFskRating, { nullable: true }),
    /**
     * The video's rating in Greece.
     */
    "grfilmRating": S.optionalWith(ContentRatingGrfilmRating, { nullable: true }),
    /**
     * The video's Instituto de la Cinematografía y de las Artes Audiovisuales (ICAA - Spain) rating.
     */
    "icaaRating": S.optionalWith(ContentRatingIcaaRating, { nullable: true }),
    /**
     * The video's Irish Film Classification Office (IFCO - Ireland) rating. See the IFCO website for more information.
     */
    "ifcoRating": S.optionalWith(ContentRatingIfcoRating, { nullable: true }),
    /**
     * The video's rating in Israel.
     */
    "ilfilmRating": S.optionalWith(ContentRatingIlfilmRating, { nullable: true }),
    /**
     * The video's INCAA (Instituto Nacional de Cine y Artes Audiovisuales - Argentina) rating.
     */
    "incaaRating": S.optionalWith(ContentRatingIncaaRating, { nullable: true }),
    /**
     * The video's rating from the Kenya Film Classification Board.
     */
    "kfcbRating": S.optionalWith(ContentRatingKfcbRating, { nullable: true }),
    /**
     * The video's NICAM/Kijkwijzer rating from the Nederlands Instituut voor de Classificatie van Audiovisuele Media (Netherlands).
     */
    "kijkwijzerRating": S.optionalWith(ContentRatingKijkwijzerRating, { nullable: true }),
    /**
     * The video's Korea Media Rating Board (영상물등급위원회) rating. The KMRB rates videos in South Korea.
     */
    "kmrbRating": S.optionalWith(ContentRatingKmrbRating, { nullable: true }),
    /**
     * The video's rating from Indonesia's Lembaga Sensor Film.
     */
    "lsfRating": S.optionalWith(ContentRatingLsfRating, { nullable: true }),
    /**
     * The video's rating from Malta's Film Age-Classification Board.
     */
    "mccaaRating": S.optionalWith(ContentRatingMccaaRating, { nullable: true }),
    /**
     * The video's rating from the Danish Film Institute's (Det Danske Filminstitut) Media Council for Children and Young People.
     */
    "mccypRating": S.optionalWith(ContentRatingMccypRating, { nullable: true }),
    /**
     * The video's rating system for Vietnam - MCST
     */
    "mcstRating": S.optionalWith(ContentRatingMcstRating, { nullable: true }),
    /**
     * The video's rating from Singapore's Media Development Authority (MDA) and, specifically, it's Board of Film Censors (BFC).
     */
    "mdaRating": S.optionalWith(ContentRatingMdaRating, { nullable: true }),
    /**
     * The video's rating from Medietilsynet, the Norwegian Media Authority.
     */
    "medietilsynetRating": S.optionalWith(ContentRatingMedietilsynetRating, { nullable: true }),
    /**
     * The video's rating from Finland's Kansallinen Audiovisuaalinen Instituutti (National Audiovisual Institute).
     */
    "mekuRating": S.optionalWith(ContentRatingMekuRating, { nullable: true }),
    /**
     * The rating system for MENA countries, a clone of MPAA. It is needed to prevent titles go live w/o additional QC check, since some of them can be inappropriate for the countries at all. See b/33408548 for more details.
     */
    "menaMpaaRating": S.optionalWith(ContentRatingMenaMpaaRating, { nullable: true }),
    /**
     * The video's rating from the Ministero dei Beni e delle Attività Culturali e del Turismo (Italy).
     */
    "mibacRating": S.optionalWith(ContentRatingMibacRating, { nullable: true }),
    /**
     * The video's Ministerio de Cultura (Colombia) rating.
     */
    "mocRating": S.optionalWith(ContentRatingMocRating, { nullable: true }),
    /**
     * The video's rating from Taiwan's Ministry of Culture (文化部).
     */
    "moctwRating": S.optionalWith(ContentRatingMoctwRating, { nullable: true }),
    /**
     * The video's Motion Picture Association of America (MPAA) rating.
     */
    "mpaaRating": S.optionalWith(ContentRatingMpaaRating, { nullable: true }),
    /**
     * The rating system for trailer, DVD, and Ad in the US. See http://movielabs.com/md/ratings/v2.3/html/US_MPAAT_Ratings.html.
     */
    "mpaatRating": S.optionalWith(ContentRatingMpaatRating, { nullable: true }),
    /**
     * The video's rating from the Movie and Television Review and Classification Board (Philippines).
     */
    "mtrcbRating": S.optionalWith(ContentRatingMtrcbRating, { nullable: true }),
    /**
     * The video's rating from the Maldives National Bureau of Classification.
     */
    "nbcRating": S.optionalWith(ContentRatingNbcRating, { nullable: true }),
    /**
     * The video's rating in Poland.
     */
    "nbcplRating": S.optionalWith(ContentRatingNbcplRating, { nullable: true }),
    /**
     * The video's rating from the Bulgarian National Film Center.
     */
    "nfrcRating": S.optionalWith(ContentRatingNfrcRating, { nullable: true }),
    /**
     * The video's rating from Nigeria's National Film and Video Censors Board.
     */
    "nfvcbRating": S.optionalWith(ContentRatingNfvcbRating, { nullable: true }),
    /**
     * The video's rating from the Nacionãlais Kino centrs (National Film Centre of Latvia).
     */
    "nkclvRating": S.optionalWith(ContentRatingNkclvRating, { nullable: true }),
    /**
     * The National Media Council ratings system for United Arab Emirates.
     */
    "nmcRating": S.optionalWith(ContentRatingNmcRating, { nullable: true }),
    /**
     * The video's Office of Film and Literature Classification (OFLC - New Zealand) rating.
     */
    "oflcRating": S.optionalWith(ContentRatingOflcRating, { nullable: true }),
    /**
     * The video's rating in Peru.
     */
    "pefilmRating": S.optionalWith(ContentRatingPefilmRating, { nullable: true }),
    /**
     * The video's rating from the Hungarian Nemzeti Filmiroda, the Rating Committee of the National Office of Film.
     */
    "rcnofRating": S.optionalWith(ContentRatingRcnofRating, { nullable: true }),
    /**
     * The video's rating in Venezuela.
     */
    "resorteviolenciaRating": S.optionalWith(ContentRatingResorteviolenciaRating, { nullable: true }),
    /**
     * The video's General Directorate of Radio, Television and Cinematography (Mexico) rating.
     */
    "rtcRating": S.optionalWith(ContentRatingRtcRating, { nullable: true }),
    /**
     * The video's rating from Ireland's Raidió Teilifís Éireann.
     */
    "rteRating": S.optionalWith(ContentRatingRteRating, { nullable: true }),
    /**
     * The video's National Film Registry of the Russian Federation (MKRF - Russia) rating.
     */
    "russiaRating": S.optionalWith(ContentRatingRussiaRating, { nullable: true }),
    /**
     * The video's rating in Slovakia.
     */
    "skfilmRating": S.optionalWith(ContentRatingSkfilmRating, { nullable: true }),
    /**
     * The video's rating in Iceland.
     */
    "smaisRating": S.optionalWith(ContentRatingSmaisRating, { nullable: true }),
    /**
     * The video's rating from Statens medieråd (Sweden's National Media Council).
     */
    "smsaRating": S.optionalWith(ContentRatingSmsaRating, { nullable: true }),
    /**
     * The video's TV Parental Guidelines (TVPG) rating.
     */
    "tvpgRating": S.optionalWith(ContentRatingTvpgRating, { nullable: true }),
    /**
     * A rating that YouTube uses to identify age-restricted content.
     */
    "ytRating": S.optionalWith(ContentRatingYtRating, { nullable: true })
}) {
}
/**
 * Rights management policy for YouTube resources.
 */
export class AccessPolicy extends S.Class("AccessPolicy")({
    /**
     * The value of allowed indicates whether the access to the policy is allowed or denied by default.
     */
    "allowed": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * A list of region codes that identify countries where the default policy do not apply.
     */
    "exception": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
/**
 * The value of definition indicates whether the video is available in high definition or only in standard definition.
 */
export class VideoContentDetailsDefinition extends S.Literal("sd", "hd") {
}
/**
 * Specifies the projection format of the video.
 */
export class VideoContentDetailsProjection extends S.Literal("rectangular", "360") {
}
/**
 * DEPRECATED Region restriction of the video.
 */
export class VideoContentDetailsRegionRestriction extends S.Class("VideoContentDetailsRegionRestriction")({
    /**
     * A list of region codes that identify countries where the video is viewable. If this property is present and a country is not listed in its value, then the video is blocked from appearing in that country. If this property is present and contains an empty list, the video is blocked in all countries.
     */
    "allowed": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * A list of region codes that identify countries where the video is blocked. If this property is present and a country is not listed in its value, then the video is viewable in that country. If this property is present and contains an empty list, the video is viewable in all countries.
     */
    "blocked": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
/**
 * Details about the content of a YouTube Video.
 */
export class VideoContentDetails extends S.Class("VideoContentDetails")({
    /**
     * The value of captions indicates whether the video has captions or not.
     */
    "caption": S.optionalWith(VideoContentDetailsCaption, { nullable: true }),
    /**
     * Specifies the ratings that the video received under various rating schemes.
     */
    "contentRating": S.optionalWith(ContentRating, { nullable: true }),
    /**
     * The countryRestriction object contains information about the countries where a video is (or is not) viewable.
     */
    "countryRestriction": S.optionalWith(AccessPolicy, { nullable: true }),
    /**
     * The value of definition indicates whether the video is available in high definition or only in standard definition.
     */
    "definition": S.optionalWith(VideoContentDetailsDefinition, { nullable: true }),
    /**
     * The value of dimension indicates whether the video is available in 3D or in 2D.
     */
    "dimension": S.optionalWith(S.String, { nullable: true }),
    /**
     * The length of the video. The tag value is an ISO 8601 duration in the format PT#M#S, in which the letters PT indicate that the value specifies a period of time, and the letters M and S refer to length in minutes and seconds, respectively. The # characters preceding the M and S letters are both integers that specify the number of minutes (or seconds) of the video. For example, a value of PT15M51S indicates that the video is 15 minutes and 51 seconds long.
     */
    "duration": S.optionalWith(S.String, { nullable: true }),
    /**
     * Indicates whether the video uploader has provided a custom thumbnail image for the video. This property is only visible to the video uploader.
     */
    "hasCustomThumbnail": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The value of is_license_content indicates whether the video is licensed content.
     */
    "licensedContent": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * Specifies the projection format of the video.
     */
    "projection": S.optionalWith(VideoContentDetailsProjection, { nullable: true }),
    /**
     * The regionRestriction object contains information about the countries where a video is (or is not) viewable. The object will contain either the contentDetails.regionRestriction.allowed property or the contentDetails.regionRestriction.blocked property.
     */
    "regionRestriction": S.optionalWith(VideoContentDetailsRegionRestriction, { nullable: true })
}) {
}
/**
 * Information about an audio stream.
 */
export class VideoFileDetailsAudioStream extends S.Class("VideoFileDetailsAudioStream")({
    /**
     * The audio stream's bitrate, in bits per second.
     */
    "bitrateBps": S.optionalWith(S.String, { nullable: true }),
    /**
     * The number of audio channels that the stream contains.
     */
    "channelCount": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The audio codec that the stream uses.
     */
    "codec": S.optionalWith(S.String, { nullable: true }),
    /**
     * A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.
     */
    "vendor": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The uploaded file's type as detected by YouTube's video processing engine. Currently, YouTube only processes video files, but this field is present whether a video file or another type of file was uploaded.
 */
export class VideoFileDetailsFileType extends S.Literal("video", "audio", "image", "archive", "document", "project", "other") {
}
/**
 * The amount that YouTube needs to rotate the original source content to properly display the video.
 */
export class VideoFileDetailsVideoStreamRotation extends S.Literal("none", "clockwise", "upsideDown", "counterClockwise", "other") {
}
/**
 * Information about a video stream.
 */
export class VideoFileDetailsVideoStream extends S.Class("VideoFileDetailsVideoStream")({
    /**
     * The video content's display aspect ratio, which specifies the aspect ratio in which the video should be displayed.
     */
    "aspectRatio": S.optionalWith(S.Number, { nullable: true }),
    /**
     * The video stream's bitrate, in bits per second.
     */
    "bitrateBps": S.optionalWith(S.String, { nullable: true }),
    /**
     * The video codec that the stream uses.
     */
    "codec": S.optionalWith(S.String, { nullable: true }),
    /**
     * The video stream's frame rate, in frames per second.
     */
    "frameRateFps": S.optionalWith(S.Number, { nullable: true }),
    /**
     * The encoded video content's height in pixels.
     */
    "heightPixels": S.optionalWith(S.Int, { nullable: true }),
    /**
     * The amount that YouTube needs to rotate the original source content to properly display the video.
     */
    "rotation": S.optionalWith(VideoFileDetailsVideoStreamRotation, { nullable: true }),
    /**
     * A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.
     */
    "vendor": S.optionalWith(S.String, { nullable: true }),
    /**
     * The encoded video content's width in pixels. You can calculate the video's encoding aspect ratio as width_pixels / height_pixels.
     */
    "widthPixels": S.optionalWith(S.Int, { nullable: true })
}) {
}
/**
 * Describes original video file properties, including technical details about audio and video streams, but also metadata information like content length, digitization time, or geotagging information.
 */
export class VideoFileDetails extends S.Class("VideoFileDetails")({
    /**
     * A list of audio streams contained in the uploaded video file. Each item in the list contains detailed metadata about an audio stream.
     */
    "audioStreams": S.optionalWith(S.Array(VideoFileDetailsAudioStream), { nullable: true }),
    /**
     * The uploaded video file's combined (video and audio) bitrate in bits per second.
     */
    "bitrateBps": S.optionalWith(S.String, { nullable: true }),
    /**
     * The uploaded video file's container format.
     */
    "container": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the uploaded video file was created. The value is specified in ISO 8601 format. Currently, the following ISO 8601 formats are supported: - Date only: YYYY-MM-DD - Naive time: YYYY-MM-DDTHH:MM:SS - Time with timezone: YYYY-MM-DDTHH:MM:SS+HH:MM
     */
    "creationTime": S.optionalWith(S.String, { nullable: true }),
    /**
     * The length of the uploaded video in milliseconds.
     */
    "durationMs": S.optionalWith(S.String, { nullable: true }),
    /**
     * The uploaded file's name. This field is present whether a video file or another type of file was uploaded.
     */
    "fileName": S.optionalWith(S.String, { nullable: true }),
    /**
     * The uploaded file's size in bytes. This field is present whether a video file or another type of file was uploaded.
     */
    "fileSize": S.optionalWith(S.String, { nullable: true }),
    /**
     * The uploaded file's type as detected by YouTube's video processing engine. Currently, YouTube only processes video files, but this field is present whether a video file or another type of file was uploaded.
     */
    "fileType": S.optionalWith(VideoFileDetailsFileType, { nullable: true }),
    /**
     * A list of video streams contained in the uploaded video file. Each item in the list contains detailed metadata about a video stream.
     */
    "videoStreams": S.optionalWith(S.Array(VideoFileDetailsVideoStream), { nullable: true })
}) {
}
/**
 * Details about the live streaming metadata.
 */
export class VideoLiveStreamingDetails extends S.Class("VideoLiveStreamingDetails")({
    /**
     * The ID of the currently active live chat attached to this video. This field is filled only if the video is a currently live broadcast that has live chat. Once the broadcast transitions to complete this field will be removed and the live chat closed down. For persistent broadcasts that live chat id will no longer be tied to this video but rather to the new video being displayed at the persistent page.
     */
    "activeLiveChatId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The time that the broadcast actually ended. This value will not be available until the broadcast is over.
     */
    "actualEndTime": S.optionalWith(S.String, { nullable: true }),
    /**
     * The time that the broadcast actually started. This value will not be available until the broadcast begins.
     */
    "actualStartTime": S.optionalWith(S.String, { nullable: true }),
    /**
     * The number of viewers currently watching the broadcast. The property and its value will be present if the broadcast has current viewers and the broadcast owner has not hidden the viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers for a broadcast when the broadcast ends. So, this property would not identify the number of viewers watching an archived video of a live broadcast that already ended.
     */
    "concurrentViewers": S.optionalWith(S.String, { nullable: true }),
    /**
     * The time that the broadcast is scheduled to end. If the value is empty or the property is not present, then the broadcast is scheduled to contiue indefinitely.
     */
    "scheduledEndTime": S.optionalWith(S.String, { nullable: true }),
    /**
     * The time that the broadcast is scheduled to begin.
     */
    "scheduledStartTime": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Details about monetization of a YouTube Video.
 */
export class VideoMonetizationDetails extends S.Class("VideoMonetizationDetails")({
    /**
     * The value of access indicates whether the video can be monetized or not.
     */
    "access": S.optionalWith(AccessPolicy, { nullable: true })
}) {
}
/**
 * Player to be used for a video playback.
 */
export class VideoPlayer extends S.Class("VideoPlayer")({
    "embedHeight": S.optionalWith(S.String, { nullable: true }),
    /**
     * An <iframe> tag that embeds a player that will play the video.
     */
    "embedHtml": S.optionalWith(S.String, { nullable: true }),
    /**
     * The embed width
     */
    "embedWidth": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The reason that YouTube failed to process the video. This property will only have a value if the processingStatus property's value is failed.
 */
export class VideoProcessingDetailsProcessingFailureReason extends S.Literal("uploadFailed", "transcodeFailed", "streamingFailed", "other") {
}
/**
 * Video processing progress and completion time estimate.
 */
export class VideoProcessingDetailsProcessingProgress extends S.Class("VideoProcessingDetailsProcessingProgress")({
    /**
     * The number of parts of the video that YouTube has already processed. You can estimate the percentage of the video that YouTube has already processed by calculating: 100 * parts_processed / parts_total Note that since the estimated number of parts could increase without a corresponding increase in the number of parts that have already been processed, it is possible that the calculated progress could periodically decrease while YouTube processes a video.
     */
    "partsProcessed": S.optionalWith(S.String, { nullable: true }),
    /**
     * An estimate of the total number of parts that need to be processed for the video. The number may be updated with more precise estimates while YouTube processes the video.
     */
    "partsTotal": S.optionalWith(S.String, { nullable: true }),
    /**
     * An estimate of the amount of time, in millseconds, that YouTube needs to finish processing the video.
     */
    "timeLeftMs": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * The video's processing status. This value indicates whether YouTube was able to process the video or if the video is still being processed.
 */
export class VideoProcessingDetailsProcessingStatus extends S.Literal("processing", "succeeded", "failed", "terminated") {
}
/**
 * Describes processing status and progress and availability of some other Video resource parts.
 */
export class VideoProcessingDetails extends S.Class("VideoProcessingDetails")({
    /**
     * This value indicates whether video editing suggestions, which might improve video quality or the playback experience, are available for the video. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    "editorSuggestionsAvailability": S.optionalWith(S.String, { nullable: true }),
    /**
     * This value indicates whether file details are available for the uploaded video. You can retrieve a video's file details by requesting the fileDetails part in your videos.list() request.
     */
    "fileDetailsAvailability": S.optionalWith(S.String, { nullable: true }),
    /**
     * The reason that YouTube failed to process the video. This property will only have a value if the processingStatus property's value is failed.
     */
    "processingFailureReason": S.optionalWith(VideoProcessingDetailsProcessingFailureReason, { nullable: true }),
    /**
     * This value indicates whether the video processing engine has generated suggestions that might improve YouTube's ability to process the the video, warnings that explain video processing problems, or errors that cause video processing problems. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    "processingIssuesAvailability": S.optionalWith(S.String, { nullable: true }),
    /**
     * The processingProgress object contains information about the progress YouTube has made in processing the video. The values are really only relevant if the video's processing status is processing.
     */
    "processingProgress": S.optionalWith(VideoProcessingDetailsProcessingProgress, { nullable: true }),
    /**
     * The video's processing status. This value indicates whether YouTube was able to process the video or if the video is still being processed.
     */
    "processingStatus": S.optionalWith(VideoProcessingDetailsProcessingStatus, { nullable: true }),
    /**
     * This value indicates whether keyword (tag) suggestions are available for the video. Tags can be added to a video's metadata to make it easier for other users to find the video. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
     */
    "tagSuggestionsAvailability": S.optionalWith(S.String, { nullable: true }),
    /**
     * This value indicates whether thumbnail images have been generated for the video.
     */
    "thumbnailsAvailability": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * DEPRECATED. b/157517979: This part was never populated after it was added. However, it sees non-zero traffic because there is generated client code in the wild that refers to it [1]. We keep this field and do NOT remove it because otherwise V3 would return an error when this part gets requested [2]. [1] https://developers.google.com/resources/api-libraries/documentation/youtube/v3/csharp/latest/classGoogle_1_1Apis_1_1YouTube_1_1v3_1_1Data_1_1VideoProjectDetails.html [2] http://google3/video/youtube/src/python/servers/data_api/common.py?l=1565-1569&rcl=344141677
 */
export class VideoProjectDetails extends S.Class("VideoProjectDetails")({}) {
}
/**
 * Geographical coordinates of a point, in WGS84.
 */
export class GeoPoint extends S.Class("GeoPoint")({
    /**
     * Altitude above the reference ellipsoid, in meters.
     */
    "altitude": S.optionalWith(S.Number, { nullable: true }),
    /**
     * Latitude in degrees.
     */
    "latitude": S.optionalWith(S.Number, { nullable: true }),
    /**
     * Longitude in degrees.
     */
    "longitude": S.optionalWith(S.Number, { nullable: true })
}) {
}
/**
 * Recording information associated with the video.
 */
export class VideoRecordingDetails extends S.Class("VideoRecordingDetails")({
    /**
     * The geolocation information associated with the video.
     */
    "location": S.optionalWith(GeoPoint, { nullable: true }),
    /**
     * The text description of the location where the video was recorded.
     */
    "locationDescription": S.optionalWith(S.String, { nullable: true }),
    /**
     * The date and time when the video was recorded.
     */
    "recordingDate": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Indicates if the video is an upcoming/active live broadcast. Or it's "none" if the video is not an upcoming/active live broadcast.
 */
export class VideoSnippetLiveBroadcastContent extends S.Literal("none", "upcoming", "live", "completed") {
}
/**
 * Localized versions of certain video properties (e.g. title).
 */
export class VideoLocalization extends S.Class("VideoLocalization")({
    /**
     * Localized version of the video's description.
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * Localized version of the video's title.
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Basic details about a video, including title, description, uploader, thumbnails and category.
 */
export class VideoSnippet extends S.Class("VideoSnippet")({
    /**
     * The YouTube video category associated with the video.
     */
    "categoryId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the channel that the video was uploaded to.
     */
    "channelId": S.optionalWith(S.String, { nullable: true }),
    /**
     * Channel title for the channel that the video belongs to.
     */
    "channelTitle": S.optionalWith(S.String, { nullable: true }),
    /**
     * The default_audio_language property specifies the language spoken in the video's default audio track.
     */
    "defaultAudioLanguage": S.optionalWith(S.String, { nullable: true }),
    /**
     * The language of the videos's default snippet.
     */
    "defaultLanguage": S.optionalWith(S.String, { nullable: true }),
    /**
     * The video's description. @mutable youtube.videos.insert youtube.videos.update
     */
    "description": S.optionalWith(S.String, { nullable: true }),
    /**
     * Indicates if the video is an upcoming/active live broadcast. Or it's "none" if the video is not an upcoming/active live broadcast.
     */
    "liveBroadcastContent": S.optionalWith(VideoSnippetLiveBroadcastContent, { nullable: true }),
    /**
     * Localized snippet selected with the hl parameter. If no such localization exists, this field is populated with the default snippet. (Read-only)
     */
    "localized": S.optionalWith(VideoLocalization, { nullable: true }),
    /**
     * The date and time when the video was uploaded.
     */
    "publishedAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of keyword tags associated with the video. Tags may contain spaces.
     */
    "tags": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
     */
    "thumbnails": S.optionalWith(ThumbnailDetails, { nullable: true }),
    /**
     * The video's title. @mutable youtube.videos.insert youtube.videos.update
     */
    "title": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Statistics about the video, such as the number of times the video was viewed or liked.
 */
export class VideoStatistics extends S.Class("VideoStatistics")({
    /**
     * The number of comments for the video.
     */
    "commentCount": S.optionalWith(S.String, { nullable: true }),
    /**
     * The number of users who have indicated that they disliked the video by giving it a negative rating.
     */
    "dislikeCount": S.optionalWith(S.String, { nullable: true }),
    /**
     * The number of users who currently have the video marked as a favorite video.
     */
    "favoriteCount": S.optionalWith(S.String, { nullable: true }),
    /**
     * The number of users who have indicated that they liked the video by giving it a positive rating.
     */
    "likeCount": S.optionalWith(S.String, { nullable: true }),
    /**
     * The number of times the video has been viewed.
     */
    "viewCount": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * This value explains why a video failed to upload. This property is only present if the uploadStatus property indicates that the upload failed.
 */
export class VideoStatusFailureReason extends S.Literal("conversion", "invalidFile", "emptyFile", "tooSmall", "codec", "uploadAborted") {
}
/**
 * The video's license. @mutable youtube.videos.insert youtube.videos.update
 */
export class VideoStatusLicense extends S.Literal("youtube", "creativeCommon") {
}
/**
 * The video's privacy status.
 */
export class VideoStatusPrivacyStatus extends S.Literal("public", "unlisted", "private") {
}
/**
 * This value explains why YouTube rejected an uploaded video. This property is only present if the uploadStatus property indicates that the upload was rejected.
 */
export class VideoStatusRejectionReason extends S.Literal("copyright", "inappropriate", "duplicate", "termsOfUse", "uploaderAccountSuspended", "length", "claim", "uploaderAccountClosed", "trademark", "legal") {
}
/**
 * The status of the uploaded video.
 */
export class VideoStatusUploadStatus extends S.Literal("uploaded", "processed", "failed", "rejected", "deleted") {
}
/**
 * Basic details about a video category, such as its localized title. Next Id: 18
 */
export class VideoStatus extends S.Class("VideoStatus")({
    /**
     * This value indicates if the video can be embedded on another website. @mutable youtube.videos.insert youtube.videos.update
     */
    "embeddable": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * This value explains why a video failed to upload. This property is only present if the uploadStatus property indicates that the upload failed.
     */
    "failureReason": S.optionalWith(VideoStatusFailureReason, { nullable: true }),
    /**
     * The video's license. @mutable youtube.videos.insert youtube.videos.update
     */
    "license": S.optionalWith(VideoStatusLicense, { nullable: true }),
    "madeForKids": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The video's privacy status.
     */
    "privacyStatus": S.optionalWith(VideoStatusPrivacyStatus, { nullable: true }),
    /**
     * This value indicates if the extended video statistics on the watch page can be viewed by everyone. Note that the view count, likes, etc will still be visible if this is disabled. @mutable youtube.videos.insert youtube.videos.update
     */
    "publicStatsViewable": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The date and time when the video is scheduled to publish. It can be set only if the privacy status of the video is private..
     */
    "publishAt": S.optionalWith(S.String, { nullable: true }),
    /**
     * This value explains why YouTube rejected an uploaded video. This property is only present if the uploadStatus property indicates that the upload was rejected.
     */
    "rejectionReason": S.optionalWith(VideoStatusRejectionReason, { nullable: true }),
    "selfDeclaredMadeForKids": S.optionalWith(S.Boolean, { nullable: true }),
    /**
     * The status of the uploaded video.
     */
    "uploadStatus": S.optionalWith(VideoStatusUploadStatus, { nullable: true })
}) {
}
/**
 * A single tag suggestion with it's relevance information.
 */
export class VideoSuggestionsTagSuggestion extends S.Class("VideoSuggestionsTagSuggestion")({
    /**
     * A set of video categories for which the tag is relevant. You can use this information to display appropriate tag suggestions based on the video category that the video uploader associates with the video. By default, tag suggestions are relevant for all categories if there are no restricts defined for the keyword.
     */
    "categoryRestricts": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * The keyword tag suggested for the video.
     */
    "tag": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Specifies suggestions on how to improve video content, including encoding hints, tag suggestions, and editor suggestions.
 */
export class VideoSuggestions extends S.Class("VideoSuggestions")({
    /**
     * A list of video editing operations that might improve the video quality or playback experience of the uploaded video.
     */
    "editorSuggestions": S.optionalWith(S.Array(S.Literal("videoAutoLevels", "videoStabilize", "videoCrop", "audioQuietAudioSwap")), { nullable: true }),
    /**
     * A list of errors that will prevent YouTube from successfully processing the uploaded video video. These errors indicate that, regardless of the video's current processing status, eventually, that status will almost certainly be failed.
     */
    "processingErrors": S.optionalWith(S.Array(S.Literal("audioFile", "imageFile", "projectFile", "notAVideoFile", "docFile", "archiveFile", "unsupportedSpatialAudioLayout")), { nullable: true }),
    /**
     * A list of suggestions that may improve YouTube's ability to process the video.
     */
    "processingHints": S.optionalWith(S.Array(S.Literal("nonStreamableMov", "sendBestQualityVideo", "sphericalVideo", "spatialAudio", "vrVideo", "hdrVideo")), { nullable: true }),
    /**
     * A list of reasons why YouTube may have difficulty transcoding the uploaded video or that might result in an erroneous transcoding. These warnings are generated before YouTube actually processes the uploaded video file. In addition, they identify issues that are unlikely to cause the video processing to fail but that might cause problems such as sync issues, video artifacts, or a missing audio track.
     */
    "processingWarnings": S.optionalWith(S.Array(S.Literal("unknownContainer", "unknownVideoCodec", "unknownAudioCodec", "inconsistentResolution", "hasEditlist", "problematicVideoCodec", "problematicAudioCodec", "unsupportedVrStereoMode", "unsupportedSphericalProjectionType", "unsupportedHdrPixelFormat", "unsupportedHdrColorMetadata", "problematicHdrLookupTable")), { nullable: true }),
    /**
     * A list of keyword tags that could be added to the video's metadata to increase the likelihood that users will locate your video when searching or browsing on YouTube.
     */
    "tagSuggestions": S.optionalWith(S.Array(VideoSuggestionsTagSuggestion), { nullable: true })
}) {
}
/**
 * Freebase topic information related to the video.
 */
export class VideoTopicDetails extends S.Class("VideoTopicDetails")({
    /**
     * Similar to topic_id, except that these topics are merely relevant to the video. These are topics that may be mentioned in, or appear in the video. You can retrieve information about each topic using Freebase Topic API.
     */
    "relevantTopicIds": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * A list of Wikipedia URLs that provide a high-level description of the video's content.
     */
    "topicCategories": S.optionalWith(S.Array(S.String), { nullable: true }),
    /**
     * A list of Freebase topic IDs that are centrally associated with the video. These are topics that are centrally featured in the video, and it can be said that the video is mainly about each of these. You can retrieve information about each topic using the < a href="http://wiki.freebase.com/wiki/Topic_API">Freebase Topic API.
     */
    "topicIds": S.optionalWith(S.Array(S.String), { nullable: true })
}) {
}
/**
 * A *video* resource represents a YouTube video.
 */
export class Video extends S.Class("Video")({
    /**
     * Age restriction details related to a video. This data can only be retrieved by the video owner.
     */
    "ageGating": S.optionalWith(VideoAgeGating, { nullable: true }),
    /**
     * The contentDetails object contains information about the video content, including the length of the video and its aspect ratio.
     */
    "contentDetails": S.optionalWith(VideoContentDetails, { nullable: true }),
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * The fileDetails object encapsulates information about the video file that was uploaded to YouTube, including the file's resolution, duration, audio and video codecs, stream bitrates, and more. This data can only be retrieved by the video owner.
     */
    "fileDetails": S.optionalWith(VideoFileDetails, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    "id": S.optionalWith(S.String, { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#video".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#video" }),
    /**
     * The liveStreamingDetails object contains metadata about a live video broadcast. The object will only be present in a video resource if the video is an upcoming, live, or completed live broadcast.
     */
    "liveStreamingDetails": S.optionalWith(VideoLiveStreamingDetails, { nullable: true }),
    /**
     * The localizations object contains localized versions of the basic details about the video, such as its title and description.
     */
    "localizations": S.optionalWith(S.Record({ key: S.String, value: S.Unknown }), { nullable: true }),
    /**
     * The monetizationDetails object encapsulates information about the monetization status of the video.
     */
    "monetizationDetails": S.optionalWith(VideoMonetizationDetails, { nullable: true }),
    /**
     * The player object contains information that you would use to play the video in an embedded player.
     */
    "player": S.optionalWith(VideoPlayer, { nullable: true }),
    /**
     * The processingDetails object encapsulates information about YouTube's progress in processing the uploaded video file. The properties in the object identify the current processing status and an estimate of the time remaining until YouTube finishes processing the video. This part also indicates whether different types of data or content, such as file details or thumbnail images, are available for the video. The processingProgress object is designed to be polled so that the video uploaded can track the progress that YouTube has made in processing the uploaded video file. This data can only be retrieved by the video owner.
     */
    "processingDetails": S.optionalWith(VideoProcessingDetails, { nullable: true }),
    /**
     * The projectDetails object contains information about the project specific video metadata. b/157517979: This part was never populated after it was added. However, it sees non-zero traffic because there is generated client code in the wild that refers to it [1]. We keep this field and do NOT remove it because otherwise V3 would return an error when this part gets requested [2]. [1] https://developers.google.com/resources/api-libraries/documentation/youtube/v3/csharp/latest/classGoogle_1_1Apis_1_1YouTube_1_1v3_1_1Data_1_1VideoProjectDetails.html [2] http://google3/video/youtube/src/python/servers/data_api/common.py?l=1565-1569&rcl=344141677
     */
    "projectDetails": S.optionalWith(VideoProjectDetails, { nullable: true }),
    /**
     * The recordingDetails object encapsulates information about the location, date and address where the video was recorded.
     */
    "recordingDetails": S.optionalWith(VideoRecordingDetails, { nullable: true }),
    /**
     * The snippet object contains basic details about the video, such as its title, description, and category.
     */
    "snippet": S.optionalWith(VideoSnippet, { nullable: true }),
    /**
     * The statistics object contains statistics about the video.
     */
    "statistics": S.optionalWith(VideoStatistics, { nullable: true }),
    /**
     * The status object contains information about the video's uploading, processing, and privacy statuses.
     */
    "status": S.optionalWith(VideoStatus, { nullable: true }),
    /**
     * The suggestions object encapsulates suggestions that identify opportunities to improve the video quality or the metadata for the uploaded video. This data can only be retrieved by the video owner.
     */
    "suggestions": S.optionalWith(VideoSuggestions, { nullable: true }),
    /**
     * The topicDetails object encapsulates information about Freebase topics associated with the video.
     */
    "topicDetails": S.optionalWith(VideoTopicDetails, { nullable: true })
}) {
}
export class VideoListResponse extends S.Class("VideoListResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    "items": S.optionalWith(S.Array(Video), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoListResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#videoListResponse" }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
     */
    "nextPageToken": S.optionalWith(S.String, { nullable: true }),
    /**
     * General pagination information.
     */
    "pageInfo": S.optionalWith(PageInfo, { nullable: true }),
    /**
     * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
     */
    "prevPageToken": S.optionalWith(S.String, { nullable: true }),
    "tokenPagination": S.optionalWith(TokenPagination, { nullable: true }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeVideosUpdateParams extends S.Struct({
    "part": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeVideosInsertParams extends S.Struct({
    "part": S.Array(S.String),
    "autoLevels": S.optionalWith(S.Boolean, { nullable: true }),
    "notifySubscribers": S.optionalWith(S.Boolean, { nullable: true }),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true }),
    "onBehalfOfContentOwnerChannel": S.optionalWith(S.String, { nullable: true }),
    "stabilize": S.optionalWith(S.Boolean, { nullable: true })
}) {
}
export class YoutubeVideosDeleteParams extends S.Struct({
    "id": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeVideosGetRatingParams extends S.Struct({
    "id": S.Array(S.String),
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
/**
 * Rating of a video.
 */
export class VideoRatingRating extends S.Literal("none", "like", "dislike") {
}
/**
 * Basic details about rating of a video.
 */
export class VideoRating extends S.Class("VideoRating")({
    /**
     * Rating of a video.
     */
    "rating": S.optionalWith(VideoRatingRating, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class VideoGetRatingResponse extends S.Class("VideoGetRatingResponse")({
    /**
     * Etag of this resource.
     */
    "etag": S.optionalWith(S.String, { nullable: true }),
    /**
     * Serialized EventId of the request which produced this response.
     */
    "eventId": S.optionalWith(S.String, { nullable: true }),
    /**
     * A list of ratings that match the request criteria.
     */
    "items": S.optionalWith(S.Array(VideoRating), { nullable: true }),
    /**
     * Identifies what kind of resource this is. Value: the fixed string "youtube#videoGetRatingResponse".
     */
    "kind": S.optionalWith(S.String, { nullable: true, default: () => "youtube#videoGetRatingResponse" }),
    /**
     * The visitorId identifies the visitor.
     */
    "visitorId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeVideosRateParamsRating extends S.Literal("none", "like", "dislike") {
}
export class YoutubeVideosRateParams extends S.Struct({
    "id": S.String,
    "rating": YoutubeVideosRateParamsRating
}) {
}
export class YoutubeVideosReportAbuseParams extends S.Struct({
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class VideoAbuseReport extends S.Class("VideoAbuseReport")({
    /**
     * Additional comments regarding the abuse report.
     */
    "comments": S.optionalWith(S.String, { nullable: true }),
    /**
     * The language that the content was viewed in.
     */
    "language": S.optionalWith(S.String, { nullable: true }),
    /**
     * The high-level, or primary, reason that the content is abusive. The value is an abuse report reason ID.
     */
    "reasonId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The specific, or secondary, reason that this content is abusive (if available). The value is an abuse report reason ID that is a valid secondary reason for the primary reason.
     */
    "secondaryReasonId": S.optionalWith(S.String, { nullable: true }),
    /**
     * The ID that YouTube uses to uniquely identify the video.
     */
    "videoId": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeWatermarksSetParams extends S.Struct({
    "channelId": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export class YoutubeWatermarksUnsetParams extends S.Struct({
    "channelId": S.String,
    "onBehalfOfContentOwner": S.optionalWith(S.String, { nullable: true })
}) {
}
export const make = (httpClient, options = {}) => {
    const unexpectedStatus = (response) => Effect.flatMap(Effect.orElseSucceed(response.json, () => "Unexpected status code"), (description) => Effect.fail(new HttpClientError.ResponseError({
        request: response.request,
        response,
        reason: "StatusCode",
        description: typeof description === "string" ? description : JSON.stringify(description)
    })));
    const withResponse = options.transformClient
        ? (f) => (request) => Effect.flatMap(Effect.flatMap(options.transformClient(httpClient), (client) => client.execute(request)), f)
        : (f) => (request) => Effect.flatMap(httpClient.execute(request), f);
    const decodeSuccess = (schema) => (response) => HttpClientResponse.schemaBodyJson(schema)(response);
    const decodeError = (tag, schema) => (response) => Effect.flatMap(HttpClientResponse.schemaBodyJson(schema)(response), (cause) => Effect.fail(ClientError(tag, cause, response)));
    return {
        httpClient,
        "youtubeAbuseReportsInsert": (options) => HttpClientRequest.post(`/youtube/v3/abuseReports`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(AbuseReport),
            orElse: unexpectedStatus
        }))),
        "youtubeActivitiesList": (options) => HttpClientRequest.get(`/youtube/v3/activities`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "channelId": options?.["channelId"],
            "home": options?.["home"],
            "maxResults": options?.["maxResults"],
            "mine": options?.["mine"],
            "pageToken": options?.["pageToken"],
            "publishedAfter": options?.["publishedAfter"],
            "publishedBefore": options?.["publishedBefore"],
            "regionCode": options?.["regionCode"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ActivityListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeCaptionsList": (options) => HttpClientRequest.get(`/youtube/v3/captions`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "videoId": options?.["videoId"],
            "id": options?.["id"],
            "onBehalfOf": options?.["onBehalfOf"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CaptionListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeCaptionsUpdate": (options) => HttpClientRequest.put(`/youtube/v3/captions`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "onBehalfOf": options?.["onBehalfOf"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "sync": options?.["sync"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Caption),
            orElse: unexpectedStatus
        }))),
        "youtubeCaptionsInsert": (options) => HttpClientRequest.post(`/youtube/v3/captions`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "onBehalfOf": options?.["onBehalfOf"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "sync": options?.["sync"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Caption),
            orElse: unexpectedStatus
        }))),
        "youtubeCaptionsDelete": (options) => HttpClientRequest.del(`/youtube/v3/captions`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "onBehalfOf": options?.["onBehalfOf"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeCaptionsDownload": (id, options) => HttpClientRequest.get(`/youtube/v3/captions/${id}`).pipe(HttpClientRequest.setUrlParams({
            "onBehalfOf": options?.["onBehalfOf"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "tfmt": options?.["tfmt"],
            "tlang": options?.["tlang"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeChannelBannersInsert": (options) => HttpClientRequest.post(`/youtube/v3/channelBanners/insert`).pipe(HttpClientRequest.setUrlParams({
            "channelId": options?.["channelId"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ChannelBannerResource),
            orElse: unexpectedStatus
        }))),
        "youtubeChannelSectionsList": (options) => HttpClientRequest.get(`/youtube/v3/channelSections`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "channelId": options?.["channelId"],
            "hl": options?.["hl"],
            "id": options?.["id"],
            "mine": options?.["mine"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ChannelSectionListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeChannelSectionsUpdate": (options) => HttpClientRequest.put(`/youtube/v3/channelSections`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ChannelSection),
            orElse: unexpectedStatus
        }))),
        "youtubeChannelSectionsInsert": (options) => HttpClientRequest.post(`/youtube/v3/channelSections`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options.params?.["onBehalfOfContentOwnerChannel"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ChannelSection),
            orElse: unexpectedStatus
        }))),
        "youtubeChannelSectionsDelete": (options) => HttpClientRequest.del(`/youtube/v3/channelSections`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeChannelsList": (options) => HttpClientRequest.get(`/youtube/v3/channels`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "categoryId": options?.["categoryId"],
            "forUsername": options?.["forUsername"],
            "hl": options?.["hl"],
            "id": options?.["id"],
            "managedByMe": options?.["managedByMe"],
            "maxResults": options?.["maxResults"],
            "mine": options?.["mine"],
            "mySubscribers": options?.["mySubscribers"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "pageToken": options?.["pageToken"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ChannelListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeChannelsUpdate": (options) => HttpClientRequest.put(`/youtube/v3/channels`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Channel),
            orElse: unexpectedStatus
        }))),
        "youtubeCommentThreadsList": (options) => HttpClientRequest.get(`/youtube/v3/commentThreads`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "allThreadsRelatedToChannelId": options?.["allThreadsRelatedToChannelId"],
            "channelId": options?.["channelId"],
            "id": options?.["id"],
            "maxResults": options?.["maxResults"],
            "moderationStatus": options?.["moderationStatus"],
            "order": options?.["order"],
            "pageToken": options?.["pageToken"],
            "searchTerms": options?.["searchTerms"],
            "textFormat": options?.["textFormat"],
            "videoId": options?.["videoId"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CommentThreadListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeYoutubeV3UpdateCommentThreads": (options) => HttpClientRequest.put(`/youtube/v3/commentThreads`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CommentThread),
            orElse: unexpectedStatus
        }))),
        "youtubeCommentThreadsInsert": (options) => HttpClientRequest.post(`/youtube/v3/commentThreads`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CommentThread),
            orElse: unexpectedStatus
        }))),
        "youtubeCommentsList": (options) => HttpClientRequest.get(`/youtube/v3/comments`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "id": options?.["id"],
            "maxResults": options?.["maxResults"],
            "pageToken": options?.["pageToken"],
            "parentId": options?.["parentId"],
            "textFormat": options?.["textFormat"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CommentListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeCommentsUpdate": (options) => HttpClientRequest.put(`/youtube/v3/comments`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Comment),
            orElse: unexpectedStatus
        }))),
        "youtubeCommentsInsert": (options) => HttpClientRequest.post(`/youtube/v3/comments`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Comment),
            orElse: unexpectedStatus
        }))),
        "youtubeCommentsDelete": (options) => HttpClientRequest.del(`/youtube/v3/comments`).pipe(HttpClientRequest.setUrlParams({ "id": options?.["id"] }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeCommentsMarkAsSpam": (options) => HttpClientRequest.post(`/youtube/v3/comments/markAsSpam`).pipe(HttpClientRequest.setUrlParams({ "id": options?.["id"] }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeCommentsSetModerationStatus": (options) => HttpClientRequest.post(`/youtube/v3/comments/setModerationStatus`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "moderationStatus": options?.["moderationStatus"],
            "banAuthor": options?.["banAuthor"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeI18NLanguagesList": (options) => HttpClientRequest.get(`/youtube/v3/i18nLanguages`).pipe(HttpClientRequest.setUrlParams({ "part": options?.["part"], "hl": options?.["hl"] }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(I18NLanguageListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeI18NRegionsList": (options) => HttpClientRequest.get(`/youtube/v3/i18nRegions`).pipe(HttpClientRequest.setUrlParams({ "part": options?.["part"], "hl": options?.["hl"] }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(I18NRegionListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveBroadcastsList": (options) => HttpClientRequest.get(`/youtube/v3/liveBroadcasts`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "broadcastStatus": options?.["broadcastStatus"],
            "broadcastType": options?.["broadcastType"],
            "id": options?.["id"],
            "maxResults": options?.["maxResults"],
            "mine": options?.["mine"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"],
            "pageToken": options?.["pageToken"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveBroadcastListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveBroadcastsUpdate": (options) => HttpClientRequest.put(`/youtube/v3/liveBroadcasts`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options.params?.["onBehalfOfContentOwnerChannel"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveBroadcast),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveBroadcastsInsert": (options) => HttpClientRequest.post(`/youtube/v3/liveBroadcasts`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options.params?.["onBehalfOfContentOwnerChannel"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveBroadcast),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveBroadcastsDelete": (options) => HttpClientRequest.del(`/youtube/v3/liveBroadcasts`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeLiveBroadcastsBind": (options) => HttpClientRequest.post(`/youtube/v3/liveBroadcasts/bind`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "part": options?.["part"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"],
            "streamId": options?.["streamId"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveBroadcast),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveBroadcastsInsertCuepoint": (options) => HttpClientRequest.post(`/youtube/v3/liveBroadcasts/cuepoint`).pipe(HttpClientRequest.setUrlParams({
            "id": options.params?.["id"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options.params?.["onBehalfOfContentOwnerChannel"],
            "part": options.params?.["part"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Cuepoint),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveBroadcastsTransition": (options) => HttpClientRequest.post(`/youtube/v3/liveBroadcasts/transition`).pipe(HttpClientRequest.setUrlParams({
            "broadcastStatus": options?.["broadcastStatus"],
            "id": options?.["id"],
            "part": options?.["part"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveBroadcast),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveChatBansInsert": (options) => HttpClientRequest.post(`/youtube/v3/liveChat/bans`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveChatBan),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveChatBansDelete": (options) => HttpClientRequest.del(`/youtube/v3/liveChat/bans`).pipe(HttpClientRequest.setUrlParams({ "id": options?.["id"] }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeLiveChatMessagesList": (options) => HttpClientRequest.get(`/youtube/v3/liveChat/messages`).pipe(HttpClientRequest.setUrlParams({
            "liveChatId": options?.["liveChatId"],
            "part": options?.["part"],
            "hl": options?.["hl"],
            "maxResults": options?.["maxResults"],
            "pageToken": options?.["pageToken"],
            "profileImageSize": options?.["profileImageSize"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveChatMessageListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveChatMessagesInsert": (options) => HttpClientRequest.post(`/youtube/v3/liveChat/messages`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveChatMessage),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveChatMessagesDelete": (options) => HttpClientRequest.del(`/youtube/v3/liveChat/messages`).pipe(HttpClientRequest.setUrlParams({ "id": options?.["id"] }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeLiveChatModeratorsList": (options) => HttpClientRequest.get(`/youtube/v3/liveChat/moderators`).pipe(HttpClientRequest.setUrlParams({
            "liveChatId": options?.["liveChatId"],
            "part": options?.["part"],
            "maxResults": options?.["maxResults"],
            "pageToken": options?.["pageToken"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveChatModeratorListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveChatModeratorsInsert": (options) => HttpClientRequest.post(`/youtube/v3/liveChat/moderators`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveChatModerator),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveChatModeratorsDelete": (options) => HttpClientRequest.del(`/youtube/v3/liveChat/moderators`).pipe(HttpClientRequest.setUrlParams({ "id": options?.["id"] }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeLiveStreamsList": (options) => HttpClientRequest.get(`/youtube/v3/liveStreams`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "id": options?.["id"],
            "maxResults": options?.["maxResults"],
            "mine": options?.["mine"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"],
            "pageToken": options?.["pageToken"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveStreamListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveStreamsUpdate": (options) => HttpClientRequest.put(`/youtube/v3/liveStreams`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options.params?.["onBehalfOfContentOwnerChannel"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveStream),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveStreamsInsert": (options) => HttpClientRequest.post(`/youtube/v3/liveStreams`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options.params?.["onBehalfOfContentOwnerChannel"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LiveStream),
            orElse: unexpectedStatus
        }))),
        "youtubeLiveStreamsDelete": (options) => HttpClientRequest.del(`/youtube/v3/liveStreams`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeMembersList": (options) => HttpClientRequest.get(`/youtube/v3/members`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "filterByMemberChannelId": options?.["filterByMemberChannelId"],
            "hasAccessToLevel": options?.["hasAccessToLevel"],
            "maxResults": options?.["maxResults"],
            "mode": options?.["mode"],
            "pageToken": options?.["pageToken"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(MemberListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeMembershipsLevelsList": (options) => HttpClientRequest.get(`/youtube/v3/membershipsLevels`).pipe(HttpClientRequest.setUrlParams({ "part": options?.["part"] }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(MembershipsLevelListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubePlaylistItemsList": (options) => HttpClientRequest.get(`/youtube/v3/playlistItems`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "id": options?.["id"],
            "maxResults": options?.["maxResults"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "pageToken": options?.["pageToken"],
            "playlistId": options?.["playlistId"],
            "videoId": options?.["videoId"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(PlaylistItemListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubePlaylistItemsUpdate": (options) => HttpClientRequest.put(`/youtube/v3/playlistItems`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(PlaylistItem),
            orElse: unexpectedStatus
        }))),
        "youtubePlaylistItemsInsert": (options) => HttpClientRequest.post(`/youtube/v3/playlistItems`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(PlaylistItem),
            orElse: unexpectedStatus
        }))),
        "youtubePlaylistItemsDelete": (options) => HttpClientRequest.del(`/youtube/v3/playlistItems`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubePlaylistsList": (options) => HttpClientRequest.get(`/youtube/v3/playlists`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "channelId": options?.["channelId"],
            "hl": options?.["hl"],
            "id": options?.["id"],
            "maxResults": options?.["maxResults"],
            "mine": options?.["mine"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"],
            "pageToken": options?.["pageToken"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(PlaylistListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubePlaylistsUpdate": (options) => HttpClientRequest.put(`/youtube/v3/playlists`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Playlist),
            orElse: unexpectedStatus
        }))),
        "youtubePlaylistsInsert": (options) => HttpClientRequest.post(`/youtube/v3/playlists`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options.params?.["onBehalfOfContentOwnerChannel"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Playlist),
            orElse: unexpectedStatus
        }))),
        "youtubePlaylistsDelete": (options) => HttpClientRequest.del(`/youtube/v3/playlists`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeSearchList": (options) => HttpClientRequest.get(`/youtube/v3/search`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "channelId": options?.["channelId"],
            "channelType": options?.["channelType"],
            "eventType": options?.["eventType"],
            "forContentOwner": options?.["forContentOwner"],
            "forDeveloper": options?.["forDeveloper"],
            "forMine": options?.["forMine"],
            "location": options?.["location"],
            "locationRadius": options?.["locationRadius"],
            "maxResults": options?.["maxResults"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "order": options?.["order"],
            "pageToken": options?.["pageToken"],
            "publishedAfter": options?.["publishedAfter"],
            "publishedBefore": options?.["publishedBefore"],
            "q": options?.["q"],
            "regionCode": options?.["regionCode"],
            "relatedToVideoId": options?.["relatedToVideoId"],
            "relevanceLanguage": options?.["relevanceLanguage"],
            "safeSearch": options?.["safeSearch"],
            "topicId": options?.["topicId"],
            "type": options?.["type"],
            "videoCaption": options?.["videoCaption"],
            "videoCategoryId": options?.["videoCategoryId"],
            "videoDefinition": options?.["videoDefinition"],
            "videoDimension": options?.["videoDimension"],
            "videoDuration": options?.["videoDuration"],
            "videoEmbeddable": options?.["videoEmbeddable"],
            "videoLicense": options?.["videoLicense"],
            "videoSyndicated": options?.["videoSyndicated"],
            "videoType": options?.["videoType"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SearchListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeSubscriptionsList": (options) => HttpClientRequest.get(`/youtube/v3/subscriptions`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "channelId": options?.["channelId"],
            "forChannelId": options?.["forChannelId"],
            "id": options?.["id"],
            "maxResults": options?.["maxResults"],
            "mine": options?.["mine"],
            "myRecentSubscribers": options?.["myRecentSubscribers"],
            "mySubscribers": options?.["mySubscribers"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"],
            "order": options?.["order"],
            "pageToken": options?.["pageToken"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SubscriptionListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeSubscriptionsInsert": (options) => HttpClientRequest.post(`/youtube/v3/subscriptions`).pipe(HttpClientRequest.setUrlParams({ "part": options.params?.["part"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Subscription),
            orElse: unexpectedStatus
        }))),
        "youtubeSubscriptionsDelete": (options) => HttpClientRequest.del(`/youtube/v3/subscriptions`).pipe(HttpClientRequest.setUrlParams({ "id": options?.["id"] }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeSuperChatEventsList": (options) => HttpClientRequest.get(`/youtube/v3/superChatEvents`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "hl": options?.["hl"],
            "maxResults": options?.["maxResults"],
            "pageToken": options?.["pageToken"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SuperChatEventListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeTestsInsert": (options) => HttpClientRequest.post(`/youtube/v3/tests`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "externalChannelId": options.params?.["externalChannelId"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(TestItem),
            orElse: unexpectedStatus
        }))),
        "youtubeThirdPartyLinksList": (options) => HttpClientRequest.get(`/youtube/v3/thirdPartyLinks`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "externalChannelId": options?.["externalChannelId"],
            "linkingToken": options?.["linkingToken"],
            "type": options?.["type"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ThirdPartyLinkListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeThirdPartyLinksUpdate": (options) => HttpClientRequest.put(`/youtube/v3/thirdPartyLinks`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "externalChannelId": options.params?.["externalChannelId"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ThirdPartyLink),
            orElse: unexpectedStatus
        }))),
        "youtubeThirdPartyLinksInsert": (options) => HttpClientRequest.post(`/youtube/v3/thirdPartyLinks`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "externalChannelId": options.params?.["externalChannelId"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ThirdPartyLink),
            orElse: unexpectedStatus
        }))),
        "youtubeThirdPartyLinksDelete": (options) => HttpClientRequest.del(`/youtube/v3/thirdPartyLinks`).pipe(HttpClientRequest.setUrlParams({
            "linkingToken": options?.["linkingToken"],
            "type": options?.["type"],
            "externalChannelId": options?.["externalChannelId"],
            "part": options?.["part"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeThumbnailsSet": (options) => HttpClientRequest.post(`/youtube/v3/thumbnails/set`).pipe(HttpClientRequest.setUrlParams({
            "videoId": options?.["videoId"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ThumbnailSetResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeVideoAbuseReportReasonsList": (options) => HttpClientRequest.get(`/youtube/v3/videoAbuseReportReasons`).pipe(HttpClientRequest.setUrlParams({ "part": options?.["part"], "hl": options?.["hl"] }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(VideoAbuseReportReasonListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeVideoCategoriesList": (options) => HttpClientRequest.get(`/youtube/v3/videoCategories`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "hl": options?.["hl"],
            "id": options?.["id"],
            "regionCode": options?.["regionCode"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(VideoCategoryListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeVideosList": (options) => HttpClientRequest.get(`/youtube/v3/videos`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "chart": options?.["chart"],
            "hl": options?.["hl"],
            "id": options?.["id"],
            "locale": options?.["locale"],
            "maxHeight": options?.["maxHeight"],
            "maxResults": options?.["maxResults"],
            "maxWidth": options?.["maxWidth"],
            "myRating": options?.["myRating"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "pageToken": options?.["pageToken"],
            "regionCode": options?.["regionCode"],
            "videoCategoryId": options?.["videoCategoryId"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(VideoListResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeVideosUpdate": (options) => HttpClientRequest.put(`/youtube/v3/videos`).pipe(HttpClientRequest.setUrlParams({
            "part": options.params?.["part"],
            "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"]
        }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Video),
            orElse: unexpectedStatus
        }))),
        "youtubeVideosInsert": (options) => HttpClientRequest.post(`/youtube/v3/videos`).pipe(HttpClientRequest.setUrlParams({
            "part": options?.["part"],
            "autoLevels": options?.["autoLevels"],
            "notifySubscribers": options?.["notifySubscribers"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"],
            "onBehalfOfContentOwnerChannel": options?.["onBehalfOfContentOwnerChannel"],
            "stabilize": options?.["stabilize"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(Video),
            orElse: unexpectedStatus
        }))),
        "youtubeVideosDelete": (options) => HttpClientRequest.del(`/youtube/v3/videos`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeVideosGetRating": (options) => HttpClientRequest.get(`/youtube/v3/videos/getRating`).pipe(HttpClientRequest.setUrlParams({
            "id": options?.["id"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(VideoGetRatingResponse),
            orElse: unexpectedStatus
        }))),
        "youtubeVideosRate": (options) => HttpClientRequest.post(`/youtube/v3/videos/rate`).pipe(HttpClientRequest.setUrlParams({ "id": options?.["id"], "rating": options?.["rating"] }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeVideosReportAbuse": (options) => HttpClientRequest.post(`/youtube/v3/videos/reportAbuse`).pipe(HttpClientRequest.setUrlParams({ "onBehalfOfContentOwner": options.params?.["onBehalfOfContentOwner"] }), HttpClientRequest.bodyUnsafeJson(options.payload), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeWatermarksSet": (options) => HttpClientRequest.post(`/youtube/v3/watermarks/set`).pipe(HttpClientRequest.setUrlParams({
            "channelId": options?.["channelId"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        }))),
        "youtubeWatermarksUnset": (options) => HttpClientRequest.post(`/youtube/v3/watermarks/unset`).pipe(HttpClientRequest.setUrlParams({
            "channelId": options?.["channelId"],
            "onBehalfOfContentOwner": options?.["onBehalfOfContentOwner"]
        }), withResponse(HttpClientResponse.matchStatus({
            "200": () => Effect.void,
            orElse: unexpectedStatus
        })))
    };
};
class ClientErrorImpl extends Data.Error {
}
export const ClientError = (tag, cause, response) => new ClientErrorImpl({
    _tag: tag,
    cause,
    response,
    request: response.request
});
//# sourceMappingURL=youtube_client.js.map
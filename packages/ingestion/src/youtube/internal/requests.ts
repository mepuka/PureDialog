import { HttpClientRequest } from "@effect/platform"
import type { YouTubeChannelId as ChannelId, YouTubeVideoId as VideoId } from "@puredialog/domain"
import type { YoutubeConfigInterface } from "../config.js"

export const makeApiRequest = (
  endpoint: string,
  params: Record<string, string>,
  config: YoutubeConfigInterface
) =>
  HttpClientRequest.get(`${config.baseUrl}/${endpoint}`).pipe(
    HttpClientRequest.setHeaders({
      Accept: "application/json",
      "User-Agent": "PureDialog-YouTube-Client/1.0",
      Authorization: `Bearer ${config.apiKey}`
    }),
    HttpClientRequest.appendUrlParams(params)
  )

export const makeVideoRequest = (ids: Array<VideoId>, config: YoutubeConfigInterface) =>
  makeApiRequest(
    "videos",
    {
      part: "snippet,contentDetails,status,statistics",
      id: ids.join(",")
    },
    config
  )

export const makeChannelRequest = (ids: Array<ChannelId>, config: YoutubeConfigInterface) =>
  makeApiRequest(
    "channels",
    {
      part: "snippet,contentDetails,statistics,status",
      id: ids.join(",")
    },
    config
  )

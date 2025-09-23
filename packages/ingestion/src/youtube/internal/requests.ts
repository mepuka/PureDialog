import { HttpClientRequest } from "@effect/platform";
import { YoutubeConfigInterface } from "../config.js";
import { ChannelId, VideoId } from "../resources.js";

export const makeApiRequest = (
  endpoint: string,
  params: Record<string, string>,
  config: YoutubeConfigInterface,
) =>
  HttpClientRequest.get(`${config.baseUrl}/${endpoint}`).pipe(
    HttpClientRequest.setHeaders({
      Accept: "application/json",
      "User-Agent": "PureDialog-YouTube-Client/1.0",
    }),
    HttpClientRequest.appendUrlParam("key", config.apiKey),
    HttpClientRequest.appendUrlParams(params),
  );

export const makeVideoRequest = (ids: VideoId[], config: YoutubeConfigInterface) =>
  makeApiRequest(
    "videos",
    {
      part: "snippet,contentDetails,status,statistics",
      id: ids.join(","),
    },
    config,
  );

export const makeChannelRequest = (ids: ChannelId[], config: YoutubeConfigInterface) =>
  makeApiRequest(
    "channels",
    {
      part: "snippet,contentDetails,statistics,status",
      id: ids.join(","),
    },
    config,
  );

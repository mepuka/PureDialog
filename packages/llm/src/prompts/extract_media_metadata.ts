import { LanguageModel } from "@effect/ai";
import { GoogleLanguageModel } from "@effect/ai-google";
import { MediaMetadata, YouTubeChannel, YouTubeVideo } from "@puredialog/domain";
import { Effect, Schema } from "effect";

// Focus on speaker identification for 1-on-1 podcasts
const PodcastSpeakerMetadata = MediaMetadata.pipe(
  Schema.pick(
    "summary",
    "speakers",
    "organization",
  ),
);
type PodcastSpeakerMetadata = Schema.Schema.Type<typeof PodcastSpeakerMetadata>;

const createPodcastSpeakerPrompt = (video: YouTubeVideo, host: string, channel?: YouTubeChannel): string => {
  const channelInfo = channel ? `Channel: ${channel.title}\n` : "";

  return `Extract speaker info from this 1-on-1 podcast interview.

${channelInfo}Title: ${video.title}
Description: ${video.description ?? "Not available"}
Host: ${host}

Identify the guest speaker and provide:
- Guest name and role/title, affiliations, any biographical material 
- Any organization mentioned
- Brief summary of the discussion topic`;
};

export const extractPodcastSpeakersFromYouTube = (
  video: YouTubeVideo,
  host: string,
  channel?: YouTubeChannel,
): Effect.Effect<PodcastSpeakerMetadata, unknown, LanguageModel.LanguageModel> =>
  Effect.gen(function*() {
    const prompt = createPodcastSpeakerPrompt(video, host, channel);

    const result = yield* LanguageModel.generateObject({
      prompt,
      schema: PodcastSpeakerMetadata,
    });

    return result.value;
  });

// Example usage with Google Gemini model
export const createGooglePodcastExtractor = () => {
  const model = GoogleLanguageModel.model("gemini-1.5-flash");

  return (video: YouTubeVideo, host: string, channel?: YouTubeChannel) =>
    extractPodcastSpeakersFromYouTube(video, host, channel).pipe(
      Effect.provide(model),
    );
};

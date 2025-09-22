/**
 * Extracts all valid YouTube video URLs from a given string of text.
 * Handles various URL formats (e.g., youtube.com/watch, youtu.be, /embed/).
 * @param text The text to search for YouTube links.
 * @returns An array of unique YouTube video URLs.
 */
export const extractYouTubeLinks = (text: string): string[] => {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
  const matches = text.match(youtubeRegex);

  if (!matches) {
    return [];
  }

  // Use a Set to store unique URLs to avoid duplicates
  const uniqueLinks = new Set<string>();

  for (const match of matches) {
    // Reconstruct a clean, standard URL format
    const videoIdMatch = match.match(/([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      uniqueLinks.add(`https://www.youtube.com/watch?v=${videoIdMatch[1]}`);
    }
  }

  return Array.from(uniqueLinks);
};

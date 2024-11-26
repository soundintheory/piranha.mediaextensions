using SoundInTheory.Piranha.MediaExtensions.Video.Interface;
using SoundInTheory.Piranha.MediaExtensions.Video.Models;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace SoundInTheory.Piranha.MediaExtensions.Video.Providers
{
    public class YoutubeProvider : IVideoProvider
    {
        const string PROVIDER_NAME = "youtube";

        public string providerName()
        {
            return PROVIDER_NAME;
        }

        public async Task<VideoDetails> GetDetails(string videoId)
        {
            using (var httpClient = new HttpClient()) // Create an instance of HttpClient
            {
                string url = $"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={videoId}&format=json";

                HttpResponseMessage response = await httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception("Failed to fetch YouTube video info.");
                }

                var jsonResponse = JsonSerializer.Deserialize<OEmbedResponse>(await response.Content.ReadAsStringAsync());

                // Deserialize the JSON response into the OEmbed class
                return new VideoDetails(jsonResponse, videoId, PROVIDER_NAME);
            }
        }

        public string MatchAndReturnID(string input)
        {
            // Regular expression to extract YouTube video ID
            var regex = new Regex(@"^(?:.*(?:youtube\.com\/(?:.*[?&]v=|embed\/)|youtu\.be\/))?([a-zA-Z0-9_-]{11})$");
            var match = regex.Match(input);

            // Return the matched group or null if not found
            return match.Success ? match.Groups[1].Value : null;
        }

        public string GetEmbedLink(string videoId)
        {
            return $"https://www.youtube.com/embed/{videoId}";
        }
    }
}

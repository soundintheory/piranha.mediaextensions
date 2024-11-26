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
                return new VideoDetails(jsonResponse, videoId, PROVIDER_NAME, this.GetIframeHtml(videoId));
            }
        }

        public string MatchAndReturnID(string input)
        {
            var regex = new Regex(@"^[a-zA-Z0-9_-]{11}$");
            var match = regex.Match(input);
            if(match.Success)
            {
                return match.Groups[0].Value;
            }

            // Regular expression to extract YouTube video ID
            regex = new Regex(@"(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})");
            match = regex.Match(input);

            // Return the matched group or null if not found
            return match.Success ? match.Groups[1].Value : null;
        }

        public string GetIframeHtml(string videoId)
        {
            return $@"
                    <iframe 
                        src=""https://www.youtube.com/embed/{videoId}"" 
                        width=""560"" 
                        height=""315"" 
                        frameborder=""0"" 
                        allow=""accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"" 
                        allowfullscreen>
                    </iframe>";
        }
    }
}

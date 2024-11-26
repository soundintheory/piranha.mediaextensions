
using Newtonsoft.Json;

namespace SoundInTheory.Piranha.MediaExtensions.Video.Models
{
    public class VideoDetails
    {
        public VideoDetails() { }

        public VideoDetails(OEmbedResponse resp, string id, string providerName)
        {
            AuthorName = resp.AuthorName;
            Title = resp.Title;
            ThumbnailUrl = resp.ThumbnailUrl;
            ProviderName = providerName;
            Id = id;
        }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("author_name")]
        public string AuthorName { get; set; }

        [JsonProperty("provider_name")]
        public string ProviderName { get; set; }

        [JsonProperty("thumbnail_url")]
        public string ThumbnailUrl { get; set; }

    }
}

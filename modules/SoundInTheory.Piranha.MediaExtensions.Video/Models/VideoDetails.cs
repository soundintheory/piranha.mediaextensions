
using Newtonsoft.Json;

namespace SoundInTheory.Piranha.MediaExtensions.Video.Models
{
    public class VideoDetails
    {
        public VideoDetails() { }

        public VideoDetails(OEmbedResponse resp, string id, string providerName, string iframeHtml)
        {
            AuthorName = resp.AuthorName;
            Title = resp.Title;
            ThumbnailUrl = resp.ThumbnailUrl;
            ProviderName = providerName;
            Id = id;
            IframeHtml = iframeHtml;    
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

        [JsonProperty("iframe_html")]
        public string IframeHtml { get; set; }

    }
}

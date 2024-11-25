using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Video.Models
{
    public class VideoDetails
    {
        public VideoDetails() { }

        public VideoDetails(OEmbedResponse resp, string providerName)
        {
            AuthorName = resp.AuthorName;
            Title = resp.Title;
            ThumbnailUrl = resp.ThumbnailUrl;
            ProviderName = providerName;
        }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("author_name")]
        public string AuthorName { get; set; }

        [JsonPropertyName("provider_name")]
        public string ProviderName { get; set; }

        [JsonPropertyName("thumbnail_url")]
        public string ThumbnailUrl { get; set; }
    }
}

using Newtonsoft.Json;
using Piranha.Extend;

namespace SoundInTheory.Piranha.MediaExtensions.Video.Fields
{
    [FieldType(Name = "Video Embed", Shorthand = "Video Embed", Component = "video-embed-field")]
    public class VideoEmbedField : IField
    {     
        /// <summary>
        /// The raw value that was added in the manager
        /// </summary>
        public string Value { get; set; }

        public VideoInfoEmbedField VideoInfo { get; set; }

        public string GetTitle()
        {
            return "Video Embed";
        }
    }

    public class VideoInfoEmbedField
    {
        [JsonProperty("id")]
        /// <summary>
        /// The video id that was parsed from the value
        /// </summary>
        public string Id { get; set; }

        [JsonProperty("type")]
        /// <summary>
        /// The type of video embed, eg. "youtube" or "vimeo"
        /// </summary>
        public string Type { get; set; }

        [JsonProperty("thumbnail_url")]
        /// <summary>
        /// The type of video embed, eg. "youtube" or "vimeo"
        /// </summary>
        public string ThumbnailUrl { get; set; }

        [JsonProperty("iframe_html")]
        /// <summary>
        /// The type of video embed, eg. "youtube" or "vimeo"
        /// </summary>
        public string IframeHtml { get; set; }

    }
}

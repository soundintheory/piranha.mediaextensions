using Piranha.Extend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        /// <summary>
        /// The video id that was parsed from the value
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// The type of video embed, eg. "youtube" or "vimeo"
        /// </summary>
        public string Type { get; set; }

    }
}

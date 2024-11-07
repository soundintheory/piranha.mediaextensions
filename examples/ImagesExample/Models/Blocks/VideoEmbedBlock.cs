using Piranha.Extend.Fields;
using Piranha.Extend;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using SoundInTheory.Piranha.MediaExtensions.Video.Fields;

namespace ImagesExample.Models.Blocks
{
    [BlockType(Name = "Video Embed", Icon = "fas fa-video", ListTitle = "Text")]
    public class VideoEmbedBlock : Block
    {
        public VideoEmbedField Video { get; set; }
    }
}

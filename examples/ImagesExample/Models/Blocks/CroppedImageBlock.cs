using Piranha.Extend.Fields;
using Piranha.Extend;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;

namespace ImagesExample.Models.Blocks
{
    [BlockType(Name = "Image Link", IsUnlisted = true, Icon = "fas fa-image", ListTitle = "Text")]
    public class CroppedImageBlock : Block
    {
        public CroppedImageField Image { get; set; }

        public ImageField GetImage()
        {
            if (Image.HasValue)
            {
                return Image;
            }
            return Image ?? new ImageField();
        }
    }
}

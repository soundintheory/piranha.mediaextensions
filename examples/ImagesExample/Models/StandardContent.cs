﻿using Piranha.AttributeBuilder;
using Piranha.Extend;
using Piranha.Models;
using SoundInTheory.Piranha.Media.Images;
using SoundInTheory.Piranha.MediaExtensions.Images;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;

namespace ImagesExample.Models
{
    [ContentType(Title = "Example Content", UseExcerpt = false, UsePrimaryImage = false)]
    [ContentGroup(Title = "Content")]
    public class StandardContent : Content<StandardContent>
    {

        public class ImagesRegion
        {
            [Field, CroppedImageFieldSettings(AspectRatio = 16d / 9d, MinWidth = 100, MinHeight = 100, Crops = new string[] { "Default", "Second Crop" })]
            public CroppedImageField TestImageFieldWithSettings { get; set; } 
            [Field]
            public CroppedImageField TestImageFieldWithoutSettings { get; set; }

            [Field]
            public GalleryField TestGalleryField { get; set; }

        }

        [Region(Title = "Images")]
        public ImagesRegion Images { get; set; }

    }
}

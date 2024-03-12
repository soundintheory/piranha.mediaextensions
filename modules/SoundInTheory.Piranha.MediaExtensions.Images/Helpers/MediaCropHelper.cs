using Piranha.Extend.Blocks;
using Piranha.Extend.Fields;
using Piranha;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Piranha.Models;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;
using SoundInTheory.Piranha.MediaExtensions.Images.Model;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Helpers
{
    public class MediaCropHelper
    {
        private readonly IApi _api;

        private readonly MediaCropService _mediaCrop;

        /// <summary>
        /// Default internal constructur.
        /// </summary>
        public MediaCropHelper(IApi api, MediaCropService mediaCrop)
        {
            _api = api;
            _mediaCrop = mediaCrop;
        }

        /// <summary>
        /// Resizes the given image to the given dimensions.
        /// </summary>
        /// <param name="image">The image field</param>
        /// <param name="width">The width</param>
        /// <param name="height">The optional height</param>
        /// <returns>The public URL of the resized image</returns>
        public string CropImage(CroppedImageField image, int? width = null, int? height = null)
        {
            var id = image?.Id ?? image?.Media?.Id;

            if (image == null || !id.HasValue || id == Guid.Empty)
                return null;

            return _mediaCrop.EnsureVersion(id.Value, image.Crop, width, height);
        }

        /// <summary>
        /// Resizes the given image to the given dimensions.
        /// </summary>
        /// <param name="image">The image field</param>
        /// <param name="width">The width</param>
        /// <param name="height">The optional height</param>
        /// <returns>The public URL of the resized image</returns>
        public string CropImage(CroppedImageField image, string crop, int? width = null, int? height = null)
        {
            var id = image?.Id ?? image?.Media?.Id;

            if (image == null || !id.HasValue || id == Guid.Empty)
                return null;

            return _mediaCrop.EnsureVersion(id.Value, image[crop], width, height);
        }


        /// <summary>
        /// Resizes the given image to the given dimensions.
        /// </summary>
        /// <param name="image">The image</param>
        /// <param name="width">The width</param>
        /// <param name="height">The optional width</param>
        /// <returns>The public URL of the resized image</returns>
        public string CropImage(global::Piranha.Models.Media image, CropSettings settings, int? width = null, int? height = null)
        {
            if (image == null || image.Id == Guid.Empty || image.Type != MediaType.Image)
                return null;

            return _mediaCrop.EnsureVersion(image.Id, settings, width, height);
        }
    }
}

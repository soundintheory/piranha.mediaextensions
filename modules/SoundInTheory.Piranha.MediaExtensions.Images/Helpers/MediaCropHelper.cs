using Piranha;
using Piranha.Extend.Fields;
using Piranha.Models;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using SoundInTheory.Piranha.MediaExtensions.Images.Model;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;
using System;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Helpers
{
    public class MediaCropHelper
    {
        private readonly IApi _api;
        private readonly MediaCropService _mediaCrop;

        public MediaCropHelper(IApi api, MediaCropService mediaCrop)
        {
            _api = api;
            _mediaCrop = mediaCrop;
        }

        public string CropImage(CroppedImageField image, int? width = null, int? height = null, ResizeMode resizeMode = ResizeMode.Fill)
        {
            var id = image?.Id ?? image?.Media?.Id;

            if (image == null || !id.HasValue || id == Guid.Empty)
                return null;

            return _mediaCrop.EnsureVersion(id.Value, image.Crop, width, height, resizeMode);
        }

        public string CropImage(CroppedImageField image, string crop, int? width = null, int? height = null, ResizeMode resizeMode = ResizeMode.Fill)
        {
            var id = image?.Id ?? image?.Media?.Id;

            if (image == null || !id.HasValue || id == Guid.Empty)
                return null;

            return _mediaCrop.EnsureVersion(id.Value, image[crop], width, height, resizeMode);
        }

        public string CropImage(Media image, CropSettings settings, int? width = null, int? height = null, ResizeMode resizeMode = ResizeMode.Fill)
        {
            if (image == null || image.Id == Guid.Empty || image.Type != MediaType.Image)
                return null;

            return _mediaCrop.EnsureVersion(image.Id, settings, width, height, resizeMode);
        }
    }
}

using Piranha.AspNetCore.Services;
using Piranha.Extend.Blocks;
using Piranha.Extend.Fields;
using Piranha.Models;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using SoundInTheory.Piranha.MediaExtensions.Images.Helpers;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services;

public class DefaultImageUrlProvider : IImageUrlProvider
{
    private readonly IApplicationService _webApp;
    private readonly MediaCropHelper _imageCrop;

    public DefaultImageUrlProvider(IApplicationService webApp, MediaCropHelper imageCrop)
    {
        _webApp = webApp;
        _imageCrop = imageCrop;
    }

    public string? Resolve(object? image, int? width, int? height, string? cropName)
    {
        if (image is ImageField imageField && imageField.Id.HasValue && imageField.Media == null)
        {
            imageField.Init(_webApp.Api).GetAwaiter().GetResult();
        }

        return image switch
        {
            CroppedImageField cropped when cropped.HasValue && !string.IsNullOrEmpty(cropName) =>
                width.HasValue || height.HasValue
                    ? _imageCrop.CropImage(cropped, cropName, width, height)
                    : cropped.Media?.PublicUrl,

            CroppedImageField cropped when cropped.HasValue =>
                width.HasValue || height.HasValue
                    ? _imageCrop.CropImage(cropped, width, height)
                    : cropped.Media?.PublicUrl,

            ImageField imgField when imgField.HasValue =>
                width.HasValue
                    ? _webApp.Media.ResizeImage(imgField, width.Value, height)
                    : imgField.Media?.PublicUrl,

            Media media =>
                width.HasValue
                    ? _webApp.Media.ResizeImage(media, width.Value, height)
                    : media.PublicUrl,

            ImageBlock block when block.Body?.HasValue == true =>
                width.HasValue
                    ? _webApp.Media.ResizeImage(block, width.Value)
                    : block.Body?.Media?.PublicUrl,

            _ => null
        };
    }
}

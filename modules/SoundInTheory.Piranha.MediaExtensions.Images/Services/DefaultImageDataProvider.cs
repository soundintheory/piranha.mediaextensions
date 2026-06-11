using System.Collections.Generic;
using Piranha.AspNetCore.Services;
using Piranha.Extend.Blocks;
using Piranha.Extend.Fields;
using Piranha.Models;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using SoundInTheory.Piranha.MediaExtensions.Images.Helpers;
using SoundInTheory.Piranha.MediaExtensions.Images.Model;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services;

public class DefaultImageDataProvider : IImageDataProvider
{
    private readonly IApplicationService _webApp;
    private readonly MediaCropHelper _imageCrop;

    public DefaultImageDataProvider(IApplicationService webApp, MediaCropHelper imageCrop)
    {
        _webApp = webApp;
        _imageCrop = imageCrop;
    }

    public ImageData? Resolve(object? image, ImageContext context)
    {
        if (image == null) return null;

        var width = context.Width;
        var height = context.Height;
        var cropName = context.CropName;

        if (image is ImageField imageField && imageField.Id.HasValue && imageField.Media == null)
        {
            imageField.Init(_webApp.Api).GetAwaiter().GetResult();
        }

        var url = image switch
        {
            CroppedImageField cropped when cropped.HasValue && !string.IsNullOrEmpty(cropName) =>
                (width.HasValue || height.HasValue)
                    ? _imageCrop.CropImage(cropped, cropName, width, height, context.ResizeMode)
                    : cropped.Media?.PublicUrl,

            CroppedImageField cropped when cropped.HasValue =>
                (width.HasValue || height.HasValue)
                    ? _imageCrop.CropImage(cropped, width, height, context.ResizeMode)
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

        if (url == null) return null;

        return new ImageData
        {
            Url = url,
            AltText = image switch
            {
                CroppedImageField cropped => cropped.Media?.AltText,
                ImageField imgField => imgField.Media?.AltText,
                Media media => media.AltText,
                ImageBlock block => block.Body?.Media?.AltText,
                _ => null
            },
            Title = image switch
            {
                CroppedImageField cropped => cropped.Media?.Title,
                ImageField imgField => imgField.Media?.Title,
                Media media => media.Title,
                ImageBlock block => block.Body?.Media?.Title,
                _ => null
            },
            Params = new Dictionary<string, string?>(context.Params)
        };
    }
}

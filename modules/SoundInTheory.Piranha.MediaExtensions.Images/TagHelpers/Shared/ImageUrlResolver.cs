using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Piranha.Extend.Blocks;
using Piranha.Extend.Fields;
using Piranha.Models;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;
using System.Collections.Generic;
using System.Linq;

namespace SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers.Shared;

public class ImageUrlResolver
{
    private readonly IEnumerable<IImageUrlProvider> _providers;
    private readonly IUrlHelperFactory _urlHelperFactory;

    public ImageUrlResolver(IEnumerable<IImageUrlProvider> providers, IUrlHelperFactory urlHelperFactory)
    {
        _providers = providers.Reverse();
        _urlHelperFactory = urlHelperFactory;
    }

    public string? Resolve(object? image, int? width, int? height, ActionContext actionContext)
        => Resolve(image, width, height, null, actionContext);

    public string? Resolve(object? image, int? width, int? height, string? cropName, ActionContext actionContext)
    {
        if (image == null)
        {
            return null;
        }

        string? raw = null;
        foreach (var provider in _providers)
        {
            raw = provider.Resolve(image, width, height, cropName);
            if (raw != null) break;
        }

        return raw != null ? _urlHelperFactory.GetUrlHelper(actionContext).Content(raw) : null;
    }

    public static string? GetAltText(object? image) => image switch
    {
        CroppedImageField cropped => cropped.Media?.AltText,
        ImageField imgField => imgField.Media?.AltText,
        Media media => media.AltText,
        ImageBlock block => block.Body?.Media?.AltText,
        _ => null
    };

    public static string? GetTitle(object? image) => image switch
    {
        CroppedImageField cropped => cropped.Media?.Title,
        ImageField imgField => imgField.Media?.Title,
        Media media => media.Title,
        ImageBlock block => block.Body?.Media?.Title,
        _ => null
    };
}

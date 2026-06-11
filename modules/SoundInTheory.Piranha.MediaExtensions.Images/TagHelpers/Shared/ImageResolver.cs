using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.WebUtilities;
using SoundInTheory.Piranha.MediaExtensions.Images.Model;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;
using System.Collections.Generic;
using System.Linq;

namespace SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers.Shared;

public class ImageResolver
{
    private readonly IEnumerable<IImageDataProvider> _providers;
    private readonly IUrlHelperFactory _urlHelperFactory;

    public ImageResolver(IEnumerable<IImageDataProvider> providers, IUrlHelperFactory urlHelperFactory)
    {
        _providers = providers.Reverse();
        _urlHelperFactory = urlHelperFactory;
    }

    public ImageData? Resolve(object? image, ImageContext context, ActionContext actionContext)
    {
        if (image == null) return null;

        foreach (var provider in _providers)
        {
            var data = provider.Resolve(image, context);
            if (data != null)
            {
                if (data.Url != null)
                {
                    data.Url = _urlHelperFactory.GetUrlHelper(actionContext).Content(data.Url);
                    if (data.Params?.Count > 0)
                        data.Url = QueryHelpers.AddQueryString(data.Url, data.Params);
                }
                return data;
            }
        }

        return null;
    }
}

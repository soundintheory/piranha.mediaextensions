using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoundInTheory.Piranha.MediaExtensions.Images.Model;
using SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers.Shared;

namespace SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers;

[HtmlTargetElement(Attributes = "image-bg")]
public class ImageBgTagHelper : TagHelper
{
    private readonly ImageResolver _resolver;

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext ViewContext { get; set; } = default!;

    [HtmlAttributeName("image-bg")]
    public object? ImageBg { get; set; }

    [HtmlAttributeName("w")]
    public int? W { get; set; }

    [HtmlAttributeName("h")]
    public int? H { get; set; }

    [HtmlAttributeName("crop-name")]
    public string? CropName { get; set; }

    [HtmlAttributeName("image-fallback")]
    public string? ImageFallback { get; set; }

    [HtmlAttributeName("params")]
    public string? Params { get; set; }

    [HtmlAttributeName("resize-mode")]
    public ResizeMode ResizeMode { get; set; } = ResizeMode.Fill;

    public ImageBgTagHelper(ImageResolver resolver)
    {
        _resolver = resolver;
    }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var imageContext = new ImageContext
        {
            Width = W,
            Height = H,
            CropName = CropName,
            Params = QueryParamHelper.Parse(Params),
            ResizeMode = ResizeMode
        };
        var url = _resolver.Resolve(ImageBg, imageContext, ViewContext)?.Url;

        if (url == null)
        {
            if (ImageFallback != null)
                url = ImageFallback;
            else
                return;
        }

        var existingStyle = context.AllAttributes.ContainsName("style")
            ? output.Attributes["style"].Value?.ToString()?.TrimEnd(';').Trim()
            : null;

        var bgStyle = $"background-image: url('{url}')";
        var newStyle = string.IsNullOrWhiteSpace(existingStyle)
            ? bgStyle
            : $"{existingStyle}; {bgStyle}";

        output.Attributes.SetAttribute("style", newStyle);
    }
}

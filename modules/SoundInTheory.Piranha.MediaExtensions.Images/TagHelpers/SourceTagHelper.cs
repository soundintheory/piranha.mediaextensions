using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoundInTheory.Piranha.MediaExtensions.Images.Model;
using SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers.Shared;

namespace SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers;

[HtmlTargetElement("source", Attributes = "image")]
[HtmlTargetElement("source", Attributes = "w")]
[HtmlTargetElement("source", Attributes = "h")]
public class SourceTagHelper : TagHelper
{
    private readonly ImageResolver _resolver;
    private readonly PictureImageContext _pictureContext;

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext ViewContext { get; set; } = default!;

    [HtmlAttributeName("image")]
    public object? Image { get; set; }

    [HtmlAttributeName("w")]
    public int? W { get; set; }

    [HtmlAttributeName("h")]
    public int? H { get; set; }

    [HtmlAttributeName("crop-name")]
    public string? CropName { get; set; }

    [HtmlAttributeName("min-width")]
    public int? MinWidth { get; set; }

    [HtmlAttributeName("max-width")]
    public int? MaxWidth { get; set; }

    [HtmlAttributeName("params")]
    public string? Params { get; set; }

    [HtmlAttributeName("resize-mode")]
    public ResizeMode ResizeMode { get; set; } = ResizeMode.Fill;

    public SourceTagHelper(ImageResolver resolver, PictureImageContext pictureContext)
    {
        _resolver = resolver;
        _pictureContext = pictureContext;
    }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var image = Image ?? _pictureContext.CurrentImage;
        var imageContext = new ImageContext
        {
            Width = W,
            Height = H,
            CropName = CropName,
            Params = QueryParamHelper.Parse(Params),
            ResizeMode = ResizeMode
        };
        var src = _resolver.Resolve(image, imageContext, ViewContext)?.Url;

        if (src == null)
        {
            output.SuppressOutput();
            return;
        }

        output.Attributes.SetAttribute("srcset", src);

        var media = BuildMedia();
        if (media != null)
            output.Attributes.SetAttribute("media", media);

        output.TagMode = TagMode.SelfClosing;
    }

    private string? BuildMedia()
    {
        if (MinWidth.HasValue && MaxWidth.HasValue)
            return $"(min-width: {MinWidth}px) and (max-width: {MaxWidth}px)";
        if (MinWidth.HasValue)
            return $"(min-width: {MinWidth}px)";
        if (MaxWidth.HasValue)
            return $"(max-width: {MaxWidth}px)";
        return null;
    }
}

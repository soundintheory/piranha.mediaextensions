using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SixLabors.ImageSharp.Web.Resolvers;
using SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers.Shared;

namespace SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers;

[HtmlTargetElement("img", Attributes = "image")]
[HtmlTargetElement("img", Attributes = "w")]
[HtmlTargetElement("img", Attributes = "h")]
public class ImageTagHelper : TagHelper
{
    private readonly ImageUrlResolver _resolver;
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

    [HtmlAttributeName("fallback")]
    public string? Fallback { get; set; }

    [HtmlAttributeName("lazy")]
    public bool Lazy { get; set; }

    public ImageTagHelper(ImageUrlResolver resolver, PictureImageContext pictureContext)
    {
        _resolver = resolver;
        _pictureContext = pictureContext;
    }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var image = Image ?? _pictureContext.CurrentImage;
        var src = _resolver.Resolve(image, W, H, CropName, ViewContext);

        if (src == null)
        {
            if (Fallback != null)
                src = Fallback;
            else
            {
                output.SuppressOutput();
                return;
            }
        }

        if (context.AllAttributes.ContainsName("alt"))
        {
            var altValue = context.AllAttributes["alt"].Value?.ToString() ?? string.Empty;
            if (!string.IsNullOrEmpty(altValue))
                output.Attributes.SetAttribute(new TagHelperAttribute("alt", altValue, HtmlAttributeValueStyle.DoubleQuotes));
        }
        else
        {
            var altText = ImageUrlResolver.GetAltText(image);
            if (!string.IsNullOrEmpty(altText))
                output.Attributes.SetAttribute("alt", altText);
        }

        if (!context.AllAttributes.ContainsName("title"))
        {
            var title = ImageUrlResolver.GetTitle(image);
            if (!string.IsNullOrEmpty(title))
                output.Attributes.SetAttribute("title", title);
        }

        output.Attributes.SetAttribute("src", src);
    }
}

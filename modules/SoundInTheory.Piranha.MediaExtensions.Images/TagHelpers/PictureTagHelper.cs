using Microsoft.AspNetCore.Razor.TagHelpers;
using SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers.Shared;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers;

[HtmlTargetElement("picture", Attributes = "image")]
public class PictureTagHelper : TagHelper
{
    private readonly PictureImageContext _pictureContext;

    [HtmlAttributeName("image")]
    public object? Image { get; set; }

    public PictureTagHelper(PictureImageContext pictureContext)
    {
        _pictureContext = pictureContext;
    }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        _pictureContext.CurrentImage = Image;
        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
        _pictureContext.CurrentImage = null;
    }
}

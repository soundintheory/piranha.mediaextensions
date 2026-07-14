using Microsoft.AspNetCore.Razor.TagHelpers;
using System;

namespace SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers.Shared;

internal static class ResolveErrorComment
{
    public static void Append(TagHelperOutput output, Exception error, bool renderingDefault)
    {
        var action = renderingDefault ? "rendering default instead" : "no default available, suppressing output";
        var text = Sanitize($"{error.GetType().Name}: {error.Message} - {action}");
        output.PreElement.AppendHtml($"<!-- {text} -->");
    }

    private static string Sanitize(string s) =>
        s.Replace("--", "-").Replace("\r", " ").Replace("\n", " ").Trim();
}

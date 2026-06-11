using Microsoft.AspNetCore.WebUtilities;
using System.Collections.Generic;
using System.Linq;

namespace SoundInTheory.Piranha.MediaExtensions.Images.TagHelpers.Shared;

internal static class QueryParamHelper
{
    internal static IDictionary<string, string?> Parse(string? queryString)
    {
        if (string.IsNullOrEmpty(queryString)) return new Dictionary<string, string?>();
        return QueryHelpers.ParseQuery(queryString)
            .ToDictionary(kvp => kvp.Key, kvp => (string?)kvp.Value.ToString());
    }
}

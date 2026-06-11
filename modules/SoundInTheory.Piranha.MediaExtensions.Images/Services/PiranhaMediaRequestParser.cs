using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using SixLabors.ImageSharp.Web.Commands;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    /// <summary>
    /// Adds support for piranha media widths and heights to respect piranha (eg 00000000-0000-0000-0000-000000000000/100/100 to 00000000-0000-0000-0000-000000000000?width=100&height=100
    /// </summary>
    public class PiranhaMediaRequestParser(IOptions<PiranhaMediaImageProviderOptions> options) : IRequestParser
    {
        public CommandCollection ParseRequestCommands(HttpContext context)
        {
            CommandCollection transformed = [];

            if (context.Request?.Path.Value != null && context.Request.Path.StartsWithSegments(options.Value.RootName, StringComparison.InvariantCultureIgnoreCase))
            {
                var splitPath = context.Request.Path.Value.Substring(options.Value.RootName.Length).Split('/', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

                var width = splitPath.Length > 1 ? splitPath[1] : null;
                var height = splitPath.Length > 2 ? splitPath[2] : null;

                if (width != null && int.TryParse(width, out _)) transformed["width"] = width;
                if (height != null && int.TryParse(height, out _)) transformed["height"] = height;
            }

            var query = context.Request?.Query;

            if (query is null || query.Count == 0)
            {
                return transformed;
            }

            foreach (KeyValuePair<string, StringValues> pair in query)
            {
                // Use the indexer for both set and query. This replaces any previously parsed values.
                string? value = pair.Value[^1];
                if (value is not null)
                {
                    transformed[pair.Key] = value;
                }
            }

            return transformed;
        }
    }
}

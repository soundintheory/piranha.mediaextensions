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
    public class PiranhaMediaRequestParser : IRequestParser
    {
        private readonly IOptions<PiranhaMediaImageProviderOptions> _options;
        public PiranhaMediaRequestParser(IOptions<PiranhaMediaImageProviderOptions> options)
        {
            _options = options;
        }

        public CommandCollection ParseRequestCommands(HttpContext context)
        {
            //support for piranha media widths and heights to respect piranha (eg 00000000-0000-0000-0000-000000000000/100/100 to 00000000-0000-0000-0000-000000000000?width=100&height=100
            //only use this if you really need it (ie - you don't have control over some of the media urls and are at the mercy of the Piranha manager for them) 
            if (context.Request.Path.Value != null && context.Request.Path.Value.ToString().Contains(_options.Value.RootName))
            {
                string path = context.Request.Path.Value;
                if (path is not null)
                {
                    var splitPath = path.Replace(_options.Value.RootName + "/", "").Split("/");
                    //process width and height URL parts to respect Piranha whenever it does it. You should just use the normal image sharp query parameters if you want to do this though. 
                    string? width = splitPath.Length > 1 ? splitPath[1] : null;
                    string? height = splitPath.Length > 2 ? splitPath[2] : null;

                    if (width != null) context.Request.QueryString = context.Request.QueryString.Add("width", width);
                    if (height != null) context.Request.QueryString = context.Request.QueryString.Add("height", height);
                }
            }

            if (context.Request.Query.Count == 0)
            {
                // We return new to ensure the collection is still mutable via events.
                return new();
            }

            // TODO: Investigate skipping the double allocation here.
            // In .NET 6 we can directly use the QueryStringEnumerable type and enumerate stright to our command collection
            Dictionary<string, StringValues> parsed = QueryHelpers.ParseQuery(context.Request.QueryString.ToUriComponent());
            CommandCollection transformed = new();
            foreach (KeyValuePair<string, StringValues> pair in parsed)
            {
                // Use the indexer for both set and query. This replaces any previously parsed values.
                transformed[pair.Key] = pair.Value[pair.Value.Count - 1];
            }

            return transformed;
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Piranha;
using SixLabors.ImageSharp.Web;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web.Resolvers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    public class PiranhaMediaImageProvider(IStorage storage, IOptions<PiranhaMediaImageProviderOptions> options) : IImageProvider
    {
        public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.All;

        private Func<HttpContext, bool> _match;
        public Func<HttpContext, bool> Match
        {
            get => _match ?? DefaultMatcher;
            set => _match = value;
        }

        private bool DefaultMatcher(HttpContext ctx)
        {
            return ctx.Request.Path.StartsWithSegments(options.Value.RootName, StringComparison.InvariantCultureIgnoreCase);
        }

        public async Task<IImageResolver> GetAsync(HttpContext context)
        {
            var piranha = context.RequestServices.GetService<IApi>();
            var path = context.Request.Path.Value;

            if (path is not null && Guid.TryParse(path.Replace(options.Value.RootName + "/", ""), out var guid))
            {
                var media = await piranha.Media.GetByIdAsync(guid);

                if (media != null)
                {
                    return new PiranhaMediaImageResolver(storage, media);
                }
            }

            return null;
        }

        public bool IsValidRequest(HttpContext context) => true;
    }
}

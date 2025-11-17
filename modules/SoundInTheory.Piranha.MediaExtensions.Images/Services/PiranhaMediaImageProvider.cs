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
    public class PiranhaMediaImageProvider : IImageProvider
    {
        private readonly FormatUtilities _formatUtilities;
        private readonly IOptions<PiranhaMediaImageProviderOptions> _options;

        public PiranhaMediaImageProvider(FormatUtilities formatUtilities, IOptions<PiranhaMediaImageProviderOptions> options)
        {
            _formatUtilities = formatUtilities;
            _options = options;
        }


        public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.All;

        private Func<HttpContext, bool> _match;
        public Func<HttpContext, bool> Match
        {
            get
            {
                return ctx =>
                {
                    return ctx.Request.Path.StartsWithSegments(this._options.Value.RootName, StringComparison.InvariantCultureIgnoreCase);
                };
            }
            set { _match = value; }
        }

        public async Task<IImageResolver> GetAsync(HttpContext context)
        {
            var piranha = context.RequestServices.GetService<IApi>();

            string path = context.Request.Path.Value;
            if (path is not null)
            {
                var splitPath = path.Replace(_options.Value.RootName + "/", "").Split("/");
                var mediaId = splitPath[0];

                Guid guid = Guid.Parse(mediaId);
                var media = await piranha.Media.GetByIdAsync(guid);

                return new PiranhaMediaImageResolver(media, context);
            }


            return null;
        }

        public bool IsValidRequest(HttpContext context) => true;
    }
}

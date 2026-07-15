using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Piranha;
using Piranha.Local;
using SixLabors.ImageSharp.Web;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web.Resolvers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    public class PiranhaMediaImageProvider(IStorage storage, IWebHostEnvironment environment, IOptions<PiranhaMediaImageProviderOptions> options, IHttpContextAccessor http) : IImageProvider
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

                if (media != null && storage is FileStorage)
                {
                    var filePath = $"uploads/{storage.GetResourceName(media, media.Filename)}";
                    var fileInfo = environment.WebRootFileProvider.GetFileInfo(filePath);

                    if (fileInfo.Exists)
                    {
                        return new FileProviderImageResolver(fileInfo);
                    }

                    TrySetPiranhaHandled();
                    return null;
                }

                if (media != null)
                {
                    return new PiranhaMediaImageResolver(storage, media);
                }
            }

            TrySetPiranhaHandled();
            return null;
        }

        /// <summary>
        /// Stop Piranha trying to handle the request
        /// </summary>
        private void TrySetPiranhaHandled()
        {
            var ctx = http.HttpContext;

            if (ctx?.Request != null)
            {
                if (IsHandled(ctx))
                {
                    return;
                }

                if (ctx.Request.QueryString.HasValue)
                {
                    ctx.Request.QueryString = new QueryString(ctx.Request.QueryString.Value + "&piranha_handled=true");
                }
                else
                {
                    ctx.Request.QueryString = new QueryString("?piranha_handled=true");
                }
            }
        }

        private static bool IsHandled(HttpContext context)
        {
            var values = context.Request.Query["piranha_handled"];
            if (values.Count > 0)
            {
                return values[0] == "true";
            }
            return false;
        }

        public bool IsValidRequest(HttpContext context) => true;
    }
}

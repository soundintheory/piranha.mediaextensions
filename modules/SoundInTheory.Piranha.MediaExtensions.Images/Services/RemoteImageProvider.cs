using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
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
    public class RemoteImageProvider : IImageProvider
    {
        private readonly FormatUtilities _formatUtilities;
        private readonly IOptions<RemoteImageProviderOptions> _options;

        public RemoteImageProvider(FormatUtilities formatUtilities, IOptions<RemoteImageProviderOptions> options)
        {
            _formatUtilities = formatUtilities;
            _options = options;
        }

        public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.CommandOnly;

        public Func<HttpContext, bool> Match
        {
            get
            {
                return ctx => ctx.Request.Path.Value.StartsWith(this._options.Value.RootName);
            }
            set { }
        }

        public Task<IImageResolver> GetAsync(HttpContext context)
        {
            string path = context.Request.Path.Value.Replace(_options.Value.RootName + "/", "");
            return Task.FromResult<IImageResolver>(new RemoteImageResolver(path));
        }

        public bool IsValidRequest(HttpContext context) {
            string path = context.Request.Path.Value;
            var url = path.Replace(_options.Value.RootName + "/", "");

            if(!Uri.IsWellFormedUriString(url, UriKind.Absolute)) return false;
            var formedUrl = new Uri(url);

            if (!_options.Value.WhiteList.Contains(formedUrl.Host.ToLower())) return false;

            return true;

        }
    }
}

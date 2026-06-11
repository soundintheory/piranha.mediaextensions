using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;
using Piranha;
using Piranha.Models;
using SixLabors.ImageSharp.Web;
using SixLabors.ImageSharp.Web.Resolvers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    public class PiranhaMediaImageResolver(IStorage storage, Media media) : IImageResolver
    {
        public Task<ImageMetadata> GetMetaDataAsync()
        {
            return Task.FromResult(new ImageMetadata(media.LastModified, media.Size));
        }

        public async Task<Stream> OpenReadAsync()
        {
            using var session = await storage.OpenAsync().ConfigureAwait(false);
            var stream = new MemoryStream();

            var success = await session.GetAsync(media, media.Filename, stream).ConfigureAwait(false);
            stream.Seek(0, SeekOrigin.Begin);

            return stream;
        }
    }
}

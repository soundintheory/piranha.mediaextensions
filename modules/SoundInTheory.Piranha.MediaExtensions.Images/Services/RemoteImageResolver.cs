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
    public class RemoteImageResolver : IImageResolver
    {
        private readonly string _url;
        private readonly HttpClient _httpClient;

        public RemoteImageResolver(string url)
        {
            _url = url;

            _httpClient = new HttpClient();
        }

        public Task<ImageMetadata> GetMetaDataAsync()
        {
            return Task.FromResult(new ImageMetadata());
        }

        public async Task<Stream> OpenReadAsync()
        {
            return await _httpClient.GetStreamAsync(_url);
        }
    }
}

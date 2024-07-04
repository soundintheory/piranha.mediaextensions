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
    public class PiranhaMediaImageResolver : IImageResolver
    {
        private readonly global::Piranha.Models.Media _media;
        private readonly HttpClient _httpClient;
        private readonly HttpContext _context;

        public PiranhaMediaImageResolver(global::Piranha.Models.Media media, HttpContext context)
        {
            _media = media;
            _context = context;
            _httpClient = new HttpClient();
        }

        public Task<ImageMetadata> GetMetaDataAsync()
        {
            return Task.FromResult(new ImageMetadata(_media.LastModified, _media.Size));
        }

        public async Task<Stream> OpenReadAsync()
        {
            if (_media.PublicUrl.Contains('~'))
            {
                return await _httpClient.GetStreamAsync((_context.Request.IsHttps ? "https://" : "http://") + _context.Request.Host + _media.PublicUrl.Replace("~", ""));
            }
            
            return await _httpClient.GetStreamAsync(_media.PublicUrl);
        }
    }
}

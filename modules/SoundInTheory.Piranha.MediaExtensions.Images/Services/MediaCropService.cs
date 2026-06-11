using Piranha.Models;
using Piranha;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Piranha.Repositories;
using Piranha.Services;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SoundInTheory.Piranha.MediaExtensions.Images.Model;
using ImageSharpResizeMode = SixLabors.ImageSharp.Processing.ResizeMode;
using MediaResizeMode = SoundInTheory.Piranha.MediaExtensions.Images.Model.ResizeMode;
using Piranha.Cache;
using SoundInTheory.Piranha.MediaExtensions.Images.ExtensionMethods;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    public class MediaCropService
    {
        private readonly IApi _api;
        private readonly IMediaRepository _repo;
        private readonly IStorage _storage;
        private readonly IImageProcessor _processor;
        private readonly ICache _cache;
        private static readonly object ScaleMutex = new object();
        private const string MEDIA_STRUCTURE = "MediaStructure";

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="repo">The current repository</param>
        /// <param name="storage">The current storage manager</param>
        /// <param name="cache">The optional model cache</param>
        /// <param name="processor">The optional image processor</param>
        public MediaCropService(IApi api, IMediaRepository repo, IStorage storage, IImageProcessor processor = null, ICache cache = null)
        {
            _api = api;
            _repo = repo;
            _storage = storage;
            _processor = processor;
            _cache = cache;
        }

        /// <summary>
        /// Ensures that the image version with the given size exsists
        /// and returns its public URL.
        /// </summary>
        /// <param name="id">The unique id</param>
        /// <param name="width">The requested width</param>
        /// <param name="height">The optionally requested height</param>
        /// <returns>The public URL</returns>
        public string EnsureVersion(Guid id, CropSettings settings, int? width, int? height = null, MediaResizeMode resizeMode = MediaResizeMode.Fill)
        {
            return EnsureVersionAsync(id, settings, width, height, resizeMode).GetAwaiter().GetResult();
        }

        /// <summary>
        /// Ensures that the image version with the given size exists
        /// and returns its public URL.
        /// </summary>
        /// <param name="id">The unique id</param>
        /// <param name="width">The requested width</param>
        /// <param name="height">The optionally requested height</param>
        /// <returns>The public URL</returns>
        public async Task<string> EnsureVersionAsync(Guid id, CropSettings settings, int? width, int? height = null, MediaResizeMode resizeMode = MediaResizeMode.Fill)
        {
            var media = await _api.Media.GetByIdAsync(id).ConfigureAwait(false);

            return media != null ? await EnsureVersionAsync(media, settings, width, height, resizeMode).ConfigureAwait(false) : null;
        }

        public async Task<string> EnsureVersionAsync(Media media, CropSettings settings, int? width, int? height = null, MediaResizeMode resizeMode = MediaResizeMode.Fill)
        {
            // If no processor is registered, return the original url
            if (_processor == null)
                return GetPublicUrl(media);

            // Get the media type
            var type = App.MediaTypes.GetItem(media.Filename);

            // If this type doesn't allow processing, return the original url
            if (!type.AllowProcessing)
                return GetPublicUrl(media);

            // Fall back to standard resizing if crop data is empty or equal to the image size
            if (settings == null || settings.IsEmpty || (settings.x == 0 && settings.y == 0 && settings.width == media.Width && settings.height == media.Height))
            {
                // Piranha requires a width for image resizing, so calculate it if only the height was provided
                if (!width.HasValue && height.HasValue && height > 0 && media.Width.HasValue && media.Height.HasValue)
                {
                    width = (int)Math.Round(height.Value * ((float)media.Width / (float)media.Height));
                }

                // Must at least have a width for standard resizing to work
                if (!width.HasValue || (media.Width == width && (!height.HasValue || media.Height == height.Value)))
                    return GetPublicUrl(media);

                return await _api.Media.EnsureVersionAsync(media, width.Value, height);
            }

            var fileInfo = new FileInfo(media.Filename);
            var resourceName = GetResourceName(media, settings, width, height, fileInfo.Extension, resizeMode);
            var filePath = "wwwroot/uploads/" + _storage.GetResourceName(media, resourceName);

            if (File.Exists(filePath))
            {
                return GetPublicUrl(media, resourceName);
            }            

            // Get the image file
            using (var stream = new MemoryStream())
            {
                using (var session = await _storage.OpenAsync().ConfigureAwait(false))
                {
                    if (!await session.GetAsync(media, media.Filename, stream).ConfigureAwait(false))
                    {
                        return null;
                    }

                    // Reset strem position
                    stream.Position = 0;

                    using (var output = new MemoryStream())
                    {
                        CropImage(stream, output, settings, width, height, resizeMode);

                        output.Position = 0;
                        bool upload = false;

                        lock (ScaleMutex)
                        {
                            // We have to make sure we don't scale multiple files at the same time
                            if (!File.Exists(filePath))
                            {
                                RemoveFromCache(media);
                                upload = true;
                            }
                        }

                        if (upload)
                        {
                            await session.PutAsync(media, resourceName, media.ContentType, output).ConfigureAwait(false);

                            return GetPublicUrl(media, resourceName);
                        }
                        //When moving this out of its parent method, realized that if the mutex failed, it would just fall back to the null instead of trying to return the issue.
                        //Added this to ensure that queries didn't just give up if they weren't the first to the party.
                        return GetPublicUrl(media, resourceName);
                    }
                }
            }
        }

        private void CropImage(Stream source, Stream dest, CropSettings settings, int? width = null, int? height = null, MediaResizeMode resizeMode = MediaResizeMode.Fill)
        {
            var imageSharpMode = resizeMode switch
            {
                MediaResizeMode.Contain => ImageSharpResizeMode.Max,
                MediaResizeMode.Pad => ImageSharpResizeMode.Pad,
                _ => ImageSharpResizeMode.Crop
            };

            using (var image = Image.Load(source, out IImageFormat format))
            {
                var cropRect = new Rectangle(settings.x, settings.y, settings.width, settings.height);
                var ratio = (float)cropRect.Width / (float)cropRect.Height;

                if (width.HasValue)
                {
                    height ??= (int)Math.Round((float)width.Value / ratio);
                }
                else if (height.HasValue)
                {
                    width ??= (int)Math.Round((float)height.Value * ratio);
                }

                if (cropRect.X < 0 || cropRect.Y < 0 || cropRect.Right > image.Width || cropRect.Bottom > image.Height)
                {
                    // An off-canvas crop is required
                    // Create an image with white background
                    using var backgroundImage = new Image<Rgba32>(Configuration.Default, cropRect.Width, cropRect.Height, Rgba32.ParseHex("FFFFFFFF"));

                    backgroundImage.Mutate((x) =>
                    {
                        x.DrawImage(image, new Point(-cropRect.X, -cropRect.Y), 1);

                        if (width.HasValue && height.HasValue)
                        {
                            x.Resize(new ResizeOptions
                            {
                                Size = new Size(width.Value, height.Value),
                                Mode = imageSharpMode
                            });
                        }
                    });

                    backgroundImage.Save(dest, format);
                }
                else
                {
                    // Standard crop is fine
                    image.Mutate((x) =>
                    {
                        x.Crop(cropRect);

                        if (width.HasValue && height.HasValue)
                        {
                            x.Resize(new ResizeOptions
                            {
                                Size = new Size(width.Value, height.Value),
                                Mode = imageSharpMode,
                                PadColor = Color.White
                            });
                        }
                    });

                    image.Save(dest, format);
                }
            }
        }

        /// <summary>
        /// Gets the media resource name.
        /// </summary>
        /// <param name="media">The media object</param>
        /// <param name="width">Optional requested width</param>
        /// <param name="height">Optional requested height</param>
        /// <param name="extension">Optional requested extension</param>
        /// <returns>The name</returns>
        private string GetResourceName(Media media, CropSettings settings, int? width = null, int? height = null, string extension = null, MediaResizeMode resizeMode = MediaResizeMode.Fill)
        {
            var filename = new FileInfo(media.Filename);
            var sb = new StringBuilder(filename.Name.Replace(filename.Extension, ""));

            if (settings != null)
            {
                sb.Append("_");
                sb.Append(settings.x);
                sb.Append("-");
                sb.Append(settings.y);
                sb.Append("-");
                sb.Append(settings.width);
                sb.Append("-");
                sb.Append(settings.height);
            }

            if (width.HasValue)
            {
                sb.Append("_");
                sb.Append(width);

                if (height.HasValue)
                {
                    sb.Append("x");
                    sb.Append(height.Value);
                }
            }

            if (resizeMode != MediaResizeMode.Fill)
            {
                sb.Append("_");
                sb.Append(resizeMode.ToString().ToLowerInvariant());
            }

            if (string.IsNullOrEmpty(extension))
            {
                sb.Append(filename.Extension);
            }
            else
            {
                sb.Append(extension);
            }
            return sb.ToString();
        }

        /// <summary>
        /// Gets the public url for the given media.
        /// </summary>
        /// <param name="media">The media object</param>
        /// <param name="width">Optional requested width</param>
        /// <param name="height">Optional requested height</param>
        /// <param name="extension">Optional requested extension</param>
        /// <returns>The name</returns>
        private string GetPublicUrl(Media media, int? width = null, int? height = null, string extension = null)
        {
            var name = GetResourceName(media, null, width, height, extension);

            return GetPublicUrl(media, name);
        }

        private string GetPublicUrl(Media media, string name)
        {
            using (var config = new Config(_api.Params))
            {
                var cdn = config.MediaCDN;

                if (!string.IsNullOrWhiteSpace(cdn))
                {
                    return cdn + _storage.GetResourceName(media, name);
                }
                return _storage.GetPublicUrl(media, name);
            }
        }

        /// <summary>
        /// Gets the public url for the given media.
        /// </summary>
        /// <param name="media">The media object</param>
        /// <param name="width">Optional requested width</param>
        /// <param name="height">Optional requested height</param>
        /// <param name="extension">Optional requested extension</param>
        /// <returns>The name</returns>
        private string GetPublicUrl(Media media, CropSettings settings, int? width = null, int? height = null, string extension = null)
        {
            var name = GetResourceName(media, settings, width, height, extension);

            using (var config = new Config(_api.Params))
            {
                var cdn = config.MediaCDN;

                if (!string.IsNullOrWhiteSpace(cdn))
                {
                    return cdn + _storage.GetResourceName(media, name);
                }
                return _storage.GetPublicUrl(media, name);
            }
        }

        /// <summary>
        /// Removes the given model from cache.
        /// </summary>
        /// <param name="model">The model</param>
        private void RemoveFromCache(Media model)
        {
            _cache.RemoveKeyAsync(model.Id.ToString()).GetAwaiter().GetResult();
        }
    }
}

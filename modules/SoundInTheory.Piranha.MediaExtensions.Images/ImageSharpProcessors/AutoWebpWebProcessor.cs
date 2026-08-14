using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Web;
using SixLabors.ImageSharp.Web.Commands;
using SixLabors.ImageSharp.Web.Processors;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;
using System.Collections.Generic;
using System.Globalization;

namespace SoundInTheory.Piranha.MediaExtensions.Images.ImageSharpProcessors
{
    /// <summary>
    /// Switches the output format to WebP for sources that can safely be converted.
    /// <para>
    /// Runs as a processor rather than as a middleware hook so the decision is made against the real
    /// decoded source format and frame count, rather than against a media record's stored content type.
    /// </para>
    /// </summary>
    public class AutoWebpWebProcessor(IOptions<WebpConversionOptions> options) : IImageWebProcessor
    {
        /// <summary>
        /// The command that opts a request in to automatic WebP conversion.
        /// </summary>
        public const string AutoWebp = "autowebp";

        private static readonly IEnumerable<string> AutoWebpCommands = new[]
        {
            AutoWebp
        };

        /// <inheritdoc/>
        public IEnumerable<string> Commands { get; } = AutoWebpCommands;

        /// <inheritdoc/>
        public FormattedImage Process(
            FormattedImage image,
            ILogger logger,
            CommandCollection commands,
            CommandParser parser,
            CultureInfo culture
        )
        {
            if (!parser.ParseValue<bool>(commands.GetValueOrDefault(AutoWebp), culture))
            {
                return image;
            }

            var opts = options.Value;

            // Already WebP, or a format we must not touch (GIF: ImageSharp 2.1 has no animated
            // WebP encoder and would flatten the animation to a single frame).
            if (image.Format is WebpFormat || opts.ExcludedFormats.Contains(image.Format.Name))
            {
                return image;
            }

            // Belt and braces for any other multi frame source.
            if (image.Image.Frames.Count > 1)
            {
                return image;
            }

            image.Format = WebpFormat.Instance;

            // Setting Format resets the encoder to the registry default, so apply ours afterwards.
            // We deliberately do not call ImageFormatsManager.SetEncoder: ImageSharpMiddlewareOptions
            // .Configuration is Configuration.Default in 2.0.2, and Clone() shares the format manager
            // by reference, so that would change WebP encoding for Piranha's media processor and
            // MediaCropService too.
            //
            // When the caller supplied "quality", QualityWebProcessor runs after us and builds its own
            // WebpEncoder, so anything we set here would be discarded.
            if (!commands.Contains(QualityWebProcessor.Quality))
            {
                var encoder = new WebpEncoder
                {
                    Quality = opts.Quality,
                    FileFormat = opts.Quality < 100 ? WebpFileFormatType.Lossy : null
                };

                opts.ConfigureEncoder?.Invoke(encoder);

                image.Encoder = encoder;
            }

            return image;
        }

        /// <inheritdoc/>
        public bool RequiresTrueColorPixelFormat(CommandCollection commands, CommandParser parser, CultureInfo culture) => false;
    }
}

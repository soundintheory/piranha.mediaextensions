using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Web;
using SixLabors.ImageSharp.Web.Commands;
using SixLabors.ImageSharp.Web.Processors;
using System.Collections.Generic;
using System.Globalization;

namespace SoundInTheory.Piranha.MediaExtensions.Images.ImageSharpProcessors
{
    public class CropWebProcessor : IImageWebProcessor
    {
        public const string CropX = "cropx";
        public const string CropY = "cropy";
        public const string CropWidth = "cropwidth";
        public const string CropHeight = "cropheight";
        public const string BgColor = "bgcolor";

        private static readonly IEnumerable<string> CropCommands = new[]
        {
            CropX,
            CropY,
            CropWidth,
            CropHeight,
            BgColor
        };

        public IEnumerable<string> Commands { get; } = CropCommands;

        public FormattedImage Process(
            FormattedImage image,
            ILogger logger,
            CommandCollection commands,
            CommandParser parser,
            CultureInfo culture
        )
        {
            var cropRect = GetCropRectangle(commands, parser, culture);

            if (cropRect != null)
            {
                var rect = cropRect.Value;
                var exceedsBounds = rect.X < 0 || rect.Y < 0 || rect.Right > image.Image.Width || rect.Bottom > image.Image.Height;

                if (exceedsBounds)
                {
                    // Mirror MediaCropService.CropImage: create a background canvas and draw the original onto it.
                    // Without this, the off-canvas region shows the resized original instead of the background colour.
                    using var original = image.Image.Clone(x => { });

                    var bgColor = commands.TryGetValue(BgColor, out string? bgColorStr)
                        ? parser.ParseValue<Color>(bgColorStr, culture)
                        : Color.White;

                    using var canvas = new Image<Rgba32>(Configuration.Default, rect.Width, rect.Height, bgColor);
                    canvas.Mutate(x => x.DrawImage(original, new Point(-rect.X, -rect.Y), 1f));

                    image.Image.Mutate(x =>
                    {
                        x.Resize(new ResizeOptions { Size = new Size(rect.Width, rect.Height), Mode = ResizeMode.Stretch });
                        x.DrawImage(canvas, new Point(0, 0), 1f);
                    });
                }
                else
                {
                    image.Image.Mutate(x => x.Crop(rect));
                }
            }

            return image;
        }

        internal static Rectangle? GetCropRectangle(
            CommandCollection commands,
            CommandParser parser,
            CultureInfo cultureInfo
        )
        {
            var hasCropX = commands.Contains(CropX);
            var hasCropY = commands.Contains(CropY);
            var hasCropWidth = commands.Contains(CropWidth);
            var hasCropHeight = commands.Contains(CropHeight);

            if (!hasCropWidth || !hasCropHeight)
            {
                return null;
            }

            var cropX = hasCropX ? parser.ParseValue<int>(commands.GetValueOrDefault(CropX), cultureInfo) : 0;
            var cropY = hasCropY ? parser.ParseValue<int>(commands.GetValueOrDefault(CropY), cultureInfo) : 0;
            var cropWidth = parser.ParseValue<int>(commands.GetValueOrDefault(CropWidth), cultureInfo);
            var cropHeight = parser.ParseValue<int>(commands.GetValueOrDefault(CropHeight), cultureInfo);

            return new Rectangle(cropX, cropY, cropWidth, cropHeight);
        }

        public bool RequiresTrueColorPixelFormat(CommandCollection commands, CommandParser parser, CultureInfo culture)
        {
            return true;
        }
    }
}

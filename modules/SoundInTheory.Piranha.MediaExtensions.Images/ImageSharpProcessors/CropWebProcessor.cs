using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Web;
using SixLabors.ImageSharp.Web.Commands;
using SixLabors.ImageSharp.Web.Processors;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

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
            var hasCropRect = GetCropRectangle(commands, parser, culture);

            if (hasCropRect != null) 
            {
                var cropRect = hasCropRect.Value;
                var ratio = (float)cropRect.Width / (float)cropRect.Height;

                var cropExceedsBounds = cropRect.X < 0 || cropRect.Y < 0 || cropRect.Right > image.Image.Width || cropRect.Bottom > image.Image.Height;

                if (cropExceedsBounds)
                {
                    using var copy = image.Image.Clone((x) => { });
                    using var backgroundImage = new Image<Rgba32>(Configuration.Default, cropRect.Width, cropRect.Height, parser.ParseValue<Color>(commands.GetValueOrDefault(BgColor), culture));

                    image.Image.Mutate(x =>
                    {
                        x.Resize(new ResizeOptions() { Size = new Size(cropRect.Width, cropRect.Height) });
                        x.DrawImage(backgroundImage, new Point(0, 0), 1);
                        x.DrawImage(copy, new Point(-cropRect.X, -cropRect.Y), 1);
                    });

                    return image;

                }
                else
                {
                    image.Image.Mutate(x => x.Crop(hasCropRect.Value));
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
            var hasCropX = commands.Any(x => x.Key == CropX);
            var hasCropY = commands.Any(x => x.Key == CropY);
            var hasCropWidth = commands.Any(x => x.Key == CropWidth);
            var hasCropHeight = commands.Any(x => x.Key == CropHeight);

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

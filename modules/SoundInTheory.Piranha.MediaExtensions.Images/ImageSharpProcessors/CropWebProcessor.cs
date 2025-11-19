using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
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

        private static readonly IEnumerable<string> CropCommands = new[]
        {
            CropX,
            CropY,
            CropWidth,
            CropHeight
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
            var cropRectangle = GetCropRectangle(commands, parser, culture);

            if(cropRectangle != null) 
            {
                image.Image.Mutate(x => x.Crop(cropRectangle.Value));
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

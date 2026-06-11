using SoundInTheory.Piranha.MediaExtensions.Images.Model;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services;

public interface IImageDataProvider
{
    ImageData? Resolve(object? image, ImageContext context);
}

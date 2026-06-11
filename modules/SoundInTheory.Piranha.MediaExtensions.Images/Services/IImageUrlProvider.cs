namespace SoundInTheory.Piranha.MediaExtensions.Images.Services;

public interface IImageUrlProvider
{
    string? Resolve(object? image, int? width, int? height, string? cropName);
}

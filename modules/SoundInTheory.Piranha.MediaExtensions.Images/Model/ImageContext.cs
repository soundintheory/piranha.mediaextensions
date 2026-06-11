using System.Collections.Generic;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Model;

public class ImageContext
{
    public int? Width { get; set; }
    public int? Height { get; set; }
    public string? CropName { get; set; }
    public IDictionary<string, string?> Params { get; set; } = new Dictionary<string, string?>();
}

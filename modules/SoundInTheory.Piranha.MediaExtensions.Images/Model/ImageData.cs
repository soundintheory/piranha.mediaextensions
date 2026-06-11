using System.Collections.Generic;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Model;

public class ImageData
{
    public string? Url { get; set; }
    public string? AltText { get; set; }
    public string? Title { get; set; }
    public Dictionary<string, object?> Metadata { get; set; } = new();
    public IDictionary<string, string?> Params { get; set; } = new Dictionary<string, string?>();
}

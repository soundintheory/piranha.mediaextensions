using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp.Formats.Webp;
using System;
using System.Collections.Generic;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    /// <summary>
    /// Options controlling automatic conversion of processed images to WebP.
    /// </summary>
    public class WebpConversionOptions
    {
        /// <summary>
        /// Whether conversion is active. The feature is already opt-in at the point AddWebpConversion
        /// is called; this exists so it can be switched off from configuration without changing wiring.
        /// </summary>
        public bool Enabled { get; set; } = true;

        /// <summary>
        /// Request path prefixes that opt in to conversion. When empty (the default) only the Piranha
        /// media root (<see cref="PiranhaMediaImageProviderOptions.RootName"/>) is converted.
        /// <para>
        /// Adding the remote provider root has a cost: that provider is ProcessingBehavior.CommandOnly,
        /// so injecting a command makes every remote URL get decoded and re-encoded instead of passing
        /// straight through.
        /// </para>
        /// </summary>
        public List<string> Roots { get; set; } = new();

        /// <summary>
        /// WebP quality (1-100). Values below 100 force lossy encoding.
        /// </summary>
        public int Quality { get; set; } = 75;

        /// <summary>
        /// Optional further customisation of the encoder used for converted images (Method,
        /// FileFormat, NearLossless, ...). Applied after <see cref="Quality"/>.
        /// </summary>
        public Action<WebpEncoder>? ConfigureEncoder { get; set; }

        /// <summary>
        /// Source formats that are never converted, by <c>IImageFormat.Name</c>.
        /// GIF is excluded because ImageSharp 2.1 cannot encode animated WebP.
        /// </summary>
        public HashSet<string> ExcludedFormats { get; set; } = new(StringComparer.OrdinalIgnoreCase)
        {
            "GIF"
        };

        /// <summary>
        /// Inject "autoorient=true" alongside the conversion. Recommended: browsers do not reliably
        /// honour EXIF orientation inside a WebP container, and ImageSharp.Web 2.0.2 does not
        /// auto-orient on its own. Note this changes output geometry for EXIF-rotated sources.
        /// </summary>
        public bool AutoOrient { get; set; } = true;

        /// <summary>
        /// Replace an explicit "?format=" supplied on the request. Defaults to false so callers who
        /// deliberately ask for png/jpg keep getting it.
        /// </summary>
        public bool OverrideExplicitFormat { get; set; }

        /// <summary>
        /// Final say on whether a request is converted. Runs after all other checks.
        /// </summary>
        public Func<HttpContext, bool>? ShouldConvert { get; set; }
    }
}

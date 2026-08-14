using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp.Web.Middleware;
using SixLabors.ImageSharp.Web.Processors;
using SoundInTheory.Piranha.MediaExtensions.Images.ImageSharpProcessors;
using System;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    /// <summary>
    /// Injects the commands that drive <see cref="AutoWebpWebProcessor"/> into in-scope requests.
    /// </summary>
    public sealed class WebpConversionCommandInjector(WebpConversionOptions options, PiranhaMediaImageProviderOptions mediaOptions)
    {
        /// <summary>
        /// Adds the conversion commands to the request when it is in scope.
        /// </summary>
        public Task InjectAsync(ImageCommandContext context)
        {
            if (!options.Enabled)
            {
                return Task.CompletedTask;
            }

            var http = context.Context;
            var commands = context.Commands;

            // Never silently override a deliberate "?format=png", and never re-inject.
            if (commands.Contains(AutoWebpWebProcessor.AutoWebp)
                || (commands.Contains(FormatWebProcessor.Format) && !options.OverrideExplicitFormat))
            {
                return Task.CompletedTask;
            }

            if (!IsInScope(http) || (options.ShouldConvert is not null && !options.ShouldConvert(http)))
            {
                return Task.CompletedTask;
            }

            // Insert at the front: processor order is the positional order of the commands, and the
            // format switch must precede any caller supplied "quality" (whose encoder would otherwise
            // be discarded by the Format setter). autoorient must precede the resize.
            var index = 0;

            if (options.AutoOrient && !commands.Contains(AutoOrientWebProcessor.AutoOrient))
            {
                commands.Insert(index++, AutoOrientWebProcessor.AutoOrient, bool.TrueString);
            }

            commands.Insert(index, AutoWebpWebProcessor.AutoWebp, bool.TrueString);

            return Task.CompletedTask;
        }

        private bool IsInScope(HttpContext http)
        {
            if (options.Roots is { Count: > 0 })
            {
                foreach (var root in options.Roots)
                {
                    if (http.Request.Path.StartsWithSegments(root, StringComparison.InvariantCultureIgnoreCase))
                    {
                        return true;
                    }
                }

                return false;
            }

            // Mirrors PiranhaMediaImageProvider.DefaultMatcher. The matched provider is not reachable
            // from ImageCommandContext, so scoping has to be by path.
            return http.Request.Path.StartsWithSegments(mediaOptions.RootName, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}

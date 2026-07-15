using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using SixLabors.ImageSharp.Web.DependencyInjection;
using System;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Startup;

public class ImageSharpWebStartupFilter : IStartupFilter
{
    /// <summary>
    /// Configures the application builder.
    /// </summary>
    /// <param name="next">The next filter</param>
    /// <returns>The configure action</returns>
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return app =>
        {
            app.UseImageSharp();
            next(app);
        };
    }
}
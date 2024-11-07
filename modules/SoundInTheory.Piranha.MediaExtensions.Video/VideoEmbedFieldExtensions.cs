using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Piranha;
using Piranha.AspNetCore;
using SoundInTheory.Piranha.MediaExtensions.Video;
using SoundInTheory.Piranha.MediaExtensions.Video.Fields;
using SoundInTheory.Piranha.MediaExtensions.Video.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.CompilerServices;

public static class VideoEmbedFieldExtensions
{
    /// <summary>
    /// Adds the ImageField2 module.
    /// </summary>
    /// <param name="services">The current service collection</param>
    /// <returns>The services</returns>
    public static IServiceCollection AddVideoEmbedField(this IServiceCollection services)
    {
        // Add the Cropped ImageField module
        Piranha.App.Modules.Register<VideoEmbedFieldModule>();

        services.AddScoped<VideoEmbedService>();

        // Return the service collection
        return services;
    }

    /// <summary>
    /// Adds the ImageField2 module.
    /// </summary>
    /// <param name="serviceBuilder"></param>
    /// <returns></returns>
    public static PiranhaServiceBuilder UseVideoEmbedField(this PiranhaServiceBuilder serviceBuilder)
    {
        serviceBuilder.Services.AddVideoEmbedField();

        return serviceBuilder;
    }

    public static PiranhaApplicationBuilder UseVideoEmbedField(this PiranhaApplicationBuilder applicationBuilder)
    {
        applicationBuilder.Builder.UseVideoEmbedField();

        return applicationBuilder;
    }

    /// <summary>
    /// Uses the ImageField2.
    /// </summary>
    /// <param name="builder">The application builder</param>
    /// <returns>The builder</returns>
    public static IApplicationBuilder UseVideoEmbedField(this IApplicationBuilder builder)
    {
        builder.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = FileProvider,
            RequestPath = "/manager/MediaExtensions/Video"
        });

        App.Fields.Register<VideoEmbedField>();
        App.Modules.Manager().Scripts.Add("~/manager/MediaExtensions/Video/assets/js/video-embed-field.js");
        App.Modules.Manager().Styles.Add("~/manager/MediaExtensions/Video/assets/css/video-embed-field.css");


        return builder;
    }

    /// <summary>
    /// Static accessor to ImageField2 module if it is registered in the Piranha application.
    /// </summary>
    /// <param name="modules">The available modules</param>
    /// <returns>The ImageField2 module</returns>
    public static VideoEmbedFieldModule VideoEmbedField(this Piranha.Runtime.AppModuleList modules)
    {
        return modules.Get<VideoEmbedFieldModule>();
    }

    private static IFileProvider FileProvider
    {
        get
        {
            if (IsDebugBuild)
            {
                return new PhysicalFileProvider(GetProjectPath("public"));
            }

            return new EmbeddedFileProvider(typeof(VideoEmbedFieldModule).Assembly, "SoundInTheory.Piranha.MediaExtensions.Video.public");
        }
    }

    private static string GetProjectPath(string path = null)
    {
        var filePath = GetCurrentFilePath() ?? "";
        var dir = Directory.GetParent(filePath).FullName;

        if (!string.IsNullOrWhiteSpace(path))
        {
            return Path.Join(dir, path);
        }

        return dir;
    }

    private static string GetCurrentFilePath([CallerFilePath] string callerFilePath = null) => callerFilePath;

    private static bool IsDebugBuild
    {
        get
        {
#if DEBUG
            return true;
#else
                return false;
#endif
        }
    }
}

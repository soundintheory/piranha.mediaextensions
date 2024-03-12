using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Piranha;
using Piranha.AspNetCore;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Providers;
using SoundInTheory.Piranha.MediaExtensions.Images;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using SoundInTheory.Piranha.MediaExtensions.Images.Helpers;
using SoundInTheory.Piranha.MediaExtensions.Images.Modules;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.CompilerServices;

public static class ImagesExtensions
{
    /// <summary>
    /// Adds the ImageField2 module.
    /// </summary>
    /// <param name="serviceBuilder"></param>
    /// <returns></returns>
    public static PiranhaServiceBuilder UseCroppedImageField(this PiranhaServiceBuilder serviceBuilder)
    {
        serviceBuilder.Services.AddCroppedImageField();

        return serviceBuilder;
    }

    public static PiranhaServiceBuilder UseGalleryField(this PiranhaServiceBuilder serviceBuilder)
    {
        serviceBuilder.Services.AddGalleryField();
        return serviceBuilder;
    }

    public static PiranhaServiceBuilder UseImageSharpForMedia(this PiranhaServiceBuilder serviceBuilder, Action<IImageSharpBuilder> opts)
    { 
        var imageSharpBuilder = serviceBuilder.Services.AddImageSharp();
        opts(imageSharpBuilder);

        return serviceBuilder;
    }

    public static PiranhaApplicationBuilder UseImageSharpForMedia(this PiranhaApplicationBuilder applicationBuilder)
    {
        applicationBuilder.Builder.UseImageSharp();

        return applicationBuilder;
    }

    /// <summary>
    /// Uses the ImageField2 module.
    /// </summary>
    /// <param name="applicationBuilder">The current application builder</param>
    /// <returns>The builder</returns>
    public static PiranhaApplicationBuilder UseCroppedImageField(this PiranhaApplicationBuilder applicationBuilder)
    {
        applicationBuilder.Builder.UseCroppedImageField();

        return applicationBuilder;
    }

    public static PiranhaApplicationBuilder UseGalleryField(this PiranhaApplicationBuilder applicationBuilder)
    {
        applicationBuilder.Builder.UseGalleryField();

        return applicationBuilder;
    }

    /// <summary>
    /// Adds the ImageField2 module.
    /// </summary>
    /// <param name="services">The current service collection</param>
    /// <returns>The services</returns>
    public static IServiceCollection AddCroppedImageField(this IServiceCollection services)
    {
        // Add the Cropped ImageField module
        Piranha.App.Modules.Register<CroppedImageFieldModule>();

        
        services.AddScoped<MediaCropService>();
        services.AddScoped<MediaCropHelper>();

        // Return the service collection
        return services;
    }

    public static IServiceCollection AddGalleryField(this IServiceCollection services)
    {
        Piranha.App.Modules.Register<GalleryFieldModule>();

        return services;
    }

    /// <summary>
    /// Uses the ImageField2.
    /// </summary>
    /// <param name="builder">The application builder</param>
    /// <returns>The builder</returns>
    public static IApplicationBuilder UseCroppedImageField(this IApplicationBuilder builder)
    {
        builder.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = FileProvider,
            RequestPath = "/manager/CroppedImageField/assets"
        });

        App.Fields.Register<CroppedImageField>();
        App.Modules.Manager().Scripts.Add("~/manager/CroppedImageField/assets/js/cropped-image-field.js");
        App.Modules.Manager().Styles.Add("~/manager/CroppedImageField/assets/css/image-editor.css");


        return builder;
    }


    public static IApplicationBuilder UseGalleryField(this IApplicationBuilder builder)
    {
        builder.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = FileProvider,
            RequestPath = "/manager/GalleryField/assets"
        });

        App.Fields.Register<GalleryField>();
        App.Modules.Manager().Scripts.Add("~/manager/GalleryField/assets/js/gallery-field.js");
        App.Modules.Manager().Styles.Add("~/manager/GalleryField/assets/css/gallery-field.css");


        return builder;
    }

    /// <summary>
    /// Static accessor to ImageField2 module if it is registered in the Piranha application.
    /// </summary>
    /// <param name="modules">The available modules</param>
    /// <returns>The ImageField2 module</returns>
    public static CroppedImageFieldModule ImageField2(this Piranha.Runtime.AppModuleList modules)
    {
        return modules.Get<CroppedImageFieldModule>();
    }

    private static IFileProvider FileProvider
    {
        get
        {
            if (IsDebugBuild)
            {
                return new PhysicalFileProvider(GetProjectPath("assets"));
            }

            return new EmbeddedFileProvider(typeof(CroppedImageFieldModule).Assembly, "SoundInTheory.Piranha.Media.Images.assets");
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

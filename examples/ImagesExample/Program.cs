using Microsoft.EntityFrameworkCore;
using Piranha;
using Piranha.AspNetCore.Identity.SQLite;
using Piranha.AttributeBuilder;
using Piranha.Data.EF.SQLite;
using Piranha.Manager.Editor;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Providers;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;

var builder = WebApplication.CreateBuilder(args);

builder.AddPiranha(options =>
{
    /**
     * This will enable automatic reload of .cshtml
     * without restarting the application. However since
     * this adds a slight overhead it should not be
     * enabled in production.
     */
    options.AddRazorRuntimeCompilation = true;

    options.UseCms();
    options.UseManager();

    options.UseFileStorage(naming: Piranha.Local.FileStorageNaming.UniqueFolderNames);
    options.UseImageSharp();
    options.UseTinyMCE();
    options.UseMemoryCache();

    options.UseCroppedImageField();
    options.UseImageSharpForMedia((opts) =>
    {
        opts
            .RemoveProvider<PhysicalFileSystemProvider>()
            .Configure<PiranhaMediaImageProviderOptions>(o => o.RootName = "/piranha-media")
            .AddProvider<PiranhaMediaImageProvider>()
            .Configure<RemoteImageProviderOptions>(o =>
            {
                o.RootName = "/remote";
                o.WhiteList = new List<string>()
                {
                    "upload.wikimedia.org"
                };
            })
            .AddProvider<RemoteImageProvider>();
    });
    options.UseGalleryField();


    var connectionString = builder.Configuration.GetConnectionString("piranha");
    options.UseEF<SQLiteDb>(db => db.UseSqlite(connectionString));
    options.UseIdentityWithSeed<IdentitySQLiteDb>(db => db.UseSqlite(connectionString));

    /**
     * Here you can configure the different permissions
     * that you want to use for securing content in the
     * application.
    options.UseSecurity(o =>
    {
        o.UsePermission("WebUser", "Web User");
    });
     */

    /**
     * Here you can specify the login url for the front end
     * application. This does not affect the login url of
     * the manager interface.
    options.LoginUrl = "login";
     */
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UsePiranha(options =>
{
    // Initialize Piranha
    App.Init(options.Api);

    // Build content types
    new ContentTypeBuilder(options.Api)
        .AddAssembly(typeof(Program).Assembly)
        .Build()
        .DeleteOrphans();

    // Configure Tiny MCE
    EditorConfig.FromFile("editorconfig.json");

    options.UseCroppedImageField();
    options.UseImageSharpForMedia();
    options.UseGalleryField();
    options.UseManager();
    options.UseTinyMCE();
    options.UseIdentity();
});

app.Run();
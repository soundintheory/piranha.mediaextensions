# Piranha Media Extensions

Various enhancements to Piranha CMS media

## Cropped Image Field

An image field that allows multiple crops on a single image.

Only filesystem storage supported for now.

Supports cropping settings and multiple crops.

```cs
//In Piranha WebApplicationBuilder...
options.UseCroppedImageField();
//etc

//In PiranhaApplicationBuilder
options.UseCroppedImageField();
//etc
```

Then configure in Piranha content/model/etc

```cs
[Field, CroppedImageFieldSettings(AspectRatio = 16d / 9d, MinWidth = 100, MinHeight = 100, Crops = new string[] { "Default", "Second Crop" })]
public CroppedImageField TestImageFieldWithSettings { get; set; } 
[Field]
public CroppedImageField TestImageFieldWithoutSettings { get; set; }
```

## Image Sharp Providers

Providers and resolvers for [ImageSharp.Web](https://sixlabors.com/products/imagesharp-web/)

There is both a provider for Piranha Media and limited support for Remote Images as well.

Simply configure...

```cs
//In Piranha WebApplicationBuilder...
options.UseImageSharpForMedia((opts) =>
{
    opts
        //PhysicalFileSystemProvider cannot be first in the list. You can add it later on.
        .RemoveProvider<PhysicalFileSystemProvider>()

        .Configure<PiranhaMediaImageProviderOptions>(o => o.RootName = "/piranha-media")
        .AddProvider<PiranhaMediaImageProvider>()

        .Configure<RemoteImageProviderOptions>(o =>
        {
            o.RootName = "/remote";
            //A whitelist is necessary as it prevents any hijacking of your endpoint
            o.WhiteList = new List<string>()
            {
                "upload.wikimedia.org"
                //etc
            };
        })
        .AddProvider<RemoteImageProvider>();
});
//etc

//In PiranhaApplicationBuilder
options.UseImageSharpForMedia();
//etc
```

## Gallery Field

Field that supports multiple images

```cs
//In Piranha WebApplicationBuilder...
options.UseGalleryField();
//etc

//In PiranhaApplicationBuilder
options.UseGalleryField();
//etc
```

Then configure in Piranha content/model/etc

```cs
[Field]
public GalleryField TestGalleryField { get; set; }

//In your view/wherever you want to access
foreach(var image in TestGalleryField.Images){
//Use as if it's a normal image field.
}
```

Examples are provided in repo.
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

Simply configure the services **before** the `AddPiranha` call. The middleware is inserted into the
pipeline automatically, so there is nothing to add in `UsePiranha`.

```cs
//Before builder.AddPiranha(...)
builder.Services.UseImageSharpWeb(o =>
    {
        //Root path the Piranha media provider matches on (default "/image")
        o.RootName = "/image";
    })
    .AddRemoteImageProvider(o =>
    {
        //A whitelist is necessary as it prevents any hijacking of your endpoint
        o.WhiteList = [
            "upload.wikimedia.org"
            //etc
        ];
    });
```

Images are then served from `/image/{mediaId}?width=600&height=400`, and remote images from
`/remote/{url}`.

### Automatic WebP conversion

`AddWebpConversion` makes images served through the middleware come back as WebP without the caller
having to append `?format=webp` to every URL. Typical saving is 25-65% on JPEG sources.

```cs
builder.Services.UseImageSharpWeb()
    .AddWebpConversion(o =>
    {
        o.Quality = 80;
    });
```

It works by injecting an `autowebp` command during command parsing, which is picked up by
`AutoWebpWebProcessor` after the image has been decoded. Deciding after the decode means the real
source format is known, so sources that must not be converted are excluded reliably.

| Option | Default | Description |
| --- | --- | --- |
| `Enabled` | `true` | Switch conversion off without changing wiring. |
| `Roots` | *(empty)* | Path prefixes to convert. When empty, only the Piranha media root is converted. |
| `Quality` | `75` | WebP quality (1-100). Below 100 forces lossy encoding. |
| `ConfigureEncoder` | `null` | Further customisation of the `WebpEncoder` (`Method`, `FileFormat`, `NearLossless`, ...). |
| `ExcludedFormats` | `{ "GIF" }` | Source formats never converted, by `IImageFormat.Name`. |
| `AutoOrient` | `true` | Also inject `autoorient`, so EXIF rotation is applied before the resize. |
| `OverrideExplicitFormat` | `false` | Whether to override a `?format=` supplied on the request. |
| `ShouldConvert` | `null` | Final per-request say on whether to convert. |

Per request, `?autowebp=false` opts out and an explicit `?format=jpg` still wins.

**GIF is excluded** because ImageSharp 2.1 has no animated WebP encoder - converting an animated GIF
would silently flatten it to its first frame. There is a second guard in the processor that leaves any
multi-frame image alone even if `ExcludedFormats` is cleared.

Note that the remote provider is `ProcessingBehavior.CommandOnly`, so adding its root to `Roots` means
every remote URL gets decoded and re-encoded rather than passing straight through.

#### Before you enable it

- **Clear the ImageSharp cache** (`wwwroot/is-cache` by default). Every URL gains commands, so every
  cache key changes and the old entries are orphaned rather than reused.
- **`/image/{mediaId}` with no query stops being a byte copy** - it now decodes and re-encodes. Cold
  cache CPU goes up, bytes served go down.
- **URLs keep no file extension while the payload is WebP.** Browsers honour the `Content-Type`, but
  tooling that infers the type from the URL will guess wrong.
- **`autoorient` changes output geometry for EXIF-rotated sources.** A portrait phone photo requested at
  `?width=600` currently comes back 600px *tall* (the browser rotates it on display); with auto-orient it
  comes back 600px *wide*. Set `AutoOrient = false` to keep the old geometry.
- **PNG sources become lossy WebP** at the default quality. For flat-colour graphics, raise `Quality` or
  use `ConfigureEncoder` with `FileFormat = WebpFileFormatType.Lossless`.
- **Do not route SVG through `/image`** - SVG is not an ImageSharp format, so those requests fail
  regardless of this feature. Use `media.PublicUrl` instead.

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

## Extended Media Manager

Supports filtering and ordering on both mediapicker and media views. 

```cs
//In Piranha WebApplicationBuilder...
options.UseMediaManager();
//etc

//In PiranhaApplicationBuilder
options.UseMediaManager();
//etc
```

Examples are provided in repo.
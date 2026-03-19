using Piranha.Extend;
using System;

namespace SoundInTheory.Piranha.MediaExtensions.Images
{
    /// <summary>
    /// Field settings for the gallery field.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class GalleryFieldSettingsAttribute : FieldSettingsAttribute
    {
        /// <summary>
        /// The folder path to upload gallery images into.
        /// Supports nested paths (e.g. "Blog/Headers") and the {id} placeholder,
        /// which is replaced with the content item's ID at upload time.
        /// If not specified, images are uploaded to the media root.
        /// </summary>
        public string UploadFolder { get; set; }
    }
}

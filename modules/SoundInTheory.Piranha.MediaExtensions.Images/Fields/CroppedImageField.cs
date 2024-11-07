using Piranha.Extend.Fields;
using Piranha.Extend;
using Piranha;
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using SoundInTheory.Piranha.MediaExtensions.Images.Model;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Fields
{
    [FieldType(Name = "Image", Shorthand = "Image", Component = "cropped-image-field")]
    public class CroppedImageField : ImageField
    {
        public Dictionary<string, CropSettings> CropData { get; set; }

        [JsonIgnore]
        public CropSettings Crop
        {
            get
            {
                if (CropData == null) return null;

                return CropData.FirstOrDefault().Value;
            }
            set
            {
                CropData ??= new Dictionary<string, CropSettings>();
                CropData["Default"] = value;
            }
        }

        /// <summary>
        /// Accessor for crop data
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public CropSettings this[string key]
        {
            get
            {
                if (CropData == null) return null;

                return CropData.TryGetValue(key, out CropSettings cropData) ? cropData : null;
            }
        }

        /// <summary>
        /// Implicit operator for converting a Guid id to a field.
        /// </summary>
        /// <param name="guid">The guid value</param>
        public static implicit operator CroppedImageField(Guid guid)
        {
            return new CroppedImageField { Id = guid };
        }

        /// <summary>
        /// Implicit operator for converting a media object to a field.
        /// </summary>
        /// <param name="media">The media object</param>
        public static implicit operator CroppedImageField(global::Piranha.Models.Media media)
        {
            return new CroppedImageField { Id = media.Id };
        }

        /// <summary>
        /// Impicit operator for converting the field to an url string.
        /// </summary>
        /// <param name="image">The image field</param>
        public static implicit operator string(CroppedImageField image)
        {
            if (image.Media != null)
            {
                return image.Media.PublicUrl;
            }
            return "";
        }
    }
}

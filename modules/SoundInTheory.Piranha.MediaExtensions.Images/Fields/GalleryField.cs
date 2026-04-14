using Piranha.Extend;
using Piranha.Extend.Fields;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Fields
{
    [FieldType(Name = "Gallery Field", Shorthand = "GalleryField", Component = "gallery-field")]
    public class GalleryField : IField
    {
        public List<global::Piranha.Models.Media> Images { get; set; }

        public bool IsEmpty => Images == null || Images.Count == 0;

        public int ImageCount => Images?.Count ?? 0;

        public string GetTitle()
        {
            return "Gallery";
        }
    }
}

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

        public string GetTitle()
        {
            return "Gallery";
        }
    }
}

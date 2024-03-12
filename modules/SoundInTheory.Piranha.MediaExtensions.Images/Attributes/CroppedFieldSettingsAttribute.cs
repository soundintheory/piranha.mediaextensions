using Piranha.Extend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images
{
    /// <summary>
    /// Field settings for image field 2
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class CroppedImageFieldSettingsAttribute : FieldSettingsAttribute
    {
        /// <summary>
        /// Fix the aspect ratio of the crop
        /// </summary>
        public double AspectRatio { get; set; }

        /// <summary>
        /// The minimum width of the crop area in pixels
        /// </summary>
        public int MinWidth { get; set; }

        /// <summary>
        /// The minimum height of the crop area in pixels
        /// </summary>
        public int MinHeight { get; set; }


        ///<summary>
        /// The number of named crops we want. Leave blank for the default of 1
        /// </summary>
        public string[] Crops { get; set; } = Array.Empty<string>();
    }
}

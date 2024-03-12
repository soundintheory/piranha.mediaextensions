using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Model
{
    public class CropSettings
    {
        public int x { get; set; }

        public int y { get; set; }

        public int width { get; set; }

        public int height { get; set; }

        public float zoom { get; set; }

        [JsonIgnore]
        public bool IsEmpty => width == 0 && height == 0;
    }
}

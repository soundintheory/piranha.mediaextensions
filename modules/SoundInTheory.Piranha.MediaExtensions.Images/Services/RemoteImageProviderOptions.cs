using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    public class RemoteImageProviderOptions
    {
        /// <summary>
        /// Root path to match against (eg - /remote/)
        /// </summary>
        public string RootName { get; set; } = "/remote";


        /// <summary>
        /// Allowed hostnames
        /// </summary>
        public List<string> WhiteList { get; set; }
    }
}

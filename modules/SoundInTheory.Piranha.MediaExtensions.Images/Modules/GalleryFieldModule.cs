using Piranha.Manager.Extend;
using Piranha.Manager;
using Piranha.Security;
using Piranha;
using SoundInTheory.Piranha.Media.Images.Serializers;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Piranha.Extend;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Modules
{
    public class GalleryFieldModule : IModule
    {
        private readonly List<PermissionItem> _permissions = new List<PermissionItem>
        {

        };

        /// <summary>
        /// Gets the module author
        /// </summary>
        public string Author => "Sound in Theory";

        /// <summary>
        /// Gets the module name
        /// </summary>
        public string Name => "Gallery Field";

        /// <summary>
        /// Gets the module version
        /// </summary>
        public string Version => Utils.GetAssemblyVersion(GetType().Assembly);

        /// <summary>
        /// Gets the module description
        /// </summary>
        public string Description => "Gallery field for multiple images";

        /// <summary>
        /// Gets the module package url
        /// </summary>
        public string PackageUrl => "";

        /// <summary>
        /// Gets the module icon url
        /// </summary>
        public string IconUrl => "/manager/CroppedImageField/images/logo.svg";

        public void Init()
        {
            // Register permissions
            foreach (var permission in _permissions)
            {
                App.Permissions["GalleryField"].Add(permission);
            }

        }
    }
}

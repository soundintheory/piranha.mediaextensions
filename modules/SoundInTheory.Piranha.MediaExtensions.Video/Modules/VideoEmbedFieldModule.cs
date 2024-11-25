using Piranha;
using Piranha.Extend;
using Piranha.Security;
using SoundInTheory.Piranha.Media.Video.Serializers;
using SoundInTheory.Piranha.MediaExtensions.Video.Fields;

namespace SoundInTheory.Piranha.MediaExtensions.Video
{
    public class VideoEmbedFieldModule : IModule
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
        public string Name => "Video Embed Field";

        /// <summary>
        /// Gets the module version
        /// </summary>
        public string Version => Utils.GetAssemblyVersion(GetType().Assembly);

        /// <summary>
        /// Gets the module description
        /// </summary>
        public string Description => "Flexible field for video embeds";

        /// <summary>
        /// Gets the module package url
        /// </summary>
        public string PackageUrl => "";

        /// <summary>
        /// Gets the module icon url
        /// </summary>
        public string IconUrl => "/manager/VideoEmbedField/images/logo.svg";

        public void Init()
        {
            // Register permissions
            foreach (var permission in _permissions)
            {
                App.Permissions["VideoEmbedField"].Add(permission);
            }

            App.Serializers.Register<VideoEmbedField>(new VideoEmbedFieldSerializer());
        }
    }
}

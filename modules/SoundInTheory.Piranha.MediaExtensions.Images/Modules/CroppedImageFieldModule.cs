using Piranha;
using Piranha.Extend;
using Piranha.Extend.Serializers;
using Piranha.Manager;
using Piranha.Manager.Extend;
using Piranha.Security;
using SoundInTheory.Piranha.Media.Images.Serializers;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoundInTheory.Piranha.MediaExtensions.Images
{
    public class CroppedImageFieldModule : IModule
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
        public string Name => "Cropped Image Field";

        /// <summary>
        /// Gets the module version
        /// </summary>
        public string Version => Utils.GetAssemblyVersion(GetType().Assembly);

        /// <summary>
        /// Gets the module description
        /// </summary>
        public string Description => "Enhanced image field with cropping functionality";

        /// <summary>
        /// Gets the module package url
        /// </summary>
        public string PackageUrl => "";

        /// <summary>
        /// Gets the module icon url
        /// </summary>
        public string IconUrl => "/manager/ImageField2/images/logo.svg";

        public void Init()
        {
            // Register permissions
            foreach (var permission in _permissions)
            {
                App.Permissions["CroppedImageField"].Add(permission);
            }

            // Add "edit" tab to the media modal
            Actions.Modals.MediaPreview.Add(new ModalAction
            {
                InternalId = "Edit",
                Title = "Edit",
                Component = "image-editor",
                Css = "fas fa-crop",
                ComponentScript = "~/manager/CroppedImageField/assets/js/image-editor.js"
            });

            App.Serializers.Register<CroppedImageField>(new CroppedImageFieldSerializer());
        }
    }
}

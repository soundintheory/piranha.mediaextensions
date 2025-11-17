using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images
{
    public class MediaManagerRoutingConvention : IPageRouteModelConvention
    {
        public void Apply(PageRouteModel model)
        {
            //Remove the old media manager
            if (model.RelativePath == "/Areas/Manager/Pages/MediaList.cshtml")
            {
                model.Selectors.RemoveAt(0);
            }

            if(model.RelativePath == "/Areas/Manager/Pages/MediaManager/Index.cshtml")
            {
                model.Selectors[0].AttributeRouteModel.Template = "manager/media/{folderId?}";
            }
        }
    }
}

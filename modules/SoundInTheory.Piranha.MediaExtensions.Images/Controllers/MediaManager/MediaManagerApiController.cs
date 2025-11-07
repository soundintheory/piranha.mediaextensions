using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Piranha;
using Piranha.Manager;
using Piranha.Manager.Models;
using Piranha.Manager.Services;
using Piranha.Models;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Controllers.MediaManager
{

    [Area("Manager")]
    [Route("manager/api/mediamanager")]
    [Authorize(Policy = Permission.Admin)]
    [ApiController]
    [AutoValidateAntiforgeryToken]
    public class MediaManagerApiController : Controller
    {
        private readonly MediaManagerService _service;
        private readonly IApi _api;
        private readonly ManagerLocalizer _localizer;

        public MediaManagerApiController(MediaManagerService service, IApi api, ManagerLocalizer localizer)
        {
            _service = service;
            _api = api;
            _localizer = localizer;
        }

        /// <summary>
        /// Gets the list model.
        /// </summary>
        /// <returns>The list model</returns>
        [Route("list/{folderId:Guid?}")]
        [HttpGet]
        public async Task<MediaListModel> List(Guid? folderId = null, [FromQuery] MediaType? filter = null, [FromQuery] int? width = null, [FromQuery] int? height = null)
        {
            return await _service.GetList(folderId, filter, width, height);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Piranha;
using Piranha.Manager;
using Piranha.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Controllers.Gallery
{
    [Area("Manager")]
    [Route("manager/api/gallery")]
    [Authorize(Policy = Permission.MediaAdd)]
    [ApiController]
    [AutoValidateAntiforgeryToken]
    public class GalleryApiController : Controller
    {
        private readonly IApi _api;

        public GalleryApiController(IApi api)
        {
            _api = api;
        }

        // =====================================================================
        // UPLOAD
        // =====================================================================

        /// <summary>
        /// Uploads a single image file into the specified folder path,
        /// overwriting any existing file with the same name.
        /// Returns the saved media object for use by the gallery field.
        ///
        /// The folderPath is expected to be the static value from
        /// GalleryFieldSettingsAttribute.UploadFolder, or null/empty to upload
        /// to the media root.
        /// </summary>
        [Route("upload")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload(
            [FromForm] IFormFile file,
            [FromForm] string folderPath = null,
            [FromForm] string title = null)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided");

            var folderId = await ResolveFolderPath(folderPath);

            // Overwrite: delete existing media with the same filename in the target folder
            var existing = (await _api.Media.GetAllByFolderIdAsync(folderId))
                .FirstOrDefault(m => string.Equals(m.Filename, file.FileName, StringComparison.OrdinalIgnoreCase));

            if (existing != null)
                await _api.Media.DeleteAsync(existing.Id);

            // Pre-generate the ID so we can retrieve the saved media directly by ID
            // rather than by filename — avoids any folder-level cache stale reads.
            var mediaId = Guid.NewGuid();

            using (var stream = file.OpenReadStream())
            {
                await _api.Media.SaveAsync(new StreamMediaContent
                {
                    Id = mediaId,
                    FolderId = folderId,
                    Filename = file.FileName,
                    Data = stream
                });
            }

            var media = await _api.Media.GetByIdAsync(mediaId);

            if (media == null)
                return StatusCode(500, "Upload succeeded but media could not be retrieved");

            if (!string.IsNullOrWhiteSpace(title))
            {
                media.Title = title;
                await _api.Media.SaveAsync(media);
            }

            return Ok(new
            {
                id = media.Id,
                folderId = media.FolderId,
                type = media.Type.ToString(),
                filename = media.Filename,
                title = media.Title,
                contentType = media.ContentType,
                publicUrl = media.PublicUrl
            });
        }

        // =====================================================================
        // TITLE UPDATE
        // =====================================================================

        /// <summary>
        /// Updates the title of an existing media item.
        /// Called by the gallery field's title input for already-saved images.
        /// Pending (not-yet-uploaded) images have their title sent during upload instead.
        /// </summary>
        [Route("media/{id}/title")]
        [HttpPatch]
        [Consumes("application/json")]
        public async Task<IActionResult> UpdateTitle(Guid id, [FromBody] string title)
        {
            var media = await _api.Media.GetByIdAsync(id);
            if (media == null)
                return NotFound();

            media.Title = title ?? string.Empty;
            await _api.Media.SaveAsync(media);
            return Ok();
        }

        // =====================================================================
        // PRIVATE HELPERS
        // =====================================================================

        /// <summary>
        /// Resolves a slash-separated folder path against the media structure,
        /// creating any missing folders along the way.
        /// Returns null (media root) for an empty or null path.
        /// </summary>
        private async Task<Guid?> ResolveFolderPath(string folderPath)
        {
            if (string.IsNullOrWhiteSpace(folderPath))
                return null;

            var segments = folderPath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            Guid? currentParentId = null;

            foreach (var segment in segments)
            {
                var folders = await _api.Media.GetAllFoldersAsync(currentParentId);
                var match = folders.FirstOrDefault(f =>
                    string.Equals(f.Name, segment, StringComparison.OrdinalIgnoreCase));

                if (match != null)
                {
                    currentParentId = match.Id;
                }
                else
                {
                    var newFolder = new MediaFolder
                    {
                        Id = Guid.NewGuid(),
                        Name = segment,
                        ParentId = currentParentId
                    };
                    await _api.Media.SaveFolderAsync(newFolder);
                    currentParentId = newFolder.Id;
                }
            }

            return currentParentId;
        }
    }
}

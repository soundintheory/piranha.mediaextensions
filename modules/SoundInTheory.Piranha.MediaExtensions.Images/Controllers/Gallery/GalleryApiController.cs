using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Piranha;
using Piranha.Manager;
using Piranha.Models;
using System;
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
        /// Uploads a single image file to the media root.
        /// Folder assignment is handled server-side by GallerySyncHooks on save.
        /// </summary>
        [Route("upload")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload(
            [FromForm] IFormFile file,
            [FromForm] string title = null,
            [FromForm] string altText = null,
            [FromForm] string description = null)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided");

            var mediaId = Guid.NewGuid();

            using (var stream = file.OpenReadStream())
            {
                await _api.Media.SaveAsync(new StreamMediaContent
                {
                    Id = mediaId,
                    FolderId = null,
                    Filename = file.FileName,
                    Data = stream
                });
            }

            var media = await _api.Media.GetByIdAsync(mediaId);

            if (media == null)
                return StatusCode(500, "Upload succeeded but media could not be retrieved");

            if (!string.IsNullOrWhiteSpace(title) || !string.IsNullOrWhiteSpace(altText) || !string.IsNullOrWhiteSpace(description))
            {
                if (!string.IsNullOrWhiteSpace(title)) media.Title = title;
                if (!string.IsNullOrWhiteSpace(altText)) media.AltText = altText;
                if (!string.IsNullOrWhiteSpace(description)) media.Description = description;
                await _api.Media.SaveAsync(media);
            }

            return Ok(new
            {
                id = media.Id,
                folderId = media.FolderId,
                type = media.Type.ToString(),
                filename = media.Filename,
                title = media.Title,
                altText = media.AltText,
                description = media.Description,
                contentType = media.ContentType,
                publicUrl = media.PublicUrl
            });
        }

        // =====================================================================
        // DELETE
        // =====================================================================

        /// <summary>
        /// Immediately deletes a single media item.
        /// Called when the user removes an image from the gallery.
        /// </summary>
        [Route("media/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteMedia(Guid id)
        {
            var media = await _api.Media.GetByIdAsync(id);
            if (media == null)
                return NotFound();

            await _api.Media.DeleteAsync(id);
            return Ok();
        }

        // =====================================================================
        // METADATA UPDATE
        // =====================================================================

        public class GalleryMediaMetadata
        {
            public string Title { get; set; }
            public string AltText { get; set; }
            public string Description { get; set; }
        }

        /// <summary>
        /// Updates the title, alt text, and/or description of an existing media item.
        /// </summary>
        [Route("media/{id}/metadata")]
        [HttpPatch]
        [Consumes("application/json")]
        public async Task<IActionResult> UpdateMetadata(Guid id, [FromBody] GalleryMediaMetadata metadata)
        {
            var media = await _api.Media.GetByIdAsync(id);
            if (media == null)
                return NotFound();

            media.Title = metadata.Title ?? string.Empty;
            media.AltText = metadata.AltText ?? string.Empty;
            media.Description = metadata.Description ?? string.Empty;
            await _api.Media.SaveAsync(media);
            return Ok();
        }
    }
}

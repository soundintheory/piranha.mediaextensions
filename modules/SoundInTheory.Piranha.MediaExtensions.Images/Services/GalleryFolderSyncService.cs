using Piranha;
using Piranha.Models;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    public class GalleryFolderSyncService(IApi _api)
    {
        // The full .NET type name as stored by Piranha's ContentTypeBuilder
        private static readonly string GalleryFieldTypeName = typeof(GalleryField).ToString();

        public async Task SyncAsync(ContentTypeBase contentType, Guid contentId, dynamic regions)
        {
            var regionDict = (IDictionary<string, object>)regions;

            var galleryFields = contentType.Regions
                .SelectMany(r => r.Fields
                    .Where(f => f.Type == GalleryFieldTypeName
                                && f.Settings.TryGetValue("SyncToMediaFolder", out var v)
                                && v is string s && !string.IsNullOrEmpty(s))
                    .Select(f => new
                    {
                        Template = (string)f.Settings["SyncToMediaFolder"],
                        Field = regionDict.TryGetValue(r.Id, out var ro)
                             && ((IDictionary<string, object>)(ExpandoObject)ro).TryGetValue(f.Id, out var fo)
                             && fo is GalleryField gf ? gf : null
                    }))
                .Where(x => x.Field?.ImageCount > 0)
                .ToList();

            if (!galleryFields.Any()) return;

            foreach (var x in galleryFields)
            {
                if (string.IsNullOrWhiteSpace(x.Template)) continue;

                // TODO: Allow arbitrary tokens in the template that relate to fields on the parent content object
                var targetPath = x.Template
                    .Replace("{id}", contentId.ToString(), StringComparison.OrdinalIgnoreCase);

                var targetFolderId = await ResolveFolderPath(targetPath);
                var existingMedia = await _api.Media.GetAllByFolderIdAsync(targetFolderId);
                var galleryMedia = x.Field!.Images ?? new List<global::Piranha.Models.Media>();

                // If we have a target folder, delete any existing images not present in the gallery
                if (targetFolderId.HasValue)
                {
                    foreach (var existingMediaItem in existingMedia)
                    {
                        if (!galleryMedia.Any(x => x.Id == existingMediaItem.Id))
                        {
                            await _api.Media.DeleteAsync(existingMediaItem.Id);
                        }
                    }
                }

                // Move the gallery images to the target folder
                foreach (var m in galleryMedia.Where(m => m.FolderId != targetFolderId))
                {
                    m.FolderId = targetFolderId;
                    await _api.Media.SaveAsync(m);
                }
            }
        }

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

using Piranha;
using Piranha.Manager.Models;
using Piranha.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Services
{
    public class MediaManagerService
    {

        private readonly IApi _api;

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="api">The default api</param>
        public MediaManagerService(IApi api)
        {
            _api = api;
        }

        /// <summary>
        /// Gets the list model for the specified folder, or the root
        /// folder if no folder id is given.
        /// </summary>
        /// <param name="folderId">The optional folder id</param>
        /// <param name="filter">The optional content type filter</param>
        /// <param name="width">The optional width for images</param>
        /// <param name="height">The optional height for images</param>
        /// <returns>The list model</returns>
        public async Task<MediaListModel> GetList(Guid? folderId = null, MediaType? filter = null, int? width = null, int? height = null)
        {
            var model = new MediaListModel
            {
                CurrentFolderId = folderId,
                ParentFolderId = null,
                Structure = await _api.Media.GetStructureAsync()
            };

            model.CurrentFolderBreadcrumb = await GetFolderBreadCrumb(model.Structure, folderId);

            model.RootCount = model.Structure.MediaCount;
            model.TotalCount = model.Structure.TotalCount;

            if (folderId.HasValue)
            {
                var partial = model.Structure.GetPartial(folderId, true);

                if (partial.FirstOrDefault()?.MediaCount == 0 && partial.FirstOrDefault()?.FolderCount == 0)
                {
                    model.CanDelete = true;
                }
            }

            if (folderId.HasValue)
            {
                var folder = await _api.Media.GetFolderByIdAsync(folderId.Value);
                if (folder != null)
                {
                    model.CurrentFolderName = folder.Name;
                    model.ParentFolderId = folder.ParentId;
                }
            }

            var holdMedia = (await _api.Media.GetAllByFolderIdAsync(folderId));
            if (filter.HasValue)
            {
                holdMedia = holdMedia
                    .Where(m => m.Type == filter.Value);
            }
            var pairMedia = holdMedia.Select(m => new {
                media = m,
                mediaItem = new MediaListModel.MediaItem
                {
                    Id = m.Id,
                    FolderId = m.FolderId,
                    Type = m.Type.ToString(),
                    Filename = m.Filename,
                    PublicUrl = m.PublicUrl.TrimStart('~'), //Will only enumerate the start of the string, probably a faster operation.
                    ContentType = m.ContentType,
                    Title = m.Title,
                    AltText = m.AltText,
                    Description = m.Description,
                    Properties = m.Properties.ToArray().OrderBy(p => p.Key).ToList(),
                    Size = Utils.FormatByteSize(m.Size),
                    Width = m.Width,
                    Height = m.Height,
                    LastModified = m.LastModified.ToString("yyyy-MM-dd HH:mm:ss")
                }
            }).ToArray();

            model.Folders = model.Structure.GetPartial(folderId)
                .Select(f => new MediaListModel.FolderItem
                {
                    Id = f.Id,
                    Name = f.Name,
                    ItemCount = f.MediaCount
                }).ToList();

            if (width.HasValue)
            {
                foreach (var mp in pairMedia.Where(m => m.media.Type == MediaType.Image))
                {
                    if (mp.media.Versions.Any(v => v.Width == width && v.Height == height))
                    {
                        mp.mediaItem.AltVersionUrl =
                            (await _api.Media.EnsureVersionAsync(mp.media, width.Value, height).ConfigureAwait(false))
                            .TrimStart('~');
                    }
                }
            }

            model.Media = pairMedia.Select(m => m.mediaItem).ToList();
            model.ViewMode = model.Media.Count(m => m.Type == "Image") > model.Media.Count / 2 ? MediaListModel.GalleryView : MediaListModel.ListView;

            return model;
        }

        /// <summary>
        /// Gets the breadcrumb list of the folders from the selected folder id
        /// </summary>
        /// <param name="structure">The complete media folder structure</param>
        /// <param name="folderId">The folder id</param>
        /// <returns></returns>
        public async Task<List<MediaFolderSimple>> GetFolderBreadCrumb(MediaStructure structure, Guid? folderId)
        {
            var folders = await GetFolderBreadCrumbReversed(structure, folderId);
            folders.Reverse();
            return folders;
        }

        /// <summary>
        /// Gets the breadcrumb list of the folders from the selected folder id in reverse order with child first in list
        /// </summary>
        /// <param name="structure">The complete media folder structure</param>
        /// <param name="folderId">The folder id</param>
        /// <returns></returns>
        private async Task<List<MediaFolderSimple>> GetFolderBreadCrumbReversed(MediaStructure structure, Guid? folderId)
        {
            var folders = new List<MediaFolderSimple>();

            if (!folderId.HasValue)
                return folders;

            foreach (var item in structure)
            {
                if (item.Id == folderId)
                {
                    folders.Add(new MediaFolderSimple() { Id = item.Id, Name = item.Name });
                    return folders;
                }

                if (item.Items.Count > 0)
                {
                    folders = await GetFolderBreadCrumbReversed(item.Items, folderId);
                    if (folders.Count > 0)
                    {
                        folders.Add(new MediaFolderSimple() { Id = item.Id, Name = item.Name });
                        return folders;
                    }
                }
            }
            return folders;
        }
    }
}

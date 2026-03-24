using Microsoft.Extensions.DependencyInjection;
using Piranha;
using Piranha.Models;
using SoundInTheory.Piranha.MediaExtensions.Images.Fields;
using SoundInTheory.Piranha.MediaExtensions.Images.Services;
using System;
using System.Linq;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Hooks
{
    public class GallerySyncHooks(IServiceProvider _services)
    {
        // The full .NET type name as stored by Piranha's ContentTypeBuilder
        private static readonly string GalleryFieldTypeName = typeof(GalleryField).ToString();

        public void OnPageAfterSave(PageBase page) =>
            Sync(App.PageTypes.GetById(page.TypeId), page.Id,
                api => api.Pages.GetByIdAsync<DynamicPage>(page.Id).GetAwaiter().GetResult()?.Regions);

        public void OnPostAfterSave(PostBase post) =>
            Sync(App.PostTypes.GetById(post.TypeId), post.Id,
                api => api.Posts.GetByIdAsync<DynamicPost>(post.Id).GetAwaiter().GetResult()?.Regions);

        public void OnContentAfterSave(GenericContent content) =>
            Sync(App.ContentTypes.GetById(content.TypeId), content.Id,
                api => api.Content.GetByIdAsync<DynamicContent>(content.Id).GetAwaiter().GetResult()?.Regions);

        private void Sync(ContentTypeBase contentType, Guid contentId, Func<IApi, dynamic> getRegions)
        {
            if (contentType?.Regions.SelectMany(r => r.Fields)
                    .Any(f => f.Type == GalleryFieldTypeName && f.Settings.ContainsKey("SyncToMediaFolder")) != true)
                return;

            using (var scope = _services.CreateScope())
            {
                var api = scope.ServiceProvider.GetService<IApi>();
                var syncService = scope.ServiceProvider.GetService<GalleryFolderSyncService>();
                syncService.SyncAsync(contentType, contentId, getRegions(api)).GetAwaiter().GetResult();
            }
        }
    }
}

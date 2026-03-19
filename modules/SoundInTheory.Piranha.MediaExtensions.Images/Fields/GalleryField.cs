using Piranha.Extend;
using System.Collections.Generic;

namespace SoundInTheory.Piranha.MediaExtensions.Images.Fields
{
    /// <summary>
    /// A Piranha field that stores a collection of media images as a gallery.
    ///
    /// =====================================================================
    /// UPLOAD FOLDER RESOLUTION — HOW IT WORKS END TO END
    /// =====================================================================
    ///
    /// The [GalleryFieldSettings(UploadFolder = "...")] attribute on a content model
    /// property controls where uploaded images are stored in the media library.
    ///
    /// TEMPLATE SYNTAX
    /// ---------------
    /// The UploadFolder template supports two kinds of placeholder:
    ///
    ///   {id}           — replaced with the content item's own ID (a Guid).
    ///                    This is always available and is resolved server-side.
    ///
    ///   {PropertyName} — replaced with the string value of a sibling property
    ///                    on the same region class. The name is case-insensitive.
    ///                    Resolved via reflection at edit-load time.
    ///
    /// EXAMPLE
    /// -------
    ///   public class ImagesRegion
    ///   {
    ///       [Field]
    ///       public string GalleryTitle { get; set; }          // sibling field
    ///
    ///       [Field]
    ///       [GalleryFieldSettings(UploadFolder = "Gallery/{GalleryTitle}/{id}")]
    ///       public GalleryField Photos { get; set; }          // this field
    ///   }
    ///
    ///   If GalleryTitle = "Holidays" and the content item Id = "abc-123", then
    ///   uploads go into the media library folder:  Gallery/Holidays/abc-123
    ///
    /// =====================================================================
    /// HOW THE RESOLVED PATH REACHES VUE
    /// =====================================================================
    ///
    /// 1. EDIT PAGE LOAD
    ///    Piranha loads the content model (strongly-typed C# object) to build
    ///    the manager edit view. GalleryFieldResolverFilter intercepts this
    ///    response, calls GalleryFolderResolverService.ResolveForModel(), which
    ///    walks the model via reflection to find GalleryField properties with
    ///    GalleryFieldSettingsAttribute and populates the computed properties below.
    ///
    /// 2. SERIALIZATION
    ///    The Piranha manager API serializes the content model to JSON and returns
    ///    it to the Vue editor. Because the computed properties are public, they
    ///    appear in the JSON and Vue receives them as part of the `model` prop
    ///    of the gallery-field component.
    ///
    ///    GalleryFieldSerializer ensures that when SAVING to the database, only
    ///    Images is persisted — the computed properties are never written to the DB.
    ///
    /// 3. VUE USAGE
    ///    gallery-field.vue reads model.uploadFolder directly (no placeholder logic
    ///    in Vue). model.originalUploadFolder is stored at mount time to detect
    ///    renames. model.uploadFolderDependencies tells Vue which fields to pass
    ///    to the resolve-folder endpoint when re-resolving at save time.
    ///
    /// =====================================================================
    /// FIELD CHANGES AND FOLDER RENAMING
    /// =====================================================================
    ///
    /// If a dependency field (e.g. GalleryTitle) is changed on the edit page,
    /// the previously-resolved UploadFolder path is stale. The save hook in
    /// gallery-field.vue handles this:
    ///
    ///   1. Calls POST /manager/api/gallery/resolve-folder with the current
    ///      values of all dependency fields, getting a fresh resolved path.
    ///   2. Compares the fresh path to OriginalUploadFolder (the path at load time).
    ///   3. If they differ, calls POST /manager/api/gallery/rename-folder to rename
    ///      the leaf folder in the media library BEFORE uploading new images.
    ///      This keeps existing gallery images in sync with the renamed folder.
    ///   4. Proceeds with uploads using the new path.
    ///   5. Updates the internal "original" reference so a second save in the same
    ///      session does not trigger a spurious rename.
    ///
    /// =====================================================================
    /// VALIDATION AND ERROR HANDLING
    /// =====================================================================
    ///
    /// If resolution fails (e.g. GalleryTitle is empty), GalleryFolderResolverService
    /// sets UploadFolderError instead of UploadFolder. The Vue save hook detects this
    /// and calls piranha.notify.error() with the message, aborting the save.
    ///
    /// If the resolve-folder endpoint returns an error at save time, the save is
    /// also aborted. The user sees a notification and must fix the field value first.
    ///
    /// =====================================================================
    /// DATABASE STORAGE
    /// =====================================================================
    ///
    /// GalleryFieldSerializer (registered in GalleryFieldModule.Init) serializes
    /// only the Images list to the database.  All computed properties below are
    /// null when deserialized and are repopulated at edit-load time.
    /// </summary>
    [FieldType(Name = "Gallery Field", Shorthand = "GalleryField", Component = "gallery-field")]
    public class GalleryField : IField
    {
        // =====================================================================
        // PERSISTED DATA
        // =====================================================================

        /// <summary>
        /// The list of media images in the gallery.
        /// This is the only property persisted to the database.
        /// </summary>
        public List<global::Piranha.Models.Media> Images { get; set; }


        // =====================================================================
        // COMPUTED PROPERTIES — POPULATED AT EDIT TIME, NEVER PERSISTED
        //
        // These are set by GalleryFolderResolverService when the content edit
        // page loads, and serialized to the Vue component's `model` prop.
        //
        // GalleryFieldSerializer explicitly excludes them from DB storage,
        // so they are always null when a field is loaded from the database.
        // They have no meaning outside of an active editing session.
        // =====================================================================

        /// <summary>
        /// The fully-resolved upload folder path, with all {Placeholder} tokens
        /// replaced by their current values.
        ///
        /// Example: template "Gallery/{GalleryTitle}/{id}"
        ///          with GalleryTitle="Holidays", Id="abc-123"
        ///          → "Gallery/Holidays/abc-123"
        ///
        /// This is the CURRENT path. Vue updates it (via the resolve-folder endpoint)
        /// whenever a dependency field changes on the edit page, so the save hook
        /// always uses the latest value — not a stale snapshot from page load.
        ///
        /// Null when:
        ///   • No UploadFolder template is configured on the attribute.
        ///   • A dependency field value is empty or could not be found.
        ///   • Path sanitization failed (see UploadFolderError).
        /// </summary>
        public string UploadFolder { get; set; }

        /// <summary>
        /// The resolved upload folder path as it was when the edit page first loaded.
        /// Set once by GalleryFolderResolverService; never changed by Vue.
        ///
        /// Purpose: change detection for folder renaming.
        ///
        /// At save time, the Vue hook compares UploadFolder (current) against
        /// OriginalUploadFolder (baseline). A mismatch means a dependency field was
        /// edited during this session, so the corresponding media library folder must
        /// be renamed to match the new path before new images are uploaded.
        ///
        /// Scenario:
        ///   Load  → OriginalUploadFolder = UploadFolder = "Gallery/Holidays/abc-123"
        ///   Edit  → GalleryTitle changed to "Summer Trip"
        ///           UploadFolder = "Gallery/Summer Trip/abc-123" (updated via API)
        ///           OriginalUploadFolder = "Gallery/Holidays/abc-123" (unchanged)
        ///   Save  → rename media folder "Holidays" → "Summer Trip"
        ///           upload new images to "Gallery/Summer Trip/abc-123"
        ///           OriginalUploadFolder updated to "Gallery/Summer Trip/abc-123"
        /// </summary>
        public string OriginalUploadFolder { get; set; }

        /// <summary>
        /// The names of properties on the same region class whose runtime values
        /// feed into the UploadFolder template as {Placeholder} tokens (excluding {id},
        /// which is always the content item's own ID and never changes).
        ///
        /// Example: template "Gallery/{GalleryTitle}/{id}"
        ///          → UploadFolderDependencies = ["GalleryTitle"]
        ///
        /// Vue uses this list at save time to know which fields to read from the
        /// Piranha edit model and pass to the resolve-folder endpoint, so the server
        /// can recompute a fresh, sanitized path using the latest field values.
        ///
        /// Null/empty when the template has no non-{id} placeholders.
        /// </summary>
        public IReadOnlyList<string> UploadFolderDependencies { get; set; }

        /// <summary>
        /// Human-readable error message set when folder path resolution fails.
        ///
        /// Populated instead of UploadFolder when:
        ///   • A required dependency field is empty or blank.
        ///   • A dependency placeholder name was not found on the region class.
        ///   • The resolved path failed sanitization.
        ///
        /// Vue reads this in the save hook: if non-null, it calls
        /// piranha.notify.error({ body: model.uploadFolderError }) and aborts
        /// the save. The user must fix the referenced field before saving.
        ///
        /// Null when resolution succeeded or no UploadFolder template is configured.
        /// </summary>
        public string UploadFolderError { get; set; }


        // =====================================================================
        // IField IMPLEMENTATION
        // =====================================================================

        public string GetTitle() => "Gallery";
    }
}

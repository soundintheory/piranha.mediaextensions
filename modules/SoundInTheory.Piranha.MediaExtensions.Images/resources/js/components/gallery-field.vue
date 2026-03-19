<template>
    <div class="card gallery-field"
         @dragover.prevent="onDragOver"
         @dragleave="onDragLeave"
         @drop.prevent="onDrop"
         :class="{ 'gallery-dragover': isDraggingOver }">
        <input type="file"
               multiple
               accept="image/*"
               ref="fileInput"
               style="display:none"
               @change="onFileInputChange">
        <div class="card-body">
            <div class="blocks">
                <div>
                    <div class="block block-group" :id="uid">
                        <div class="block-header mb-2">
                            <div class="title">
                                <i class="fas fa-images"></i>
                                <strong>Gallery</strong>
                            </div>
                        </div>

                        <div v-if="model.images.length === 0"
                             class="empty-info gallery-drop-zone"
                             @click="triggerFileInput">
                            <i class="fas fa-cloud-upload-alt fa-2x"></i>
                            <p>Click to add images or drag and drop files here</p>
                        </div>

                        <div v-else class="container-fluid bg-white m-2">
                            <div class="row row-cols-3 align-items-center gallery-sortable-container">
                                <div class="block gallery-sortable-item m-0 col h-100"
                                     v-for="(image, index) in model.images"
                                     :key="getImageKey(image)">
                                    <div class="block-body has-media-picker rounded col text-center gallery-body">
                                        <div class="gallery-uploading-overlay" v-if="image.uploading">
                                            <i class="fas fa-spinner fa-spin fa-2x"></i>
                                            <small class="mt-1">Uploading Media</small>
                                        </div>
                                        <div class="gallery-body-cloaked">
                                            <div class="gallery-body-description">
                                                <div v-if="image.filename">{{ image.filename }}</div>
                                            </div>
                                            <div class="gallery-body-actions-right">
                                                <button class="btn btn-danger btn-sm gallery-body-action"
                                                        @click.prevent="remove(index)">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <img class="rounded" :src="getUrl(image)"/>
                                    </div>
                                    <input type="text"
                                           class="form-control form-control-sm mt-1 gallery-title-input"
                                           placeholder="Image title"
                                           :value="image.title || ''"
                                           @change="updateTitle(image, $event.target.value)"/>
                                </div>
                            </div>
                            <div class="text-center mt-2 mb-1">
                                <button class="btn btn-sm btn-outline-secondary" @click.prevent="triggerFileInput">
                                    <i class="fas fa-plus"></i> Add more images
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["uid", "model", "meta"],
    data() {
        return {
            isDragAndDropInitialised: false,
            isDraggingOver: false
        };
    },
    methods: {

        // =================================================================
        // FILE INPUT / DRAG-DROP
        // =================================================================

        triggerFileInput() {
            // Reset value first so selecting the same file again still fires change
            this.$refs.fileInput.value = '';
            this.$refs.fileInput.click();
        },
        onDragOver() {
            this.isDraggingOver = true;
        },
        onDragLeave(e) {
            // Only clear when the cursor leaves the component entirely,
            // not when moving over a child element
            if (!this.$el.contains(e.relatedTarget)) {
                this.isDraggingOver = false;
            }
        },
        onDrop(e) {
            this.isDraggingOver = false;
            if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                this.addLocalPreviews(e.dataTransfer.files);
            }
        },
        onFileInputChange(e) {
            if (e.target.files.length > 0) {
                this.addLocalPreviews(e.target.files);
            }
        },

        // =================================================================
        // LOCAL PREVIEWS — shown immediately, uploaded on save
        //
        // Images are not uploaded when added. Instead a local blob preview
        // is displayed immediately and an upload closure is registered on
        // the edit instance. When the user clicks Save, the save hook
        // (installed in beforeMount) runs all pending closures sequentially
        // before calling Piranha's original save method.
        // =================================================================

        addLocalPreviews(files) {
            const fileArray = Array.from(files);

            for (const file of fileArray) {
                const previewUrl = URL.createObjectURL(file);
                const imageEntry = {
                    key: Date.now() + '-' + Math.random(),
                    previewUrl: previewUrl,
                    filename: file.name,
                    title: '',
                    pending: true,
                    uploading: false
                };

                this.model.images.push(imageEntry);

                if (this._editInstance) {
                    const self = this;
                    this._editInstance._galleryPendingUploads.push({
                        execute: async () => {
                            // If the user removed this image before saving, skip it.
                            if (self.model.images.indexOf(imageEntry) === -1) {
                                URL.revokeObjectURL(previewUrl);
                                return;
                            }

                            imageEntry.uploading = true;

                            try {
                                const formData = new FormData();
                                formData.append('file', file);

                                // Use the UploadFolder from field settings, if configured.
                                // {id} is replaced with the current content item's ID.
                                let folderPath = self.meta && self.meta.settings && self.meta.settings.UploadFolder;
                                if (folderPath) {
                                    const contentId = (piranha.pageedit && piranha.pageedit.id)
                                        || (piranha.postedit && piranha.postedit.id)
                                        || (piranha.contentedit && piranha.contentedit.id)
                                        || '';
                                    folderPath = folderPath.replace(/\{id\}/gi, contentId);
                                    formData.append('folderPath', folderPath);
                                }
                                if (imageEntry.title) formData.append('title', imageEntry.title);

                                const headers = {};
                                headers[piranha.antiForgery.headerName] = piranha.utils.antiForgery();

                                const response = await fetch(piranha.baseUrl + 'manager/api/gallery/upload', {
                                    method: 'POST',
                                    headers: headers,
                                    body: formData
                                });

                                if (response.ok) {
                                    const media = await response.json();
                                    const currentIdx = self.model.images.indexOf(imageEntry);
                                    if (currentIdx !== -1) {
                                        self.model.images.splice(currentIdx, 1, media);
                                        self.model.images = [...self.model.images];
                                    }
                                } else {
                                    const errData = await response.json().catch(() => ({}));
                                    console.error('Gallery: upload failed for', file.name, response.status, errData);
                                    const currentIdx = self.model.images.indexOf(imageEntry);
                                    if (currentIdx !== -1) {
                                        self.model.images.splice(currentIdx, 1);
                                        self.model.images = [...self.model.images];
                                    }
                                }
                            } catch (err) {
                                console.error('Gallery: upload error for', file.name, err);
                                const currentIdx = self.model.images.indexOf(imageEntry);
                                if (currentIdx !== -1) {
                                    self.model.images.splice(currentIdx, 1);
                                    self.model.images = [...self.model.images];
                                }
                            } finally {
                                imageEntry.uploading = false;
                                URL.revokeObjectURL(previewUrl);
                            }
                        }
                    });
                }
            }

            this.model.images = [...this.model.images];

            Vue.nextTick(() => {
                if (!this.isDragAndDropInitialised && document.querySelector('.gallery-sortable-container')) {
                    this.initDragAndDrop();
                }
            });
        },

        // =================================================================
        // REMOVE
        // =================================================================

        remove(index) {
            const image = this.model.images[index];
            if (image.pending) {
                // Local preview not yet uploaded — just revoke the object URL.
                // The deferred upload closure checks indexOf and will skip it.
                URL.revokeObjectURL(image.previewUrl);
            } else if (image.id && this._editInstance) {
                // Already saved to the media library — queue for deletion on save
                this._editInstance._galleryPendingDeletions.push(image.id);
            }
            this.model.images.splice(index, 1);
            this.model.images = [...this.model.images];
        },

        // =================================================================
        // TITLE UPDATE
        // =================================================================

        async updateTitle(image, title) {
            image.title = title;
            if (!image.pending && image.id) {
                // Image is already in the media library — patch the title immediately.
                // For pending images the title is passed with the upload at save time.
                try {
                    await fetch(piranha.baseUrl + 'manager/api/gallery/media/' + image.id + '/title', {
                        method: 'PATCH',
                        headers: Object.assign({ 'Content-Type': 'application/json' }, piranha.utils.antiForgeryHeaders()),
                        body: JSON.stringify(title)
                    });
                } catch (err) {
                    console.error('Gallery: failed to update title for', image.id, err);
                }
            }
        },

        // =================================================================
        // UTILITIES
        // =================================================================

        getUrl(image) {
            if (image.previewUrl) {
                return image.previewUrl;
            }
            if (image.publicUrl) {
                return piranha.utils.formatUrl(image.publicUrl);
            }
            return piranha.utils.formatUrl('~/manager/assets/img/empty-image.png');
        },
        getImageKey(image) {
            return image.id || image.key;
        },
        moveItem(from, to) {
            this.model.images.splice(to, 0, this.model.images.splice(from, 1)[0]);
        },
        initDragAndDrop() {
            const self = this;
            window.sortable('.gallery-sortable-container', {
                items: '.gallery-sortable-item'
            })[0].addEventListener('sortupdate', function (e) {
                self.moveItem(e.detail.origin.index, e.detail.destination.index);
            });
            this.isDragAndDropInitialised = true;
        }
    },
    mounted() {
        if (this.model.images.length > 0 && document.querySelector('.gallery-sortable-container')) {
            this.initDragAndDrop();
        }
    },
    beforeMount() {
        if (!this.model.images) {
            this.model.images = [];
        }

        // =================================================================
        // SAVE HOOK
        //
        // Wraps Piranha's save/saveDraft/saveUnpublish methods once per edit
        // session (guarded by _galleryHooked so multiple gallery fields on the
        // same page share a single hook).
        //
        // Order of operations on save:
        //   1. Execute all pending uploads sequentially.
        //   2. Delete any media removed from galleries.
        //   3. Call Piranha's original save method.
        // =================================================================

        const editInstance = (typeof piranha !== 'undefined')
            && (piranha.pageedit || piranha.postedit || piranha.contentedit);

        if (editInstance && !editInstance._galleryHooked) {
            editInstance._galleryHooked = true;
            editInstance._galleryPendingUploads = [];
            editInstance._galleryPendingDeletions = [];

            const wrapSave = (name) => {
                if (!editInstance[name]) return;
                const original = editInstance[name].bind(editInstance);
                editInstance[name] = async function () {

                    const uploads = editInstance._galleryPendingUploads.splice(0);

                    // Execute each upload in sequence to avoid race conditions
                    // in folder creation and concurrent model.images mutations.
                    for (const upload of uploads) {
                        await upload.execute();
                    }

                    // Delete any media removed from the gallery.
                    const toDelete = editInstance._galleryPendingDeletions.splice(0);
                    if (toDelete.length > 0) {
                        try {
                            await fetch(piranha.baseUrl + 'manager/api/media/delete', {
                                method: 'DELETE',
                                headers: piranha.utils.antiForgeryHeaders(),
                                body: JSON.stringify(toDelete)
                            });
                        } catch (err) {
                            console.error('Gallery: failed to delete media on save:', err);
                        }
                    }

                    return original();
                };
            };

            ['save', 'saveDraft', 'saveUnpublish'].forEach(wrapSave);
        }

        this._editInstance = editInstance;
    }
}
</script>

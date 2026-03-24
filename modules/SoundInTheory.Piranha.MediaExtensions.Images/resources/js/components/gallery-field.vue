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
                                    <input v-if="collectTitle"
                                           type="text"
                                           class="form-control form-control-sm mt-1 gallery-title-input"
                                           placeholder="Image title"
                                           :value="image.title || ''"
                                           @change="updateField(image, 'title', $event.target.value)"/>
                                    <input v-if="collectAltText"
                                           type="text"
                                           class="form-control form-control-sm mt-1 gallery-title-input"
                                           placeholder="Alt text"
                                           :value="image.altText || ''"
                                           @change="updateField(image, 'altText', $event.target.value)"/>
                                    <textarea v-if="collectDescription"
                                              class="form-control form-control-sm mt-1 gallery-description-input"
                                              placeholder="Description"
                                              :value="image.description || ''"
                                              @change="updateField(image, 'description', $event.target.value)"></textarea>
                                </div>
                            </div>
                            <div class="text-center mt-2 pb-4">
                                <button class="btn btn-sm btn-outline-secondary" @click.prevent="triggerFileInput">
                                    <i class="fas fa-plus"></i> Add More Images
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
    computed: {
        collectTitle() {
            return !!(this.meta && this.meta.settings && this.meta.settings.CollectTitle);
        },
        collectAltText() {
            return !!(this.meta && this.meta.settings && this.meta.settings.CollectAltText);
        },
        collectDescription() {
            return !!(this.meta && this.meta.settings && this.meta.settings.CollectDescription);
        }
    },
    methods: {

        // =================================================================
        // FILE INPUT / DRAG-DROP
        // =================================================================

        triggerFileInput() {
            this.$refs.fileInput.value = '';
            this.$refs.fileInput.click();
        },
        onDragOver() {
            this.isDraggingOver = true;
        },
        onDragLeave(e) {
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
        // IMMEDIATE CONCURRENT UPLOADS
        // =================================================================

        addLocalPreviews(files) {
            const fileArray = Array.from(files);

            const uploads = fileArray.map(file => {
                const previewUrl = URL.createObjectURL(file);
                const imageEntry = {
                    key: Date.now() + '-' + Math.random(),
                    previewUrl: previewUrl,
                    filename: file.name,
                    title: '',
                    altText: '',
                    description: '',
                    uploading: true,
                    cancelled: false
                };

                this.model.images.push(imageEntry);

                return this.uploadFile(file, imageEntry, previewUrl);
            });

            this.model.images = [...this.model.images];

            Promise.all(uploads);

            Vue.nextTick(() => {
                if (!this.isDragAndDropInitialised && document.querySelector('.gallery-sortable-container')) {
                    this.initDragAndDrop();
                }
            });
        },

        async uploadFile(file, imageEntry, previewUrl) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                if (imageEntry.title) formData.append('title', imageEntry.title);
                if (imageEntry.altText) formData.append('altText', imageEntry.altText);
                if (imageEntry.description) formData.append('description', imageEntry.description);

                const headers = {};
                headers[piranha.antiForgery.headerName] = piranha.utils.antiForgery();

                const response = await fetch(piranha.baseUrl + 'manager/api/gallery/upload', {
                    method: 'POST',
                    headers: headers,
                    body: formData
                });

                const currentIdx = this.model.images.indexOf(imageEntry);

                if (imageEntry.cancelled) {
                    if (response.ok) {
                        const media = await response.json();
                        this.deleteMedia(media.id);
                    }
                    return;
                }

                if (response.ok) {
                    const media = await response.json();
                    if (currentIdx !== -1) {
                        this.model.images.splice(currentIdx, 1, media);
                        this.model.images = [...this.model.images];
                    }
                } else {
                    const errData = await response.json().catch(() => ({}));
                    console.error('Gallery: upload failed for', file.name, response.status, errData);
                    if (currentIdx !== -1) {
                        this.model.images.splice(currentIdx, 1);
                        this.model.images = [...this.model.images];
                    }
                }
            } catch (err) {
                console.error('Gallery: upload error for', file.name, err);
                const currentIdx = this.model.images.indexOf(imageEntry);
                if (currentIdx !== -1) {
                    this.model.images.splice(currentIdx, 1);
                    this.model.images = [...this.model.images];
                }
            } finally {
                imageEntry.uploading = false;
                URL.revokeObjectURL(previewUrl);
            }
        },

        // =================================================================
        // REMOVE
        // =================================================================

        remove(index) {
            const image = this.model.images[index];
            if (image.uploading) {
                image.cancelled = true;
            } else if (image.id) {
                this.deleteMedia(image.id);
            } else {
                URL.revokeObjectURL(image.previewUrl);
            }
            this.model.images.splice(index, 1);
            this.model.images = [...this.model.images];
        },

        deleteMedia(id) {
            const headers = {};
            headers[piranha.antiForgery.headerName] = piranha.utils.antiForgery();
            fetch(piranha.baseUrl + 'manager/api/gallery/media/' + id, {
                method: 'DELETE',
                headers: headers
            }).catch(err => console.error('Gallery: failed to delete media', id, err));
        },

        // =================================================================
        // METADATA UPDATE
        // =================================================================

        async updateField(image, field, value) {
            image[field] = value;
            if (image.id) {
                try {
                    await fetch(piranha.baseUrl + 'manager/api/gallery/media/' + image.id + '/metadata', {
                        method: 'PATCH',
                        headers: Object.assign({ 'Content-Type': 'application/json' }, piranha.utils.antiForgeryHeaders()),
                        body: JSON.stringify({
                            title: image.title || '',
                            altText: image.altText || '',
                            description: image.description || ''
                        })
                    });
                } catch (err) {
                    console.error('Gallery: failed to update metadata for', image.id, err);
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
    }
}
</script>

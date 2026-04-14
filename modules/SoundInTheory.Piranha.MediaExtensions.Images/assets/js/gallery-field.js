Vue.component("gallery-field", {
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
    },
    hasFields() {
      return this.collectTitle || this.collectAltText || this.collectDescription;
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
      } else if (!image.id) {
        URL.revokeObjectURL(image.previewUrl);
      }
      this.model.images.splice(index, 1);
      this.model.images = [...this.model.images];
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
            headers: Object.assign({
              'Content-Type': 'application/json'
            }, piranha.utils.antiForgeryHeaders()),
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
      console.log('woop');
      window.sortable('.gallery-sortable-container', {
        items: '.gallery-sortable-item',
        placeholder: '<div><div class="sortable-placeholder"></div>',
        placeholderClass: 'gallery-placeholder'
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
  },
  template: "\n<div class=\"gallery-field\"\n     @dragover.prevent=\"onDragOver\"\n     @dragleave=\"onDragLeave\"\n     @drop.prevent=\"onDrop\"\n     :class=\"{ 'gallery-dragover': isDraggingOver }\">\n    <input type=\"file\"\n           multiple\n           accept=\"image/*\"\n           ref=\"fileInput\"\n           style=\"display:none\"\n           @change=\"onFileInputChange\">\n    <div class=\"block block-group\" :id=\"uid\">\n        <!--div class=\"block-header mb-2\">\n            <div class=\"title\">\n                <i class=\"fas fa-images\"></i>\n                <strong>Gallery</strong>\n            </div>\n        </div -->\n        <div class=\"row row-cols-3 gallery-sortable-container\">\n            <div class=\"gallery-sortable-item col\" v-for=\"(image, index) in model.images\" :key=\"getImageKey(image)\">\n                <div class=\"gallery-item block m-0 h-100\">\n                    <div class=\"has-media-picker text-center position-relative gallery-body\">\n                        <div class=\"gallery-uploading-overlay\" v-if=\"image.uploading\">\n                            <i class=\"fas fa-spinner fa-spin fa-2x\"></i>\n                            <small class=\"mt-1\">Uploading Media</small>\n                        </div>\n                        <div class=\"gallery-body-actions-right gallery-body-cloaked\">\n                            <button class=\"btn btn-danger btn-sm gallery-body-action\"\n                                    @click.prevent=\"remove(index)\">\n                                <i class=\"fas fa-trash\"></i>\n                            </button>\n                        </div>\n                        <div class=\"gallery-image\">\n                            <img class=\"rounded\" :src=\"getUrl(image)\" />\n                            <div class=\"gallery-body-cloaked gallery-body-description\">\n                                <div v-if=\"image.filename\">{{ image.filename }}</div>\n                            </div>\n                        </div>\n                    </div>\n                    <div v-if=\"hasFields\" class=\"gallery-fields\">\n                        <input v-if=\"collectTitle\"\n                               type=\"text\"\n                               class=\"form-control form-control-sm mt-2 gallery-title-input\"\n                               placeholder=\"Image title\"\n                               :value=\"image.title || ''\"\n                               @change=\"updateField(image, 'title', $event.target.value)\" />\n                        <input v-if=\"collectAltText\"\n                               type=\"text\"\n                               class=\"form-control form-control-sm mt-2 gallery-title-input\"\n                               placeholder=\"Alt text\"\n                               :value=\"image.altText || ''\"\n                               @change=\"updateField(image, 'altText', $event.target.value)\" />\n                        <textarea v-if=\"collectDescription\"\n                                  class=\"form-control form-control-sm mt-2 gallery-description-input\"\n                                  placeholder=\"Description\"\n                                  :value=\"image.description || ''\"\n                                  @change=\"updateField(image, 'description', $event.target.value)\"></textarea>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"empty-info gallery-drop-zone\"\n             @click=\"triggerFileInput\">\n            <i class=\"fas fa-cloud-upload-alt fa-2x\"></i>\n            <p>Click to add images or drag and drop files here</p>\n        </div>\n\n    </div>\n</div>\n"
});
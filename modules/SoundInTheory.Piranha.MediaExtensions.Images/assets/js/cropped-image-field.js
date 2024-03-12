/*global
    piranha
*/
Vue.component("cropped-image-field", {
  props: ["uid", "model", "meta"],
  methods: {
    select: function () {
      if (this.model.media != null) {
        piranha.mediapicker.open(this.update, "Image", this.model.media.folderId);
      } else {
        piranha.mediapicker.openCurrentFolder(this.update, "Image");
      }
    },
    open: function (field, callback) {},
    openPreview: function () {
      // Pass a reference to our field instance so that the image editor can read settings etc
      piranha.preview.field = this;
      piranha.preview.load(this.model.id);
      $('#previewModal').modal({
        backdrop: 'static'
      });
      //piranha.preview.show();

      // Remove the reference when the modal is closed
      $('#previewModal').one('hide.bs.modal', function () {
        setTimeout(() => {
          piranha.preview.field = null;
        }, 1);
      });
    },
    remove: function () {
      this.model.id = null;
      this.model.media = null;
    },
    edit: function (data) {
      console.log('edit callback!', data);
    },
    update: function (media) {
      if (media.type === "Image") {
        this.model.id = media.id;
        this.model.media = {
          id: media.id,
          folderId: media.folderId,
          type: media.type,
          filename: media.filename,
          title: media.title,
          contentType: media.contentType,
          publicUrl: media.publicUrl
        };

        // Tell parent that title has been updated
        if (this.meta.notifyChange) {
          this.$emit('update-title', {
            uid: this.uid,
            title: this.model.media.title != null ? this.model.media.title + ' (' + this.model.media.filename + ')' : this.model.media.filename
          });
        }
      } else {
        console.log("No image was selected");
      }
    }
  },
  computed: {
    isEmpty: function () {
      return this.model.media == null;
    }
  },
  mounted: function () {
    this.model.getTitle = function () {
      if (this.model.media != null) {
        return this.model.media.title != null ? this.model.media.title + ' (' + this.model.media.filename + ')' : this.model.media.filename;
      } else {
        return "No image selected";
      }
    };
  },
  template: "\n<div class=\"media-field\" :class=\"{ empty: isEmpty }\">\n    <div class=\"media-picker\">\n        <div class=\"btn-group float-right\">\n            <button v-if=\"!isEmpty\" v-on:click.prevent=\"openPreview\" class=\"btn btn-info btn-aspect text-center\">\n                <i class=\"fas fa-cog\"></i>\n            </button>\n            <button v-on:click.prevent=\"select\" class=\"btn btn-primary text-center\">\n                <i class=\"fas fa-plus\"></i>\n            </button>\n            <button v-on:click.prevent=\"remove\" class=\"btn btn-danger text-center\">\n                <i class=\"fas fa-times\"></i>\n            </button>\n        </div>\n        <div class=\"card text-left\">\n            <div class=\"card-body\" v-if=\"isEmpty\">\n                <span v-if=\"meta.placeholder != null\" class=\"text-secondary\">{{ meta.placeholder }}</span>\n                <span v-if=\"meta.placeholder == null\" class=\"text-secondary\">&nbsp;</span>\n            </div>\n            <div class=\"card-body\" v-else-if=\"model.media.title != null\">\n                <a href=\"#\" v-on:click.prevent=\"openPreview\">{{ model.media.title }} ({{ model.media.filename }})</a>\n            </div>\n            <div class=\"card-body\" v-else>\n                <a href=\"#\" v-on:click.prevent=\"openPreview\">{{ model.media.filename }}</a>\n            </div>\n        </div>\n    </div>\n</div>\n"
});
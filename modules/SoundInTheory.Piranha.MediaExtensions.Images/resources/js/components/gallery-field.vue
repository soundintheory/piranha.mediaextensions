<template>
    <div class="card">
        <div class="card-body">
            <div class="blocks">
                <div>
                    <div class="block block-group" :id="uid">
                        <div class="block-header mb-2">
                            <div class="title">
                                <i class="fas fa-images"></i>
                                <strong>Gallery</strong>
                            </div>
                            <div class="actions">
                                <span class="btn btn-sm" @click="add()">
                                    <i class="fas fa-plus"></i>
                                </span>
                            </div>
                        </div>

                        <div v-if="model.images.length === 0" class="empty-info">
                            <p>{{ piranha.resources.texts.emptyAddAbove }}</p>
                        </div>
                        <div v-else class="container-fluid bg-white m-2">
                            <div class="row row-cols-3 align-items-center gallery-sortable-container">
                                <div class="block gallery-sortable-item m-0 col h-full h-100" v-for="(image, index) in model.images" v-bind:key="getImageKey(image)">
                                    <div class="block-body has-media-picker rounded col text-center gallery-body" >
                                        <div class="gallery-body-cloaked">
                                            <div class="gallery-body-description">
                                                <div v-if="image.filename" v:bind="image.filename">{{ image.filename }}</div>
                                                <div v-else>New Image</div>
                                            </div>
                                            <div class="gallery-body-actions-left">
                                                <button class="btn btn-primary btn-sm gallery-body-action" v-on:click.prevent="select(image, index)"><i v-if="imageIsEmpty(image)" class="fas fa-plus"></i><i v-else class="fas fa-pen"></i></button>
                                            </div>
                                            <div class="gallery-body-actions-right">
                                                <button class="btn btn-secondary btn-sm gallery-body-action" v-if="!imageIsEmpty(image)" v-on:click.prevent="remove(index)"><i class="fas fa-eraser"></i></button>
                                                <button class="btn btn-danger btn-sm gallery-body-action" v-on:click.prevent="del(index)"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        <img class="rounded" :src="getUrl(image)"/>
                                    </div>
                                </div>
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
    data(){
        return{
            selectedImageIndex: null
        }
    },
    methods: {
        imageIsEmpty: function(image){
            return !image.id
        },
        getUrl: function(image){
            console.info("image", image);
            if (image.publicUrl) {
                return piranha.utils.formatUrl(image.publicUrl);
            } else {
                return piranha.utils.formatUrl("~/manager/assets/img/empty-image.png");
            }
        },
        select: function (image, index) {
            piranha.mediapicker.openCurrentFolder((media) => {
                this.update(media, index)
            }, "Image");
        },
        remove: function (index) {
            this.model.images[index] = {}
            this.model.images = [...this.model.images]
        },
        update: function (media, index) {
            if (media.type === "Image") {
                this.model.images[index] = {
                    id: media.id,
                    folderId: media.folderId,
                    type: media.type,
                    filename: media.filename,
                    title: media.title,
                    contentType: media.contentType,
                    publicUrl: media.publicUrl,
                };

                this.model.images = [...this.model.images]
                
                // Tell parent that title has been updated
                if (this.meta.notifyChange) {
                    this.$emit('update-title', {
                        uid: this.uid,
                        title: this.model.images[index].title != null ? this.model.images[index].title + ' (' + this.model.images[index].filename + ')' : this.model.images[index].filename
                    });
                }
            } else {
                console.log("No image was selected");
            }
        },
        add(){
            this.model.images.push({
            })
        },
        del(index){
            this.model.images.splice(index, 1)
        },
        moveUp(index){
            if(index != 0){
                const replacement = this.model.images.splice(index, 1)[0]
                this.model.images.splice(index - 1, 0, replacement);
            }
        },
        moveDown(index){
            if(index + 1 !== this.model.images.length){
                const replacement = this.model.images.splice(index, 1)[0]
                this.model.images.splice(index + 1, 0, replacement);
            }
        },
        getImageKey(image){
            if(image.id) return image.id;

            return new Date().getUTCMilliseconds().toString()
        },
        moveItem(from, to){
            this.model.images.splice(to, 0, this.model.images.splice(from, 1)[0])
        }
    },
    computed: {
        isEmpty: function () {
            return this.model.media == null;
        }
    },
    mounted: function() {
        this.model.getTitle = function () {
            if (selectedImage.media != null) {
                return this.model.media.title != null ? selectedImage.title + ' (' + selectedImage.filename + ')' : selectedImage.filename;
            } else {
                return "No image selected";
            }
        };
        
        const self = this;
    
        window.sortable(".gallery-sortable-container", {
            items: ".gallery-sortable-item"
        })[0].addEventListener("sortupdate", function (e) {
            self.moveItem(e.detail.origin.index, e.detail.destination.index);
        });

    },
    beforeMount(){
        if(this.model.images === null || this.model.images === undefined){
            this.model.images = []
        }

    }
}
</script>
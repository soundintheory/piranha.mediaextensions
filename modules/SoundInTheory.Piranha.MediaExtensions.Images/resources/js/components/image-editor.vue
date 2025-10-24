<template>
    <div class="image-editor" :class="{ ready: isReady }">
        <div class="image img-container" >
            <template v-if="isSupported">
                <img class="d-block mx-auto mw-100" :src="model.media.publicUrl" ref="image" />
            </template>
        </div>
        <div class="controls">
            <div class="row align-items-center">
                <div class="col-sm-6">
                    <vue-slider 
                        v-model="zoom" 
                        contained="true" 
                        :min=".2" 
                        :max="1" 
                        :interval=".01" 
                        :tooltip-formatter="(val) => Math.round(val * 100) + '%'"
                    ></vue-slider>
                </div>
                <div class="col-sm-4">
                    <div class="input-group">
                        <label class="form-label mt-2 mr-2">Select Crop</label>
                        <select class="form-control" name="crop"  v-model="selectedCropType" @change="reloadCropper()">
                            <option v-for="crop in cropTypes" :value="crop">{{crop}}</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-2 text-right">
                    <button class="btn btn-info btn-sm" title="Clear crop" @click.prevent="clear()"><i class="fas fa-sync-alt"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ["uid", "model"],
        components: {
            VueSlider: window['vue-slider-component']
        },
        data: function () {
            return {
                isReady: false,
                cropper: null,
                zoom: 1,
                shown: false,
                supportedContentTypes: [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif'
                ],
                cropTypes: ["Default"],
                selectedCropType: "Default"
            };
        },
        mounted: function () {

            this.$modal = $('#previewModal');
            this.$pane = this.$modal.find('#' + this.uid);
            this.$navLink = this.$modal.find('.nav-link[href="#' + this.uid + '"]');
            this.$navItem = this.$navLink.parent().addClass('image-editor-nav-item');

            this.$navItem.on("shown.bs.tab", () => {
                this.elementIsShowing() && this.onShown();
            });

            this.$modal.on("shown.bs.modal", () => {
                this.elementIsShowing() && this.onShown();
            });

            this.$modal.on("hidden.bs.modal", () => {
                this.onHide();
            });
        },
        watch: {
            zoom: function (newValue) {
                if (this.isReady) {
                    this.updateZoom(newValue);
                }
            },
            isSupported: function (newValue, oldValue) {
                this.$modal.toggleClass('has-image-editor', newValue);
                // Show the editor by default if supported
                if (newValue && !oldValue) {

                    if (this.elementIsShowing()) {
                        this.reloadCropper();
                    } else {
                        this.$navLink.tab('show');
                    }
                }
            }
        },
        computed: {
            fieldValue: function () {
                var model = this.model && this.model.field ? this.model.field.model : {};
                if (!model.cropData) {
                    return null;
                }
                return model.cropData[this.selectedCropType];
            },
            hasCropData: function () {
                var value = this.fieldValue;
                return value && value.width && value.height;
            },
            isSupported: function () {
                if (this.model && this.model.media && this.model.field) {
                    return this.supportedContentTypes.indexOf(this.model.media.contentType) > -1;
                }
                return false;
            }
        },
        methods: {
            onShown: function () {
                this.shown = true;
                this.reloadCropper();
            },
            onHide: function () {
                this.shown = false;
                if (this.cropper) {
                    this.cropper.destroy();
                    this.cropper = null;
                }
                this.isReady = false;
            },
            setCropData: function (data) {
                var model = this.model && this.model.field ? this.model.field.model : {};
                if (!model.cropData) {
                    model.cropData = {};
                }
                model.cropData[this.selectedCropType] = data;
            },
            updateZoom: function (value) {
                if (this.cropper) {
                    var imageData = this.cropper.getImageData();
                    var containerData = this.cropper.getContainerData();

                    if(imageData.aspectRatio >=1){
                        this.cropper.zoomTo((containerData.width / imageData.naturalWidth) - (1 - value));
                    }else{
                        this.cropper.zoomTo((containerData.height / imageData.naturalHeight) - (1 - value));
                    }

                }
            },
            getFieldSettings: function() {
                return this.model && this.model.field && this.model.field.meta ? this.model.field.meta.settings : {};
            },
            initCropper: function () {

                if (!this.isSupported || this.cropper) {
                    return;
                }
                
                this.isReady = false;
                var fieldSettings = this.getFieldSettings();
                var fieldValue = this.fieldValue;
                var hasCropData = this.hasCropData;
                clearTimeout(this.initCropperTimeout);

                this.initCropperTimeout = setTimeout(() => {
                    var opts = {
                        background: false,
                        guides: false,
                        autoCrop: false,
                        scalable: false,
                        rotatable: false,
                        zoomOnWheel: false,
                        toggleDragModeOnDblclick: false,
                        ready: () => {
                            this.updateZoom(this.zoom);
                            if (hasCropData) {
                                this.cropper.setData(fieldValue);
                            }
                            this.isReady = true;
                        },
                        crop: (event) => {
                            this.setCropData(Object.assign(this.cropper.getData(true), { zoom: this.zoom }));
                        }
                    };

                    if (hasCropData) {
                        this.zoom = fieldValue.zoom || 1;
                        opts.autoCrop = true;
                    } else {
                        this.zoom = 1;
                    }

                    //handle aspect ratio
                    if(fieldSettings.AspectRatios && fieldSettings.AspectRatios.length === fieldSettings.Crops.length){
                        opts.aspectRatio = fieldSettings.AspectRatios.$values[this.cropTypes.indexOf(this.selectedCropType)]
                    }
                    else if (fieldSettings.AspectRatio) {
                        opts.aspectRatio = fieldSettings.AspectRatio;
                    }

                    if (fieldSettings.MinWidth) {
                        opts.minCropBoxWidth = fieldSettings.MinWidth;
                    }

                    if (fieldSettings.MinHeight) {
                        opts.minCropBoxHeight = fieldSettings.MinHeight;
                    }

                    this.cropper = new Cropper(this.$refs.image, opts);
                });
            },
            reloadCropper: function () {
                if (this.cropper) {
                    this.cropper.destroy();
                    this.cropper = null;
                }else{
                    if(this.getFieldSettings().Crops !== null && this.getFieldSettings().Crops !== undefined){
                        this.cropTypes = this.getFieldSettings().Crops.$values.length === 0 ? ["Default"] : this.getFieldSettings().Crops.$values;
                        this.selectedCropType = this.cropTypes[0]
                    }else{
                        this.cropTypes = ["Default"],
                        this.selectedCropType = "Default"
                    }
                }

                this.initCropper();
            },
            elementIsShowing: function () {
                return this.$modal.hasClass('show') && this.$pane.hasClass('active') && this.$pane.hasClass('show');
            },
            reset: function () {
                if (this.cropper) {
                    this.cropper.reset();
                }
            },
            clear: function () {
                if (this.cropper) {
                    this.cropper.clear();
                }
                this.zoom = 1;
            }
        }
    }
</script>
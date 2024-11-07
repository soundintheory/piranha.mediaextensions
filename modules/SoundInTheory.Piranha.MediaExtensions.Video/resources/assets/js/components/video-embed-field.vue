<template>
    <div>
        <input class="form-control" type="text" :placeholder="meta.placeholder" v-model="model.value" v-on:change="update()">
    </div>
</template>

<script>
    export default {
        props: ["uid", "model", "meta"],
        methods: {
            update: function () {
                // Tell parent that title has been updated
                if (this.meta.notifyChange) {
                    this.$emit('update-title', {
                        uid: this.uid,
                        title: this.model.value
                    });
                }
            },
            isRequired: function () {
                return false;
                //return this.meta.settings.IsRequired != null && this.meta.settings.IsRequired;
            }
        }
    }
</script>
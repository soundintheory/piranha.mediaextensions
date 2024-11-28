<template>
  <div>
    <input class="form-control"
                v-model="model.value"
                type="text"
                placeholder="Enter video link or ID"
                v-on:change="onInputChange" />           
        <div v-if="error" class="error">{{ error }}</div>
        <div>
          <div v-if="loading" class="loading">Loading Preview ...</div>
          <div v-html="model.videoInfo.iframe_html" v-if="model.videoInfo" class="video-info">        
          </div>
        </div>    
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      loading: false,
      error: null,
    };
  },
   props: ["uid", "model", "meta"],
  methods: {
    async onInputChange(showError = true) {
      this.error = null;
      this.model.videoInfo = null;

      const value = this.model.value;

      if (!value) {
        this.error = showError ? "Please enter a video link or ID." : "";
        return;
      }

      try {
        this.loading = true;

        const response = await fetch(
          `/sit-mediaextensions/video/get-details?input=${encodeURIComponent(
            value
          )}`
        );

        if (!response.ok) {
          this.error = showError ? "Failed to fetch video details." : "";
          return;
        }

        this.model.videoInfo = await response.json();
          
      } catch (err) {
        this.error = err.message || "An error occurred.";
        this.error = showError ? (err.message || "An error occurred.") : "";
        return;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted: function () {
      this.onInputChange(false);
  }
};
</script>

<style>
.video-info-fetcher {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 16px;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.loading {
  color: blue;
  margin-bottom: 10px;
}

.video-info img {
  max-width: 100%;
  height: auto;
}

.video-info h3 {
  margin-top: 10px;
}
</style>

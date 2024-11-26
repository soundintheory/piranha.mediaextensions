<template>
  <div>
    <h3>Enter a Video Link/ID</h3>
    <div class="row">
        <div class="col-8">
            <input class="form-control"
                   v-model="model.value"
                   type="text"
                   placeholder="Enter video link or ID"
                   v-on:change="onInputChange" />           
            <div v-if="error" class="error">{{ error }}</div>
            <h4 v-if="model.videoInfo">{{ model.videoInfo.title }}</h4>
            <p v-if="model.videoInfo">
                Provider: {{ model.videoInfo.provider_name }}
                <br/>
                Author: {{ model.videoInfo.author_name }}
            </p>
        </div>
        <div class="col-4">
            <div v-if="loading" class="loading">Loading...</div>
            <div v-if="model.videoInfo" class="video-info">            
                <img :src="model.videoInfo.thumbnail_url" :alt="model.videoInfo.title" />                
            </div>
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
    async onInputChange() {
      this.error = null;
      this.model.videoInfo = null;

      const value = this.model.value;

      if (!value) {
        this.error = "Please enter a video link or ID.";
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
          throw new Error("Failed to fetch video details.");
        }

        this.model.videoInfo = await response.json();
          
      } catch (err) {
        this.error = err.message || "An error occurred.";
      } finally {
        this.loading = false;
      }
    },
  },
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

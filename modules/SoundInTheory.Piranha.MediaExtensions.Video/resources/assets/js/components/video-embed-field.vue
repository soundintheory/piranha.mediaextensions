<template>
  <div class="video-info-fetcher">
    <h2>Enter a Video Link/ID</h2>
    <input
     class="form-control"
      v-model="model.value"
      type="text"
      placeholder="Enter video link or ID"
      v-on:change="onInputChange"
    />
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="videoInfo" class="video-info">
      <h3>{{ videoInfo.title }}</h3>
      <img :src="videoInfo.thumbnail_url" :alt="videoInfo.title" />
      <p>Author: {{ videoInfo.author_name }}</p>
      <p>Provider: {{ videoInfo.provider_name }}</p>
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
      this.videoInfo = null;

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

        this.videoInfo = await response.json();
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

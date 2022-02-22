<template>
  <div class="h-screen w-screen bg-gray-800">
    <video ref="videoPlayer" class="video-js w-full h-full"></video>
  </div>
</template>

<script>
import videojs from "video.js";

export default {
  name: 'VideoPlayer',
  props: {},
  data() {
    return {
      player: null,
      videoOptions: {
        autoplay: true,
        controls: false,
        // fluid: true,
        sources: [
          {
            src:
                "/videos/sample_video_10_frames.mp4",
            type: "video/mp4"
          }
        ]
      }
    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {
      console.log('onPlayerReady', this);
    })
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style scoped>
</style>

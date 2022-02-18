<template>
  <video ref="videoPlayer" class="video-js"></video>
</template>

<script>
import videojs from "video.js";

export default {
  name: 'HelloWorld',
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      player: null,
      videoOptions: {
        autoplay: false,
        controls: true,
        // fluid: true,
        sources: [
          {
            src:
                "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
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

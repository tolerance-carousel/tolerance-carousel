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
        sources: [
          {
            src:
                "/videos/sample_video_10_sec.m4v",
            type: "video/mp4"
          }
        ]
      }
    }
  },
  methods: {
    onVideoFinished() {
      this.$router.push('/polis')
    }
  },
  mounted() {
    const self = this;
    this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {
      this.on('ended', self.onVideoFinished);
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

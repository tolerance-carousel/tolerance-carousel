<template>
  <div class="h-screen w-screen bg-gray-800">
    <video ref="videoPlayer" class="video-js w-full h-full"></video>
  </div>
  <div v-if="themeId" class="absolute text-white top-0">
    <p>Theme: {{ themeId }}</p>
    <p>State: {{ videoState }}</p>
  </div>
</template>

<script>
import videojs from "video.js";
import {VideoState} from "../models/video-state";
import {mapActions, mapGetters, mapState} from "vuex";
import config from '../config.js'

export default {
  name: 'VideoPlayer',
  props: {},
  computed: {
    ...mapState({themeId: 'themeId'}),
    ...mapGetters({videoState: 'videoStateModule/getState'})
  },
  watch: {
    videoState (newState, prevState) {
      console.log(prevState, '->', newState);
      if(newState === VideoState.EnteringInput) {
        this.player.pause();
      } else {
        this.player.play();
      }
    }
  },
  data() {
    return {
      player: null,
      videoOptions: {
        autoplay: true,
        controls: false,
        loop: true,
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
    },
    ...mapActions({
      updateOnServer: 'videoStateModule/updateOnServer',
      updateFromServer: 'videoStateModule/updateFromServer',
    })
  },
  mounted() {
    const self = this;
    this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {
      this.on('ended', self.onVideoFinished);
    });
    this.updateOnServer(VideoState.Playing);

    setInterval(async () => {
      await this.updateFromServer();
    }, config.POLL_SERVER_EVERY_MS);
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

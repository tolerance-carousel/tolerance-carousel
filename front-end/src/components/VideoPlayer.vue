<template>
  <div v-if="!themeId">Error: Theme ID is incorrect.</div>
  <div v-if="videoState === VideoState.ServerError" class="m-2">
    <p><em>We are experiencing technical difficulties... Our apologies for the inconvenience.</em></p>
  </div>
  <div v-show="videoState === VideoState.Playing || videoState === VideoState.EnteringInput">
    <div class="h-screen w-screen bg-gray-800">
      <video ref="videoPlayer" class="video-js w-full h-full"></video>
    </div>
  </div>

  <div v-if="config.DEBUG && themeId" class="absolute text-white drop-shadow-md top-0">
    <p>Theme: {{ themeId }}</p>
    <p>PlayerState: {{ playerState }}</p>
  </div>

</template>

<script>
import videojs from "video.js";
import {VideoState} from "../models/video-state";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import Config from '../config.js'

export default {
  name: 'VideoPlayer',
  props: {},
  computed: {
    ...mapGetters({
      playerState: 'videoStateModule/getState',
      themeId: 'themeModule/getId',
      getVideoPath: 'themeModule/getVideoPath'
    }),
    videoState() {
      return this.playerState.videoState;
    }
  },
  watch: {
    themeId(newId, prevId) {
      if (newId) {
        this.updateVideoStateOnServer(VideoState.Playing);
      }
    },
    playerState: {
      deep: true,
      handler(newState, prevState) {
        console.log(prevState, '->', newState);

        if (newState.videoState === VideoState.Idle) {
          this.updateVideoStateOnServer(VideoState.Playing);
        }

        if (newState.videoState === VideoState.Playing) {
          this.initVideoPlayer();
        }

        if (newState.videoState === VideoState.EnteringInput) {
          this.player.pause();
        } else {
          this.player.play();
        }
      }
    }
  },
  data() {
    return {
      config: Config,
      VideoState: VideoState,
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
      this.updateVideoStateOnServer(VideoState.EnteringInput);
    },
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
      updateFromServer: 'videoStateModule/updateFromServer',
    }),
    ...mapMutations({selectThemeById: 'themeModule/selectById'}),
    initVideoPlayer() {
      if (this.player) {
        return;
      }

      const self = this;

      this.videoOptions.sources[0].src = this.getVideoPath;
      this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {
        this.on('ended', self.onVideoFinished);
      });
      console.log("Initialized video player...", this.$refs.videoPlayer);
    }
  },
  mounted() {
    this.selectThemeById(this.$route.params.themeId);

    // TODO: Wait for response before sending new request.
    setInterval(async () => {
      await this.updateFromServer();
    }, Config.POLL_SERVER_EVERY_MS);
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

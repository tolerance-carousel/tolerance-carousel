<template>
  <div v-if="!themeId">Error: Theme ID is incorrect.</div>
  <div v-if="videoState === VideoState.ServerError" class="m-2">
    <p><em>We are experiencing technical difficulties... Our apologies for the inconvenience.</em></p>
  </div>
  <div v-if="videoState === VideoState.Welcome" class="m-2">
    <a :href="`/share-perspective/${this.themeIdStr}`"><img :src="`/qr-codes/${this.themeIdStr}.png`"
                                                            :alt="`${this.themeId} QR Code`" class="mx-auto"></a>
  </div>
  <div v-show="videoState === VideoState.Playing || videoState === VideoState.EnteringInput">
    <div class="h-screen w-screen bg-gray-800">
      <video ref="videoPlayer" class="video-js w-full h-full"></video>
    </div>

    <div v-if="isDevMode && themeId" class="absolute text-white drop-shadow-md top-0">
      <p>Theme: {{ themeId }}</p>
      <p>PlayerState: {{ playerState }}</p>

      <div v-if="videoState === VideoState.EnteringInput">
        <p>ENTERING INPUT</p>
        <video-player-countdown :video-starts-at="playerState.startsAt"></video-player-countdown>
      </div>
    </div>


  </div>

</template>

<script>
import videojs from "video.js";
import {mapActions, mapGetters, mapMutations} from "vuex";
import VideoPlayerCountdown from "./VideoPlayerCountdown.vue";
import {VideoState} from "../../models/video-state";

export default {
  name: 'VideoPlayer',
  components: {VideoPlayerCountdown},
  props: {},
  computed: {
    ...mapGetters({
      playerState: 'videoStateModule/getState',
      themeId: 'themeModule/getId',
      themeIdStr: 'themeModule/getIdStr',
      getVideoPath: 'themeModule/getVideoPath'
    }),
    videoState() {
      return this.playerState.videoState;
    }
  },
  watch: {
    themeId(newId, prevId) {
      if (newId) {
        // this.updateVideoStateOnServer(VideoState.Welcome);
      }
    },
    playerState: {
      deep: true,
      handler(newState, prevState) {
        if (newState) {
          console.log(prevState, '->', newState);

          this.updateVideoPlayerSource();

          if (newState.videoState === VideoState.Playing) {
            // TODO: Fix issue of video not playing in production made (might be timing-related)
            this.player.play();
          }

          if (newState.videoState === VideoState.EnteringInput) {
            this.player.pause();
          }

          if (newState.videoState === VideoState.Welcome) {
            this.player.pause();
            this.player.currentTime(0);
          }
        }
      }
    }
  },
  data() {
    return {
      VideoState: VideoState,
      player: null,
      isDevMode: import.meta.env.DEV,
      videoOptions: {
        autoplay: false,
        controls: false,
        loop: false,
        sources: [
          {
            src: null,
            type: "video/mp4"
          }
        ]
      },
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
    updateVideoPlayerSource() {
      if (!this.player) {
        this.initVideoPlayer();
      }

      const currentSource = this.videoOptions.sources[0].src;
      if (currentSource !== this.getVideoPath) {
        this.videoOptions.sources[0].src = this.getVideoPath;
        this.player.src(this.videoOptions.sources[0]);
        this.player.load();

        if (this.playerState.videoState === VideoState.Playing) {
          this.player.play();
        }
      }
    },
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
    },

  },
  mounted() {
    this.selectThemeById(this.$route.params.themeId);

    // TODO: Wait for response before sending new request.
    setInterval(async () => {
      await this.updateFromServer();
    }, import.meta.env.APP_POLL_SERVER_EVERY_MS);
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

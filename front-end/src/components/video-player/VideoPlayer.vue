<template>
  <div v-if="!roomId">Error: Room ID is incorrect.</div>
  <div v-if="videoState === VideoState.ServerError" class="m-2">
    <p><em>Er lijken technische problemen te zijn... Excuses voor het ongemak.</em></p>
  </div>
  <div v-if="videoState === VideoState.ThankYou">
    <ThankYou/>
  </div>
  <div v-if="videoState === VideoState.Welcome" class="m-2">
    <SharePerspectiveLink :room-id="roomId"/>
    <div class="text-center">
      <button @click="onStartVideo()" class="mt-5 rounded-full bg-slate-600	px-5 py-2 text-white hover:bg-slate-700">
        Start de show
      </button>

      <br/>

      <PasswordInput :hide-label="true" @submitted="onStartVideo()"/>
    </div>
  </div>
  <div v-show="videoState === VideoState.Playing || videoState === VideoState.EnteringInput">
    <div class="absolute bottom-10 left-4 z-40" v-show="videoState === VideoState.Playing">
      <SharePerspectiveLink :room-id="roomId" :show-as-video-overlay="true"/>
    </div>

    <div class="h-screen w-screen bg-gray-800">
      <video ref="videoPlayer" class="video-js w-full h-full"></video>
    </div>

    <div v-if="roomId" class="absolute text-white drop-shadow-md top-0 right-4 mt-3 z-40 text-right">
      <div class="ml-3">
        <button @click="onResetShow()"
                class="bg-red-800 opacity-0 hover:opacity-100 transition-opacity rounded-full px-3 mb-4">Volledige reset
          naar welkomstscherm
        </button>

        <!-- TODO: Add red highlight if password is not filled in -->
        <div class="text-black hover:opacity-100 transition-opacity"
             :class="noPasswordEntered ? 'opacity-100' : 'opacity-0'">
          <PasswordInput :hide-label="true"/>
        </div>

        <button @click="onNextVideo()"
                class="bg-slate-600 opacity-0 hover:opacity-100 transition-opacity rounded-full px-3 mt-2">Start
          volgende video
        </button>


      </div>

      <!--      <p>Room: {{ roomId }}</p>-->
      <!--      <p>PlayerState: {{ playerState }}</p>-->


    </div>


    <div class="text-center text-white w-[100vw] h-[100vh] absolute top-0 left-0 bg-black bg-opacity-60 pt-10"
         v-if="roomId && videoState === VideoState.EnteringInput">
      <video-player-countdown :video-starts-at="playerState.startsAt" :room-id="roomId"
                              :is-final-counter="isPlayingFinalVideo()"></video-player-countdown>
    </div>


  </div>

</template>

<script>
import videojs from "video.js";
import {mapActions, mapGetters, mapMutations} from "vuex";
import VideoPlayerCountdown from "./VideoPlayerCountdown.vue";
import {VideoState} from "../../models/video-state";
import SharePerspectiveLink from "./SharePerspectiveLink.vue";
import PasswordInput from "../admin/PasswordInput.vue";
import ThankYou from "./ThankYou.vue";

export default {
  name: 'VideoPlayer',
  components: {ThankYou, PasswordInput, SharePerspectiveLink, VideoPlayerCountdown},
  props: {},
  computed: {
    ...mapGetters({
      playerState: 'videoStateModule/getState',
      roomId: 'roomModule/getId',
      getVideoPath: 'videoStateModule/getVideoPath',
      noPasswordEntered: 'passwordModule/noPasswordEntered',
    }),
    videoState() {
      return this.playerState.videoState;
    }
  },
  watch: {
    roomId(newId, prevId) {
      // if (newId) {
      // }
    },
    playerState: {
      deep: true,
      handler(newState, prevState) {
        if (newState) {
          console.log(prevState, '->', newState);

          this.updateVideoPlayerSource();

          if (newState.videoState === VideoState.Playing) {
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
      videoOptions: {
        autoplay: false,
        controls: true,
        controlBar: {fullscreenToggle: false, pictureInPictureToggle: false},
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
      resetRoomShowOnServer: 'videoStateModule/resetRoomShowOnServer',
      goToNextVideoOnServer: 'videoStateModule/goToNextVideoOnServer',
    }),
    ...mapMutations({selectRoomById: 'roomModule/selectById'}),
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
    onStartVideo() {
      this.updateVideoStateOnServer(VideoState.Playing);
      if (this.player) {
        this.player.play();
      }
    },
    onResetShow() {
      this.resetRoomShowOnServer();
    },
    onNextVideo() {
      this.goToNextVideoOnServer();
    },
    isPlayingFinalVideo() {
      return this.playerState.currentTheme === "sexuality";
    }
  },
  mounted() {
    this.selectRoomById(this.$route.params.roomId);

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

<style>
/*.vjs-control-bar, .vjs-big-play-button {*/
/*  z-index: 999;*/
/*}*/
</style>

<template>
  <div v-if="!roomId">Error: Room ID is incorrect.</div>
  <div v-if="videoState === VideoState.ServerError" class="m-2">
    <p><em>We are experiencing technical difficulties... Our apologies for the inconvenience.</em></p>
  </div>
  <div v-if="videoState === VideoState.ThankYou" class="m-4">
    <h1 class="text-2xl font-bold">
      <em>
        Thank you for participating!
      </em>
    </h1>
    <p class="mt-2">
      Any questions, thoughts or comments? Feel free to reach out to one of the facilitators.
    </p>
    <button @click="onResetShow()"
            class="bg-slate-600 rounded-full text-white px-3 mt-10 opacity-0 hover:opacity-100 transition-opacity">
      Reset show
    </button>


    <div class="text-black opacity-0 hover:opacity-100 transition-opacity">
      <PasswordInput :hide-label="true"/>
    </div>
  </div>
  <div v-if="videoState === VideoState.Welcome" class="m-2">
    <SharePerspectiveLink :room-id="roomId"/>
    <div class="text-center">
      <button @click="onStartVideo()" class="mt-5 rounded-full bg-slate-600	px-5 py-2 text-white hover:bg-slate-700">
        Start the show
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

    <div v-if="roomId" class="absolute text-white drop-shadow-md top-0 right-4 mt-3 text-right">
      <div class="ml-3">
        <button @click="onResetShow()"
                class="bg-slate-600 opacity-0 hover:opacity-100 transition-opacity rounded-full px-3 mt-1">Reset show
        </button>

        <!-- TODO: Add red highlight if password is not filled in -->
        <div class="text-black hover:opacity-100 transition-opacity" :class="noPasswordEntered ? 'opacity-100' : 'opacity-0'">
          <PasswordInput :hide-label="true"/>
        </div>
      </div>

      <!--      <p>Room: {{ roomId }}</p>-->
      <!--      <p>PlayerState: {{ playerState }}</p>-->

      <div class="text-center mt-10" style="width: 100vw" v-if="videoState === VideoState.EnteringInput">
        <video-player-countdown :video-starts-at="playerState.startsAt" :room-id="roomId"
                                :is-final-counter="isPlayingFinalVideo()"></video-player-countdown>
      </div>
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

export default {
  name: 'VideoPlayer',
  components: {PasswordInput, SharePerspectiveLink, VideoPlayerCountdown},
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
html {
  overflow-x: hidden;
}
</style>

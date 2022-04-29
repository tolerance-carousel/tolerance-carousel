<template>
  <div v-if="videoStartsIn && videoStartsIn !== ''">
    <p class="text-5xl bg-gray-900 py-10 bg-opacity-60">{{ videoStartsIn }}
      <br/>
      <span class="text-2xl">
       before the next video starts...
      </span>
    </p>
  </div>
</template>

<script>
import {millisecondsToStr} from "../../utils/time-utils";
import {mapActions, mapGetters} from "vuex";
import {VideoState} from "../../models/video-state";

export default {
  name: 'VideoPlayerCountdown',
  props: ['videoStartsAt'],
  data() {
    return {
      videoStartsIn: "",
      countingDown: false
    }
  },
  computed: {
    ...mapGetters({
      playerState: 'videoStateModule/getState',
    }),
    videoState() {
      return this.playerState.videoState;
    }
  },
  watch: {
    playerState: {
      deep: true,
      handler(newState, prevState) {
        this.countingDown = true;
      }
    }
  },
  methods: {
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
      goToNextVideoOnServer: 'videoStateModule/goToNextVideoOnServer'
    }),
    updateVideoStartsIn() {
      if (!this.videoStartsAt || this.videoStartsAt < 0 || !this.countingDown) {
        this.videoStartsIn = "";
        return;
      }

      const videoStartsInMs = this.videoStartsAt - Date.now();
      if (videoStartsInMs <= 0 && this.videoState === VideoState.EnteringInput) {
        this.goToNextVideoOnServer();
        this.countingDown = false;
      }
      this.videoStartsIn = millisecondsToStr(videoStartsInMs);
    },
  },
  mounted() {
    this.countingDown = true;

    setInterval(() => {
      this.updateVideoStartsIn();
    }, 100);
  }
}
</script>

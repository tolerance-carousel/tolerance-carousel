<template>
  <div v-if="videoStartsIn && videoStartsIn !== ''"
       :class="[isMobileCounter ? '' : 'py-10 px-5 bg-black bg-opacity-60']">
    <p class="text-5xl" v-if="!isMobileCounter">
      Please share your perspective using your smartphone
    </p>
    <br v-if="!isMobileCounter"/>
    <p :class="[isMobileCounter ? 'font-bold italic' : 'text-2xl mb-5']">
      {{ videoStartsIn }} before
      {{ isFinalCounter ? "the show ends..." : "the next video starts..." }}
    </p>
    <SharePerspectiveLink :room-id="roomId" v-if="!isMobileCounter"/>
  </div>
</template>

<script>
import {millisecondsToStr} from "../../utils/time-utils";
import {mapActions, mapGetters} from "vuex";
import {VideoState} from "../../models/video-state";
import SharePerspectiveLink from "./SharePerspectiveLink.vue";

export default {
  name: 'VideoPlayerCountdown',
  props: ['videoStartsAt', 'isMobileCounter', 'roomId', 'isFinalCounter'],
  components: {SharePerspectiveLink},
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
      goToNextVideoOnServer: 'videoStateModule/goToNextVideoOnServer'
    }),
    updateVideoStartsIn() {
      if (!this.videoStartsAt || this.videoStartsAt < 0 || !this.countingDown) {
        this.videoStartsIn = "";
        return;
      }

      const videoStartsInMs = this.videoStartsAt - Date.now();
      if (!this.isMobileCounter && videoStartsInMs <= 0 && this.videoState === VideoState.EnteringInput) {
        this.goToNextVideoOnServer().then((response) => {
          console.log('Server state:', response);
          this.countingDown = false;
        }).catch(error => {
          console.warn('Could not update video state on server...', error);
        });
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

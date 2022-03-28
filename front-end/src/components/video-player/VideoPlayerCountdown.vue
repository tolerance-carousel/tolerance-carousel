<template>
  <p>Starts in: {{ videoStartsIn }}</p>
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
      videoStartsIn: ""
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
  methods: {
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer'
    }),
    updateVideoStartsIn() {
      if (!this.videoStartsAt || this.videoStartsAt < 0) {
        this.videoStartsIn = "";
        return;
      }

      const videoStartsInMs = this.videoStartsAt - Date.now();
      if (videoStartsInMs <= 0 && this.videoState !== VideoState.Playing) {
        // TODO: Prevent many requests from firing successively.
        this.updateVideoStateOnServer(VideoState.Playing);
      }
      this.videoStartsIn = millisecondsToStr(videoStartsInMs);
    },
  },
  mounted() {
    setInterval(() => {
      this.updateVideoStartsIn();
    }, 100);
  }
}
</script>

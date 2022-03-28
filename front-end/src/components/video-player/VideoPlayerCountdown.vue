<template>
  <p>Starts in: {{ videoStartsIn }}</p>
</template>

<script>
import {millisecondsToStr} from "../../utils/time-utils";

export default {
  name: 'VideoPlayerCountdown',
  props: ['videoStartsAt'],
  data() {
    return {
      videoStartsIn: -1
    }
  },
  methods: {
    updateVideoStartsIn() {
      this.videoStartsIn = millisecondsToStr(this.videoStartsAt - Date.now());
    }
  },
  mounted() {
    setInterval(() => {
      this.updateVideoStartsIn();
    }, 100);
  }
}
</script>

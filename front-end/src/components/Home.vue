<template>
  <router-link to="/video">Start</router-link>
  <p v-if="themeId">
    Theme ID: {{ themeId }}
  </p>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {VideoState} from "../models/video-state";

export default {
  name: "Home",
  computed: mapState(['themeId']),
  methods: {
    ...mapActions([
      'updateVideoState',
    ])
  },
  mounted() {
    this.updateVideoState(VideoState.Idle);
  }
}
</script>

<style scoped>

</style>

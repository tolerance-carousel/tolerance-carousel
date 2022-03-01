<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="h-full">
      <router-link to="/video">Back to video</router-link>
    </div>
    <div class="h-full">
      <div class='polis' data-conversation_id='3bbxvmcwdc'></div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import {VideoState} from "../models/video-state";

export default {
  name: "Polis",
  mounted() {
    // TODO: Host embed script locally, and add styling/layout changes there.
    let polisEmbedScript = document.createElement('script');
    polisEmbedScript.setAttribute('src', 'https://pol.is/embed.js');
    document.head.appendChild(polisEmbedScript);

    this.updateVideoState(VideoState.EnteringInput);
  },
  methods: {
    ...mapActions([
      'updateVideoState',
    ])
  }
}
</script>

<style>
</style>

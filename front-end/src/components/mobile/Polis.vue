<template>
  <div class="m-2">
    <div>
      <p>Share your perspective:</p>
      <input type="text" class="border-2"/>
    </div>
    <div class="mt-2">
      <button @click="onSetVoting">Continue voting</button>
    </div>
    <div>
      <button @click="onFinishedVoting">Done voting</button>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import {VideoState} from "../../models/video-state";

export default {
  name: "Polis",
  mounted() {
    // let polisEmbedScript = document.createElement('script');
    // polisEmbedScript.setAttribute('src', 'https://pol.is/embed.js');
    // document.head.appendChild(polisEmbedScript);

    this.updateOnServer(VideoState.EnteringInput);
  },
  methods: {
    ...mapActions({
      updateOnServer: 'videoStateModule/updateOnServer',
    }),
    onSetVoting() {
      this.updateOnServer(VideoState.EnteringInput);
    },
    onFinishedVoting() {
      this.updateOnServer(VideoState.Playing);
    }
  }
}
</script>

<style>
</style>

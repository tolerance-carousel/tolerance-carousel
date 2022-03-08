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
import {mapActions, mapGetters, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";

export default {
  name: "SharePerspective",
  watch: {
    themeId(newId, prevId) {
      if (newId) {
        this.updateVideoStateOnServer(VideoState.EnteringInput);
      }
    }
  },
  mounted() {
    // let polisEmbedScript = document.createElement('script');
    // polisEmbedScript.setAttribute('src', 'https://pol.is/embed.js');
    // document.head.appendChild(polisEmbedScript);

    this.selectThemeById(this.$route.params.themeId);
  },
  computed: {
    ...mapGetters({
      themeId: 'themeModule/getId',
    })
  },
  methods: {
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
    }),
    ...mapMutations({selectThemeById: 'themeModule/selectById'}),
    onSetVoting() {
      this.updateVideoStateOnServer(VideoState.EnteringInput);
    },
    onFinishedVoting() {
      this.updateVideoStateOnServer(VideoState.Playing);
    }
  }
}
</script>

<style>
</style>

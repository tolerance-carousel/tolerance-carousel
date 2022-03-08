<template>
  <div class="m-2" v-if="playerState.videoState === VideoState.Welcome">
    <p>[BRIEF SURVEY]</p>
    <button @click="onStartVideo">START</button>
  </div>
  <div class="m-2" v-if="playerState.videoState === VideoState.Playing">
    <p>(Watch video on screen)</p>
  </div>
  <div class="m-2" v-if="playerState.videoState === VideoState.EnteringInput">
    <div>
      <p>Share your perspective:</p>
      <input type="text" class="border-2"/>
    </div>
    <div class="mt-2">
      <button @click="onFinishedVoting">Done voting</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";

export default {
  name: "SharePerspective",
  data() {
    return {
      VideoState: VideoState
    }
  },
  watch: {
    themeId(newId, prevId) {
      if (newId) {
        // this.updateVideoStateOnServer(VideoState.Playing);
      }
    }
  },
  mounted() {
    // let polisEmbedScript = document.createElement('script');
    // polisEmbedScript.setAttribute('src', 'https://pol.is/embed.js');
    // document.head.appendChild(polisEmbedScript);

    this.selectThemeById(this.$route.params.themeId);


    // TODO: Wait for response before sending new request.
    setInterval(async () => {
      await this.updateFromServer();
    }, import.meta.env.APP_POLL_SERVER_EVERY_MS);
  },
  computed: {
    ...mapGetters({
      themeId: 'themeModule/getId',
      playerState: "videoStateModule/getState"
    })
  },
  methods: {
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
      updateFromServer: 'videoStateModule/updateFromServer',
      goToNextVideoOnServer: 'videoStateModule/goToNextVideoOnServer'
    }),
    ...mapMutations({selectThemeById: 'themeModule/selectById'}),
    onStartVideo() {
      this.updateVideoStateOnServer(VideoState.Playing);
    },
    onFinishedVoting() {
      this.goToNextVideoOnServer();
    }
  }
}
</script>

<style>
</style>

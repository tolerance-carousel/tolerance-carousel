<template>
  <div class="m-2" v-if="playerState.videoState === VideoState.Welcome">
    <p>{{themeId}}</p>
  </div>
  <div class="m-2" v-if="playerState.videoState === VideoState.Playing">
    <p>(Watch video on screen)</p>
  </div>
  <div class='polis' data-conversation_id='7zjcnxfbpm' v-show="playerState.videoState === VideoState.EnteringInput"></div>
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
    // TODO: Reload every time another theme shows up (-> updating to a new Polis conversation with another ID)
    let polisEmbedScript = document.createElement('script');
    polisEmbedScript.setAttribute('src', '/embed.js');
    document.head.appendChild(polisEmbedScript);

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
.polis iframe {
  height: 100vh;
  width: 100vw;
}
</style>

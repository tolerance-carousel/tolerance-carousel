<template>
  <div class="m-2">Room theme: {{playerState.currentTheme}}</div>
  <div class="m-2" v-if="playerState.videoState === VideoState.Welcome">
    <p>Waiting for video to start... Theme: {{ themeId }}</p>
  </div>
  <div class="m-2" v-if="playerState.videoState === VideoState.Playing">
    <p>(Watch video on screen)</p>
  </div>
  <div class='polis' data-conversation_id='7zjcnxfbpm'
       v-show="playerState.videoState === VideoState.EnteringInput"></div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";

export default {
  name: "SharePerspective",
  data() {
    return {
      VideoState: VideoState,
      themeId: ""
    }
  },
  watch: {},
  mounted() {
    // TODO: Reload every time another theme shows up (-> updating to a new Polis conversation with another ID)
    let polisEmbedScript = document.createElement('script');
    polisEmbedScript.setAttribute('src', '/embed.js');
    document.head.appendChild(polisEmbedScript);

    const roomId = this.$route.params.roomId;
    this.selectRoomById(roomId);

    // TODO: Wait for response before sending new request.
    setInterval(async () => {
      await this.updateFromServer();
    }, import.meta.env.APP_POLL_SERVER_EVERY_MS);
  },
  computed: {
    ...mapGetters({
      playerState: "videoStateModule/getState"
    })
  },
  methods: {
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
      updateFromServer: 'videoStateModule/updateFromServer',
      goToNextVideoOnServer: 'videoStateModule/goToNextVideoOnServer'
    }),
    ...mapMutations({selectRoomById: 'roomModule/selectById'}),
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

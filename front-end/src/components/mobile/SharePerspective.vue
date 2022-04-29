<template>
  <div class="m-2">Room theme: {{ currentTheme }}</div>
  <div class="m-2" v-if="playerState.videoState === VideoState.Welcome">
    <p>Waiting for video to start... Theme: {{ currentTheme }}</p>
  </div>
  <div class="m-2" v-if="playerState.videoState === VideoState.Playing">
    <p>(Watch video on screen)</p>
  </div>
  <div class="m-2" v-if="playerState.videoState === VideoState.ThankYou">
    <p>Thank you for participating!</p>
  </div>

  <div v-show="playerState.videoState === VideoState.EnteringInput">
    <div class="polis" v-for="(polisId, themeId) in polisIds" :data-conversation_id="polisId"
         v-show="currentTheme === themeId"></div>
  </div>

</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";

export default {
  name: "SharePerspective",
  data() {
    return {
      VideoState: VideoState,
      polisIds: {
        "migration": "7drxebn42f",
        "religion": "2nrtajkjsb",
        "sexuality": "9hv96xk6dj"
      }
    }
  },
  watch: {
    currentTheme(newThemeId, prevThemeId) {
      console.log("NEW THEME", prevThemeId, "->", newThemeId);

      this.reloadPolis();
    }
  },
  mounted() {
    const roomId = this.$route.params.roomId;
    this.selectRoomById(roomId);

    // TODO: Wait for response before sending new request.
    setInterval(async () => {
      await this.updateFromServer();
    }, import.meta.env.APP_POLL_SERVER_EVERY_MS);

    this.reloadPolis();
  },
  activated() {
    console.log("Activated!");
  },
  computed: {
    ...mapGetters({
      playerState: "videoStateModule/getState"
    }),
    currentTheme() {
      return this.playerState.currentTheme;
    }
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
    },
    reloadPolis() {
      const prevEmbedScripts = document.querySelectorAll('script[src="/embed.js"]');
      prevEmbedScripts.forEach(prevEmbedScript => {
        console.log("Removing prev embed script:", prevEmbedScript);
        prevEmbedScript.remove();
      });

      setTimeout(() => {
        console.log("Loading new embed script...");
        const polisEmbedScript = document.createElement('script');
        polisEmbedScript.setAttribute('src', '/embed.js');
        document.head.appendChild(polisEmbedScript);
      }, 1000);
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

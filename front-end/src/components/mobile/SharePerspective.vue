<template>
<!--  <div class="m-2">Room theme: {{ currentTheme }}</div>-->
  <div class="m-2" v-if="playerState.videoState === VideoState.Welcome">
    <p class="animate-pulse">
      Waiting for the show to start...
<!--      Wachten tot de show begint...-->
    </p>
<!--    <p>-->
<!--      Een moment geduld alsjeblieft.-->
<!--    </p>-->
<!--    Theme: {{ currentTheme }}-->
  </div>
  <div class="m-2" v-if="playerState.videoState === VideoState.Playing">
    <p>
      A video is now being played on the screen.
<!--      Er wordt nu een video afgespeeld op het scherm.-->
    </p>
  </div>
  <div class="m-4" v-if="playerState.videoState === VideoState.ThankYou">
    <h1 class="text-2xl font-bold">
      <em>
        Thank you for participating!
<!--        Dank je wel voor het meedoen!-->
      </em>
    </h1>
    <p class="mt-2">
      Questions, thoughts or comments? Feel free to reach out to one of the facilitators.
<!--      Vragen, gedachten of opmerkingen? Voel je vrij om iemand in je omgeving of een van de facilitators te benaderen.-->
    </p>
    <p class="mt-2">
      <!--      Je kunt nu dit venster sluiten.-->
            You may now close this window.
    </p>
  </div>

  <div v-show="playerState.videoState === VideoState.EnteringInput">
    <div class="py-1 px-2">
      <video-player-countdown :video-starts-at="playerState.startsAt" :is-mobile-counter="true"></video-player-countdown>
    </div>

    <div class="polis" v-for="(polisId, themeId) in polisIds" :data-conversation_id="polisId"
         v-show="currentTheme === themeId"></div>
  </div>

</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";
import VideoPlayerCountdown from "../video-player/VideoPlayerCountdown.vue";

export default {
  name: "SharePerspective",
  components: {VideoPlayerCountdown},
  data() {
    return {
      VideoState: VideoState,
      polisIds: {}
    }
  },
  watch: {
    currentTheme(newThemeId, prevThemeId) {
      console.log("NEW THEME", prevThemeId, "->", newThemeId);

      this.reloadPolis();
    }
  },
  mounted() {
    this.init();
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
      getPolisIdsFromServer: 'polisModule/getPolisIdsFromServer',
      initializeSocketConnection: 'videoStateModule/initializeSocketConnection'
    }),
    ...mapMutations({selectRoomById: 'roomModule/selectById'}),
    async init() {
      const roomId = this.$route.params.roomId;
      this.selectRoomById(roomId);

      this.polisIds = await this.getPolisIdsFromServer();
      this.reloadPolis();

      void this.initializeSocketConnection();
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

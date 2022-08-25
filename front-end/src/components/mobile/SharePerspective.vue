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
      <video-player-countdown :video-starts-at="playerState.startsAt"
                              :is-mobile-counter="true"></video-player-countdown>
    </div>

    <template v-for="(polisId, themeId) in polisIds">
      <div class="polis" :data-conversation_id="polisId"
           v-if="currentTheme === themeId"></div>
    </template>
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

      this.reloadPolis(0);
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
      initializeSocketConnection: 'videoStateModule/initializeSocketConnection',
      getServerLocationFromServer: 'polisModule/getServerLocationFromServer',
    }),
    ...mapMutations({selectRoomById: 'roomModule/selectById'}),
    async init() {
      const roomId = this.$route.params.roomId;
      this.selectRoomById(roomId);

      this.polisIds = await this.getPolisIdsFromServer();
      await this.reloadPolis();

      await this.initializeSocketConnection();
    },
    async reloadPolis(waitForInitialization = 1000) {
      const serverLocation = await this.getServerLocationFromServer();
      let embedFile = '/embed.js';
      if(serverLocation && serverLocation === 'us'){
        embedFile = '/embed_us-servers.js';
      }

      const prevEmbedScripts = document.querySelectorAll(`script[src^="/embed"]`);
      prevEmbedScripts.forEach(prevEmbedScript => {
        console.log("Removing prev embed script:", prevEmbedScript);
        prevEmbedScript.remove();
      });

      setTimeout(() => {
        console.log("Loading new embed script...", embedFile);
        const polisEmbedScript = document.createElement('script');
        polisEmbedScript.setAttribute('src', embedFile);
        document.head.appendChild(polisEmbedScript);
      }, waitForInitialization);
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

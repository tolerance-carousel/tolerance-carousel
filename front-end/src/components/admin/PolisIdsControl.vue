<template>
  <div class="mb-8">
    <h1 class="text-2xl font-bold">Polis IDs</h1>

    <div v-for="(polisId, themeKey) in serverPolisIds" v-if="serverPolisIds">
      <p>Current Polis ID for <strong>{{ themeKey }}</strong>: {{ polisId }}</p>
      <input type="text" class="border px-2 mb-3" v-model="polisIds[themeKey]"/>
    </div>

    <p v-if="!serverPolisIds">
      <em>Polis IDs are not (yet) loaded...</em>
    </p>

    <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="onUpdatePolisIdsOnServer()" v-if="serverPolisIds">
      Polis IDs opslaan
    </button>

    <div class="mt-4">
      <input type="checkbox" id="server-location-checkbox" name="server-location-checkbox" v-model="useUSServers" @change="onUpdateServerLocationOnServer($event)">
      <label for="server-location-checkbox" class="ml-2">Use US servers</label>
    </div>

  </div>
</template>

<script>

import {mapActions, mapMutations} from "vuex";

export default {
  name: "PolisIdsControl",
  data() {
    return {
      polisIds: null,
      serverPolisIds: null,
      useUSServers: false
    }
  },
  props: [],
  methods: {
    ...mapMutations({}),
    ...mapActions({
      getPolisIdsFromServer: 'polisModule/getPolisIdsFromServer',
      updatePolisIdsOnServer: 'polisModule/updatePolisIdsOnServer',
      getServerLocationFromServer: 'polisModule/getServerLocationFromServer',
      updateServerLocationOnServer: 'polisModule/updateServerLocationOnServer'
    }),
    async initPolisIds() {
      this.serverPolisIds = await this.getPolisIdsFromServer();
      this.polisIds = {...this.serverPolisIds};
    },
    async onUpdatePolisIdsOnServer() {
      this.serverPolisIds = await this.updatePolisIdsOnServer(this.polisIds);
      this.polisIds = {...this.serverPolisIds};
    },
    async onUpdateServerLocationOnServer(event) {
      const shouldUseUSServers = event.target.checked;
      await this.updateServerLocationOnServer(shouldUseUSServers ? 'us' : 'nl');
      await this.checkServerLocationOnServer();
    },
    async checkServerLocationOnServer() {
      const serverLocation = await this.getServerLocationFromServer();
      this.useUSServers = serverLocation === 'us';
    }
  },
  mounted() {
    this.initPolisIds();
    void this.checkServerLocationOnServer();
  }
}
</script>
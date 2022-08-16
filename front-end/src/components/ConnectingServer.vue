<template>
  <p class="p-2 pb-3 bg-gray-900 text-gray-50" v-if="!socketIsOpen">
    <svg class="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24">
      <circle class="opacity-0" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-100" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="relative top-0.5 animate-pulse">
      <span v-if="socketIsConnecting">
          Re-connecting to server...
      </span>
      <span v-if="socketIsClosed">
          Lost connection to server...
      </span>
    </span>
  </p>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "ConnectingServer",
  computed: {
    ...mapGetters({
      socketState: "videoStateModule/getSocketState"
    }),
    socketIsOpen() {
      return this.socketState === WebSocket.OPEN;
    },
    socketIsConnecting() {
      return this.socketState === WebSocket.CONNECTING;
    },
    socketIsClosed() {
      return this.socketState === WebSocket.CLOSED || this.socketState === WebSocket.CLOSING;
    }
  },
}
</script>

<style scoped>

</style>
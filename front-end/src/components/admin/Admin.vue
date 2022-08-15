<template>
  <div class="p-4">
    <p>To use the admin buttons below, please enter the <strong>password</strong> in the field below first.</p>
    <PasswordInput :hide-label="true"/>

    <hr class="my-5">

    <PolisIdsControl></PolisIdsControl>
    <RoomControl room-id="room_1" title="Room 1" :reset-video="resetVideo" :next-video="nextVideo" :room-states="getStates" />
    <RoomControl room-id="room_2" title="Room 2" :reset-video="resetVideo" :next-video="nextVideo" :room-states="getStates" />
    <RoomControl room-id="room_3" title="Room 3" :reset-video="resetVideo" :next-video="nextVideo" :room-states="getStates" />

  </div>

</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";
import PasswordInput from "./PasswordInput.vue";
import RoomControl from "./RoomControl.vue";
import PolisIdsControl from "./PolisIdsControl.vue";

export default {
  name: 'Admin',
  components: {PolisIdsControl, RoomControl, PasswordInput},
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getStates: 'videoStateModule/getStates'
    })
  },
  methods: {
    ...mapMutations({
      selectRoomById: 'roomModule/selectById',
    }),
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
      resetRoomShowOnServer: 'videoStateModule/resetRoomShowOnServer',
      goToNextVideoOnServer: 'videoStateModule/goToNextVideoOnServer',
      initializeSocketConnection: 'videoStateModule/initializeSocketConnection'
    }),
    startVideo(roomId) {
      this.selectRoomById(roomId);
      this.updateVideoStateOnServer(VideoState.Playing);
    },
    resetVideo(roomId) {
      this.selectRoomById(roomId);
      this.resetRoomShowOnServer();
    },
    nextVideo(roomId) {
      this.selectRoomById(roomId);
      this.goToNextVideoOnServer();
    },
  },
  mounted() {
    this.initializeSocketConnection();
  }
}
</script>

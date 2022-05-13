<template>
  <div class="p-4">
    <p>To use the admin buttons below, please enter the <strong>password</strong> in the field below first.</p>
    <PasswordInput :hide-label="true"/>

    <hr class="my-5">

    <!-- TODO: Add buttons to reset room to specific video / state -->
    <RoomControl room-id="room_1" title="Room 1" :start-video="startVideo" :reset-video="resetVideo" :room-states="roomStates" />
    <RoomControl room-id="room_2" title="Room 2" :start-video="startVideo" :reset-video="resetVideo" :room-states="roomStates" />
    <RoomControl room-id="room_3" title="Room 3" :start-video="startVideo" :reset-video="resetVideo" :room-states="roomStates" />

  </div>

</template>

<script>
import {mapActions, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";
import PasswordInput from "./PasswordInput.vue";
import RoomControl from "./RoomControl.vue";

export default {
  name: 'Admin',
  components: {RoomControl, PasswordInput},
  data() {
    return {
      roomStates: null
    }
  },
  methods: {
    ...mapMutations({
      selectRoomById: 'roomModule/selectById',
    }),
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
      resetRoomShowOnServer: 'videoStateModule/resetRoomShowOnServer',
      getRoomStatesFromServer: 'videoStateModule/getRoomStatesFromServer',
    }),
    startVideo(roomId) {
      this.selectRoomById(roomId);
      this.updateVideoStateOnServer(VideoState.Playing);
    },
    resetVideo(roomId) {
      this.selectRoomById(roomId);
      this.resetRoomShowOnServer();
    },

  },
  mounted() {
    setInterval(async() => {
      const roomStates = await this.getRoomStatesFromServer();
      if(!roomStates) {
        return;
      }
      console.log(roomStates);
      this.roomStates = roomStates;
    }, import.meta.env.APP_POLL_SERVER_EVERY_MS)
  }
}
</script>

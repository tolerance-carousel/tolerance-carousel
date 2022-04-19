<template>
  <p>ADMIN PANEL</p>
  <div>
    <button @click="startVideo('room_1')">Start room_1 video</button>
  </div>
  <div>
    <button @click="resetVideo('room_1')">Reset room_1 video</button>
  </div>
</template>

<script lang="ts">
import {mapActions, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";

export default {
  name: 'Admin',
  methods: {
    ...mapMutations({selectRoomById: 'roomModule/selectById'}),
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
    }),
    startVideo(roomId: string) {
      this.selectRoomById(roomId);
      this.updateVideoStateOnServer(VideoState.Playing);
    },
    resetVideo(roomId: string) {
      this.selectRoomById(roomId);
      this.updateVideoStateOnServer(VideoState.Welcome);
    },
  }
}
</script>

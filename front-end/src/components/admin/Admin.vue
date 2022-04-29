<template>
  <div class="p-4">
    <p class="font-bold mb-3">ADMIN PANEL</p>
    <div>
      <button @click="startVideo('room_1')">Start room_1 video</button>
    </div>
    <div>
      <button @click="resetVideo('room_1')">Reset room_1 video</button>
    </div>

    <div class="mt-4">
      <button @click="startVideo('room_2')">Start room_2 video</button>
    </div>
    <div>
      <button @click="resetVideo('room_2')">Reset room_2 video</button>
    </div>

    <div class="mt-4">
      <button @click="startVideo('room_3')">Start room_3 video</button>
    </div>
    <div>
      <button @click="resetVideo('room_3')">Reset room_3 video</button>
    </div>
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
      resetRoomShowOnServer: 'videoStateModule/resetRoomShowOnServer',
    }),
    startVideo(roomId: string) {
      this.selectRoomById(roomId);
      this.updateVideoStateOnServer(VideoState.Playing);
    },
    resetVideo(roomId: string) {
      this.selectRoomById(roomId);
      this.resetRoomShowOnServer();
    },
  }
}
</script>

<template>
  <div class="p-4">
    <p class="font-bold mb-3">ADMIN PANEL</p>
    <div>
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 " @click="startVideo('room_1')">Start room_1 video</button>
    </div>
    <div>
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="resetVideo('room_1')">Reset room_1 video</button>
    </div>

    <div class="mt-4">
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="startVideo('room_2')">Start room_2 video</button>
    </div>
    <div>
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="resetVideo('room_2')">Reset room_2 video</button>
    </div>

    <div class="mt-4">
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="startVideo('room_3')">Start room_3 video</button>
    </div>
    <div>
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="resetVideo('room_3')">Reset room_3 video</button>
    </div>

    <hr class="mt-5">
    <p class="mt-5">To use the admin buttons above, please enter the password in the field below first.</p>
    <PasswordInput :hide-label="true"/>
  </div>

</template>

<script>
import {mapActions, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";
import PasswordInput from "./PasswordInput.vue";

export default {
  name: 'Admin',
  components: {PasswordInput},
  data() {
    return {}
  },
  methods: {
    ...mapMutations({
      selectRoomById: 'roomModule/selectById',
    }),
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
      resetRoomShowOnServer: 'videoStateModule/resetRoomShowOnServer',

    }),
    startVideo(roomId) {
      this.selectRoomById(roomId);
      this.updateVideoStateOnServer(VideoState.Playing);
    },
    resetVideo(roomId) {
      this.selectRoomById(roomId);
      this.resetRoomShowOnServer();
    },

  }
}
</script>

<template>
  <div class="p-4">
    <p>To use the admin buttons below, please enter the <strong>password</strong> in the field below first.</p>
    <PasswordInput :hide-label="true"/>

    <hr class="my-5">

    <p class="font-bold mb-3">ADMIN PANEL</p>
    <div class="mb-8">
      <h1 class="text-2xl font-bold">Room 1</h1>
      <AdminRoomState v-if="roomStates && 'room_1' in roomStates" :room-state="roomStates['room_1']"/>
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 " @click="startVideo('room_1')">
        Start room_1 video
      </button>

      <br/>

      <button class="bg-red-800 hover:bg-red-900 rounded-full text-white px-3 mt-1" @click="resetVideo('room_1')">
        Fully reset room_1
      </button>
    </div>

    <div class="mb-8">
      <h1 class="text-2xl font-bold">Room 2</h1>
      <AdminRoomState v-if="roomStates && 'room_2' in roomStates" :room-state="roomStates['room_2']"/>
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="startVideo('room_2')">
        Start room_2 video
      </button>
      <br/>
      <button class="bg-red-800 hover:bg-red-900 rounded-full text-white px-3 mt-1" @click="resetVideo('room_2')">
        Fully reset room_2
      </button>
    </div>

    <div>
      <h1 class="text-2xl font-bold">Room 3</h1>
      <AdminRoomState v-if="roomStates && 'room_3' in roomStates" :room-state="roomStates['room_3']"/>
      <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="startVideo('room_3')">
        Start room_3 video
      </button>
      <br/>
      <button class="bg-red-800 hover:bg-red-900 rounded-full text-white px-3 mt-1" @click="resetVideo('room_3')">
        Fully reset room_3
      </button>
    </div>
  </div>

</template>

<script>
import {mapActions, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";
import PasswordInput from "./PasswordInput.vue";
import AdminRoomState from "./AdminRoomState.vue";

export default {
  name: 'Admin',
  components: {PasswordInput, AdminRoomState},
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

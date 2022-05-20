<template>
  <div class="mb-8">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <RoomState v-if="roomStates && roomId in roomStates" :room-state="roomStates[roomId]"/>
    <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-2" @click="startVideo(roomId)">
      Start huidige {{ roomId }} video
    </button>

    <br/>

    <button class="bg-slate-600 hover:bg-slate-700 rounded-full text-white px-3 mt-1" @click="nextVideo(roomId)">
      Ga naar volgende video van {{ roomId }}
    </button>

    <br/>

    <button class="bg-red-800 hover:bg-red-900 rounded-full text-white px-3 mt-1" @click="resetVideo(roomId)">
      Volledige reset van {{ roomId }} naar welkomstscherm
    </button>
  </div>
</template>

<script>
import RoomState from "./RoomState.vue";

export default {
  name: "RoomControl",
  props: ["roomStates", "resetVideo", "startVideo", "nextVideo", "roomId", "title"],
  components: {RoomState}
}
</script>
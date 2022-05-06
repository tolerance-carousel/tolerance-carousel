<template>
  <img :src="`/qr-codes/${roomId}.png`"
       :alt="`QR Code`"
       class="mx-auto rounded-md" :class="[showAsVideoOverlay ? 'w-32 mb-1' : '']">

  <div class="text-center">
    <a :href="`/share-perspective/${roomId}`"
       :class="[showAsVideoOverlay ? 'text-lg rounded-sm px-2 py-[0.1rem] bg-[rgba(255,255,255,0.75)]' : 'text-2xl']">
        <span v-if="roomId==='room_1'">
          https://edu.nl/xuu33
        </span>
      <span v-if="roomId==='room_2'">
          https://edu.nl/tt3vt
        </span>
      <span v-if="roomId==='room_3'">
          https://edu.nl/acttf
        </span>
    </a>
    <!--      <p>-->
    <!--        https://experience.boasmedia.nl/share-perspective/{{ roomId }}-->
    <!--      </p>-->
  </div>
</template>

<script>
export default {
  name: 'SharePerspectiveLink',
  props: ['roomId', 'showAsVideoOverlay']
}
</script>
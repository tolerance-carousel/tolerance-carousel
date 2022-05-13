<template v-if="roomState">
  <p>Current theme: <strong>{{roomState.currentTheme}}</strong></p>
  <p>State: <strong>{{roomState.videoState}}</strong></p>
</template>

<script>
export default {
  name: 'RoomState',
  props: ['roomState']
}
</script>
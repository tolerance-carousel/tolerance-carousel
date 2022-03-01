<template>
  <router-link to="/video">Start</router-link>
  <p v-if="themeId">
    Theme ID: {{ themeId }}
  </p>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Home",
  computed: mapState(['themeId'])
}
</script>

<style scoped>

</style>

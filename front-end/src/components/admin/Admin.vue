<template>
  <p>ADMIN PANEL</p>
  <div>
    <button @click="startVideo('sexuality')">Start sexuality video</button>
  </div>
  <div>
    <button @click="resetVideo('sexuality')">Reset sexuality video</button>
  </div>

  <div>
    <button @click="startVideo('migration')">Start migration video</button>
  </div>
  <div>
    <button @click="resetVideo('migration')">Reset migration video</button>
  </div>
</template>

<script lang="ts">
import {mapActions, mapMutations} from "vuex";
import {VideoState} from "../../models/video-state";

export default {
  name: 'Admin',
  methods: {
    ...mapMutations({selectThemeById: 'themeModule/selectById'}),
    ...mapActions({
      updateVideoStateOnServer: 'videoStateModule/updateVideoStateOnServer',
    }),
    startVideo(themeId: string) {
      this.selectThemeById(themeId);
      this.updateVideoStateOnServer(VideoState.Playing);
    },
    resetVideo(themeId: string) {
      this.selectThemeById(themeId);
      this.updateVideoStateOnServer(VideoState.Welcome);
    },
  }
}
</script>

<template>
  <div>
    <label class="mr-5" v-if="!hideLabel">Password</label>
    <input type="password" class="border mt-3 px-2" :value="getPassword" @keyup="onPasswordChanged"
           placeholder="Password"/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: 'PasswordInput',
  props: ['hideLabel'],
  computed: {
    ...mapGetters({
      getPassword: 'passwordModule/getPassword',
    }),
  },
  methods: {
    ...mapMutations({
      updatePassword: 'passwordModule/update'
    }),
    onPasswordChanged(event) {
      const password = event.target.value;
      this.updatePassword(password);
    }
  }
}
</script>
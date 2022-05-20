<template>
  <div class="text-center pt-8 bg-[#f4f2f0] text-[#111111] h-screen">
    <h1 class="text-4xl font-bold">
      Dank je wel voor het meedoen!
    </h1>
    <p class="mt-4 text-lg">
      Vragen, gedachten of opmerkingen? Voel je vrij om iemand in je omgeving of een van de facilitators te benaderen.
    </p>

    <div class="grid grid-cols-3 px-8 mt-8">
      <div class="mt-8 px-8">
        <img src="/stills/maria-ruysch.jpg" alt="Maria Ruysch" class="h-64 inline-block rounded-2xl drop-shadow">
        <p class="text-lg mt-2">Maria Ruysch</p>
      </div>
      <div class="mt-8 px-8">
        <img src="/stills/abraham-aboab.jpg" alt="Abraham Aboab" class="h-64 inline-block rounded-2xl drop-shadow">
        <p class="text-lg mt-2">Abraham Aboab</p>
      </div>
      <div class="mt-8 px-8">
        <img src="/stills/condoomverkoopster.jpg" alt="Condoomverkoopster"
             class="h-64 inline-block rounded-2xl drop-shadow">
        <p class="text-lg mt-2">Condoomverkoopster</p>
      </div>

    </div>
  </div>


  <footer class="fixed bottom-0 bg-[#d60034] w-screen text-center py-4">
    <!--    <h1 class="font-bold text-lg">-->
    <!--      Partners-->
    <!--    </h1>-->
    <!--    <span class="mb-4 mr-8 text-lg">-->
    <!--      In samenwerking met...-->
    <!--    </span>-->
    <span>
      <img src="/logos/logo-hua.svg" alt="Logo van Het Utrechts Archief" class="h-16 inline-block mr-8">
      <img src="/logos/logo-uu.svg" alt="Logo van Universiteit Utrecht" class="h-16 inline-block mr-8">
      <img src="/logos/logo-utrecht.svg" alt="Logo van Gemeente Utrecht" class="h-16 inline-block mr-8">
    </span>

    <div class="absolute right-4 top-4">
      <button @click="onResetShow()"
              class="bg-red-800 rounded-full text-white px-3 opacity-50 hover:opacity-100 transition-opacity">
        Reset naar welkomstscherm
      </button>

      <div class="text-black opacity-50 hover:opacity-100 transition-opacity">
        <PasswordInput :hide-label="true"/>
      </div>
    </div>

  </footer>
</template>

<script>
import PasswordInput from "../admin/PasswordInput.vue";
import {mapActions} from "vuex";

export default {
  name: 'ThankYou',
  props: [],
  components: {PasswordInput},
  methods: {
    ...mapActions({
      resetRoomShowOnServer: 'videoStateModule/resetRoomShowOnServer',
    }),
    onResetShow() {
      this.resetRoomShowOnServer();
    },
  }
}
</script>
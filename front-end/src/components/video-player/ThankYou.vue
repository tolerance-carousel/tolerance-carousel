<template>
  <div class="text-center pt-8 bg-[#f4f2f0] text-[#111111] h-screen flex flex-col">
    <div style="flex: 1 1 auto" class="px-4">
      <h1 class="text-4xl font-bold">
        Thank you for participating!
      </h1>
      <p class="mt-4 text-lg">
        Questions, thoughts or comments? Feel free to reach out to one of the facilitators.
<!--        Vragen, gedachten of opmerkingen? Voel je vrij om iemand in je omgeving of een van de facilitators te benaderen.-->
      </p>

      <div class="">
        <button @click="onResetShow()"
                class="bg-red-800 rounded-full text-white px-3 opacity-0 hover:opacity-100 transition-opacity">
          Reset naar welkomstscherm
        </button>

        <div class="text-black opacity-0 hover:opacity-100 transition-opacity inline-block ml-4">
          <PasswordInput :hide-label="true"/>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 px-8 mb-8">
        <div class="mt-8 px-8">
          <img src="/stills/maria-ruysch.jpg" alt="Maria Ruysch" class="max-h-64 inline-block rounded-2xl drop-shadow">
          <p class="text-lg mt-2">Maria Ruysch</p>
        </div>
        <div class="mt-8 px-8">
          <img src="/stills/abraham-aboab.jpg" alt="Abraham Aboab" class="max-h-64 inline-block rounded-2xl drop-shadow">
          <p class="text-lg mt-2">Abraham Aboab</p>
        </div>
        <div class="mt-8 px-8">
          <img src="/stills/condoomverkoopster.jpg" alt="Condoomverkoopster"
               class="max-h-64 inline-block rounded-2xl drop-shadow">
          <p class="text-lg mt-2">
<!--            Condoomverkoopster-->
            Condom seller
          </p>
        </div>

      </div>
    </div>

    <footer class="bg-[#d60034] w-screen text-left py-4" style="flex: 0 1 40px;">
      <h1 class="font-bold text-lg mx-8">
        Special thanks to
      </h1>

      <div class="my-4 mx-8 text-lg columns-2">
        <p><strong>Zenzi Alwart</strong> Maria Ruysch</p>
        <p><strong>Noël van Santen</strong> Abraham Aboab</p>
        <p>
          <strong>Charlotte vd Linden</strong>
          condom seller
<!--          condoomverkoopster-->
        </p>
        <p><strong>Wouter Eizenga</strong> director
<!--          regisseur-->
        </p>
        <p><strong>Jeanette van Vliet</strong>
          wardrobe stylist
<!--          kledingstyliste-->
        </p>
        <p><strong>Boris Everts</strong> filmmaker</p>
        <p><strong>Servaas Everts</strong>
          location scout
<!--          locatie scout-->
        </p>
        <p><strong>Simon Dirks</strong> IT specialist</p>
        <p><strong>Tim Overkempe</strong>
          historical research
<!--          historisch onderzoek-->
        </p>
        <p><strong>Shahin Nazar</strong>
          tolerance researcher
<!--          tolerantie onderzoeker-->
        </p>
        <p><strong>Toine Pieters</strong>
          Jack of all trades
<!--          manusje van alles-->
        </p>
        <p><strong>Gekomen om te blijven</strong> (U900)
          and
<!--          en-->
          <strong>HUA</strong>
          for content-related support
<!--          voor inhoudelijke ondersteuning-->
        </p>
        <p><strong>Provincie Utrecht</strong>
          for financial support
<!--          voor financiële ondersteuning-->
        </p>
<!--        <p><small><strong>Muziek</strong> van bensound.com</small></p>-->
      </div>
      <!--    <span>-->
      <!--      <img src="/logos/logo-hua.svg" alt="Logo van Het Utrechts Archief" class="w-8 md:w-24 inline-block mr-8">-->
      <!--      <img src="/logos/logo-uu.svg" alt="Logo van Universiteit Utrecht" class="w-8 md:w-24 inline-block mr-8">-->
      <!--      <img src="/logos/logo-utrecht.svg" alt="Logo van Gemeente Utrecht" class="w-8 md:w-24 inline-block mr-8">-->
      <!--    </span>-->

    </footer>
  </div>


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
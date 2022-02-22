<template>
  <div class="grid grid-cols-2 gap-2">
    <div>
      <p>POLIS</p>
    </div>
    <div class='polis' data-conversation_id='3bbxvmcwdc'></div>
  </div>
</template>

<script>
export default {
  name: "Polis",
  mounted() {
    // TODO: Host embed script locally, and add styling/layout changes there.
    let polisEmbedScript = document.createElement('script');
    polisEmbedScript.setAttribute('src', 'https://pol.is/embed.js');
    document.head.appendChild(polisEmbedScript);
  }
}
</script>

<style>
</style>

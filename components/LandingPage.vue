<template>
  <div>
    <div class="flex justify-center -mt-20">
      <h1 class="font-extrabold text-primary logo">Nobel</h1>
    </div>

    <sequencer-section></sequencer-section>
  </div>
</template>

<script>
import SequencerSection from './sections/sequencer-section.vue'
export default {
  components: { SequencerSection },
  head() {},
}
</script>

<style lang="scss">
@keyframes scale-up-center {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
.logo {
  margin-bottom: 50vh;
  margin-top: 50vh;
  font-size: 15rem;
}
</style>
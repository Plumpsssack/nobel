<template>
  <div
    v-scrollby="{
      offset: 200 + index * 10,
      styleAttributes: [
        {
          prop: 'transform',
          value: 'translate($value%,$value%)',
          reverse: true,
          factor: -0.1,
        },

        { prop: 'opacity', factor: 0.01 },
      ],
    }"
  >
    <div
      @click="$emit('click')"
      class="
        bg-nobel-cover
        instrument
        rounded
        flex
        items-center
        justify-center
        h-20
        border-solid border-2 border-primary
      "
      :style="style"
    >
      <div>
        <div class="text-center">
          <fa :icon="icon | fa" style="font-size: 30px"></fa>
        </div>
        <div>
          {{ title }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import InstrumentsMixin from '~/assets/js/mixins/instruments.js'

export default {
  mixins: [InstrumentsMixin],
  props: {
    instrument: Object,
    index: Number,
  },
  computed: {
    style() {
      return this.getInstrumentImgStyle(this.instrument)
    },
    title() {
      return this.instrument.title
    },
    icon() {
      return this.instrument.icon.src
    },
  },
}
</script>

<style lang="scss" scoped>
.instrument {
  cursor: pointer;
  //   transition: all 0.2s ease;
  transition: all 0.2s ease;
}
.instrument:hover {
  transform: translateX(10px);
  transition: all 0.4s ease !important;
  opacity: 0.7 !important;
}
</style>
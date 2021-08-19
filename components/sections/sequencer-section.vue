<template>
  <div class="opacity-80 flex mt-10 overflow-x-hidden">
    <sequencer
      class="bg-secondary p-10 w-min m-40 mt-20 rounded"
      :style="{ 'pointer-events': inViewPort ? 'auto' : 'none' }"
      v-scrollby="{
        offset: 100,
        styleAttributes: [
          { prop: 'transform', value: 'translateX($value%)', reverse: true },
          { prop: 'opacity', factor: 0.01 },
        ],

        changeFunc: scrollChange.bind(this),
      }"
    ></sequencer>
    <div
      :class="['bg-secondary p-10 w-full mr-10 mt-0 mb-60 rounded ']"
      v-scrollby="{
        offset: 100,
        styleAttributes: [
          {
            prop: 'transform',
            value: 'translateX($value%)',
            factor: -1,
            reverse: true,
          },
          { prop: 'opacity', factor: 0.01 },
        ],
        changeFunc: scrollPartSelectionChange.bind(this),
      }"
    ></div>
  </div>
</template>
   <script>
import Sequencer from '../sequencer'
export default {
  components: { Sequencer },
  data() {
    return {
      inViewPort: false,
      partSelectionIsInViewPort: false,
    }
  },
  methods: {
    scrollChange(percent) {
      this.inViewPort = percent == 100
    },
    scrollPartSelectionChange(percent) {
      this.partSelectionIsInViewPort = percent == 100
    },
  },
}
</script>
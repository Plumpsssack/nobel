   <template>
  <div class="opacity-80">
    <sequencer
      class="bg-secondary p-10 w-min mt-10 m-40 rounded"
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
  </div>
</template>
   <script>
import Sequencer from '../sequencer'
export default {
  components: { Sequencer },
  data() {
    return {
      inViewPort: false,
    }
  },
  methods: {
    scrollChange(percent) {
      this.inViewPort = percent == 100
    },
  },
}
</script>
   <template>
  <sequencer
    class="bg-secondary p-10 w-min mt-10 m-40 opacity-80 rounded"
    :style="{ 'pointer-events': inViewPort ? 'auto' : 'none' }"
    v-scrollby="{
      offset: 100,
      prop: 'transform',
      value: 'translateX',
      changeFunc: scrollChange.bind(this),
    }"
  ></sequencer>
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
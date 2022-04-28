<template>
  <div
    :class="[
      'bg-primary',
      'track',
      'rounded',
      'bg-nobel-cover',
      'flex',
      'items-center',
      'justify-center',
      'text-secondary',
    ]"
    :style="style"
  >
    <div>
      <div class="text-center">
        <fa :icon="trackIcon | fa" style="font-size: 30px"></fa>
      </div>
      <div>
        {{ trackTitle }}
      </div>
    </div>
  </div>
</template>
<script>
import InstrumentsMixin from '~/assets/js/mixins/instruments.js'

export default {
  props: {
    track: Object,
  },
  mixins: [InstrumentsMixin],
  computed: {
    trackIcon() {
      return this.instrument.icon.src
    },
    style() {
      return this.getInstrumentImgStyle(this.instrument)
    },
    trackTitle() {
      return this.track.src.replace('.wav', '')
    },
    instrument() {
      return this.getInstrumentOfTrack(this.track)
    },
  },
}
</script>

<style lang="scss" scoped>
$size: 84px;

.track {
  width: $size;
  height: $size;
  cursor: pointer;
}
</style>
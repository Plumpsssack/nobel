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
import TrackCategoryMixin from '@/assets/js/mixins/track-category.js'

export default {
  props: {
    track: Object,
    type: String,
  },
  mixins: [TrackCategoryMixin],
  computed: {
    trackIcon() {
      return this.typeImgPosMap.get(this.type).icon
    },
    style() {
      return this.getCategoryImgStyle(this.type)
    },
    trackTitle() {
      return this.track.src.replace('.wav', '')
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
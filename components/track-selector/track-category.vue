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
        category
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
          <fa :icon="getCategoryIcon(title) | fa" style="font-size: 30px"></fa>
        </div>
        <div>
          {{ title }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TrackCategoryMixin from '@/assets/js/mixins/track-category.js'

export default {
  mixins: [TrackCategoryMixin],
  props: {
    category: Object,
    index: Number,
  },
  computed: {
    style() {
      return this.getCategoryImgStyle(this.title)
    },
    title() {
      return this.category.title
    },
  },
}
</script>

<style lang="scss" scoped>
.category {
  cursor: pointer;
  //   transition: all 0.2s ease;
  transition: all 0.2s ease;
}
.category:hover {
  transform: translateX(10px);
  transition: all 0.4s ease !important;
  opacity: 0.7 !important;
}
</style>
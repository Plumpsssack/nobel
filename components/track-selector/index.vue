<template>
  <div>
    <div class="flex mb-3">
      <div class="flex-1"></div>
      <div class="flex-1">
        <div class="text-center mb-2">
          <!-- <transition
            mode="out-in"
            enter-active-class="fade-in"
            leave-active-class="fade-out"
          > -->

          <span v-if="currentTracks.length > 0">Parts</span>
          <!-- <div >Parts</div> -->
          <div v-else>Instrumente</div>
          <!-- </transition> -->
        </div>
      </div>
      <div class="flex-1">
        <transition enter-active-class="fade-in" leave-active-class="fade-out">
          <button
            title="Zurück zu den Instrumenten"
            class="rounded bg-primary text-white p-1 float-right"
            @click="onBackClick"
            v-if="currentTracks.length > 0"
          >
            <fa icon="chevron-circle-left"></fa>
          </button>
        </transition>
      </div>
    </div>

    <transition-group
      leave-active-class="leave-top"
      enter-active-class="enter-top"
      @after-leave="onAfterTracksLeave"
      class="grid gap-3 grid-cols-3"
    >
      <div
        v-for="(track, index) in currentTracks"
        :key="'track' + index"
        class="relative"
      >
        <Track
          v-draggable="{
            onStart: onDragStart.bind(this, track),
            onStop: onDragStop.bind(this, track),
          }"
          class="mx-2 mb-3"
          :track="track"
          :type="currentCategory.title"
          :index="index"
        />
      </div>
    </transition-group>

    <transition-group
      leave-active-class="leave-right"
      enter-active-class="enter-right"
      @after-leave="onAfterCategoriesLeave"
    >
      <track-category
        class="mb-3"
        v-for="(category, index) in currentCategories"
        :key="'category' + index"
        :category="category"
        :index="index"
        @click="onCategoryClick(category)"
      ></track-category>
    </transition-group>
  </div>
</template>

<script>
import TrackCategory from './track-category.vue'
import Track from './track.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronCircleLeft)
export default {
  components: {
    TrackCategory,
    Track,
  },
  data() {
    return {
      docState: 'saved',
      currentCategories: [],
      currentTracks: [],
      categoriesDisappeared: false,

      currentCategory: null,
      leaveCounter: 0,

      categories: [
        {
          title: 'bass',
          tracks: [
            {
              id: 1,
              src: 'Lig_Bass.wav',
              length: 1,
            },
            {
              id: 2,
              src: 'Pre_Bass.wav',
            },
            {
              id: 3,
              src: 'Lig_Bass.wav',
            },
            {
              id: 4,
              src: 'Pre_Bass.wav',
            },
            {
              id: 5,
              src: 'Lig_Bass.wav',
            },
            {
              id: 6,
              src: 'Pre_Bass.wav',
            },
          ],
        },
        {
          title: 'vox',
        },
        {
          title: 'sax',
        },
        { title: 'guitar' },
        { title: 'drums' },
      ],
    }
  },
  methods: {
    async onCategoryClick(category) {
      this.currentCategory = category
      while (this.currentCategories.length > 0) {
        this.currentCategories.pop()
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      //   this.currentTracks = [...category.tracks]
      //   await new Promise((resolve) => setTimeout(resolve, 400))
      //   this.categoriesDisappeared = true
    },
    async onBackClick() {
      while (this.currentTracks.length > 0) {
        this.currentTracks.pop()
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      //   this.currentCategories = [...this.categories]
      //   this.categoriesDisappeared = false
    },
    async onAfterTracksLeave() {
      this.leaveCounter++

      if (this.currentCategory.tracks.length === this.leaveCounter) {
        this.leaveCounter = 0
        for (let i = 0; i < this.categories.length; i++) {
          this.currentCategories.push(this.categories[i])
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }
      //   this.currentCategories = [...this.categories]
    },
    async onAfterCategoriesLeave() {
      this.leaveCounter++

      if (this.categories.length === this.leaveCounter) {
        this.leaveCounter = 0
        // await new Promise((resolve) => setTimeout(resolve, 400))
        this.categoriesDisappeared = true

        for (let i = 0; i < this.currentCategory.tracks.length; i++) {
          this.currentTracks.push(this.currentCategory.tracks[i])
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }
    },
    onDragStart(track) {
      return {
        relativePart: 0,
        newTrack: true,
        track,
        type: this.currentCategory.title,
      }
    },
    onDragStop(track) {
      this.$emit('trackDragStop', track)
    },
  },
  mounted() {
    this.currentCategories = [...this.categories]
  },
}
</script>

<style lang="scss" scoped>
.leave-right {
  animation: slide-out-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
}
.enter-right {
  animation: slide-in-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
}
.enter-top {
  animation: slide-in-top 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
}
.leave-top {
  animation: slide-out-top 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
}

.fade-in {
  animation: fade-in 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.fade-out {
  animation: fade-out 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes slide-in-top {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-out-top {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
}

@keyframes slide-in-right {
  0% {
    transform: translateX(800px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-right {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(800px);
    opacity: 0;
  }
}

.tracking-in-contract {
  animation: tracking-in-contract 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) both;
}

@keyframes tracking-in-contract {
  0% {
    letter-spacing: 1em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    letter-spacing: normal;
    opacity: 1;
  }
}
</style>
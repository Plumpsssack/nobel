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
      move-class="move"
      @after-leave="onAfterTracksLeave"
      class="grid gap-3 grid-cols-3"
    >
      <div
        v-for="(track, index) in currentTracks"
        :key="'track_' + track.id"
        class="relative tracko"
      >
        <Track
          v-draggable="{
            onStart: onDragStart.bind(this, track),
          }"
          class="mx-2 mb-3"
          :track="track"
          :index="index"
        />
      </div>
    </transition-group>

    <transition-group
      leave-active-class="leave-right"
      enter-active-class="enter-right"
      @after-leave="onAfterCategoriesLeave"
    >
      <track-instrument
        class="mb-3"
        v-for="(instrument, index) in currentInstruments"
        :key="'instrument' + index"
        :instrument="instrument"
        :index="index"
        @click="onInstrumentClick(instrument)"
      ></track-instrument>
    </transition-group>
  </div>
</template>

<script>
import TrackInstrument from './track-instrument.vue'
import Track from './track.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import InstrumentsMixin from '~/assets/js/mixins/instruments.js'

library.add(faChevronCircleLeft)
export default {
  components: {
    TrackInstrument,
    Track,
  },
  mixins: [InstrumentsMixin],
  data() {
    return {
      docState: 'saved',
      currentInstruments: [],
      currentTracks: [],
      categoriesDisappeared: false,

      // currentInstrument: null,
      leaveCounter: 0,
    }
  },
  computed: {
    currentInstrumentId: {
      get() {
        return this.$store.getters['tracks/currentInstrumentId']
      },
      set(value) {
        this.$store.commit('tracks/setCurrentInstrumentId', value)
      },
    },
    currentInstrument() {
      if (!this.currentInstrumentId) return null
      return this.instruments.find(
        (instrument) => instrument.id === this.currentInstrumentId
      )
    },
  },
  methods: {
    onAfterTracksLeave() {},
    onAfterCategoriesLeave() {},
    onBackClick() {
      this.currentInstrumentId = null
    },
    onInstrumentClick(instrument) {
      this.currentInstrumentId = instrument.id
    },

    async showInstruments() {
      await this.removeOldTracks()
      for (let i = 0; i < this.instruments.length; i++) {
        this.currentInstruments.push(this.instruments[i])
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    },
    async showTracks() {
      // removeOldInstruments

      while (this.currentInstruments.length > 0) {
        this.currentInstruments.pop()
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // removeOldTracks
      await this.removeOldTracks()

      //Add new tracks

      for (let i = 0; i < this.currentInstrument.tracks.length; i++) {
        this.currentTracks.push(this.currentInstrument.tracks[i])
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    },

    async removeOldTracks() {
      while (this.currentTracks.length > 0) {
        this.currentTracks.pop()
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    },

    onDragStart(track) {
      const instrument = this.getInstrumentOfTrack(track)

      return {
        relativePart: 0,
        newTrack: true,
        track,
        instrumentId: instrument.id,
      }
    },
  },
  mounted() {
    this.currentInstruments = [...this.instruments]
  },
  watch: {
    currentInstrumentId(instrumentId) {
      if (instrumentId) {
        this.showTracks()
      } else {
        this.showInstruments()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// .move {
//   transition: all 1s;
//   // transition: transform 0.5s;
// }
// .tracko {
//   transition: all 1s;
// }
.leave-right {
  animation: slide-out-right 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
}
.enter-right {
  animation: slide-in-right 0.34s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
}
.enter-top {
  animation: slide-in-top 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
}
.leave-top {
  // position: absolute;
  animation: slide-out-top 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
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
<template>
  <div class="flex line">
    <div class="line-header self-center" @click="onTitleClick">{{ title }}</div>
    <div class="flex cell-container">
      <div
        v-for="cell in cellCount"
        :key="'pattern-cell_' + cell"
        :class="[
          'pattern-cell rounded',
          attentionClass ? 'bg-third' : 'bg-fourth',
          { 'pulsate-fwd': attentionClass },
        ]"
        :style="{ 'animation-delay': cell * 0.1 + 's' }"
        v-droppable="{
          onHover: onCellHover.bind(this, cell),
          onDrop: onCellDrop.bind(this, cell),
          onHoverLeave: onCellHoverLeave.bind(this, cell),
        }"
      ></div>
      <Track
        v-for="(track, index) in currentTracks"
        :track="track"
        :key="'track_' + track.id"
        v-draggable="{
          onStart: onDragStart.bind(this, track),
          onStop: onDragStop.bind(this, track),
        }"
        :style="trackStyle(track)"
        :class="{ 'track-dragging': track == currentTrack }"
        v-scrollby="{
          offset: 180 + index * 10,
          styleAttributes: [
            {
              prop: 'transform',
              value: 'translate($value%,$value%)',
              reverse: true,
              factor: -1,
            },

            { prop: 'opacity', factor: 0.01 },
          ],
        }"
      />

      <div
        class="bg-primary track ghost-track rounded opacity-80"
        :style="trackStyle(ghostTrack)"
      ></div>
    </div>
  </div>
</template>
<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import InstrumentsMixin from '~/assets/js/mixins/instruments.js'
import Track from './../track-selector/track.vue'
import { mapGetters } from 'vuex'
import {
  faDrum,
  faGuitar,
  faMicrophoneAlt,
} from '@fortawesome/free-solid-svg-icons'

library.add(faDrum, faGuitar, faMicrophoneAlt)
export default {
  components: { Track },
  mixins: [InstrumentsMixin],
  props: {
    title: String,
    instrument: Object,
    tracks: { type: Array, default: () => [] },
    patternLength: Number,
  },
  data() {
    return {
      cellWidth: 94,
      cellMarginLeft: 4,
      ghostTrack: null,
      currentTrack: null,
      currentTracks: [],
      movingWorks: true,
    }
  },
  computed: {
    ...mapGetters('tracks', ['currentInstrumentId']),
    cellCount() {
      return this.patternLength
    },
    attentionClass() {
      return (
        this.currentInstrumentId == this.instrument?.id || this.currentTrack
      )
    },
  },
  methods: {
    trackStyle(track) {
      if (!track) return

      const style = {
        left:
          (this.cellWidth + this.cellMarginLeft) * track.start +
          this.cellMarginLeft +
          'px',
        width:
          (this.cellWidth + this.cellMarginLeft) * (track.length || 1) -
          this.cellMarginLeft +
          'px',
      }

      return style
    },
    onTitleClick() {
      this.$store.dispatch('tracks/setCurrentInstrumentId', this.instrument.id)
    },
    onDragStart(track, evt) {
      this.currentTrack = track
      // this.$store.dispatch('tracks/setCurrentInstrumentId', this.instrument.id)

      const clientWidth = evt.el.clientWidth
      const mousePosX = evt.dragClickPositionX

      const relativePart = parseInt(mousePosX / (clientWidth / track.length))

      return {
        relativePart,
        track,
        instrumentId: this.instrument.id,
      }
    },
    onDragStop(track, evt) {
      if (!this.movingWorks) {
        // Reset

        this.mapTracks()
        return
      }

      this.$emit('tracksChange', this.currentTracks)

      if (this.ghostTrack) {
        const start = this.ghostTrack.start
        track.start = start

        const refresh = track.start == start

        // Track has to be refreshed, otherwise it would stay at the old position
        if (refresh) {
          // track.start = (start + 1) % this.cellCount
          // this.$nextTick(() => {
          //   this.currentTracks.filter((x) => x.id == track.id)[0].start = start
          // })
        }

        this.ghostTrack = null
      }

      if (evt.el) {
        evt.el.style.top = '0'
      }

      this.currentTrack = null
    },

    onCellHover(cell, evt) {
      // Check if Track is of the same Track instrument
      // e.g. it is only allowed to drag a Bass Track into Bass instrument Lane
      if (this.instrument.id != evt.startParams?.instrumentId) return

      const track = evt.startParams.track

      // we have to know whicht part of the Track is currently dragged
      const relativePart = evt.startParams.relativePart

      if (track) {
        // Reset to default position
        this.currentTracks
          .filter((x) => x.id != track.id)
          .forEach((currentTrack) => {
            currentTrack.start = this.tracks.filter(
              (x) => x.id == currentTrack.id
            )[0].start
          })

        let start = cell - 1 - relativePart // -1 because its zero based
        let trackLength = track.length || 1

        if (start > this.cellCount - trackLength) {
          start = this.cellCount - trackLength
        }
        if (start < 0) start = 0

        const end = start + trackLength

        //Overlapping
        let overlapping = this.currentTracks.filter(
          (x) => x.start < end && x.start + x.length > start && x != track
        )

        const leftTracks = this.currentTracks.filter(
          (x) => x.start + x.length <= start && x.id != track.id
        )
        const leftTracksLength = leftTracks.map((x) => x.length)

        const leftLength =
          leftTracksLength.length > 0
            ? leftTracksLength.reduce((a, b) => a + b)
            : 0
        const leftSpace = start - leftLength

        const rightTracks = this.currentTracks.filter(
          (x) => x.start >= end && x.id != track.id
        )

        const rightTracksLength = rightTracks.map((x) => x.length)

        const rightLength =
          rightTracksLength.length > 0
            ? rightTracksLength.reduce((a, b) => a + b)
            : 0

        const rightSpace = this.cellCount - rightLength - end

        // Does it fit?

        this.movingWorks = true
        let leftCounter = leftSpace
        let rightCounter = rightSpace

        const movingLeftTracks = []
        const movingRightTracks = []

        // Sort overlapping tracks into right and left direction
        for (let overlappingTrack of overlapping) {
          trackLength = overlappingTrack.length

          // Try put in the left direction
          if (leftCounter - trackLength >= 0) {
            leftCounter -= trackLength
            movingLeftTracks.push(overlappingTrack)
          } else {
            // otherwise try put in the right direction
            if (rightCounter - trackLength >= 0) {
              rightCounter -= trackLength
              movingRightTracks.push(overlappingTrack)
            } else {
              // no space: stop!
              this.movingWorks = false
              break
            }
          }
        }
        if (!this.movingWorks) {
          this.ghostTrack = null
          return
        }

        const set = new Set(movingRightTracks.map((x) => x.id))
        this.moveLeft(movingLeftTracks, start, set)

        this.moveRight(movingRightTracks, end, set)

        this.ghostTrack = {
          ...track,
          start,
        }
      }
    },
    onCellHoverLeave(cell, evt) {
      this.ghostTrack = null
    },
    onCellDrop(cell, evt) {
      if (!evt.startParams.newTrack || !this.ghostTrack) return

      const start = this.ghostTrack.start

      this.ghostTrack = null
      this.currentTrack = null

      const newTrack = {
        ...evt.startParams.track,
        start,
        id: crypto.randomUUID(),
      }
      this.$emit('onTrackAdded', newTrack)
    },

    moveLeft(tracks, start, trackSetToIgnore) {
      if (tracks.length == 0) return

      tracks.sort((a, b) => b.start - a.start)

      let offset = 0

      for (let track of tracks) {
        offset += track.length
        track.start = start - offset

        trackSetToIgnore.add(track.id)
      }
      // Move recursive

      const end = start
      start -= offset

      const overlappingTracks = this.currentTracks.filter(
        (x) =>
          !trackSetToIgnore.has(x.id) &&
          x.id != this.currentTrack.id &&
          x.start < end &&
          x.start + x.length > start
      )

      this.moveLeft(overlappingTracks, start, trackSetToIgnore)
    },

    moveRight(tracks, end, trackSetToIgnore) {
      if (tracks.length == 0) return

      tracks.sort((a, b) => a.start - b.start)

      let offset = 0

      for (let track of tracks) {
        track.start = end + offset
        offset += track.length
        trackSetToIgnore.add(track.id)
      }
      // Move recursive

      const start = end
      end += offset

      const overlappingTracks = this.currentTracks.filter(
        (x) =>
          !trackSetToIgnore.has(x.id) &&
          x.id != this.currentTrack.id &&
          x.start < end &&
          x.start + x.length > start
      )

      this.moveRight(overlappingTracks, end, trackSetToIgnore)
    },

    mapTracks() {
      this.currentTracks = this.tracks
        .filter((x) => x.start + (x.length || 1) <= this.patternLength)
        .map((x) => {
          return { ...x, length: x.length || 1 }
        })

      this.currentTracks.sort((a, b) => a.start - b.start)
    },
  },
  watch: {
    tracks: {
      immediate: true,
      handler(tracks) {
        this.mapTracks()
      },
    },
    patternLength() {
      this.mapTracks()
    },
  },
}
</script>

<style lang="scss" scoped>
$size: 94px;

.line {
  height: $size;

  margin-bottom: 4px;

  .line-header {
    width: 200px;
    cursor: pointer;
  }

  .cell-container {
    position: relative;
    .pattern-cell {
      width: $size;
      margin-left: 4px;
      height: 100%;
    }

    .track {
      height: $size;
      position: absolute;
      z-index: 2;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .track.track-dragging {
      z-index: 4;
      transition: none;
    }

    .track.ghost-track {
      transition: none;
    }
  }
}

.pulsate-fwd {
  animation: pulsate-fwd 1.2s ease-in-out infinite both;
}

@keyframes pulsate-fwd {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
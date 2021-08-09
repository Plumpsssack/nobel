<template>
  <div class="flex line">
    <div class="line-header self-center">{{ title }}</div>
    <div class="flex cell-container">
      <div
        v-for="cell in cellCount"
        :key="'pattern-cell_' + cell"
        class="pattern-cell bg-primary rounded"
        v-droppable="{ onHover: onCellHover.bind(this, cell) }"
      ></div>
      <div
        v-for="(track, index) in currentTracks"
        :key="'track_' + track.id"
        v-draggable="{
          boundaries: { leftStart: 0, leftEnd: '100%' },
          onStart: onDragStart.bind(this, track),
          onStop: onDragStop.bind(this, track),
        }"
        :class="[
          'bg-secondary',
          'track',
          'rounded',
          'bg-nobel-cover',
          'flex',
          'items-center',
          'justify-center',
          'text-secondary',
          { 'track-dragging': track == currentTrack },
        ]"
        :style="trackStyle(track)"
      >
        <div>
          <div class="text-center">
            <fa :icon="trackIcon | fa" style="font-size: 30px"></fa>
          </div>
          <div>
            {{ trackTitle(track) }}
          </div>
        </div>
      </div>
      <div
        class="bg-third track ghost-track rounded"
        :style="trackStyle(ghostTrack)"
      ></div>
    </div>
  </div>
</template>
<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faDrum,
  faGuitar,
  faMicrophoneAlt,
} from '@fortawesome/free-solid-svg-icons'
library.add(faDrum, faGuitar, faMicrophoneAlt)
export default {
  props: {
    title: String,
    type: String,
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
      typeImgPosMap: new Map([
        ['bass', { x: 202, icon: 'guitar' }],
        ['drums', { x: 402, icon: 'drum' }],
        ['guitar', { x: 300, icon: 'guitar' }],
        ['sax', { x: 602, y: 402, icon: 'sax-hot' }],
        ['voc', { x: 602, y: 402, icon: 'microphone-alt' }],
      ]),
    }
  },
  computed: {
    cellCount() {
      return this.patternLength
    },
    trackIcon() {
      return this.typeImgPosMap.get(this.type).icon
    },
  },
  // created() {
  //   this.typeImgPosMap.add()
  // },
  methods: {
    trackTitle(track) {
      return track.src.replace('.wav', '')
    },
    trackStyle(track) {
      if (!track) return

      const style = {
        left:
          (this.cellWidth + this.cellMarginLeft) * track.start +
          this.cellMarginLeft +
          'px',
        width:
          (this.cellWidth + this.cellMarginLeft) * track.length -
          this.cellMarginLeft +
          'px',
      }

      const imgPos = this.typeImgPosMap.get(this.type)

      if (imgPos) {
        if (imgPos.x) {
          style['background-position-x'] = imgPos.x + 'px'
        }
        if (imgPos.y) {
          style['background-position-y'] = imgPos.y + 'px'
        }
      }
      return style
    },
    onDragStart(track, evt) {
      this.currentTrack = track

      const clientWidth = evt.el.clientWidth
      const mousePosX = evt.dragClickPositionX

      const relativePart = parseInt(mousePosX / (clientWidth / track.length))

      return {
        relativePart,
        track,
        type: this.type,
      }
    },
    onDragStop(track, evt) {
      if (!this.movingWorks || !this.ghostTrack) {
        // Reset
        this.mapTracks()
        return
      }

      this.$emit('tracksChange', this.currentTracks)
      const start = this.ghostTrack.start

      if (evt.el) {
        evt.el.style.top = '0'
      }
      this.ghostTrack = null
      this.currentTrack = null

      const refresh = track.start == start
      track.start = start

      // Track has to be refreshed, otherwise it would stay at the old position
      if (refresh) {
        track.start = (start + 1) % this.cellCount
        this.$nextTick(() => {
          this.currentTracks.filter((x) => x.id == track.id)[0].start = start
        })
      }
    },

    onCellHover(cell, evt) {
      const track = evt.startParams.track
      const type = evt.startParams.type
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

        if (start > this.cellCount - track.length) {
          start = this.cellCount - track.length
        }
        if (start < 0) start = 0

        // Check if Track is of the same Track Type
        // e.g. it is only allowed to drag a Bass Track into Bass Type Lane
        if (this.type == type) {
          const end = start + track.length

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
            const trackLength = overlappingTrack.length

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
      }
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
        .filter((x) => x.start + x.length <= this.patternLength)
        .map((x) => {
          return { ...x }
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
</style>
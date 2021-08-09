<template>
  <div class="flex mb-3">
    <button class="btn btn-primary" @click="onTogglePlayClick">
      {{ isPlaying ? 'Stop' : 'Play' }}
    </button>
    <div class="items-center">
      <label class="font-bold">Pattern Anzahl:</label>
      <input
        class="border rounded"
        v-model="notesCount"
        min="1"
        type="number"
        @input="$emit('patternLengthChange', parseInt(notesCount))"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    steps: { type: Array, default: () => [] },
    patternLength: Number,
  },
  data() {
    return {
      audioContext: null,
      tempo: 86 / 4, // Every sample includes 4 bars
      sampleArray: ['Lig_Bass.wav', 'Pre_Guit1.wav'],
      sampleDir: 'samples',
      sampleBufferMap: new Map(),
      lookahead: 25.0, // How frequently to call scheduling function (in milliseconds)
      scheduleAheadTime: 0.1, // How far ahead to schedule audio (sec)
      nextNoteTime: 0,
      currentNote: 0,
      notesCount: 8,
      notesInQueue: [],
      isPlaying: false,
      timerId: null,
    }
  },

  created() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
  },
  methods: {
    // async onPlayAllClick() {
    //   const arrayOfAudioBuffers = []

    //   for (let sample of this.sampleArray) {
    //     const buffer = await this.getBuffer(sample)
    //     arrayOfAudioBuffers.push(buffer)
    //   }

    //   let songLength = 0

    //   for (let track of arrayOfAudioBuffers) {
    //     if (track.length > songLength) {
    //       songLength = track.length
    //     }
    //   }

    //   const mix = this.audioContext.createBufferSource()

    //   //call our function here
    //   mix.buffer = this.mixDown(arrayOfAudioBuffers, songLength, 2)

    //   mix.connect(this.audioContext.destination)

    //   //will playback the entire mxixdown
    //   mix.start()
    // },

    // mixDown(bufferList, totalLength, numberOfChannels = 2) {
    //   //create a buffer using the totalLength and sampleRate of the first buffer node
    //   let finalMix = this.audioContext.createBuffer(
    //     numberOfChannels,
    //     totalLength * 2,
    //     bufferList[0].sampleRate
    //   )

    //   //first loop for buffer list
    //   for (let i = 0; i < bufferList.length; i++) {
    //     // second loop for each channel ie. left and right
    //     for (let channel = 0; channel < numberOfChannels; channel++) {
    //       //here we get a reference to the final mix buffer data
    //       let buffer = finalMix.getChannelData(channel)

    //       //last is loop for updating/summing the track buffer with the final mix buffer
    //       for (let j = 0; j < bufferList[i].length; j++) {
    //         buffer[j] += bufferList[i].getChannelData(channel)[j]
    //       }
    //     }
    //   }

    //   return finalMix
    // },

    // async onPlayClickHandler(filter = false) {

    //   const source = await this.getBufferSource('Fuchs_Part.mp3')

    //   if (filter) {
    //     const lowpassFilter = this.audioContext.createBiquadFilter()
    //     source.connect(lowpassFilter)
    //     lowpassFilter.connect(this.audioContext.destination)
    //   } else {
    //     console.log('without')
    //     source.connect(this.audioContext.destination)
    //   }

    //   source.start(0)
    //   source.loop = true

    //   this.source1 = source
    // },
    playSample(src) {
      const sampleBuffer = this.sampleBufferMap.get(src)
      if (sampleBuffer) {
        const source = this.audioContext.createBufferSource()
        source.buffer = sampleBuffer

        source.connect(this.audioContext.destination)
        source.start(this.nextNoteTime)
      }
      return sampleBuffer
    },
    nextNote() {
      const secondsPerBeat = 60.0 / this.tempo

      this.nextNoteTime += secondsPerBeat // Add beat length to last beat time

      this.currentNote++
      if (this.currentNote == this.notesCount) {
        this.currentNote = 0
      }
    },
    scheduleNote() {
      const tracksToPlay = []
      for (const step of this.steps) {
        const track = step.tracks.filter(
          (x) =>
            x.start <= this.currentNote && x.start + x.length > this.currentNote
        )[0]

        if (track) {
          tracksToPlay.push(track)
        }
      }
      for (const track of tracksToPlay) {
        this.playSample(track.src)
      }
    },
    scheduler() {
      // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
      while (
        this.nextNoteTime <
        this.audioContext.currentTime + this.scheduleAheadTime
      ) {
        this.scheduleNote()
        this.nextNote()
      }
      this.timerId = setTimeout(this.scheduler, this.lookahead)
    },
    onTogglePlayClick() {
      this.isPlaying = !this.isPlaying

      if (this.isPlaying) {
        // check if context is in suspended state (autoplay policy)
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume()
        }

        this.currentNote = 0
        this.nextNoteTime = this.audioContext.currentTime
        this.scheduler()
      } else {
        clearTimeout(this.timerId)
      }
    },
    async getBuffer(src) {
      return await new Promise((resolve) => {
        fetch(this.sampleDir + '/' + src)
          .then((response) => response.arrayBuffer())
          .then((buffer) => resolve(this.audioContext.decodeAudioData(buffer)))
      })
    },
  },
  watch: {
    steps: {
      async handler(steps) {
        for (const step of steps) {
          for (const track of step.tracks) {
            if (!this.sampleBufferMap.has(track.src)) {
              const buffer = await this.getBuffer(track.src)
              this.sampleBufferMap.set(track.src, buffer)
            }
          }
        }
      },
      deep: true,
      immediate: true,
    },
    patternLength(length) {
      this.notesCount = length
    },
  },
}
</script>

<style lang="scss" scoped>
.btn {
  @apply font-bold py-2 px-4 mx-1 rounded;
}
.btn-success {
  @apply bg-secondary text-white;
}
.btn-primary {
  @apply bg-primary text-white;
}
</style>
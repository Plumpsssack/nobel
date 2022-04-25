<template>
  <div>
    <webaudio-api-controller
      :steps="steps"
      @patternLengthChange="onPatternLengthChange"
      @nextNote="onNextNote"
      :patternLength="patternLength"
    ></webaudio-api-controller>

    <div class="flex mb-3">
      <div style="margin-left: 200px">
        <div
          class="rounded-full w-2 h-2 bg-primary transition-all transition-1"
          :style="{
            transform: 'translateX(' + (currentNote * 98 + 98 / 2) + 'px)',
          }"
        ></div>
      </div>
    </div>
    <pattern-lane
      v-for="(step, index) in steps"
      :key="'step_' + index"
      :title="step.title"
      :tracks="step.tracks"
      :type="step.type"
      :patternLength="patternLength"
      @tracksChange="onTracksChange($event, step.id)"
    ></pattern-lane>
  </div>
</template>

<script>
import patternLane from './pattern-lane.vue'
import WebaudioApiController from './webaudio-api-controller.vue'

export default {
  components: { patternLane, WebaudioApiController },
  data() {
    return {
      patternLength: 8,
      currentNote: 0,
      steps: [
        {
          id: 0,
          title: 'Bass 1',
          type: 'bass',
          tracks: [
            {
              title: 'Variant 1',
              start: 2,
              length: 1,
              id: 1,
              src: 'Lig_Bass.wav',
            },
            {
              title: 'Variant 1',
              start: 3,
              length: 1,
              id: 10,
              src: 'Lig_Bass.wav',
            },
            {
              title: 'Variant 1',
              start: 4,
              length: 1,
              id: 14,
              src: 'Lig_Bass.wav',
            },
            // {
            //   title: 'Variant 2',
            //   start: 3,
            //   length: 1,
            //   id: 2,
            //   src: 'Vers_Bass.wav',
            // },
            // {
            //   title: 'Variant 3',
            //   start: 2,
            //   length: 1,
            //   id: 3,
            //   src: 'Chorus_Bass.wav',
            // },
          ],
        },
        {
          id: 1,
          title: 'Drums 1',
          type: 'drums',
          tracks: [
            {
              title: 'Variant 1',
              start: 1,
              length: 1,
              id: 4,
              src: 'Pre_Drums.wav',
            },
          ],
        },
        {
          id: 2,
          title: 'Guitar 1',
          type: 'guitar',
          tracks: [
            {
              title: 'Variant 1',
              start: 0,
              length: 1,
              id: 5,
              src: 'Pre_Guit2.wav',
            },
            // {
            //   title: 'Variant 1',
            //   start: 1,
            //   length: 1,
            //   id: 8,
            //   src: 'Pre_Guit2.wav',
            // },
          ],
        },
        {
          id: 3,
          title: 'Sax 1',
          type: 'sax',
          tracks: [
            {
              title: 'Variant 1',
              start: 0,
              length: 1,
              id: 6,
              src: 'Pre_Bläser2.wav',
            },
            {
              title: 'Variant 1',
              start: 4,
              length: 1,
              id: 13,
              src: 'Pre_Bläser2.wav',
            },
          ],
        },
        {
          id: 4,
          title: 'Voc 1',
          type: 'vox',
          tracks: [
            {
              title: 'Variant 1',
              start: 1,
              length: 1,
              id: 11,
              src: 'Voc_Fuchs.wav',
            },
            {
              title: 'Variant 1',
              start: 2,
              length: 1,
              id: 7,
              src: 'Voc_Fuchs.wav',
            },
            {
              title: 'Variant 1',
              start: 3,
              length: 1,
              id: 9,
              src: 'Voc_Fuchs.wav',
            },
            {
              title: 'Variant 1',
              start: 4,
              length: 1,
              id: 12,
              src: 'Voc_Fuchs.wav',
            },
          ],
        },
      ],
    }
  },

  methods: {
    onTracksChange(tracks, id) {
      this.steps.filter((x) => x.id == id)[0].tracks = tracks
    },
    onPatternLengthChange(patternLength) {
      this.patternLength = patternLength
    },

    onNextNote(note) {
      this.currentNote = note

      // console.log(this.currentNote)
    },
  },
}
</script>
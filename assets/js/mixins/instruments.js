

export default {
    data() {
        return {
            instruments: [
                {
                    id: "bass",
                    title: 'Bass',
                    icon: { x: 202, src: 'guitar' },
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
                    id: "vox",
                    title: 'Vox', icon: { x: 602, y: 402, src: 'microphone-alt' }

                },
                {
                    id: "sax",
                    title: 'Sax', icon: { x: 602, y: 100, src: 'sax-hot' }
                },
                { id: "guitar", title: 'Guitar', icon: { x: 300, src: 'guitar' } },
                { id: "drums", title: 'Drums', icon: { x: 402, src: 'drum' } },
            ],
        }


    },

    methods: {
        getInstrumentImgStyle(instrument) {
            const icon = instrument.icon;

            return {
                backgroundPosition: `${icon.x}px ${icon.y || 0}px`,
            }
        },
        getInstrumentOfTrack(track) {
            return this.instruments.find((instrument) =>
                instrument.tracks.some((iTrack) => iTrack.src == track.src)
            )
        }
    }
}
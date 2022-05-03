import availableInstruments from "../instruments.json";

export default {
    data() {
        const instruments = [
            {
                id: "bass",
                title: 'Bass',
                icon: { x: 202, src: 'guitar' },
                // tracks: [
                //     {
                //         id: 1,
                //         src: 'Lig_Bass.wav',
                //         length: 1,
                //     },
                //     {
                //         id: 2,
                //         src: 'Pre_Bass.wav',
                //     },
                //     {
                //         id: 3,
                //         src: 'Lig_Bass.wav',
                //     },
                //     {
                //         id: 4,
                //         src: 'Pre_Bass.wav',
                //     },
                //     {
                //         id: 5,
                //         src: 'Lig_Bass.wav',
                //     },
                //     {
                //         id: 6,
                //         src: 'Pre_Bass.wav',
                //     },
                // ],
            },
            {
                id: "vox",
                title: 'Vox', icon: { x: 602, y: 402, src: 'microphone-alt' }

            },
            {
                id: "brass",
                title: 'Sax', icon: { x: 602, y: 100, src: 'sax-hot' }
            },
            { id: "guitar", title: 'Guitar', icon: { x: 300, src: 'guitar' } },
            { id: "drums", title: 'Drums', icon: { x: 402, src: 'drum' } },
        ];

        const availableInstrumentsMap = new Map(availableInstruments.map(instrument => [instrument.name, instrument.tracks]));

        instruments.forEach(instrument => {
            instrument.tracks = availableInstrumentsMap.get(instrument.id)
                .map((track, index) => { return { id: instrument.id + "_" + index, src: instrument.id + "/" + track, title: track.replace(".wav", ""), length: 1 } })
        });
        return {
            instruments
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
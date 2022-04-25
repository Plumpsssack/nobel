

export default {
    data() {
        return {
            typeImgPosMap: new Map([
                ['bass', { x: 202, icon: 'guitar' }],
                ['drums', { x: 402, icon: 'drum' }],
                ['guitar', { x: 300, icon: 'guitar' }],
                ['sax', { x: 602, y: 100, icon: 'sax-hot' }],
                ['vox', { x: 602, y: 402, icon: 'microphone-alt' }],
            ]),
        }

    },
    methods: {
        getCategoryImgStyle(categoryName) {
            const pos = this.typeImgPosMap.get(categoryName)
            return {
                backgroundPosition: `${pos.x}px ${pos.y || 0}px`,
            }
        },
        getCategoryIcon(categoryName) {
            const pos = this.typeImgPosMap.get(categoryName)
            return pos.icon
        }
    }
}
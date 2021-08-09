<template>
  <div class="overflow-hidden h-screen">
    <transition leave-active-class="slide-out-right">
      <div
        class="flex items-center h-screen overflow-hidden"
        v-if="!firstAnimationDone"
        key="firstAnimation"
      >
        <h1 class="text-9xl flex-1 font-black">
          <div class="flex justify-end">
            <transition-group enter-active-class="blurred-top">
              <span
                class="inline-block transition duration-500 text-primary"
                v-for="(leftItem, index) in leftItems"
                :key="'leftItem_' + index"
                >{{ leftItem }} &nbsp;
              </span>
            </transition-group>
          </div>
        </h1>
        <h2 class="text-6xl flex-1 font-bold">
          <div class="flex justify-center">
            <!-- leave-active-class="slide-out-blurred-bottom" -->
            <transition-group enter-active-class="slide-in-blurred-top">
              <div
                :class="[
                  'm-3',
                  'text-secondary',
                  'right-item',
                  { 'text-center': !stayMode },
                ]"
                v-for="(rightItem, index) in rightItems"
                :key="'rightItem' + rightItem"
              >
                {{ rightItem }}
              </div>
            </transition-group>
          </div>
        </h2>
      </div>
      <div
        v-else
        key="secondAnimation"
        class="flex items-center h-screen overflow-hidden mx-20"
      >
        <h1
          :class="[
            'text-9xl',
            'font-bold',
            'text-center',
            'transition-all',
            'duration-1000',
            { 'flex-1': !secondAnimationSlideLeft },
          ]"
        >
          <transition-group enter-active-class="slide-in-blurred-top">
            <div
              class="transition duration-500 text-primary"
              v-for="(item, index) in secondLeftItems"
              :key="'secondLeftItem' + item"
            >
              {{ item }}&nbsp;
            </div>
          </transition-group>
        </h1>
        <transition enter-active-class="fade-in">
          <div v-if="showButton" class="flex-1 text-center">
            <button
              class="
                bg-secondary
                text-white
                font-bold
                py-2
                px-4
                rounded
                text-9xl
              "
            >
              Start
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  layout: 'landing',
  data() {
    return {
      // Andere Animation (Wörter bleiben recht stehen)
      stayMode: true,
      leftItemsToShow: ['Nobel', 'ist'],
      leftItemsToShowSecond: ['Lust', 'auf', 'Kreativiät', '?'],
      rightItemsToShow: [
        'Musik',
        'Wärme',
        'Chaos',
        'Bass',
        'Rap',
        'Pop',
        'Beats',
        'Passion',
        'Banane',
        'Funk',
      ],
      leftItems: [],
      rightItems: [],
      secondLeftItems: [],

      firstAnimationDone: false,
      secondAnimationSlideLeft: false,
      showButton: false,
    }
  },
  methods: {
    async showLeftItems() {
      for (const item of this.leftItemsToShow) {
        this.leftItems.push(item)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    },
    async showRightItems() {
      for (const item of this.rightItemsToShow) {
        this.rightItems.unshift(item)

        await new Promise((resolve) => setTimeout(resolve, 200))
        if (!this.stayMode) {
          this.rightItems.pop()
        }
      }
    },

    async secondAnimation() {
      for (const item of this.leftItemsToShowSecond) {
        this.secondLeftItems.push(item)

        await new Promise((resolve) => setTimeout(resolve, 600))
      }
    },
  },
  async mounted() {
    await this.showLeftItems()
    await this.showRightItems()
    await new Promise((resolve) => setTimeout(resolve, 300))

    this.firstAnimationDone = true
    await new Promise((resolve) => setTimeout(resolve, 500))
    await this.secondAnimation()

    await new Promise((resolve) => setTimeout(resolve, 400))

    this.secondAnimationSlideLeft = true
    await new Promise((resolve) => setTimeout(resolve, 600))
    this.showButton = true

    this.$store.commit('nav/showNav')
  },
}
</script>

<style lang="scss" scoped>
.right-item {
  transition: all 0.2s;
  width: 445px;
}
.blurred-top {
  animation: blurred-top 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes blurred-top {
  0% {
    transform: scaleY(2.5) scaleX(0.2);
    transform-origin: 50% 0%;
    filter: blur(40px);
    opacity: 0;
  }
  100% {
    transform: scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
}

.slide-in-blurred-top {
  animation: slide-in-blurred-top 0.2s cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes slide-in-blurred-top {
  0% {
    transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
    transform-origin: 50% 0%;
    filter: blur(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
}

/*Softer*/

// .slide-out-blurred-bottom {
//   animation: slide-out-blurred-bottom 0.2s
//     cubic-bezier(0.755, 0.05, 0.855, 0.06) both;
// }

.slide-out-blurred-bottom {
  animation: slide-out-blurred-bottom 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
}

@keyframes slide-out-blurred-bottom {
  0% {
    transform: translateY(0) scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: translateY(1000px) scaleY(2) scaleX(0.2);
    transform-origin: 50% 100%;
    filter: blur(40px);
    opacity: 0;
  }
}

.fade-out {
  animation: fade-out 0.2s ease-out both;
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.slide-out-right {
  animation: slide-out-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}

@keyframes slide-out-right {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(1000px);
    opacity: 0;
  }
}
</style>
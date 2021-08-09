<template>
  <div>
    <NavBar v-if="showNav" class="fade-in" />
    <Nuxt class="bg-white" />
  </div>
</template>

<script>
export default {
  computed: {
    showNav() {
      return this.$store.getters['nav/nav']
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
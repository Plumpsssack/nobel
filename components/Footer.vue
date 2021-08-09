<template>
  <div class="w-full h-32 flex flex-row">
    <p class="m-2 mt-5 text-gray-500">
      © {{ new Date().getFullYear() }} TDFK. All rights reserved.
    </p>
    <div class="flex-grow"></div>

    <fa
      class="m-2 mt-5 rounded"
      :icon="['fab', 'linkedin']"
      size="2x"
      :style="{ color: '#7478ED' }"
    ></fa>
    <fa
      class="m-2 mt-5"
      :icon="['fab', 'github-square']"
      size="2x"
      :style="{ color: '#7478ED' }"
    ></fa>
  </div>
</template>

<script>
export default {
  head() {},
}
</script>

<style>
</style>
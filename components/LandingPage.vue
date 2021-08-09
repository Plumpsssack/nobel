<template>
  <div class="flex justify-center mt-10">
   <object data="images/Heart.svg" type="image/svg+xml" class="w-1/2"></object>
  </div>
</template>

<script>
  export default {
    head() {
    }
  }
</script>

<style lang="scss">
.heart-part1{
	animation: scale-up-center 0.9s cubic-bezier(0.390, 0.575, 0.565, 1.000) infinite alternate both;
}


@keyframes scale-up-center {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}


</style>
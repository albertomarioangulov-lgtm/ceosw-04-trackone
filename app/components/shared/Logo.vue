<script setup lang="ts">

interface Props {
  height?: number | string
  quality?: number 
}

const props = withDefaults( defineProps<Props>(), {
  height: 100,
  quality: 80
})

</script>

<template>
  <NuxtImg
    src="/images/ceosw-s-logo3.svg"
    :height="height"
    :quality="quality"
    class="logo-anim"
  />


</template>

<style scoped>
.logo-anim {
  animation: logoFadeScale 1.2s ease-out;
  cursor: pointer;
}

@keyframes logoFadeScale {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

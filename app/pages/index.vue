<script setup lang="ts">
definePageMeta({
  middleware: 'sidebase-auth',
})

</script>

<template>

  <v-alert
    type="success"
    title="Alert title"
    text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!"
  >
  <template v-slot:[`prepend`]>
    <Icon size="2rem" name="line-md:confirm-circle" />
  </template>
  </v-alert>
  
</template>
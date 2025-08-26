<script setup lang="ts">
definePageMeta({
  middleware: 'sidebase-auth',
})

</script>

<template>

  <v-alert
    type="success"
    title="¡Bienvenido a CEO TrackOne!"
    text="Desde este panel podrás gestionar clientes, paquetes, y envíos de manera eficiente. ¡Explora las opciones del menú para comenzar!"
  >
  <template v-slot:[`prepend`]>
    <Icon size="2rem" name="line-md:confirm-circle" />
  </template>
  </v-alert>
  
</template>
<script setup lang="ts">
const { lastMessage, connectionError } = useWebSocket()

const show = ref(false)
const message = ref('')
const color = ref('info')
const timeout = ref(5000)

watch(lastMessage, (newMessage) => {
  if (newMessage?.type === 'SHOW_NOTIFICATION') {
    const payload = newMessage.payload
    message.value = payload.message || 'Ocurrió un evento.'
    color.value = payload.color || 'info'
    timeout.value = payload.timeout || 5000
    show.value = true
  }
})

watch(connectionError, (newError) => {
  if (newError) {
    message.value = 'Conexión en tiempo real perdida. Intentando reconectar...'
    color.value = 'error'
    timeout.value = -1 // Mantenemos el snackbar visible hasta que la conexión se restablezca
    show.value = true
  } else {
    // Si el error se resuelve (ej. la conexión se restablece), ocultamos el snackbar de error.
    if (color.value === 'error') {
      show.value = false
    }
  }
})
</script>

<template>
  <v-snackbar class="ma-16"
    v-model="show"
    :color="color"
    :timeout="timeout"
    location="top right"
    variant="tonal"
  >
    {{ message }}
    <template #actions>
      <v-btn icon="mdi-close" variant="text" @click="show = false" />
    </template>
  </v-snackbar>
</template>
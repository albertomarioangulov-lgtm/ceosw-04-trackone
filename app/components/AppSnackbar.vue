<script setup lang="ts">
const { lastMessage } = useWebSocket()

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
import { ref, onMounted, onUnmounted, useAuth } from '#imports'

export function useWebSocket() {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const lastMessage = ref<any>(null)
  const connectionError = ref<Event | null>(null)

  const connect = () => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) return

    const { token } = useAuth()
    if (!token.value) return // No conectar si no hay token

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const host = window.location.host
    const wsUrl = `${protocol}://${host}/ws?token=${token.value}`

    ws.value = new WebSocket(wsUrl)

    ws.value.onopen = () => {
      isConnected.value = true
      connectionError.value = null // Limpiamos errores previos al conectar exitosamente
      console.log('WebSocket connection established.')
    }

    ws.value.onmessage = (event) => {
      try {
        lastMessage.value = JSON.parse(event.data)
      }
      catch (e) {
        console.error('Error parsing WebSocket message:', e)
        lastMessage.value = event.data
      }
    }

    ws.value.onclose = (event) => {
      isConnected.value = false
      console.log('WebSocket connection closed.', event)
      // Un código 1006 indica una desconexión anormal, a menudo por un fallo de red o servidor.
      if (event.code === 1006) {
        connectionError.value = event
      }
      // Opcional: intentar reconectar
      // setTimeout(connect, 5000)
    }

    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error)
      connectionError.value = error
    }
  }

  const disconnect = () => {
    if (ws.value) {
      ws.value.close()
    }
  }

  onMounted(connect)
  onUnmounted(disconnect)

  return {
    ws,
    isConnected,
    lastMessage,
    connectionError,
    connect,
    disconnect,
  }
}
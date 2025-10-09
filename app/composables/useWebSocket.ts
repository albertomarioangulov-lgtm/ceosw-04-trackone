import { ref, onMounted, onUnmounted, useAuth } from '#imports'

interface ConnectionError {
  message: string
  event: CloseEvent | Event
}

export function useWebSocket<T = any>() {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const lastMessage = ref<T | null>(null)
  const connectionError = ref<ConnectionError | null>(null)

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectAttempts = 0

  const connect = () => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) return
    
    const { token } = useAuth()
    if (!token.value) return // No conectar si no hay token

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const host = window.location.host
    const wsUrl = `${protocol}://${host}/ws?token=${token.value}`

    // console.log('Connecting to WebSocket at', wsUrl)

    ws.value = new WebSocket(wsUrl)

    ws.value.onopen = () => {
      isConnected.value = true
      connectionError.value = null // Limpiamos errores previos al conectar exitosamente
      reconnectAttempts = 0 // Reseteamos los intentos al conectar
      console.log('WebSocket connection established.')
    }

    ws.value.onmessage = (event) => {
      try {
        lastMessage.value = JSON.parse(event.data) as T
      }
      catch (e) {
        console.error('Error parsing WebSocket message:', e)
        lastMessage.value = event.data as T // Guardar el dato crudo si no es JSON
      }
    }

    ws.value.onclose = (event) => {
      isConnected.value = false
      console.log('WebSocket connection closed.', event)

      // Un cierre normal (código 1000) o iniciado por el cliente no debería disparar una reconexión.
      if (event.code !== 1000) {
        let message = `Conexión en tiempo real perdida (Código: ${event.code}).`
        if (event.code === 1006) {
          message = 'La conexión con el servidor se interrumpió. Intentando reconectar...'
        } else if (event.code === 1008) {
          message = `Autenticación fallida: ${event.reason || 'Credenciales inválidas'}.`
        }
        if (event.reason) {
          message += `: ${event.reason}`
        }
        connectionError.value = { message, event }
        // Iniciar el proceso de reconexión
        scheduleReconnect()
      }
    }

    ws.value.onerror = (error) => {
      console.error('WebSocket error event:', error)
      connectionError.value = { message: 'Error de conexión WebSocket.', event: error }
      // Un error a menudo precede a un 'onclose', pero por si acaso, intentamos reconectar.
      scheduleReconnect()
    }
  }

  const disconnect = () => {
    if (ws.value) {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
      // Usamos el código 1000 para indicar un cierre normal y voluntario.
      ws.value.close(1000, 'Cierre de sesión del usuario')
    }
  }

  const scheduleReconnect = () => {
    if (reconnectTimer || (ws.value && ws.value.readyState === WebSocket.OPEN)) return // Ya hay una reconexión programada o ya estamos conectados

    reconnectAttempts++
    // Exponential backoff: 1s, 2s, 4s, 8s, 10s, 10s...
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 10000)

    console.log(`WebSocket reconnect attempt ${reconnectAttempts} in ${delay}ms`);
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
  }

  onMounted(connect)
  onUnmounted(disconnect)

  return {
    ws,
    isConnected,
    lastMessage,
    connectionError,
    connect, // Exponer connect por si se necesita una conexión manual
    disconnect, // Exponer disconnect para cierres manuales
  }
}
import { defineWebSocketHandler, H3Event } from 'h3'

interface Peer {
  id: string
  send: (data: any) => void
  [key: string]: any // Para añadir propiedades personalizadas como 'userId'
}

// Mapea userId a un Set de conexiones (un usuario puede tener múltiples pestañas)
const userConnections = new Map<string, Set<Peer>>()

export default defineWebSocketHandler({
  // Se llama cuando un cliente se conecta
  open(peer: Peer) { // Removed async
    const auth = getWsAuth(peer) // Removed await
    if (!auth) {
      console.log('[ws] open: No auth, closing connection')
      peer.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }))
      return peer.close(1008, 'Invalid credentials')
    }

    peer.userId = auth.userId // Asociamos el userId a la conexión
    console.log(`[ws] open: User ${peer.userId} connected (peer: ${peer.id})`)

    if (!userConnections.has(peer.userId)) {
      userConnections.set(peer.userId, new Set())
    }
    userConnections.get(peer.userId)!.add(peer)

    peer.send(JSON.stringify({ type: 'welcome', message: `Conectado como usuario ${peer.userId}` }))
  },

  // Se llama cuando se recibe un mensaje de un cliente
  message(peer: Peer, message) {
    console.log('[ws] message', peer, message)
    // Aquí puedes procesar mensajes entrantes si es necesario
  },

  // Se llama cuando un cliente se desconecta
  close(peer: Peer, event) {
    console.log(`[ws] close: User ${peer.userId} disconnected (peer: ${peer.id})`)
    const connections = userConnections.get(peer.userId)
    if (connections) {
      connections.delete(peer)
      if (connections.size === 0) {
        userConnections.delete(peer.userId)
      }
    }
  },

  // Se llama en caso de error
  error(peer: Peer, error) {
    console.log('[ws] error', peer, error)
  },
})

/**
 * Envía un mensaje a todos los clientes conectados.
 * @param message El mensaje a enviar.
 */
export function broadcast(message: any) {
  const serializedMessage = JSON.stringify(message)
  for (const connections of userConnections.values()) {
    for (const peer of connections) {
      peer.send(serializedMessage)
    }
  }
}

/**
 * Envía un mensaje a todas las conexiones de un usuario específico.
 * @param userId El ID del usuario al que enviar el mensaje.
 * @param message El mensaje a enviar.
 */
export function unicast(userId: string, message: any) {
  const connections = userConnections.get(userId)
  if (connections) {
    const serializedMessage = JSON.stringify(message)
    for (const peer of connections) {
      peer.send(serializedMessage)
    }
  }
}
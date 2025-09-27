import { defineWebSocketHandler } from 'h3'

const clients = new Map<string, { send: (data: any) => void }>()

export default defineWebSocketHandler({
  // Se llama cuando un cliente se conecta
  open(peer) {
    console.log('[ws] open', peer)
    // Podrías implementar un sistema de autenticación y asociar el peer con un ID de usuario
    // Por ahora, usaremos el ID del peer como identificador único.
    const peerId = peer.id
    clients.set(peerId, { send: (data) => peer.send(data) })
    peer.send(JSON.stringify({ type: 'welcome', message: `Conectado! Tu ID es ${peerId}` }))
  },

  // Se llama cuando se recibe un mensaje de un cliente
  message(peer, message) {
    console.log('[ws] message', peer, message)
    // Aquí puedes procesar mensajes entrantes si es necesario
  },

  // Se llama cuando un cliente se desconecta
  close(peer, event) {
    console.log('[ws] close', peer, event)
    clients.delete(peer.id)
  },

  // Se llama en caso de error
  error(peer, error) {
    console.log('[ws] error', peer, error)
  },
})

/**
 * Envía un mensaje a todos los clientes conectados.
 * @param message El mensaje a enviar.
 */
export function broadcast(message: any) {
  const serializedMessage = JSON.stringify(message)
  for (const client of clients.values()) {
    client.send(serializedMessage)
  }
}

/**
 * Envía un mensaje a un cliente específico.
 * (Necesitarías un mapeo más robusto entre peer.id y tu ID de usuario/cliente)
 * @param clientId El ID del cliente al que enviar el mensaje.
 * @param message El mensaje a enviar.
 */
export function unicast(clientId: string, message: any) {
  const client = clients.get(clientId)
  if (client) {
    client.send(JSON.stringify(message))
  }
}


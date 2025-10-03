import { broadcast, unicast } from '~~/server/routes/ws'

/**
 * Endpoint de prueba para enviar mensajes a través de WebSockets.
 *
 * USO:
 * Enviar una petición POST a /api/test-ws con un body JSON.
 *
 * Para enviar un mensaje a un usuario específico (unicast):
 * {
 *   "userId": "ID_DEL_USUARIO_CONECTADO",
 *   "message": { "title": "Hola!", "content": "Este es un mensaje para ti." }
 * }
 *
 * Para enviar un mensaje a todos (broadcast):
 * {
 *   "isBroadcast": true,
 *   "message": { "title": "Anuncio", "content": "Mensaje para todos." }
 * }
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { userId, message, isBroadcast } = body

  if (isBroadcast) {
    console.log('[api-test-ws] Broadcasting message:', message)
    broadcast({ type: 'test', ...message })
    return { status: 'ok', action: 'broadcasted', message }
  }

  if (!userId || !message) {
    throw createError({ statusCode: 400, statusMessage: '`userId` and `message` are required for unicast.' })
  }

  console.log(`[api-test-ws] Unicasting message to ${userId}:`, message)
  unicast(userId, { type: 'test', ...message })
  return { status: 'ok', action: 'unicasted', target: userId, message }
})


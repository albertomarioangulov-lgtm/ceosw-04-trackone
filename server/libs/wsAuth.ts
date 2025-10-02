import jwt from 'jsonwebtoken'
import { useRuntimeConfig } from '#imports'

interface PeerWithContext {
  request: { url: string }
}

interface DecodedToken {
  id: string
  [key: string]: any
}

/**
 * Verifica el token JWT de un query param y devuelve el payload.
 */
export function getWsAuth(peer: PeerWithContext): { userId: string } | null {
  const config = useRuntimeConfig()
  let token = ''
  try {
    const url = new URL(peer.request.url, 'http://localhost')
    const rawToken = url.searchParams.get('token')
    if (!rawToken || typeof rawToken !== 'string') return null
    
    // Limpia el prefijo "Bearer " o "Bearer%20"
    if (rawToken.startsWith('Bearer')) {
      token = rawToken.split(' ')[1] || rawToken.split('%20')[1] || '';
    }

    const decoded = jwt.verify(token, config.authSecret) as DecodedToken
    return decoded?.id ? { userId: decoded.id } : null
  } catch (error) {
    console.error('[ws-auth] Invalid token', error)
    return null
  }
}
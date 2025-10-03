import jwt from 'jsonwebtoken'

interface PeerWithContext {
  request: { url: string }
}

interface DecodedToken {
  id: string;
  [key: string]: any
}

/**
 * Verifica el token JWT de un query param y devuelve el payload.
*/
export function getWsAuth(peer: PeerWithContext): { userId: string } | null {
  // Accede directamente a la variable de entorno para mayor fiabilidad en entornos de despliegue
  const authSecret = process.env.NUXT_AUTH_SECRET;
  // const config = useRuntimeConfig()
  // const authSecret = config.authSecret;

  if (!authSecret || typeof authSecret !== 'string') {
    console.error('[ws-auth] FATAL: NUXT_AUTH_SECRET is not available on the server. Check deployment secrets.')
    return null;
  }

  // let token = ''
  try {
    const url = new URL(peer.request.url, 'http://localhost')
    const rawToken = url.searchParams.get('token')
    if (!rawToken || typeof rawToken !== 'string') {
      return null;
    }

    // Limpia el prefijo "Bearer " o "Bearer%20"
    // token = rawToken.startsWith('Bearer') ? rawToken.split(/ |%20/)[1] || '' : rawToken;

    const token = rawToken.split(' '); // Asumimos que el token viene sin "Bearer "

    const decoded = jwt.verify(token[1], authSecret) as DecodedToken
    return decoded?.id ? { userId: decoded.id } : null;
  } catch (error) {
    // Este error es común si el token es inválido o ha expirado.
    console.error('[ws-auth] Token verification failed:', (error as Error).message);
    return null;
  }
}
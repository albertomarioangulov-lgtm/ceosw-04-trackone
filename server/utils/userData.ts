import jwt from 'jsonwebtoken'
import { H3Event } from 'h3'

const getUserId = (event: H3Event): string | null => {
  try {
    const authSecret = process.env.NUXT_AUTH_SECRET
    if (!authSecret) {
      console.error('[getUserId] Auth secret is not configured.')
      return null
    }

    const authorization = getRequestHeader(event, 'authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) return null

    const token = authorization.substring(7) // "Bearer ".length
    const decoded = jwt.verify(token, authSecret) as { id: string }
    return decoded?.id || null
  } catch (error) {
    console.error('[getUserId] Failed to verify token:', (error as Error).message)
    return null
  }
}

export default getUserId

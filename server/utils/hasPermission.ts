import { getUserFromToken } from './getUserFromToken'
import { H3Event } from 'h3'

export async function hasPermission(event: H3Event, required: string | string[]) {
  const user = await getUserFromToken(event)
  if (!user || !user.permissions) return false

  if (Array.isArray(required)) {
    return required.some(p => user.permissions.includes(p))
  }
  return user.permissions.includes(required)
}
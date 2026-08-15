import { H3Event } from 'h3'
import User from '~~/server/models/User'

export async function getUserFromSession(event: H3Event) {
  const session = await requireUserSession(event)
  const userId = session.user.id

  const user = await User.findById(userId).select('-password').lean().exec()
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Usuario no encontrado' })
  }

  return user
}

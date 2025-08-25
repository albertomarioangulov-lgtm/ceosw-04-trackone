import jwt from 'jsonwebtoken'
import { getRequestHeader, createError, H3Event } from 'h3'
import User from '~~/server/models/User'

export async function getUserFromToken(event: H3Event) {
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'No authorization header' })
  }
  const token = authHeader.replace('Bearer ', '')
  try {
    const decoded = jwt.verify(token, config.authSecret) as { id: string }
    const user = await User.findById(decoded.id).select('-password').lean()
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }
    return user
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}
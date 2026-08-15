import { H3Event } from 'h3'

export const getUserId = async (event: H3Event): Promise<string | null> => {
  try {
    const session = await getUserSession(event)
    return session.user?.id || null
  } catch (error) {
    console.error('[getUserId] Failed to read session:', (error as Error).message)
    return null
  }
}

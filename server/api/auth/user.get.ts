import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import userService from'~~/server/services/users'

const { getUserById } = userService()
const config = useRuntimeConfig()
const TOKEN_TYPE = 'Bearer'

const extractToken = (authHeaderValue: string) => {
  const [, token] = authHeaderValue.split(`${TOKEN_TYPE} `)
  return token
}

const ensureAuth = async (event: H3Event) => {
  const authHeaderValue = getRequestHeader(event, 'authorization')
  if (typeof authHeaderValue === 'undefined') {
    throw createError({ statusCode: 403, statusMessage: 'Need to pass valid Bearer-authorization header to access this endpoint' })
  }

  const extractedToken = extractToken(authHeaderValue)
  try {
    // return jwt.verify(extractedToken, config.authSecret)
    const verifiedData = jwt.verify(extractedToken, config.authSecret)
    // @ts-expect-error
    const id = verifiedData.id
    event.context.params!.id = id
    const userData = await getUserById(event)
    // @ts-expect-error
    const user = { userData, ...verifiedData }
    return user
  } catch (error) {
    console.error('Login failed. Here\'s the raw error:', error)
    throw createError({ statusCode: 403, statusMessage: 'You must be logged in to use this endpoint' })
  }
}

export default eventHandler(async (event) => {
  const user = await ensureAuth(event)
  return user
})
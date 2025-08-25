import jwt from 'jsonwebtoken'

const config = useRuntimeConfig()

const getUserId = (event:any) => {
  const header = getRequestHeaders(event)
  const authorization = header.authorization
  // @ts-expect-error
  const token = authorization.split(' ')
  const decoded = jwt.verify(token[1], config.authSecret)
  // @ts-expect-error
  const userId = decoded.id
  return userId
}

export default getUserId
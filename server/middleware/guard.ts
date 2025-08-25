// import { getServerSession, getToken } from '#auth'

// import { getServerSession } from "next-auth";

import jwt from 'jsonwebtoken'
import User from '../models/User'


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Only protect a certain backend route

  const url = getRequestURL(event)

  const { pathname } = new URL(url)

  const protectedRoutes = [
    '/api/users',
    '/api/roles',
    '/api/clients',
    // '/api/headquarters',
    // '/api/notices',
    // '/api/locations',
    // '/api/assets',
    
    // '/api/usersno',
  ]

  for (let i = 0; i < protectedRoutes.length; i++) {
    const r = protectedRoutes[i];

    if(pathname === r) {
      // console.log('protected route', r)

      // await requireUserSession(event)
      // const token = await getToken({event})
      // const header = getRequestHeader(event, '')
      // const body = readBody(event)
      const header = getRequestHeaders(event)
      const token = header.authorization
      // const header = getHeader(event,'token')
      // console.log('session: ', session)
      // console.log('token: ', token)
      // console.log('header: ', header)
      if(token) {
        const decoded = jwt.verify( token.split(' ')[1], config.authSecret )

        // @ts-expect-error
        const userId = `${ decoded.id }`
        const user = await User.findById(userId, { password: 0 })
        if ( !user ) return { message: 'Unauthorized'}

      } else {
        return { message: 'No token provided'}
      }
    }
  }
})
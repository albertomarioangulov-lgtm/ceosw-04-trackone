import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '~~/server/models/User'

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = loginSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de login fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const { email, password } = result.data

  const user = await User.findOne({ email })
    .exec()

  if (!user || !user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email o contraseña incorrectos',
    })
  }

  const isValidPassword = await bcryptjs.compare(password, user.password)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email o contraseña incorrectos',
    })
  }

  // Token JWT de corta duración usado únicamente por el WebSocket.
  // Se elimina en la Fase 5 cuando el WS pase a autenticarse con la sesión.
  const config = useRuntimeConfig()
  const wsToken = jwt.sign({ id: user._id }, config.authSecret as string, { expiresIn: '30d' })

  await setUserSession(event, {
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      initials: user.initials,
      color: user.color,
      avatar: user.avatar,
      roles: (user.roles ?? []).map((role: any) => role.name ?? String(role)),
      permissions: user.permissions ?? [],
      wsToken,
    },
  })

  return { success: true }
})

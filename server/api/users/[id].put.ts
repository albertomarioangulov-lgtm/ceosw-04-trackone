import { PERMISSIONS } from '~~/shared/permissions'
import { PERMISSIONS } from '~~/shared/permissions'
import { userUpdateSchema } from '~~/shared/user'
import User from '~~/server/models/User'
import bcryptjs from 'bcryptjs'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.USERS_MANAGE)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const result = userUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de usuario fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const updateData: Record<string, any> = { ...result.data }
  if (updateData.password) {
    const salt = await bcryptjs.genSalt(10)
    updateData.password = await bcryptjs.hash(updateData.password, salt)
  } else {
    delete updateData.password
  }

  try {
    const user = await User.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true })
      .select('-password')
      .lean()

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })
    }

    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      initials: user.initials,
      email: user.email,
      color: user.color,
      roles: (user.roles ?? []).map((r: any) => r.name ?? String(r)),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  } catch (error: any) {
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'El email o nombre de usuario ya existe' })
    }
    throw error
  }
})

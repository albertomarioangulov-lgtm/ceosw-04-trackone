import { PERMISSIONS } from '~~/shared/permissions'
import { PERMISSIONS } from '~~/shared/permissions'
import User from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.USERS_MANAGE)

  const id = getRouterParam(event, 'id')
  const user = await User.findById(id)
    .select('-password')
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
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
    createdBy: user.createdBy
      ? {
          _id: String(user.createdBy._id ?? user.createdBy),
          name: user.createdBy.name,
          initials: user.createdBy.initials,
          color: user.createdBy.color,
          avatar: user.createdBy.avatar,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
})

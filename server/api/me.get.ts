import User from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user.id

  const user = await User.findById(userId)
    .select('-password')
    .lean()
    .exec()

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })
  }

  return {
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      initials: user.initials,
      color: user.color,
      avatar: user.avatar,
      roles: (user.roles ?? []).map((role: any) => role.name ?? String(role)),
      permissions: user.permissions ?? [],
    },
  }
})

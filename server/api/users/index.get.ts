import User from "~~/server/models/User"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_users')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const users = await User.find()
    .populate({ path: 'roles', select: 'name' })
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .exec()

    return users
})
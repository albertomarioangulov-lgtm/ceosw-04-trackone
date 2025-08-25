import User from "~~/server/models/User"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_users')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  
  const data = await User.findById( id )
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

    return data
})
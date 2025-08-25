import CR from "~~/server/models/CR"

export default defineEventHandler(async (event) => {
  
  if (!await hasPermission(event, ['manage_crs', 'view_crs'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const data = await CR.find()
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .exec()

    return data
})
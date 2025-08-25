import WR from "~~/server/models/WR"

export default defineEventHandler(async (event) => {
  
  if (!await hasPermission(event, ['manage_wrs', 'view_wrs'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const data = await WR.find()
    .populate({ path: 'client', select: 'name address' })
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .exec()

    return data
})
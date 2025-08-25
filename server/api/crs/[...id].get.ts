import CR from "~~/server/models/CR"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_crs', 'view_crs'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  
  const data = await CR.findById( id )
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

    return data
})
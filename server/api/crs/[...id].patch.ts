import CR from "~~/server/models/CR"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_crs')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  const body = await readBody(event)
  const { client } = body
  const editData = { client }
  
  const updatedData = await CR.findByIdAndUpdate( id, editData, { new: true })
    .exec()

    return updatedData
})
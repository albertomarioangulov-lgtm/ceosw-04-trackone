import WR from "~~/server/models/WR"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_wrs')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  const body = await readBody(event)
  const { client } = body
  const editData = { client }
  
  const updatedData = await WR.findByIdAndUpdate( id, editData, { new: true })
    .exec()

    return updatedData
})
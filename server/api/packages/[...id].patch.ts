import Package from "~~/server/models/Package"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_packages')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  const body = await readBody(event)
  const { trkgNum, name, code } = body
  const editData = { trkgNum, name, code }
  
  const updatedData = await Package.findByIdAndUpdate( id, editData, { new: true })
    .exec()

    return updatedData
})
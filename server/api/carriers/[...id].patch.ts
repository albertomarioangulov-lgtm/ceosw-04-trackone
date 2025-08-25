// import { getServerSession, getToken } from '#auth'
import Carrier from "~~/server/models/Carrier"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_carriers')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  const body = await readBody(event)
  const { name, code } = body
  const editData = { name, code }
  
  const updatedData = await Carrier.findByIdAndUpdate( id, editData, { new: true })
    .exec()

    return updatedData
})
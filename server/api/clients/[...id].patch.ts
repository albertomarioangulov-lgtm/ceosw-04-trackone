import Client from "~~/server/models/Client"
import { broadcast } from '~~/server/routes/ws'

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_clients')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  const body = await readBody(event)
  const { name, code, seller, dateIn, country, zipCode, state, city, phone, address, email, emails, contacts } = body
  const editData = { name, code, seller, dateIn, country, zipCode, state, city, phone, address, email, emails, contacts }
  
  const updatedClient = await Client.findByIdAndUpdate( id, editData, { new: true })
    .exec()

  broadcast({
    type: 'CLIENT_UPDATED',
    payload: {
      clientId: updatedClient._id
    }
  })

  return updatedClient
})
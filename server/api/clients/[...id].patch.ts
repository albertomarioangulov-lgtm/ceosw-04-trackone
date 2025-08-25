import { getServerSession, getToken } from '#auth'
import Client from "~~/server/models/Client"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_clients')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  const body = await readBody(event)
  const { name, code, seller, dateIn, country, zipCode, state, city, phone, address, email, emails, contacts } = body
  const editData = { name, code, seller, dateIn, country, zipCode, state, city, phone, address, email, emails, contacts }
  
  const client = await Client.findByIdAndUpdate( id, editData, { new: true })
    .exec()

    return client
})
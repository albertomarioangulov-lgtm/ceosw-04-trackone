import { getServerSession, getToken } from '#auth'
import Client from "~~/server/models/Client"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_clients', 'view_clients'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  
  const client = await Client.findById( id )
    .populate({ path: 'seller', select: 'name code' })
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

    return client
})
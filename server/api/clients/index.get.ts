import Client from "~~/server/models/Client"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_clients', 'view_clients'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const clients = await Client.find()
    .populate({ path: 'seller', select: 'name code' })
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .exec()

    return clients
})
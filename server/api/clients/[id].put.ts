import { PERMISSIONS } from '~~/shared/permissions'
import { clientUpdateSchema } from '~~/shared/client'
import Client from "~~/server/models/Client"
import { broadcast } from '~~/server/routes/ws'

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.CLIENTS_MANAGE)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const result = clientUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de cliente fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const updatedClient = await Client.findByIdAndUpdate(id, result.data, { returnDocument: 'after', runValidators: true })
    .lean()

  if (!updatedClient) {
    throw createError({ statusCode: 404, statusMessage: 'Cliente no encontrado' })
  }

  broadcast({
    type: 'CLIENT_UPDATED',
    payload: {
      clientId: updatedClient._id
    }
  })

  return {
    ...updatedClient,
    id: updatedClient._id.toString(),
  }
})

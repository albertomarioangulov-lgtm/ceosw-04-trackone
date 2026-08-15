import { PERMISSIONS } from '~~/shared/permissions'
import { clientFormSchema } from '~~/shared/client'
import Client from "~~/server/models/Client"

import { broadcast } from '~~/server/routes/ws'

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.CLIENTS_MANAGE)

  const userId = await getUserId(event)
  const body = await readBody(event)
  const result = clientFormSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de cliente fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const savedData = await Client.create({ ...result.data, createdBy: userId })

  broadcast({
    type: 'CLIENT_CREATED',
    payload: {
      clientId: savedData._id,
      // Puedes incluir más datos si lo necesitas en el cliente
    }
  })
  
  return {
    ...savedData.toObject(),
    id: savedData._id.toString(),
  }
})

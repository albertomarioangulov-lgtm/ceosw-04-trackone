import { PERMISSIONS } from '~~/shared/permissions'
import { WR_STATUS, wrCreateSchema } from '~~/shared/wr'
import WR from "~~/server/models/WR"
import Package from "~~/server/models/Package"
import mongoose from "mongoose"

import { broadcast } from '~~/server/routes/ws'

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.WRS_MANAGE)

  const userId = await getUserId(event)
  const body = await readBody(event)
  const result = wrCreateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de WR fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const { _id, client, packages } = result.data

  let wr

  // If an _id is provided, we're adding packages to an existing WR.
  if (_id && mongoose.Types.ObjectId.isValid(_id)) {
    wr = await WR.findById(_id).exec()
    if (!wr) {
      throw createError({ statusCode: 404, statusMessage: 'WR no encontrado para actualizar' })
    }
    // Optionally update the client if it has changed
    if (client && wr.client.toString() !== client) {
      wr.client = client
      await wr.save()
    }
  } else { // Otherwise, create a new WR.
    const newWr = new WR({
      client,
      createdBy: userId
    })
    wr = await newWr.save()
  }

  // This logic handles adding ONLY new packages.
  // It filters for packages sent from the form that do not have an _id.
  if (packages && Array.isArray(packages) && packages.length > 0) {
    const newPackages = packages.filter(pkg => !pkg._id)

    if (newPackages.length > 0) {
      const packagesToSave = newPackages.map((pkg: any) => ({
        ...pkg,
        client: wr.client, // Always use the client from the WR document
        wr: wr._id,
        createdBy: userId
      }))
      await Package.create(packagesToSave)
    }
  }

  // Ciclo de vida: con paquetes -> opened; sin paquetes -> pending
  const packageCount = await Package.countDocuments({ wr: wr._id })
  wr.status = packageCount > 0 ? WR_STATUS.OPENED : WR_STATUS.PENDING
  await wr.save()

  // Después de crear el WR exitosamente, emitimos un evento
  broadcast({
    type: 'WR_CREATED',
    payload: {
      clientId: wr.client, // El ID del cliente afectado
      wrId: wr._id,
    }
  })
  
  return {
    ...wr.toObject(),
    id: wr._id.toString(),
  }
})

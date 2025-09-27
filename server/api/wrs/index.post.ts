import WR from "~~/server/models/WR"
import Package from "~~/server/models/Package"
import getUserId from "~~/server/libs/userData"
import mongoose from "mongoose"

import { broadcast } from '~~/server/routes/ws'

export default defineEventHandler( async (event) => {

  if (!await hasPermission(event, 'manage_wrs')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = getUserId(event)

  const body = await readBody(event)
  const { _id, client, packages } = body

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

  // Después de crear el WR exitosamente, emitimos un evento
  broadcast({
    type: 'WR_CREATED',
    payload: {
      clientId: wr.client, // El ID del cliente afectado
      wrId: wr._id,
    }
  })
  
  return wr
})
import { PERMISSIONS } from '~~/shared/permissions'
import { crCreateSchema } from '~~/shared/cr'
import { WR_STATUS } from '~~/shared/wr'
import CR from "~~/server/models/CR"
import Package from "~~/server/models/Package"
import WR from "~~/server/models/WR"
// import getUserId from "~~/server/libs/userData"

import { broadcast, unicast } from '~~/server/routes/ws'
// import getUserId from "~~/server/utils/userData"

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.CRS_MANAGE)

  const userId = await getUserId(event)
  const body = await readBody(event)
  const result = crCreateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de CR fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const { wr, packages: packageIds, carrier } = result.data

  const newData = new CR({
    wr,
    carrier,
    createdBy: userId
  })
  const savedData = await newData.save()

  // Update all selected packages to link them to the newly created CR
  if (packageIds && packageIds.length > 0) {
    await Package.updateMany(
      { _id: { $in: packageIds } },
      { $set: { cr: savedData._id } }
    )
  }

  // Si el WR se quedó sin paquetes disponibles, pasa a finalizado
  const availableCount = await Package.countDocuments({
    wr: savedData.wr,
    $or: [{ cr: { $exists: false } }, { cr: null }],
  })
  if (availableCount === 0) {
    await WR.updateOne({ _id: savedData.wr }, { $set: { status: WR_STATUS.FINALIZED } })
  }

  // Envía una notificación de éxito solo al usuario que realizó la acción
  unicast(userId, {
    type: 'SHOW_NOTIFICATION',
    payload: {
      message: `CR #${savedData.crId} creado con éxito.`,
      color: 'success',
    },
  })

  // Después de crear el CR exitosamente, emitimos un evento a todos los clientes
  broadcast({
    type: 'CR_CREATED',
    payload: {
      wrId: savedData.wr, // El ID del WR afectado
      crId: savedData._id,
    }
  })
  
  return {
    ...savedData.toObject(),
    id: savedData._id.toString(),
  }
})

import { PERMISSIONS } from '~~/shared/permissions'
import CR from "~~/server/models/CR"
import Package from "~~/server/models/Package"
// import getUserId from "~~/server/libs/userData"

import { broadcast, unicast } from '~~/server/routes/ws'
// import getUserId from "~~/server/utils/userData"

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.CRS_MANAGE)

  const userId = await getUserId(event)

  const body = await readBody(event)
  const { wr, packages: packageIds } = body

  const newData = new CR({
    wr,
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
  
  return savedData
})

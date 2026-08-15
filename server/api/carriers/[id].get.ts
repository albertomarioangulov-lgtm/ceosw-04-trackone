import { PERMISSIONS } from '~~/shared/permissions'
import Carrier from '~~/server/models/Carrier'

export default defineEventHandler(async (event) => {
  await requirePermission(event, [PERMISSIONS.CARRIERS_MANAGE, PERMISSIONS.CARRIERS_VIEW])

  const id = getRouterParam(event, 'id')
  const carrier = await Carrier.findById(id)
    .populate({ path: 'createdBy', select: 'name initials color' })
    .lean()

  if (!carrier) {
    throw createError({ statusCode: 404, statusMessage: 'Carrier no encontrado' })
  }

  return {
    id: carrier._id.toString(),
    name: carrier.name,
    code: carrier.code,
    createdBy: carrier.createdBy
      ? {
          _id: String(carrier.createdBy._id ?? carrier.createdBy),
          name: carrier.createdBy.name,
          initials: carrier.createdBy.initials,
          color: carrier.createdBy.color,
        }
      : null,
    createdAt: carrier.createdAt,
    updatedAt: carrier.updatedAt,
  }
})

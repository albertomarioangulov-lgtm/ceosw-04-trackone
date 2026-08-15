import { PERMISSIONS } from '~~/shared/permissions'
import WR from '~~/server/models/WR'
import Package from '~~/server/models/Package'

export default defineEventHandler(async (event) => {
  await requirePermission(event, [PERMISSIONS.WRS_MANAGE, PERMISSIONS.WRS_VIEW])

  const id = getRouterParam(event, 'id')
  const wr = await WR.findById(id).select('wrId status').lean()

  if (!wr) {
    throw createError({ statusCode: 404, statusMessage: 'WR no encontrado' })
  }

  const [packageCount, availablePackageCount] = await Promise.all([
    Package.countDocuments({ wr: wr._id }),
    Package.countDocuments({
      wr: wr._id,
      $or: [{ cr: { $exists: false } }, { cr: null }],
    }),
  ])

  return {
    id: wr._id.toString(),
    wrId: wr.wrId,
    status: wr.status,
    packageCount,
    availablePackageCount,
  }
})

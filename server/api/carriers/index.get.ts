import { PERMISSIONS } from '~~/shared/permissions'
import Carrier from "~~/server/models/Carrier"

export default defineEventHandler(async (event) => {

  await requirePermission(event, [PERMISSIONS.CARRIERS_MANAGE, PERMISSIONS.CARRIERS_VIEW])

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 15
  const search = (query.search as string) || ''
  const sortBy = (query.sortBy as string) || 'createdAt'
  const sortOrder = (query.sortOrder as string) === 'asc' ? 1 : -1

  const filter: Record<string, any> = {}
  if (search) {
    const regex = { $regex: search, $options: 'i' }
    filter.$or = [{ name: regex }, { code: regex }]
  }

  const total = await Carrier.countDocuments(filter)
  const carriers = await Carrier.find(filter)
    .sort({ [sortBy]: sortOrder } as any)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .lean()

  return {
    items: carriers.map((c: any) => ({
      id: c._id.toString(),
      name: c.name,
      code: c.code,
      createdBy: c.createdBy
        ? {
            _id: String(c.createdBy._id ?? c.createdBy),
            name: c.createdBy.name,
            initials: c.createdBy.initials,
            color: c.createdBy.color,
            avatar: c.createdBy.avatar,
          }
        : null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})

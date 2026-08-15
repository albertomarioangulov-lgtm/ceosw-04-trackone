import { PERMISSIONS } from '~~/shared/permissions'
import User from "~~/server/models/User"

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.USERS_MANAGE)

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 15
  const search = (query.search as string) || ''
  const sortBy = (query.sortBy as string) || 'createdAt'
  const sortOrder = (query.sortOrder as string) === 'asc' ? 1 : -1

  const filter: Record<string, any> = {}
  if (search) {
    const regex = { $regex: search, $options: 'i' }
    filter.$or = [{ name: regex }, { username: regex }, { email: regex }]
  }

  const total = await User.countDocuments(filter)
  const users = await User.find(filter)
    .sort({ [sortBy]: sortOrder } as any)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password')
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .lean()

  return {
    items: users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name,
      username: u.username,
      initials: u.initials,
      email: u.email,
      color: u.color,
      roles: (u.roles ?? []).map((r: any) => r.name ?? String(r)),
      createdBy: u.createdBy
        ? {
            _id: String(u.createdBy._id ?? u.createdBy),
            name: u.createdBy.name,
            initials: u.createdBy.initials,
            color: u.createdBy.color,
            avatar: u.createdBy.avatar,
          }
        : null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})

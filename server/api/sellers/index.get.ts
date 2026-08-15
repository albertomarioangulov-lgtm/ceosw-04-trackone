import { PERMISSIONS } from '~~/shared/permissions'
import Seller from "~~/server/models/Seller"

export default defineEventHandler(async (event) => {
  
  await requirePermission(event, [PERMISSIONS.SELLERS_MANAGE, PERMISSIONS.SELLERS_VIEW])

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 15
  const search = (query.search as string) || ''
  const sortBy = (query.sortBy as string) || 'createdAt'
  const sortOrder = (query.sortOrder as string) === 'asc' ? 1 : -1

  const filter: Record<string, any> = {}
  if (search) {
    const regex = { $regex: search, $options: 'i' }
    filter.$or = [{ name: regex }, { code: regex }, { email: regex }]
  }

  const total = await Seller.countDocuments(filter)
  const sellers = await Seller.find(filter)
    .sort({ [sortBy]: sortOrder } as any)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .lean()

  return {
    items: sellers.map((s: any) => ({
      id: s._id.toString(),
      name: s.name,
      code: s.code,
      seller_code: s.seller_code,
      phone: s.phone,
      email: s.email,
      emails: s.emails ?? [],
      address: s.address,
      fee: s.fee,
      country: s.country,
      state: s.state,
      city: s.city,
      createdBy: s.createdBy
        ? {
            _id: String(s.createdBy._id ?? s.createdBy),
            name: s.createdBy.name,
            initials: s.createdBy.initials,
            color: s.createdBy.color,
            avatar: s.createdBy.avatar,
          }
        : null,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})

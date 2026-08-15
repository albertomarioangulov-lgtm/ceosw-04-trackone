import { PERMISSIONS } from '~~/shared/permissions'
import Seller from '~~/server/models/Seller'

export default defineEventHandler(async (event) => {
  await requirePermission(event, [PERMISSIONS.SELLERS_MANAGE, PERMISSIONS.SELLERS_VIEW])

  const id = getRouterParam(event, 'id')
  const seller = await Seller.findById(id)
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .lean()

  if (!seller) {
    throw createError({ statusCode: 404, statusMessage: 'Vendedor no encontrado' })
  }

  return {
    id: seller._id.toString(),
    name: seller.name,
    code: seller.code,
    seller_code: seller.seller_code,
    phone: seller.phone,
    email: seller.email,
    emails: seller.emails ?? [],
    address: seller.address,
    fee: seller.fee,
    country: seller.country,
    state: seller.state,
    city: seller.city,
    createdBy: seller.createdBy
      ? {
          _id: String(seller.createdBy._id ?? seller.createdBy),
          name: seller.createdBy.name,
          initials: seller.createdBy.initials,
          color: seller.createdBy.color,
          avatar: seller.createdBy.avatar,
        }
      : null,
    createdAt: seller.createdAt,
    updatedAt: seller.updatedAt,
  }
})

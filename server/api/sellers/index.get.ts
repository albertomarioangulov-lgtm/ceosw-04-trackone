import { PERMISSIONS } from '~~/shared/permissions'
// import { getServerSession, getToken } from '#auth'
import Seller from "~~/server/models/Seller"

export default defineEventHandler(async (event) => {
  
  await requirePermission(event, [PERMISSIONS.SELLERS_MANAGE, PERMISSIONS.SELLERS_VIEW])
  
  const sellers = await Seller.find()
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .exec()

    return sellers
})

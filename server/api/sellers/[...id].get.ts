import { PERMISSIONS } from '~~/shared/permissions'
// import { getServerSession, getToken } from '#auth'
import Seller from "~~/server/models/Seller"

export default defineEventHandler(async (event) => {

  await requirePermission(event, [PERMISSIONS.SELLERS_MANAGE, PERMISSIONS.SELLERS_VIEW])

  const id = event.context.params!.id
  
  const seller = await Seller.findById( id )
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

    return seller
})

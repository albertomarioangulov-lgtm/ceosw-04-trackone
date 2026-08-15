import { PERMISSIONS } from '~~/shared/permissions'
// import { getServerSession, getToken } from '#auth'
import Seller from "~~/server/models/Seller"

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.SELLERS_MANAGE)

  const id = event.context.params!.id
  const body = await readBody(event)
  const { name, phone, email, emails, address, seller_code, code, fee } = body
  const editData = { name, phone, email, emails, address, seller_code, code, fee }
  
  const seller = await Seller.findByIdAndUpdate( id, editData, { returnDocument: 'after' })
    .exec()

    return seller
})

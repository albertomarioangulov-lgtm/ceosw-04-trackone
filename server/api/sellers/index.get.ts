// import { getServerSession, getToken } from '#auth'
import Seller from "~~/server/models/Seller"

export default defineEventHandler(async (event) => {
  
  if (!await hasPermission(event, ['manage_sellers', 'view_sellers'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const sellers = await Seller.find()
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .exec()

    return sellers
})
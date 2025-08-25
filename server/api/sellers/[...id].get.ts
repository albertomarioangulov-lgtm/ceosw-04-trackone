// import { getServerSession, getToken } from '#auth'
import Seller from "~~/server/models/Seller"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_sellers', 'view_sellers'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  
  const seller = await Seller.findById( id )
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

    return seller
})
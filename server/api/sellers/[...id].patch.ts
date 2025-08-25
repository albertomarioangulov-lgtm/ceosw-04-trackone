// import { getServerSession, getToken } from '#auth'
import Seller from "~~/server/models/Seller"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, 'manage_sellers')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  const body = await readBody(event)
  const { name, phone, email, emails, address, seller_code, code, fee } = body
  const editData = { name, phone, email, emails, address, seller_code, code, fee }
  
  const seller = await Seller.findByIdAndUpdate( id, editData, { new: true })
    .exec()

    return seller
})
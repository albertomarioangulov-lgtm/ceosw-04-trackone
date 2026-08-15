import { PERMISSIONS } from '~~/shared/permissions'
import Seller from "~~/server/models/Seller"
// import getUserId from "~~/server/libs/userData"

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.SELLERS_MANAGE)

  const userId = await getUserId(event)

  const body = await readBody(event)
  const { name, phone, email, emails, address, seller_code, code, fee } = body

  const newData = new Seller({
    name, phone, email, emails, address, seller_code, code, fee,
    createdBy: userId
  })
  const savedData = await newData.save()
  
  return savedData
})

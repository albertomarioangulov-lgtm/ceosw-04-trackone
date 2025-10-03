import Seller from "~~/server/models/Seller"
// import getUserId from "~~/server/libs/userData"

export default defineEventHandler( async (event) => {

  if (!await hasPermission(event, 'manage_sellers')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = getUserId(event)

  const body = await readBody(event)
  const { name, phone, email, emails, address, seller_code, code, fee } = body

  const newData = new Seller({
    name, phone, email, emails, address, seller_code, code, fee,
    createdBy: userId
  })
  const savedData = await newData.save()
  
  return savedData
})
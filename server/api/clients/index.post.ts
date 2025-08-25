import Client from "~~/server/models/Client"
import getUserId from "~~/server/libs/userData"

export default defineEventHandler( async (event) => {

  if (!await hasPermission(event, 'manage_clients')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = getUserId(event)

  const body = await readBody(event)
  const { name, code, seller, docTyp, docNum, dateIn, zipCode, state, city, phone, address, email, emails, contacts } = body

  const newData = new Client({
    name, code, seller, docTyp, docNum, dateIn, zipCode, state, city, phone, address, email, emails, contacts,
    createdBy: userId
  })
  // @ts-expect-error
  const savedData = await newData.save()
  
  return savedData
})
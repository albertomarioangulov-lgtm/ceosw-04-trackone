import Carrier from "~~/server/models/Carrier"
// import getUserId from "~~/server/libs/userData"

export default defineEventHandler( async (event) => {

  if (!await hasPermission(event, 'manage_carriers')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = getUserId(event)

  const body = await readBody(event)
  const { name, code } = body

  const newData = new Carrier({
    name, code,
    createdBy: userId
  })
  // @ts-expect-error
  const savedData = await newData.save()
  
  return savedData
})
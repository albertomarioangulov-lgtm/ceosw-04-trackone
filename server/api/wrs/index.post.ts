import WR from "~~/server/models/WR"
import getUserId from "~~/server/libs/userData"

export default defineEventHandler( async (event) => {

  if (!await hasPermission(event, 'manage_wrs')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = getUserId(event)

  const body = await readBody(event)
  const { client } = body

  const newData = new WR({
    client,
    createdBy: userId
  })
  // @ts-expect-error
  const savedData = await newData.save()
  
  return savedData
})
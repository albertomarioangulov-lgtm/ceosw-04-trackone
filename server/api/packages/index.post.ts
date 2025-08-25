import Package from "~~/server/models/Package"
import getUserId from "~~/server/libs/userData"

export default defineEventHandler( async (event) => {

  if (!await hasPermission(event, 'manage_packages')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = getUserId(event)

  const body = await readBody(event)
  const { trkgNum, name, code } = body

  const newData = new Package({
    trkgNum, name, code,
    createdBy: userId
  })
  // @ts-expect-error
  const savedData = await newData.save()
  
  return savedData
})
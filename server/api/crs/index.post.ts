import CR from "~~/server/models/CR"
import Package from "~~/server/models/Package"
import getUserId from "~~/server/libs/userData"

export default defineEventHandler( async (event) => {

  if (!await hasPermission(event, 'manage_crs')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = getUserId(event)

  const body = await readBody(event)
  const { wr, packages: packageIds } = body

  const newData = new CR({
    wr,
    createdBy: userId
  })
  const savedData = await newData.save()

  // Update all selected packages to link them to the newly created CR
  if (packageIds && packageIds.length > 0) {
    await Package.updateMany(
      { _id: { $in: packageIds } },
      { $set: { cr: savedData._id } }
    )
  }
  
  return savedData
})
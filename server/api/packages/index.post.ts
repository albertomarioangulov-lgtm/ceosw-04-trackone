import { PERMISSIONS } from '~~/shared/permissions'
import Package from "~~/server/models/Package"
// import getUserId from "~~/server/libs/userData"

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.PACKAGES_MANAGE)

  const userId = await getUserId(event)

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

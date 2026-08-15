import { PERMISSIONS } from '~~/shared/permissions'
import Package from "~~/server/models/Package"

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.PACKAGES_MANAGE)

  const id = event.context.params!.id
  const body = await readBody(event)
  const { trkgNum, name, code } = body
  const editData = { trkgNum, name, code }
  
  const updatedData = await Package.findByIdAndUpdate( id, editData, { returnDocument: 'after' })
    .exec()

    return updatedData
})

import { PERMISSIONS } from '~~/shared/permissions'
import WR from "~~/server/models/WR"

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.WRS_MANAGE)

  const id = event.context.params!.id
  const body = await readBody(event)
  const { client } = body
  const editData = { client }
  
  const updatedData = await WR.findByIdAndUpdate( id, editData, { returnDocument: 'after' })
    .exec()

    return updatedData
})

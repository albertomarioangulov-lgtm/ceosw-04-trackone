import { PERMISSIONS } from '~~/shared/permissions'
import CR from "~~/server/models/CR"

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.CRS_MANAGE)

  const id = event.context.params!.id
  const body = await readBody(event)
  const { client } = body
  const editData = { client }
  
  const updatedData = await CR.findByIdAndUpdate( id, editData, { returnDocument: 'after' })
    .exec()

    return updatedData
})

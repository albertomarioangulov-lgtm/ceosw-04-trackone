import { PERMISSIONS } from '~~/shared/permissions'
import User from "~~/server/models/User"

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.USERS_MANAGE)

  const id = event.context.params!.id
  
  const data = await User.findById( id )
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

    return data
})

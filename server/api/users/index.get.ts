import { PERMISSIONS } from '~~/shared/permissions'
import User from "~~/server/models/User"

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.USERS_MANAGE)
  
  const users = await User.find()
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .exec()

    return users
})

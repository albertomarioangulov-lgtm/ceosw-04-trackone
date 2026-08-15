import { PERMISSIONS } from '~~/shared/permissions'
import User from "~~/server/models/User"
import bcryptjs from 'bcryptjs'

const encryptPassword = async (password:any) => {
  const salt = await bcryptjs.genSalt(10)
  return await bcryptjs.hash(password, salt)
}

interface UserData {
  name: string
  username: string
  password?: string
  initials: string
  email: string
  roles: string[]
  color: string
  textColor: string
}

export default defineEventHandler(async (event) => {

  await requirePermission(event, PERMISSIONS.USERS_MANAGE)

  const id = event.context.params!.id
  const body = await readBody(event)
  const { name, username, password, initials, email, roles, color, textColor } = body
  const editData:UserData = { name, username, initials, email, roles, color, textColor }

  if (password) {
    editData.password = await encryptPassword(password)
  }
  
  const savedData = await User.findByIdAndUpdate( id, editData, { returnDocument: 'after' })
    .exec()

    return savedData
})

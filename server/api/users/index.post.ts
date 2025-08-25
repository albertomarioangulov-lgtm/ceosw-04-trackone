import User from "~~/server/models/User"
import bcryptjs from 'bcryptjs'
import getUserId from "~~/server/libs/userData"

const encryptPassword = async (password:any) => {
  const salt = await bcryptjs.genSalt(10)
  return await bcryptjs.hash(password, salt)
}

export default defineEventHandler( async (event) => {

  if (!await hasPermission(event, 'manage_users')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const userId = await getUserId(event)

  const body = await readBody(event)
  const { name, username, initials, email, password, roles, color, textColor } = body

  const newData = new User({
    name, username, initials, email, roles, color, textColor,
    password: await encryptPassword(password),
    createdBy: userId
  })
  const savedData = await newData.save()

  return savedData
})
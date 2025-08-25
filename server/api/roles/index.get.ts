import { getServerSession, getToken } from '#auth'
// import { getToken } from 'next-auth/jwt'
import Role from "~~/server/models/Role"

export default defineEventHandler(async (event) => {
  
  const roles = await Role.find()
    .populate({ path: 'createdBy', select: 'name color' })
    .exec()

    return roles
})
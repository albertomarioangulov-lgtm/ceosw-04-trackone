import Role from "~~/server/models/Role"

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  
  const roles = await Role.find()
    .populate({ path: 'createdBy', select: 'name color' })
    .exec()

    return roles
})

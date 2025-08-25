// import { getServerSession, getToken } from '#auth'
import Carrier from "~~/server/models/Carrier"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_carriers', 'view_carriers'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const carriers = await Carrier.find()
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .exec()

    return carriers
})
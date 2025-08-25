// import { getServerSession, getToken } from '#auth'
import Carrier from "~~/server/models/Carrier"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_carriers', 'view_carriers'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  
  const carrier = await Carrier.findById( id )
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

    return carrier
})
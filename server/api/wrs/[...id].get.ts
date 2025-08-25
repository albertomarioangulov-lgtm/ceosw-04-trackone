// import { getServerSession, getToken } from '#auth'
import WR from "~~/server/models/WR"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_wrs', 'view_wrs'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  
  const data = await WR.findById( id )
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

    return data
})
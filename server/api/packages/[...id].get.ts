import Package from "~~/server/models/Package"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_packages', 'view_packages'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  
  const data = await Package.findById( id )
    .populate({ path: 'client', select: 'name address poboxid country state city seller',
        populate: { path: 'seller', select: 'code seller_code' }
    })
    .populate({ path: 'wr', select: 'wrId' })
    .populate({ path: 'createdBy', select: 'name initials color' })
    .exec()

  return data
})
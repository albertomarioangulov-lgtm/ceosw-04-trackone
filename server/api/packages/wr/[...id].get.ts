import Package from "~~/server/models/Package"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_packages', 'view_packages'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id
  
  const data = await Package.find({ wr: id })
    .populate({ path: 'wr', select: 'wrId client',
      populate: { path: 'client', select: 'name' }
    })
    .populate({ path: 'cr', select: 'crId', strictPopulate: false })
    .populate({ path: 'createdBy', select: 'name initials color' })
    // .where( 'wr' ).equals( id )
    .lean()
    .exec()

    // const rawPackages = await Package.find()
    //     .populate({ path: 'wr', select: 'wrId client',
    //       populate: { path: 'client', select: 'name' }
    //     })
    //     .populate({ path: 'cr', select: 'crId' })
    //     .populate({ path: 'createdBy', select: 'name initials color' })
    //     .where( 'wr' ).equals( wr )
    //     .lean()
    //     .exec()

  return data
})
import mongoose from "mongoose"
import Package from "~~/server/models/Package"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_packages', 'view_packages'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID format' })
  }

  const pipeline = [
    {
      $match: { _id: new mongoose.Types.ObjectId(id) }
    },
    {
      $lookup: {
        from: 'clients',
        let: { clientId: '$client' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$clientId'] } } },
          {
            $lookup: {
              from: 'sellers',
              let: { sellerId: '$seller' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$sellerId'] } } },
                { $project: { _id: 1, code: 1, seller_code: 1 } }
              ],
              as: 'seller'
            }
          },
          { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
          { $project: { _id: 1, name: 1, address: 1, poboxid: 1, country: 1, state: 1, city: 1, seller: 1 } }
        ],
        as: 'client'
      }
    },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'wrs',
        let: { wrId: '$wr' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$wrId'] } } },
          { $project: { _id: 1, wrId: 1 } }
        ],
        as: 'wr'
      }
    },
    { $unwind: { path: '$wr', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        let: { createdById: '$createdBy' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$createdById'] } } },
          { $project: { _id: 1, name: 1, initials: 1, color: 1 } }
        ],
        as: 'createdBy'
      }
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } }
  ]

  const [data] = await Package.aggregate(pipeline).exec()

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Package not found' })
  }

  return data
})
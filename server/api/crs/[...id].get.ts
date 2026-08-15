import { PERMISSIONS } from '~~/shared/permissions'
import mongoose from 'mongoose'
import CR from "~~/server/models/CR"

export default defineEventHandler(async (event) => {

  await requirePermission(event, [PERMISSIONS.CRS_MANAGE, PERMISSIONS.CRS_VIEW])

  const id = event.context.params!.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID de CR inválido' })
  }
  
  // const data = await CR.findById( id )
  //   .populate({ path: 'createdBy', select: 'name initials color' })
  //   .exec()

  const aggregationPipeline: any = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      // Populate client
      {
        $lookup: {
          from: 'wrs',
          localField: 'wr',
          foreignField: '_id',
          as: 'wr'
        }
      },
      { $unwind: { path: '$wr', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'clients',
          localField: 'wr.client',
          foreignField: '_id',
          as: 'wr.client'
        }
      },
      { $unwind: { path: '$wr.client', preserveNullAndEmptyArrays: true } },
      // Populate createdBy
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      // Populate packages (virtual)
      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: 'cr',
          as: 'packages'
        }
      },
      // Shape createdBy to select specific fields, mimicking .populate({ select: ... })
      {
        $addFields: {
          'createdBy': { _id: '$createdBy._id', name: '$createdBy.name', initials: '$createdBy.initials', color: '$createdBy.color' }
        }
      }
    ]

  const [data] = await CR.aggregate(aggregationPipeline).exec()

  return data
})

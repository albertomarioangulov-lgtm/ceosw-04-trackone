import { PERMISSIONS } from '~~/shared/permissions'
// import { getServerSession, getToken } from '#auth'
import mongoose from 'mongoose'
import WR from "~~/server/models/WR"

export default defineEventHandler(async (event) => {

  await requirePermission(event, [PERMISSIONS.WRS_MANAGE, PERMISSIONS.WRS_VIEW])

  const id = event.context.params!.id
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID de WR inválido' })
  }

  const aggregationPipeline: any = [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    // Populate client
    {
      $lookup: {
        from: 'clients',
        localField: 'client',
        foreignField: '_id',
        as: 'client'
      }
    },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
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
        foreignField: 'wr',
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

  const [data] = await WR.aggregate(aggregationPipeline).exec()

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'WR no encontrado' })
  }

  return {
    ...data,
    id: data._id.toString(),
  }
})

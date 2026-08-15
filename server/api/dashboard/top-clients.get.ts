import { PERMISSIONS } from '~~/shared/permissions'
import WR from '~~/server/models/WR'

export default defineEventHandler(async (event) => {
  await requirePermission(event, [PERMISSIONS.WRS_MANAGE, PERMISSIONS.WRS_VIEW])

  const { startDate, endDate } = getQuery(event)

  const dateFilter: any = {}
  if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
    const end = new Date(endDate)
    end.setDate(end.getDate() + 1)
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: end,
    }
  }

  try {
    const topClients = await WR.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$client',
          wrCount: { $sum: 1 },
          wrs: { $push: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'wrs',
          foreignField: 'wr',
          as: 'packages',
        },
      },
      {
        $addFields: {
          packageCount: { $size: '$packages' },
        },
      },
      { $sort: { packageCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'clients', // Nombre de la colección de clientes
          localField: '_id',
          foreignField: '_id',
          as: 'clientInfo',
        },
      },
      { $unwind: '$clientInfo' },
      {
        $project: {
          _id: 0,
          clientId: '$_id',
          clientName: '$clientInfo.name',
          wrCount: 1,
          packageCount: 1,
        },
      },
    ])

    return topClients
  }
  catch (error) {
    console.error('Error fetching top clients:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching top clients' })
  }
})

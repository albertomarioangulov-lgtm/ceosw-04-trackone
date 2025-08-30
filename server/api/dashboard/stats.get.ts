import WR from '~~/server/models/WR'
import Client from '~~/server/models/Client'
import Package from '~~/server/models/Package'

export default defineEventHandler(async (event) => {
  if (!await hasPermission(event, ['manage_wrs', 'view_wrs'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const { startDate, endDate } = getQuery(event)

  const dateFilter: any = {}
  if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
    const end = new Date(endDate)
    end.setDate(end.getDate() + 1) // Incluir el día final completo
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: end,
    }
  }

  try {
    const [
      totalWrs,
      totalClients,
      totalPackages,
      wrsWithAvailablePackages,
    ] = await Promise.all([
      WR.countDocuments(dateFilter),
      Client.countDocuments(), // El total de clientes es una métrica global
      Package.countDocuments(dateFilter),
      WR.aggregate([
        { $match: dateFilter },
        {
          $lookup: {
            from: 'packages',
            localField: '_id',
            foreignField: 'wr',
            as: 'packages',
          },
        },
        {
          $match: {
            'packages.cr': { $exists: false },
          },
        },
        { $count: 'count' },
      ]).exec(),
    ])

    const availableWrsCount = wrsWithAvailablePackages[0]?.count ?? 0

    return { totalWrs, totalClients, totalPackages, availableWrsCount }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching dashboard stats' })
  }
})

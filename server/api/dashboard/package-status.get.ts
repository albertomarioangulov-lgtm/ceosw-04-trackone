import { PERMISSIONS } from '~~/shared/permissions'
import Package from '~~/server/models/Package'

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
    const [availablePackages, unavailablePackages] = await Promise.all([
      Package.countDocuments({ ...dateFilter, cr: { $exists: false } }),
      Package.countDocuments({ ...dateFilter, cr: { $exists: true } }),
    ])

    return {
      labels: ['Disponibles', 'No Disponibles'],
      datasets: [
        {
          label: 'Estado de Paquetes',
          data: [availablePackages, unavailablePackages],
          backgroundColor: ['#4CAF50', '#F44336'],
          hoverBackgroundColor: ['#66BB6A', '#EF5350'],
        },
      ],
    }
  }
  catch (error) {
    console.error('Error fetching package status:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching chart data' })
  }
})

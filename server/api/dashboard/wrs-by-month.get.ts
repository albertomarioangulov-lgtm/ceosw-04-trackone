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
    const wrsByMonth = await WR.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ])

    // Formateamos los datos para Chart.js y rellenamos los meses faltantes
    const labels: string[] = []
    const data: number[] = []
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    if (wrsByMonth.length > 0) {
      let currentDate = new Date(wrsByMonth[0]._id.year, wrsByMonth[0]._id.month - 1)
      const lastDate = new Date(wrsByMonth[wrsByMonth.length - 1]._id.year, wrsByMonth[wrsByMonth.length - 1]._id.month - 1)

      while (currentDate <= lastDate) {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1

        labels.push(`${monthNames[month - 1]} ${year}`)

        const found = wrsByMonth.find(item => item._id.year === year && item._id.month === month)
        data.push(found ? found.count : 0)

        currentDate.setMonth(currentDate.getMonth() + 1)
      }
    }

    return { labels, datasets: [{ label: 'WRs Creados', data, backgroundColor: '#3f51b5' }] }
  }
  catch (error) {
    console.error('Error fetching WRs by month:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching chart data' })
  }
})

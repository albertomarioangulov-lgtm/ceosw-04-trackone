import WR from '~~/server/models/WR'

export default defineEventHandler(async (event) => {
  if (!await hasPermission(event, ['manage_wrs', 'view_wrs'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    const recentWrs = await WR.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('client', 'name') // Traemos solo el nombre del cliente
      .lean() // .lean() para un rendimiento más rápido en consultas de solo lectura

    return recentWrs
  }
  catch (error) {
    console.error('Error fetching recent WRs:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching recent WRs' })
  }
})
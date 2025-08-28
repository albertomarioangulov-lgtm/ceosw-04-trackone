import Package from "~~/server/models/Package"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_packages', 'view_packages'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    // Obtener parámetros de paginación, búsqueda y ordenamiento del query
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const itemsPerPage = Number(query.itemsPerPage ?? 25)
    const search = (query.search as string) ?? ''
    const sortBy = (query.sortBy as string) || '_id'
    const sortDesc = query.sortDesc === 'true'

    // Construir el filtro de búsqueda
    const filter: any = {}
    if (search) {
      filter.$or = [
        { trkgNum: { $regex: search, $options: 'i' } },
        { 'wr.client.name': { $regex: search, $options: 'i' } },
      ]
    }

    // Construir el objeto de ordenamiento para el pipeline
    const sort: { [key: string]: 1 | -1 } = {}
    sort[sortBy] = sortDesc ? -1 : 1

    // Usamos un pipeline de agregación para obtener los datos y el conteo total en una sola consulta
    const aggregationResult = await Package.aggregate([
      // Etapa 1: Realizar los "joins" (lookups) para obtener datos relacionados.
      // Esto es necesario antes de filtrar por campos de colecciones relacionadas.
      {
        $lookup: {
          from: 'wrs', // Nombre de la colección para el modelo 'WR'
          localField: 'wr',
          foreignField: '_id',
          as: 'wr'
        }
      },
      { $unwind: { path: '$wr', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'clients', // Nombre de la colección para 'Client'
          localField: 'wr.client',
          foreignField: '_id',
          as: 'wr.client'
        }
      },
      { $unwind: { path: '$wr.client', preserveNullAndEmptyArrays: true } },

      // Etapa 2: Filtrar los paquetes según el criterio de búsqueda.
      // Se aplica después de los lookups para poder filtrar por el nombre del cliente.
      { $match: filter },

      {
        $lookup: {
          from: 'users', // Nombre de la colección para 'User'
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },

      // Etapa 3: Usar $facet para obtener los datos paginados y el conteo total
      {
        $facet: {
          items: [
            { $sort: sort },
            { $skip: (page - 1) * itemsPerPage },
            { $limit: itemsPerPage }
          ],
          total: [
            { $count: 'count' }
          ]
        }
      }
    ])

    // El resultado de $facet es un array con un único objeto
    const result = aggregationResult[0]
    const items = result.items
    const total = result.total.length > 0 ? result.total[0].count : 0

    return {
      items,
      total
    }
  } catch (error) {
    // Registrar el error en la consola del servidor para depuración
    console.error('Error fetching packages:', error)

    // Lanzar un error HTTP estandarizado para el cliente
    throw createError({
      statusCode: 500,
      statusMessage: 'An internal server error occurred. Please try again later.'
    })
  }
})
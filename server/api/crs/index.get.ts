import CR from "~~/server/models/CR"

export default defineEventHandler(async (event) => {
  
  if (!await hasPermission(event, ['manage_crs', 'view_crs'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  try {
    // Obtener parámetros de paginación, búsqueda y ordenamiento del query
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const itemsPerPage = Number(query.itemsPerPage ?? 25)
    const search = (query.search as string) ?? ''
    const sortBy = (query.sortBy as string) || 'createdAt' // Default sort by creation date
    const sortDesc = query.sortDesc === 'true'

    // Construir el filtro de búsqueda.
    // Ejemplo: si el modelo CR tuviera un campo 'title' para buscar:
    // const filter: any = {}
    // if (search) {
    //   filter.title = { $regex: search, $options: 'i' }
    // }
    const filter: any = {}
    if (search) {
      // Para buscar en campos de colecciones relacionadas (ej. nombre del cliente),
      // se necesitaría realizar el $lookup antes del $match.
      // Por simplicidad, aquí se asume la búsqueda sobre un campo local.
    }

    // Construir el objeto de ordenamiento para el pipeline
    const sort: { [key: string]: 1 | -1 } = {}
    sort[sortBy] = sortDesc ? -1 : 1

    // Usamos un pipeline de agregación para obtener los datos y el conteo total en una sola consulta
    const aggregationResult = await CR.aggregate([
      // Etapa 1: Filtrar los documentos según el criterio de búsqueda
      { $match: filter },

      // Etapa 2: Realizar los "joins" (lookups) para obtener datos relacionados
      {
        $lookup: {
          from: 'clients', // Nombre de la colección para el modelo 'Client'
          localField: 'client',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'users', // Nombre de la colección para el modelo 'User'
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

    return { items, total }
  } catch (error) {
    console.error('Error fetching CRs:', error)
    throw createError({ statusCode: 500, statusMessage: 'An internal server error occurred.' })
  }
})
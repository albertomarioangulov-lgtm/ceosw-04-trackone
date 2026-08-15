import { PERMISSIONS } from '~~/shared/permissions'
import CR from "~~/server/models/CR"

export default defineEventHandler(async (event) => {
  
  await requirePermission(event, [PERMISSIONS.CRS_MANAGE, PERMISSIONS.CRS_VIEW])
  
  try {
    // Obtener parámetros de paginación, búsqueda y ordenamiento del query
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const itemsPerPage = Number(query.itemsPerPage ?? 25)
    const search = (query.search as string) ?? ''
    const sortBy = (query.sortBy as string) ?? ''
    const sortDesc = query.sortDesc === 'true'

    const filter: any = {}
    if (search) {
      filter.$or = [
        {
          $expr: {
            $regexMatch: { input: { $toString: '$crId' }, regex: search, options: 'i' }
          }
        },
        { 'wr.client.name': { $regex: search, $options: 'i' } },
        { 'wr.client.address': { $regex: search, $options: 'i' } }
      ]
    }

    // Construir el objeto de ordenamiento para el pipeline
    const sort: { [key: string]: 1 | -1 } = {}
    if (sortBy) {
      sort[sortBy] = sortDesc ? -1 : 1
    } else {
      sort.createdAt = -1
    }

    // Usamos un pipeline de agregación para obtener los datos y el conteo total en una sola consulta
    const aggregationResult = await CR.aggregate([
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

      // Etapa 2: Filtrar los documentos según el criterio de búsqueda.
      // Se aplica después de los lookups para poder filtrar por el nombre del cliente.
      { $match: filter },

      // Etapa 3: Traer los paquetes asociados a cada CR.
      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: 'cr',
          as: 'packages'
        }
      },

      // Etapa 4: Calcular la cantidad de paquetes.
      {
        $addFields: {
          packageCount: { $size: '$packages' }
        }
      },

      // Etapa 3: Usar $facet para obtener los datos paginados y el conteo total
      {
        $facet: {
          items: [
            { $sort: sort },
            // Aplicar paginación
            ...(itemsPerPage > 0 ? [
              { $skip: (page - 1) * itemsPerPage },
              { $limit: itemsPerPage }
            ] : []),
            // Aplicar lookup de 'createdBy' solo a los datos de la página
            {
              $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy'
              }
            },
            { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
            // Excluir el array de paquetes que ya no es necesario
            { $project: { packages: 0 } }
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

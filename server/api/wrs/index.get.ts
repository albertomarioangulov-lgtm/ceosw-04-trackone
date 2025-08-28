import WR from "~~/server/models/WR"
import { FilterQuery } from "mongoose"

export default defineEventHandler(async (event) => {
  
  if (!await hasPermission(event, ['manage_wrs', 'view_wrs'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
 
  try {
    // Obtener parámetros de paginación, búsqueda y ordenamiento del query
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const itemsPerPage = Number(query.itemsPerPage ?? 25)
    const search = (query.search as string) ?? ''
    const sortBy = (query.sortBy as string) ?? ''
    const sortDesc = query.sortDesc === 'true'

    // Filtro de búsqueda
    const filter: FilterQuery<any> = {}
    if (search) {
      // Búsqueda por wrId (convirtiendo a string) o por nombre de cliente
      filter.$or = [
        {
          $expr: {
            $regexMatch: { input: { $toString: '$wrId' }, regex: search, options: 'i' }
          }
        },
        { 'client.name': { $regex: search, $options: 'i' } }
      ]
    }

    // Construir el objeto de ordenamiento para el pipeline
    const sort: { [key: string]: 1 | -1 } = {}
    if (sortBy) {
      sort[sortBy] = sortDesc ? -1 : 1
    } else {
      sort.createdAt = -1
    }

    const pipeline: any[] = [
      // Etapa 1: Lookup en 'clients' para poder filtrar por nombre de cliente.
      // Se hace antes del $facet para que el filtro ($match) funcione.
      {
        $lookup: {
          from: 'clients', // collection name for Client model
          localField: 'client',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },

      // Etapa 2: Filtrar documentos después del lookup
      { $match: filter },
    ]

    // Etapa 3: Usar $facet para obtener metadatos (conteo) y datos paginados/populados
    const facet: any = {
      metadata: [{ $count: 'total' }],
      data: [
        { $sort: sort },
      ],
    }

    // Añadir paginación si es necesario
    if (itemsPerPage > 0) {
      facet.data.push({ $skip: (page - 1) * itemsPerPage })
      facet.data.push({ $limit: itemsPerPage })
    }

    // Añadir lookups y proyección para popular datos (post-paginación para eficiencia)
    facet.data.push(
      {
        $lookup: {
          from: 'users', // collection name for User model
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        },
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      // Dar forma a los datos populados sin perder los campos originales
      {
        $addFields: {
          // El objeto 'client' ya está disponible por el lookup previo al facet.
          // Aquí damos forma a 'createdBy' que acabamos de popular y re-aseguramos la forma de 'client'.
          client: {
            _id: '$client._id',
            name: '$client.name',
            address: '$client.address',
          },
          createdBy: {
            _id: '$createdBy._id',
            name: '$createdBy.name',
            initials: '$createdBy.initials',
            color: '$createdBy.color',
            avatar: '$createdBy.avatar',
          },
        },
      },
    )

    pipeline.push({ $facet: facet })

    // Ejecutar la agregación
    const result = await WR.aggregate(pipeline).exec()

    const items = result[0]?.data ?? []
    const total = result[0]?.metadata[0]?.total ?? 0

    return { items, total }
  } catch (error) {
    console.error('Error fetching WRs:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching Warehouse Receipts' })
  }
})
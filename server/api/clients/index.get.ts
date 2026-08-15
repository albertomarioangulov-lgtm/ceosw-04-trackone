import { PERMISSIONS } from '~~/shared/permissions'
import Client from "~~/server/models/Client"
import { FilterQuery } from "mongoose"

export default defineEventHandler(async (event) => {

  await requirePermission(event, [PERMISSIONS.CLIENTS_MANAGE, PERMISSIONS.CLIENTS_VIEW])

  try {
    // Recibe parámetros de paginación, búsqueda y ordenamiento
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const itemsPerPage = Number(query.itemsPerPage ?? 25)
    const search = (query.search as string) ?? ''
    const sortBy = (query.sortBy as string) ?? ''
    const sortDesc = query.sortDesc === 'true'

    // Filtro de búsqueda mejorado para múltiples campos
    const filter: FilterQuery<any> = {}
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { address: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
      ]
    }

    // Opciones de ordenamiento dinámico
    const sort: { [key: string]: 1 | -1 } = {}
    if (sortBy) {
      sort[sortBy] = sortDesc ? -1 : 1
    } else {
      sort.createdAt = -1
    }

    // Construcción del pipeline de agregación
    const pipeline: any[] = []

    // Etapa 1: Filtrar documentos
    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter })
    }

    // Etapa 2: Usar $facet para obtener metadatos (conteo total) y datos paginados/populados
    const facet: any = {
      metadata: [{ $count: 'total' }],
      data: [
        { $sort: sort },
      ],
    }

    // Añadir etapas de paginación si es necesario
    if (itemsPerPage > 0) {
      facet.data.push({ $skip: (page - 1) * itemsPerPage })
      facet.data.push({ $limit: itemsPerPage })
    }

    // Añadir lookups para emular populate y $project para emular select
    facet.data.push(
      { $lookup: { from: 'sellers', localField: 'seller', foreignField: '_id', as: 'seller' } },
      { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      // $addFields es más limpio que $project para no tener que re-declarar todos los campos
      {
        $addFields: {
          'seller': {
            _id: '$seller._id',
            name: '$seller.name',
            code: '$seller.code',
          },
          'createdBy': {
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
    const result = await Client.aggregate(pipeline).exec()

    const items = result[0]?.data ?? []
    const total = result[0]?.metadata[0]?.total ?? 0

    return {
      items,
      total
    }
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching clients' })
  }
})

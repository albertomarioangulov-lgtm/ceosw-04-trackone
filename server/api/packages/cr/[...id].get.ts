import Package from "~~/server/models/Package"
import mongoose, { FilterQuery } from "mongoose"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_packages', 'view_packages'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  try {
    // Obtener ID del Cargo Release desde los parámetros de la ruta
    const crId = event.context.params!.id

    // Obtener parámetros de paginación, búsqueda y ordenamiento del query
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const itemsPerPage = Number(query.itemsPerPage ?? 25)
    const search = (query.search as string) ?? ''
    const sortBy = (query.sortBy as string) ?? ''
    const sortDesc = query.sortDesc === 'true'
    const availableOnly = query.availableOnly === 'true'

    // --- Construcción del pipeline de agregación ---

    // 1. Etapa de filtrado inicial: paquetes de un WR específico
    const initialMatch: FilterQuery<any> = {
      cr: new mongoose.Types.ObjectId(crId),
    }

    // Aplicar filtro condicional para mostrar solo paquetes disponibles (no en un CR)
    // if (availableOnly) {
    //   initialMatch.cr = { $exists: false }
    // }

    const pipeline: any[] = [{ $match: initialMatch }]

    // 2. Etapa de búsqueda (si se proporciona un término de búsqueda)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }
      pipeline.push({
        $match: {
          $or: [
            { tracking: searchRegex },
            { description: searchRegex },
            { notes: searchRegex }
            // Añadir aquí otros campos del paquete por los que se quiera buscar
          ]
        }
      })
    }

    // 3. Opciones de ordenamiento dinámico
    const sort: { [key: string]: 1 | -1 } = {}
    if (sortBy) {
      sort[sortBy] = sortDesc ? -1 : 1
    } else {
      sort.createdAt = -1 // Ordenamiento por defecto
    }

    // 4. Etapa $facet para obtener metadatos (conteo) y datos paginados/populados
    const facet: any = {
      metadata: [{ $count: 'total' }],
      data: [{ $sort: sort }]
    }

    // Añadir paginación si es necesario
    if (itemsPerPage > 0) {
      facet.data.push({ $skip: (page - 1) * itemsPerPage })
      facet.data.push({ $limit: itemsPerPage })
    }

    // Añadir lookups para emular populate y $addFields para emular select
    facet.data.push(
      { $lookup: { from: 'crs', localField: 'cr', foreignField: '_id', as: 'cr' } },
      { $unwind: { path: '$cr', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'wrs', localField: 'wr', foreignField: '_id', as: 'wr' } },
      { $unwind: { path: '$wr', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'clients', localField: 'wr.client', foreignField: '_id', as: 'wr.client' } },
      { $unwind: { path: '$wr.client', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          'wr': { _id: '$wr._id', wrId: '$wr.wrId', client: { _id: '$wr.client._id', name: '$wr.client.name' } },
          'cr': { _id: '$cr._id', crId: '$cr.crId' },
          'createdBy': { _id: '$createdBy._id', name: '$createdBy.name', initials: '$createdBy.initials', color: '$createdBy.color', avatar: '$createdBy.avatar' }
        }
      }
    )

    pipeline.push({ $facet: facet })

    // Ejecutar la agregación
    const result = await Package.aggregate(pipeline).exec()

    const items = result[0]?.data ?? []
    const total = result[0]?.metadata[0]?.total ?? 0

    return { items, total }
  } catch (error) {
    console.error('Error fetching packages for WR:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching packages' })
  }
})
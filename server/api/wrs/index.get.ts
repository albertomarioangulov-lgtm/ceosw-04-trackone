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
    const baseSort: { [key: string]: 1 | -1 } = {}
    if (sortBy) {
      baseSort[sortBy] = sortDesc ? -1 : 1
    } else {
      baseSort.createdAt = -1
    }

    // Construir el objeto de ordenamiento final que prioriza WRs con paquetes disponibles
    const finalSort: { [key: string]: 1 | -1 } = {
      hasAvailablePackages: -1, // Prioriza los que tienen paquetes disponibles (1 viene antes que 0)
      ...baseSort               // Luego aplica el ordenamiento solicitado por el usuario o el por defecto
    };

    // Pipeline secuencial y simplificado. Confiamos en el nuevo índice de `packages.wr`
    // para que el $lookup de paquetes sea eficiente.
    const pipeline: any[] = [
      // Etapa 1: Lookup inicial para poder filtrar por nombre de cliente
      {
        $lookup: {
          from: 'clients',
          localField: 'client',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },

      // Etapa 2: Aplicar el filtro de búsqueda
      { $match: filter },

      // Etapa 3: Traer todos los paquetes asociados.
      // Con el índice en `packages.wr`, esta operación ahora es mucho más rápida.
      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: 'wr',
          as: 'packages'
        }
      },

      // Etapa 4: Calcular conteos y el campo para el ordenamiento prioritario
      {
        $addFields: {
          packageCount: { $size: '$packages' },
          availablePackageCount: {
            $size: {
              $filter: {
                input: '$packages',
                as: 'pkg',
                // Condición robusta para contar paquetes disponibles, basada en tu sugerencia.
                // Un paquete está disponible si el campo 'cr' no existe (su tipo es 'missing')
                // o si el campo 'cr' existe pero es explícitamente nulo (su tipo es 'null').
                // Esta es la forma más fiable de implementar la lógica de `{ cr: { $exists: false } }`.
                cond: { $in: [ { $type: '$$pkg.cr' }, ['missing', 'null'] ] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          hasAvailablePackages: {
            $cond: { if: { $gt: ['$availablePackageCount', 0] }, then: 1, else: 0 }
          }
        }
      },

      // Etapa 5: Ordenar la lista completa de resultados
      { $sort: finalSort },

      // Etapa 6: Usar $facet para paginar y obtener el conteo total
      {
        $facet: {
          paginatedData: [
            // Aplicar paginación
            ...(itemsPerPage > 0 ? [
              { $skip: (page - 1) * itemsPerPage },
              { $limit: itemsPerPage }
            ] : []),
            // Aplicar lookups finales (baratos) solo a los datos de la página actual
            { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
            { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
            // Excluir campos temporales que ya no son necesarios
            { $project: { packages: 0, hasAvailablePackages: 0 } }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ];

    // Ejecutar la agregación
    const result = await WR.aggregate(pipeline).exec()

    // Extraer y dar forma a los resultados del $facet
    const items = result[0]?.paginatedData ?? []
    const total = result[0]?.totalCount[0]?.count ?? 0

    return { items, total }
  } catch (error) {
    console.error('Error fetching WRs:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching Warehouse Receipts' })
  }
})
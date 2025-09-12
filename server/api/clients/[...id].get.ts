import mongoose from 'mongoose'
import Client from "~~/server/models/Client"

export default defineEventHandler(async (event) => {
  if (!await hasPermission(event, ['manage_clients', 'view_clients'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params!.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID de cliente inválido' })
  }

  // Usamos un pipeline de agregación para un rendimiento óptimo,
  // en lugar de múltiples llamadas a .populate()
  const aggregationPipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    // Emulamos el populate para 'seller'
    { $lookup: { from: 'sellers', localField: 'seller', foreignField: '_id', as: 'seller' } },
    { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
    // Emulamos el populate para 'createdBy'
    { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    // Agregamos el último WR
    {
      $lookup: {
        from: 'wrs', // Asumo que la colección se llama 'wrs'
        let: { clientId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$client', '$$clientId'] } } },
          { $sort: { createdAt: -1 } }, // Ordenar por fecha para obtener el más reciente
          { $limit: 1 },
          // Hacemos un lookup a los paquetes de este WR para poder contarlos
          {
            $lookup: {
              from: 'packages',
              let: { wrId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$wr', '$$wrId'] } } },
                // Proyectamos solo el campo 'cr' para el conteo
                { $project: { _id: 0, cr: 1 } }
              ],
              as: 'packages'
            }
          },
          // Agregamos los campos de conteo
          {
            $addFields: {
              // Conteo total de paquetes en el WR
              packageCount: { $size: '$packages' },
              // Conteo de paquetes disponibles (aquellos sin 'cr')
              availablePackageCount: {
                $size: {
                  $filter: {
                    input: '$packages',
                    as: 'pkg',
                    // Un paquete está disponible si el campo 'cr' no existe (tipo 'missing')
                    // o si el campo 'cr' existe pero es explícitamente nulo (tipo 'null').
                    cond: { $in: [{ $type: '$$pkg.cr' }, ['missing', 'null']] }
                  }
                }
              }
            }
          },
          // Seleccionamos los campos que necesitamos del WR y los nuevos conteos
          { $project: { _id: 1, wrId: 1, createdAt: 1, packageCount: 1, availablePackageCount: 1 } }
        ],
        as: 'lastWr'
      }
    },
    { $unwind: { path: '$lastWr', preserveNullAndEmptyArrays: true } },
    // Agregamos el último CR
    {
      $lookup: {
        from: 'crs', // Asumo que la colección se llama 'crs'
        let: { clientId: '$_id' },
        pipeline: [
          // Para encontrar el CR de un cliente, primero necesitamos encontrar el WR asociado.
          // Hacemos un "join" con la colección de WRs.
          {
            $lookup: {
              from: 'wrs',
              localField: 'wr',
              foreignField: '_id',
              as: 'wrInfo'
            }
          },
          // Descomponemos el array de wrInfo. Un CR solo debe tener un WR.
          { $unwind: { path: '$wrInfo', preserveNullAndEmptyArrays: false } },
          // Ahora que tenemos los detalles del WR, podemos filtrar por el ID del cliente.
          { $match: { $expr: { $eq: ['$wrInfo.client', '$$clientId'] } } },
          // Ordenamos por fecha para obtener el más reciente
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          // Y seleccionamos solo los campos que necesitamos del CR
          { $project: { _id: 1, crId: 1, createdAt: 1 } }
        ],
        as: 'lastCr'
      }
    },
    { $unwind: { path: '$lastCr', preserveNullAndEmptyArrays: true } },
    // Agregamos el último paquete
    {
      $lookup: {
        from: 'packages', // La colección se llama 'packages'
        let: { clientId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$client', '$$clientId'] } } },
          { $sort: { createdAt: -1 } }, // Ordenar por fecha para obtener el más reciente
          { $limit: 1 },
          { $project: { _id: 1, trkgNum: 1, notes: 1, createdAt: 1 } } // Seleccionamos los campos que necesitamos del paquete
        ],
        as: 'lastPackage'
      }
    },
    { $unwind: { path: '$lastPackage', preserveNullAndEmptyArrays: true } },
    // Damos forma a los campos populados, similar a .select()
    {
      $addFields: {
        seller: {
          _id: '$seller._id',
          name: '$seller.name',
          code: '$seller.code'
        },
        createdBy: {
          _id: '$createdBy._id',
          name: '$createdBy.name',
          initials: '$createdBy.initials',
          color: '$createdBy.color'
        }
      }
    }
  ]

  const [client] = await Client.aggregate(aggregationPipeline).exec()

  if (!client) {
    throw createError({ statusCode: 404, statusMessage: 'Cliente no encontrado' })
  }

  return client
})
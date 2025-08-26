import Package from "~~/server/models/Package"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_packages', 'view_packages'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Recibe parámetros de paginación y búsqueda
  const query = getQuery(event)
  // const page = query.page
  // const itemsPerPage = query.itemsPerPage
  const page = Number(query.page ?? 1)
  const itemsPerPage = Number(query.itemsPerPage ?? 10)
  const search = query.search ?? ''

  // Filtro de búsqueda (ejemplo: por nombre)
  const filter: any = {}
  if (search) {
    filter.trkgNum = { $regex: search, $options: 'i' }
  }

  // Total de registros filtrados
  const total = await Package.countDocuments(filter)
  
  // const data = await Package.find()
  //   .populate({ path: 'wr', select: 'wrId client',
  //     populate: { path: 'client', select: 'name' }
  //   })
  //   .populate({ path: 'cr', select: 'crId' })
  //   .populate({ path: 'createdBy', select: 'name initials color avatar' })
  //   .sort({ _id: -1 })
  //   .limit(100)
  //   .exec()

  // Consulta paginada y filtrada
  const items = await Package.find(filter)
    .populate({ path: 'wr', select: 'wrId client',
      populate: { path: 'client', select: 'name' }
    })
    // .populate({ path: 'cr', select: 'crId' })
    .populate({ path: 'createdBy', select: 'name initials color avatar' })
    .sort({ _id: -1 })
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .exec()

  return {
    items,
    total
  }
})
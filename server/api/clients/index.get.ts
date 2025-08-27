import Client from "~~/server/models/Client"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_clients', 'view_clients'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    // Recibe parámetros de paginación y búsqueda
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const itemsPerPage = Number(query.itemsPerPage ?? 25)
    const search = query.search ?? ''

    // Filtro de búsqueda (ejemplo: por nombre)
    const filter: any = {}
    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    // Total de registros filtrados para la paginación
    const total = await Client.countDocuments(filter)

    // Consulta paginada, filtrada y ordenada
    const items = await Client.find(filter)
      .populate({ path: 'seller', select: 'name code' })
      .populate({ path: 'createdBy', select: 'name initials color avatar' })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .exec()

    return {
      items,
      total
    }
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Error fetching clients' })
  }
})
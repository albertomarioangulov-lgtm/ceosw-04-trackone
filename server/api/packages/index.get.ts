import Package from "~~/server/models/Package"

export default defineEventHandler(async (event) => {

  if (!await hasPermission(event, ['manage_packages', 'view_packages'])) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    // Get pagination and search parameters from the query
    const query = getQuery(event)
    const page = Number(query.page ?? 1)
    const itemsPerPage = Number(query.itemsPerPage ?? 10)
    const search = (query.search as string) ?? ''
    const sortBy = (query.sortBy as string) || '_id'
    const sortDesc = query.sortDesc === 'true'

    // Build search filter (example: by tracking number)
    const filter: any = {}
    if (search) {
      filter.trkgNum = { $regex: search, $options: 'i' }
    }

    // Build sort object
    const sort: { [key: string]: 'asc' | 'desc' } = {}
    sort[sortBy] = sortDesc ? 'desc' : 'asc'

    // Get total count of filtered documents
    const total = await Package.countDocuments(filter)

    // Paginated and filtered query
    const items = await Package.find(filter)
      .populate({ path: 'wr', select: 'wrId client',
        populate: { path: 'client', select: 'name' }
      })
      .populate({ path: 'createdBy', select: 'name initials color avatar' })
      .sort(sort)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .exec()

    return {
      items,
      total
    }
  } catch (error) {
    // Log the error on the server console for debugging
    console.error('Error fetching packages:', error)

    // Throw a standardized HTTP error for the client
    throw createError({
      statusCode: 500,
      statusMessage: 'An internal server error occurred. Please try again later.'
    })
  }
})
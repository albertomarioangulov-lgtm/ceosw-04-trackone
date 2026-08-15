import { PERMISSIONS } from '~~/shared/permissions'
import { wrUpdateSchema } from '~~/shared/wr'
import WR from '~~/server/models/WR'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.WRS_MANAGE)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const result = wrUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de WR fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const updatedData = await WR.findByIdAndUpdate(id, result.data, { returnDocument: 'after', runValidators: true }).lean()

  if (!updatedData) {
    throw createError({ statusCode: 404, statusMessage: 'WR no encontrado' })
  }

  return {
    ...updatedData,
    id: updatedData._id.toString(),
  }
})

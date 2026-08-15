import { PERMISSIONS } from '~~/shared/permissions'
import { crUpdateSchema } from '~~/shared/cr'
import CR from '~~/server/models/CR'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.CRS_MANAGE)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const result = crUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de CR fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const updatedData = await CR.findByIdAndUpdate(id, result.data, { returnDocument: 'after', runValidators: true }).lean()

  if (!updatedData) {
    throw createError({ statusCode: 404, statusMessage: 'CR no encontrado' })
  }

  return {
    ...updatedData,
    id: updatedData._id.toString(),
  }
})

import { PERMISSIONS } from '~~/shared/permissions'
import { carrierFormSchema } from '~~/shared/carrier'
import Carrier from '~~/server/models/Carrier'

const updateCarrierSchema = carrierFormSchema.partial()

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.CARRIERS_MANAGE)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const result = updateCarrierSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de carrier fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  const carrier = await Carrier.findByIdAndUpdate(id, result.data, { returnDocument: 'after', runValidators: true }).lean()

  if (!carrier) {
    throw createError({ statusCode: 404, statusMessage: 'Carrier no encontrado' })
  }

  return {
    id: carrier._id.toString(),
    name: carrier.name,
    code: carrier.code,
    createdAt: carrier.createdAt,
    updatedAt: carrier.updatedAt,
  }
})

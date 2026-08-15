import { PERMISSIONS } from '~~/shared/permissions'
import { carrierFormSchema } from '~~/shared/carrier'
import Carrier from "~~/server/models/Carrier"

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.CARRIERS_MANAGE)

  const userId = await getUserId(event)
  const body = await readBody(event)
  const result = carrierFormSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de carrier fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  try {
    const carrier = await Carrier.create({ ...result.data, createdBy: userId })
    return {
      id: carrier._id.toString(),
      name: carrier.name,
      code: carrier.code,
      createdAt: carrier.createdAt,
      updatedAt: carrier.updatedAt,
    }
  } catch (error: any) {
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'El código de carrier ya existe' })
    }
    throw error
  }
})

import { PERMISSIONS } from '~~/shared/permissions'
import { sellerFormSchema } from '~~/shared/seller'
import Seller from "~~/server/models/Seller"

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.SELLERS_MANAGE)

  const userId = await getUserId(event)
  const body = await readBody(event)
  const result = sellerFormSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de vendedor fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  try {
    const savedData = await Seller.create({ ...result.data, createdBy: userId })
    return {
      id: savedData._id.toString(),
      name: savedData.name,
      code: savedData.code,
      seller_code: savedData.seller_code,
      phone: savedData.phone,
      email: savedData.email,
      emails: savedData.emails ?? [],
      address: savedData.address,
      fee: savedData.fee,
      country: savedData.country,
      state: savedData.state,
      city: savedData.city,
      createdAt: savedData.createdAt,
      updatedAt: savedData.updatedAt,
    }
  } catch (error: any) {
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'El código de vendedor ya existe' })
    }
    throw error
  }
})

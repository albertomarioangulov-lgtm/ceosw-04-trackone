import { PERMISSIONS } from '~~/shared/permissions'
import { sellerUpdateSchema } from '~~/shared/seller'
import Seller from '~~/server/models/Seller'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.SELLERS_MANAGE)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const result = sellerUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validación de vendedor fallida',
      data: result.error.flatten().fieldErrors,
    })
  }

  try {
    const seller = await Seller.findByIdAndUpdate(id, result.data, { returnDocument: 'after', runValidators: true }).lean()

    if (!seller) {
      throw createError({ statusCode: 404, statusMessage: 'Vendedor no encontrado' })
    }

    return {
      id: seller._id.toString(),
      name: seller.name,
      code: seller.code,
      seller_code: seller.seller_code,
      phone: seller.phone,
      email: seller.email,
      emails: seller.emails ?? [],
      address: seller.address,
      fee: seller.fee,
      country: seller.country,
      state: seller.state,
      city: seller.city,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    }
  } catch (error: any) {
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'El código de vendedor ya existe' })
    }
    throw error
  }
})
